import { useEffect, useState } from "react";

/**
 * PowerPay app launch, rebuilt from the real Figma screens
 * (Application › Onboarding "0", "1", "2", "Authorization", "Domestic/Commercial Day").
 * All sizes are in em where 1em = 1 design px on a 375-wide screen.
 *
 *   0  white screen, green circle waiting below
 *   1  circle rises and covers the screen
 *   2  circle exits through the top, PowerPay logo revealed
 *   3  logo moves to the header, sign-in screen builds
 *   4  email types in   5  password   6  "Sign in" pressed
 *   7  Power Chart dashboard builds   8  fade, loop
 */
const STEPS = [550, 750, 900, 900, 1300, 650, 450, 4800, 550];

const reduced = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const EMAIL = "demo@minimals.cc";

/** Bar tops traced from the "Day" chart (0–50 kWh scale). */
const BARS = [33, 22, 17, 30, 46, 49, 30, 28, 33, 25, 22, 27, 33, 39, 46, 40, 49, 49, 38, 31, 22, 18, 14, 8, 25, 30, 33, 33, 40, 48, 26, 48, 44, 44, 32, 38, 44, 43, 44, 22];

export function PowerPayLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 234 35" aria-hidden>
      <g fill="#379F40">
        <path d="M50.6275 1.00781H59.558C64.6033 1.00781 66.3321 1.77174 67.5794 2.98793C69.3927 4.74074 69.9611 7.42854 69.4514 10.2007C68.9417 12.9729 67.2693 15.8575 65.2563 17.3268C63.0742 18.9109 61.0894 19.6748 56.8661 19.6748H53.8337L52.2459 28.2162H45.5845L50.6275 1.00781ZM54.9659 13.5657H57.801C59.1328 13.5657 62.1394 13.5657 62.7618 10.2851C63.3561 7.08876 60.2673 7.08876 58.7358 7.08876H56.1568L54.9659 13.5657Z" />
        <path d="M82.8587 7.14502C90.314 7.14502 92.7804 12.9987 91.8737 18.004C90.967 23.0094 86.2881 28.863 78.8327 28.863C71.3774 28.863 68.911 23.0094 69.8177 18.004C70.7244 12.9987 75.4034 7.14502 82.8587 7.14502ZM79.8827 23.1242C82.5463 23.1242 85.1841 20.9472 85.7502 17.9759C86.2881 15.0069 84.4465 12.8276 81.8087 12.8276C79.171 12.8276 76.5073 15.0046 75.9412 17.9759C75.3752 20.973 77.2449 23.1242 79.8827 23.1242Z" />
        <path d="M100.736 7.74512L101.445 20.4436H101.53L107.228 7.74512H112.389L113.439 20.4436H113.523L118.937 7.74512H125.23L115.196 28.1649H109.525L108.534 14.9579H108.45L102.582 28.1649H96.912L94.4175 7.74512H100.738H100.736Z" />
        <path d="M144.01 21.8212C142.593 24.113 140.834 25.8658 138.88 27.0539C136.951 28.2701 134.825 28.891 132.728 28.891C126.86 28.891 122.778 24.1388 123.884 18.0883C124.934 12.3752 130.405 7.14258 136.641 7.14258C142.877 7.14258 146.535 12.0636 145.372 18.2851C145.231 19.1053 145.088 19.4169 144.919 19.8973H129.583C129.498 22.3297 131.255 23.7709 133.665 23.7709C135.537 23.7709 136.698 22.9226 137.747 21.847H144.012V21.8189L144.01 21.8212ZM139.73 15.7403C139.702 14.5241 138.908 12.2323 135.732 12.2323C132.556 12.2323 130.912 14.5241 130.431 15.7403H139.73Z" />
        <path d="M150.533 7.79431H156.287L155.89 9.97127H155.975C156.684 8.98238 158.101 7.11475 161.617 7.11475L160.482 13.2519C157.619 13.3363 155.522 13.9034 154.956 17.013L152.886 28.2399H146.763L150.533 7.79197V7.79431Z" />
        <path d="M166.033 1.00781H174.963C180.009 1.00781 181.737 1.77174 182.985 2.98793C184.798 4.74074 185.366 7.42854 184.857 10.2007C184.347 12.9729 182.675 15.8575 180.662 17.3268C178.479 18.9109 176.495 19.6748 172.271 19.6748H169.239L167.651 28.2162H160.99L166.035 1.01016L166.033 1.00781ZM170.399 13.5657H173.234C174.566 13.5657 177.573 13.5657 178.195 10.2851C178.79 7.08876 175.701 7.08876 174.169 7.08876H171.59L170.399 13.5657Z" />
        <path d="M205.907 28.2137H199.784L200.181 26.0086H200.096C198.708 27.9888 195.986 28.9214 193.576 28.9214C187.083 28.9214 184.22 23.8598 185.326 18.0038C186.574 11.3019 192.159 7.1167 197.63 7.1167C200.975 7.1167 202.562 8.72891 203.072 9.97322H203.157L203.554 7.79627H209.677L205.907 28.2161V28.2137ZM195.589 23.2084C199.415 23.2084 201.315 19.9839 201.684 17.9757C202.137 15.5152 200.946 12.7993 197.489 12.7993C194.031 12.7993 191.903 15.7402 191.478 18.0601C191.109 19.9839 191.903 23.2084 195.589 23.2084Z" />
        <path d="M234 7.79395L218.72 35H212.228L216.933 27.1663L212.935 7.79395H219.456L221.356 19.6442H221.44L227.536 7.79395H234Z" />
        <path d="M35.758 5.60027L34.9077 5.38234L8.4499 0.0793875C8.25494 0.0559542 8.06233 0.00674423 7.84389 0.00674423C5.75339 -0.115109 3.86019 1.31432 3.4233 3.42098L2.64582 7.08829L10.1223 9.23478L2.573 7.70927C2.50019 7.70927 2.45086 7.70927 2.37805 7.68584C1.72271 7.6624 1.14019 8.09826 0.994557 8.75205L0.0244698 13.495C-0.121161 14.198 0.33922 14.8986 1.04388 15.0439L8.59318 16.546L0.921742 15.625L0.679807 16.7381L0.266404 18.7956C-0.193976 21.0967 1.28582 23.3487 3.61591 23.8079L30.076 29.0875C32.3826 29.5468 34.6399 28.0705 35.1003 25.7693L36.5566 18.505V18.4816L37.7944 12.2811L38.135 10.6337C38.2078 10.294 38.2807 9.90731 38.3535 9.52067C38.741 7.70458 37.5525 5.93537 35.7556 5.59793L35.758 5.60027ZM6.48154 12.4779C6.38523 12.9138 5.99532 13.2044 5.55843 13.2536C4.70813 13.3754 4.00582 12.5764 4.29708 11.7773C4.44271 11.3649 4.80679 11.0509 5.22019 11.0016C6.07048 10.8798 6.74931 11.6789 6.48154 12.4779Z" />
      </g>
      <path d="M25.9244 16.3098L22.9742 14.9764L29.7295 7.61133L15.1195 13.6454L18.0791 14.9764L11.3237 22.0767L25.9244 16.3098Z" fill="#FDB913" />
    </svg>
  );
}

export function PowerPayAppIntro() {
  const [step, setStep] = useState(reduced() ? 7 : 0);
  const [typed, setTyped] = useState(reduced() ? EMAIL.length : 0);

  useEffect(() => {
    if (reduced()) return;
    const id = window.setTimeout(() => setStep((s) => (s + 1) % STEPS.length), STEPS[step]);
    return () => window.clearTimeout(id);
  }, [step]);

  // Type the email one character at a time during step 4.
  useEffect(() => {
    if (reduced()) return;
    if (step < 4) setTyped(0);
    if (step !== 4) return;
    const id = window.setInterval(() => setTyped((t) => Math.min(EMAIL.length, t + 1)), 60);
    return () => window.clearInterval(id);
  }, [step]);

  const cls = ["ppa", `ppa--s${step}`];
  for (let i = 1; i <= step; i++) cls.push(`ppa--from${i}`);

  // Step line over the bars: AI prediction outline (drawn in a 330 × 170 box).
  const W = 330;
  const H = 170;
  const bw = W / BARS.length;
  const y = (v: number) => H - (v / 50) * H;
  let d = `M0 ${y(BARS[0])}`;
  BARS.forEach((v, i) => {
    d += ` H${(i * bw).toFixed(1)} V${y(v).toFixed(1)} H${((i + 1) * bw).toFixed(1)}`;
  });

  return (
    <div className={cls.join(" ")}>
      <div className="ppa-root">
        {/* Onboarding 0 → 2: one green circle travelling bottom → top */}
        <span className="ppa-circle" />

        {/* The logo travels from the centre to the header */}
        <PowerPayLogo className="ppa-logo" />

        {/* Authorization */}
        <section className="ppa-auth">
          <header className="ppa-auth-head">
            <span className="ppa-register">Register</span>
          </header>
          <div className="ppa-auth-body">
            <div className="ppa-auth-title">
              <svg viewBox="0 0 64 64" className="ppa-faceid" aria-hidden>
                <path d="M4 18V12a8 8 0 0 1 8-8h6M46 4h6a8 8 0 0 1 8 8v6M60 46v6a8 8 0 0 1-8 8h-6M18 60h-6a8 8 0 0 1-8-8v-6" />
                <circle cx="24" cy="32" r="6" />
                <path d="M30 32h18M40 32v6M48 32v4" />
              </svg>
              <b>Sign in to your account</b>
            </div>
            <div className="ppa-field">
              <span>{EMAIL.slice(0, typed)}</span>
              {typed > 0 && typed < EMAIL.length && <i className="ppa-caret" />}
            </div>
            <p className="ppa-forgot">Forgot password?</p>
            <div className="ppa-field ppa-field--pw">
              <span className="ppa-ph">6+ characters</span>
              <span className="ppa-dots">••••••••</span>
              <svg viewBox="0 0 24 24" className="ppa-eye" aria-hidden>
                <path d="M2 10c3 4 6 6 10 6s7-2 10-6M6 14l-2 3M12 16v3M18 14l2 3" />
              </svg>
            </div>
            <span className="ppa-signin">Sign in</span>
            <p className="ppa-or">
              <span>OR SIGN IN WITH</span>
            </p>
            <div className="ppa-social">
              <i><b style={{ color: "#4285F4" }}>G</b></i>
              <i><b style={{ color: "#1877F2" }}>f</b></i>
              <i><b style={{ color: "#0A66C2" }}>in</b></i>
              <i>
                <svg viewBox="0 0 24 24" className="ppa-apple" aria-hidden>
                  <path d="M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9-.7 0-1.8-.8-3-.8-1.6 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7c1.3 0 2.1-1.1 2.8-2.3.9-1.3 1.3-2.5 1.3-2.6 0 0-2.5-1-2.5-3.8zM14.1 5.8c.6-.8 1.1-1.8 1-2.8-.9 0-2 .6-2.7 1.4-.6.7-1.1 1.7-1 2.7 1 .1 2-.5 2.7-1.3z" />
                </svg>
              </i>
            </div>
          </div>
        </section>

        {/* Domestic/Commercial Day — Power Chart */}
        <section className="ppa-dash">
          <header className="ppa-dash-head">
            <span className="ppa-burger"><i /><i /><i /></span>
            <span className="ppa-bell"><i /></span>
            <span className="ppa-avatar" />
          </header>
          <div className="ppa-card">
            <h4 className="ppa-pc-title">Power Chart</h4>
            <div className="ppa-meter">
              <span className="ppa-meter-label">Smart meter</span>
              <span className="ppa-meter-icon" />
              <span className="ppa-meter-text">
                <b>1234567</b>
                <small>Nicosia Branch</small>
              </span>
              <span className="ppa-chev" />
            </div>
            <div className="ppa-seg">
              <b>Interval data</b>
              <span>Scalar Data</span>
            </div>
            <p className="ppa-desc">
              Detailed electricity measurements, recorded in kilowatt-hours (kWh) at 30 minute intervals. This data helps you
              understand daily energy usage patterns and identify areas where you can reduce consumption and save money.
            </p>
            <div className="ppa-daterow">
              <b>05/12/25</b>
              <span className="ppa-day">Day</span>
            </div>
            <div className="ppa-chart">
              <div className="ppa-yaxis" aria-hidden>
                {[50, 40, 30, 20, 10, 0].map((n) => (
                  <span key={n}>{n}</span>
                ))}
              </div>
              <div className="ppa-xaxis" aria-hidden>
                {["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"].map((n) => (
                  <span key={n}>{n}</span>
                ))}
              </div>
              <div className="ppa-bars">
                {BARS.map((v, i) => (
                  <span key={i} style={{ height: `${(v / 50) * 100}%`, ["--d" as string]: `${i * 18}ms` }} />
                ))}
              </div>
              <svg className="ppa-line" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden>
                <path d={d} pathLength={1} />
              </svg>
            </div>
            <div className="ppa-overview">
              <b>Detailed Overview</b>
              <p><i className="ppa-sq ppa-sq--blue" />Energy Consumption<em>12MWh</em></p>
              <p><i className="ppa-sq ppa-sq--amber" />AI Prediction<em>11,8MWh</em></p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
