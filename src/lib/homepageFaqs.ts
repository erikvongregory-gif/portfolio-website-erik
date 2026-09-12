export type FaqItem = {
  question: string;
  answer: string;
};

export const homepageFaqs: FaqItem[] = [
  {
    question: "Was bedeutet „kostenloser Entwurf“?",
    answer:
      "Du bekommst vor der Beauftragung einen echten Design-Entwurf für deine Website – kein Mockup von der Stange. So siehst du, wie das Ergebnis aussehen kann, bevor du dich entscheidest.",
  },
  {
    question: "Was kostet eine Website bei EvGlab?",
    answer:
      "Richtpreise: komplette Website ab 2.500 €, Landingpage ab 1.500 €, Betreuung ab 99 € monatlich. Den genauen Festpreis klären wir im Erstgespräch – transparent und schriftlich.",
  },
  {
    question: "Wie lange dauert ein typisches Projekt?",
    answer:
      "Viele Landingpages und kompakte Auftritte sind in etwa sieben Tagen live. Größere Websites brauchen je nach Umfang etwas länger – den Zeitplan legen wir vorher fest.",
  },
  {
    question: "Kann ich Texte und Bilder später selbst ändern?",
    answer:
      "Ja. Du bekommst eine kurze Einweisung und kannst Inhalte selbst pflegen. Der Code gehört dir – ohne Abo-Zwang nach dem Launch.",
  },
  {
    question: "Arbeitest du auch remote oder nur vor Ort?",
    answer:
      "Beides. Viele Projekte laufen komplett remote. Für Kundinnen und Kunden aus Landsberg am Lech und Umgebung sind persönliche Treffen natürlich auch möglich.",
  },
  {
    question: "Was passiert nach dem Go-Live?",
    answer:
      "Deine Website läuft auf deiner Domain. Auf Wunsch kümmere ich mich monatlich um Updates, kleine Änderungen und technische Sicherheit – oder du betreibst alles selbst.",
  },
];

export function buildHomeFaqStructuredData(baseURL: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${baseURL}/#faq`,
    mainEntity: homepageFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
