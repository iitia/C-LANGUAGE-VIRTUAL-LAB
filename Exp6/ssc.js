let steps = [], currentStep = 0, ganttData = [], metrics = [];

window.onload = function () {
  buildInputs();
  document.querySelector(".next").disabled = true;
  document.querySelector(".reset").disabled = true;
};

function buildInputs() {
  const n = Math.min(6, Math.max(1, parseInt(document.getElementById("numProc").value) || 3));
  document.getElementById("numProc").value = n;
  let html = '<table class="process-table"><tr><th>Process</th><th>Arrival</th><th>Burst</th></tr>';
  for (let i = 0; i < n; i++) {
    html += `<tr><td>P${i+1}</td><td><input type="number" id="at${i}" min="0" value="${i}" style="width:60px"></td><td><input type="number" id="bt${i}" min="1" value="${(i+1)*2}" style="width:60px"></td></tr>`;
  }
  document.getElementById("procInputs").innerHTML = html + '</table>';
}

function start() {
  const mode = document.getElementById("mode").value;
  const n = parseInt(document.getElementById("numProc").value);
  let procs = [];
  for (let i = 0; i < n; i++) {
    const at = parseInt(document.getElementById(`at${i}`).value);
    const bt = parseInt(document.getElementById(`bt${i}`).value);
    if (isNaN(at) || isNaN(bt) || bt < 1) { alert("Invalid input."); return; }
    procs.push({ id:`P${i+1}`, arrival:at, burst:bt, remaining:bt, completion:0 });
  }
  steps = []; ganttData = []; metrics = [];
  steps.push(mode === "preempt" ? "Preemptive SJF (Shortest Remaining Time First)" : "Non-Preemptive Shortest Job First");

  if (mode === "nonpreempt") {
    let time = 0, done = [];
    while (done.length < n) {
      const ready = procs.filter(p => p.arrival <= time && !done.includes(p.id));
      if (!ready.length) { time = Math.min(...procs.filter(p => !done.includes(p.id)).map(p => p.arrival)); continue; }
      ready.sort((a,b) => a.burst - b.burst || a.arrival - b.arrival);
      const p = ready[0];
      const st = Math.max(time, p.arrival), et = st + p.burst;
      ganttData.push({ id:p.id, start:st, end:et });
      steps.push(`Select ${p.id} (shortest burst=${p.burst}). Execute ${st} to ${et}.`);
      p.completion = et; done.push(p.id); time = et;
    }
  } else {
    let time = 0, completed = 0;
    while (completed < n) {
      const ready = procs.filter(p => p.arrival <= time && p.remaining > 0);
      if (!ready.length) { time = Math.min(...procs.filter(p => p.remaining > 0).map(p => p.arrival)); continue; }
      ready.sort((a,b) => a.remaining - b.remaining || a.arrival - b.arrival);
      const p = ready[0];
      const nextArr = procs.filter(x => x.remaining > 0 && x.arrival > time).sort((a,b)=>a.arrival-b.arrival)[0];
      let exec = p.remaining;
      if (nextArr) {
        const others = procs.filter(x => x.arrival <= nextArr.arrival && x.remaining > 0 && x.id !== p.id);
        if (others.some(o => o.remaining < p.remaining - (nextArr.arrival - time))) exec = nextArr.arrival - time;
      }
      exec = Math.min(exec, p.remaining);
      const st = time, et = time + exec;
      ganttData.push({ id:p.id, start:st, end:et });
      steps.push(`Time ${st}-${et}: Execute ${p.id} for ${exec}. Remaining: ${p.remaining - exec}.`);
      p.remaining -= exec; time = et;
      if (p.remaining === 0) { p.completion = time; completed++; }
    }
  }

  procs.forEach(p => metrics.push({ id:p.id, arrival:p.arrival, burst:p.burst, waiting:p.completion-p.arrival-p.burst, turnaround:p.completion-p.arrival }));
  steps.push(`Avg WT=${(metrics.reduce((s,m)=>s+m.waiting,0)/n).toFixed(2)}, Avg TAT=${(metrics.reduce((s,m)=>s+m.turnaround,0)/n).toFixed(2)}`);
  currentStep = 0;
  document.getElementById("steps").innerHTML = steps.map((s,i)=>`<pre id="step-${i}">${s}</pre>`).join("");
  document.getElementById("result").innerHTML = "<strong>Output : </strong>Click Next.";
  document.querySelector(".start").disabled = true;
  document.querySelector(".next").disabled = false;
  document.querySelector(".reset").disabled = false;
}

function renderGantt(n) {
  let h = "<strong>Gantt Chart:</strong><div class='gantt'>";
  for (let i = 0; i < Math.min(n-1, ganttData.length); i++) {
    const g = ganttData[i];
    h += `<div><div class="gantt-block" style="width:${(g.end-g.start)*30}px">${g.id}</div><div class="gantt-time">${g.start}-${g.end}</div></div>`;
  }
  h += "</div>";
  if (n >= steps.length && metrics.length) {
    h += "<table class='metrics-table'><tr><th>Process</th><th>WT</th><th>TAT</th></tr>";
    metrics.forEach(m => h += `<tr><td>${m.id}</td><td>${m.waiting}</td><td>${m.turnaround}</td></tr>`);
    h += "</table>";
  }
  return h;
}

function nextStep() {
  if (currentStep >= steps.length) { alert("Completed."); return; }
  document.getElementById(`step-${currentStep-1}`)?.classList.remove("active");
  document.getElementById(`step-${currentStep}`).classList.add("active");
  document.getElementById("result").innerHTML = "<strong>Output : </strong><br>" + renderGantt(currentStep+1);
  currentStep++;
  if (currentStep >= steps.length) document.querySelector(".next").disabled = true;
}

function resetSim() {
  buildInputs(); document.getElementById("steps").innerHTML = "";
  document.getElementById("result").innerHTML = "<strong>Output : </strong>Enter process details and click Start.";
  steps=[]; currentStep=0;
  document.querySelector(".start").disabled = false;
  document.querySelector(".next").disabled = true;
  document.querySelector(".reset").disabled = true;
}
