let steps = [];
let currentStep = 0;
let ganttData = [];
let metrics = [];
let queueSnapshots = [];

window.onload = function () {
  buildInputs();
  document.querySelector(".next").disabled = true;
  document.querySelector(".reset").disabled = true;
};

function buildInputs() {
  const n = Math.min(6, Math.max(1, parseInt(document.getElementById("numProc").value) || 3));
  document.getElementById("numProc").value = n;
  const container = document.getElementById("procInputs");
  let html = '<table class="process-table"><tr><th>Process</th><th>Arrival Time</th><th>Burst Time</th></tr>';
  for (let i = 0; i < n; i++) {
    html += `<tr><td>P${i + 1}</td>
      <td><input type="number" id="at${i}" min="0" value="${i}" style="width:60px"></td>
      <td><input type="number" id="bt${i}" min="1" value="${(i + 1) * 3}" style="width:60px"></td></tr>`;
  }
  html += '</table>';
  container.innerHTML = html;
}

function start() {
  const quantum = parseInt(document.getElementById("quantum").value);
  const n = parseInt(document.getElementById("numProc").value);
  if (!quantum || quantum < 1) { alert("Enter valid time quantum."); return; }

  let procs = [];
  for (let i = 0; i < n; i++) {
    const at = parseInt(document.getElementById(`at${i}`).value);
    const bt = parseInt(document.getElementById(`bt${i}`).value);
    if (isNaN(at) || isNaN(bt) || bt < 1 || at < 0) {
      alert("Please enter valid arrival and burst times.");
      return;
    }
    procs.push({ id: `P${i + 1}`, arrival: at, burst: bt, remaining: bt, completion: 0 });
  }

  steps = [];
  ganttData = [];
  queueSnapshots = [];
  metrics = [];

  steps.push(`Round Robin Algorithm with Time Quantum = ${quantum}`);
  steps.push("Processes are scheduled in FIFO order from the ready queue.");

  let time = 0;
  let queue = [];
  let completed = 0;
  const total = procs.length;
  let arrived = new Set();

  while (completed < total) {
    procs.forEach(p => {
      if (p.arrival <= time && p.remaining > 0 && !arrived.has(p.id)) {
        queue.push(p);
        arrived.add(p.id);
      }
    });

    if (queue.length === 0) {
      const nextArr = procs.filter(p => p.remaining > 0).sort((a, b) => a.arrival - b.arrival)[0];
      if (nextArr) {
        steps.push(`CPU idle from time ${time} to ${nextArr.arrival}.`);
        time = nextArr.arrival;
        continue;
      }
      break;
    }

    const p = queue.shift();
    const exec = Math.min(quantum, p.remaining);
    const startT = time;
    const endT = time + exec;
    ganttData.push({ id: p.id, start: startT, end: endT });
    steps.push(`Time ${startT}-${endT}: Execute ${p.id} for ${exec} unit(s). Remaining burst: ${p.remaining - exec}. Queue: [${queue.map(x => x.id).join(", ") || "empty"}]`);
    queueSnapshots.push([...queue.map(x => x.id)]);

    p.remaining -= exec;
    time = endT;

    procs.forEach(other => {
      if (other.arrival <= time && other.remaining > 0 && other.id !== p.id && !queue.includes(other) && other.remaining < other.burst) {
        if (!queue.find(q => q.id === other.id)) queue.push(other);
      }
      if (other.arrival <= time && other.remaining > 0 && other.arrival === time && !arrived.has(other.id)) {
        queue.push(other);
        arrived.add(other.id);
      }
    });

    procs.forEach(other => {
      if (other.arrival > startT && other.arrival <= time && other.remaining > 0 && !arrived.has(other.id)) {
        queue.push(other);
        arrived.add(other.id);
      }
    });

    if (p.remaining > 0) {
      queue.push(p);
    } else {
      p.completion = time;
      completed++;
    }
  }

  procs.forEach(p => {
    metrics.push({
      id: p.id, arrival: p.arrival, burst: p.burst,
      waiting: p.completion - p.arrival - p.burst,
      turnaround: p.completion - p.arrival
    });
  });

  const avgWT = (metrics.reduce((s, m) => s + m.waiting, 0) / metrics.length).toFixed(2);
  const avgTAT = (metrics.reduce((s, m) => s + m.turnaround, 0) / metrics.length).toFixed(2);
  steps.push(`Average Waiting Time = ${avgWT}, Average Turnaround Time = ${avgTAT}.`);

  currentStep = 0;
  document.getElementById("steps").innerHTML = steps.map((s, i) => `<pre id="step-${i}">${s}</pre>`).join("");
  document.getElementById("result").innerHTML = "<strong>Output : </strong>Click Next to step through execution.";
  document.querySelector(".start").disabled = true;
  document.querySelector(".next").disabled = false;
  document.querySelector(".reset").disabled = false;
}

function renderGantt(upToStep) {
  let html = "<strong>Gantt Chart:</strong><div class='gantt'>";
  const execSteps = steps.filter(s => s.startsWith("Time "));
  const shown = Math.min(upToStep - 2, ganttData.length);
  for (let i = 0; i < shown; i++) {
    const g = ganttData[i];
    const width = Math.max(30, (g.end - g.start) * 25);
    html += `<div><div class="gantt-block" style="width:${width}px">${g.id}</div><div class="gantt-time">${g.start}-${g.end}</div></div>`;
  }
  html += "</div>";

  if (shown > 0 && queueSnapshots[shown - 1]) {
    html += `<div class="queue-display"><strong>Ready Queue:</strong> [${queueSnapshots[shown - 1].join(", ") || "empty"}]</div>`;
  }

  if (upToStep >= steps.length && metrics.length) {
    html += "<table class='metrics-table'><tr><th>Process</th><th>Arrival</th><th>Burst</th><th>Waiting</th><th>Turnaround</th></tr>";
    metrics.forEach(m => {
      html += `<tr><td>${m.id}</td><td>${m.arrival}</td><td>${m.burst}</td><td>${m.waiting}</td><td>${m.turnaround}</td></tr>`;
    });
    const avgWT = (metrics.reduce((s, m) => s + m.waiting, 0) / metrics.length).toFixed(2);
    const avgTAT = (metrics.reduce((s, m) => s + m.turnaround, 0) / metrics.length).toFixed(2);
    html += `<tr><td colspan="3"><strong>Average</strong></td><td><strong>${avgWT}</strong></td><td><strong>${avgTAT}</strong></td></tr></table>`;
  }
  return html;
}

function nextStep() {
  if (currentStep >= steps.length) { alert("Simulation Completed."); return; }
  document.getElementById(`step-${currentStep - 1}`)?.classList.remove("active");
  document.getElementById(`step-${currentStep}`).classList.add("active");
  document.getElementById("result").innerHTML = "<strong>Output : </strong><br>" + renderGantt(currentStep + 1);
  currentStep++;
  if (currentStep >= steps.length) document.querySelector(".next").disabled = true;
}

function resetSim() {
  buildInputs();
  document.getElementById("steps").innerHTML = "";
  document.getElementById("result").innerHTML = "<strong>Output : </strong>Enter process details and click Start.";
  steps = []; currentStep = 0;
  document.querySelector(".start").disabled = false;
  document.querySelector(".next").disabled = true;
  document.querySelector(".reset").disabled = true;
}
