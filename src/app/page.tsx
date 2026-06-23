const projekte = [
  {
    titel: "Projekt Eins",
    beschreibung:
      "Eine kurze Beschreibung deines ersten Projekts. Worum geht es und welche Technologien wurden verwendet?",
    tags: ["Next.js", "TypeScript", "Tailwind"],
    link: "#",
  },
  {
    titel: "Projekt Zwei",
    beschreibung:
      "Eine kurze Beschreibung deines zweiten Projekts. Hebe das Besondere oder die größte Herausforderung hervor.",
    tags: ["React", "API", "UI/UX"],
    link: "#",
  },
  {
    titel: "Projekt Drei",
    beschreibung:
      "Eine kurze Beschreibung deines dritten Projekts. Was hast du dabei gelernt oder erreicht?",
    tags: ["Node.js", "Datenbank", "Cloud"],
    link: "#",
  },
];

const skills = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Tailwind CSS",
  "Node.js",
  "Git",
  "HTML & CSS",
];

export default function Home() {
  return (
    <div className="w-full bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-zinc-200/60 bg-zinc-50/80 backdrop-blur dark:border-zinc-800/60 dark:bg-zinc-950/80">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <a href="#" className="text-lg font-semibold tracking-tight">
            Erik<span className="text-indigo-500">.</span>
          </a>
          <div className="hidden gap-8 text-sm font-medium text-zinc-600 dark:text-zinc-400 sm:flex">
            <a href="#ueber-mich" className="transition-colors hover:text-indigo-500">
              Über mich
            </a>
            <a href="#projekte" className="transition-colors hover:text-indigo-500">
              Projekte
            </a>
            <a href="#skills" className="transition-colors hover:text-indigo-500">
              Skills
            </a>
            <a href="#kontakt" className="transition-colors hover:text-indigo-500">
              Kontakt
            </a>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="mx-auto flex max-w-5xl flex-col items-center px-6 py-32 text-center">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Verfügbar für neue Projekte
          </span>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
            Hi, ich bin Erik –{" "}
            <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Web Developer
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
            Ich entwickle moderne, performante Web-Anwendungen mit Fokus auf
            sauberen Code und großartige Nutzererlebnisse.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#projekte"
              className="flex h-12 items-center justify-center rounded-full bg-indigo-600 px-7 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
            >
              Meine Projekte
            </a>
            <a
              href="#kontakt"
              className="flex h-12 items-center justify-center rounded-full border border-zinc-300 px-7 text-sm font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
            >
              Kontakt aufnehmen
            </a>
          </div>
        </div>
      </section>

      {/* Über mich */}
      <section id="ueber-mich" className="mx-auto max-w-5xl px-6 py-24">
        <h2 className="text-3xl font-bold tracking-tight">Über mich</h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
          Hier kannst du etwas über dich erzählen: deinen Werdegang, deine
          Leidenschaft für Technologie und was dich antreibt. Beschreibe, was
          dich als Entwickler ausmacht und welche Art von Projekten dich
          begeistert.
        </p>
      </section>

      {/* Projekte */}
      <section id="projekte" className="mx-auto max-w-5xl px-6 py-24">
        <h2 className="text-3xl font-bold tracking-tight">Projekte</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projekte.map((projekt) => (
            <a
              key={projekt.titel}
              href={projekt.link}
              className="group flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-indigo-700"
            >
              <h3 className="text-xl font-semibold transition-colors group-hover:text-indigo-500">
                {projekt.titel}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {projekt.beschreibung}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {projekt.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="mx-auto max-w-5xl px-6 py-24">
        <h2 className="text-3xl font-bold tracking-tight">Skills</h2>
        <div className="mt-10 flex flex-wrap gap-3">
          {skills.map((skill) => (
            <span
              key={skill}
              className="rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium dark:border-zinc-800 dark:bg-zinc-900"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* Kontakt */}
      <section id="kontakt" className="mx-auto max-w-5xl px-6 py-24">
        <div className="rounded-3xl border border-zinc-200 bg-white p-10 text-center dark:border-zinc-800 dark:bg-zinc-900 sm:p-16">
          <h2 className="text-3xl font-bold tracking-tight">
            Lass uns zusammenarbeiten
          </h2>
          <p className="mx-auto mt-4 max-w-md text-zinc-600 dark:text-zinc-400">
            Du hast ein Projekt im Kopf oder möchtest einfach Hallo sagen?
            Schreib mir gerne.
          </p>
          <a
            href="mailto:deine@email.de"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-indigo-600 px-8 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
          >
            E-Mail schreiben
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-zinc-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Erik. Alle Rechte vorbehalten.</p>
          <div className="flex gap-6">
            <a href="#" className="transition-colors hover:text-indigo-500">
              GitHub
            </a>
            <a href="#" className="transition-colors hover:text-indigo-500">
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
