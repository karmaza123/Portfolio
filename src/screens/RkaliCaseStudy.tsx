import { useEffect, useState, type CSSProperties } from "react";
import { MaraHeader } from "../components/MaraHeader";
import { Reveal } from "../components/Reveal";
import { CaseStudyFooter, CaseStudyTop } from "../components/CaseStudyFrame";
import "./CaseStudyScreen.css";

const IMG = "/case-studies/rkali";

const META = [
  ["Company", "Rkali"],
  ["My Role", "Brand Identity Designer"],
  ["Tools", "Adobe Illustrator, Figma"],
  ["Timeframe", "20/02/2025 – 03/03/2025"],
] as const;

/** Bespoke reconstruction of the Rkali "Jewelry Store Identity" Figma page. */
export function RkaliCaseStudy() {
  const [zoom, setZoom] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    if (!zoom) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoom(null);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [zoom]);

  const theme = {
    "--aa-gold": "#c8a24a",
    "--aa-teal": "#1f4d3a",
    "--rk-green": "#4f5448",
  } as CSSProperties;

  const Img = ({
    src,
    alt,
    className,
  }: {
    src: string;
    alt: string;
    className?: string;
  }) => (
    <button
      type="button"
      className={`rk-imgbtn${className ? ` ${className}` : ""}`}
      onClick={() => setZoom({ src: `${IMG}/${src}`, alt })}
      aria-label={`Enlarge image: ${alt}`}
    >
      <img className="rk-img" src={`${IMG}/${src}`} alt={alt} loading="lazy" />
    </button>
  );

  return (
    <div className="aa rk" style={theme}>
      <MaraHeader active="work" />

      <CaseStudyTop title="Rkali — Brand identity" />

      <main id="main-content" tabIndex={-1}>
        <Reveal blur className="aa-hero-reveal">
          <section className="aa-section rk-hero">
            <h1 className="aa-title">Jewelry Store Identity</h1>
            <p className="rk-handle">@Rkali Store</p>
          </section>
        </Reveal>

        <section className="aa-section rk-top">
          <Reveal className="rk-top-left">
            <p className="rk-intro">
              Rkali is a <strong>jewelry store startup based in Georgia</strong>,
              specializing in <strong>modern silver jewelry</strong>. With a focus
              on quality craftsmanship and contemporary design, <strong>Rkali</strong>{" "}
              offers <strong>elegant and timeless pieces</strong> that cater to a
              wide range of styles, from minimalistic to statement jewelry.
            </p>
            <div className="rk-lockups">
              <Img src="logo-dark.png" alt="Rkali logo lockup on green" className="rk-lockup" />
              <Img
                src="logo-light.png"
                alt="Rkali logo lockups on cream"
                className="rk-lockup"
              />
            </div>
          </Reveal>
          <Reveal staggerIndex={1} className="rk-top-right">
            <Img
              src="construction.png"
              alt="Rkali logo construction grid and proportions"
              className="rk-construction"
            />
          </Reveal>
        </section>

        <Reveal className="rk-panel-reveal">
          <section className="rk-panel">
            <div className="rk-panel-inner">
              <div className="rk-cg">
                <div className="rk-block">
                  <h2 className="aa-h2">Challenge</h2>
                  <p>
                    The main challenge was to create a custom typeface that
                    seamlessly integrates Georgian and English letters, maintaining
                    readability and aesthetic balance. Additionally, ensuring the
                    design reflects Rkali’s modern and sophisticated style while
                    remaining memorable and versatile across different mediums posed
                    a significant creative challenge.
                  </p>
                </div>
                <div className="rk-block">
                  <h2 className="aa-h2">Goal</h2>
                  <p>
                    The goal was to design a unique brand identity, including a
                    custom logo that seamlessly integrated Georgian and English
                    letters. The main challenge was developing a completely custom
                    typeface that balanced both scripts while maintaining a cohesive
                    visual identity.
                  </p>
                </div>
              </div>
              <Img
                src="typeface.png"
                alt="Custom typeface construction blending Georgian and English letters"
                className="rk-typeface"
              />
            </div>
          </section>
        </Reveal>

        <Reveal className="rk-meta-reveal">
          <section className="aa-section rk-meta">
            {META.map(([label, value]) => (
              <div key={label} className="rk-meta-item">
                <span className="rk-meta-label">{label}</span>
                <span className="rk-meta-value">{value}</span>
              </div>
            ))}
          </section>
        </Reveal>

        <Reveal className="rk-pkg-reveal">
          <section className="aa-section rk-pkg">
            <Img src="pkg-tins.png" alt="Rkali branded jewelry tins" />
            <Img src="pkg-box-a.png" alt="Rkali jewelry packaging box" />
            <Img src="pkg-box-b.png" alt="Rkali jewelry box with silver necklace" />
          </section>
        </Reveal>

        <CaseStudyFooter slug="rkali-brand-design" />
      </main>

      {zoom && (
        <div
          className="aa-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={zoom.alt}
          onClick={() => setZoom(null)}
        >
          <button
            type="button"
            className="aa-lightbox-close"
            onClick={() => setZoom(null)}
            aria-label="Close image viewer"
          >
            ×
          </button>
          <img className="aa-lightbox-img" src={zoom.src} alt={zoom.alt} />
        </div>
      )}
    </div>
  );
}
