/* ============================================================
   CUSTOM CURSOR (Desktop only — hidden on touch devices)
   ============================================================ */
const cursor = document.getElementById('cursor'), ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
const isDesktop = window.matchMedia("(pointer: fine)").matches;

if (isDesktop) {
  document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
  // Hide default cursor on ALL elements
  document.documentElement.style.setProperty('cursor', 'none', 'important');
  // Also inject a style to catch everything
  const cursorStyle = document.createElement('style');
  cursorStyle.textContent = '*, *::before, *::after { cursor: none !important; } iframe { cursor: default !important; }';
  document.head.appendChild(cursorStyle);

  (function ani() {
    cursor.style.transform = `translate(${mx - 4}px,${my - 4}px)`;
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.transform = `translate(${rx - 16}px,${ry - 16}px)`;
    requestAnimationFrame(ani);
  })();
} else {
  // Touch device — remove custom cursor elements entirely
  if (cursor) cursor.remove();
  if (ring) ring.remove();
  document.body.style.cursor = 'auto';
}

/* ============================================================
   NAVBAR SCROLL
   ============================================================ */
window.addEventListener('scroll', () => { document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 40); });

/* ============================================================
   PALETTES + THEME
   ============================================================ */
const html = document.documentElement, btn = document.getElementById('themeToggle');

const palettes = [
  { name: 'ferrari',      dark: '#EF1A2D', dark2: '#FF4A5A', light: '#A6051A', light2: '#73000E' },
  { name: 'mclaren',      dark: '#FF8700', dark2: '#FFA842', light: '#C26600', light2: '#8F4B00' },
  { name: 'red bull',     dark: '#3330FF', dark2: '#FFEA33', light: '#0600EF', light2: '#030078' },
  { name: 'mercedes',     dark: '#00D2BE', dark2: '#E0E6ED', light: '#007A6E', light2: '#004F47' },
  { name: 'alpine',       dark: '#FF66D6', dark2: '#3385FF', light: '#FD4BC7', light2: '#0058BB' },
  { name: 'aston martin', dark: '#00A699', dark2: '#E4F533', light: '#00665E', light2: '#00423D' },
  { name: 'williams',     dark: '#33C5FF', dark2: '#335CFF', light: '#00A3E0', light2: '#041E42' },
  { name: 'haas',         dark: '#FF3352', dark2: '#E0E0E0', light: '#E6002B', light2: '#202020' },
  { name: 'audi',         dark: '#FF244D', dark2: '#CCCCCC', light: '#D40026', light2: '#1A1A1A' },
  { name: 'racing bulls', dark: '#3B5CFF', dark2: '#FF3333', light: '#1534CC', light2: '#B30000' },
  { name: 'cadillac',     dark: '#FFCE33', dark2: '#FF4752', light: '#C99B00', light2: '#8F141B' }
];

const goTop = document.getElementById('goTop');
window.addEventListener('scroll', () => {
  goTop.classList.toggle('visible', window.scrollY > 400);
});

function applyPalette(p, theme) {
  const isDark = (theme || html.getAttribute('data-theme')) === 'dark';
  const activeAccent = isDark ? p.dark : p.light;
  const activeBg = isDark ? '#161616' : '#e5e5e3';

  html.style.setProperty('--accent', activeAccent);
  html.style.setProperty('--accent2', isDark ? p.dark2 : p.light2);
  document.getElementById('colorDot').style.background = activeAccent;
  document.getElementById('colorName').textContent = p.name;

  // Dynamic favicon
  const cvs = document.createElement('canvas');
  cvs.width = 64; cvs.height = 64;
  const ctx = cvs.getContext('2d');
  ctx.fillStyle = activeBg;
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(0, 0, 64, 64, 14); else ctx.fillRect(0, 0, 64, 64);
  ctx.fill();
  ctx.fillStyle = activeAccent;
  ctx.font = 'bold 30px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('OB', 32, 34);

  let link = document.querySelector("link[rel~='icon']");
  if (!link) { link = document.createElement('link'); link.rel = 'icon'; document.head.appendChild(link); }
  link.href = cvs.toDataURL('image/png');
}

const initIdx = +(html.dataset.palette || 0);
applyPalette(palettes[initIdx]);

const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('theme') || (systemPrefersDark ? 'dark' : 'light');
html.setAttribute('data-theme', savedTheme);
applyPalette(palettes[initIdx], savedTheme);

btn.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  applyPalette(palettes[+(html.dataset.palette || 0)], next);
});

// 1. Extract the random color logic into a reusable function
function randomizeColor() {
  let newIdx;
  const cur = +(html.dataset.palette || 0);
  do { newIdx = Math.floor(Math.random() * palettes.length); } while (newIdx === cur);
  html.dataset.palette = newIdx;
  sessionStorage.setItem('paletteIdx', newIdx);
  applyPalette(palettes[newIdx]);
}

// 2. Set up the automatic interval (15000 milliseconds = 15 seconds)
let colorCycleTimer = setInterval(randomizeColor, 15000);

// 3. Update the button click to use the function AND reset the timer
document.getElementById('colorBtn').addEventListener('click', () => {
  randomizeColor();
  
  // Reset the timer so it doesn't automatically change again right after a manual click
  clearInterval(colorCycleTimer);
  colorCycleTimer = setInterval(randomizeColor, 15000);
});

/* ============================================================
   TYPED TEXT
   ============================================================ */
const roles = ['QA Automation Engineer', 'ML Researcher', 'Software Development Engineer','Software Development Engineer in Test', 'CS Graduate Student'];
let ri = 0, ci = 0, del = false;
const te = document.getElementById('typed-text');
function type() {
  const r = roles[ri];
  if (!del) {
    ci++;
    te.innerHTML = `MS CS @ UMass Amherst · ${r.slice(0, ci)}<span class="typed-cursor">|</span>`;
    if (ci === r.length) { del = true; setTimeout(type, 2000); return; }
  } else {
    ci--;
    te.innerHTML = `MS CS @ UMass Amherst · ${r.slice(0, ci)}<span class="typed-cursor">|</span>`;
    if (ci === 0) { del = false; ri = (ri + 1) % roles.length; }
  }
  setTimeout(type, del ? 40 : 80);
}
setTimeout(type, 1500);

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
const obs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) setTimeout(() => e.target.classList.add('visible'), i * 80);
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

/* ============================================================
   PDF MODAL
   ============================================================ */
let currentPdfUrl = '';
function openPDF(url, title, journal) {
  currentPdfUrl = url;
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalJournal').textContent = '// ' + journal;
  document.getElementById('modalOpenLink').href = url;
  document.getElementById('fallbackLink').href = url;
  document.getElementById('pdfLoading').style.display = 'flex';
  document.getElementById('pdfFallback').classList.remove('show');
  document.getElementById('pdfModal').classList.add('open');
  document.body.style.overflow = 'hidden';

  const frame = document.getElementById('pdfFrame');
  frame.src = '';

  const isDOI = url.includes('doi.org');

  if (isDOI) {
    window.open(url, '_blank');
    document.getElementById('pdfLoading').style.display = 'none';
    document.getElementById('pdfFallback').classList.add('show');
    document.getElementById('fallbackMsg').innerHTML =
      '<span>// opened in new tab</span>This paper was opened in a new tab since the publisher does not support embedded viewing. If nothing opened, click the button below.';
  } else {
    frame.src = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
    let timer = setTimeout(showFallback, 10000);
    frame.onload = () => { clearTimeout(timer); document.getElementById('pdfLoading').style.display = 'none'; };
    frame.onerror = () => { clearTimeout(timer); showFallback(); };
  }
}

function showFallback() {
  document.getElementById('pdfLoading').style.display = 'none';
  document.getElementById('pdfFallback').classList.add('show');
  document.getElementById('fallbackMsg').innerHTML =
    '<span>// viewer unavailable</span>Google Docs viewer couldn\'t load this PDF. Click below to open it directly.';
}

function closePDF() {
  document.getElementById('pdfModal').classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { document.getElementById('pdfFrame').src = ''; }, 300);
}

// PDF iframe cursor handling (desktop only)
if (isDesktop) {
  document.getElementById('pdfFrame').addEventListener('mouseenter', () => {
    cursor.style.opacity = '0'; ring.style.opacity = '0';
  });
  document.getElementById('pdfFrame').addEventListener('mouseleave', () => {
    cursor.style.opacity = '1'; ring.style.opacity = '0.4';
  });
}

document.getElementById('pdfModal').addEventListener('click', function (e) { if (e.target === this) closePDF(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closePDF(); });

const telemetry = document.getElementById('telemetryData');

  (function ani() {
    cursor.style.transform = `translate(${mx - 4}px,${my - 4}px)`;
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.transform = `translate(${rx - 16}px,${ry - 16}px)`;

    // Calculate mouse speed for the telemetry readout
    const speed = Math.abs(mx - rx) + Math.abs(my - ry);

    // Only update the DOM if the F1 theme is active to save performance
    if (telemetry && document.documentElement.getAttribute('data-theme') === 'f1') {
      telemetry.innerHTML = 
        `POS_X : ${mx.toString().padStart(4, '0')}<br>` +
        `POS_Y : ${my.toString().padStart(4, '0')}<br>` +
        `VEL_∆ : ${speed.toFixed(1).padStart(4, '0')}`;
    }

    requestAnimationFrame(ani);
  })();

 /* ============================================================
   SPACE THEME SATELLITE PATH (AUTONOMOUS LOOP)
   ============================================================ */
const spacePath = document.getElementById('spacePath');
const spacePathGlow = document.getElementById('spacePathGlow');
const satelliteDot = document.getElementById('satelliteDot');

if (spacePath && spacePathGlow && satelliteDot) {
  const pathLength = spacePath.getTotalLength();
  
  // Set up the dash arrays
  [spacePath, spacePathGlow].forEach(p => {
    p.style.strokeDasharray = pathLength;
    p.style.strokeDashoffset = pathLength;
  });

  // Animation configuration
  // 18 seconds gives a majestic, cinematic speed to the trajectory
  const orbitDuration = 18000; // 12 seconds to complete one full orbit
  let startTime = null;

  function animateOrbit(timestamp) {
    if (!startTime) startTime = timestamp;

    // Only run the heavy math if the Space theme is actually active
    if (document.documentElement.getAttribute('data-theme') === 'space') {
      const elapsed = timestamp - startTime;
      
      // Calculate progress from 0.0 to 1.0, then loop automatically
      const progress = (elapsed % orbitDuration) / orbitDuration;
      
      const drawLength = pathLength * progress;

      // Draw the line
      spacePath.style.strokeDashoffset = pathLength - drawLength;
      spacePathGlow.style.strokeDashoffset = pathLength - drawLength;

      // Move the probe to the leading tip
      const pt = spacePath.getPointAtLength(drawLength);
      satelliteDot.setAttribute('cx', pt.x);
      satelliteDot.setAttribute('cy', pt.y);
      satelliteDot.style.opacity = '1';
      
    } else {
      // If user switches away from the Space theme, reset the timer 
      // so it starts fresh from the sun next time they trigger it
      startTime = null;
      satelliteDot.style.opacity = '0';
    }

    // Call the next frame
    requestAnimationFrame(animateOrbit);
  }

  // Kick off the infinite loop
  requestAnimationFrame(animateOrbit);
}