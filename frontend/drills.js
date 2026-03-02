// ── RENDER DRILLS ─────────────────────────────────────────────────────
function renderDrills(d) {
  const times = computeTimes(d);
  const tbody = document.getElementById(`drillsList-${d}`);
  tbody.innerHTML = '';
  days[d].drills.forEach((dr, idx) => {
    const t = times[idx];
    const tr = document.createElement('tr');
    tr.className = 'drow';
    tr.draggable = true;
    // data-dur for print CSS
    const durTd = `<td class="durc" data-dur="${dr.dur} min"><div class="dur-wrap"><input class="dur-in" type="number" min="1" max="240" value="${dr.dur}" onchange="updDur(${d},${dr.id},this.value)" onblur="updDur(${d},${dr.id},this.value)"><span class="dur-lbl">min</span></div></td>`;
    tr.innerHTML = `
      <td class="dh" title="Drag to reorder">⠿</td>
      <td class="dtc">${t.s}–${t.e}</td>
      <td>
        <div class="dn" contenteditable="true" onblur="updName(${d},${dr.id},this.innerText)" spellcheck="false">${esc(dr.name)}</div>
        <textarea class="dnotes" rows="1" placeholder="Notes…" onchange="updNotes(${d},${dr.id},this.value)">${esc(dr.notes)}</textarea>
      </td>
      ${durTd}
      <td style="text-align:center"><button class="ddel" onclick="delDrill(${d},${dr.id})">✕</button></td>`;
    tr.addEventListener('dragstart', e=>{ days[d].dragSrcDrill=idx; tr.classList.add('dragging'); e.dataTransfer.effectAllowed='move'; });
    tr.addEventListener('dragend', ()=>tr.classList.remove('dragging'));
    tr.addEventListener('dragover', e=>{ e.preventDefault(); tr.classList.add('drag-over'); });
    tr.addEventListener('dragleave', ()=>tr.classList.remove('drag-over'));
    tr.addEventListener('drop', e=>{
      e.preventDefault(); tr.classList.remove('drag-over');
      if (days[d].dragSrcDrill===null||days[d].dragSrcDrill===idx) return;
      const [m]=days[d].drills.splice(days[d].dragSrcDrill,1); days[d].drills.splice(idx,0,m);
      days[d].dragSrcDrill=null; renderDrills(d); showToast('Reordered — times updated');
    });
    tbody.appendChild(tr);
  });
  updateChips(d);
}

function updName(d,id,v){ const dr=days[d].drills.find(x=>x.id===id); if(dr) dr.name=v.trim(); }
function updNotes(d,id,v){ const dr=days[d].drills.find(x=>x.id===id); if(dr) dr.notes=v; }
function updDur(d,id,v){ const dr=days[d].drills.find(x=>x.id===id); const n=Math.max(1,parseInt(v)||1); if(dr&&dr.dur!==n){dr.dur=n;renderDrills(d);} }
function delDrill(d,id){ days[d].drills=days[d].drills.filter(x=>x.id!==id); renderDrills(d); showToast('Drill removed'); }

// Add from library
function addDrillFromLib(lid) {
  const entry = drillLibrary.find(x=>x.lid===lid);
  if (!entry) return;
  const d = libForDay;
  days[d].drills.push({ id:days[d].nextId++, dur: entry.dur, name: entry.name, notes:'' });
  renderDrills(d);
  showToast(`"${entry.name}" added`);
}
