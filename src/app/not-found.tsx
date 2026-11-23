import type { Metadata } from "next";
import { StudioNotFound } from "@/components/misc";

export const metadata: Metadata = {
  title: "Seite nicht gefunden",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <StudioNotFound />;
}
