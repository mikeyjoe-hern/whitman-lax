// ── DRILL LIBRARY ─────────────────────────────────────────────────────
function toggleLibrary(d) {
  const isOpen = document.getElementById(`drillLib-${d}`).classList.contains('open');
  // Close all panels first
  [0,1,2].forEach(i => {
    document.getElementById(`drillLib-${i}`).classList.remove('open');
    document.getElementById(`addBtnArrow-${i}`).textContent = '▼';
  });
  if (!isOpen) {
    libOpen = true;
    libForDay = d;
    document.getElementById(`drillLib-${d}`).classList.add('open');
    document.getElementById(`addBtnArrow-${d}`).textContent = '▲';
    renderLibrary(d);
    document.getElementById(`libSearch-${d}`).focus();
  } else {
    libOpen = false;
  }
}

function renderLibrary(d) {
  const q = (document.getElementById(`libSearch-${d}`).value || '').toLowerCase();
  const list = document.getElementById(`libList-${d}`);
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
  renderLibrary(libForDay); showToast('Removed from library');
}

// Close library when clicking outside
document.addEventListener('click', e=>{
  if (!libOpen) return;
  const inAnyWrap = [0,1,2].some(i => document.getElementById(`addDrillWrap-${i}`).contains(e.target));
  if (!inAnyWrap) {
    libOpen = false;
    [0,1,2].forEach(i => {
      document.getElementById(`drillLib-${i}`).classList.remove('open');
      document.getElementById(`addBtnArrow-${i}`).textContent = '▼';
    });
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
  renderLibrary(libForDay);
  showToast(`"${name}" added to library`);
}
document.getElementById('newDrillModal').addEventListener('click', e=>{ if(e.target.id==='newDrillModal') closeNewDrillModal(); });
