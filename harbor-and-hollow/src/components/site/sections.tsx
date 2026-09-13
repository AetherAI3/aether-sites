/* Post-journey editorial sections. */

import { CedarBranch, NeroliBlossom, WaterRipple } from "./icons";

export function ScentLayers() {
  return (
    <section className="hh-section hh-scent" id="scent">
      <div className="hh-wrap">
        <h2 className="hh-section__title">The scent, layer by layer.</h2>
        <div className="hh-scent__rows">
          <div className="hh-scent__row">
            <p className="hh-scent__stage">
              <NeroliBlossom /> Opening
            </p>
            <p className="hh-scent__note">Neroli</p>
            <p className="hh-scent__desc">
              Bright, clean, faintly citrus. The first thing you notice, and
              the first to lift away.
            </p>
          </div>
          <div className="hh-scent__row">
            <p className="hh-scent__stage">
              <WaterRipple /> Heart
            </p>
            <p className="hh-scent__note">Coastal air</p>
            <p className="hh-scent__desc">
              Salt, fog, and cold water minerality. The space the whole scent
              lives in.
            </p>
          </div>
          <div className="hh-scent__row">
            <p className="hh-scent__stage">
              <CedarBranch /> Base
            </p>
            <p className="hh-scent__note">Cedarwood &amp; balsam</p>
            <p className="hh-scent__desc">
              Dry docks and green resin. What stays on your hands after the
              water runs clear.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Ritual() {
  return (
    <section className="hh-section hh-ritual" id="ritual">
      <div className="hh-wrap hh-ritual__grid">
        <figure className="hh-ritual__figure">
          <img
            alt="The black pump pressed once, a ribbon of wash falling into an open hand"
            data-parallax=""
            loading="lazy"
            src="/harbor-and-hollow/assets/pump-macro.webp"
          />
        </figure>
        <div>
          <h2 className="hh-section__title">Ten quiet seconds.</h2>
          <p className="hh-ritual__lede">
            A hand wash is the smallest ritual a home has. Cedar Wharf makes it
            one worth keeping: a low, kind lather that carries cedar first and
            leaves quietly.
          </p>
          <ul className="hh-ritual__steps">
            <li>
              <span>Press once</span>
              <span>into damp hands, straight from the pump.</span>
            </li>
            <li>
              <span>Lather slow</span>
              <span>while the cedar settles in around the neroli.</span>
            </li>
            <li>
              <span>Rinse cool</span>
              <span>and the balsam stays behind, faint and warm.</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export function Story() {
  return (
    <section className="hh-story" id="story">
      <div className="hh-story__media">
        <img
          alt="Cedarwood shavings, neroli blossoms, balsam needles and a wet river stone on ivory"
          data-parallax=""
          loading="lazy"
          src="/harbor-and-hollow/assets/ingredients.webp"
        />
        <div className="hh-story__headline">
          <h2 className="hh-section__title">Rooted in the landscape.</h2>
        </div>
      </div>
      <div className="hh-wrap hh-story__body">
        <p className="hh-story__intro">
          Harbor &amp; Hollow began with a simple idea: the places we remember
          should have a scent. Cedar Wharf draws its character from coastlines,
          dark forests, weathered wood, and the quiet rituals of home.
        </p>
        <ul className="hh-story__ledger">
          <li>
            Atlas cedarwood <em>grounding, dry woods</em>
          </li>
          <li>
            Neroli blossom <em>bright, clean lift</em>
          </li>
          <li>
            Balsam fir resin <em>green depth</em>
          </li>
          <li>
            Concept formulation <em>considered everyday care</em>
          </li>
          <li>
            A coastal point of view <em>the inspiration</em>
          </li>
        </ul>
      </div>
    </section>
  );
}

export function Purchase() {
  return (
    <section className="hh-shop" id="shop">
      <img alt="" aria-hidden="true" className="hh-shop__divider" loading="lazy" src="/harbor-and-hollow/assets/landscape.webp" />
      <div className="hh-section"><div className="hh-wrap hh-shop__grid">
        <figure className="hh-shop__figure"><img alt="Cedar Wharf hand wash concept bottle with Harbor and Hollow label" loading="lazy" src="/harbor-and-hollow/assets/packshot.webp" /></figure>
        <div>
          <h2 className="hh-shop__name">Cedar Wharf</h2>
          <p className="hh-shop__meta">Hand wash concept / Cedarwood / Neroli / Balsam</p>
          <p className="hh-shop__price"><small>A coastal ritual, imagined.</small></p>
          <div className="hh-shop__buy"><a className="hh-cta-shop" href="#scent">Explore the scent</a></div>
          <p className="hh-shop__concept">This is an independent website and product concept. Product details are illustrative; no orders are taken here.</p>
        </div>
      </div></div>
    </section>
  );
}
