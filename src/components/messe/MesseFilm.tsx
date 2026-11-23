"use client";

import { Column, Row, Text } from "@once-ui-system/core/components";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import styles from "./MesseFilm.module.scss";

const HLS_JS = "/3d-produktanimation/vendor/hls.light.min.js";

type HlsLevel = { height: number };
type HlsInstance = {
  levels: HlsLevel[];
  on: (event: string, cb: (e: unknown, d: { level: number; fatal?: boolean; type?: string }) => void) => void;
  loadSource: (src: string) => void;
  attachMedia: (v: HTMLVideoElement) => void;
  startLoad: (pos?: number) => void;
  recoverMediaError: () => void;
  destroy: () => void;
};
type HlsStatic = {
  new (cfg: Record<string, unknown>): HlsInstance;
  isSupported: () => boolean;
  Events: { LEVEL_SWITCHED: string; ERROR: string };
  ErrorTypes: { NETWORK_ERROR: string; MEDIA_ERROR: string };
};

declare global {
  interface Window {
    Hls?: HlsStatic;
  }
}

let hlsScript: Promise<void> | null = null;
function loadHlsScript() {
  if (window.Hls) return Promise.resolve();
  hlsScript ??= new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = HLS_JS;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("hls"));
    document.head.appendChild(s);
  });
  return hlsScript;
}

type Props = {
  /** Adaptive stream (HLS). Either this or `src`. */
  hls?: string;
  /** Plain MP4 file. */
  src?: string;
  poster: string;
  /** Accessible name of the film. */
  label: string;
  ratio?: string;
  /** Quiet line under the player. */
  caption?: string;
  className?: string;
};

/**
 * Film player for the trade-show page.
 * - Loads nothing but the poster until the player comes near the viewport.
 * - Starts muted while in view and pauses outside; sound and fullscreen by button.
 * - With "save data" or reduced motion it only starts on click.
 * - HLS adapts quality to connection and player size (hls.js, native in Safari).
 */
export function MesseFilm({ hls, src, poster, label, ratio = "16 / 9", caption, className }: Props) {
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showPlay, setShowPlay] = useState(false);
  const [sound, setSound] = useState(false);
  const [quality, setQuality] = useState("");
  const [fullscreen, setFullscreen] = useState(false);
  const api = useRef<{ start: (withSound: boolean) => void } | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    const frame = frameRef.current;
    if (!video || !frame) return;

    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const autoplay = !reduce && !conn?.saveData;
    const isSafari = /^((?!chrome|android|crios|fxios).)*safari/i.test(navigator.userAgent);
    const nativeHls = !!video.canPlayType("application/vnd.apple.mpegurl");
    const label = (h: number) => (h >= 2000 ? "4K" : h ? `${h}p` : "");

    let ready: Promise<void> | null = null;
    let player: HlsInstance | null = null;
    let loading = false;
    let userStarted = false;
    let disposed = false;

    const onResize = () => setQuality(label(video.videoHeight));

    const connect = async () => {
      if (!hls) {
        if (src && !video.src) video.src = src;
        return;
      }
      if (isSafari && nativeHls) {
        video.src = hls;
        video.addEventListener("resize", onResize);
        return;
      }
      try {
        await loadHlsScript();
      } catch {
        /* script not loadable */
      }
      if (disposed) return;
      const Hls = window.Hls;
      if (Hls?.isSupported()) {
        player = new Hls({
          capLevelToPlayerSize: true,
          startLevel: -1,
          autoStartLoad: false,
          abrEwmaDefaultEstimate: 4e6,
          maxBufferLength: 20,
          maxMaxBufferLength: 40,
          backBufferLength: 30,
        });
        const p = player;
        p.on(Hls.Events.LEVEL_SWITCHED, (_, d) => {
          const lvl = p.levels[d.level];
          if (lvl) setQuality(label(lvl.height));
        });
        p.on(Hls.Events.ERROR, (_, d) => {
          if (!d.fatal) return;
          if (d.type === Hls.ErrorTypes.NETWORK_ERROR) p.startLoad();
          else if (d.type === Hls.ErrorTypes.MEDIA_ERROR) p.recoverMediaError();
        });
        p.loadSource(hls);
        p.attachMedia(video);
      } else if (nativeHls) {
        video.src = hls;
        video.addEventListener("resize", onResize);
      }
    };
    const attach = () => {
      ready ??= connect();
      return ready;
    };

    const play = () => {
      if (player && !loading) {
        loading = true;
        player.startLoad(-1);
      }
      video.play().catch(() => setShowPlay(true));
    };

    const near = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) attach();
      },
      { rootMargin: "300px 0px" },
    );
    near.observe(frame);

    const seen = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (autoplay || userStarted) attach().then(play);
          else setShowPlay(true);
        } else if (!video.paused) {
          video.pause();
        }
      },
      { threshold: 0.35 },
    );
    seen.observe(frame);

    const onPlaying = () => setShowPlay(false);
    video.addEventListener("playing", onPlaying);
    const onFs = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);

    api.current = {
      start: (withSound) => {
        userStarted = true;
        if (withSound) {
          video.muted = false;
          setSound(true);
        }
        attach().then(play);
      },
    };

    return () => {
      disposed = true;
      near.disconnect();
      seen.disconnect();
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("resize", onResize);
      document.removeEventListener("fullscreenchange", onFs);
      player?.destroy();
    };
  }, [hls, src]);

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    const on = video.muted;
    video.muted = !on;
    setSound(on);
    if (on) api.current?.start(false);
  };

  const toggleFullscreen = () => {
    const frame = frameRef.current;
    const video = videoRef.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
    api.current?.start(false);
    if (document.fullscreenElement) {
      document.exitFullscreen();
      return;
    }
    if (frame?.requestFullscreen) frame.requestFullscreen().catch(() => {});
    else video?.webkitEnterFullscreen?.();
  };

  return (
    <Column className={classNames(styles.wrap, className)} gap="12" fillWidth>
      <Column ref={frameRef} className={styles.frame} style={{ aspectRatio: ratio }} fillWidth>
        <video
          ref={videoRef}
          className={styles.video}
          poster={poster}
          muted
          loop
          playsInline
          preload="none"
          disablePictureInPicture
          aria-label={label}
        />

        {showPlay && (
          <button
            type="button"
            className={styles.play}
            onClick={() => {
              setShowPlay(false);
              api.current?.start(true);
            }}
            aria-label="Film abspielen"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" />
            </svg>
          </button>
        )}

        <Row className={styles.ui} gap="8" vertical="center">
          {quality && (
            <span className={styles.quality} aria-hidden="true">
              {quality}
            </span>
          )}
          <button
            type="button"
            className={styles.btn}
            onClick={toggleSound}
            aria-pressed={sound}
            aria-label={sound ? "Ton ausschalten" : "Ton einschalten"}
          >
            {sound ? (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                <path d="M15.5 9a4.2 4.2 0 0 1 0 6M18.2 6.5a7.8 7.8 0 0 1 0 11" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                <path d="M16 9.5l5 5M21 9.5l-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            )}
            <span className={styles.btnLabel}>{sound ? "Ton aus" : "Ton an"}</span>
          </button>
          <button
            type="button"
            className={classNames(styles.btn, styles.icon)}
            onClick={toggleFullscreen}
            aria-label={fullscreen ? "Vollbild beenden" : "Vollbild"}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </Row>
      </Column>
      {caption && <Text className={styles.caption}>{caption}</Text>}
    </Column>
  );
}
