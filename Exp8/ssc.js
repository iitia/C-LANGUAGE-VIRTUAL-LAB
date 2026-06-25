let steps = [], currentStep = 0;
const alloc = [[0,1,0],[2,0,0],[3,0,2]];
const max = [[7,5,3],[3,2,2],[9,0,2]];
const avail = [3,3,2];
let need = [], work = [], finish = [], safeSeq = [];

window.onload = () => { document.querySelector(".next").disabled = true; document.querySelector(".reset").disabled = true; renderMatrices(); };

function renderMatrices() {
  let h = `<strong>Available:</strong> [${avail.join(", ")}]<table><tr><th>Process</th><th>Allocation</th><th>Max</th><th>Need</th></tr>`;
  for (let i = 0; i < 3; i++) {
    const n = need[i] || max[i].map((m,j) => m - alloc[i][j]);
    h += `<tr><td>P${i}</td><td>[${alloc[i]}]</td><td>[${max[i]}]</td><td>[${n}]</td></tr>`;
  }
  document.getElementById("result").innerHTML = h + '</table>';
}

function start() {
  need = max.map((m,i) => m.map((v,j) => v - alloc[i][j]));
  work = [...avail]; finish = [false,false,false]; safeSeq = [];
  steps = ["Banker's Algorithm: Find safe sequence.", "Need = Max - Allocation for each process.", `Need: P0=[${need[0]}], P1=[${need[1]}], P2=[${need[2]}]`];

  let found = true, count = 0;
  while (count < 3 && found) {
    found = false;
    for (let i = 0; i < 3; i++) {
      if (!finish[i] && need[i].every((n,j) => n <= work[j])) {
        steps.push(`P${i} can be satisfied. Need[${i}]=[${need[i]}] <= Work=[${work}].`);
        work = work.map((w,j) => w + alloc[i][j]);
        steps.push(`P${i} completes. Release resources. Work=[${work}].`);
        finish[i] = true; safeSeq.push(`P${i}`); count++; found = true;
      }
    }
  }

  if (count === 3) {
    steps.push(`Safe sequence found: ${safeSeq.join(" → ")}`);
    steps.push("System is in SAFE state. No deadlock.");
  } else {
    steps.push("No safe sequence exists. System is in UNSAFE state.");
  }

  currentStep = 0;
  document.getElementById("steps").innerHTML = steps.map((s,i)=>`<pre id="step-${i}">${s}</pre>`).join("");
  document.querySelector(".start").disabled = true;
  document.querySelector(".next").disabled = false;
  document.querySelector(".reset").disabled = false;
}

function nextStep() {
  if (currentStep >= steps.length) { alert("Completed."); return; }
  document.getElementById(`step-${currentStep-1}`)?.classList.remove("active");
  document.getElementById(`step-${currentStep}`).classList.add("active");
  if (currentStep === steps.length - 1) {
    const el = document.getElementById("result");
    el.innerHTML += safeSeq.length === 3 ? `<p class="safe">SAFE: ${safeSeq.join(" → ")}</p>` : `<p class="unsafe">UNSAFE STATE</p>`;
  }
  currentStep++;
  if (currentStep >= steps.length) document.querySelector(".next").disabled = true;
}

function resetSim() {
  steps=[]; currentStep=0; need=[]; safeSeq=[];
  document.getElementById("steps").innerHTML = "";
  document.querySelector(".start").disabled = false;
  document.querySelector(".next").disabled = true;
  document.querySelector(".reset").disabled = true;
  renderMatrices();
}
