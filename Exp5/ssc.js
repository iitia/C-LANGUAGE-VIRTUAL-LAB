let steps = [];
let currentStep = 0;
let processes = [];
let ganttData = [];
let metrics = [];

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
      <td><input type="number" id="bt${i}" min="1" value="${(i + 1) * 2}" style="width:60px"></td></tr>`;
  }
  html += '</table>';
  container.innerHTML = html;
}

function start() {
  const n = parseInt(document.getElementById("numProc").value);
  processes = [];
  for (let i = 0; i < n; i++) {
    const at = parseInt(document.getElementById(`at${i}`).value);
    const bt = parseInt(document.getElementById(`bt${i}`).value);
    if (isNaN(at) || isNaN(bt) || bt < 1 || at < 0) {
      alert("Please enter valid arrival and burst times.");
      return;
    }
    processes.push({ id: `P${i + 1}`, arrival: at, burst: bt, remaining: bt });
  }

  processes.sort((a, b) => a.arrival - b.arrival || a.id.localeCompare(b.id));

  steps = [];
  ganttData = [];
  let time = 0;
  let totalWT = 0, totalTAT = 0;
  metrics = [];

  steps.push("FCFS Algorithm: Processes are scheduled in order of arrival time.");
  steps.push(`Sorted processes by arrival: ${processes.map(p => p.id).join(", ")}`);

  processes.forEach((p, idx) => {
    if (time < p.arrival) {
      steps.push(`CPU idle from time ${time} to ${p.arrival} (no process ready).`);
      time = p.arrival;
    }
    const startTime = time;
    const finishTime = time + p.burst;
    const waiting = startTime - p.arrival;
    const turnaround = finishTime - p.arrival;
    totalWT += waiting;
    totalTAT += turnaround;
    ganttData.push({ id: p.id, start: startTime, end: finishTime });
    steps.push(`Step ${idx + 1}: Execute ${p.id} from time ${startTime} to ${finishTime}. Waiting Time = ${waiting}, Turnaround Time = ${turnaround}.`);
    time = finishTime;
    metrics.push({ id: p.id, arrival: p.arrival, burst: p.burst, waiting, turnaround });
  });

  const avgWT = (totalWT / processes.length).toFixed(2);
  const avgTAT = (totalTAT / processes.length).toFixed(2);
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
  const shown = Math.min(upToStep - 1, ganttData.length);
  for (let i = 0; i < shown; i++) {
    const g = ganttData[i];
    const width = (g.end - g.start) * 30;
    html += `<div><div class="gantt-block" style="width:${width}px">${g.id}</div><div class="gantt-time">${g.start}-${g.end}</div></div>`;
  }
  html += "</div>";

  if (shown === ganttData.length && metrics.length) {
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
  if (currentStep >= steps.length) {
    alert("Simulation Completed.");
    return;
  }
  const prev = document.getElementById(`step-${currentStep - 1}`);
  if (prev) prev.classList.remove("active");
  const step = document.getElementById(`step-${currentStep}`);
  step.classList.add("active");

  let resultHtml = "<strong>Output : </strong><br>" + renderGantt(currentStep);
  if (currentStep === steps.length - 1) {
    resultHtml += "<br><strong>FCFS scheduling completed.</strong>";
  }
  document.getElementById("result").innerHTML = resultHtml;
  currentStep++;
  if (currentStep >= steps.length) {
    document.querySelector(".next").disabled = true;
  }
}

function resetSim() {
  buildInputs();
  document.getElementById("steps").innerHTML = "";
  document.getElementById("result").innerHTML = "<strong>Output : </strong>Enter process details and click Start.";
  steps = [];
  currentStep = 0;
  document.querySelector(".start").disabled = false;
  document.querySelector(".next").disabled = true;
  document.querySelector(".reset").disabled = true;
}
