import { useEffect, useState } from "react";

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <header className="hh-nav" data-scrolled={scrolled ? "true" : undefined}>
    <a aria-label="Harbor & Hollow, back to the top" className="hh-nav__mark" href="#stone"><img alt="" src="/harbor-and-hollow/assets/mark-64.png" />Harbor &amp; Hollow</a>
    <nav aria-label="Site" className="hh-nav__links">
      <a className="hh-nav__link" data-secondary="" href="#scent">The Scent</a>
      <a className="hh-nav__link" data-secondary="" href="#story">Our Story</a>
      <a className="hh-nav__link" href="#shop">The Bottle</a>
      <a className="hh-nav__link hh-nav__portfolio" href="/">Aether Sites ↗</a>
    </nav>
  </header>;
}
