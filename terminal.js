/* ============================================================
   TERMINAL + EASTER EGGS (FOOTER EMBEDDED VERSION)
   ============================================================ */

(function () {

  /* ── ELEMENTS ───────────────────────────────────────────── */
/* Look for the element declarations at the top of terminal.js and add termNavBtn: */
const termBtn      = document.getElementById('termBtn');
const termNavBtn   = document.getElementById('termNavBtn'); // <-- Add this line
const termInput    = document.getElementById('termInput');
const termOutput   = document.getElementById('termOutput');
const termGhost    = document.getElementById('termGhost');
const footerTerm   = document.getElementById('footerTerminal');

/* Scroll all the way down to the event listeners area (around line 155) and add: */
if (termNavBtn) {
  termNavBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevents click-outside from instantly closing it
    openTerm();
    // Ensures a smooth focus-scroll into view after opening
    setTimeout(() => {
      document.getElementById('siteFooter').scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 150);
  });
}

  /* Safety check */
  if (!termInput || !termOutput || !footerTerm) return;

  /* ── SECTION MAP ────────────────────────────────────────── */
  const NAV = {
    home:           '#hero',
    hero:           '#hero',
    about:          '#about',
    education:      '#education',
    skills:         '#skills',
    experience:     '#experience',
    projects:       '#projects',
    publications:   '#publications',
    certifications: '#certifications',
    contact:        '#contact',
  };

/* ── ALL KNOWN COMMANDS (for autocomplete) ──────────────── */
  const ALL_CMDS = [
    ...Object.keys(NAV),
    'help', 'help easter', 'clear', 'whoami', // <-- added 'help easter' here
    'theme dark', 'theme light', 'theme f1', 'theme space',
    'race', 'rover', 'jwst', 'telescope', 
    'konami',
  ];

  /* ── HISTORY ────────────────────────────────────────────── */
  let cmdHistory = [];
  let histIdx    = -1;

  /* ── OPEN / CLOSE ───────────────────────────────────────── */
  function openTerm() {
    footerTerm.classList.add('open');
    setTimeout(() => termInput.focus(), 50);
    if (termOutput.childElementCount === 0) {
      printWelcome();
    }
    footerTerm.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }

  function closeTerm() {
    footerTerm.classList.remove('open');
    termInput.blur();
  }

  function toggleTerm() {
    footerTerm.classList.contains('open') ? closeTerm() : openTerm();
  }

  /* ── PRINT HELPERS ──────────────────────────────────────── */
  function line(text, type = 'out') {
    const el = document.createElement('div');
    el.className = `term-line ${type}`;
    el.textContent = text;
    termOutput.appendChild(el);
    termOutput.scrollTop = termOutput.scrollHeight;
  }

  function gap() {
    const el = document.createElement('div');
    el.className = 'term-line gap';
    termOutput.appendChild(el);
  }

  function printWelcome() {
    line('// onasvee.dev — terminal v1.0', 'accent');
    line("type 'help' for available commands");
    line("press ` or click ⌃ to toggle");
    gap();
  }

  /* ── AUTOCOMPLETE ───────────────────────────────────────── */
  termInput.addEventListener('input', () => {
    const val = termInput.value.toLowerCase().trim();
    if (!val) { termGhost.textContent = ''; return; }
    const match = ALL_CMDS.find(c => c.startsWith(val) && c !== val);
    termGhost.textContent = match ? match.slice(val.length) : '';
  });

  /* ── COMMAND RUNNER ─────────────────────────────────────── */
  function runCommand(raw) {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;

    // Record history
    cmdHistory.unshift(raw.trim());
    histIdx = -1;
    termGhost.textContent = '';

    // Echo command
    line(raw.trim(), 'cmd');

    /* Navigation */
    if (NAV[cmd]) {
      const target = document.querySelector(NAV[cmd]);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        line(`→ navigating to ${cmd}...`, 'accent');
        setTimeout(closeTerm, 600);
      }
      gap(); return;
    }

 /* help */
    if (cmd === 'help') {
      line('navigation:');
      line('  home · about · education · skills');
      line('  experience · projects · publications');
      line('  certifications · contact');
      gap();
      line('theme:');
      line('  theme dark  |  theme light');
      line('  theme f1    |  theme space');
      gap();
      line('other:');
      line('  whoami      — about this terminal');
      line('  clear       — clear output');
      line('  help easter — [CLASSIFIED]');
      line('  konami      — hint: ↑↑↓↓←→←→BA');
      gap(); return;
    }

    /* help easter */
    if (cmd === 'help easter') {
      line('// easter eggs unlocked', 'accent');
      line('  race        — F1 race simulation');
      line('  rover       — NASA rover mission control');
      line('  jwst        — astronomy picture of the day');
      gap(); return;
    }

    /* clear */
    if (cmd === 'clear') {
      termOutput.innerHTML = '';
      return;
    }

    /* whoami */
    if (cmd === 'whoami') {
      line('Onasvee Banarse', 'accent');
      line('MS CS @ UMass Amherst');
      line('QA Automation Engineer → Software Engineer');
      line('github.com/ORION-22');
      gap(); return;
    }

    /* theme */
    if (cmd.startsWith('theme ')) {
      const theme = cmd.split(' ')[1];
      if (['dark', 'light', 'f1', 'space'].includes(theme)) {
        document.documentElement.setAttribute('data-theme', theme);
        line(`→ theme set to '${theme}'`, 'accent');
      } else {
        line(`unknown theme: '${theme}'`, 'err');
        line("available: dark, light, f1, space");
      }
      gap(); return;
    }

    if (cmd === 'rover') {
      // Toggle off: If the rover is already on screen, remove it
      if (window.roverActive) {
        const existingRover = document.getElementById('marsRover');
        if (existingRover) existingRover.remove();
        window.roverActive = false;
        line('// PERSEVERANCE ROVER STOWED', 'accent');
        gap(); return;
      }

      line('// DEPLOYING PERSEVERANCE ROVER TO SURFACE...', 'accent');
      gap();

      // 1. Create the Rover Element
      const rover = document.createElement('div');
      rover.id = 'marsRover';
      
      // A clean, geometric SVG rover utilizing your existing CSS variables
      rover.innerHTML = `
        <svg width="48" height="36" viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Body -->
          <rect x="8" y="16" width="32" height="6" rx="2" fill="var(--text)" />
          <!-- Wheels -->
          <circle cx="12" cy="28" r="5" fill="var(--accent)" />
          <circle cx="24" cy="28" r="5" fill="var(--accent)" />
          <circle cx="36" cy="28" r="5" fill="var(--accent)" />
          <!-- Camera Mast -->
          <rect x="30" y="6" width="3" height="12" fill="var(--text)" />
          <!-- Camera Head -->
          <rect x="28" y="2" width="10" height="6" rx="1.5" fill="var(--accent)" />
        </svg>
      `;

      // 2. Style and Inject
      rover.style.position = 'fixed';
      rover.style.bottom = '-4px'; // Sits exactly on the bottom edge of the screen
      rover.style.left = '0px';
      rover.style.zIndex = '9999';
      rover.style.pointerEvents = 'none'; // Ensures it doesn't block the user from clicking footer links
      document.body.appendChild(rover);

      window.roverActive = true;
      let roverX = window.innerWidth / 2;
      let targetX = window.innerWidth / 2;
      let facing = 1; // 1 for driving right, -1 for driving left

      // 3. The Sensor (Tracks mouse X coordinate)
      const updateRoverTarget = (e) => { targetX = e.clientX; };
      window.addEventListener('mousemove', updateRoverTarget);

      // 4. The Physics Engine Loop
      function animateRover() {
        // Kill the loop if the rover is dismissed
        if (!window.roverActive) {
          window.removeEventListener('mousemove', updateRoverTarget);
          return;
        }

        // Calculate the distance between the rover and the mouse
        const dx = targetX - roverX;

        // If the mouse is far enough away, drive towards it
        if (Math.abs(dx) > 2) {
          roverX += dx * 0.04; // The 0.04 acts as friction/speed (lower is slower)
          facing = dx > 0 ? 1 : -1; // Flip the SVG based on driving direction
        }

        // Apply position and flip transformations
        rover.style.transform = `translateX(${roverX - 24}px) scaleX(${facing})`;

        requestAnimationFrame(animateRover);
      }

      // Start the engine
      requestAnimationFrame(animateRover);
      return;
    }

    /* easter eggs */
    if (['race', 'jwst', 'telescope'].includes(cmd)) {
      openEggWindow(cmd === 'telescope' ? 'jwst' : cmd);
      /* easter eggs */

      



    if (cmd === 'race') {
      line('→ initializing F1 telemetry in modal...', 'accent');
      gap();

      // 1. Target your existing Easter Egg Popup
      const eggOverlay = document.getElementById('eggOverlay');
      const eggTitle   = document.getElementById('eggTitle');
      const eggBody    = document.getElementById('eggBody');

      if (!eggOverlay) return;

      // 2. Setup the Popup UI
      eggTitle.textContent = '// f1_telemetry.sim — 3 LAP SPRINT';
      eggBody.innerHTML = ''; // Clear out any previous text/canvas
      eggBody.style.padding = '16px'; 

      // Create the Canvas
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 240;
      canvas.style.width = '100%';
      canvas.style.height = 'auto'; // Ensures it scales nicely on smaller screens
      canvas.style.background = '#0a0a08';
      canvas.style.border = '1px solid var(--border)';
      canvas.style.borderRadius = '6px';
      canvas.style.display = 'block';

      // Inject and open modal
      eggBody.appendChild(canvas);
      eggOverlay.classList.add('open');

      const ctx = canvas.getContext('2d');

// 3. Define the Drivers (Equal base speeds for a 100% fair RNG race)
      let drivers = [
        { name: 'HAM', team: 'Ferrari', color: '#EF1A2D', progress: 0.02, speed: 0.0026, lap: 0 },
        { name: 'NOR', team: 'McLaren', color: '#FF8700', progress: 0.015, speed: 0.0026, lap: 0 },
        { name: 'VER', team: 'Red Bull', color: '#3330FF', progress: 0.01, speed: 0.0026, lap: 0 },
        { name: 'RUS', team: 'Mercedes', color: '#00D2BE', progress: 0.005, speed: 0.0026, lap: 0 }
      ];

      function getTrackPoint(t) {
        const angle = t * Math.PI * 2;
        const cx = 300, cy = 120;
        const rx = 240, ry = 80;
        const x = cx + rx * Math.cos(angle) - 30 * Math.sin(2 * angle);
        const y = cy + ry * Math.sin(angle) + 40 * Math.sin(3 * angle);
        return { x, y };
      }

      let raceFinished = false;
      let winnerName = "";

      // 4. The Animation Loop
      function drawFrame() {
        // Stop processing if the user closes the popup (prevents memory leaks)
        if (!eggOverlay.classList.contains('open')) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // --- DRAW TRACK ---
        ctx.lineWidth = 12;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        ctx.beginPath();
        for (let i = 0; i <= 1.01; i += 0.01) {
          const pt = getTrackPoint(i);
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.strokeStyle = '#1e1e1e';
        ctx.stroke();

        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i <= 1.01; i += 0.01) {
          const pt = getTrackPoint(i);
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else {
            ctx.lineTo(pt.x, pt.y);
            if (i < 0.33) ctx.strokeStyle = '#ff4444';
            else if (i < 0.66) ctx.strokeStyle = '#4444ff';
            else ctx.strokeStyle = '#44ff44';
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(pt.x, pt.y);
          }
        }

        // --- UPDATE & DRAW CARS ---
        drivers.sort((a, b) => (b.lap + b.progress) - (a.lap + a.progress));

        drivers.forEach((driver, index) => {
          if (!raceFinished) {
            const cornerBrake = Math.abs(Math.sin(driver.progress * Math.PI * 6)) * 0.0012;
            const randomSlipstream = Math.random() * 0.0004;
            driver.progress += (driver.speed - cornerBrake + randomSlipstream);
            
            if (driver.progress >= 1) {
              driver.progress -= 1;
              driver.lap += 1;
              
              // 5. The Win Condition
              if (driver.lap === 3 && !raceFinished) {
                raceFinished = true;
                winnerName = driver.name;
              }
            }
          }

          const pt = getTrackPoint(driver.progress);

          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 6, 0, Math.PI * 2);
          ctx.fillStyle = driver.color;
          ctx.fill();
          
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.roundRect(pt.x + 8, pt.y - 7, 24, 14, 4);
          ctx.fill();
          
          ctx.fillStyle = '#000000';
          ctx.font = 'bold 9px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(driver.name, pt.x + 20, pt.y + 1);

          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'left';
          ctx.fillText(`P${index + 1} | ${driver.name} | Lap ${driver.lap}/3`, 15, 20 + (index * 15));
        });

        // --- DRAW WINNER OVERLAY ---
        if (raceFinished) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.75)'; // Darken the track
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 24px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`🏁 ${winnerName} WINS! 🏁`, canvas.width / 2, canvas.height / 2);
          return; // Kill the animation loop completely
        }

        requestAnimationFrame(drawFrame);
      }

      requestAnimationFrame(drawFrame);
      return;
    }

    if (['rover', 'jwst', 'telescope'].includes(cmd)) {
      openEggWindow(cmd === 'telescope' ? 'jwst' : cmd);
      gap(); return;
    }

    if (['rover', 'jwst', 'telescope'].includes(cmd)) {
      openEggWindow(cmd === 'telescope' ? 'jwst' : cmd);
      gap(); return;
    }

      gap(); return;
    }

    /* konami */
    if (cmd === 'konami') {
      line('hint: ↑ ↑ ↓ ↓ ← → ← → B A', 'accent');
      line('try it anywhere on the page...');
      gap(); return;
    }

    /* unknown */
    line(`command not found: '${cmd}'`, 'err');
    line("type 'help' to see available commands");
    gap();
  }

  /* ── INPUT EVENTS ───────────────────────────────────────── */
  termInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const val = termInput.value;
      termInput.value = '';
      termGhost.textContent = '';
      // Auto-open if collapsed
      if (!footerTerm.classList.contains('open')) {
        openTerm();
        setTimeout(() => runCommand(val), 100);
      } else {
        runCommand(val);
      }
          // Forces the browser to scroll down and keep the input visible as the terminal expands
      setTimeout(() => {
        termInput.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 150);
    }


    /* Tab → accept autocomplete */
    if (e.key === 'Tab') {
      e.preventDefault();
      const ghost = termGhost.textContent;
      if (ghost) { termInput.value += ghost; termGhost.textContent = ''; }
    }

    /* Up / Down → history */
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (histIdx < cmdHistory.length - 1) {
        histIdx++;
        termInput.value = cmdHistory[histIdx];
      }
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx > 0) { histIdx--; termInput.value = cmdHistory[histIdx]; }
      else { histIdx = -1; termInput.value = ''; }
    }

    /* Escape → close */
    if (e.key === 'Escape') closeTerm();
  });

  /* Focus input → auto open */
  termInput.addEventListener('focus', () => {
    if (!footerTerm.classList.contains('open')) openTerm();
  });

  /* Toggle button */
  termBtn.addEventListener('click', toggleTerm);

  /* Backtick anywhere toggles terminal */
  document.addEventListener('keydown', e => {
    if (e.key === '`' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      toggleTerm();
      if (!footerTerm.classList.contains('open')) {
        document.getElementById('siteFooter').scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }
  });

  /* Click outside to close */
  document.addEventListener('click', e => {
    if (footerTerm.classList.contains('open') &&
        !footerTerm.contains(e.target)) {
      closeTerm();
    }
  });

  /* ── GENERIC EASTER EGG POPUP ───────────────────────────── */
  const EGG_CONFIG = {
    race:   { icon: '🏎️', label: '// f1_race.sim',           msg: 'F1 race simulation — coming soon.\nFive cars. One track. HIRE ME always podiums.' },
    rover:  { icon: '🛸', label: '// nasa_rover.telemetry',   msg: 'NASA rover mission control — coming soon.\nReal Perseverance data via NASA open API.' },
    jwst:   { icon: '🔭', label: '// jwst.apod',              msg: 'Astronomy Picture of the Day — coming soon.\nDaily NASA imagery via APOD API.' },
  };

  const eggOverlay = document.getElementById('eggOverlay');
  const eggTitle   = document.getElementById('eggTitle');
  const eggBody    = document.getElementById('eggBody');
  const eggClose   = document.getElementById('eggClose');

  function openEggWindow(key) {
    const cfg = EGG_CONFIG[key];
    if (!cfg || !eggOverlay) return;
    eggTitle.textContent = cfg.label;
    eggBody.textContent = `${cfg.icon}\n\n${cfg.msg}`;
    eggOverlay.classList.add('open');
  }

  function closeEggWindow() {
    if (eggOverlay) eggOverlay.classList.remove('open');
  }

  if (eggClose) eggClose.addEventListener('click', closeEggWindow);
  if (eggOverlay) eggOverlay.addEventListener('click', e => {
    if (e.target === eggOverlay) closeEggWindow();
  });

  // Make openEggWindow available globally (for other scripts)
  window.openEggWindow = openEggWindow;

  /* ── KONAMI CODE ────────────────────────────────────────── */
  const konamiOverlay = document.getElementById('konamiOverlay');
  const konamiSeq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','KeyB','KeyA'];
  let konamiIdx = 0;

  document.addEventListener('keydown', e => {
    if (e.code === konamiSeq[konamiIdx]) {
      konamiIdx++;
      if (konamiIdx === konamiSeq.length) {
        konamiIdx = 0;
        if (konamiOverlay) konamiOverlay.classList.add('open');
      }
    } else {
      konamiIdx = 0;
    }
  });

  // Close konami
  if (konamiOverlay) {
    konamiOverlay.addEventListener('click', e => {
      if (e.target === konamiOverlay || e.target.closest('button')) {
        konamiOverlay.classList.remove('open');
      }
    });
  }

})();