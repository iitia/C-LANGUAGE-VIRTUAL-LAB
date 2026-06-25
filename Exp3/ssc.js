let steps = [], currentStep = 0, buffer = [], bufSize = 4, empty = 4, full = 0, mutex = 1;

window.onload = () => { document.querySelector(".next").disabled = true; document.querySelector(".reset").disabled = true; render(); };

function render() {
  let h = `<div class="sem">mutex = ${mutex} | empty = ${empty} | full = ${full}</div><div class="buffer">`;
  for (let i = 0; i < bufSize; i++) h += `<div class="slot ${i < buffer.length ? 'filled' : ''}">${i < buffer.length ? buffer[i] : ''}</div>`;
  document.getElementById("result").innerHTML = h + '</div>';
}

function start() {
  bufSize = parseInt(document.getElementById("bufSize").value);
  const action = document.getElementById("action").value;
  steps = [];
  if (action === "produce") {
    if (empty === 0) { alert("Buffer full! Producer must wait."); return; }
    steps.push("Producer wants to produce an item.");
    steps.push(`wait(empty): empty=${empty} → ${empty-1}`);
    steps.push(`wait(mutex): mutex=${mutex} → 0 (enter critical section)`);
    steps.push(`Add item to buffer. Buffer: [${buffer.join(",")}${buffer.length?",":""}new item]`);
    steps.push(`signal(mutex): mutex=0 → 1 (exit critical section)`);
    steps.push(`signal(full): full=${full} → ${full+1}`);
    buffer.push("X"); empty--; full++; mutex = 1;
  } else {
    if (full === 0) { alert("Buffer empty! Consumer must wait."); return; }
    steps.push("Consumer wants to consume an item.");
    steps.push(`wait(full): full=${full} → ${full-1}`);
    steps.push(`wait(mutex): mutex=${mutex} → 0`);
    steps.push(`Remove item from buffer.`);
    steps.push(`signal(mutex): mutex=0 → 1`);
    steps.push(`signal(empty): empty=${empty} → ${empty+1}`);
    buffer.pop(); full--; empty++; mutex = 1;
  }
  currentStep = 0;
  document.getElementById("steps").innerHTML = steps.map((s,i)=>`<pre id="step-${i}">${s}</pre>`).join("");
  document.querySelector(".start").disabled = true;
  document.querySelector(".next").disabled = false;
  document.querySelector(".reset").disabled = false;
}

function nextStep() {
  if (currentStep >= steps.length) { alert("Completed."); render(); return; }
  document.getElementById(`step-${currentStep-1}`)?.classList.remove("active");
  document.getElementById(`step-${currentStep}`).classList.add("active");
  render(); currentStep++;
  if (currentStep >= steps.length) { document.querySelector(".next").disabled = true; render(); }
}

function resetSim() {
  buffer=[]; empty=parseInt(document.getElementById("bufSize").value)||4; full=0; mutex=1; bufSize=empty;
  steps=[]; currentStep=0;
  document.getElementById("steps").innerHTML = "";
  document.querySelector(".start").disabled = false;
  document.querySelector(".next").disabled = true;
  document.querySelector(".reset").disabled = true;
  render();
}
