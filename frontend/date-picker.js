// ── DATE PICKER ───────────────────────────────────────────────────────
[0, 1, 2].forEach(d => {
  document.getElementById(`datePicker-${d}`).addEventListener('change', function() {
    const v = this.value;
    if (!v) return;
    const [y, mo, day] = v.split('-').map(Number);
    const dt = new Date(y, mo-1, day);
    document.getElementById(`dateDisplay-${d}`).textContent = dt.toLocaleDateString('en-US', {
      weekday:'long', year:'numeric', month:'long', day:'numeric'
    });
    if (d === 0) document.getElementById('footerDate').textContent = `${mo}/${day}/${y}`;
  });
});
