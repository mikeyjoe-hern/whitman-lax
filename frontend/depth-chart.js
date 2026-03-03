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
    chip.addEventListener('dragstart',()=>{
      isDragging = true;
      dragSrcPlayer={group:chip.dataset.group,idx:+chip.dataset.idx};
      chip.classList.add('dragging');
    });
    chip.addEventListener('dragend',()=>{
      isDragging = false;
      chip.classList.remove('dragging');
      document.querySelectorAll('.pc').forEach(c=>c.classList.remove('insert-before','insert-after'));
    });
    chip.addEventListener('dragover',e=>{
      e.preventDefault();
      document.querySelectorAll('.pc').forEach(c=>c.classList.remove('insert-before','insert-after'));
      const rect=chip.getBoundingClientRect();
      chip.classList.add(e.clientY < rect.top+rect.height/2 ? 'insert-before' : 'insert-after');
    });
    chip.addEventListener('dragleave',()=>chip.classList.remove('insert-before','insert-after'));
    chip.addEventListener('drop',e=>{
      e.preventDefault();
      chip.classList.remove('insert-before','insert-after');
      if(!dragSrcPlayer) return;
      const rect=chip.getBoundingClientRect();
      const insertBefore=e.clientY < rect.top+rect.height/2;
      const tG=chip.dataset.group;
      let tI=+chip.dataset.idx;
      if(!insertBefore) tI+=1;
      const {group:sG,idx:sI}=dragSrcPlayer;
      dragSrcPlayer=null;
      const [p]=depthData[sG].players.splice(sI,1);
      if(sG===tG && sI<tI) tI-=1;
      tI=Math.max(0,Math.min(tI,depthData[tG].players.length));
      depthData[tG].players.splice(tI,0,p);
      renderDepth(); showToast('Depth updated');
    });
  });
}
function updPlayer(g,i,v){ if(isDragging) return; const c=v.trim(); if(c) depthData[g].players[i]=c; }
function addPlayer(g){
  const k=g.replace(/[^a-z0-9]/gi,'_'), inp=document.getElementById('pi-'+k);
  if(!inp?.value.trim()) return;
  depthData[g].players.push(inp.value.trim()); renderDepth(); showToast('Player added');
}
function delPlayer(g,i){ depthData[g].players.splice(i,1); renderDepth(); showToast('Player removed'); }
