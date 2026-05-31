const TAU = Math.PI * 2;
const DPR = Math.min(window.devicePixelRatio || 1, 2);

function clamp(x, lo, hi) {
  return Math.max(lo, Math.min(hi, x));
}

function randn() {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v);
}

function mix(a, b, t) {
  return a + (b - a) * t;
}

let THEME_BLEND = document.documentElement.dataset.theme === "light" ? 1 : 0;
let THEME_TARGET = THEME_BLEND;

function rgbaMix(darkRgb, lightRgb, darkAlpha, lightAlpha = darkAlpha) {
  const t = THEME_BLEND;
  const r = Math.round(mix(darkRgb[0], lightRgb[0], t));
  const g = Math.round(mix(darkRgb[1], lightRgb[1], t));
  const b = Math.round(mix(darkRgb[2], lightRgb[2], t));
  const a = mix(darkAlpha, lightAlpha, t).toFixed(3);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function rgbaPrefixMix(darkRgb, lightRgb) {
  const t = THEME_BLEND;
  const r = Math.round(mix(darkRgb[0], lightRgb[0], t));
  const g = Math.round(mix(darkRgb[1], lightRgb[1], t));
  const b = Math.round(mix(darkRgb[2], lightRgb[2], t));
  return `rgba(${r}, ${g}, ${b}, `;
}

function getThemePalette() {
  return {
    grid: rgbaMix([255, 255, 255], [15, 23, 42], 0.10, 0.10),
    gridSoft: rgbaMix([255, 255, 255], [15, 23, 42], 0.055, 0.070),
    label: rgbaMix([238, 245, 255], [15, 23, 42], 0.76, 0.78),
    labelSoft: rgbaMix([159, 176, 199], [51, 65, 85], 0.74, 0.68),
    cyan: rgbaMix([103, 232, 249], [14, 165, 233], 0.86, 0.78),
    cyanSoft: rgbaMix([103, 232, 249], [14, 165, 233], 0.42, 0.46),
    cyanStrong: rgbaMix([103, 232, 249], [2, 132, 199], 0.96, 0.96),
    cyanParticle: rgbaMix([103, 232, 249], [14, 165, 233], 0.72, 0.70),
    cyanTrace: rgbaMix([103, 232, 249], [14, 165, 233], 0.24, 0.28),
    amber: rgbaMix([251, 191, 36], [245, 158, 11], 0.92, 0.86),
    amberStroke: rgbaMix([251, 191, 36], [245, 158, 11], 0.78, 0.74),
    amberFill: rgbaMix([251, 191, 36], [245, 158, 11], 0.11, 0.12),
    amberGlow: rgbaMix([251, 191, 36], [245, 158, 11], 0.38, 0.35),
    green: rgbaMix([52, 211, 153], [16, 185, 129], 0.96, 0.96),
    greenStroke: rgbaMix([52, 211, 153], [16, 185, 129], 0.72, 0.74),
    greenGate: rgbaMix([52, 211, 153], [16, 185, 129], 0.70, 0.68),
    greenFill: rgbaMix([52, 211, 153], [16, 185, 129], 0.10, 0.11),
    greenGateFill: rgbaMix([52, 211, 153], [16, 185, 129], 0.14, 0.15),
    pinkPath: rgbaMix([244, 114, 182], [219, 39, 119], 0.64, 0.56),
    densityFade: rgbaMix([2, 6, 23], [248, 250, 252], 0.30, 0.34),
    heroLine: rgbaPrefixMix([115, 221, 255], [14, 165, 233]),
    heroAmber: rgbaPrefixMix([255, 209, 102], [245, 158, 11])
  };
}

function setupCanvas(canvas) {
  if (!canvas) {
    return {
      ctx: null,
      resize: () => {},
      size: () => ({ width: 1, height: 1 })
    };
  }

  const ctx = canvas.getContext("2d");

  const getVisibleRect = () => {
    const rect = canvas.getBoundingClientRect();
    const parent = canvas.parentElement ? canvas.parentElement.getBoundingClientRect() : rect;
    const width = rect.width || parent.width || canvas.clientWidth || 640;
    const height = rect.height || parent.height || canvas.clientHeight || 420;
    return { width, height };
  };

  const resize = () => {
    const { width, height } = getVisibleRect();
    const nextW = Math.max(1, Math.floor(width * DPR));
    const nextH = Math.max(1, Math.floor(height * DPR));

    if (canvas.width !== nextW || canvas.height !== nextH) {
      canvas.width = nextW;
      canvas.height = nextH;
    }

    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  };

  resize();
  window.addEventListener("resize", resize);

  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    if (canvas.parentElement) observer.observe(canvas.parentElement);
  }

  return { ctx, resize, size: getVisibleRect };
}

function startThemeBlendLoop() {
  const tick = () => {
    THEME_BLEND += (THEME_TARGET - THEME_BLEND) * 0.055;
    if (Math.abs(THEME_TARGET - THEME_BLEND) < 0.001) {
      THEME_BLEND = THEME_TARGET;
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function initThemeToggle() {
  const root = document.documentElement;
  const button = document.getElementById("themeToggle");
  if (!button) return;

  const icon = button.querySelector(".theme-toggle-icon");
  const text = button.querySelector(".theme-toggle-text");

  const updateButton = () => {
    const isLight = root.dataset.theme === "light";
    THEME_TARGET = isLight ? 1 : 0;
    if (icon) icon.textContent = isLight ? "☾" : "☀";
    if (text) text.textContent = isLight ? "Dark" : "Light";
    button.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
    button.setAttribute("aria-pressed", String(isLight));
  };

  button.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "light" ? "dark" : "light";
    root.classList.add("theme-changing");
    root.dataset.theme = nextTheme;
    localStorage.setItem("akan-theme", nextTheme);
    updateButton();

    window.clearTimeout(window.__akanThemeTimer);
    window.__akanThemeTimer = window.setTimeout(() => {
      root.classList.remove("theme-changing");
    }, 1200);
  });

  updateButton();
}

function revealOnScroll() {
  const revealElements = document.querySelectorAll("[data-reveal]");

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach(el => el.classList.add("revealed"));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.10 });

  revealElements.forEach(el => observer.observe(el));
}

function linkSlider(id, formatter = x => Number(x).toFixed(2)) {
  const slider = document.getElementById(id);
  const value = document.getElementById(`${id}Val`);

  if (!slider) {
    return { value: 0, addEventListener: () => {} };
  }

  const update = () => {
    if (value) value.textContent = formatter(slider.value);
  };

  slider.addEventListener("input", update);
  update();
  return slider;
}

function drawEllipse(ctx, cx, cy, rx, ry, angle, stroke, fill) {
  if (!ctx) return;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.ellipse(0, 0, rx, ry, 0, 0, TAU);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();
}

function heroBackground() {
  const canvas = document.getElementById("heroCanvas");
  const { ctx, size } = setupCanvas(canvas);
  if (!ctx) return;

  const particles = Array.from({ length: 90 }, (_, i) => ({
    x: Math.random(),
    y: Math.random(),
    r: 0.75 + Math.random() * 1.8,
    a: Math.random() * TAU,
    s: 0.001 + Math.random() * 0.0022,
    warm: i % 7 === 0
  }));

  function draw(t) {
    const { width: w, height: h } = size();
    const palette = getThemePalette();
    ctx.clearRect(0, 0, w, h);

    for (const p of particles) {
      p.a += p.s;
      const x = p.x * w + Math.cos(p.a + t * 0.00013) * 25;
      const y = p.y * h + Math.sin(p.a * 0.73 + t * 0.00017) * 25;
      ctx.beginPath();
      ctx.arc(x, y, p.r, 0, TAU);
      ctx.fillStyle = `${p.warm ? palette.heroAmber : palette.heroLine}${0.11 + 0.16 * (0.5 + 0.5 * Math.sin(p.a))})`;
      ctx.fill();
    }

    ctx.lineWidth = 1;
    for (let i = 0; i < particles.length; i += 1) {
      for (let j = i + 1; j < particles.length; j += 9) {
        const pi = particles[i];
        const pj = particles[j];
        const xi = pi.x * w + Math.cos(pi.a + t * 0.00013) * 25;
        const yi = pi.y * h + Math.sin(pi.a * 0.73 + t * 0.00017) * 25;
        const xj = pj.x * w + Math.cos(pj.a + t * 0.00013) * 25;
        const yj = pj.y * h + Math.sin(pj.a * 0.73 + t * 0.00017) * 25;
        const d = Math.hypot(xi - xj, yi - yj);
        if (d < 135) {
          ctx.strokeStyle = `${palette.heroLine}${0.04 * (1 - d / 135)})`;
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
  if (!ctx) return;

  let t = 0;
  const traces = Array.from({ length: 34 }, (_, i) => ({
    r: 18 + i * 4.8,
    a: Math.random() * TAU,
    speed: 0.008 + 0.0007 * i
  }));

  function draw() {
    const { width: w, height: h } = size();
    const palette = getThemePalette();
    t += 0.012;
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;

    ctx.strokeStyle = palette.gridSoft;
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 34) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 34) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    for (const tr of traces) {
      tr.a += tr.speed;
      ctx.beginPath();
      for (let k = 0; k < 140; k += 1) {
        const q = tr.a - k * 0.045;
        const rad = tr.r + 18 * Math.sin(q * 2.1 + t);
        const x = cx + Math.cos(q) * rad * 1.35;
        const y = cy + Math.sin(q * 1.18) * rad * 0.78;
        if (k === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = palette.cyanTrace;
      ctx.stroke();

      const px = cx + Math.cos(tr.a) * tr.r * 1.35;
      const py = cy + Math.sin(tr.a * 1.18) * tr.r * 0.78;
      ctx.beginPath();
      ctx.arc(px, py, 2.5, 0, TAU);
      ctx.fillStyle = palette.amber;
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  draw();
}

function covarianceDemo() {
  const canvas = document.getElementById("covCanvas");
  const { ctx, size, resize } = setupCanvas(canvas);
  if (!ctx) return;

  const gain = linkSlider("covGain");
  const noise = linkSlider("covNoise");
  const target = linkSlider("covTarget", x => `${x}px`);

  let particles = [];
  function reset() {
    resize();
    const { width: w, height: h } = size();
    particles = Array.from({ length: 220 }, () => ({
      x: w * 0.22 + randn() * 58,
      y: h * 0.54 + randn() * 92,
      vx: randn() * 0.2,
      vy: randn() * 0.2
    }));
  }

  reset();
  window.addEventListener("resize", reset);

  function draw() {
    const { width: w, height: h } = size();
    const palette = getThemePalette();
    ctx.clearRect(0, 0, w, h);

    const g = Number(gain.value);
    const sig = Number(noise.value);
    const spread = Number(target.value);
    const tx = w * 0.75;
    const ty = h * 0.48;

    drawEllipse(ctx, w * 0.22, h * 0.54, 62, 100, -0.18, palette.amberStroke, palette.amberFill);
    drawEllipse(ctx, tx, ty, spread * 1.45, spread * 0.72, 0.32, palette.greenStroke, palette.greenFill);

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
      ctx.fillStyle = palette.cyan;
      ctx.fill();
    }

    ctx.fillStyle = palette.label;
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
  if (!ctx) return;

  const potential = linkSlider("denPotential");
  const noise = linkSlider("denNoise");
  const curl = linkSlider("denCurl");
  const particles = Array.from({ length: 420 }, () => ({ x: Math.random(), y: Math.random() }));

  function draw() {
    const { width: w, height: h } = size();
    const palette = getThemePalette();

    ctx.fillStyle = palette.densityFade;
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
        ctx.strokeStyle = palette.grid;
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
      ctx.fillStyle = palette.cyanSoft;
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  draw();
}

function orbitDemo() {
  const canvas = document.getElementById("orbCanvas");
  const { ctx, size } = setupCanvas(canvas);
  if (!ctx) return;

  const disp = linkSlider("orbDisp", x => `${x}px`);
  const pert = linkSlider("orbPert");
  const gain = linkSlider("orbGain");
  let t = 0;
  const particles = Array.from({ length: 150 }, () => ({
    a: Math.random() * TAU,
    dr: randn(),
    da: randn() * 0.02
  }));

  function draw() {
    const { width: w, height: h } = size();
    const palette = getThemePalette();
    t += 0.01;
    ctx.clearRect(0, 0, w, h);

    const cx = w * 0.5;
    const cy = h * 0.5;
    const rx = w * 0.29;
    const ry = h * 0.28;
    const D = Number(disp.value);
    const P = Number(pert.value);
    const G = Number(gain.value);

    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, -0.15, 0, TAU);
    ctx.strokeStyle = palette.grid;
    ctx.lineWidth = 1.6;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, 10, 0, TAU);
    ctx.fillStyle = palette.amber;
    ctx.shadowColor = palette.amberGlow;
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
      ctx.fillStyle = palette.cyanParticle;
      ctx.fill();
    }

    const na = t;
    ctx.beginPath();
    ctx.arc(cx + Math.cos(na) * rx, cy + Math.sin(na) * ry, 4, 0, TAU);
    ctx.fillStyle = palette.green;
    ctx.fill();

    ctx.fillStyle = palette.labelSoft;
    ctx.font = "12px JetBrains Mono, monospace";
    ctx.fillText("uncertainty cloud", 22, 26);

    requestAnimationFrame(draw);
  }

  draw();
}

function correctionDemo() {
  const canvas = document.getElementById("midCanvas");
  const { ctx, size } = setupCanvas(canvas);
  if (!ctx) return;

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

  function drawPath(w, h, error, corrected, color, width) {
    ctx.beginPath();
    for (let i = 0; i <= 150; i += 1) {
      const s = i / 150;
      const p = pathPoint(s, error, corrected);
      const x = p.x * w;
      const y = p.y * h;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
  }

  function draw() {
    const { width: w, height: h } = size();
    const palette = getThemePalette();
    t += 0.035;
    ctx.clearRect(0, 0, w, h);

    const E = Number(err.value);
    const G = Number(gain.value);

    ctx.strokeStyle = palette.grid;
    ctx.lineWidth = 1;
    for (let y = 0; y < h; y += 34) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    const gateX = w * 0.92;
    const gateY = h * 0.29;
    ctx.strokeStyle = palette.greenGate;
    ctx.lineWidth = 2;
    ctx.strokeRect(gateX - 10, gateY - 48, 20, 96);
    ctx.fillStyle = palette.greenGateFill;
    ctx.fillRect(gateX - 10, gateY - 48, 20, 96);

    drawPath(w, h, E, false, palette.pinkPath, 3);
    drawPath(w, h, E / (1 + G * 1.6), true, palette.cyanStrong, 4);

    for (let i = 0; i < 18; i += 1) {
      const s = i / 17;
      const p = pathPoint(s, E / (1 + G * 1.6), true);
      ctx.beginPath();
      ctx.arc(p.x * w, p.y * h, 3, 0, TAU);
      ctx.fillStyle = i === 17 ? palette.green : palette.cyanParticle;
      ctx.fill();
    }

    ctx.fillStyle = palette.label;
    ctx.font = "12px JetBrains Mono, monospace";
    ctx.fillText("uncorrected", 24, 26);
    ctx.fillStyle = palette.cyan;
    ctx.fillText("corrected", 24, 48);

    requestAnimationFrame(draw);
  }

  draw();
}

function initTabs() {
  const buttons = Array.from(document.querySelectorAll(".tab-button"));
  const panels = Array.from(document.querySelectorAll(".demo-panel"));

  if (!buttons.length || !panels.length) return;

  const activate = demoName => {
    buttons.forEach(button => {
      const active = button.dataset.demo === demoName;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
      button.tabIndex = active ? 0 : -1;
    });

    panels.forEach(panel => {
      panel.classList.toggle("active", panel.id === `demo-${demoName}`);
    });

    requestAnimationFrame(() => {
      window.dispatchEvent(new Event("resize"));
    });
  };

  buttons.forEach(button => {
    button.addEventListener("click", event => {
      event.preventDefault();
      activate(button.dataset.demo);
    });

    button.addEventListener("keydown", event => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      event.preventDefault();
      const index = buttons.indexOf(button);
      const nextIndex = event.key === "ArrowRight"
        ? (index + 1) % buttons.length
        : (index - 1 + buttons.length) % buttons.length;
      buttons[nextIndex].focus();
      activate(buttons[nextIndex].dataset.demo);
    });
  });

  const initiallyActive = buttons.find(button => button.classList.contains("active")) || buttons[0];
  activate(initiallyActive.dataset.demo);
}

function initSite() {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  startThemeBlendLoop();
  initThemeToggle();
  revealOnScroll();
  initTabs();

  heroBackground();
  phasePortrait();
  covarianceDemo();
  densityDemo();
  orbitDemo();
  correctionDemo();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSite);
} else {
  initSite();
}
