import { useEffect, useRef } from "react";

const GRID_GAP = 38;
const INFLUENCE_R = 180;

type Dot = { ox: number; oy: number; x: number; y: number; phase: number };
type Shape = {
  x: number;
  y: number;
  r: number;
  speed: number;
  phase: number;
  rotSpeed: number;
  rot: number;
  sides: number;
  accent: boolean;
};

function polygon(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  sides: number,
  rot: number,
) {
  ctx.beginPath();
  for (let i = 0; i < sides; i++) {
    const a = rot + (i / sides) * Math.PI * 2;
    const px = cx + Math.cos(a) * r;
    const py = cy + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c0 = canvasRef.current;
    const ctx0 = c0?.getContext("2d") ?? null;
    const h0 = c0?.parentElement;
    if (!c0 || !ctx0 || !(h0 instanceof HTMLElement)) return;

    const canvas: HTMLCanvasElement = c0;
    const ctx: CanvasRenderingContext2D = ctx0;
    const hero: HTMLElement = h0;

    const mouse = { x: -9999, y: -9999 };
    let W = 0;
    let H = 0;
    let dots: Dot[] = [];
    let t = 0;
    let raf = 0;

    const orb = { x: 0.68, y: 0.38, vx: 0.00012, vy: 0.00009 };
    const shapes: Shape[] = Array.from({ length: 6 }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      r: 60 + Math.random() * 80,
      speed: 0.00018 + Math.random() * 0.00014,
      phase: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.004,
      rot: Math.random() * Math.PI * 2,
      sides: [3, 4, 6][i % 3]!,
      accent: i < 2,
    }));

    function buildGrid() {
      dots = [];
      const cols = Math.floor(W / GRID_GAP) + 2;
      const rows = Math.floor(H / GRID_GAP) + 2;
      const offX = (W - (cols - 1) * GRID_GAP) / 2;
      const offY = (H - (rows - 1) * GRID_GAP) / 2;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          dots.push({
            ox: offX + c * GRID_GAP,
            oy: offY + r * GRID_GAP,
            x: 0,
            y: 0,
            phase: Math.random() * Math.PI * 2,
          });
        }
      }
    }

    function resize() {
      W = canvas.width = hero.offsetWidth;
      H = canvas.height = hero.offsetHeight;
      buildGrid();
    }

    function isLightTheme() {
      return document.documentElement.getAttribute("data-mp-theme") === "light";
    }

    function frame() {
      t += 1;
      ctx.clearRect(0, 0, W, H);
      const light = isLightTheme();

      orb.x += orb.vx;
      orb.y += orb.vy;
      if (orb.x < 0.3 || orb.x > 0.85) orb.vx *= -1;
      if (orb.y < 0.2 || orb.y > 0.75) orb.vy *= -1;
      const ox = orb.x * W;
      const oy = orb.y * H;

      for (let i = 3; i >= 1; i--) {
        const alpha = light ? 0.055 * i : 0.035 * i;
        const r = 60 + i * 55 + Math.sin(t * 0.012 + i) * 12;
        ctx.beginPath();
        ctx.arc(ox, oy, r, 0, Math.PI * 2);
        ctx.strokeStyle = light
          ? `rgba(74,92,18,${alpha})`
          : `rgba(200,245,63,${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(ox, oy, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = light ? "rgba(74,92,18,0.55)" : "rgba(200,245,63,0.5)";
      ctx.fill();

      shapes.forEach((s) => {
        s.rot += s.rotSpeed;
        const sx = (s.x + Math.sin(t * s.speed + s.phase) * 0.06) * W;
        const sy = (s.y + Math.cos(t * s.speed * 1.3 + s.phase) * 0.04) * H;
        polygon(ctx, sx, sy, s.r, s.sides, s.rot);
        ctx.strokeStyle = light
          ? s.accent
            ? "rgba(74,92,18,0.14)"
            : "rgba(17,16,14,0.07)"
          : s.accent
            ? "rgba(200,245,63,0.055)"
            : "rgba(240,237,230,0.035)";
        ctx.lineWidth = 0.6;
        ctx.stroke();
      });

      const now = t * 0.018;
      dots.forEach((d) => {
        const dx = d.ox - mouse.x;
        const dy = d.oy - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const breathX = Math.sin(now + d.phase) * 1.2;
        const breathY = Math.cos(now * 0.7 + d.phase) * 1.2;

        let pushX = 0;
        let pushY = 0;
        if (dist < INFLUENCE_R && dist > 0) {
          const force = 1 - dist / INFLUENCE_R;
          pushX = -(dx / dist) * force * 22;
          pushY = -(dy / dist) * force * 22;
        }

        const odx = d.ox - ox;
        const ody = d.oy - oy;
        const od = Math.sqrt(odx * odx + ody * ody);
        let pullX = 0;
        let pullY = 0;
        if (od < 130 && od > 0) {
          const f = (1 - od / 130) * 0.4;
          pullX = -(odx / od) * f * 6;
          pullY = -(ody / od) * f * 6;
        }

        d.x = d.ox + breathX + pushX + pullX;
        d.y = d.oy + breathY + pushY + pullY;

        const proximity = dist < INFLUENCE_R ? 1 - dist / INFLUENCE_R : 0;
        const orbProx = od < 130 ? 1 - od / 130 : 0;
        const glow = Math.max(proximity, orbProx);

        const radius = 0.9 + glow * 2.2;
        const alpha = 0.12 + glow * 0.55;

        if (glow > 0.05) {
          let rr: number;
          let gg: number;
          let bb: number;
          if (light) {
            rr = Math.round(18 + (120 - 18) * (1 - glow));
            gg = Math.round(17 + (145 - 17) * (1 - glow));
            bb = Math.round(14 + (40 - 14) * (1 - glow));
          } else {
            rr = Math.round(200 + (240 - 200) * (1 - glow));
            gg = Math.round(245 + (237 - 245) * (1 - glow));
            bb = Math.round(63 + (230 - 63) * (1 - glow));
          }
          ctx.beginPath();
          ctx.arc(d.x, d.y, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rr},${gg},${bb},${alpha})`;
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(d.x, d.y, light ? 1.05 : 0.9, 0, Math.PI * 2);
          ctx.fillStyle = light ? "rgba(17,16,14,0.14)" : "rgba(240,237,230,0.11)";
          ctx.fill();
        }
      });

      const scanY = ((t * 0.5) % (H + 80)) - 40;
      const scanGrad = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
      if (light) {
        scanGrad.addColorStop(0, "rgba(74,92,18,0)");
        scanGrad.addColorStop(0.5, "rgba(74,92,18,0.055)");
        scanGrad.addColorStop(1, "rgba(74,92,18,0)");
      } else {
        scanGrad.addColorStop(0, "rgba(200,245,63,0)");
        scanGrad.addColorStop(0.5, "rgba(200,245,63,0.025)");
        scanGrad.addColorStop(1, "rgba(200,245,63,0)");
      }
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanY - 30, W, 60);

      /* Bottom veil: dark mode needs strong fade into page bg; light mode uses soft match to page */
      const fadeTop = light ? H * 0.62 : H * 0.55;
      const fadeGrad = ctx.createLinearGradient(0, fadeTop, 0, H);
      if (light) {
        const hc = document.documentElement.getAttribute("data-mp-contrast") === "high";
        const br = hc ? 255 : 242;
        const bg = hc ? 255 : 241;
        const bb = hc ? 255 : 236;
        fadeGrad.addColorStop(0, `rgba(${br},${bg},${bb},0)`);
        fadeGrad.addColorStop(0.55, `rgba(${br},${bg},${bb},0.12)`);
        fadeGrad.addColorStop(1, `rgba(${br},${bg},${bb},0.42)`);
      } else {
        fadeGrad.addColorStop(0, "rgba(11,11,9,0)");
        fadeGrad.addColorStop(1, "rgba(11,11,9,0.92)");
      }
      ctx.fillStyle = fadeGrad;
      ctx.fillRect(0, fadeTop, W, H - fadeTop);

      raf = requestAnimationFrame(frame);
    }

    const onMove = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    resize();
    raf = requestAnimationFrame(frame);

    hero.addEventListener("mousemove", onMove);
    hero.addEventListener("mouseleave", onLeave);
    const ro = new ResizeObserver(() => {
      resize();
    });
    ro.observe(hero);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      hero.removeEventListener("mousemove", onMove);
      hero.removeEventListener("mouseleave", onLeave);
      ro.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="mp-hero-canvas" aria-hidden />;
}
