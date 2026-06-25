let steps = [], currentStep = 0;
const transitions = {
  admit: { from:"New", to:"Ready", desc:"Process is admitted to ready queue by job scheduler." },
  dispatch: { from:"Ready", to:"Running", desc:"CPU scheduler selects process and dispatches to CPU." },
  interrupt: { from:"Running", to:"Ready", desc:"Timer interrupt: process time slice expired, returns to ready queue." },
  io: { from:"Running", to:"Waiting", desc:"Process requests I/O and blocks waiting for device." },
  io_complete: { from:"Waiting", to:"Ready", desc:"I/O operation completes, process moves to ready queue." },
  exit: { from:"Running", to:"Terminated", desc:"Process completes execution and terminates." }
};

window.onload = () => { document.querySelector(".next").disabled = true; document.querySelector(".reset").disabled = true; };

function highlight(state) {
  ["new","ready","running","waiting","terminated"].forEach(s => {
    const el = document.getElementById("s-"+s);
    if (el) el.classList.toggle("active", s === state.toLowerCase());
  });
}

function start() {
  const t = document.getElementById("transition").value;
  if (!t) { alert("Select a transition."); return; }
  const tr = transitions[t];
  steps = [
    `Process State Transition: ${tr.from} → ${tr.to}`,
    `Event: ${document.getElementById("transition").selectedOptions[0].text}`,
    tr.desc,
    `Process PCB updated: state field changed from ${tr.from} to ${tr.to}.`,
    `Transition complete. Process is now in ${tr.to} state.`
  ];
  currentStep = 0;
  document.getElementById("steps").innerHTML = steps.map((s,i)=>`<pre id="step-${i}">${s}</pre>`).join("");
  highlight({ to: tr.from });
  document.querySelector(".start").disabled = true;
  document.querySelector(".next").disabled = false;
  document.querySelector(".reset").disabled = false;
}

function nextStep() {
  if (currentStep >= steps.length) { alert("Completed."); return; }
  document.getElementById(`step-${currentStep-1}`)?.classList.remove("active");
  document.getElementById(`step-${currentStep}`).classList.add("active");
  const t = document.getElementById("transition").value;
  if (currentStep >= 2) highlight(transitions[t]);
  currentStep++;
  if (currentStep >= steps.length) document.querySelector(".next").disabled = true;
}

function resetSim() {
  steps=[]; currentStep=0;
  document.getElementById("transition").selectedIndex = 0;
  document.getElementById("steps").innerHTML = "";
  ["new","ready","running","waiting","terminated"].forEach(s => document.getElementById("s-"+s)?.classList.remove("active"));
  document.querySelector(".start").disabled = false;
  document.querySelector(".next").disabled = true;
  document.querySelector(".reset").disabled = true;
}
