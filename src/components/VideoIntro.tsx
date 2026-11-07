import React, { useState, useRef, useEffect, useCallback } from "react";
import { useLang, LanguageToggle } from "../i18n";

interface VideoIntroProps {
  key?: React.Key;
  onComplete: () => void;
  onMusicStart?: () => void;
  event?: string | null;
  readyToTransition?: boolean;
}

const THEME_GRADIENT = "linear-gradient(180deg, #A0B092 0%, #7E8F6E 55%, #627254 100%)";
const INTRO_VIDEO = "/give_this_as_wedding_invitatio%20(online-video-cutter.com).mp4";

const LOTUS_FLOURISH = "/lotus-flourish.svg";

function GoldMask({ src, style }: { src: string; style: React.CSSProperties }) {
  return (
    <div
      aria-hidden="true"
      style={{
        ...style,
        background: THEME_GRADIENT,
        WebkitMaskImage: `url("${src}")`,
        maskImage: `url("${src}")`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}

export function VideoIntro({ onComplete, onMusicStart, readyToTransition = true }: VideoIntroProps) {
  const [stage, setStage] = useState<"welcome" | "video" | "exiting">("welcome");
  const [videoDone, setVideoDone] = useState(false);
  const completedRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { t } = useLang();
  const SINHALA = "var(--font-sinhala)";

  const finish = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setStage("exiting");
    window.setTimeout(() => onComplete(), 800);
  }, [onComplete]);

  // Leave the video only once it has ended (or was skipped) and the site's images are ready.
  useEffect(() => {
    if (videoDone && readyToTransition) finish();
  }, [videoDone, readyToTransition, finish]);

  const handleOpen = () => {
    if (stage !== "welcome") return;
    onMusicStart?.();
    setStage("video");
  };

  useEffect(() => {
    if (stage !== "video") return;
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.play().catch(() => setVideoDone(true));
  }, [stage]);

  return (
    <>
      <style>{`
        .intro-scene {
          position: fixed; inset: 0; z-index: 900;
          min-height: 100dvh; overflow: hidden;
          display: grid; place-items: center;
          background-color: #F9F6F0;
          background-image:
            radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.9) 0%, rgba(249,246,240,0) 65%),
            radial-gradient(rgba(98,114,84,0.06) 1px, transparent 1px);
          background-size: 100% 100%, 6px 6px;
          transition: opacity 0.8s ease, filter 0.8s ease;
        }
        .intro-scene.is-exiting { opacity: 0; filter: blur(12px); pointer-events: none; }

        .intro-mandala-wrap {
          position: absolute; top: 50%; left: 50%;
          width: min(150vw, 900px); height: min(150vw, 900px);
          transform: translate(-50%, -50%);
          opacity: 0.16; pointer-events: none;
        }
        @media (max-width: 767px) {
          .intro-mandala-wrap { left: auto; right: 0; width: 200vw; height: 200vw; transform: translate(50%, -50%); }
        }
        .intro-mandala-spin { width: 100%; height: 100%; animation: intro-spin 90s linear infinite; }
        @keyframes intro-spin { to { transform: rotate(360deg); } }

        .intro-fade-up { animation: intro-fade-up 1.1s cubic-bezier(.22,1,.36,1) both; }
        @keyframes intro-fade-up { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }

        .intro-open-btn {
          font-family: var(--font-sinhala); font-weight: 600; font-size: 1.05rem;
          color: #F9F6F0; background: linear-gradient(135deg, #7E8F6E, #627254);
          box-shadow: 0 12px 24px -12px rgba(98,114,84,0.7);
          border-radius: 9999px; padding: 0.45rem 1.9rem; cursor: pointer;
          transition: transform .25s ease, box-shadow .25s ease;
        }
        .intro-open-btn:hover { transform: translateY(-2px); box-shadow: 0 16px 28px -12px rgba(98,114,84,0.8); }

        .intro-video-layer { position: absolute; inset: 0; background: #000; animation: intro-fade-in .7s ease both; }
        @keyframes intro-fade-in { from { opacity: 0; } to { opacity: 1; } }
        .intro-video { width: 100%; height: 100%; object-fit: cover; }
        .intro-skip {
          position: absolute; right: 16px; bottom: 20px; z-index: 2;
          font-family: "Montserrat", sans-serif; font-size: 11px; letter-spacing: .2em; text-transform: uppercase;
          color: #F9F6F0; background: rgba(0,0,0,0.35); border: 1px solid rgba(253,248,236,0.4);
          padding: 6px 14px; border-radius: 9999px; backdrop-filter: blur(6px); cursor: pointer;
        }

        @media (prefers-reduced-motion: reduce) {
          .intro-mandala-spin, .intro-fade-up { animation: none; }
        }
      `}</style>

      <div className={`intro-scene ${stage === "exiting" ? "is-exiting" : ""}`}>
        <div className="intro-mandala-wrap">
          <div className="intro-mandala-spin">
            <GoldMask src="/mandala.svg" style={{ width: "100%", height: "100%" }} />
          </div>
        </div>

        <div
          className="relative flex flex-col items-center px-8 text-center cursor-pointer"
          onClick={handleOpen}
        >
          <div className="intro-fade-up">
            <GoldMask src={LOTUS_FLOURISH} style={{ width: "min(56vw,260px)", height: "min(20vw,94px)" }} />
          </div>

          <p
            className="mt-7 intro-fade-up"
            style={{
              animationDelay: ".15s",
              fontFamily: t(SINHALA, '"Cinzel", serif'),
              fontWeight: 700,
              fontSize: "clamp(1.7rem,7vw,2.8rem)",
              lineHeight: 1.2,
              color: "#4F5D43",
            }}
          >
            {t("සාදර ඇරයුමයි !", "You're Warmly Invited!")}
          </p>

          <p
            className="mt-4 intro-fade-up"
            style={{ animationDelay: ".3s", fontFamily: t(SINHALA, '"Playball", cursive'), fontSize: "clamp(1.4rem,5.5vw,2.1rem)", fontWeight: 600 }}
          >
            <span style={{ color: "#627254" }}>{t("නිපුනි", "Nipuni")}</span>
            <span style={{ color: "#4F5D43", margin: "0 0.4rem", fontWeight: 400 }}>{t("සහ", "&")}</span>
            <span style={{ color: "#627254" }}>{t("නිපුන්", "Nipun")}</span>
          </p>

          <button
            type="button"
            aria-label="Open invitation"
            className="mt-9 intro-open-btn intro-fade-up"
            style={{ animationDelay: ".45s", fontFamily: t(SINHALA, '"Montserrat", sans-serif') }}
            onClick={(e) => { e.stopPropagation(); handleOpen(); }}
          >
            {t("විවෘත කරන්න", "Open Invitation")}
          </button>

          <LanguageToggle className="mt-6 intro-fade-up" style={{ animationDelay: ".6s" }} />
        </div>

        {stage !== "welcome" && (
          <div className="intro-video-layer">
            <video
              ref={videoRef}
              className="intro-video"
              src={INTRO_VIDEO}
              muted
              playsInline
              preload="auto"
              onEnded={() => setVideoDone(true)}
              onError={() => setVideoDone(true)}
            />
            <button type="button" className="intro-skip" onClick={() => setVideoDone(true)}>
              {t("මඟ හරින්න", "Skip")}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
