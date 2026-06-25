type JsonLdProps = {
  data: Record<string, unknown>;
};

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here; data is fully controlled.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
