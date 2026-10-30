/** Schlanke Linkliste für den Footer – bewusst getrennt von den Seitentexten (Client-Bundle). */
export type SeoNavLink = { label: string; href: string };

export const leistungLinks: SeoNavLink[] = [
  { label: "Landingpage erstellen", href: "/landingpage-erstellen-lassen" },
  { label: "Website-Relaunch", href: "/website-relaunch" },
  { label: "Website-Betreuung", href: "/website-betreuung" },
  { label: "Next.js Webdesigner", href: "/nextjs-webdesigner" },
];

export const brancheLinks: SeoNavLink[] = [
  { label: "Handwerker", href: "/webdesign-fuer-handwerker" },
  { label: "Gastronomie", href: "/webdesign-fuer-gastronomie" },
  { label: "Friseure", href: "/webdesign-fuer-friseure" },
  { label: "Arztpraxen", href: "/webdesign-fuer-arztpraxen" },
  { label: "Immobilienmakler", href: "/webdesign-fuer-immobilienmakler" },
  { label: "Steuerberater", href: "/webdesign-fuer-steuerberater" },
  { label: "Rechtsanwälte", href: "/webdesign-fuer-rechtsanwaelte" },
  { label: "Fitnessstudios", href: "/webdesign-fuer-fitnessstudios" },
  { label: "Brauereien", href: "/webdesign-fuer-brauereien" },
  { label: "Ingenieurbüros", href: "/webdesign-fuer-ingenieurbueros" },
];

export const regionLinks: SeoNavLink[] = [
  { label: "Landsberg am Lech", href: "/webdesign-landsberg" },
  { label: "München", href: "/webdesign-muenchen" },
  { label: "Augsburg", href: "/webdesign-augsburg" },
  { label: "Kaufbeuren", href: "/webdesign-kaufbeuren" },
  { label: "Schongau", href: "/webdesign-schongau" },
  { label: "Weilheim", href: "/webdesign-weilheim" },
  { label: "Starnberg", href: "/webdesign-starnberg" },
  { label: "Fürstenfeldbruck", href: "/webdesign-fuerstenfeldbruck" },
  { label: "Ammersee", href: "/webdesign-ammersee" },
  { label: "Kempten", href: "/webdesign-kempten" },
  { label: "Memmingen", href: "/webdesign-memmingen" },
];
