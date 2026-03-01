// ── SPLASH SCREEN ────────────────────────────────────────────────────
const CORRECT_HASH = 'a8088a48ba7e7a6e6d9c5bcd68f5d95c73e0aa71d231549493d0617d7a29a67b';

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
