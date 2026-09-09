import { JsonLd } from "@/components/JsonLd";
import { buildHomeFaqStructuredData, homepageFaqs } from "@/lib/homepageFaqs";
import { baseURL } from "@/resources";
import { Faq } from "./Faq";

export function FaqSection() {
  return (
    <>
      <JsonLd data={buildHomeFaqStructuredData(baseURL)} />
      <Faq items={homepageFaqs} />
    </>
  );
}
