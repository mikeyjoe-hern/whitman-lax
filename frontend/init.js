// ── INIT ──────────────────────────────────────────────────────────────
if (window.SAVED_STATE) applySavedState(window.SAVED_STATE);
[0, 1, 2].forEach(d => renderDrills(d));
renderDepth();

function applySavedState(s) {
  s.days.forEach((sd, d) => {
    days[d].drills   = sd.drills;
    days[d].nextId   = sd.nextId;
    days[d].startAmPm = sd.startAmPm;
    document.getElementById(`stIn-${d}`).value           = sd.startTime;
    document.getElementById(`datePicker-${d}`).value     = sd.dateValue;
    document.getElementById(`dateDisplay-${d}`).textContent = sd.dateDisplay;
    document.getElementById(`coachNotes-${d}`).innerText = sd.coachNotes;
    document.getElementById(`overallNote-${d}`).innerText = sd.overallNote;
    document.getElementById(`focusText-${d}`).innerText  = sd.focusText;
    if (sd.pquote !== undefined) document.getElementById(`pquote-${d}`).innerText = sd.pquote;
    document.getElementById(`btnAM-${d}`).classList.toggle('on', sd.startAmPm === 'AM');
    document.getElementById(`btnPM-${d}`).classList.toggle('on', sd.startAmPm === 'PM');
  });
  Object.assign(depthData, s.depthData);
  // Migrate old string-based players to {name, injured} objects; remove legacy INJURED group
  Object.values(depthData).forEach(data => {
    data.players = data.players.map(p => typeof p === 'string' ? { name: p, injured: false } : p);
  });
  delete depthData['INJURED'];
  drillLibrary = s.drillLibrary;
  nextLid = s.nextLid;
}
