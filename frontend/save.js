// ── SAVE STATE ────────────────────────────────────────────────────────
const SAVE_TOKEN = '__SAVE_TOKEN__';
const REPO = 'mikeyjoe-hern/whitman-lax';
const STATE_FILE = 'backend/saved-state.js';

function collectState() {
  return {
    days: [0,1,2].map(d => ({
      drills: days[d].drills,
      nextId: days[d].nextId,
      startAmPm: days[d].startAmPm,
      startTime: document.getElementById(`stIn-${d}`).value,
      dateValue: document.getElementById(`datePicker-${d}`).value,
      dateDisplay: document.getElementById(`dateDisplay-${d}`).textContent,
      coachNotes: document.getElementById(`coachNotes-${d}`).innerText.trim(),
      overallNote: document.getElementById(`overallNote-${d}`).innerText.trim(),
      focusText: document.getElementById(`focusText-${d}`).innerText.trim(),
    })),
    depthData,
    drillLibrary,
    nextLid,
  };
}

async function saveState() {
  if (!SAVE_TOKEN) {
    showToast('Save not configured — add SAVE_TOKEN secret'); return;
  }
  showToast('Saving…');
  const state = collectState();
  const fileContent = `// ── SAVED STATE ───────────────────────────────────────────────────────\n// Overwritten by the SAVE button via GitHub API.\nwindow.SAVED_STATE = ${JSON.stringify(state, null, 2)};\n`;
  const b64 = btoa(unescape(encodeURIComponent(fileContent)));

  try {
    // Get current file SHA
    const getRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${STATE_FILE}`, {
      headers: { Authorization: `Bearer ${SAVE_TOKEN}`, Accept: 'application/vnd.github+json' },
    });
    const getJson = getRes.ok ? await getRes.json() : {};

    // Write new content
    const putRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${STATE_FILE}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${SAVE_TOKEN}`, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Save practice plan state',
        content: b64,
        ...(getJson.sha ? { sha: getJson.sha } : {}),
      }),
    });

    if (putRes.ok) {
      showToast('Saved! Reloading in ~60s for all coaches');
    } else {
      const err = await putRes.json();
      showToast(`Save failed: ${err.message || putRes.status}`);
    }
  } catch (e) {
    showToast('Save failed — network error');
  }
}
