import Image from "next/image";
import styles from "./LandingAtmosphere.module.scss";

/**
 * Flat vector landscape in Norddorf’s collage style —
 * Bavarian Alps, lake, wildlife instead of North Sea dunes.
 */
export function LandingAtmosphere() {
  return (
    <div className={styles.root} aria-hidden="true">
      <span className={styles.sky} />

      {/* Floating clouds */}
      <svg className={`${styles.cloud} ${styles.cloudA}`} viewBox="0 0 140 72">
        <defs>
          <pattern id="evg-ws" width="7" height="7" patternUnits="userSpaceOnUse">
            <circle cx="3.5" cy="3.5" r="1.6" fill="#BFDCEE" />
          </pattern>
          <clipPath id="evg-wp-a">
            <path d="M22 62 C8 62 2 50 11 42 C4 30 16 19 30 23 C34 7 58 3 68 13 C76 3 98 5 102 17 C118 13 131 25 125 37 C137 43 131 60 116 60 Z" />
          </clipPath>
        </defs>
        <g clipPath="url(#evg-wp-a)">
          <rect width="140" height="72" fill="#E8F3F8" />
          <rect width="140" height="72" fill="url(#evg-ws)" opacity="0.55" />
        </g>
      </svg>
      <svg className={`${styles.cloud} ${styles.cloudB}`} viewBox="0 0 140 72">
        <defs>
          <clipPath id="evg-wp-b">
            <path d="M18 58 C6 56 4 42 14 36 C8 24 22 14 36 18 C42 6 64 4 72 14 C82 6 104 8 108 20 C122 16 134 28 128 40 C138 46 132 58 118 56 Z" />
          </clipPath>
        </defs>
        <g clipPath="url(#evg-wp-b)">
          <rect width="140" height="72" fill="#EDF5FA" />
        </g>
      </svg>

      {/* Sun with soft animated rays */}
      <svg className={styles.sun} viewBox="0 0 260 260" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="evg-sonne" width="10" height="10" patternUnits="userSpaceOnUse">
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
        <circle cx="130" cy="130" r="100" fill="url(#evg-sonne)" opacity="0.45" />
        <circle className={styles.sunCore} cx="130" cy="130" r="72" fill="#F7E08A" />
        <circle cx="130" cy="130" r="72" fill="none" stroke="#FDFBF6" strokeWidth="3" opacity="0.55" />
      </svg>

      {/* Birds with flapping wings — A L→R, B R→L */}
      <span className={`${styles.flock} ${styles.flockA}`}>
        <svg className={styles.bird} viewBox="0 0 28 16" fill="none" stroke="#16150F" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round">
          <path className={styles.wingL} d="M14 10 Q7 3 2 10" />
          <path className={styles.wingR} d="M14 10 Q21 3 26 10" />
        </svg>
        <svg className={`${styles.bird} ${styles.birdSm}`} viewBox="0 0 28 16" fill="none" stroke="#16150F" strokeOpacity="0.32" strokeWidth="1.8" strokeLinecap="round">
          <path className={styles.wingL} d="M14 10 Q7 3 2 10" />
          <path className={styles.wingR} d="M14 10 Q21 3 26 10" />
        </svg>
        <svg className={`${styles.bird} ${styles.birdTiny}`} viewBox="0 0 28 16" fill="none" stroke="#16150F" strokeOpacity="0.26" strokeWidth="1.5" strokeLinecap="round">
          <path className={styles.wingL} d="M14 10 Q7 3 2 10" />
          <path className={styles.wingR} d="M14 10 Q21 3 26 10" />
        </svg>
      </span>
      <span className={`${styles.flock} ${styles.flockB}`}>
        <svg className={styles.bird} viewBox="0 0 28 16" fill="none" stroke="#16150F" strokeOpacity="0.34" strokeWidth="1.9" strokeLinecap="round">
          <path className={styles.wingL} d="M14 10 Q7 3 2 10" />
          <path className={styles.wingR} d="M14 10 Q21 3 26 10" />
        </svg>
        <svg className={`${styles.bird} ${styles.birdSm}`} viewBox="0 0 28 16" fill="none" stroke="#16150F" strokeOpacity="0.28" strokeWidth="1.6" strokeLinecap="round">
          <path className={styles.wingL} d="M14 10 Q7 3 2 10" />
          <path className={styles.wingR} d="M14 10 Q21 3 26 10" />
        </svg>
      </span>

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
      </svg>

      <Image
        className={styles.barnImg}
        src="/images/landing/barn.webp"
        alt=""
        width={200}
        height={200}
        unoptimized
      />
      <Image
        className={`${styles.deerImg} ${styles.deerImgA}`}
        src="/images/landing/deer.webp"
        alt=""
        width={160}
        height={160}
        unoptimized
      />
      <Image
        className={`${styles.deerImg} ${styles.deerImgB}`}
        src="/images/landing/deer.webp"
        alt=""
        width={120}
        height={120}
        unoptimized
      />
    </div>
  );
}
