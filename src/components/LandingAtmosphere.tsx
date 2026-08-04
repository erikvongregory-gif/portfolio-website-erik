import styles from "./LandingAtmosphere.module.scss";

/** Animated sun — reused in hero sky + landscape band on mobile. */
export function LandingSun({
  className,
  idPrefix = "evg",
}: {
  className?: string;
  idPrefix?: string;
}) {
  const patternId = `${idPrefix}-sonne`;
  return (
    <svg
      className={className ?? styles.sun}
      viewBox="0 0 260 260"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern id={patternId} width="10" height="10" patternUnits="userSpaceOnUse">
          <circle cx="5" cy="5" r="2.1" fill="#FDFBF6" />
        </pattern>
      </defs>
      <g className={styles.sunRays} fill="#F8E6A0">
        <ellipse className={styles.ray} cx="130" cy="22" rx="8" ry="20" opacity="0.6" />
        <ellipse className={styles.ray} cx="130" cy="238" rx="8" ry="20" opacity="0.5" />
        <ellipse className={styles.ray} cx="22" cy="130" rx="20" ry="8" opacity="0.55" />
        <ellipse className={styles.ray} cx="238" cy="130" rx="20" ry="8" opacity="0.55" />
        <ellipse className={styles.ray} cx="52" cy="52" rx="7" ry="17" opacity="0.48" transform="rotate(-45 52 52)" />
        <ellipse className={styles.ray} cx="208" cy="52" rx="7" ry="17" opacity="0.48" transform="rotate(45 208 52)" />
        <ellipse className={styles.ray} cx="52" cy="208" rx="7" ry="17" opacity="0.42" transform="rotate(45 52 208)" />
        <ellipse className={styles.ray} cx="208" cy="208" rx="7" ry="17" opacity="0.42" transform="rotate(-45 208 208)" />
      </g>
      <circle cx="130" cy="130" r="100" fill={`url(#${patternId})`} opacity="0.45" />
      <circle className={styles.sunCore} cx="130" cy="130" r="72" fill="#F7E08A" />
      <circle cx="130" cy="130" r="72" fill="none" stroke="#FDFBF6" strokeWidth="3" opacity="0.55" />
    </svg>
  );
}

function CloudShape({
  className,
  idPrefix,
  dotted = false,
}: {
  className: string;
  idPrefix: string;
  dotted?: boolean;
}) {
  const clipId = `${idPrefix}-clip`;
  const patternId = `${idPrefix}-dots`;
  return (
    <svg className={className} viewBox="0 0 140 72" aria-hidden="true">
      <defs>
        {dotted ? (
          <pattern id={patternId} width="7" height="7" patternUnits="userSpaceOnUse">
            <circle cx="3.5" cy="3.5" r="1.6" fill="#BFDCEE" />
          </pattern>
        ) : null}
        <clipPath id={clipId}>
          <path d="M22 62 C8 62 2 50 11 42 C4 30 16 19 30 23 C34 7 58 3 68 13 C76 3 98 5 102 17 C118 13 131 25 125 37 C137 43 131 60 116 60 Z" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <rect width="140" height="72" fill={dotted ? "#E8F3F8" : "#EDF5FA"} />
        {dotted ? <rect width="140" height="72" fill={`url(#${patternId})`} opacity="0.55" /> : null}
      </g>
    </svg>
  );
}

function Flock({ className, count = 3 }: { className: string; count?: 2 | 3 }) {
  return (
    <span className={`${styles.flock} ${className}`} aria-hidden="true">
      <svg className={styles.bird} viewBox="0 0 28 16" fill="none" stroke="#16150F" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round">
        <path className={styles.wingL} d="M14 10 Q7 3 2 10" />
        <path className={styles.wingR} d="M14 10 Q21 3 26 10" />
      </svg>
      <svg className={`${styles.bird} ${styles.birdSm}`} viewBox="0 0 28 16" fill="none" stroke="#16150F" strokeOpacity="0.32" strokeWidth="1.8" strokeLinecap="round">
        <path className={styles.wingL} d="M14 10 Q7 3 2 10" />
        <path className={styles.wingR} d="M14 10 Q21 3 26 10" />
      </svg>
      {count === 3 ? (
        <svg className={`${styles.bird} ${styles.birdTiny}`} viewBox="0 0 28 16" fill="none" stroke="#16150F" strokeOpacity="0.26" strokeWidth="1.5" strokeLinecap="round">
          <path className={styles.wingL} d="M14 10 Q7 3 2 10" />
          <path className={styles.wingR} d="M14 10 Q21 3 26 10" />
        </svg>
      ) : null}
    </span>
  );
}

/** Mobile hero: clouds top-left + flock flying through. */
export function LandingHeroSkyDecor() {
  return (
    <>
      <CloudShape className={`${styles.cloud} ${styles.heroCloudA}`} idPrefix="evg-hero-c1" dotted />
      <CloudShape className={`${styles.cloud} ${styles.heroCloudB}`} idPrefix="evg-hero-c2" />
      <Flock className={styles.heroFlock} count={3} />
    </>
  );
}

/**
 * Flat vector landscape in Norddorf’s collage style —
 * Bavarian Alps, lake, wildlife instead of North Sea dunes.
 */
export function LandingAtmosphere() {
  return (
    <div className={styles.root} aria-hidden="true">
      <span className={styles.sky} />

      <CloudShape className={`${styles.cloud} ${styles.cloudA}`} idPrefix="evg-band-c1" dotted />
      <CloudShape className={`${styles.cloud} ${styles.cloudB}`} idPrefix="evg-band-c2" />

      <LandingSun idPrefix="evg-band" />

      <Flock className={styles.flockA} count={3} />
      <Flock className={styles.flockB} count={2} />

      {/* Main landscape */}
      <svg
        className={styles.landscape}
        viewBox="0 0 1440 460"
        preserveAspectRatio="xMidYMax slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="evg-riss" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.07" numOctaves="3" seed="7" result="t" />
            <feDisplacementMap in="SourceGraphic" in2="t" scale="5" />
          </filter>
          <filter id="evg-schatten" x="-5%" y="-20%" width="110%" height="140%">
            <feDropShadow dx="0" dy="-5" stdDeviation="7" floodColor="#16150F" floodOpacity="0.06" />
          </filter>
          <pattern id="evg-see" width="8" height="8" patternUnits="userSpaceOnUse">
            <circle cx="4" cy="4" r="1.3" fill="#16150F" fillOpacity="0.06" />
          </pattern>
          <linearGradient id="evg-see-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#A8D4E6" />
            <stop offset="55%" stopColor="#6BA3C4" />
            <stop offset="100%" stopColor="#4A7FA3" />
          </linearGradient>
          <linearGradient id="evg-berg-fern" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E8EEF5" />
            <stop offset="28%" stopColor="#C9D4E8" />
            <stop offset="100%" stopColor="#B0BFD6" />
          </linearGradient>
          <linearGradient id="evg-berg-mid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D5DEEC" />
            <stop offset="35%" stopColor="#A8B8D4" />
            <stop offset="100%" stopColor="#8FA0C0" />
          </linearGradient>
        </defs>

        <g className={styles.layerFar} filter="url(#evg-schatten)">
          <path
            filter="url(#evg-riss)"
            fill="url(#evg-berg-fern)"
            d="M-20 464 L-20 210 L120 160 L260 220 L400 120 L520 190 L680 90 L820 170 L960 100 L1120 180 L1280 110 L1460 175 L1460 464 Z"
          />
          <path
            filter="url(#evg-riss)"
            fill="url(#evg-berg-mid)"
            opacity="0.9"
            d="M-20 464 L-20 250 L180 200 L340 260 L480 170 L640 230 L800 150 L980 220 L1160 165 L1320 230 L1460 190 L1460 464 Z"
          />
        </g>

        <g className={styles.layerMid} filter="url(#evg-schatten)">
          <path
            filter="url(#evg-riss)"
            fill="#7A9B78"
            d="M-20 464 L-20 290 C80 250 200 310 340 270 C480 230 600 300 760 265 C920 230 1080 295 1240 260 C1340 240 1460 280 1460 280 L1460 464 Z"
          />
          <path
            filter="url(#evg-riss)"
            fill="#5F8260"
            d="M-20 464 L-20 320 C140 290 280 340 440 305 C600 270 760 335 920 300 C1080 265 1260 325 1460 295 L1460 464 Z"
          />
        </g>

        <g className={styles.lake}>
          <path
            filter="url(#evg-riss)"
            fill="url(#evg-see-fill)"
            d="M80 360 C220 330 420 345 620 335 C860 322 1100 350 1360 340 L1340 410 C1100 425 860 400 620 412 C400 422 220 405 100 420 Z"
          />
          <path
            fill="url(#evg-see)"
            opacity="0.5"
            d="M80 360 C220 330 420 345 620 335 C860 322 1100 350 1360 340 L1340 410 C1100 425 860 400 620 412 C400 422 220 405 100 420 Z"
          />
          <path
            className={styles.lakeShine}
            fill="#FDFBF6"
            opacity="0.22"
            d="M260 355 C400 345 560 350 720 342 C880 334 1020 355 1160 348 L1145 368 C1000 375 860 355 700 362 C520 370 380 362 270 372 Z"
          />
        </g>

        <g className={styles.layerNear} filter="url(#evg-schatten)">
          <path
            filter="url(#evg-riss)"
            fill="#FDFBF6"
            d="M-20 464 L-20 400 C160 375 360 415 560 390 C780 360 1000 405 1220 385 C1340 375 1460 395 1460 395 L1460 464 Z"
          />
          <path
            filter="url(#evg-riss)"
            fill="#E8E4DA"
            d="M-20 464 L-20 420 C180 400 400 435 620 415 C860 390 1100 430 1460 410 L1460 464 Z"
          />
        </g>

        {/* Barn + deer in viewBox space so they stay on the near shore under slice/crop */}
        <image
          className={styles.barnImg}
          href="/images/landing/barn.webp"
          x="708"
          y="312"
          width="102"
          height="102"
          preserveAspectRatio="xMidYMax meet"
        />
        <image
          className={`${styles.deerImg} ${styles.deerImgA}`}
          href="/images/landing/deer.webp"
          x="348"
          y="350"
          width="56"
          height="56"
          preserveAspectRatio="xMidYMax meet"
        />
        <image
          className={`${styles.deerImg} ${styles.deerImgB}`}
          href="/images/landing/deer.webp"
          x="458"
          y="356"
          width="44"
          height="44"
          preserveAspectRatio="xMidYMax meet"
        />

        <g className={styles.trees}>
          <g transform="translate(36, 300) scale(1.25)">
            <rect x="14" y="62" width="5" height="16" fill="#5A4030" rx="1" />
            <path d="M16.5 0 L28 28 L5 28 Z" fill="#2F4A34" />
            <path d="M16.5 14 L32 42 L1 42 Z" fill="#3A5C40" />
            <path d="M16.5 30 L34 64 L-1 64 Z" fill="#466B4A" />
          </g>
          <g transform="translate(72, 312) scale(1.1)" opacity="0.92">
            <rect x="11" y="52" width="4" height="14" fill="#5A4030" rx="1" />
            <path d="M13 0 L23 22 L3 22 Z" fill="#2F4A34" />
            <path d="M13 12 L26 36 L0 36 Z" fill="#3A5C40" />
            <path d="M13 26 L28 54 L-2 54 Z" fill="#466B4A" />
          </g>
          <g transform="translate(12, 328)" opacity="0.8">
            <rect x="9" y="42" width="3.5" height="12" fill="#5A4030" rx="1" />
            <path d="M10.5 0 L19 18 L2 18 Z" fill="#2F4A34" />
            <path d="M10.5 10 L21 30 L0 30 Z" fill="#3A5C40" />
            <path d="M10.5 22 L23 44 L-2 44 Z" fill="#466B4A" />
          </g>
        </g>

        <g className={styles.trees}>
          <g transform="translate(1348, 300) scale(1.2)">
            <rect x="13" y="58" width="4.5" height="15" fill="#5A4030" rx="1" />
            <path d="M15 0 L26 26 L4 26 Z" fill="#2F4A34" />
            <path d="M15 13 L29 40 L1 40 Z" fill="#3A5C40" />
            <path d="M15 28 L31 60 L-1 60 Z" fill="#466B4A" />
          </g>
          <g transform="translate(1388, 318) scale(1.05)" opacity="0.88">
            <rect x="10" y="48" width="4" height="13" fill="#5A4030" rx="1" />
            <path d="M12 0 L21 20 L3 20 Z" fill="#2F4A34" />
            <path d="M12 11 L24 34 L0 34 Z" fill="#3A5C40" />
            <path d="M12 24 L26 50 L-2 50 Z" fill="#466B4A" />
          </g>
          <g transform="translate(1320, 332)" opacity="0.72">
            <rect x="8" y="40" width="3.5" height="11" fill="#5A4030" rx="1" />
            <path d="M10 0 L17 17 L3 17 Z" fill="#2F4A34" />
            <path d="M10 9 L19 28 L1 28 Z" fill="#3A5C40" />
            <path d="M10 20 L21 42 L-1 42 Z" fill="#466B4A" />
          </g>
        </g>

        {/* Boat bobbing on the lake */}
        <g transform="translate(980, 352)">
          <g className={styles.boat}>
            <ellipse cx="18" cy="18" rx="22" ry="3" fill="#16150F" fillOpacity="0.08" />
            <path
              fill="#5A4030"
              d="M2 10 L34 10 L30 16 C24 19 12 19 6 16 Z"
            />
            <path fill="#3D2C20" d="M4 10 L32 10 L31 12 L5 12 Z" />
            <rect x="16" y="1" width="1.6" height="10" fill="#3D2C20" rx="0.5" />
            <path fill="#E8E4DA" opacity="0.85" d="M17 1 L28 8 L17 8 Z" />
          </g>
        </g>

        {/* Fish swimming through the lake */}
        <g className={styles.fishA}>
          <animateTransform
            attributeName="transform"
            type="translate"
            from="200 368"
            to="1180 378"
            dur="22s"
            repeatCount="indefinite"
          />
          {/* facing right */}
          <ellipse cx="0" cy="0" rx="7" ry="3.2" fill="#2F4A56" fillOpacity="0.55" />
          <path d="M-7 0 L-12.5 -3.5 L-12.5 3.5 Z" fill="#2F4A56" fillOpacity="0.55" />
          <circle cx="3.2" cy="-0.6" r="0.7" fill="#FDFBF6" fillOpacity="0.7" />
        </g>
        <g className={styles.fishB}>
          <animateTransform
            attributeName="transform"
            type="translate"
            from="320 382"
            to="1100 372"
            dur="31s"
            repeatCount="indefinite"
            begin="-9s"
          />
          <ellipse cx="0" cy="0" rx="5.5" ry="2.5" fill="#3A5C68" fillOpacity="0.45" />
          <path d="M-5.5 0 L-10 -2.8 L-10 2.8 Z" fill="#3A5C68" fillOpacity="0.45" />
          <circle cx="2.6" cy="-0.4" r="0.55" fill="#FDFBF6" fillOpacity="0.65" />
        </g>
        <g className={styles.fishC}>
          <animateTransform
            attributeName="transform"
            type="translate"
            from="1200 385"
            to="220 372"
            dur="27s"
            repeatCount="indefinite"
            begin="-4s"
          />
          {/* facing left */}
          <ellipse cx="0" cy="0" rx="6" ry="2.8" fill="#2F4A56" fillOpacity="0.4" />
          <path d="M6 0 L10.5 -3 L10.5 3 Z" fill="#2F4A56" fillOpacity="0.4" />
          <circle cx="-2.8" cy="-0.5" r="0.6" fill="#FDFBF6" fillOpacity="0.6" />
        </g>

        {/* Human swimmers — crawl stroke, facing travel direction */}
        <g className={styles.swimmerA}>
          <animateTransform
            attributeName="transform"
            type="translate"
            from="240 358"
            to="1080 366"
            dur="38s"
            repeatCount="indefinite"
          />
          <g className={styles.swimmerBob}>
            {/* wake */}
            <ellipse cx="-2" cy="7" rx="13" ry="2" fill="#16150F" fillOpacity="0.06" />
            {/* legs trailing left */}
            <path
              d="M-4 2 Q-10 5 -15 3"
              fill="none"
              stroke="#16150F"
              strokeOpacity="0.28"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            {/* torso */}
            <ellipse cx="1" cy="1.5" rx="6.5" ry="2.3" fill="#16150F" fillOpacity="0.4" />
            {/* head facing right */}
            <circle cx="9.5" cy="0" r="2.5" fill="#16150F" fillOpacity="0.4" />
            {/* recovering arm — rotates over head */}
            <g className={styles.swimArm}>
              <path
                d="M4 1 L4 -1 Q8 -9 13 -3"
                fill="none"
                stroke="#16150F"
                strokeOpacity="0.4"
                strokeWidth="1.9"
                strokeLinecap="round"
              />
            </g>
          </g>
        </g>
        <g className={styles.swimmerB}>
          <animateTransform
            attributeName="transform"
            type="translate"
            from="1020 370"
            to="280 360"
            dur="48s"
            repeatCount="indefinite"
            begin="-14s"
          />
          <g className={styles.swimmerBob}>
            <ellipse cx="2" cy="6" rx="11" ry="1.8" fill="#16150F" fillOpacity="0.05" />
            <path
              d="M4 2 Q10 4.5 14 2.5"
              fill="none"
              stroke="#16150F"
              strokeOpacity="0.22"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <ellipse cx="-1" cy="1.2" rx="5.5" ry="1.9" fill="#16150F" fillOpacity="0.32" />
            <circle cx="-8.5" cy="0" r="2.1" fill="#16150F" fillOpacity="0.32" />
            <g className={`${styles.swimArm} ${styles.swimArmFlip}`}>
              <path
                d="M-3 1 L-3 -1 Q-7 -8 -12 -2.5"
                fill="none"
                stroke="#16150F"
                strokeOpacity="0.32"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </g>
          </g>
        </g>

        <g className={`${styles.duck} ${styles.duckA}`}>
          <ellipse cx="528" cy="376" rx="3.5" ry="1.2" fill="#16150F" fillOpacity="0.08" />
          <path
            fill="#16150F"
            fillOpacity="0.4"
            d="M512 372 C512 368 516 366 520 367 C524 365 530 366 532 370 C534 373 532 376 528 376 C522 377 514 376 512 372 Z"
          />
          <path fill="#16150F" fillOpacity="0.4" d="M510 370 C506 369 504 371 505 372.5 C506 373.5 509 373 511 372 Z" />
          <circle cx="508" cy="369.5" r="0.7" fill="#FDFBF6" fillOpacity="0.5" />
        </g>
        <g className={`${styles.duck} ${styles.duckB}`}>
          <ellipse cx="786" cy="382" rx="3" ry="1" fill="#16150F" fillOpacity="0.07" />
          <path
            fill="#16150F"
            fillOpacity="0.32"
            d="M774 379 C774 376 777 374 780 375 C783 373 788 374 789 377 C790 379 788 381 785 381 C780 382 775 381 774 379 Z"
          />
          <path fill="#16150F" fillOpacity="0.32" d="M772 377 C769 376.5 767.5 378 768.5 379 C769.5 380 771.5 379.5 773 378.5 Z" />
        </g>
        <g className={`${styles.duck} ${styles.duckC}`}>
          <ellipse cx="646" cy="388" rx="2.5" ry="0.9" fill="#16150F" fillOpacity="0.06" />
          <path
            fill="#16150F"
            fillOpacity="0.26"
            d="M636 386 C636 383.5 638.5 382 641 382.5 C643.5 381.5 647 382 648 384.5 C649 386 647.5 387.5 645 387.5 C641 388 637 387.5 636 386 Z"
          />
          <path fill="#16150F" fillOpacity="0.26" d="M634.5 384.5 C632 384 631 385 631.5 385.8 C632.2 386.5 633.8 386.2 635 385.5 Z" />
        </g>

        {/* Prey fish — swims in the lake, snatched at the beak tip */}
        <g className={styles.preyFishG}>
          <animateTransform
            attributeName="transform"
            type="translate"
            dur="16s"
            repeatCount="indefinite"
            calcMode="linear"
            keyTimes="0;0.2;0.38;0.42;0.445;0.455;1"
            values="560 378;640 375;700 376;708 374;700 360;560 378;560 378"
          />
          <animate
            attributeName="opacity"
            dur="16s"
            repeatCount="indefinite"
            keyTimes="0;0.42;0.445;0.452;1"
            values="0.88;1;1;0;0"
          />
          <ellipse cx="0" cy="0" rx="9" ry="4" fill="#2F4A56" fillOpacity="0.9" />
          <path d="M-9 0 L-15 -4 L-15 4 Z" fill="#2F4A56" fillOpacity="0.9" />
          <circle cx="4.5" cy="-1" r="1.1" fill="#FDFBF6" fillOpacity="0.85" />
        </g>

        {/* Water splash at the strike point */}
        <g className={styles.splashG} transform="translate(700 372)">
          <animate
            attributeName="opacity"
            dur="16s"
            repeatCount="indefinite"
            keyTimes="0;0.43;0.445;0.46;0.5;1"
            values="0;0;0.85;0.4;0;0"
          />
          <ellipse className={styles.splashBloom} cx="0" cy="0" rx="22" ry="7" fill="#FDFBF6" fillOpacity="0.55" />
          <ellipse
            className={styles.splashRing}
            cx="0"
            cy="0"
            rx="12"
            ry="12"
            fill="none"
            stroke="#FDFBF6"
            strokeWidth="2"
            strokeOpacity="0.65"
          />
          <path
            d="M-6 -2 L-10 -14 M0 -3 L0 -16 M6 -2 L10 -14 M-3 0 L-8 -10 M3 0 L8 -10"
            fill="none"
            stroke="#FDFBF6"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeOpacity="0.7"
          />
        </g>

        {/* Grey heron — glides empty-beaked, strikes with tip, then climbs with catch */}
        <g className={styles.heronG}>
          <animateTransform
            attributeName="transform"
            type="translate"
            dur="16s"
            repeatCount="indefinite"
            calcMode="linear"
            keyTimes="0;0.06;0.2;0.3;0.38;0.445;0.55;0.78;1"
            values="1080 45;960 85;820 140;780 230;760 310;748 410;540 190;260 65;40 25"
          />
          <g>
            <animateTransform
              attributeName="transform"
              type="rotate"
              dur="16s"
              repeatCount="indefinite"
              calcMode="linear"
              keyTimes="0;0.2;0.3;0.38;0.445;0.55;0.78;1"
              values="-18;-24;18;36;48;42;-8;-18;-22"
            />
            <g transform="scale(-1 1)">
              <path
                className={styles.heronWing}
                fill="#4A5568"
                fillOpacity="0.9"
                d="M-6 -4 Q-20 -18 -40 -14 Q-26 -6 -18 4 Q-12 8 -6 0 Z"
              />
              <ellipse cx="0" cy="0" rx="15" ry="7.5" fill="#5A6578" />
              <path
                d="M10 -2 Q22 -16 34 -6"
                fill="none"
                stroke="#5A6578"
                strokeWidth="3.4"
                strokeLinecap="round"
              />
              <circle cx="34" cy="-4" r="3.4" fill="#5A6578" />
              {/* Beak */}
              <path fill="#C4A35A" d="M36 -5 L54 -2 L36 1 Z" />
              {/* Catch sits in the beak tip — hidden until the strike (SMIL, synced) */}
              <g className={styles.heronCatch} opacity="0">
                <animate
                  attributeName="opacity"
                  dur="16s"
                  repeatCount="indefinite"
                  keyTimes="0;0.445;0.455;0.9;0.96;1"
                  values="0;0;1;1;0;0"
                />
                <ellipse cx="50" cy="-2" rx="6.5" ry="2.6" fill="#2F4A56" />
                <path d="M43.5 -2 L38 -4.2 L38 0.2 Z" fill="#2F4A56" />
                <circle cx="54" cy="-2.8" r="0.75" fill="#FDFBF6" fillOpacity="0.85" />
              </g>
              <path
                className={styles.heronLegs}
                d="M-8 4 L-14 18 M-2 4 L2 18"
                fill="none"
                stroke="#3A4050"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </g>
          </g>
          <animate
            attributeName="opacity"
            dur="16s"
            repeatCount="indefinite"
            keyTimes="0;0.04;0.9;1"
            values="0;1;1;0"
          />
        </g>
      </svg>
    </div>
  );
}
