// ── DRILL LIBRARY ─────────────────────────────────────────────────────
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

function renderLibraryModal() {
  const q = (document.getElementById('libSearchModal').value || '').toLowerCase();
  const list = document.getElementById('libListModal');
  const sorted = [...drillLibrary].sort((a,b)=>a.name.localeCompare(b.name));
  const filtered = q ? sorted.filter(dr=>dr.name.toLowerCase().includes(q)) : sorted;
  if (!filtered.length) { list.innerHTML = '<div class="lib-empty">No drills found</div>'; return; }
  list.innerHTML = '';
  filtered.forEach(dr => {
    const row = document.createElement('div');
    row.className = 'lib-item';
    row.innerHTML = `
      <span class="lib-item-name">${esc(dr.name)}</span>
      <span class="lib-item-dur">${dr.dur} min</span>
      <span class="lib-item-add">＋</span>
      <button class="lib-item-del" onclick="event.stopPropagation(); delFromLib(${dr.lid})" title="Remove from library">✕</button>`;
    row.addEventListener('click', ()=>{ addDrillFromLib(dr.lid); });
    list.appendChild(row);
  });
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
  if (!name) return;
  drillLibrary.push({ lid:nextLid++, name, dur });
  closeNewDrillModal();
  document.getElementById('ndName').value='';
  document.getElementById('ndDur').value='';
  renderLibraryModal();
  showToast(`"${name}" added to library`);
}
document.getElementById('newDrillModal').addEventListener('click', e=>{ if(e.target.id==='newDrillModal') closeNewDrillModal(); });
