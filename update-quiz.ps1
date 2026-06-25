# Update quiz and references with OS content
$base = Split-Path -Parent $MyInvocation.MyCommand.Path

$quizData = @{
  1 = @(
    @{q="What is the core component of an OS?"; a="Kernel"; b="Shell"; c="Compiler"; d="Browser"; ans="a"}
    @{q="System calls switch between:"; a="User and Kernel mode"; b="Two programs"; c="RAM and ROM"; d="Input and Output"; ans="a"}
    @{q="Which is NOT an OS type?"; a="Batch OS"; b="Real-time OS"; c="HTML OS"; d="Distributed OS"; ans="c"}
    @{q="Applications run in:"; a="User mode"; b="Kernel mode"; c="BIOS mode"; d="Safe mode"; ans="a"}
    @{q="OS acts as intermediary between:"; a="Hardware and Software"; b="CPU and GPU only"; c="User and Internet"; d="RAM and Disk only"; ans="a"}
  )
  5 = @(
    @{q="FCFS stands for:"; a="First-Come First-Serve"; b="Fast CPU First Schedule"; c="First CPU First Serve"; d="Fixed Come Fixed Serve"; ans="a"}
    @{q="FCFS is:"; a="Non-preemptive"; b="Always preemptive"; c="Random"; d="Priority based"; ans="a"}
    @{q="Turnaround time equals:"; a="Completion - Arrival"; b="Burst + Waiting"; c="Arrival - Burst"; d="Quantum * Burst"; ans="a"}
    @{q="Convoy effect occurs in:"; a="FCFS with long processes"; b="Round Robin only"; c="SJF always"; d="Banker's algorithm"; ans="a"}
    @{q="Waiting time is time spent in:"; a="Ready queue"; b="Running state"; c="Terminated state"; d="New state"; ans="a"}
  )
  7 = @(
    @{q="Round Robin uses:"; a="Time quantum"; b="Priority only"; c="Burst time only"; d="No queue"; ans="a"}
    @{q="Round Robin is:"; a="Preemptive"; b="Non-preemptive"; c="Deadlock free always"; d="Optimal"; ans="a"}
    @{q="After quantum expires process goes to:"; a="End of ready queue"; b="Terminated"; c="Waiting"; d="New"; ans="a"}
    @{q="Smaller quantum increases:"; a="Context switches"; b="Throughput always"; c="Burst time"; d="Deadlocks"; ans="a"}
    @{q="RR is ideal for:"; a="Time-sharing systems"; b="Batch systems only"; c="Real-time only"; d="Single process"; ans="a"}
  )
}

$quizTemplate = @'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Virtual Operating System Laboratory</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header>
    <div class="menu-bar">
      <div class="menu-icon" id="menuToggle">&#9776;</div>
      <div class="logo"><img src="../logo.jpg" alt="Virtual Labs Logo" /></div>
    </div>
    <div class="orange-line"></div>
    <h2 align="left" style="color:#4a90e2"><div class="section"><a href="#">Computer Science and Engineering</a> > <a href="../index.html">Virtual Operating System Laboratory</a> > <a href="../LOE.html">Experiments</a></div></h2>
    <div class="grey-line"></div>
  </header>
  <main class="content">
   <h1 align="center">__TITLE__ - Pretest</h1>
   __QUESTIONS__
   <button onclick="checkAnswersI()">Submit</button>
   <p id="result"></p>
  </main>
  <div class="modal-overlay" id="modalOverlay">
    <div class="modal">
      <div class="modal-header"><img src="../logo.jpg" alt="Logo" class="modal-logo"/><span class="close-btn" id="closeModal">&times;</span></div>
      <ul class="modal-menu">
        <li><a href=AO.html>Aim</a></li><li><a href=theory.html>Theory</a></li><li><a href=quiz.html class="active">Pretest</a></li>
        <li><a href=pro.html>Procedure</a></li><li><a href=sim.html>Simulation</a></li><li><a href="postt.html">Posttest</a></li>
        <li><a href=ref.html>References</a></li><li><a href=feed2.html>Feedback</a></li>
      </ul>
    </div>
  </div>
  <script src="script.js"></script>
</body>
</html>
'@

$defaultQuiz = @(
  @{q="Which is an OS function?"; a="Process management"; b="Web design"; c="Image editing"; d="Music production"; ans="a"}
  @{q="A process is:"; a="Program in execution"; b="A file only"; c="Hardware device"; d="Network cable"; ans="a"}
  @{q="Deadlock involves:"; a="Circular wait"; b="Fast CPU"; c="Large memory"; d="Quick I/O"; ans="a"}
  @{q="Paging divides memory into:"; a="Frames and pages"; b="Sectors only"; c="Tracks only"; d="Clusters only"; ans="a"}
  @{q="Semaphore is used for:"; a="Synchronization"; b="Compilation"; c="Formatting"; d="Printing only"; ans="a"}
)

$titles = @{
  1="Operating System Architecture Explorer"; 2="Process State Transition Simulator"; 3="Producer Consumer Problem"
  4="Reader Writer Problem"; 5="FCFS Scheduling Simulator"; 6="SJF Scheduling Simulator"
  7="Round Robin Scheduling Simulator"; 8="Banker's Algorithm Simulator"; 9="Memory Management Simulator"; 10="Disk Scheduling Simulator"
}

foreach ($n in 1..10) {
  $qs = if ($quizData[$n]) { $quizData[$n] } else { $defaultQuiz }
  $qHtml = ""
  for ($i = 0; $i -lt $qs.Count; $i++) {
    $qi = $i + 1
    $q = $qs[$i]
    $qHtml += "<p><strong>Q$qi. $($q.q)</strong><br>"
    foreach ($opt in @("a","b","c","d")) {
      $qHtml += "<label><input type=radio name=q$qi value=$opt> $($q.$opt)</label><br>"
    }
    $qHtml += "</p>"
  }
  $html = $quizTemplate -replace '__TITLE__', $titles[$n] -replace '__QUESTIONS__', $qHtml
  Set-Content -Path (Join-Path $base "Exp$n\quiz.html") -Value $html -Encoding UTF8

  $refHtml = @"
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Virtual Operating System Laboratory</title><link rel="stylesheet" href="style.css"></head>
<body>
<header><div class="menu-bar"><div class="menu-icon" id="menuToggle">&#9776;</div><div class="logo"><img src="../logo.jpg" alt="Logo"/></div></div>
<div class="orange-line"></div>
<h2 align="left" style="color:#4a90e2"><div class="section"><a href="../index.html">Virtual Operating System Laboratory</a></div></h2></header>
<main class="content"><h1 align="center">References</h1>
<ol><li>Silberschatz, Galvin, Gagne - Operating System Concepts</li><li>William Stallings - Operating Systems</li><li>Abraham Silberschatz - Operating Systems Internals and Design Principles</li><li>NPTEL Operating Systems Course</li></ol></main>
<div class="modal-overlay" id="modalOverlay"><div class="modal"><div class="modal-header"><img src="../logo.jpg" class="modal-logo"/><span class="close-btn" id="closeModal">&times;</span></div>
<ul class="modal-menu"><li><a href=AO.html>Aim</a></li><li><a href=theory.html>Theory</a></li><li><a href=quiz.html>Pretest</a></li><li><a href=pro.html>Procedure</a></li><li><a href=sim.html>Simulation</a></li><li><a href=postt.html>Posttest</a></li><li><a href=ref.html class="active">References</a></li><li><a href=feed2.html>Feedback</a></li></ul></div></div>
<script src="script.js"></script></body></html>
"@
  Set-Content -Path (Join-Path $base "Exp$n\ref.html") -Value $refHtml -Encoding UTF8
}
Write-Host "Quiz and reference pages updated."
