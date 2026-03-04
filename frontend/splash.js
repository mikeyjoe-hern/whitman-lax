// ── SPLASH SCREEN ────────────────────────────────────────────────────
const CORRECT_HASH = '__PASSWORD_HASH__';

const QUOTES = [
  'To Begin, Begin.',
  'Outwork everyone.',
  'Win the day.',
  'Be where your feet are.',
  'Earn it.',
  'Compete on every rep.',
  'Details matter.',
  'Leave it all on the field.',
  'Better today than yesterday.',
  'Champions are made in practice.',
  'One play at a time.',
  'Focus is a skill.',
  'Do the work.',
  'Trust the process.',
  'Attitude determines altitude.',
  'Show up fully.',
  'Hard work beats talent.',
  'Win the small battles.',
  'Stay locked in.',
  'Be the standard.',
];

(function initSplash() {
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  document.getElementById('s-quote').textContent = '\u201c' + quote + '\u201d';
})();

async function checkPassword() {
  const val = document.getElementById('s-pw').value;
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(val));
  const hash = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  if (hash === CORRECT_HASH) {
    enterApp();
  } else {
    const err = document.getElementById('s-pw-err');
    err.textContent = 'Incorrect password';
    const inp = document.getElementById('s-pw');
    inp.classList.add('s-pw-shake');
    setTimeout(() => inp.classList.remove('s-pw-shake'), 500);
  }
}

function enterApp() {
  document.getElementById('splash').classList.add('splash-out');
  setTimeout(() => {
    document.getElementById('splash').style.display = 'none';
    document.getElementById('app').classList.add('visible');
  }, 400);
}
