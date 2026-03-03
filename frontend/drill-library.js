// ── DRILL LIBRARY ─────────────────────────────────────────────────────
const DRILL_TYPES = ['Groundballs','Transition/Odd Numbers','Stickwork','O Skills','D Skills','Man to Man','Ride/Clear','Goalie','Faceoff'];

function openDrillLibModal(d) {
  libForDay = d;
  document.getElementById('drillLibModal').classList.remove('hidden');
  document.getElementById('libSearchModal').value = '';
  renderLibraryModal();
  document.getElementById('libSearchModal').focus();
}

function closeDrillLibModal() {
  document.getElementById('drillLibModal').classList.add('hidden');
}

function _makeLibRow(dr) {
  const row = document.createElement('div');
  row.className = 'lib-item';
  row.innerHTML = `
    <span class="lib-item-name">${esc(dr.name)}</span>
    <span class="lib-item-dur">${dr.dur} min</span>
    <span class="lib-item-add">＋</span>
    <button class="lib-item-del" onclick="event.stopPropagation(); delFromLib(${dr.lid})" title="Remove from library">✕</button>`;
  row.addEventListener('click', ()=>{ addDrillFromLib(dr.lid); });
  return row;
}

function renderLibraryModal() {
  const q = (document.getElementById('libSearchModal').value || '').toLowerCase();
  const list = document.getElementById('libListModal');
  list.innerHTML = '';
  let anyResults = false;

  DRILL_TYPES.forEach(type => {
    const typeDrills = drillLibrary.filter(dr => dr.type === type);
    const filtered = q ? typeDrills.filter(dr => dr.name.toLowerCase().includes(q)) : typeDrills;
    if (!filtered.length) return;
    anyResults = true;
    const header = document.createElement('div');
    header.className = 'lib-section-header';
    header.textContent = type;
    list.appendChild(header);
    filtered.sort((a,b)=>a.name.localeCompare(b.name)).forEach(dr => list.appendChild(_makeLibRow(dr)));
  });

  // Drills with no recognized type (user-added)
  const untyped = drillLibrary.filter(dr => !dr.type || !DRILL_TYPES.includes(dr.type));
  const filteredUntyped = q ? untyped.filter(dr => dr.name.toLowerCase().includes(q)) : untyped;
  if (filteredUntyped.length) {
    anyResults = true;
    const header = document.createElement('div');
    header.className = 'lib-section-header';
    header.textContent = 'Other';
    list.appendChild(header);
    filteredUntyped.sort((a,b)=>a.name.localeCompare(b.name)).forEach(dr => list.appendChild(_makeLibRow(dr)));
  }

  if (!anyResults) list.innerHTML = '<div class="lib-empty">No drills found</div>';
}

function delFromLib(lid) {
  drillLibrary = drillLibrary.filter(x=>x.lid!==lid);
  renderLibraryModal(); showToast('Removed from library');
}

// Close modal on backdrop click
document.getElementById('drillLibModal').addEventListener('click', e=>{
  if (e.target.id === 'drillLibModal') closeDrillLibModal();
});

// New drill modal
function openNewDrillModal() {
  document.getElementById('newDrillModal').classList.remove('hidden');
  document.getElementById('ndName').focus();
}
function closeNewDrillModal() { document.getElementById('newDrillModal').classList.add('hidden'); }
function saveNewDrillToLib() {
  const name = document.getElementById('ndName').value.trim();
  const dur  = parseInt(document.getElementById('ndDur').value) || 10;
  const type = document.getElementById('ndType').value;
  if (!name) return;
  drillLibrary.push({ lid:nextLid++, name, dur, type });
  closeNewDrillModal();
  document.getElementById('ndName').value='';
  document.getElementById('ndDur').value='';
  renderLibraryModal();
  showToast(`"${name}" added to library`);
}
document.getElementById('newDrillModal').addEventListener('click', e=>{ if(e.target.id==='newDrillModal') closeNewDrillModal(); });
