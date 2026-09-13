/* Public design concept: navigation only, with no checkout. */
export function ShopCta({ label = "Explore Cedar Wharf" }: { label?: string }) {
  return <a className="hh-cta-shop" href="#shop">{label}</a>;
}
export function DiscoverCta() {
  return <a className="hh-cta-discover" href="#scent">Discover the scent <span aria-hidden="true" className="hh-cta-discover__arrow">→</span></a>;
}
