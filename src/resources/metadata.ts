export const siteName = "Erik EvgLab";

export const defaultOgImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Erik EvgLab – Websites mit Charakter, die Kunden bringen.",
} as const;

export const aboutOgImage = {
  url: "/images/about/erik.png",
  width: 800,
  height: 1000,
  alt: "Erik von Gregory – Gründer von EvgLab",
} as const;

type PageOpenGraphOptions = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "profile";
  image?: typeof defaultOgImage | typeof aboutOgImage;
};

export function createPageOpenGraph({
  title,
  description,
  path,
  type = "website",
  image = defaultOgImage,
}: PageOpenGraphOptions) {
  const pageTitle = `${title} · ${siteName}`;

  return {
    title: pageTitle,
    description,
    url: path,
    siteName,
    locale: "de_DE" as const,
    type,
    images: [image],
  };
}

export function createPageTwitter(
  title: string,
  description: string,
  image: typeof defaultOgImage | typeof aboutOgImage = defaultOgImage,
) {
  return {
    card: "summary_large_image" as const,
    title: `${title} · ${siteName}`,
    description,
    images: [image.url],
  };
}
