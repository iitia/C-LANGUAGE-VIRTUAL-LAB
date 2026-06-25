let steps = [], currentStep = 0, sequence = [], seekTotal = 0;

window.onload = () => { document.querySelector(".next").disabled = true; document.querySelector(".reset").disabled = true; };

function computeSequence(algo, head, reqs) {
  let seq = [], remaining = [...reqs], pos = head;
  if (algo === "fcfs") {
    seq = [...reqs];
  } else if (algo === "sstf") {
    while (remaining.length) {
      remaining.sort((a,b) => Math.abs(a-pos) - Math.abs(b-pos));
      seq.push(remaining.shift());
      pos = seq[seq.length-1];
    }
  } else if (algo === "scan") {
    const left = remaining.filter(r => r < head).sort((a,b)=>b-a);
    const right = remaining.filter(r => r >= head).sort((a,b)=>a-b);
    seq = [...right, ...left];
  } else {
    const right = remaining.filter(r => r >= head).sort((a,b)=>a-b);
    const left = remaining.filter(r => r < head).sort((a,b)=>a-b);
    seq = [...right, ...left];
  }
  return seq;
}

function start() {
  const algo = document.getElementById("algo").value;
  const head = parseInt(document.getElementById("head").value);
  const reqs = document.getElementById("requests").value.split(",").map(Number).filter(n=>!isNaN(n));
  if (!reqs.length) { alert("Enter valid requests."); return; }
  sequence = computeSequence(algo, head, reqs);
  steps = [`Algorithm: ${document.getElementById("algo").selectedOptions[0].text}`, `Initial head: ${head}`, `Request queue: [${reqs.join(", ")}]`, `Service sequence: [${sequence.join(", ")}]`];
  let pos = head; seekTotal = 0;
  sequence.forEach((r,i) => { const seek = Math.abs(r-pos); seekTotal += seek; steps.push(`Step ${i+1}: Move head ${pos} → ${r}. Seek = ${seek}. Total seek = ${seekTotal}.`); pos = r; });
  steps.push(`Total seek time = ${seekTotal} cylinders.`);
  currentStep = 0;
  document.getElementById("steps").innerHTML = steps.map((s,i)=>`<pre id="step-${i}">${s}</pre>`).join("");
  document.getElementById("result").innerHTML = `<strong>Head at: ${head}</strong>`;
  document.querySelector(".start").disabled = true;
  document.querySelector(".next").disabled = false;
  document.querySelector(".reset").disabled = false;
}

function renderDisk(step) {
  const head = parseInt(document.getElementById("head").value);
  let pos = head, served = [];
  for (let i = 0; i < Math.min(step-3, sequence.length); i++) { served.push(sequence[i]); pos = sequence[i]; }
  const all = [...new Set([head, ...document.getElementById("requests").value.split(",").map(Number), ...sequence])].sort((a,b)=>a-b);
  let h = `<strong>Head: ${pos} | Seek: ${seekTotal}</strong><div class="disk">`;
  all.forEach(c => {
    let cls = "cyl";
    if (c === pos) cls += " head";
    else if (served.includes(c)) cls += " served";
    h += `<div class="${cls}">${c}</div>`;
  });
  document.getElementById("result").innerHTML = h + '</div>';
}

function nextStep() {
  if (currentStep >= steps.length) { alert("Completed."); return; }
  document.getElementById(`step-${currentStep-1}`)?.classList.remove("active");
  document.getElementById(`step-${currentStep}`).classList.add("active");
  if (currentStep >= 3) renderDisk(currentStep);
  currentStep++;
  if (currentStep >= steps.length) document.querySelector(".next").disabled = true;
}

function resetSim() {
  steps=[]; currentStep=0; sequence=[];
  document.getElementById("steps").innerHTML = "";
  document.getElementById("result").innerHTML = "";
  document.querySelector(".start").disabled = false;
  document.querySelector(".next").disabled = true;
  document.querySelector(".reset").disabled = true;
}
