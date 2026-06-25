# Update procedure pages with OS lab steps
$base = Split-Path -Parent $MyInvocation.MyCommand.Path
$titles = @{
  1="Operating System Architecture Explorer"; 2="Process State Transition Simulator"; 3="Producer Consumer Problem"
  4="Reader Writer Problem"; 5="FCFS Scheduling Simulator"; 6="SJF Scheduling Simulator"
  7="Round Robin Scheduling Simulator"; 8="Banker's Algorithm Simulator"; 9="Memory Management Simulator"; 10="Disk Scheduling Simulator"
}
$steps = @{
  5=@("Read the theory section on FCFS scheduling.","Take the pretest quiz.","Open the Simulation page.","Enter number of processes with arrival and burst times.","Click Start to compute FCFS schedule.","Click Next to step through each scheduling decision.","Observe the Gantt chart and metrics.","Take the posttest quiz.")
  7=@("Read the theory section on Round Robin scheduling.","Take the pretest quiz.","Open the Simulation page.","Set time quantum and enter process details.","Click Start to begin simulation.","Click Next to observe queue and Gantt chart updates.","Compare waiting and turnaround times.","Take the posttest quiz.")
}
$default = @("Read the Aim and Theory sections.","Take the pretest quiz.","Open the Simulation page.","Configure inputs as described.","Click Start, then Next for step-by-step execution.","Observe the visualization and results.","Review performance metrics.","Take the posttest quiz.")

foreach ($n in 1..10) {
  $s = if ($steps[$n]) { $steps[$n] } else { $default }
  $ol = ($s | ForEach-Object { "<li>$_</li>" }) -join ""
  $html = @"
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Virtual Operating System Laboratory</title><link rel="stylesheet" href="style.css"></head>
<body>
<header><div class="menu-bar"><div class="menu-icon" id="menuToggle">&#9776;</div><div class="logo"><img src="../logo.jpg" alt="Logo"/></div></div>
<div class="orange-line"></div>
<h2 align="left" style="color:#4a90e2"><div class="section"><a href="../index.html">Virtual Operating System Laboratory</a></div></h2>
<div class="grey-line"></div></header>
<main class="content"><h1 align="center">$($titles[$n]) - Procedure</h1>
<ol class="section">$ol</ol></main>
<div class="modal-overlay" id="modalOverlay"><div class="modal"><div class="modal-header"><img src="../logo.jpg" class="modal-logo"/><span class="close-btn" id="closeModal">&times;</span></div>
<ul class="modal-menu"><li><a href=AO.html>Aim</a></li><li><a href=theory.html>Theory</a></li><li><a href=quiz.html>Pretest</a></li><li><a href=pro.html class="active">Procedure</a></li><li><a href=sim.html>Simulation</a></li><li><a href=postt.html>Posttest</a></li><li><a href=ref.html>References</a></li><li><a href=feed2.html>Feedback</a></li></ul></div></div>
<script src="script.js"></script></body></html>
"@
  Set-Content -Path (Join-Path $base "Exp$n\pro.html") -Value $html -Encoding UTF8
}
Write-Host "Procedure pages updated."
