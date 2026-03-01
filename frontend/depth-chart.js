// ── DEPTH CHART ──────────────────────────────────────────────────────
function renderDepth() {
  const el = document.getElementById('depthChart');
  el.innerHTML = '';
  Object.entries(depthData).forEach(([group,data])=>{
    const key = group.replace(/[^a-z0-9]/gi,'_');
    const div = document.createElement('div'); div.className='dg';
    let html=`<div class="dgt bg-${data.cls}">${group}</div><ul class="pl" id="pl-${key}">`;
    data.players.forEach((p,i)=>{
      const bc=i===0?'b1':i<=2?'b2':'b3';
      html+=`<li class="pc" draggable="true" data-group="${group}" data-idx="${i}">
        <span class="pr">${i+1}</span>
        <span class="pnf" contenteditable="true" spellcheck="false"
          onblur="updPlayer('${group}',${i},this.innerText)"
          title="Click to edit">${esc(p)}</span>
        <span class="pb ${bc}">#${i+1}</span>
        <button class="pdel" onclick="delPlayer('${group}',${i})">✕</button>
      </li>`;
    });
    html+=`</ul><div class="ap-row">
      <input class="ap-in" placeholder="Add player…" id="pi-${key}" onkeydown="if(event.key==='Enter')addPlayer('${group}')">
      <button class="ap-btn" onclick="addPlayer('${group}')">+ Add</button>
    </div>`;
    div.innerHTML=html; el.appendChild(div);
  });
  document.querySelectorAll('.pc').forEach(chip=>{
    chip.querySelector('.pnf').addEventListener('mousedown', e=>e.stopPropagation());
    chip.addEventListener('dragstart',()=>{ dragSrcPlayer={group:chip.dataset.group,idx:+chip.dataset.idx}; chip.classList.add('dragging'); });
    chip.addEventListener('dragend',()=>chip.classList.remove('dragging'));
    chip.addEventListener('dragover',e=>{ e.preventDefault(); chip.classList.add('drag-over'); });
    chip.addEventListener('dragleave',()=>chip.classList.remove('drag-over'));
    chip.addEventListener('drop',e=>{
      e.preventDefault(); chip.classList.remove('drag-over');
      if(!dragSrcPlayer) return;
      const tG=chip.dataset.group,tI=+chip.dataset.idx,{group:sG,idx:sI}=dragSrcPlayer;
      const [p]=depthData[sG].players.splice(sI,1); depthData[tG].players.splice(tI,0,p);
      dragSrcPlayer=null; renderDepth(); showToast('Depth updated');
    });
  });
}
function updPlayer(g,i,v){ const c=v.trim(); if(c) depthData[g].players[i]=c; }
function addPlayer(g){
  const k=g.replace(/[^a-z0-9]/gi,'_'), inp=document.getElementById('pi-'+k);
  if(!inp?.value.trim()) return;
  depthData[g].players.push(inp.value.trim()); renderDepth(); showToast('Player added');
}
function delPlayer(g,i){ depthData[g].players.splice(i,1); renderDepth(); showToast('Player removed'); }
