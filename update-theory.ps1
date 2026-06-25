# Generate OS theory pages (same UI structure as original)
$base = Split-Path -Parent $MyInvocation.MyCommand.Path

$theories = @{
  1 = @{ title="Operating System Architecture Explorer"; body=@"
<h2>What is an Operating System?</h2>
<p>An Operating System (OS) is system software that acts as an intermediary between computer hardware and application programs. It manages hardware resources and provides services for application software.</p>
<h2>Types of Operating Systems</h2>
<ul><li>Batch Operating Systems</li><li>Time-Sharing Systems</li><li>Distributed Operating Systems</li><li>Real-Time Operating Systems</li><li>Mobile Operating Systems</li></ul>
<h2>Kernel Architecture</h2>
<p>The kernel is the core of the OS running in privileged mode. Types include monolithic kernel, microkernel, and hybrid kernel.</p>
<h2>User Mode vs Kernel Mode</h2>
<p>User mode restricts direct hardware access. Kernel mode allows full system control. System calls switch between modes.</p>
<h2>System Calls</h2>
<p>System calls provide an interface for applications to request OS services such as file operations, process control, and device management.</p>
"@ }
  2 = @{ title="Process State Transition Simulator"; body=@"
<h2>Process Concept</h2>
<p>A process is a program in execution. It includes the program code, data, program counter, registers, and stack.</p>
<h2>Process States</h2>
<ul><li><b>New:</b> Process is being created</li><li><b>Ready:</b> Waiting to be assigned to CPU</li><li><b>Running:</b> Instructions being executed</li><li><b>Waiting:</b> Waiting for I/O or event</li><li><b>Terminated:</b> Process has finished execution</li></ul>
<h2>Process Control Block (PCB)</h2>
<p>The PCB stores process state, program counter, CPU registers, memory management info, and I/O status.</p>
"@ }
  3 = @{ title="Producer Consumer Problem"; body=@"
<h2>Process Synchronization</h2>
<p>When concurrent processes share data, synchronization ensures consistency and prevents race conditions.</p>
<h2>Producer-Consumer Problem</h2>
<p>Producers generate data and place it in a bounded buffer. Consumers remove and process data. Semaphores (mutex, empty, full) coordinate access.</p>
<h2>Semaphores</h2>
<p>A semaphore is an integer variable accessed only through wait() and signal() operations for process synchronization.</p>
"@ }
  4 = @{ title="Reader Writer Problem"; body=@"
<h2>Readers-Writers Problem</h2>
<p>Multiple readers can read simultaneously, but writers require exclusive access. Two types: readers-priority and writers-priority.</p>
<h2>Synchronization with Semaphores</h2>
<p>Uses readcount, mutex, and wrt semaphores to manage concurrent read and write access to shared data.</p>
<h2>Critical Section</h2>
<p>Code segment where shared resources are accessed. Only one process may execute in the critical section at a time.</p>
"@ }
  5 = @{ title="FCFS Scheduling Simulator"; body=@"
<h2>CPU Scheduling</h2>
<p>CPU scheduling selects a process from the ready queue and allocates the CPU. Goals: maximize utilization, throughput, and fairness.</p>
<h2>First-Come First-Serve (FCFS)</h2>
<p>Processes are scheduled in order of arrival. Non-preemptive. Simple but may cause convoy effect with long processes.</p>
<h2>Performance Metrics</h2>
<ul><li><b>Waiting Time:</b> Total time spent waiting in ready queue</li><li><b>Turnaround Time:</b> Completion time minus arrival time</li><li><b>Response Time:</b> Time from arrival to first execution</li></ul>
"@ }
  6 = @{ title="SJF Scheduling Simulator"; body=@"
<h2>Shortest Job First (SJF)</h2>
<p>Schedules the process with smallest burst time first. Optimal for minimum average waiting time but requires knowing burst times.</p>
<h2>Non-Preemptive SJF</h2>
<p>Once a process starts, it runs to completion even if a shorter job arrives.</p>
<h2>Preemptive SJF (SRTF)</h2>
<p>If a new process arrives with shorter remaining time, the current process is preempted.</p>
"@ }
  7 = @{ title="Round Robin Scheduling Simulator"; body=@"
<h2>Round Robin Scheduling</h2>
<p>Each process gets a fixed time quantum. After quantum expires, process moves to end of ready queue. Preemptive and fair for time-sharing systems.</p>
<h2>Time Quantum</h2>
<p>Small quantum increases context switching overhead. Large quantum approaches FCFS behavior.</p>
<h2>Ready Queue</h2>
<p>FIFO queue of processes waiting for CPU. Visualized as circular scheduling with time slices.</p>
"@ }
  8 = @{ title="Banker's Algorithm Simulator"; body=@"
<h2>Deadlock</h2>
<p>Deadlock occurs when processes wait for resources held by each other, creating a circular wait condition.</p>
<h2>Banker's Algorithm</h2>
<p>A deadlock avoidance algorithm that ensures the system always remains in a safe state before granting resource requests.</p>
<h2>Safe State</h2>
<p>A sequence of processes exists where each can obtain needed resources and complete, releasing resources for others.</p>
"@ }
  9 = @{ title="Memory Management Simulator"; body=@"
<h2>Memory Management</h2>
<p>OS manages primary memory allocation, tracking which parts are in use and by which processes.</p>
<h2>Paging</h2>
<p>Physical memory divided into frames; logical memory divided into pages. Page table maps pages to frames.</p>
<h2>Page Replacement Algorithms</h2>
<ul><li><b>FIFO:</b> Replace oldest page</li><li><b>LRU:</b> Replace least recently used page</li><li><b>Optimal:</b> Replace page not used for longest time</li></ul>
"@ }
  10 = @{ title="Disk Scheduling Simulator"; body=@"
<h2>Disk Management</h2>
<p>Disk scheduling algorithms determine the order of servicing disk I/O requests to minimize seek time.</p>
<h2>Algorithms</h2>
<ul><li><b>FCFS:</b> Service requests in arrival order</li><li><b>SSTF:</b> Service nearest request first</li><li><b>SCAN:</b> Head moves in one direction, then reverses</li><li><b>C-SCAN:</b> Circular SCAN, returns to start after reaching end</li></ul>
<h2>Seek Time</h2>
<p>Time for disk head to move to the requested cylinder. Total seek time is sum of all head movements.</p>
"@ }
}

$theoryTemplate = @'
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
  <div class="section">__BODY__</div>
  <div class="modal-overlay" id="modalOverlay">
    <div class="modal">
      <div class="modal-header">
        <img src="../logo.jpg" alt="Logo" class="modal-logo"/>
        <span class="close-btn" id="closeModal">&times;</span>
      </div>
      <ul class="modal-menu">
        <li><a href=AO.html>Aim</a></li>
        <li><a href=theory.html class="active">Theory</a></li>
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

foreach ($n in 1..10) {
  $t = $theories[$n]
  $html = $theoryTemplate -replace '__TITLE__', $t.title -replace '__BODY__', $t.body
  Set-Content -Path (Join-Path $base "Exp$n\theory.html") -Value $html -Encoding UTF8
}
Write-Host "Theory pages updated."
