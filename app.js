const TAU = Math.PI * 2;
const DPR = Math.min(window.devicePixelRatio || 1, 2);

function setupCanvas(canvas) {
  const ctx = canvas.getContext("2d");
  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.floor(rect.width * DPR));
    canvas.height = Math.max(1, Math.floor(rect.height * DPR));
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  };
  resize();
  window.addEventListener("resize", resize);
  return { ctx, size: () => canvas.getBoundingClientRect() };
}

function clamp(x, lo, hi) { return Math.max(lo, Math.min(hi, x)); }
function randn() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v);
}



function getThemePalette() {
  const light = document.documentElement.dataset.theme === "light";
  if (light) {
    return {
      grid: "rgba(15,23,42,0.09)",
      gridSoft: "rgba(15,23,42,0.055)",
      label: "rgba(15,23,42,0.72)",
      labelSoft: "rgba(15,23,42,0.58)",
      cyan: "rgba(14,165,233,0.78)",
      cyanSoft: "rgba(14,165,233,0.44)",
      cyanStrong: "rgba(2,132,199,0.95)",
      cyanParticle: "rgba(14,165,233,0.62)",
      cyanTrace: "rgba(14,165,233,0.24)",
      amber: "rgba(245,158,11,0.82)",
      amberStroke: "rgba(245,158,11,0.72)",
      amberFill: "rgba(245,158,11,0.10)",
      amberGlow: "rgba(245,158,11,0.35)",
      green: "rgba(16,185,129,0.95)",
      greenStroke: "rgba(16,185,129,0.72)",
      greenGate: "rgba(16,185,129,0.65)",
      greenFill: "rgba(16,185,129,0.10)",
      greenGateFill: "rgba(16,185,129,0.14)",
      pinkPath: "rgba(219,39,119,0.52)",
      densityFade: "rgba(248,250,252,0.30)",
      heroLine: "rgba(14,165,233,",
      heroAmber: "rgba(245,158,11,"
    };
  }

  return {
    grid: "rgba(255,255,255,0.10)",
    gridSoft: "rgba(255,255,255,0.055)",
    label: "rgba(238,245,255,0.74)",
    labelSoft: "rgba(159,176,199,0.74)",
    cyan: "rgba(103,232,249,0.82)",
    cyanSoft: "rgba(103,232,249,0.42)",
    cyanStrong: "rgba(103,232,249,0.94)",
    cyanParticle: "rgba(103,232,249,0.68)",
    cyanTrace: "rgba(103,232,249,0.22)",
    amber: "rgba(251,191,36,0.88)",
    amberStroke: "rgba(251,191,36,0.78)",
    amberFill: "rgba(251,191,36,0.11)",
    amberGlow: "rgba(251,191,36,0.38)",
    green: "rgba(52,211,153,0.95)",
    greenStroke: "rgba(52,211,153,0.72)",
    greenGate: "rgba(52,211,153,0.68)",
    greenFill: "rgba(52,211,153,0.10)",
    greenGateFill: "rgba(52,211,153,0.14)",
    pinkPath: "rgba(244,114,182,0.58)",
    densityFade: "rgba(2,6,23,0.30)",
    heroLine: "rgba(115,221,255,",
    heroAmber: "rgba(255,209,102,"
  };
}

function initThemeToggle() {
  const root = document.documentElement;
  const button = document.getElementById("themeToggle");
  if (!button) return;

  function updateButton() {
    const isLight = root.dataset.theme === "light";
    button.querySelector(".theme-toggle-icon").textContent = isLight ? "☾" : "☀";
    button.querySelector(".theme-toggle-text").textContent = isLight ? "Dark" : "Light";
    button.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
  }

  button.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = nextTheme;
    localStorage.setItem("akan-theme", nextTheme);
    updateButton();
    window.dispatchEvent(new Event("resize"));
  });

  updateButton();
}

function revealOnScroll() {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) entry.target.classList.add("revealed");
    }
  }, { threshold: 0.12 });
  document.querySelectorAll("[data-reveal]").forEach(el => observer.observe(el));
}

function heroBackground() {
  const canvas = document.getElementById("heroCanvas");
  const { ctx, size } = setupCanvas(canvas);
  const particles = Array.from({ length: 90 }, (_, i) => ({
    x: Math.random(),
    y: Math.random(),
    r: 0.7 + Math.random() * 1.8,
    a: Math.random() * TAU,
    s: 0.001 + Math.random() * 0.002,
    hue: i % 7 === 0 ? "rgba(255,209,102," : "rgba(115,221,255,"
  }));

  function draw(t) {
    const { width: w, height: h } = size();
    ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
      p.a += p.s;
      const x = p.x * w + Math.cos(p.a + t * 0.00013) * 25;
      const y = p.y * h + Math.sin(p.a * 0.73 + t * 0.00017) * 25;
      ctx.beginPath();
      ctx.arc(x, y, p.r, 0, TAU);
      const c = getThemePalette();
      ctx.fillStyle = `${p.hue.includes("255,209") ? c.heroAmber : c.heroLine}${0.10 + 0.18 * Math.sin(p.a)})`;
      ctx.fill();
    }

    ctx.lineWidth = 1;
    for (let i = 0; i < particles.length; i += 1) {
      for (let j = i + 1; j < particles.length; j += 9) {
        const pi = particles[i], pj = particles[j];
        const xi = pi.x * w + Math.cos(pi.a + t * 0.00013) * 25;
        const yi = pi.y * h + Math.sin(pi.a * 0.73 + t * 0.00017) * 25;
        const xj = pj.x * w + Math.cos(pj.a + t * 0.00013) * 25;
        const yj = pj.y * h + Math.sin(pj.a * 0.73 + t * 0.00017) * 25;
        const d = Math.hypot(xi - xj, yi - yj);
        if (d < 135) {
          ctx.strokeStyle = `${getThemePalette().heroLine}${0.035 * (1 - d / 135)})`;
          ctx.beginPath();
          ctx.moveTo(xi, yi);
          ctx.lineTo(xj, yj);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
}

function phasePortrait() {
  const canvas = document.getElementById("phaseCanvas");
  const { ctx, size } = setupCanvas(canvas);
  let t = 0;
  const traces = Array.from({ length: 34 }, (_, i) => ({
    r: 18 + i * 4.8,
    a: Math.random() * TAU,
    speed: 0.008 + 0.0007 * i,
  }));

  function draw() {
    const { width: w, height: h } = size();
    t += 0.012;
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;

    ctx.strokeStyle = getThemePalette().gridSoft;
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 34) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for (let y = 0; y < h; y += 34) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

    for (const tr of traces) {
      tr.a += tr.speed;
      ctx.beginPath();
      for (let k = 0; k < 140; k++) {
        const q = tr.a - k * 0.045;
        const rad = tr.r + 18 * Math.sin(q * 2.1 + t);
        const x = cx + Math.cos(q) * rad * 1.35;
        const y = cy + Math.sin(q * 1.18) * rad * 0.78;
        if (k === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = getThemePalette().cyanTrace;
      ctx.stroke();
      const px = cx + Math.cos(tr.a) * tr.r * 1.35;
      const py = cy + Math.sin(tr.a * 1.18) * tr.r * 0.78;
      ctx.beginPath();
      ctx.arc(px, py, 2.5, 0, TAU);
      ctx.fillStyle = getThemePalette().amber;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  draw();
}

function linkSlider(id, formatter = x => Number(x).toFixed(2)) {
  const slider = document.getElementById(id);
  const value = document.getElementById(id + "Val");
  const update = () => { value.textContent = formatter(slider.value); };
  slider.addEventListener("input", update);
  update();
  return slider;
}

function drawEllipse(ctx, cx, cy, rx, ry, angle, stroke, fill) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.ellipse(0, 0, rx, ry, 0, 0, TAU);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();
}

function covarianceDemo() {
  const canvas = document.getElementById("covCanvas");
  const { ctx, size } = setupCanvas(canvas);
  const gain = linkSlider("covGain");
  const noise = linkSlider("covNoise");
  const target = linkSlider("covTarget", x => `${x}px`);

  let particles = [];
  function reset() {
    const { width: w, height: h } = size();
    particles = Array.from({ length: 220 }, () => ({
      x: w * 0.22 + randn() * 58,
      y: h * 0.54 + randn() * 92,
      vx: randn() * 0.2,
      vy: randn() * 0.2,
    }));
  }
  reset();
  window.addEventListener("resize", reset);

  function draw() {
    const { width: w, height: h } = size();
    ctx.clearRect(0, 0, w, h);
    const g = Number(gain.value);
    const sig = Number(noise.value);
    const spread = Number(target.value);
    const tx = w * 0.75, ty = h * 0.48;

    drawEllipse(ctx, w * 0.22, h * 0.54, 62, 100, -0.18, getThemePalette().amberStroke, getThemePalette().amberFill);
    drawEllipse(ctx, tx, ty, spread * 1.45, spread * 0.72, 0.32, getThemePalette().greenStroke, getThemePalette().greenFill);

    for (const p of particles) {
      const dx = tx - p.x;
      const dy = ty - p.y;
      const localX = Math.cos(0.32) * dx + Math.sin(0.32) * dy;
      const localY = -Math.sin(0.32) * dx + Math.cos(0.32) * dy;
      const ax = g * dx * 0.0012 - 0.000002 * localX * Math.abs(localX);
      const ay = g * dy * 0.0012 - 0.000004 * localY * Math.abs(localY);
      p.vx = 0.964 * p.vx + ax + sig * randn() * 0.115;
      p.vy = 0.964 * p.vy + ay + sig * randn() * 0.115;
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -40 || p.x > w + 40 || p.y < -40 || p.y > h + 40) {
        p.x = w * 0.22 + randn() * 58;
        p.y = h * 0.54 + randn() * 92;
        p.vx = randn() * 0.2;
        p.vy = randn() * 0.2;
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.1, 0, TAU);
      ctx.fillStyle = getThemePalette().cyan;
      ctx.fill();
    }

    ctx.fillStyle = getThemePalette().label;
    ctx.font = "12px JetBrains Mono, monospace";
    ctx.fillText("initial law", w * 0.08, h * 0.16);
    ctx.fillText("target law", w * 0.66, h * 0.18);
    requestAnimationFrame(draw);
  }
  draw();
}

function densityDemo() {
  const canvas = document.getElementById("denCanvas");
  const { ctx, size } = setupCanvas(canvas);
  const potential = linkSlider("denPotential");
  const noise = linkSlider("denNoise");
  const curl = linkSlider("denCurl");
  const particles = Array.from({ length: 420 }, () => ({ x: Math.random(), y: Math.random() }));

  function draw() {
    const { width: w, height: h } = size();
    ctx.fillStyle = getThemePalette().densityFade;
    ctx.fillRect(0, 0, w, h);
    const pot = Number(potential.value);
    const sig = Number(noise.value);
    const rot = Number(curl.value);

    for (let gx = 28; gx < w; gx += 42) {
      for (let gy = 28; gy < h; gy += 42) {
        const x = (gx / w - 0.5) * 2;
        const y = (gy / h - 0.5) * 2;
        const fx = -pot * x + rot * -y + 0.25 * Math.sin(3 * y);
        const fy = -pot * y + rot * x + 0.25 * Math.cos(3 * x);
        const mag = Math.hypot(fx, fy) + 1e-6;
        ctx.strokeStyle = getThemePalette().grid;
        ctx.beginPath();
        ctx.moveTo(gx, gy);
        ctx.lineTo(gx + 13 * fx / mag, gy + 13 * fy / mag);
        ctx.stroke();
      }
    }

    for (const p of particles) {
      const x = (p.x - 0.5) * 2;
      const y = (p.y - 0.5) * 2;
      const fx = -pot * x + rot * -y + 0.25 * Math.sin(3 * y);
      const fy = -pot * y + rot * x + 0.25 * Math.cos(3 * x);
      p.x += 0.0035 * fx + sig * randn() * 0.0018;
      p.y += 0.0035 * fy + sig * randn() * 0.0018;
      if (p.x < 0 || p.x > 1 || p.y < 0 || p.y > 1) {
        p.x = 0.5 + randn() * 0.22;
        p.y = 0.5 + randn() * 0.22;
      }
      p.x = clamp(p.x, 0, 1);
      p.y = clamp(p.y, 0, 1);
      ctx.beginPath();
      ctx.arc(p.x * w, p.y * h, 1.7, 0, TAU);
      ctx.fillStyle = getThemePalette().cyanSoft;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  draw();
}

function orbitDemo() {
  const canvas = document.getElementById("orbCanvas");
  const { ctx, size } = setupCanvas(canvas);
  const disp = linkSlider("orbDisp", x => `${x}px`);
  const pert = linkSlider("orbPert");
  const gain = linkSlider("orbGain");
  let t = 0;
  const particles = Array.from({ length: 150 }, () => ({ a: Math.random() * TAU, dr: randn(), da: randn() * 0.02 }));

  function draw() {
    const { width: w, height: h } = size();
    t += 0.01;
    ctx.clearRect(0, 0, w, h);
    const cx = w * 0.5, cy = h * 0.5;
    const rx = w * 0.29, ry = h * 0.28;
    const D = Number(disp.value);
    const P = Number(pert.value);
    const G = Number(gain.value);

    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, -0.15, 0, TAU);
    ctx.strokeStyle = getThemePalette().grid;
    ctx.lineWidth = 1.6;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, 10, 0, TAU);
    ctx.fillStyle = getThemePalette().amber;
    ctx.shadowColor = getThemePalette().amberGlow;
    ctx.shadowBlur = 20;
    ctx.fill();
    ctx.shadowBlur = 0;

    for (const p of particles) {
      const stretch = 1 + P * 0.42 * Math.sin(2 * (p.a + t));
      const correction = Math.exp(-G * 0.9);
      const localRx = rx + D * p.dr * stretch * correction;
      const localRy = ry + D * 0.62 * p.dr * (1.2 - stretch * 0.4) * correction;
      const a = p.a + t + P * 0.06 * Math.sin(t * 2 + p.dr);
      const x = cx + Math.cos(a + p.da) * localRx;
      const y = cy + Math.sin(a + p.da) * localRy;
      ctx.beginPath();
      ctx.arc(x, y, 1.8, 0, TAU);
      ctx.fillStyle = getThemePalette().cyanParticle;
      ctx.fill();
    }

    const na = t;
    ctx.beginPath();
    ctx.arc(cx + Math.cos(na) * rx, cy + Math.sin(na) * ry, 4, 0, TAU);
    ctx.fillStyle = getThemePalette().green;
    ctx.fill();
    ctx.fillStyle = getThemePalette().labelSoft;
    ctx.font = "12px JetBrains Mono, monospace";
    ctx.fillText("uncertainty cloud", 22, 26);
    requestAnimationFrame(draw);
  }
  draw();
}

function correctionDemo() {
  const canvas = document.getElementById("midCanvas");
  const { ctx, size } = setupCanvas(canvas);
  const err = linkSlider("midErr");
  const gain = linkSlider("midGain");
  const unc = linkSlider("midUnc");
  let t = 0;

  function pathPoint(s, error, corrected) {
    const bend = Math.sin(s * Math.PI) * (corrected ? 0.4 / (1 + Number(gain.value)) : 1.0);
    const uncertainty = Number(unc.value) * Math.sin(8 * s + t) * 0.035;
    return {
      x: 0.08 + 0.84 * s,
      y: 0.72 - 0.43 * s + error * 0.34 * bend + uncertainty
    };
  }

  function drawPath(ctx, w, h, error, corrected, color, width) {
    ctx.beginPath();
    for (let i = 0; i <= 150; i++) {
      const s = i / 150;
      const p = pathPoint(s, error, corrected);
      const x = p.x * w;
      const y = p.y * h;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
  }

  function draw() {
    const { width: w, height: h } = size();
    t += 0.035;
    ctx.clearRect(0, 0, w, h);
    const E = Number(err.value);
    const G = Number(gain.value);

    ctx.strokeStyle = getThemePalette().grid;
    ctx.lineWidth = 1;
    for (let y = 0; y < h; y += 34) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

    const gateX = w * 0.92, gateY = h * 0.29;
    ctx.strokeStyle = getThemePalette().greenGate;
    ctx.lineWidth = 2;
    ctx.strokeRect(gateX - 10, gateY - 48, 20, 96);
    ctx.fillStyle = getThemePalette().greenGateFill;
    ctx.fillRect(gateX - 10, gateY - 48, 20, 96);

    drawPath(ctx, w, h, E, false, getThemePalette().pinkPath, 3);
    drawPath(ctx, w, h, E / (1 + G * 1.6), true, getThemePalette().cyanStrong, 4);

    for (let i = 0; i < 18; i++) {
      const s = i / 17;
      const p = pathPoint(s, E / (1 + G * 1.6), true);
      ctx.beginPath();
      ctx.arc(p.x * w, p.y * h, 3, 0, TAU);
      ctx.fillStyle = i === 17 ? getThemePalette().green : getThemePalette().cyanParticle;
      ctx.fill();
    }

    ctx.fillStyle = getThemePalette().label;
    ctx.font = "12px JetBrains Mono, monospace";
    ctx.fillText("uncorrected", 24, 26);
    ctx.fillStyle = getThemePalette().cyan;
    ctx.fillText("corrected", 24, 48);
    requestAnimationFrame(draw);
  }
  draw();
}

function tabs() {
  const buttons = document.querySelectorAll(".tab-button");
  const panels = {
    covariance: document.getElementById("demo-covariance"),
    density: document.getElementById("demo-density"),
    orbit: document.getElementById("demo-orbit"),
    correction: document.getElementById("demo-correction"),
  };
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      Object.values(panels).forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      panels[btn.dataset.demo].classList.add("active");
      setTimeout(() => window.dispatchEvent(new Event("resize")), 0);
    });
  });
}

window.addEventListener("load", () => {
  document.getElementById("year").textContent = new Date().getFullYear();
  initThemeToggle();
  revealOnScroll();
  heroBackground();
  phasePortrait();
  tabs();
  covarianceDemo();
  densityDemo();
  orbitDemo();
  correctionDemo();
});
