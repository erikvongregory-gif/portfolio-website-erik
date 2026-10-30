import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeoLandingPage } from "@/components/seo";
import { getSeoPage, seoPages } from "@/lib/seoPages";
import { createPageOpenGraph, createPageTwitter } from "@/resources";

export const dynamicParams = false;

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return seoPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getSeoPage(slug);
  if (!page) return {};

  const path = `/${page.slug}`;
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    keywords: page.keywords,
    alternates: { canonical: path },
    openGraph: createPageOpenGraph({
      title: page.metaTitle,
      description: page.metaDescription,
      path,
    }),
    twitter: createPageTwitter(page.metaTitle, page.metaDescription),
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const page = getSeoPage(slug);
  if (!page) notFound();

  return <SeoLandingPage page={page} />;
}
