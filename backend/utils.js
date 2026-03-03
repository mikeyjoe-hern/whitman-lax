// ── UTILITIES ─────────────────────────────────────────────────────────
function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function printDay(d) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });

  const M  = 54;           // ~0.75" margin
  const PW = 612, PH = 792;
  const CW = PW - 2 * M;
  let y = M + 20;

  // ── HEADER ──
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(39, 39, 39);
  doc.text('WHITMAN', M, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('LAX PRACTICE PLAN', M + 76, y);
  y += 10;
  doc.setFillColor(3, 165, 227);
  doc.rect(M, y, CW, 2, 'F');
  y += 14;

  // ── DATE BAR ──
  const dateStr = document.getElementById(`dateDisplay-${d}`).textContent.trim();
  doc.setDrawColor(166, 30, 10);
  doc.setLineWidth(1.5);
  doc.rect(M, y, CW, 22, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(166, 30, 10);
  doc.text('DATE', M + 8, y + 14);
  doc.setFontSize(12);
  doc.text(dateStr.toUpperCase(), M + 40, y + 14);
  y += 32;

  // ── NOTES BOX ──
  const coachNotes  = document.getElementById(`coachNotes-${d}`).innerText.trim();
  const overallNote = document.getElementById(`overallNote-${d}`).innerText.trim();
  const notesBoxStart = y;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(3, 165, 227);
  doc.text('COACH NOTES', M + 8, y + 11);
  y += 18;

  if (coachNotes) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(39, 39, 39);
    const noteLines = doc.splitTextToSize(coachNotes, CW - 16);
    doc.text(noteLines, M + 8, y);
    y += noteLines.length * 13;
  }
  y += 5;

  doc.setDrawColor(220, 220, 215);
  doc.setLineWidth(0.5);
  doc.line(M + 8, y, M + CW - 8, y);
  y += 8;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(166, 30, 10);
  doc.text('OVERALL NOTE', M + 8, y);
  y += 11;

  if (overallNote) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(166, 30, 10);
    const ovLines = doc.splitTextToSize(overallNote.toUpperCase(), CW - 16);
    doc.text(ovLines, M + 8, y);
    y += ovLines.length * 13;
  }
  y += 8;

  doc.setDrawColor(220, 220, 215);
  doc.setLineWidth(1.5);
  doc.rect(M, notesBoxStart, CW, y - notesBoxStart, 'S');
  y += 10;

  // ── INFO CHIPS ──
  const focusText = document.getElementById(`focusText-${d}`).innerText.trim();
  const tm  = totalMins(d);
  const th  = Math.floor(tm / 60), tmm = tm % 60;
  const totalLabel = th > 0 ? `TOTAL: ${th}h${tmm > 0 ? ' ' + tmm + 'm' : ''}` : `TOTAL: ${tm} MIN`;

  doc.setFillColor(3, 165, 227);
  doc.roundedRect(M, y, 80, 16, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text('FOCUS:', M + 5, y + 10.5);
  doc.setFont('helvetica', 'normal');
  doc.text(focusText.toUpperCase(), M + 30, y + 10.5);

  doc.setFillColor(39, 39, 39);
  doc.roundedRect(M + 88, y, 80, 16, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text(totalLabel, M + 92, y + 10.5);
  y += 26;

  // ── QUOTE ──
  const quoteEl = document.querySelectorAll('.plan-panel')[d]?.querySelector('.pquote');
  const quote   = quoteEl ? quoteEl.textContent.trim() : '';
  if (quote) {
    doc.setFillColor(39, 39, 39);
    doc.rect(M, y, CW, 18, 'F');
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text(quote, M + 8, y + 12);
    y += 26;
  }

  // ── DRILL SCHEDULE ──
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(39, 39, 39);
  doc.text('DRILL SCHEDULE', M, y);
  y += 6;
  doc.setFillColor(3, 165, 227);
  doc.rect(M, y, CW, 1.5, 'F');
  y += 8;

  const drillTimes = computeTimes(d);
  const drillRows  = days[d].drills.map((dr, idx) => {
    const t = drillTimes[idx];
    return [
      `${t.s}–${t.e}`,
      dr.name + (dr.notes ? '\n' + dr.notes : ''),
      `${dr.dur} min`,
    ];
  });

  if (drillRows.length === 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(170, 170, 170);
    doc.text('No drills scheduled', M, y + 10);
    y += 24;
  } else {
    doc.autoTable({
      startY: y,
      margin: { left: M, right: M },
      head: [['TIME', 'DRILL / NOTES', 'MINS']],
      body: drillRows,
      theme: 'grid',
      styles: {
        font: 'helvetica',
        fontSize: 9,
        cellPadding: { top: 4, right: 6, bottom: 4, left: 6 },
        textColor: [39, 39, 39],
        lineColor: [220, 220, 215],
        lineWidth: 0.5,
        overflow: 'linebreak',
        valign: 'middle',
      },
      headStyles: {
        fillColor: [39, 39, 39],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8,
      },
      alternateRowStyles: { fillColor: [249, 249, 249] },
      columnStyles: {
        0: { cellWidth: 100 },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 55, halign: 'center' },
      },
    });
    y = doc.lastAutoTable.finalY + 20;
  }

  // ── DEPTH CHART ──
  const groups = Object.entries(depthData);
  const colHts = [0, 0, 0];
  groups.forEach(([, data], gi) => { colHts[gi % 3] += 18 + data.players.length * 11; });
  if (y + Math.max(...colHts) + 30 > PH - M) { doc.addPage(); y = M + 20; }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(39, 39, 39);
  doc.text('DEPTH CHART', M, y);
  y += 6;
  doc.setFillColor(3, 165, 227);
  doc.rect(M, y, CW, 1.5, 'F');
  y += 14;

  const nCols  = 3;
  const colGap = 10;
  const colW   = (CW - (nCols - 1) * colGap) / nCols;
  const colX   = [M, M + colW + colGap, M + (colW + colGap) * 2];
  const colY   = [y, y, y];

  groups.forEach(([group, data], gi) => {
    const c = gi % nCols;
    let cy   = colY[c];

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(39, 39, 39);
    doc.text(group, colX[c], cy);
    cy += 12;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    data.players.forEach(p => { doc.text(p, colX[c] + 6, cy); cy += 11; });
    cy += 6;

    colY[c] = cy;
  });

  // ── SAVE ──
  const dateLabel = dateStr.replace(/[,\s]+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
  doc.save(`PracticePlan_${dateLabel}.pdf`);
}

function showToast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2400);
}
