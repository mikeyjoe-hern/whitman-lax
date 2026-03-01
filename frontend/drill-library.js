// ── DRILL LIBRARY ─────────────────────────────────────────────────────
function toggleLibrary() {
  libOpen = !libOpen;
  document.getElementById('drillLib').classList.toggle('open', libOpen);
  document.getElementById('addBtnArrow').textContent = libOpen ? '▲' : '▼';
  if (libOpen) { renderLibrary(); document.getElementById('libSearch').focus(); }
}

function renderLibrary() {
  const q = (document.getElementById('libSearch').value || '').toLowerCase();
  const list = document.getElementById('libList');
  const sorted = [...drillLibrary].sort((a,b)=>a.name.localeCompare(b.name));
  const filtered = q ? sorted.filter(d=>d.name.toLowerCase().includes(q)) : sorted;
  if (!filtered.length) { list.innerHTML = '<div class="lib-empty">No drills found</div>'; return; }
  list.innerHTML = '';
  filtered.forEach(d => {
    const row = document.createElement('div');
    row.className = 'lib-item';
    row.innerHTML = `
      <span class="lib-item-name">${esc(d.name)}</span>
      <span class="lib-item-dur">${d.dur} min</span>
      <span class="lib-item-add">＋</span>
      <button class="lib-item-del" onclick="event.stopPropagation(); delFromLib(${d.lid})" title="Remove from library">✕</button>`;
    row.addEventListener('click', ()=>{ addDrillFromLib(d.lid); });
    list.appendChild(row);
  });
}

function delFromLib(lid) {
  drillLibrary = drillLibrary.filter(x=>x.lid!==lid);
  renderLibrary(); showToast('Removed from library');
}

// Close library when clicking outside
document.addEventListener('click', e=>{
  if (libOpen && !document.getElementById('addDrillWrap').contains(e.target)) {
    libOpen=false;
    document.getElementById('drillLib').classList.remove('open');
    document.getElementById('addBtnArrow').textContent='▼';
  }
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
  renderLibrary();
  showToast(`"${name}" added to library`);
}
document.getElementById('newDrillModal').addEventListener('click', e=>{ if(e.target.id==='newDrillModal') closeNewDrillModal(); });
