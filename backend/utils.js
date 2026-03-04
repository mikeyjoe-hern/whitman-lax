// ── UTILITIES ─────────────────────────────────────────────────────────
function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function printDay(d) {
  document.documentElement.dataset.printDay = String(d);
  window.print();
  delete document.documentElement.dataset.printDay;
}

async function downloadDay(d) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });

  const margin = 54;
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const colW = pageW - margin * 2;
  let y = margin;

  // ── Logo (top-right) ──────────────────────────────────────────────────
  const logoW = 60; const logoH = 40;
  await new Promise(function(resolve) {
    const img = new Image();
    img.onload = function() {
      try { doc.addImage(img, 'PNG', pageW - margin - logoW, margin - 8, logoW, logoH); } catch(e) {}
      resolve();
    };
    img.onerror = resolve;
    img.src = 'assets/logo.png';
  });

  // ── Header ────────────────────────────────────────────────────────────
  const dateLabel = document.getElementById('dateDisplay-' + d).textContent;
  doc.setFont('helvetica', 'bold').setFontSize(16).setTextColor(0);
  doc.text('Walt Whitman LAX \u2014 Practice Plan', margin, y);
  y += 22;
  doc.setFont('helvetica', 'normal').setFontSize(11).setTextColor(100);
  doc.text(dateLabel, margin, y);
  y += 18;
  doc.setTextColor(0);
  doc.setDrawColor(3, 165, 227);
  doc.setLineWidth(1.5);
  doc.line(margin, y, pageW - margin, y);
  y += 20;

  // ── Coach Notes + Overall Note ────────────────────────────────────────
  var coachNotes   = document.getElementById('coachNotes-'   + d).innerText.trim();
  var overallNote  = document.getElementById('overallNote-'  + d).innerText.trim();
  if (coachNotes || overallNote) {
    if (coachNotes) {
      doc.setFont('helvetica', 'bold').setFontSize(7.5).setTextColor(140);
      doc.text('COACH NOTES', margin, y);
      y += 10;
      var cnLines = doc.splitTextToSize(coachNotes, colW);
      doc.setFont('helvetica', 'normal').setFontSize(9).setTextColor(0);
      doc.text(cnLines, margin, y);
      y += cnLines.length * 11 + 6;
    }
    if (overallNote) {
      doc.setFont('helvetica', 'bold').setFontSize(7.5).setTextColor(140);
      doc.text('OVERALL NOTE', margin, y);
      y += 10;
      var onLines = doc.splitTextToSize(overallNote, colW);
      doc.setFont('helvetica', 'normal').setFontSize(9).setTextColor(0);
      doc.text(onLines, margin, y);
      y += onLines.length * 11 + 6;
    }
    y += 6;
  }

  // ── Drill Schedule ────────────────────────────────────────────────────
  doc.setFont('helvetica', 'bold').setFontSize(13).setTextColor(0);
  doc.text('Drill Schedule', margin, y);
  y += 16;

  const times = computeTimes(d);
  const drills = days[d].drills;

  const cols = { time: margin, drill: margin + 105, notes: margin + 240, mins: pageW - margin };
  doc.setFontSize(8).setFont('helvetica', 'bold').setTextColor(80);
  doc.text('TIME', cols.time, y);
  doc.text('DRILL', cols.drill, y);
  doc.text('NOTES', cols.notes, y);
  doc.text('MIN', cols.mins, y, { align: 'right' });
  y += 4;
  doc.setDrawColor(180).setLineWidth(0.5);
  doc.line(margin, y, pageW - margin, y);
  y += 10;

  doc.setFont('helvetica', 'normal').setFontSize(9).setTextColor(0);
  drills.forEach(function(dr, i) {
    const t = times[i] || { s: '\u2014', e: '\u2014' };
    const timeStr = t.s + '\u2013' + t.e;
    const drillLines = doc.splitTextToSize(dr.name || '', 125);
    const noteLines  = doc.splitTextToSize(dr.notes || '', 155);
    const rowH = Math.max(drillLines.length, noteLines.length) * 11 + 6;

    if (y + rowH > pageH - margin) { doc.addPage(); y = margin; }

    if (i % 2 === 0) {
      doc.setFillColor(248, 248, 248);
      doc.rect(margin, y - 9, colW, rowH, 'F');
    }

    doc.setTextColor(0);
    doc.text(timeStr,       cols.time,  y);
    doc.text(drillLines,    cols.drill, y);
    doc.text(noteLines,     cols.notes, y);
    doc.text(String(dr.dur || ''), cols.mins, y, { align: 'right' });
    y += rowH;
  });

  const total = days[d].drills.reduce(function(a, dr) { return a + (parseInt(dr.dur) || 0); }, 0);
  y += 4;
  doc.setFont('helvetica', 'bold').setFontSize(9).setTextColor(0);
  doc.text('Total: ' + total + ' min', pageW - margin, y, { align: 'right' });
  y += 16;

  // ── Depth Chart ───────────────────────────────────────────────────────
  if (y + 50 > pageH - margin) { doc.addPage(); y = margin; }

  doc.setDrawColor(3, 165, 227).setLineWidth(1.5);
  doc.line(margin, y, pageW - margin, y);
  y += 12;
  doc.setFont('helvetica', 'bold').setFontSize(13).setTextColor(0);
  doc.text('Depth Chart', margin, y);
  y += 14;

  const halfW = (colW - 16) / 2;
  let col = 0;
  const colYs = [y, y];

  // ── Dynamic scaling: fit depth chart to available vertical + horizontal space ──
  const BASE_PLAYER_H = 10, BASE_HEADER_H = 8, BASE_GAP = 4;
  const simYs = [0, 0]; let simCol = 0;
  Object.values(depthData).forEach(function(data) {
    const n = (data.players || []).length;
    simYs[simCol] += BASE_HEADER_H + n * BASE_PLAYER_H + BASE_GAP;
    simCol = simCol === 0 ? 1 : 0;
  });
  const simMaxH = Math.max(simYs[0], simYs[1]);
  const availH = pageH - y - margin;
  const vScale = simMaxH > availH ? availH / simMaxH : 1;

  const maxNameW = halfW - 16;
  doc.setFont('helvetica', 'normal').setFontSize(9);
  let hScale = 1;
  Object.values(depthData).forEach(function(data) {
    (data.players || []).forEach(function(p, pi) {
      const str = (pi + 1) + '.  ' + (p.name || p);
      const w = doc.getStringUnitWidth(str) * 9;
      if (w > maxNameW) hScale = Math.min(hScale, maxNameW / w);
    });
  });

  const scale     = Math.min(vScale, hScale);
  const playerH   = Math.max(8,   Math.round(BASE_PLAYER_H * scale));
  const headerGap = Math.max(2,   Math.round(BASE_HEADER_H * scale));
  const groupGap  = Math.max(2,   Math.round(BASE_GAP      * scale));
  const dcFontSz  = Math.max(6.5, 9   * scale);
  const hdrFontSz = Math.max(6,   8.5 * scale);

  Object.entries(depthData).forEach(function(entry) {
    const group = entry[0];
    const data  = entry[1];
    const players = data.players || [];
    const blockH = 16 + players.length * playerH + groupGap;
    const xOff = margin + col * (halfW + 16);

    if (colYs[col] + blockH > pageH - margin) {
      doc.addPage();
      colYs[0] = margin; colYs[1] = margin;
      col = 0;
    }

    let gy = colYs[col];

    doc.setFillColor(50, 54, 60);
    doc.rect(xOff, gy - 10, halfW, 15, 'F');
    doc.setFont('helvetica', 'bold').setFontSize(hdrFontSz).setTextColor(255);
    doc.text(group, xOff + 5, gy);
    gy += headerGap;

    doc.setFont('helvetica', 'normal').setFontSize(dcFontSz).setTextColor(0);
    players.forEach(function(p, pi) {
      gy += playerH;
      doc.text((pi + 1) + '.  ' + (p.name || p), xOff + 8, gy);
    });

    colYs[col] = gy + groupGap;
    col = col === 0 ? 1 : 0;
  });

  // ── Save ──────────────────────────────────────────────────────────────
  const safeDateLabel = dateLabel.replace(/,?\s+/g, '_');
  doc.save('PracticePlan_' + safeDateLabel + '.pdf');
}

function showToast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2400);
}
