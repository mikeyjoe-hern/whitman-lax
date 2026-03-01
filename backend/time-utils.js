// ── TIME UTILS ────────────────────────────────────────────────────────
function getStartMins() {
  const v = document.getElementById('stIn').value.trim();
  const m = v.match(/^(\d{1,2}):(\d{2})/);
  if (!m) return 600;
  let h = parseInt(m[1]); const min = parseInt(m[2]);
  if (startAmPm === 'PM' && h < 12) h += 12;
  if (startAmPm === 'AM' && h === 12) h = 0;
  return h*60 + min;
}
function mins12h(t) {
  let h = Math.floor(t/60), m = t%60;
  const ap = h >= 12 ? 'PM' : 'AM';
  if (h > 12) h -= 12; if (h === 0) h = 12;
  return `${h}:${String(m).padStart(2,'0')} ${ap}`;
}
function computeTimes() {
  let c = getStartMins();
  return drills.map(d => { const s=c, e=c+(parseInt(d.dur)||0); c=e; return {s:mins12h(s), e:mins12h(e)}; });
}
function totalMins() { return drills.reduce((a,d)=>a+(parseInt(d.dur)||0),0); }
function updateChips() {
  const t = totalMins(), h=Math.floor(t/60), m=t%60;
  const lbl = h>0 ? `${h}h ${m>0?m+'m':''}`.trim() : `${m} min`;
  document.getElementById('totalChip').innerHTML = `<span class="chip-lbl">Total:&nbsp;</span><span style="font-weight:500">${lbl}</span>`;
  const times = computeTimes();
  const end = times.length ? times[times.length-1].e : '—';
  document.getElementById('ttd').innerHTML = `<strong>${mins12h(getStartMins())}</strong> → <strong>${end}</strong>&nbsp;·&nbsp;${lbl}`;
}
function setAmPm(v) {
  startAmPm = v;
  document.getElementById('btnAM').classList.toggle('on', v==='AM');
  document.getElementById('btnPM').classList.toggle('on', v==='PM');
  renderDrills();
}
