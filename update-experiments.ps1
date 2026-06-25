# Update all experiment folders with OS lab content (same UI structure)
$base = Split-Path -Parent $MyInvocation.MyCommand.Path

$experiments = @(
  @{ n=1; title="Operating System Architecture Explorer"; aim="In this experiment, students will explore the layered architecture of an operating system, understand kernel components, user mode vs kernel mode, and observe system call demonstrations through an interactive simulator." },
  @{ n=2; title="Process State Transition Simulator"; aim="In this experiment, students will visualize process state transitions among New, Ready, Running, Waiting, and Terminated states through an interactive step-by-step simulator." },
  @{ n=3; title="Producer Consumer Problem"; aim="In this experiment, students will simulate the Producer-Consumer problem with adjustable buffer size, semaphore visualization, and real-time producer and consumer actions." },
  @{ n=4; title="Reader Writer Problem"; aim="In this experiment, students will simulate the Readers-Writers problem with multiple readers and writers, lock visualization, and synchronization animation." },
  @{ n=5; title="FCFS Scheduling Simulator"; aim="In this experiment, students will simulate First-Come First-Serve CPU scheduling with process creation, Gantt chart visualization, and calculation of waiting time and turnaround time." },
  @{ n=6; title="SJF Scheduling Simulator"; aim="In this experiment, students will simulate Shortest Job First scheduling in both non-preemptive and preemptive modes with real-time visualization and performance metrics." },
  @{ n=7; title="Round Robin Scheduling Simulator"; aim="In this experiment, students will simulate Round Robin CPU scheduling with adjustable time quantum, ready queue visualization, Gantt chart, and performance metrics." },
  @{ n=8; title="Banker's Algorithm Simulator"; aim="In this experiment, students will simulate Banker's Algorithm for deadlock avoidance using allocation matrix, maximum matrix, need matrix, and safe sequence detection." },
  @{ n=9; title="Memory Management Simulator"; aim="In this experiment, students will simulate page replacement algorithms (FIFO, LRU, Optimal) and memory allocation strategies (First Fit, Best Fit, Worst Fit) with frame visualization." },
  @{ n=10; title="Disk Scheduling Simulator"; aim="In this experiment, students will simulate disk scheduling algorithms (FCFS, SSTF, SCAN, C-SCAN) with disk head animation, request queue visualization, and seek time calculation." }
)

$aoTemplate = @'
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
      <div class="logo">
        <img src="../logo.jpg" alt="Virtual Labs Logo" />
      </div>
    </div>
    <div class="orange-line"></div>
    <h2 align="left" style="color:#4a90e2"><div class="section"><a href="#">Computer Science and Engineering</a> > <a href="../index.html">Virtual Operating System Laboratory</a> > <a href="../LOE.html">Experiments</a></div></h2>
    <div class="grey-line"></div>
  </header>

  <main class="content">
   <h1 align="center">__TITLE__</h1>
  </main>
   <p>
    <div class="section">__AIM__</div>
   </p>
  
  <div class="modal-overlay" id="modalOverlay">
    <div class="modal">
      <div class="modal-header">
        <img src="../logo.jpg" alt="Logo" class="modal-logo"/>
        <span class="close-btn" id="closeModal">&times;</span>
      </div>
      <ul class="modal-menu">
        <li><a href=AO.html class="active">Aim</a></li>
        <li><a href=theory.html>Theory</a></li>
        <li><a href=quiz.html>Pretest</a></li>
        <li><a href=pro.html>Procedure</a></li>
        <li><a href=sim.html>Simulation</a></li>
        <li><a href="postt.html">Posttest</a></li>
        <li><a href=ref.html>References</a></li>
        <li><a href=feed2.html>Feedback</a></li>
      </ul>
    </div>
  </div>
   <script src="script.js"></script>
</body>
</html>
'@

foreach ($exp in $experiments) {
  $dir = Join-Path $base ("Exp" + $exp.n)
  if (-not (Test-Path $dir)) { continue }

  $ao = $aoTemplate -replace '__TITLE__', $exp.title -replace '__AIM__', $exp.aim
  Set-Content -Path (Join-Path $dir "AO.html") -Value $ao -Encoding UTF8

  Get-ChildItem $dir -Filter *.html | ForEach-Object {
    $content = Get-Content $_.FullName -Raw -Encoding UTF8
    $content = $content -replace 'OOPS with Java Programming Lab', 'Virtual Operating System Laboratory'
    $content = $content -replace 'Oops With Java Programming Lab', 'Virtual Operating System Laboratory'
    $content = $content -replace '/VL---OOPS/index.html', '../index.html'
    $content = $content -replace '/VL---OOPS/LOE.html', '../LOE.html'
    $content = $content -replace 'Operators in Java - I', $exp.title
    $content = $content -replace 'src="logo.jpg"', 'src="../logo.jpg"'
    Set-Content -Path $_.FullName -Value $content -Encoding UTF8
  }
}

Write-Host "Updated $($experiments.Count) experiment folders."
