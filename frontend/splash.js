// ── SPLASH SCREEN ────────────────────────────────────────────────────
function enterApp() {
  document.getElementById('splash').classList.add('splash-out');
  setTimeout(()=>{ document.getElementById('splash').style.display='none'; document.getElementById('app').classList.add('visible'); }, 400);
}
