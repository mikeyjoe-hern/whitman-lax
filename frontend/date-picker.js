// ── DATE PICKER ───────────────────────────────────────────────────────
document.getElementById('datePicker').addEventListener('change', function() {
  const v = this.value; // "2026-02-28"
  if (!v) return;
  const [y, mo, d] = v.split('-').map(Number);
  const dt = new Date(y, mo-1, d);
  document.getElementById('dateDisplay').textContent = dt.toLocaleDateString('en-US', {
    weekday:'long', year:'numeric', month:'long', day:'numeric'
  });
  document.getElementById('footerDate').textContent = `${mo}/${d}/${y}`;
});
