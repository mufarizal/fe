import { useState, useEffect, useRef } from "react";
import { getStorageUrl } from "../../utils/formatUrl";

const navItems = [
  { id: "home", label: "Home" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "karir", label: "Karir" },
  { id: "pendidikan", label: "Pendidikan" },
  { id: "sertifikat", label: "Sertifikat" },
  { id: "contact", label: "Contact" },
];

export default function Sidebar({ profile }) {
  const [active, setActive] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [brokenFoto, setBrokenFoto] = useState(false);
  const isProgrammaticScroll = useRef(false);
  const scrollTimeout = useRef(null);

  useEffect(() => {
    const sections = navItems
      .map((n) => document.getElementById(n.id))
      .filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        if (isProgrammaticScroll.current) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (id) => (e) => {
    e.preventDefault();
    setMobileOpen(false);

    const target = document.getElementById(id);
    if (!target) return;

    clearTimeout(scrollTimeout.current);
    isProgrammaticScroll.current = true;
    setActive(id);

    target.scrollIntoView({ behavior: "smooth", block: "start" });

    scrollTimeout.current = setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 700);
  };

  const socials = [
    {
      key: "github",
      label: "GitHub",
      href: profile?.github ? `https://${profile.github}` : null,
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      href: profile?.linkedin ? `https://${profile.linkedin}` : null,
    },
    {
      key: "instagram",
      label: "Instagram",
      href: profile?.instagram
        ? `https://instagram.com/${profile.instagram}`
        : null,
    },
  ].filter((s) => s.href);

  return (
    <>
      <aside className="hidden sm:flex fixed left-0 top-0 h-screen w-80 flex-col justify-between border-r border-white/10 px-10 py-12 z-40">
        <div>
          <div className="w-24 h-24 border border-white/20 flex items-center justify-center text-white/30 text-sm mb-6 overflow-hidden">
            {profile?.foto && !brokenFoto ? (
              <img
                src={getStorageUrl(profile.foto)}
                alt={profile.nama}
                className="w-full h-full object-cover"
                onError={() => setBrokenFoto(true)}
                onLoad={() => setBrokenFoto(false)}
              />
            ) : (
              "Foto"
            )}
          </div>
          <h1 className="font-semibold text-2xl mb-2">{profile?.nama}</h1>
          <p className="text-base text-white/50 mb-10">{profile?.profesi}</p>

          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={handleNavClick(item.id)}
                className={`text-base py-2 border-l-2 pl-4 transition-colors ${
                  active === item.id
                    ? "border-white text-white"
                    : "border-white/10 text-white/40 hover:text-white/70 hover:border-white/40"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        {socials.length > 0 && (
          <div className="flex gap-5 text-sm text-white/40">
            {socials.map((s) => (
              <a
                key={s.key}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
              >
                {s.label}
              </a>
            ))}
          </div>
        )}
      </aside>

      <nav className="sm:hidden fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur border-b border-white/10">
        <div className="px-6 py-5 flex items-center justify-between">
          <span className="font-semibold tracking-wide text-base">
            {profile?.nama}
          </span>
          <button
            className="text-white text-2xl"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-white/10 px-6 py-4 flex flex-col gap-3">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={handleNavClick(item.id)}
                className={`text-base py-2 ${active === item.id ? "text-white" : "text-white/50"}`}
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </nav>
    </>
  );
}
