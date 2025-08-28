import React from "react";

// Use Emoji flags for simplicity, or replace with SVGs if desired.
const languageData = [
  { name: "Spanish", flag: "🇪🇸" },
  { name: "French", flag: "🇫🇷" },
  { name: "German", flag: "🇩🇪" },
  { name: "Italian", flag: "🇮🇹" },
  { name: "Chinese", flag: "🇨🇳" },
  { name: "Japanese", flag: "🇯🇵" },
  { name: "Korean", flag: "🇰🇷" },
  { name: "Russian", flag: "🇷🇺" },
  // More? Add { name: "...", flag: "..." }
];

function LanguageCard({ lang, flag, delay = 0 }) {
  return (
    <div
      className={`
        group relative flex flex-col items-center justify-center
        rounded-2xl border-2 border-[#26647e]/60 shadow-lg
        bg-white/60 backdrop-blur-lg
        transition-all duration-300 ease-in-out
        hover:scale-105 hover:border-[#53b7e2] hover:bg-gradient-to-br
        hover:from-[#26647e]/90 hover:to-sky-200
        hover:shadow-2xl
        cursor-pointer
        overflow-hidden
      `}
      style={{
        animation: "fadeInUp 0.8s cubic-bezier(.39,.575,.565,1) forwards",
        animationDelay: `${delay}s`,
        opacity: 0,
      }}
    >
      <span className="text-4xl mb-2 drop-shadow">{flag}</span>
      <span className="text-xl md:text-2xl font-semibold text-[#26647e] group-hover:text-white transition select-none">
        {lang}
      </span>
      {/* Sparkle effect */}
      <span className="absolute -top-2 -right-2 pointer-events-none">
        <svg className="w-6 h-6 opacity-0 group-hover:opacity-100 transition" fill="none" viewBox="0 0 20 20">
          <path d="M10 2v4M10 14v4M2 10h4M14 10h4M4.93 4.93l2.83 2.83M12.24 12.24l2.83 2.83M4.93 15.07l2.83-2.83M12.24 7.76l2.83-2.83"
            stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </span>
      {/* Glass shine */}
      <span className="pointer-events-none absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-white/60 to-transparent opacity-0 group-hover:opacity-50 transition-all duration-500 rounded-2xl" />
    </div>
  );
}

export default function LanguagesGrid() {
  // Confetti effect for "many more"
  const confetti = Array.from({ length: 18 }).map((_, i) => ({
    left: `${Math.random() * 100}%`,
    duration: 2.2 + Math.random(),
    delay: Math.random() * 2,
    color: ["#26647e", "#53b7e2", "#ffc107", "#f87171"][i % 4],
    size: `${8 + Math.random() * 8}px`,
  }));

  return (
    <section id="languages" className="bg-sky-50 py-16 md:py-24 lg:py-32 overflow-hidden">
      <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(36px);}
            to { opacity: 1; transform: translateY(0);}
          }
          .languages-gradient {
            background: linear-gradient(90deg, #26647e 0%, #53b7e2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          @keyframes floatEmoji {
            0% { transform: translateY(0);}
            50% { transform: translateY(-10px);}
            100% { transform: translateY(0);}
          }
          @keyframes confetti-float {
            from { opacity: 0; transform: translateY(0); }
            25% { opacity: 1;}
            90% { opacity: 1;}
            to { opacity: 0; transform: translateY(-42px);}
          }
        `}
      </style>
      <div className="container px-4">
        <h2
          className="languages-gradient text-center text-4xl sm:text-5xl md:text-6xl font-extrabold mb-14 tracking-tight animate-on-scroll"
          style={{
            animation: "fadeInUp 1.2s cubic-bezier(.39,.575,.565,1) forwards",
            opacity: 0,
          }}
        >
          Languages You Can Learn
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-12">
          {languageData.map(({ name, flag }, idx) => (
            <LanguageCard key={name} lang={name} flag={flag} delay={0.18 + idx * 0.10} />
          ))}
        </div>
        <div className="relative flex flex-col items-center mt-6 min-h-[80px]">
          {/* Confetti */}
          <span className="absolute left-0 top-0 w-full h-full pointer-events-none select-none z-10">
            {confetti.map((c, i) => (
              <span
                key={i}
                style={{
                  position: "absolute",
                  left: c.left,
                  top: 0,
                  width: c.size,
                  height: c.size,
                  background: c.color,
                  borderRadius: "50%",
                  opacity: 0,
                  animation: `confetti-float ${c.duration}s linear ${c.delay}s infinite`,
                }}
              />
            ))}
          </span>
          <span
            className="inline-flex items-center gap-3 px-7 py-3 rounded-xl bg-white/80 backdrop-blur border-2 border-[#53b7e2] shadow-lg
              text-xl sm:text-2xl md:text-3xl font-semibold languages-gradient"
            style={{
              fontWeight: 700,
              animation: "fadeInUp 1.4s cubic-bezier(.39,.575,.565,1) forwards, floatEmoji 2.8s ease-in-out infinite",
              opacity: 0,
            }}
          >
            <span className="text-2xl sm:text-3xl md:text-4xl animate-[floatEmoji_2.8s_ease-in-out_infinite]">🌍</span>
            And dozens more languages
          </span>
        </div>
      </div>
    </section>
  );
}