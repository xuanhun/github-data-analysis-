import { sampleSize } from "lodash";
import utils from "../../common/utils";

interface Sponsor {
  // The name of the sponsor
  name: string;
  // The logo of the sponsor and will be displayed in the right side section.
  logo: string;
  // The landing image of the sponsor and will be displayed in the bottom side section.
  landingImage: string;
  // The link of the sponsor.
  link: string;
  // The slogan of the sponsor logo.
  logoSlogan: string;
  // The slogan of the sponsor landing.
  landingSlogan: string;
}

// The list of current sponsors.
const sponsors: Sponsor[] = [
  
  {
    name: "VChart",
    logo: utils.absolutifyLink("/sponsors/VisActor/logo.svg"),
    landingImage: utils.absolutifyLink("/sponsors/VisActor/landing.webp"),
    link: "https://www.visactor.com/vchart",
    logoSlogan:
      "VChart: Out-of-the-box multi-terminal charting library.",
    landingSlogan:
      "Out-of-the-box multi-terminal charting library.",
  },
  {
    name: "VChart",
    logo: utils.absolutifyLink("/sponsors/VisActor/logo.svg"),
    landingImage: utils.absolutifyLink("/sponsors/VisActor/landing.webp"),
    link: "https://www.visactor.com/vtable",
    logoSlogan:
      "VTable: Automated multi-dimensional data analysis and presentation tool.",
    landingSlogan:
      "Automated multi-dimensional data analysis and presentation tool.",
  },
  {
    name: "VMind",
    logo: utils.absolutifyLink("/sponsors/VisActor/logo.svg"),
    landingImage: utils.absolutifyLink("/sponsors/VisActor/landing.webp"),
    link: "https://www.visactor.com/vmind",
    logoSlogan:
      "VMind: AI-driven data analysis and visualization tool.",
    landingSlogan:
      "AI-driven data analysis and visualization tool.",
  },
];

export const randomSponsors = sampleSize(sponsors, sponsors.length);
