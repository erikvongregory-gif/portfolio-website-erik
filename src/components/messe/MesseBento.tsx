"use client";

import { Column, Grid, Heading, Row, Text } from "@once-ui-system/core/components";
import classNames from "classnames";
import { type ReactNode, type RefObject, useEffect, useRef, useState } from "react";
import { RequestTrigger } from "./MesseRequest";
import styles from "./MesseBento.module.scss";

/** Reveals steps 0..max one after another once the element is in view. */
function useSequence(max: number, gap: number): [RefObject<HTMLDivElement | null>, number] {
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(-1);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStep(max);
      return;
    }
    const timers: number[] = [];
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        for (let i = 0; i <= max; i++) timers.push(window.setTimeout(() => setStep(i), i * gap));
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      for (const t of timers) window.clearTimeout(t);
    };
  }, [max, gap]);
  return [ref, step];
}

const Check = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 8.5l3 3 7-7" />
  </svg>
);

const Mark = () => <span className={styles.mark} aria-hidden="true" />;

function Copy({ title, text, children }: { title: string; text: string; children?: ReactNode }) {
  return (
    <Column className={styles.copy} gap="16">
      <Heading as="h3" className={styles.cardTitle}>
        {title}
      </Heading>
      <Text as="p" className={styles.cardText}>
        {text}
      </Text>
      {children && <Row>{children}</Row>}
    </Column>
  );
}

/* ——— A: Project chat ——— */
function ChatStage() {
  const [ref, step] = useSequence(7, 750);
  const on = (n: number) => classNames(styles.step, step >= n && styles.on);
  return (
    <Column ref={ref} className={styles.stage} gap="12" fillWidth aria-hidden="true">
      <Column className={styles.win} fillWidth>
        <Text className={styles.winBar}>Projekt-Chat</Text>
        <Row className={styles.winHead} horizontal="between" vertical="center" gap="12">
          <Column>
            <Text className={styles.channel}>#messe-hannover-2027</Text>
            <Text className={styles.members}>5 Mitglieder</Text>
          </Column>
          <Row className={styles.avatars}>
            {["MK", "JB", "SW", "TL"].map((a) => (
              <span key={a} className={styles.av}>
                {a}
              </span>
            ))}
          </Row>
        </Row>
        <Column className={styles.winBody} gap="16">
          <Row className={on(0)} gap="12">
            <span className={styles.av}>MK</span>
            <Column gap="4">
              <Text className={styles.msgHead}>
                <b>M. Krüger</b> <span>09:41</span>
              </Text>
              <Text className={styles.msgText}>
                Im April stehen wir auf der Hannover Messe. Die neue Anlage ist bis dahin aber nicht fertig.
              </Text>
            </Column>
          </Row>
          <Row className={on(1)} gap="12">
            <span className={styles.av}>JB</span>
            <Column gap="4">
              <Text className={styles.msgHead}>
                <b>J. Brandt</b> <span>09:42</span>
              </Text>
              <Text className={styles.msgText}>Wir haben nur die CAD-Daten.</Text>
              <Text className={styles.msgText}>
                <span className={styles.mention}>@evglab</span> geht das trotzdem?
              </Text>
            </Column>
          </Row>
          <Row className={on(2)} gap="12">
            <Mark />
            <Column gap="4">
              <Text className={styles.msgHead}>
                <b>EvGlab</b> <em className={styles.app}>TEAM</em> <span>09:44</span>
              </Text>
              {step < 7 ? (
                <span className={styles.typing}>
                  <i />
                  <i />
                  <i />
                </span>
              ) : (
                <Text className={classNames(styles.msgText, styles.step, styles.on)}>
                  Geht. Wir bauen die Anlage aus Ihren CAD-Daten in 3D nach, inklusive Schnittansicht. Das
                  Storyboard liegt schon im Ordner.
                </Text>
              )}
            </Column>
          </Row>
        </Column>
      </Column>

      <Column className={classNames(styles.win, styles.task)} gap="12" fillWidth>
        <Text className={classNames(styles.via, on(2))}>J. Brandt via Projekt-Chat</Text>
        <Text className={classNames(styles.req, on(2))}>Messefilm für die Hannover Messe 2027</Text>
        <Row className={classNames(styles.reply, on(3))} gap="8" vertical="center">
          <Mark />
          <span>Läuft. Erste Szene in 10 Tagen.</span>
        </Row>
        <Column as="ul" className={classNames(styles.steps, on(3))} gap="8">
          <li className={on(4)}>
            <Check />
            CAD-Daten importiert · 14 Baugruppen
          </li>
          <li className={on(5)}>
            <Check />
            Storyboard für 45-Sek.-Loop erstellt
          </li>
          <li className={on(6)}>
            <Check />
            Vorschau an das Team gesendet
          </li>
          <li className={on(7)}>
            <Check />
            Geantwortet in #messe-hannover-2027
          </li>
        </Column>
        <Row className={styles.composer} vertical="center" gap="8">
          <span className={styles.composerInput}>Nachricht an EvGlab …</span>
          <span className={styles.chip}>4K</span>
          <span className={styles.send}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19V5M6 11l6-6 6 6" />
            </svg>
          </span>
        </Row>
      </Column>
    </Column>
  );
}

/* ——— B: Trade-show countdown ——— */
const PLAN: { name: string; from: number; to: number; ok?: string; fair?: boolean }[] = [
  { name: "Story & Standanalyse", from: 2, to: 3, ok: "Freigabe: Kernbotschaft" },
  { name: "Styleframes", from: 3, to: 4, ok: "Freigabe: Look" },
  { name: "Animatic & Technik", from: 4, to: 6, ok: "Freigabe: Entwicklung" },
  { name: "Rendering", from: 6, to: 7 },
  { name: "Fassungen & Abnahme", from: 7, to: 8, ok: "Abnahme" },
  { name: "Messetag 1", from: 8, to: 9, ok: "Film läuft am Stand", fair: true },
];

function PlanStage() {
  const [ref, step] = useSequence(6, 550);
  return (
    <Column ref={ref} className={styles.stage} fillWidth aria-hidden="true">
      <Column className={styles.win} fillWidth>
        <Text className={styles.winBar}>Messe-Countdown</Text>
        <Row className={styles.winHead} horizontal="between" vertical="center" gap="12">
          <Column>
            <Text className={styles.channel}>Ihr Messeauftritt</Text>
            <Text className={styles.members}>Rückwärts geplant ab Messetag 1</Text>
          </Column>
          <Row gap="8" vertical="center">
            <span className={styles.count}>42</span>
            <small className={styles.countLabel}>
              Tage bis
              <br />
              Messetag 1
            </small>
          </Row>
        </Row>
        <Column className={styles.gantt} gap="8">
          <span className={styles.grow}>
            <span />
            {["W1", "W2", "W3", "W4", "W5", "W6"].map((w) => (
              <span key={w} className={styles.ghead}>
                {w}
              </span>
            ))}
            <span className={classNames(styles.ghead, styles.gfair)}>Messe</span>
          </span>
          {PLAN.map((p, i) => (
            <span key={p.name} className={classNames(styles.grow, styles.step, step >= i + 1 && styles.on)}>
              <span className={styles.gname}>{p.name}</span>
              {p.fair ? (
                <span className={styles.gflag} style={{ gridColumn: `${p.from} / ${p.to}` }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 21V4M5 4h11l-2 4 2 4H5" />
                  </svg>
                </span>
              ) : (
                <span className={styles.gbar} style={{ gridColumn: `${p.from} / ${p.to}` }} />
              )}
              {p.ok && <span className={classNames(styles.gok, p.fair && styles.gokSolid)}>{p.ok}</span>}
            </span>
          ))}
        </Column>
      </Column>
    </Column>
  );
}

/* ——— C: Formats ——— */
const ICONS: Record<string, ReactNode> = {
  monitor: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="1.5" />
      <path d="M9 20h6M12 16v4" />
    </>
  ),
  led: (
    <>
      <rect x="2.5" y="5" width="19" height="11" rx="1" />
      <path d="M2.5 10.5h19M8.8 5v11M15.2 5v11" />
    </>
  ),
  tablet: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M11 18h2" />
    </>
  ),
  phone: (
    <>
      <rect x="7.5" y="3" width="9" height="18" rx="2" />
      <path d="M11 18h2" />
    </>
  ),
  cube: (
    <>
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" />
      <path d="M4 7.5l8 4.5 8-4.5M12 12v9" />
    </>
  ),
  play: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M10 8.8v6.4l5.2-3.2z" />
    </>
  ),
  loop: (
    <>
      <path d="M17 2l3 3-3 3" />
      <path d="M4 11V9a4 4 0 0 1 4-4h12" />
      <path d="M7 22l-3-3 3-3" />
      <path d="M20 13v2a4 4 0 0 1-4 4H4" />
    </>
  ),
  vr: <path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h15A1.5 1.5 0 0 1 21 8.5v6a1.5 1.5 0 0 1-1.5 1.5H16l-2-2.5h-4L8 16H4.5A1.5 1.5 0 0 1 3 14.5z" />,
  projector: (
    <>
      <rect x="2.5" y="8" width="19" height="9" rx="2" />
      <circle cx="16" cy="12.5" r="2.5" />
      <path d="M6 12.5h4" />
    </>
  ),
  touch: (
    <path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V11m0-1.5a1.5 1.5 0 0 1 3 0V12m0-1a1.5 1.5 0 0 1 3 0v3.5A6.5 6.5 0 0 1 11.5 21h-.6a6 6 0 0 1-4.6-2.2L3.8 15.6a1.5 1.5 0 0 1 2.3-1.9L9 16.5" />
  ),
  spark: <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />,
};
const ROWS = [
  ["i:led", "4K", "i:monitor", "16:9", "i:touch", "L:8K", "i:tablet", "HDR", "i:play"],
  ["32:9", "i:projector", "Loop", "L:i:cube", "9:16", "i:phone", "CAD", "i:vr", "STEP"],
  ["i:loop", "ProRes", "i:spark", "60 fps", "i:led", "L:MP4", "i:monitor", "AR", "i:touch"],
  ["VR", "i:tablet", "21:9", "i:cube", "L:i:play", "OBJ", "i:projector", "8K", "i:phone"],
];

function Tile({ t }: { t: string }) {
  const light = t.startsWith("L:");
  const v = light ? t.slice(2) : t;
  return (
    <span className={classNames(styles.tile, light && styles.tileLight)}>
      {v.startsWith("i:") ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          {ICONS[v.slice(2)]}
        </svg>
      ) : (
        v
      )}
    </span>
  );
}

function FormatsStage() {
  return (
    <Column className={styles.formats} gap="8" fillWidth aria-hidden="true">
      {ROWS.map((row, r) => (
        <Row key={row.join()} className={classNames(styles.formatsRow, r % 2 && styles.reverse)}>
          {[0, 1].map((copy) => (
            <Row key={copy} className={styles.formatsSet} gap="8">
              {row.map((t, i) => (
                <Tile key={`${t}-${i}`} t={t} />
              ))}
            </Row>
          ))}
        </Row>
      ))}
    </Column>
  );
}

/* ——— D: Technical approval ——— */
function PromptStage() {
  return (
    <Column className={classNames(styles.win, styles.prompt)} gap="16" fillWidth aria-hidden="true">
      <Text as="p" className={styles.promptText}>
        Bei{" "}
        <span className={styles.chip}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>
          00:12
        </span>{" "}
        dreht sich der{" "}
        <span className={styles.chip}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
            <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" />
            <path d="M4 7.5l8 4.5 8-4.5M12 12v9" />
          </svg>
          Dichtring
        </span>{" "}
        in die falsche Richtung. Bitte gegen den Uhrzeigersinn.{" "}
        <span className={styles.muted}>(Sonst passt alles.)</span>
        <span className={styles.caret} />
      </Text>
      <Row className={styles.composer} vertical="center" gap="8">
        <span className={styles.chip}>Animatic v2</span>
        <span className={styles.spacer} />
        <span className={styles.chip}>Entwicklung</span>
        <span className={styles.send}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19V5M6 11l6-6 6 6" />
          </svg>
        </span>
      </Row>
    </Column>
  );
}

/** How a project runs: project chat, trade-show countdown, formats, technical approval. */
export function MesseBento() {
  return (
    <Column gap="24" fillWidth>
      <Grid columns="2" m={{ columns: "1" }} gap="40" className={styles.wide} fillWidth>
        <Copy
          title="Ein Kanal für Ihr ganzes Projekt"
          text="Briefing, Feedback und Freigaben laufen über einen gemeinsamen Projekt-Chat. So sehen Sie jederzeit, wo Ihr Film steht."
        >
          <RequestTrigger topic="projekt" variant="pill">
            Projekt anfragen
          </RequestTrigger>
        </Copy>
        <ChatStage />
      </Grid>

      <Grid columns="2" m={{ columns: "1" }} gap="40" className={classNames(styles.wide, styles.flipped)} fillWidth>
        <PlanStage />
        <Copy
          title="Pünktlich zum ersten Messetag"
          text="Mit dem Messe-Countdown planen wir rückwärts von Ihrem Messetermin. Sie wissen ab Tag 1, wann was freigegeben wird."
        >
          <RequestTrigger topic="zeitplan" variant="pill">
            Zeitplan für meine Messe anfragen
          </RequestTrigger>
        </Copy>
      </Grid>

      <Grid columns="2" m={{ columns: "1" }} gap="24" fillWidth>
        <Column className={styles.half} gap="32">
          <FormatsStage />
          <Copy
            title="Für jede Fläche gerendert"
            text="Von der LED-Wand über den Touchscreen bis zum Tablet am Stehtisch: jedes Format passgenau ausgespielt."
          />
        </Column>
        <Column className={styles.half} gap="32">
          <PromptStage />
          <Copy
            title="Ihre Fachleute geben frei, bevor gerendert wird"
            text="Niemand kennt Ihr Produkt besser als Ihr Team. Deshalb prüft Ihre Entwicklung jede Bewegung im Animatic. Gerendert wird erst, wenn alles stimmt."
          />
        </Column>
      </Grid>
    </Column>
  );
}
