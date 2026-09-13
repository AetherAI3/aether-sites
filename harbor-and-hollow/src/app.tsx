import {
  ScrollScrub,
  type ScrollScrubScene,
} from "./components/scroll-scrub/scroll-scrub";
import { DiscoverCta, ShopCta } from "./components/site/ctas";
import { SiteFooter } from "./components/site/footer";
import { SiteNav } from "./components/site/nav";
import {
  Purchase,
  Ritual,
  ScentLayers,
  Story,
} from "./components/site/sections";

/*
 * The dawn walk: stone → wharf → hollow → home → sink.
 * The supplied clips form one continuous coastal journey.
 */
const SCENES: ScrollScrubScene[] = [
  {
    id: "stone",
    label: "Coast",
    poster: "/harbor-and-hollow/assets/world/stone-poster.jpg",
    mobilePoster: "/harbor-and-hollow/assets/world/stone-mobile-poster.jpg",
    clip: "/harbor-and-hollow/assets/world/stone.mp4",
    mobileClip: "/harbor-and-hollow/assets/world/stone-mobile.mp4",
    title: "Keep the coast close.",
    body:
      "Cedarwood, neroli, and balsam bring salt air and dark timber to an everyday wash.",
    kicker: "01 / The Coast",
    actions: (
      <>
        <ShopCta />
        <DiscoverCta />
      </>
    ),
    align: "left",
    position: "left-top",
    tone: "dark",
    scroll: 1.35,
    objectPosition: "60% 50%",
    mobileObjectPosition: "62% 50%",
  },
  {
    id: "wharf",
    label: "Wharf",
    poster: "/harbor-and-hollow/assets/world/wharf-poster.jpg",
    mobilePoster: "/harbor-and-hollow/assets/world/wharf-mobile-poster.jpg",
    clip: "/harbor-and-hollow/assets/world/wharf.mp4",
    mobileClip: "/harbor-and-hollow/assets/world/wharf-mobile.mp4",
    title: "Where timber meets tide.",
    body:
      "Weathered cedar and cool mineral air open the scent with the clarity of the shoreline.",
    kicker: "02 / The Wharf",
    align: "left",
    position: "left-top",
    tone: "dark",
    scroll: 1.3,
    objectPosition: "50% 50%",
  },
  {
    id: "hollow",
    label: "Hollow",
    poster: "/harbor-and-hollow/assets/world/hollow-poster.jpg",
    mobilePoster: "/harbor-and-hollow/assets/world/hollow-mobile-poster.jpg",
    clip: "/harbor-and-hollow/assets/world/hollow.mp4",
    mobileClip: "/harbor-and-hollow/assets/world/hollow-mobile.mp4",
    title: "The woods settle in.",
    body:
      "Green balsam settles beneath dry cedar, while neroli lifts the blend with quiet light.",
    kicker: "03 / The Hollow",
    align: "left",
    position: "left-top",
    tone: "dark",
    scroll: 1.3,
    objectPosition: "50% 45%",
  },
  {
    id: "home",
    label: "Home",
    poster: "/harbor-and-hollow/assets/world/home-poster.jpg",
    mobilePoster: "/harbor-and-hollow/assets/world/home-mobile-poster.jpg",
    clip: "/harbor-and-hollow/assets/world/home.mp4",
    mobileClip: "/harbor-and-hollow/assets/world/home-mobile.mp4",
    title: "Bring the shoreline home.",
    body:
      "Plant-derived cleansers and small-batch care turn an everyday wash into a considered ritual.",
    kicker: "04 / The Home",
    align: "left",
    position: "left-top",
    tone: "light",
    scroll: 1.4,
    objectPosition: "55% 45%",
    mobileObjectPosition: "58% 45%",
  },
  {
    id: "sink",
    label: "Ritual",
    poster: "/harbor-and-hollow/assets/world/sink-poster.jpg",
    title: "Ten quiet seconds.",
    body:
      "Press once. Lather slowly. Let cedar, citrus, and balsam settle on the hands.",
    kicker: "05 / The Ritual",
    actions: <ShopCta label="Explore Cedar Wharf" />,
    align: "left",
    position: "left-top",
    tone: "dark",
    scroll: 0.95,
    objectPosition: "60% 50%",
    mobileObjectPosition: "60% 50%",
  },
];

const JOURNEY_THEME = {
  accent: "#c8a96b",
  background: "#f7f4ed",
  ink: "#101815",
  muted: "#56605a",
};

export function App() {
  return (
    <div className="hh-page">
      <SiteNav />
      <main>
        <ScrollScrub scenes={SCENES} theme={JOURNEY_THEME} />
        <ScentLayers />
        <Ritual />
        <Story />
        <Purchase />
      </main>
      <SiteFooter />
    </div>
  );
}
