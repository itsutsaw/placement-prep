window.SUBJECTS = window.SUBJECTS || [];
window.SUBJECTS.push({
  id: 'os', title: 'Operating Systems', short: 'OS', icon: '💻', color: '#f59e0b', group: 'core',
  desc: 'Processes & threads, CPU scheduling, synchronization, deadlocks, memory management, virtual memory, file systems and disk scheduling.',
  topics: [
    {
      id: 'intro', title: 'OS Basics, Kernel & System Calls',
      content: `
        ## What is an OS?
        Software that manages hardware and provides services to programs — **resource manager** (CPU, memory, I/O) + **extended machine** (abstractions like files and processes).

        ## Types of OS
        | Type | Idea | Example |
        |---|---|---|
        | Batch | jobs grouped, no interaction | early mainframes |
        | Multiprogramming | several programs in memory; CPU switches when one waits for I/O | — |
        | Multitasking / time-sharing | rapid switching gives interactivity | Linux, Windows |
        | Multiprocessing | multiple CPUs | servers |
        | Real-time (RTOS) | strict deadlines — hard / soft | VxWorks, FreeRTOS |
        | Distributed | many machines appear as one | — |

        ## Kernel
        Core of the OS that runs in **kernel mode** (privileged). User programs run in **user mode**; switching happens via system calls/interrupts.

        | Kernel type | Description | Example |
        |---|---|---|
        | **Monolithic** | all services (FS, drivers, scheduling) in kernel space — fast, less isolated | Linux |
        | **Microkernel** | minimal kernel (IPC, scheduling, memory); others in user space — stable, slower (IPC overhead) | Minix, QNX |
        | **Hybrid** | mix | Windows NT, macOS (XNU) |

        ## System calls
        The interface between user programs and the kernel. Categories: process control (\`fork\`, \`exec\`, \`exit\`, \`wait\`), file management (\`open\`, \`read\`, \`write\`, \`close\`), device management (\`ioctl\`), information (\`getpid\`), communication (\`pipe\`, \`shmget\`, \`socket\`).

        ~~~c
        pid_t pid = fork();          // returns 0 in child, child's PID in parent
        if (pid == 0) {
            execlp("ls", "ls", NULL);  // replace child with ls
        } else {
            wait(NULL);                // parent waits
        }
        ~~~
        > 🎯 **Classic:** How many processes does \`fork(); fork(); fork();\` create? → **2³ = 8** processes total (7 new).

        ## Interrupts
        Hardware (keyboard, timer, disk) or software (traps, system calls, exceptions) signals that make the CPU jump to an **interrupt service routine**. The **timer interrupt** enables preemptive scheduling.

        ## Booting
        Power on → BIOS/UEFI (POST) → bootloader (GRUB) → kernel loaded → init/systemd → user space.
      `,
      keyPoints: [
        'OS = resource manager + abstraction provider.',
        'Kernel mode is privileged; user programs enter it via system calls/interrupts.',
        'Monolithic (Linux): fast, all in kernel. Microkernel: minimal kernel, services in user space, more stable.',
        'fork() returns 0 to the child and the child PID to the parent; n forks ⇒ 2ⁿ processes.',
        'exec() replaces the process image; wait() makes parent wait for child.',
        'Timer interrupts make preemptive multitasking possible.'
      ]
    },
    {
      id: 'process-thread', title: 'Processes, Threads & IPC',
      content: `
        ## Process
        A **program in execution**. Memory layout: **text** (code), **data** (globals), **heap** (dynamic, grows up), **stack** (function frames, grows down).

        **PCB (Process Control Block)** stores: PID, state, program counter, registers, scheduling info, memory info (page tables), open files, accounting.

        ## Process states
        **New → Ready → Running → (Waiting/Blocked) → Ready … → Terminated**
        - Running → Ready: preempted (time slice over).
        - Running → Waiting: I/O request.
        - Waiting → Ready: I/O complete.

        ## Schedulers
        - **Long-term** (job scheduler): which jobs enter memory — controls degree of multiprogramming.
        - **Short-term** (CPU scheduler): which ready process runs next — very frequent.
        - **Medium-term**: swapping processes in/out.

        ## Context switch
        Saving the state (PCB) of the current process and loading another's. Pure **overhead** — no useful work done. Thread switches are cheaper than process switches (no address-space change, TLB not flushed).

        ## Process vs Thread
        | Process | Thread |
        |---|---|
        | independent program in execution | lightweight unit of execution inside a process |
        | own address space | shares code, data, heap, files with sibling threads |
        | own stack, registers | own **stack, registers, PC** |
        | heavy creation & context switch | cheap creation & switch |
        | IPC needed to communicate | communicate via shared memory directly |
        | crash isolated | one thread crash can kill the process |

        **User-level vs kernel-level threads**: user threads are managed by a library (fast, but one blocking call blocks all in many-to-one); kernel threads are scheduled by the OS. Models: many-to-one, one-to-one (Linux, Windows), many-to-many.

        ## Special processes
        - **Zombie**: finished, but parent hasn't called \`wait()\` → entry remains in process table.
        - **Orphan**: parent died first → adopted by \`init\`/systemd (PID 1).
        - **Daemon**: background service process.

        ## Inter-Process Communication
        | Mechanism | Notes |
        |---|---|
        | Shared memory | fastest; needs synchronisation |
        | Message passing | send/receive via kernel; simpler, slower |
        | Pipes | unidirectional; anonymous (related processes) or named (FIFO) |
        | Message queues | kernel-managed queues |
        | Sockets | across machines |
        | Signals | async notifications (SIGKILL, SIGINT) |

        ## Concurrency vs parallelism
        **Concurrency** = dealing with many tasks at once by interleaving (can be one core). **Parallelism** = executing many tasks simultaneously (multiple cores).
      `,
      keyPoints: [
        'Process memory: text, data, heap (grows up), stack (grows down).',
        'PCB holds PID, state, PC, registers, memory and file info.',
        'States: New → Ready → Running → Waiting → Terminated.',
        'Threads share code/data/heap/files; each has its own stack, registers and PC.',
        'Context switch = save/restore PCB, pure overhead; thread switch is cheaper.',
        'Zombie: dead child not yet reaped by wait(). Orphan: parent died, adopted by init.',
        'IPC: shared memory (fastest), message passing, pipes, queues, sockets, signals.',
        'Concurrency = interleaving; parallelism = simultaneous execution.'
      ]
    },
    {
      id: 'scheduling', title: 'CPU Scheduling',
      content: `
        ## Terminology
        - **Arrival time (AT)**, **Burst time (BT)**, **Completion time (CT)**
        - **Turnaround time** TAT = CT − AT
        - **Waiting time** WT = TAT − BT
        - **Response time** = first time on CPU − AT
        - **Throughput** = processes completed per unit time
        - **Preemptive**: running process can be interrupted. **Non-preemptive**: runs until it finishes or blocks.

        ## Algorithms
        | Algorithm | Preemptive? | Pros | Cons |
        |---|---|---|---|
        | **FCFS** | No | simple | **convoy effect** (short jobs wait behind long) |
        | **SJF** | No | **optimal average waiting time** | needs burst prediction; starvation of long jobs |
        | **SRTF** (preemptive SJF) | Yes | minimal avg WT | starvation, frequent switches |
        | **Priority** | Both | important first | **starvation** → fix with **aging** |
        | **Round Robin** | Yes | fair, good response time | performance depends on **time quantum** |
        | **Multilevel queue** | — | separate queues (system, interactive, batch) | rigid |
        | **Multilevel feedback queue** | Yes | processes move between queues; adapts | complex to tune |

        Round robin quantum: too large → becomes FCFS; too small → too many context switches.

        ## Worked example (FCFS)
        | Process | AT | BT | CT | TAT | WT |
        |---|---|---|---|---|---|
        | P1 | 0 | 5 | 5 | 5 | 0 |
        | P2 | 1 | 3 | 8 | 7 | 4 |
        | P3 | 2 | 8 | 16 | 14 | 6 |
        Average WT = (0 + 4 + 6)/3 = **3.33**.

        With **SJF** (non-preemptive): P1 (0–5), P2 (5–8), P3 (8–16) — same here because P2 is shorter anyway. Practice Gantt charts for RR with quantum 2 — it's a very common written-test question.

        > 💡 Linux uses the **Completely Fair Scheduler (CFS)** (red-black tree keyed by virtual runtime), replaced by **EEVDF** in kernel 6.6.
      `,
      keyPoints: [
        'TAT = CT − AT; WT = TAT − BT; Response = first run − AT.',
        'FCFS suffers the convoy effect.',
        'SJF gives the minimum average waiting time (non-preemptive); SRTF is its preemptive form.',
        'Priority scheduling ⇒ starvation; fix with aging.',
        'Round Robin: big quantum → FCFS; tiny quantum → context-switch overhead.',
        'Multilevel feedback queue lets processes move between priority queues.'
      ]
    },
    {
      id: 'synchronization', title: 'Process Synchronization',
      content: `
        ## Race condition & critical section
        A **race condition** occurs when the result depends on the interleaving of threads accessing shared data (e.g. two threads doing \`count++\` — read, add, write — lose updates).
        The **critical section** is the code that accesses shared resources.

        ### Requirements of a solution
        1. **Mutual exclusion** — only one in the critical section.
        2. **Progress** — if none is inside, a waiting one must be allowed in (no needless blocking).
        3. **Bounded waiting** — no starvation; limit on how many times others go first.

        **Peterson's solution** (two processes, uses \`flag[]\` and \`turn\`) satisfies all three in theory. Hardware support: **test-and-set**, **compare-and-swap** atomic instructions.

        ## Mutex vs Semaphore
        | Mutex | Semaphore |
        |---|---|
        | locking mechanism | signalling mechanism (integer counter) |
        | owned — only the locker can unlock | no ownership — any thread can signal |
        | binary (locked/unlocked) | counting (0..n) or binary |
        | protect a critical section | limit access to n resources, ordering between threads |

        ~~~text
        wait(S)   / P(S):  while (S <= 0) ;  S--;     // block if no resource
        signal(S) / V(S):  S++;                         // release
        ~~~
        Busy waiting = **spinlock** (good for very short waits on multicore). Real implementations block the process in a queue.

        ## Classic problems
        ### Producer–Consumer (bounded buffer)
        ~~~text
        semaphore mutex = 1, empty = N, full = 0;
        Producer: wait(empty); wait(mutex); add item; signal(mutex); signal(full);
        Consumer: wait(full);  wait(mutex); remove item; signal(mutex); signal(empty);
        ~~~
        Swapping \`wait(empty)\` and \`wait(mutex)\` can **deadlock**.
        ### Readers–Writers
        Many readers may read at once; writers need exclusive access. Variants favour readers (writers may starve) or writers.
        ### Dining Philosophers
        5 philosophers, 5 forks; each needs 2. Naive solution deadlocks if everyone picks the left fork. Fixes: allow only 4 at the table, pick both forks atomically, or odd philosophers pick left first / even pick right first (break circular wait).

        ## Monitors
        High-level construct: shared data + procedures + **condition variables** (\`wait\`, \`signal\`); only one thread active inside at a time. Java's \`synchronized\` + \`wait()/notify()\` is a monitor.
      `,
      keyPoints: [
        'Race condition: result depends on thread interleaving of shared data.',
        'Critical section solution needs mutual exclusion, progress and bounded waiting.',
        'Mutex = lock with ownership; semaphore = counter for signalling, no ownership.',
        'Semaphore wait(P) decrements/blocks; signal(V) increments.',
        'Producer–consumer: semaphores mutex=1, empty=N, full=0; order of waits matters.',
        "Dining philosophers deadlock fix: break circular wait (asymmetric fork order) or seat only n−1.",
        'Spinlock = busy waiting; OK only for very short critical sections.',
        'Monitor = mutual exclusion + condition variables (Java synchronized/wait/notify).'
      ]
    },
    {
      id: 'deadlock', title: 'Deadlocks',
      content: `
        ## Definition
        A set of processes where each is waiting for a resource held by another in the set — none can proceed.

        ## Four necessary (Coffman) conditions — all must hold
        1. **Mutual exclusion** — resource is non-shareable.
        2. **Hold and wait** — holding one resource while waiting for another.
        3. **No preemption** — resources can't be forcibly taken.
        4. **Circular wait** — P1 waits for P2 … Pn waits for P1.

        ## Handling strategies
        | Strategy | How |
        |---|---|
        | **Prevention** | break one condition: request all resources at once (no hold-and-wait), allow preemption, **impose a global ordering on resources** (no circular wait) |
        | **Avoidance** | only grant requests that keep the system in a **safe state** — **Banker's algorithm** |
        | **Detection & recovery** | let deadlocks happen, detect via wait-for graph cycles, then kill/rollback a process or preempt resources |
        | **Ignorance (Ostrich)** | assume rare; reboot — used by most general-purpose OSes |

        ## Banker's algorithm
        - \`Need = Max − Allocation\`.
        - **Safety algorithm**: Work = Available. Find a process whose Need ≤ Work; pretend it finishes: Work += its Allocation. Repeat. If all finish → **safe** (that order is a safe sequence).
        - A request is granted only if the resulting state is safe.

        ### Example
        Available = (3, 3, 2)
        | Process | Allocation | Max | Need |
        |---|---|---|---|
        | P0 | 0 1 0 | 7 5 3 | 7 4 3 |
        | P1 | 2 0 0 | 3 2 2 | 1 2 2 |
        | P2 | 3 0 2 | 9 0 2 | 6 0 0 |
        | P3 | 2 1 1 | 2 2 2 | 0 1 1 |
        | P4 | 0 0 2 | 4 3 3 | 4 3 1 |
        Safe sequence: **P1 → P3 → P4 → P0 → P2** (one valid order).

        ## Resource allocation graph
        Cycle in RAG: with single-instance resources ⇒ **deadlock**; with multi-instance ⇒ **possible** deadlock.

        ## Related terms
        - **Starvation** — a process waits indefinitely (others keep getting preference); fix with aging.
        - **Livelock** — processes keep changing state in response to each other but make no progress.

        > 🎯 Unsafe state ≠ deadlock. Unsafe means deadlock *may* occur.
      `,
      keyPoints: [
        'Coffman conditions: mutual exclusion, hold and wait, no preemption, circular wait (all four needed).',
        'Prevention breaks a condition — e.g. global resource ordering removes circular wait.',
        "Avoidance = Banker's algorithm; Need = Max − Allocation; grant only if state stays safe.",
        'Unsafe state does not necessarily mean deadlock.',
        'RAG cycle: single instance ⇒ deadlock; multiple instances ⇒ maybe.',
        'Most OSes use the ostrich approach.',
        'Starvation = indefinite waiting; livelock = busy but no progress.'
      ]
    },
    {
      id: 'memory', title: 'Memory Management: Paging & Segmentation',
      content: `
        ## Address binding
        Logical (virtual) address generated by CPU → **MMU** translates → physical address. Binding can occur at compile, load or execution time (execution time needs MMU, enables relocation).

        ## Contiguous allocation
        - Fixed partitions → **internal fragmentation** (unused space inside a block).
        - Variable partitions → **external fragmentation** (free memory in scattered holes). Fixed by **compaction** or non-contiguous allocation.
        - Placement: **First fit** (fast), **Best fit** (smallest hole that fits, leaves tiny holes), **Worst fit** (largest hole), Next fit.

        ## Paging ⭐
        Divide logical memory into fixed-size **pages** and physical memory into **frames** of the same size. A **page table** maps page → frame.
        - Logical address = (page number p, offset d). If page size = 2ⁿ, the last n bits are the offset.
        - **No external fragmentation**; small internal fragmentation in the last page.
        - **TLB** (Translation Lookaside Buffer): a small, fast cache of page-table entries.
          **Effective access time** = h·(t_TLB + t_mem) + (1−h)·(t_TLB + 2·t_mem)
        - Large address spaces → **multi-level page tables**, **inverted page tables**, hashed page tables.

        ### Example
        32-bit logical address, 4 KB pages → offset = 12 bits, page number = 20 bits → 2²⁰ entries. With 4-byte entries, page table = 4 MB per process (hence multi-level tables).

        ## Segmentation
        Divide memory into variable-size logical **segments** (code, stack, heap). Address = (segment, offset); **segment table** stores base & limit. Matches programmer's view, supports protection/sharing, but suffers **external fragmentation**. **Segmented paging** combines both.

        | Paging | Segmentation |
        |---|---|
        | fixed size pages | variable size segments |
        | invisible to programmer | logical units visible to programmer |
        | internal fragmentation | external fragmentation |
        | page table | segment table (base, limit) |

        ## Swapping
        Moving a whole process between memory and disk (backing store) to free memory.
      `,
      keyPoints: [
        'MMU translates logical → physical addresses at runtime.',
        'Internal fragmentation: wasted space inside an allocated block; external: scattered free holes.',
        'Paging: fixed pages ↔ frames; no external fragmentation.',
        'Offset bits = log₂(page size); page number = remaining bits.',
        'TLB caches page-table entries; EAT = h(t_tlb + m) + (1−h)(t_tlb + 2m).',
        'Multi-level page tables reduce page-table memory for large address spaces.',
        'Segmentation: variable segments with base + limit, external fragmentation.',
        'First fit is fastest; best fit leaves tiny unusable holes.'
      ]
    },
    {
      id: 'virtual-memory', title: 'Virtual Memory & Page Replacement',
      content: `
        ## Virtual memory
        Lets a process run even if only part of it is in RAM; gives each process the illusion of a large private address space. Implemented with **demand paging**: load a page only when it's accessed.

        ## Page fault
        Access to a page not in memory → trap to OS → find a free frame (or evict a victim) → read page from disk → update page table → restart instruction.
        **EAT with page faults** = (1 − p)·memory_access + p·page_fault_service_time. Even p = 0.001 slows memory hugely because disk is ~10⁵× slower.

        ## Page replacement algorithms
        | Algorithm | Idea | Notes |
        |---|---|---|
        | **FIFO** | evict the oldest page | suffers **Belady's anomaly** (more frames → more faults) |
        | **Optimal (OPT)** | evict the page used farthest in the future | minimum faults; not implementable — benchmark |
        | **LRU** | evict least recently used | good approximation of OPT; stack algorithm (no Belady) |
        | LRU approximations | reference bit, **Second chance / Clock** | practical |
        | LFU / MFU | least / most frequently used | rarely used |

        ### Worked example — reference string 7 0 1 2 0 3 0 4 2 3 0 3 2, 3 frames
        - FIFO → **10** faults
        - LRU → **9** faults
        - OPT → **7** faults

        ## Thrashing
        The system spends more time **swapping pages** than executing because processes don't have enough frames for their working set. CPU utilisation drops → the OS (wrongly) adds more processes → worse.
        **Fixes:** working-set model, page-fault frequency control, reduce degree of multiprogramming, add RAM.

        ## Other concepts
        - **Locality of reference** (temporal + spatial) — why caching & paging work.
        - **Copy-on-write** — after \`fork()\`, parent and child share pages until one writes.
        - **Memory-mapped files**, **dirty bit** (only write back modified pages).
      `,
      keyPoints: [
        'Virtual memory via demand paging: pages loaded only on access.',
        'Page fault: trap → get frame (evict if needed) → read from disk → update table → restart.',
        "FIFO can show Belady's anomaly; LRU and OPT cannot (stack algorithms).",
        'OPT gives minimum faults but needs future knowledge.',
        'Clock / second-chance approximates LRU using a reference bit.',
        'Thrashing: too little memory per process ⇒ constant paging; fix with working-set model or fewer processes.',
        'Copy-on-write makes fork() cheap.',
        'Locality of reference is why caching works.'
      ]
    },
    {
      id: 'files-disk', title: 'File Systems & Disk Scheduling',
      content: `
        ## File allocation methods
        | Method | How | Pros | Cons |
        |---|---|---|---|
        | Contiguous | consecutive blocks | fast sequential & random access | external fragmentation, hard to grow |
        | Linked | each block points to next (FAT keeps the chain in a table) | no external fragmentation | slow random access, pointer overhead |
        | Indexed | index block lists all blocks (Unix **inode**) | fast random access | index block overhead |

        **Inode** stores metadata (owner, permissions, size, timestamps) + pointers: 12 direct, single, double, triple indirect. The file **name** lives in the directory entry, not the inode. Hard link = another name for the same inode; soft (symbolic) link = a file containing a path.

        ## Free-space management
        Bit vector (bitmap), linked list of free blocks, grouping, counting.

        ## Directory structures
        Single-level, two-level, tree (most common), acyclic graph (shared files via links).

        ## Disk scheduling
        **Seek time** (moving head) dominates; **rotational latency**; **transfer time**.
        | Algorithm | Behaviour |
        |---|---|
        | FCFS | in request order — fair, slow |
        | **SSTF** | nearest request first — good throughput, starvation possible |
        | **SCAN** (elevator) | sweep to one end, then reverse |
        | **C-SCAN** | sweep one direction, jump back to start — uniform wait |
        | LOOK / C-LOOK | like SCAN/C-SCAN but turn at the last request, not the disk end |

        ### Example
        Head at 53, queue: 98, 183, 37, 122, 14, 124, 65, 67
        - FCFS total head movement = **640** cylinders
        - SSTF = **236** (53→65→67→37→14→98→122→124→183)

        > 💡 SSDs have no seek time, so these algorithms matter less; Linux uses the \`none\`/\`mq-deadline\` schedulers for SSDs.

        ## RAID quick recap
        RAID 0 stripe (fast, no redundancy) · RAID 1 mirror · RAID 5 stripe + distributed parity (survives 1 disk) · RAID 6 double parity · RAID 10 mirror + stripe.
      `,
      keyPoints: [
        'Allocation: contiguous (fast, fragmentation), linked/FAT (no fragmentation, slow random), indexed/inode (fast random).',
        'Inode holds metadata + block pointers, not the file name.',
        'Hard link = same inode; soft link = path to the target.',
        'Disk: SSTF can starve; SCAN is elevator; C-SCAN gives more uniform wait times.',
        'LOOK/C-LOOK reverse at the last request instead of the disk end.',
        'Seek time dominates HDD access; SSDs have no seek.'
      ]
    }
  ],
  flashcards: [
    { q: 'Process vs thread?', a: 'Process: independent execution with its own address space. Thread: lightweight unit inside a process sharing code/data/heap but with its own stack, registers and PC.' },
    { q: 'What is a context switch?', a: 'Saving the CPU state (PCB) of one process/thread and restoring another’s. Pure overhead.' },
    { q: 'What does the PCB contain?', a: 'PID, process state, program counter, CPU registers, scheduling info, memory-management info, open files, accounting info.' },
    { q: 'Zombie vs orphan process?', a: 'Zombie: terminated but parent has not called wait(), so its entry remains. Orphan: parent terminated first; adopted by init/systemd.' },
    { q: 'How many processes after n fork() calls in sequence?', a: '2ⁿ processes in total (2ⁿ − 1 new).' },
    { q: 'Which scheduling algorithm gives minimum average waiting time?', a: 'SJF (SRTF in the preemptive case) — but it requires knowing burst times.' },
    { q: 'What is the convoy effect?', a: 'In FCFS, short processes wait behind a long CPU-bound process, increasing average waiting time.' },
    { q: 'What is aging?', a: 'Gradually increasing the priority of waiting processes to prevent starvation.' },
    { q: 'Mutex vs semaphore?', a: 'Mutex: locking with ownership, binary. Semaphore: signalling counter (counting or binary), any thread can signal.' },
    { q: 'Three requirements of a critical-section solution?', a: 'Mutual exclusion, progress, bounded waiting.' },
    { q: 'Four necessary conditions for deadlock?', a: 'Mutual exclusion, hold and wait, no preemption, circular wait.' },
    { q: 'What does Banker’s algorithm do?', a: 'Deadlock avoidance: grants a request only if the system remains in a safe state (a safe sequence exists). Need = Max − Allocation.' },
    { q: 'Deadlock vs starvation?', a: 'Deadlock: processes wait on each other forever (circular). Starvation: a process waits indefinitely because others keep getting priority.' },
    { q: 'Internal vs external fragmentation?', a: 'Internal: unused space inside allocated blocks (fixed partitions/paging). External: total free memory is enough but not contiguous (segmentation/variable partitions).' },
    { q: 'Paging vs segmentation?', a: 'Paging: fixed-size, invisible to programmer, internal fragmentation. Segmentation: variable-size logical units, external fragmentation.' },
    { q: 'What is a TLB?', a: 'Translation Lookaside Buffer — a small fast cache of recent page-table entries to speed up address translation.' },
    { q: 'What is Belady’s anomaly?', a: 'With FIFO, increasing the number of frames can increase page faults. LRU/OPT don’t suffer from it.' },
    { q: 'What is thrashing?', a: 'Excessive paging because processes lack frames for their working set; CPU utilisation collapses.' },
    { q: 'What is virtual memory?', a: 'Technique that lets processes use more memory than physically available by keeping parts on disk and loading pages on demand.' },
    { q: 'What is copy-on-write?', a: 'After fork(), parent and child share pages read-only; a page is copied only when one of them writes to it.' },
    { q: 'Monolithic kernel vs microkernel?', a: 'Monolithic: all OS services in kernel space — fast (Linux). Microkernel: minimal kernel, services in user space — modular, more reliable, IPC overhead.' },
    { q: 'What is a system call?', a: 'The programmatic interface through which a user program requests a kernel service (e.g. read, write, fork), switching from user to kernel mode.' },
    { q: 'SCAN vs C-SCAN?', a: 'SCAN moves the head to one end then reverses (elevator). C-SCAN services only in one direction and jumps back to start — more uniform waiting.' },
    { q: 'Spinlock — when is it useful?', a: 'On multiprocessors when the expected wait is shorter than a context switch.' },
    { q: 'Hard link vs soft link?', a: 'Hard link: another directory entry pointing to the same inode. Soft link: a separate file storing the path; breaks if the target is deleted.' }
  ],
  quiz: [
    { q: 'How many times is "hi" printed?\n\n~~~c\nfork(); fork(); printf("hi");\n~~~', options: ['2', '3', '4', '8'], answer: 2, explain: 'Two forks ⇒ 4 processes, each prints once.', topic: 'intro' },
    { q: 'Which is NOT shared between threads of the same process?', options: ['Heap', 'Code', 'Stack', 'Open files'], answer: 2, explain: 'Each thread has its own stack and registers.', topic: 'process-thread' },
    { q: 'A process that has terminated but whose parent has not called wait() is:', options: ['Orphan', 'Zombie', 'Daemon', 'Blocked'], answer: 1, explain: 'Zombie.', topic: 'process-thread' },
    { q: 'Which scheduling algorithm can cause the convoy effect?', options: ['Round Robin', 'FCFS', 'SRTF', 'MLFQ'], answer: 1, explain: 'Short jobs wait behind a long job in FCFS.', topic: 'scheduling' },
    { q: 'Round robin with a very large time quantum behaves like:', options: ['SJF', 'FCFS', 'Priority', 'LRU'], answer: 1, explain: 'Each process runs to completion in its slice.', topic: 'scheduling' },
    { q: 'Starvation in priority scheduling is solved by:', options: ['Paging', 'Aging', 'Thrashing', 'Swapping'], answer: 1, explain: 'Aging raises priority of long-waiting processes.', topic: 'scheduling' },
    { q: 'Which synchronization primitive has the concept of ownership?', options: ['Counting semaphore', 'Mutex', 'Binary semaphore', 'Condition variable'], answer: 1, explain: 'Only the thread that locked a mutex can unlock it.', topic: 'synchronization' },
    { q: 'Imposing a global ordering on resource acquisition prevents which deadlock condition?', options: ['Mutual exclusion', 'Hold and wait', 'No preemption', 'Circular wait'], answer: 3, explain: 'Ordered requests cannot form a cycle.', topic: 'deadlock' },
    { q: "Banker's algorithm is used for deadlock:", options: ['Prevention', 'Avoidance', 'Detection', 'Recovery'], answer: 1, explain: 'It avoids unsafe states.', topic: 'deadlock' },
    { q: 'Paging eliminates:', options: ['Internal fragmentation', 'External fragmentation', 'Page faults', 'Thrashing'], answer: 1, explain: 'Any free frame can hold any page.', topic: 'memory' },
    { q: 'Page size 4 KB. How many bits are used for the offset?', options: ['10', '12', '14', '16'], answer: 1, explain: '4 KB = 2¹² bytes.', topic: 'memory' },
    { q: "Which page replacement algorithm suffers from Belady's anomaly?", options: ['LRU', 'Optimal', 'FIFO', 'LFU'], answer: 2, explain: 'FIFO is not a stack algorithm.', topic: 'virtual-memory' },
    { q: 'High paging activity with low CPU utilisation indicates:', options: ['Deadlock', 'Thrashing', 'Starvation', 'Race condition'], answer: 1, explain: 'Thrashing.', topic: 'virtual-memory' },
    { q: 'Which disk scheduling algorithm may cause starvation?', options: ['FCFS', 'SSTF', 'C-SCAN', 'C-LOOK'], answer: 1, explain: 'Far requests can wait indefinitely if near requests keep arriving.', topic: 'files-disk' },
    { q: 'Linux kernel architecture is primarily:', options: ['Microkernel', 'Monolithic (modular)', 'Exokernel', 'Hybrid'], answer: 1, explain: 'Monolithic with loadable modules.', topic: 'intro' }
  ]
});
