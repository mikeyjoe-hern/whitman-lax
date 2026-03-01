// ── RENDER DRILLS ─────────────────────────────────────────────────────
function renderDrills() {
  const times = computeTimes();
  const tbody = document.getElementById('drillsList');
  tbody.innerHTML = '';
  drills.forEach((d, idx) => {
    const t = times[idx];
    const tr = document.createElement('tr');
    tr.className = 'drow';
    tr.draggable = true;
    // data-dur for print CSS
    const durTd = `<td class="durc" data-dur="${d.dur} min"><div class="dur-wrap"><input class="dur-in" type="number" min="1" max="240" value="${d.dur}" onchange="updDur(${d.id},this.value)" onblur="updDur(${d.id},this.value)"><span class="dur-lbl">min</span></div></td>`;
    tr.innerHTML = `
      <td class="dh" title="Drag to reorder">⠿</td>
      <td class="dtc">${t.s}–${t.e}</td>
      <td>
        <div class="dn" contenteditable="true" onblur="updName(${d.id},this.innerText)" spellcheck="false">${esc(d.name)}</div>
        <textarea class="dnotes" rows="1" placeholder="Notes…" onchange="updNotes(${d.id},this.value)">${esc(d.notes)}</textarea>
      </td>
      ${durTd}
      <td style="text-align:center"><button class="ddel" onclick="delDrill(${d.id})">✕</button></td>`;
    tr.addEventListener('dragstart', e=>{ dragSrcDrill=idx; tr.classList.add('dragging'); e.dataTransfer.effectAllowed='move'; });
    tr.addEventListener('dragend', ()=>tr.classList.remove('dragging'));
    tr.addEventListener('dragover', e=>{ e.preventDefault(); tr.classList.add('drag-over'); });
    tr.addEventListener('dragleave', ()=>tr.classList.remove('drag-over'));
    tr.addEventListener('drop', e=>{
      e.preventDefault(); tr.classList.remove('drag-over');
      if (dragSrcDrill===null||dragSrcDrill===idx) return;
      const [m]=drills.splice(dragSrcDrill,1); drills.splice(idx,0,m);
      dragSrcDrill=null; renderDrills(); showToast('Reordered — times updated');
    });
    tbody.appendChild(tr);
  });
  updateChips();
}

function updName(id,v){ const d=drills.find(x=>x.id===id); if(d) d.name=v.trim(); }
function updNotes(id,v){ const d=drills.find(x=>x.id===id); if(d) d.notes=v; }
function updDur(id,v){ const d=drills.find(x=>x.id===id); const n=Math.max(1,parseInt(v)||1); if(d&&d.dur!==n){d.dur=n;renderDrills();} }
function delDrill(id){ drills=drills.filter(x=>x.id!==id); renderDrills(); showToast('Drill removed'); }

// Add from library
function addDrillFromLib(lid) {
  const entry = drillLibrary.find(x=>x.lid===lid);
  if (!entry) return;
  drills.push({ id:nextId++, dur: entry.dur, name: entry.name, notes:'' });
  renderDrills();
  showToast(`"${entry.name}" added`);
}
