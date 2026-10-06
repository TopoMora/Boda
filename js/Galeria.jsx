const { useState, useEffect, useMemo } = React;

function Nav() {
  return (
    <nav className="sticky top-0 z-40 flex items-center justify-between px-5 sm:px-10 py-4 bg-paper/85 backdrop-blur-sm border-b border-ink/10">
      <span className="font-script text-2xl text-ink">M &amp; C</span>
      <div className="flex items-center gap-4 sm:gap-8 text-sm">
        <a href="index.html" className="text-ink/70 hover:text-ink transition-colors">Portada</a>
        <a
          href="index.html#subir"
          className="bg-ink text-paper px-4 py-2 rounded-full font-medium hover:bg-ink/85 transition-colors"
        >
          Subir fotos
        </a>
      </div>
    </nav>
  );
}

function FilterBar({ tags, activo, onChange }) {
  return (
    <div className="sticky top-[61px] z-30 flex flex-wrap gap-2 justify-center px-5 py-4 bg-paper/90 backdrop-blur-sm border-b border-ink/10">
      <button
        onClick={() => onChange("__todas__")}
        className={`px-3.5 py-1.5 rounded-full text-sm border transition-colors ${
          activo === "__todas__" ? "bg-ink text-paper border-ink" : "border-gold/50 text-ink/70 hover:bg-gold/10"
        }`}
      >
        Todas
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onChange(tag)}
          className={`px-3.5 py-1.5 rounded-full text-sm border transition-colors ${
            activo === tag ? "bg-ink text-paper border-ink" : "border-gold/50 text-ink/70 hover:bg-gold/10"
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}

function PhotoCard({ foto, onDelete, onOpen }) {
  const fecha = useMemo(
    () =>
      new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(
        new Date(foto.fecha)
      ),
    [foto.fecha]
  );

  return (
    <div className="group relative rounded-xl overflow-hidden border border-ink/10 bg-paperdeep">
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(foto); }}
        aria-label="Eliminar foto"
        className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-ink/70 text-paper grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <IconClose className="w-3 h-3" />
      </button>
      <img
        src={foto.url}
        alt="Foto de la boda"
        loading="lazy"
        onClick={() => onOpen(foto.url)}
        className="w-full cursor-zoom-in transition-transform duration-500 group-hover:scale-[1.03]"
      />
      <div className="px-3 py-2.5">
        <div className="flex flex-wrap gap-1.5 mb-1">
          {(foto.tags || []).map((t) => (
            <span key={t} className="text-[0.65rem] uppercase tracking-wide text-gold border border-gold/40 rounded-full px-2 py-0.5">
              {t}
            </span>
          ))}
        </div>
        <p className="text-xs text-ink/50">
          {fecha}
          {foto.autor ? ` · ${foto.autor}` : ""}
        </p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-24 px-6 text-ink/60">
      <IconPhoto className="w-11 h-11 mx-auto text-gold mb-5" />
      <h3 className="font-script text-4xl text-ink mb-2">Todavía no hay fotos</h3>
      <p className="text-sm">Anima a la gente a escanear el código QR de la portada para empezar el álbum.</p>
    </div>
  );
}

function Lightbox({ src, onClose }) {
  if (!src) return null;
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-ink/90 flex items-center justify-center p-8"
    >
      <button
        onClick={onClose}
        aria-label="Cerrar"
        className="absolute top-6 right-6 w-11 h-11 rounded-full border border-paper/30 bg-paper/10 text-paper grid place-items-center"
      >
        <IconClose className="w-4 h-4" />
      </button>
      <img src={src} alt="" className="max-w-[90vw] max-h-[85vh] rounded-lg shadow-2xl" />
    </div>
  );
}

function App() {
  const [fotos, setFotos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [activo, setActivo] = useState("__todas__");
  const [lightboxSrc, setLightboxSrc] = useState(null);

  useEffect(() => {
    const unsubscribe = WeddingStorage.onPhotosChange((data) => {
      setFotos(data);
      setCargando(false);
    });
    const onEsc = (e) => e.key === "Escape" && setLightboxSrc(null);
    document.addEventListener("keydown", onEsc);
    return () => {
      unsubscribe();
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  const tags = useMemo(() => {
    const set = new Set();
    fotos.forEach((f) => (f.tags || []).forEach((t) => set.add(t)));
    return Array.from(set).sort((a, b) => a.localeCompare(b, "es"));
  }, [fotos]);

  async function eliminar(foto) {
    if (!confirm("¿Eliminar esta foto del álbum?")) return;
    await WeddingStorage.deletePhoto(foto.id, foto.driveId);
    // No hace falta recargar a mano: onPhotosChange actualiza solo.
  }

  const visibles = activo === "__todas__" ? fotos : fotos.filter((f) => (f.tags || []).includes(activo));

  return (
    <>
      <Nav />

      <div className="text-center pt-12 px-6">
        <p className="text-xs tracking-[0.3em] uppercase text-gold font-medium">El álbum de todos</p>
        <h1 className="font-script text-6xl text-ink mt-2">Nuestros recuerdos</h1>
        <p className="text-sm text-ink/60 max-w-md mx-auto mt-3">
          Todas las fotos compartidas por los invitados, clasificadas por las etiquetas que ellos mismos han añadido.
        </p>
      </div>

      <FilterBar tags={tags} activo={activo} onChange={setActivo} />

      <div className="max-w-6xl mx-auto px-5 py-10">
        {cargando ? (
          <p className="text-center text-ink/50 py-20 text-sm">Cargando álbum…</p>
        ) : visibles.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="masonry">
            {visibles.map((foto) => (
              <PhotoCard key={foto.id} foto={foto} onDelete={eliminar} onOpen={setLightboxSrc} />
            ))}
          </div>
        )}
      </div>

      <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
