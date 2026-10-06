const { useState, useEffect, useRef, useCallback } = React;

/* ---------------------------------------------------------- */
/* Navegación                                                  */
/* ---------------------------------------------------------- */
function Nav() {
  return (
    <nav className="sticky top-0 z-40 flex items-center justify-between px-5 sm:px-10 py-4 bg-paper/85 backdrop-blur-sm border-b border-ink/10">
      <span className="font-script text-2xl text-ink">M &amp; C</span>
      <div className="flex items-center gap-4 sm:gap-8 text-sm">
        <a href="#subir" className="text-ink/70 hover:text-ink transition-colors">Subir fotos</a>
        <a
          href="galeria.html"
          className="bg-ink text-paper px-4 py-2 rounded-full font-medium hover:bg-ink/85 transition-colors"
        >
          Ver álbum
        </a>
      </div>
    </nav>
  );
}

/* ---------------------------------------------------------- */
/* Hero                                                         */
/* ---------------------------------------------------------- */
function Hero() {
  return (
    <header className="group relative min-h-[88vh] flex flex-col items-center justify-center text-center px-6 pt-20 pb-16 overflow-hidden">
      {/* Foto de fondo: apenas visible, se revela al pasar el cursor.*/}
      <img
        src="img/background-1.jpeg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center
                   opacity-25 sm:opacity-50 grayscale-[45%] scale-105
                   transition-all duration-700 ease-out
                   group-hover:opacity-90 group-hover:grayscale-0 group-hover:scale-100"
      />
      {/* Velo de papel siempre presente para que el texto sea legible en ambos estados */}
      <div className="absolute inset-0 bg-gradient-to-b from-paper/85 via-paper/60 to-paper/90 pointer-events-none transition-opacity duration-700 group-hover:opacity-60" />

      <svg
        className="absolute inset-0 w-full h-full text-ink/[0.06] pointer-events-none"
        viewBox="0 0 800 800"
        fill="none"
      >
        <path d="M400 40 C 380 200, 420 300, 400 460 C 385 560, 410 650, 400 760" stroke="currentColor" strokeWidth="1.5" />
        <path d="M400 140 C 340 120, 300 90, 260 70" stroke="currentColor" strokeWidth="1.2" />
        <path d="M400 140 C 460 120, 500 90, 540 70" stroke="currentColor" strokeWidth="1.2" />
        <path d="M398 260 C 330 250, 280 270, 230 250" stroke="currentColor" strokeWidth="1.2" />
        <path d="M402 260 C 470 250, 520 270, 570 250" stroke="currentColor" strokeWidth="1.2" />
        <path d="M400 400 C 330 400, 280 430, 235 420" stroke="currentColor" strokeWidth="1.2" />
        <path d="M400 400 C 470 400, 520 430, 565 420" stroke="currentColor" strokeWidth="1.2" />
      </svg>

      <div className="relative z-10 max-w-2xl animate-[fadeUp_1s_ease_both]">
        <p className="text-xs tracking-[0.35em] uppercase text-gold font-medium">Nos casamos</p>
        <h1 className="font-script text-[4.2rem] sm:text-[6.5rem] leading-[0.9] text-ink mt-4">
          Michael <span className="text-gold">&amp;</span> Camila
        </h1>

        <Flourish className="w-40 h-4 mx-auto text-gold/70 mt-6" />

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mt-6 text-sm text-ink/75">
          <span className="inline-flex items-center gap-2">
            <IconCalendar className="w-4 h-4 text-gold" />
            10 de octubre de 2026
          </span>
          <span className="inline-flex items-center gap-2">
            <IconPin className="w-4 h-4 text-gold" />
            Chucuni, Ibagué
          </span>
          <span className="inline-flex items-center gap-2">
            <IconClock className="w-4 h-4 text-gold" />
            18:00 h
          </span>
        </div>
      </div>

      <a
        href="#subir"
        className="relative z-10 mt-14 inline-flex flex-col items-center gap-2 text-[0.7rem] tracking-[0.25em] uppercase text-ink/60 hover:text-ink transition-colors"
      >
        Comparte tus fotos
        <IconArrowDown className="w-4 h-4 animate-bounce" />
      </a>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform: translateY(14px);} to { opacity:1; transform: translateY(0);} }
      `}</style>
    </header>
  );
}

/* ---------------------------------------------------------- */
/* Sección QR                                                   */
/* ---------------------------------------------------------- */
function QrSection() {
  const [qrUrl, setQrUrl] = useState("");

  useEffect(() => {
    const destino = window.location.href.split("#")[0];
    setQrUrl(
      `https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=8&color=2B362A&bgcolor=EEE7D4&data=${encodeURIComponent(
        destino
      )}`
    );
  }, []);

  const pasos = [
    "Escanea el código QR con la cámara de tu teléfono.",
    "Elige una o varias fotos, o haz una al momento.",
    "Añade una etiqueta (ceremonia, fiesta, fotomatón…).",
    "Tus fotos se suman al álbum de la boda.",
  ];

  return (
    <section className="max-w-3xl mx-auto px-6 py-20">
      <SectionHead
        eyebrow="Álbum colaborativo"
        title="Un recuerdo hecho entre todos"
        text="Durante la boda, escanea el código para abrir esta misma página desde tu móvil y subir tus fotos al instante."
      />


      <div className="grid sm:grid-cols-[auto_1fr] gap-10 items-center bg-paperdeep border border-ink/10 rounded-2xl p-8 sm:p-10 shadow-[0_20px_50px_-20px_rgba(43,54,42,0.35)]">
        
        <img
          src="img/img-qr.jpeg"
          className=" inset-0 w-[368px] h-[368px] object-cover object-center rounded"
        />
        
        <div className="mx-auto sm:mx-0 w-[184px] h-[184px] bg-paper rounded-xl p-2 flex items-center justify-center border border-ink/10">
          {qrUrl ? (
            <img src={qrUrl} alt="Código QR para subir fotos" className="rounded" />
          ) : (
            <div className="w-full h-full animate-pulse bg-ink/5 rounded" />
          )}
        </div>

        <ol className="space-y-4">
          {pasos.map((paso, i) => (
            <li key={i} className="flex gap-4 items-baseline text-sm text-ink/75">
              <span className="font-script text-2xl text-gold shrink-0 w-6">{`0${i + 1}`}</span>
              {paso}
            </li>
          ))}
        </ol>
        
      </div>
        
      
    </section>
  );
}

/* ---------------------------------------------------------- */
/* Encabezado de sección reutilizable                           */
/* ---------------------------------------------------------- */
function SectionHead({ eyebrow, title, text }) {
  return (
    <div className="text-center max-w-lg mx-auto mb-12">
      <p className="text-xs tracking-[0.3em] uppercase text-gold font-medium">{eyebrow}</p>
      <h2 className="font-script text-5xl text-ink mt-3 mb-4">{title}</h2>
      <p className="text-sm text-ink/65">{text}</p>
    </div>
  );
}

/* ---------------------------------------------------------- */
/* Formulario de subida                                         */
/* ---------------------------------------------------------- */
const ETIQUETAS_SUGERIDAS = ["Ceremonia", "Fiesta", "Fotomatón", "Familia", "Amigos"];

function UploadForm() {
  const [archivos, setArchivos] = useState([]); // { file, url }
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [autor, setAutor] = useState("");
  const [estado, setEstado] = useState({ tipo: "", texto: "" });
  const [enviando, setEnviando] = useState(false);
  const [arrastrando, setArrastrando] = useState(false);
  const fileInputRef = useRef(null);

  const agregarArchivos = useCallback((lista) => {
    const nuevos = Array.from(lista)
      .filter((f) => f.type.startsWith("image/"))
      .map((file) => ({ file, url: URL.createObjectURL(file) }));
    setArchivos((prev) => [...prev, ...nuevos]);
  }, []);

  function quitarArchivo(idx) {
    setArchivos((prev) => prev.filter((_, i) => i !== idx));
  }

  function toggleTagSugerida(tag) {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function agregarTagLibre(e) {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const limpio = tagInput.trim();
    if (!limpio) return;
    setTags((prev) =>
      prev.some((t) => t.toLowerCase() === limpio.toLowerCase()) ? prev : [...prev, limpio]
    );
    setTagInput("");
  }

  function quitarTag(tag) {
    setTags((prev) => prev.filter((t) => t !== tag));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (archivos.length === 0) return;

    setEnviando(true);
    setEstado({ tipo: "", texto: "Guardando fotos…" });

    try {
      for (const { file } of archivos) {
        await WeddingStorage.addPhoto(file, tags, autor.trim());
      }
      setEstado({
        tipo: "ok",
        texto: `¡Listo! ${archivos.length} foto(s) añadidas al álbum. Gracias 💛`,
      });
      setArchivos([]);
      setTags([]);
      setAutor("");
    } catch (err) {
      console.error(err);
      setEstado({ tipo: "error", texto: "Algo ha ido mal al guardar tus fotos. Inténtalo de nuevo." });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section id="subir" className="max-w-2xl mx-auto px-6 py-20">
      <SectionHead
        eyebrow="Tu recuerdo"
        title="Sube tus fotos"
        text="Añade tantas fotos como quieras y ponles una etiqueta para que sean fáciles de encontrar en el álbum."
      />

      <form
        onSubmit={handleSubmit}
        className="bg-paperdeep border border-ink/10 rounded-2xl p-6 sm:p-10 shadow-[0_20px_50px_-20px_rgba(43,54,42,0.35)]"
      >
        {/* Dropzone */}
        <label
          onDragOver={(e) => { e.preventDefault(); setArrastrando(true); }}
          onDragLeave={() => setArrastrando(false)}
          onDrop={(e) => {
            e.preventDefault();
            setArrastrando(false);
            if (e.dataTransfer.files.length) agregarArchivos(e.dataTransfer.files);
          }}
          className={`block text-center rounded-xl border-[1.5px] border-dashed cursor-pointer transition-colors px-6 py-10
            ${arrastrando ? "border-gold bg-gold/10" : "border-gold/50 hover:border-gold hover:bg-gold/5"}`}
        >
          <IconUpload className="w-8 h-8 mx-auto text-gold mb-3" />
          <p className="text-ink font-medium">Toca para elegir fotos</p>
          <p className="text-ink/55 text-sm mt-1">o haz una foto al momento · JPG, PNG</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            multiple
            hidden
            onChange={(e) => agregarArchivos(e.target.files)}
          />
        </label>

        {/* Previsualización */}
        {archivos.length > 0 && (
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mt-5">
            {archivos.map((a, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-ink/10">
                <img src={a.url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => quitarArchivo(i)}
                  aria-label="Quitar foto"
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-ink/70 text-paper grid place-items-center"
                >
                  <IconClose className="w-2.5 h-2.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Etiquetas */}
        <div className="mt-8">
          <label className="block text-xs tracking-[0.1em] uppercase text-gold font-medium mb-3">
            Etiquetas
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {ETIQUETAS_SUGERIDAS.map((tag) => (
              <button
                type="button"
                key={tag}
                onClick={() => toggleTagSugerida(tag)}
                className={`px-3.5 py-1.5 rounded-full text-sm border transition-colors
                  ${tags.includes(tag)
                    ? "bg-ink text-paper border-ink"
                    : "border-gold/50 text-ink/70 hover:bg-gold/10"}`}
              >
                {tag}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={agregarTagLibre}
            placeholder="Escribe una etiqueta y pulsa Enter…"
            className="w-full bg-paper border border-ink/15 rounded-lg px-4 py-2.5 text-sm text-ink placeholder:text-ink/35 focus:outline-none focus:border-gold"
          />
          {tags.filter((t) => !ETIQUETAS_SUGERIDAS.includes(t)).length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {tags
                .filter((t) => !ETIQUETAS_SUGERIDAS.includes(t))
                .map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1.5 bg-gold/15 text-ink px-3 py-1 rounded-full text-sm">
                    {tag}
                    <button type="button" onClick={() => quitarTag(tag)} aria-label={`Quitar ${tag}`}>
                      <IconClose className="w-2.5 h-2.5" />
                    </button>
                  </span>
                ))}
            </div>
          )}
        </div>

        {/* Autor */}
        <div className="mt-6">
          <label className="block text-xs tracking-[0.1em] uppercase text-gold font-medium mb-3">
            Tu nombre <span className="normal-case tracking-normal text-ink/40">(opcional)</span>
          </label>
          <input
            type="text"
            value={autor}
            onChange={(e) => setAutor(e.target.value)}
            placeholder="¿Quién comparte estas fotos?"
            className="w-full bg-paper border border-ink/15 rounded-lg px-4 py-2.5 text-sm text-ink placeholder:text-ink/35 focus:outline-none focus:border-gold"
          />
        </div>

        <button
          type="submit"
          disabled={archivos.length === 0 || enviando}
          className="w-full mt-8 bg-ink text-paper font-medium py-3.5 rounded-full hover:bg-ink/85 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {enviando ? "Guardando…" : "Guardar en el álbum"}
        </button>

        {estado.texto && (
          <p
            className={`text-center text-sm mt-4 ${
              estado.tipo === "ok" ? "text-ink" : estado.tipo === "error" ? "text-red-700" : "text-ink/60"
            }`}
          >
            {estado.texto}
          </p>
        )}
      </form>
    </section>
  );
}

/* ---------------------------------------------------------- */
/* Footer                                                        */
/* ---------------------------------------------------------- */
function Footer() {
  return (
    <footer className="text-center px-6 pt-8 pb-16 text-ink/60 text-sm">
      <p className="font-script text-3xl text-ink mb-2">Camila &amp; Michael</p>
      Gracias por acompañarnos y guardar este día con nosotros.
      <br />
      <a href="galeria.html" className="text-gold hover:text-ink transition-colors">
        Ver el álbum completo →
      </a>
    </footer>
  );
}

/* ---------------------------------------------------------- */
/* App                                                           */
/* ---------------------------------------------------------- */
function App() {
  return (
    <>
      <Nav />
      <Hero />
      <QrSection />
      <UploadForm />
      <Footer />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
