import { useState, useEffect, useRef } from "react";

const navItems = [
  { id: "home", label: "Home" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "karir", label: "Karir" },
  { id: "pendidikan", label: "Pendidikan" },
  { id: "sertifikat", label: "Sertifikat" },
  { id: "contact", label: "Contact" },
];

export default function Navbar({ nama }) {
  const [active, setActive] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const navRefs = useRef({});
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

  useEffect(() => {
    const el = navRefs.current[active];
    if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
  }, [active]);

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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur border-b border-white/10">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <span className="font-semibold tracking-wide">{nama}</span>

        <div className="relative hidden sm:flex gap-1">
          <span
            className="absolute top-0 h-full bg-white/10 rounded transition-all duration-300 ease-out"
            style={{ left: indicator.left, width: indicator.width }}
          />
          {navItems.map((item) => (
            <a
              key={item.id}
              ref={(el) => (navRefs.current[item.id] = el)}
              href={`#${item.id}`}
              onClick={handleNavClick(item.id)}
              className={`relative z-10 px-3 py-1.5 text-sm rounded transition-colors ${
                active === item.id
                  ? "text-white"
                  : "text-white/50 hover:text-white"
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>

        <button
          className="sm:hidden text-white text-xl"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {mobileOpen && (
        <div className="sm:hidden border-t border-white/10 px-6 py-3 flex flex-col gap-2">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={handleNavClick(item.id)}
              className={`text-sm py-1.5 ${active === item.id ? "text-white" : "text-white/50"}`}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
