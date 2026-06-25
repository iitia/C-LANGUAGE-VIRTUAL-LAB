let steps = [], currentStep = 0;
const info = {
  user: ["User Mode: Applications run in restricted mode.", "Cannot directly access hardware or kernel memory.", "Must use system calls for OS services.", "Example: File read request from application.", "System call trap switches to kernel mode."],
  shell: ["Shell interprets user commands.", "Shell is a system program running in user mode.", "Translates commands into system call requests.", "Example: 'ls' command invokes directory read syscall.", "Provides interface between user and OS."],
  syscall: ["System Call Interface is the boundary between user and kernel mode.", "Trap instruction switches CPU to kernel mode.", "Parameters passed via registers or stack.", "Kernel validates request and executes.", "Control returns to user mode after completion."],
  kernel: ["Kernel Mode: Full hardware access.", "Components: Process Management, Memory Management, File System, I/O.", "Scheduler decides which process runs on CPU.", "Memory manager handles paging and allocation.", "Device drivers manage hardware I/O."],
  hardware: ["Hardware Layer: CPU, RAM, Disk, Network.", "CPU executes instructions and handles interrupts.", "Memory stores programs and data.", "I/O devices communicate via controllers.", "OS abstracts hardware for applications."]
};

window.onload = () => { document.querySelector(".next").disabled = true; document.querySelector(".reset").disabled = true; };

function highlight(comp) {
  ["user","shell","syscall","kernel","hardware"].forEach(c => document.getElementById("l-"+c)?.classList.remove("active"));
  if (comp) document.getElementById("l-"+comp)?.classList.add("active");
}

function start() {
  const c = document.getElementById("component").value;
  if (!c) { alert("Select a component."); return; }
  steps = info[c];
  currentStep = 0;
  document.getElementById("steps").innerHTML = steps.map((s,i)=>`<pre id="step-${i}">${s}</pre>`).join("");
  highlight(null);
  document.querySelector(".start").disabled = true;
  document.querySelector(".next").disabled = false;
  document.querySelector(".reset").disabled = false;
}

function nextStep() {
  if (currentStep >= steps.length) { alert("Completed."); return; }
  document.getElementById(`step-${currentStep-1}`)?.classList.remove("active");
  document.getElementById(`step-${currentStep}`).classList.add("active");
  highlight(document.getElementById("component").value);
  currentStep++;
  if (currentStep >= steps.length) document.querySelector(".next").disabled = true;
}

function resetSim() {
  steps=[]; currentStep=0;
  document.getElementById("component").selectedIndex = 0;
  document.getElementById("steps").innerHTML = "";
  highlight(null);
  document.querySelector(".start").disabled = false;
  document.querySelector(".next").disabled = true;
  document.querySelector(".reset").disabled = true;
}
