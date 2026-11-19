import { useState } from "react";
import { ChromaFlow, FlutedGlass, Shader, Swirl } from "shaders/react";
import { useMaraAppearance, type MaraTheme } from "../context/MaraAppearance";
import { HeroCanvas } from "./HeroCanvas";

/* Dark mode screens a dim lime over black; light mode multiplies a pale olive over the paper tone */
const PALETTES: Record<
  MaraTheme,
  {
    swirl: [string, string];
    flowBlend: "screen" | "multiply";
    flowBase: string;
    flowUp: string;
    flowRight: string;
    flowLeft: string;
    flowDown: string;
  }
> = {
  dark: {
    swirl: ["#121212", "#5c5c62"],
    flowBlend: "screen",
    flowBase: "#000000",
    flowUp: "#465614",
    flowRight: "#465614",
    flowLeft: "#3c4a12",
    flowDown: "#323d0f",
  },
  light: {
    swirl: ["#f4f3ee", "#cfccc2"],
    flowBlend: "multiply",
    flowBase: "#ffffff",
    flowUp: "#d3dcae",
    flowRight: "#d3dcae",
    flowLeft: "#dbe2bd",
    flowDown: "#e3e8cb",
  },
};

export function GlassBackground() {
  const { theme } = useMaraAppearance();
  const [unavailable, setUnavailable] = useState(false);

  if (unavailable) return <HeroCanvas />;

  const p = PALETTES[theme];

  return (
    <>
      <Shader
        key={theme}
        className="mp-hero-canvas mp-hero-shader"
        toneMapping="neutral"
        disableTelemetry
        onUnavailable={() => setUnavailable(true)}
        aria-hidden
      >
        <Swirl
          blend={36}
          detail={1.5}
          stops={[
            { color: p.swirl[0], position: 0 },
            { color: p.swirl[1], position: 1 },
          ]}
        />
        <ChromaFlow
          baseColor={p.flowBase}
          blendMode={p.flowBlend}
          downColor={p.flowDown}
          intensity={0.7}
          leftColor={p.flowLeft}
          momentum={18}
          radius={2.5}
          rightColor={p.flowRight}
          upColor={p.flowUp}
        />
        <FlutedGlass
          aberration={0.36}
          angle={90}
          frequency={50}
          highlightColor="#ffffff"
          refraction={4}
          shape="rounded"
          softness={1}
          speed={0}
        />
      </Shader>
      <div className="mp-hero-canvas mp-hero-shader-veil" aria-hidden />
    </>
  );
}
