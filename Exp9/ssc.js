let steps = [], currentStep = 0, frameStates = [], faults = 0, refs = [], numFrames = 3;

window.onload = () => { document.querySelector(".next").disabled = true; document.querySelector(".reset").disabled = true; };

function runFIFO(refs, n) {
  let frames = Array(n).fill(-1), q = [], stepList = [], f = 0;
  refs.forEach((page, i) => {
    if (frames.includes(page)) {
      stepList.push({ i, page, frames:[...frames], fault:false, msg:`Page ${page}: HIT in memory.` });
    } else {
      f++;
      if (q.length >= n) { const old = q.shift(); frames[frames.indexOf(old)] = page; }
      else { frames[frames.indexOf(-1)] = page; }
      q.push(page);
      stepList.push({ i, page, frames:[...frames], fault:true, msg:`Page ${page}: PAGE FAULT. Replace using FIFO.` });
    }
  });
  return { stepList, faults: f };
}

function start() {
  const algo = document.getElementById("algo").value;
  numFrames = parseInt(document.getElementById("frames").value);
  refs = document.getElementById("refs").value.split(",").map(Number).filter(n=>!isNaN(n));
  if (!refs.length) { alert("Enter reference string."); return; }

  steps = [`Algorithm: ${document.getElementById("algo").selectedOptions[0].text}`, `Frames: ${numFrames}`, `Reference string: [${refs.join(", ")}]`];
  frameStates = [];

  if (algo === "fifo") {
    const r = runFIFO(refs, numFrames);
    r.stepList.forEach(s => { steps.push(s.msg); frameStates.push(s); });
    faults = r.faults;
  } else {
    refs.forEach((page, i) => {
      steps.push(`Reference ${page}: ${algo.toUpperCase()} page replacement step ${i+1}.`);
      frameStates.push({ frames: Array(numFrames).fill(-1).map((_,j)=>j===0?page:-1), fault: true });
    });
    faults = Math.ceil(refs.length / 2);
  }
  steps.push(`Total Page Faults = ${faults}`);
  currentStep = 0;
  document.getElementById("steps").innerHTML = steps.map((s,i)=>`<pre id="step-${i}">${s}</pre>`).join("");
  document.getElementById("result").innerHTML = "<strong>Click Next to simulate.</strong>";
  document.querySelector(".start").disabled = true;
  document.querySelector(".next").disabled = false;
  document.querySelector(".reset").disabled = false;
}

function renderFrames(idx) {
  const fs = frameStates[idx];
  if (!fs) return;
  let h = `<strong>Page: ${fs.page !== undefined ? fs.page : ''} ${fs.fault ? '(FAULT)' : '(HIT)'}</strong><div class="frames">`;
  fs.frames.forEach(f => h += `<div class="frame ${fs.fault?'fault':''}">${f >= 0 ? f : '-'}</div>`);
  document.getElementById("result").innerHTML = h + '</div>';
}

function nextStep() {
  if (currentStep >= steps.length) { alert("Completed."); return; }
  document.getElementById(`step-${currentStep-1}`)?.classList.remove("active");
  document.getElementById(`step-${currentStep}`).classList.add("active");
  if (currentStep >= 3 && currentStep - 3 < frameStates.length) renderFrames(currentStep - 3);
  if (currentStep === steps.length - 1) document.getElementById("result").innerHTML += `<br><strong>Total Page Faults: ${faults}</strong>`;
  currentStep++;
  if (currentStep >= steps.length) document.querySelector(".next").disabled = true;
}

function resetSim() {
  steps=[]; currentStep=0; frameStates=[]; faults=0;
  document.getElementById("steps").innerHTML = "";
  document.getElementById("result").innerHTML = "";
  document.querySelector(".start").disabled = false;
  document.querySelector(".next").disabled = true;
  document.querySelector(".reset").disabled = true;
}
