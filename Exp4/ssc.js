let steps = [], currentStep = 0;
let readcount = 0, mutex = 1, wrt = 1, writerActive = false;

window.onload = () => { document.querySelector(".next").disabled = true; document.querySelector(".reset").disabled = true; updateDisplay(); };

function updateDisplay() {
  document.getElementById("rc").textContent = readcount;
  document.getElementById("mx").textContent = mutex;
  document.getElementById("wrt").textContent = wrt;
  document.getElementById("readers").textContent = readcount;
  document.getElementById("writer").textContent = writerActive ? "Yes" : "No";
}

function start() {
  const a = document.getElementById("action").value;
  steps = [];
  if (a === "read_start") {
    if (writerActive) { alert("Writer active. Reader must wait."); return; }
    steps = ["Reader arrives.", "wait(mutex): protect readcount.", "readcount++.", readcount === 0 ? "First reader: wait(wrt) to block writers." : "Not first reader: wrt already held.", "release(mutex).", "Reader reads shared data."];
    mutex = 0; readcount++; if (readcount === 1) wrt = 0; mutex = 1;
  } else if (a === "read_end") {
    if (readcount === 0) { alert("No active readers."); return; }
    steps = ["Reader finishes.", "wait(mutex).", "readcount--.", readcount === 0 ? "Last reader: signal(wrt) to allow writers." : "Other readers still active.", "release(mutex)."];
    mutex = 0; readcount--; if (readcount === 0) wrt = 1; mutex = 1;
  } else if (a === "write_start") {
    if (readcount > 0 || writerActive) { alert("Readers active or writer busy."); return; }
    steps = ["Writer arrives.", "wait(wrt): exclusive access.", "Writer writes to shared data."];
    wrt = 0; writerActive = true;
  } else {
    if (!writerActive) { alert("No active writer."); return; }
    steps = ["Writer finishes.", "signal(wrt): release exclusive access."];
    wrt = 1; writerActive = false;
  }
  currentStep = 0;
  document.getElementById("steps").innerHTML = steps.map((s,i)=>`<pre id="step-${i}">${s}</pre>`).join("");
  document.querySelector(".start").disabled = true;
  document.querySelector(".next").disabled = false;
  document.querySelector(".reset").disabled = false;
}

function nextStep() {
  if (currentStep >= steps.length) { alert("Completed."); updateDisplay(); return; }
  document.getElementById(`step-${currentStep-1}`)?.classList.remove("active");
  document.getElementById(`step-${currentStep}`).classList.add("active");
  updateDisplay(); currentStep++;
  if (currentStep >= steps.length) document.querySelector(".next").disabled = true;
}

function resetSim() {
  readcount=0; mutex=1; wrt=1; writerActive=false; steps=[]; currentStep=0;
  document.getElementById("steps").innerHTML = "";
  document.querySelector(".start").disabled = false;
  document.querySelector(".next").disabled = true;
  document.querySelector(".reset").disabled = true;
  updateDisplay();
}
