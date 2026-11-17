window.SUBJECTS = window.SUBJECTS || [];
window.SUBJECTS.push({
  id: 'hr', title: 'Resume, HR & Interview Strategy', short: 'HR & Strategy', icon: '🤝', color: '#e11d48', group: 'prep',
  desc: 'Placement process, ATS-friendly resume, projects, STAR method, top HR questions with model answers, group discussions and offer tips.',
  topics: [
    {
      id: 'process', title: 'The Placement Process & Strategy',
      content: `
        ## Typical campus hiring pipeline
        1. **Pre-placement talk (PPT)** & registration — eligibility cut-offs (CGPA, backlogs).
        2. **Online assessment (OA)** — aptitude + technical MCQs (OS, DBMS, CN, OOP, output-prediction) + **2–3 coding questions** (60–120 min, HackerRank/HackerEarth/CodeSignal/Mettl).
        3. **Group discussion** (some service companies).
        4. **Technical interviews (1–3 rounds)** — DSA problem-solving, CS fundamentals, projects, (system design/LLD for higher packages, ML depth for AI roles).
        5. **Managerial / HR round** — behaviour, culture fit, location, relocation, salary expectations.

        ## What different roles emphasise
        | Role | Focus |
        |---|---|
        | SDE (product companies) | DSA (medium–hard), CS core, projects, sometimes LLD |
        | SDE (service companies) | aptitude, basic coding, OOP, DBMS/SQL, communication |
        | ML / AI engineer | DSA (medium), ML theory + math, DL/LLMs, ML projects, Python, sometimes ML system design |
        | Data scientist / analyst | statistics, SQL (window functions!), ML, case studies, Python/pandas |

        ## A realistic preparation strategy
        - **Coding:** 1 language deeply (C++/Java/Python). 150–250 quality problems by pattern > 600 random ones. Do timed contests (LeetCode weekly, Codeforces/CodeChef) for OA speed.
        - **Core CS:** OS, DBMS, CN, OOP — revise via cheat sheets & flashcards here; SQL practice daily for a week.
        - **Projects:** 2–3 strong ones you can defend deeply (one full-stack/backend, one ML/GenAI for AI roles), deployed with a GitHub README.
        - **Mock interviews:** with friends/peers; speak your thought process aloud.
        - **Revision loop:** weekly cheat-sheet pass, daily flashcards (spaced repetition), re-solve failed problems.

        ## OA tips
        - Read all coding questions first; solve the easiest first.
        - Pass partial test cases with brute force if stuck, then optimise.
        - Watch constraints, integer overflow (use \`long long\`), edge cases (empty, single element, duplicates, negatives).
        - Prefer fast I/O in C++ (\`ios::sync_with_stdio(false); cin.tie(nullptr);\`).
        - MCQs: don't spend > 1 min per question; check negative marking.

        ## In the technical interview
        - **Clarify** the problem and constraints → give a **brute force** → optimise → **code** cleanly → **dry run** → **complexity**.
        - Think aloud. If stuck, say what you're trying; take hints gracefully.
        - "I don't know, but here's how I'd reason about it" is better than bluffing.
      `,
      keyPoints: [
        'Pipeline: OA (aptitude + MCQ + coding) → technical rounds → HR/managerial.',
        'Product SDE: DSA heavy; service: aptitude + basics; AI roles: DSA + ML/DL/LLM depth + projects.',
        'Quality problems by pattern beat volume; do timed contests for OA speed.',
        'OA: solve easiest first, get partial marks with brute force, watch overflow & edge cases.',
        'Interview flow: clarify → brute force → optimise → code → dry run → complexity, thinking aloud.',
        'Never bluff — reason openly.'
      ]
    },
    {
      id: 'resume', title: 'Resume & Projects',
      content: `
        ## Resume rules (1 page for freshers)
        - **ATS-friendly**: simple single-column layout, standard headings, no tables/graphics for key info, PDF.
        - Order: Header (name, phone, email, LinkedIn, GitHub, portfolio) → **Education** → **Skills** → **Experience/Internships** → **Projects** → Achievements (coding ratings, hackathons) → Positions of responsibility.
        - **Bullet formula (XYZ):** *Accomplished X, as measured by Y, by doing Z.*
          - ❌ "Worked on a machine learning model."
          - ✅ "Built a churn-prediction model (XGBoost) reaching **0.89 ROC-AUC**, 12% above the logistic baseline, by engineering 25 behavioural features; served via FastAPI + Docker."
        - Start bullets with **action verbs**: built, designed, optimised, reduced, automated, deployed, led.
        - Quantify: users, latency, accuracy, % improvement, dataset size.
        - Only list skills you can be grilled on. Everything on the resume is fair game in the interview.
        - Tailor keywords to the job description (e.g. "REST APIs", "PyTorch", "SQL").

        ## Strong project ideas
        **SDE:** real-time chat app (WebSockets), URL shortener with analytics, e-commerce backend with payments & caching, collaborative editor, job portal with search, rate-limited API gateway.
        **AI/ML:** RAG chatbot over PDFs with citations, end-to-end ML pipeline with monitoring, fine-tuned small LLM with LoRA, recommendation system, computer-vision detector deployed on the web, AI agent with tool use.

        ## How to present a project (2-minute pitch)
        1. **Problem** — who needs it and why.
        2. **Your role** — what *you* built.
        3. **Architecture** — components & tech stack, and **why** each choice.
        4. **Hardest challenge** — and how you solved it.
        5. **Results** — metrics, users, performance.
        6. **What you'd improve** — scaling, testing, features.

        > 🎯 Prepare answers for: *Why this tech stack? How would it scale to 1M users? What breaks first? How did you test it? What was your exact contribution in the team?*

        ## Online presence
        GitHub with pinned repos and good READMEs (screenshots, demo link, setup), LinkedIn with a clear headline, coding profiles (LeetCode/Codeforces/CodeChef) if ratings are decent.
      `,
      keyPoints: [
        'One page, ATS-friendly, single column, PDF.',
        'Bullet formula: accomplished X, measured by Y, by doing Z — quantify everything.',
        'Start with action verbs; tailor keywords to the job description.',
        'Only list skills you can defend under deep questioning.',
        'Project pitch: problem → your role → architecture & why → challenge → results → improvements.',
        'Good READMEs, demos and pinned repos on GitHub.'
      ]
    },
    {
      id: 'hr-questions', title: 'Top HR Questions & Model Answers',
      content: `
        ## The STAR method (for behavioural questions)
        **S**ituation → **T**ask → **A**ction (what *you* did — most detail here) → **R**esult (quantified + learning). Keep answers 1–2 minutes.

        ## 1. "Tell me about yourself."
        Structure: **present → past → future** (60–90 seconds). Not your life story.
        > *"I'm a final-year Computer Science student at XYZ with a strong interest in backend systems and applied ML. Over the last two years I've solved 400+ DSA problems and built projects like a RAG-based PDF assistant that answers questions with citations, using FastAPI and a vector database. During my internship at ABC, I optimised API response time by 35% by adding Redis caching. I enjoy building products that solve real problems, which is why I'm excited about this role at [Company], especially your work on [specific product]."*

        ## 2. "What are your strengths?"
        Pick 2–3 relevant ones with a proof each: *"I'm a fast learner — I learnt Docker and deployed my project within a week for a hackathon, where we finished in the top 5."*

        ## 3. "What is your weakness?"
        A real but non-critical weakness + what you're doing about it.
        > *"I used to take on too many tasks myself in team projects. I've learnt to delegate and now use a shared task board with clear owners, which helped my last team deliver two days early."*
        Avoid clichés like "I'm a perfectionist" and avoid core skills of the job.

        ## 4. "Why should we hire you?" / "Why this company?"
        Match **their needs** (from the JD and company research) with **your evidence**. Mention their product, tech, culture, values, recent news — be specific.

        ## 5. "Where do you see yourself in 5 years?"
        Growth within the company: *"Becoming a strong engineer who owns significant parts of the system, mentoring juniors, and growing towards technical leadership."*

        ## 6. Behavioural questions — prepare 5–6 STAR stories
        Cover: a **challenge/failure**, a **conflict** in a team, **leadership/initiative**, a **tight deadline**, learning something quickly, going beyond requirements. One story can answer several questions.
        - *"Tell me about a time you failed."* → own it, show what you learnt and changed.
        - *"Conflict with a teammate?"* → listened, focused on the goal/data, found a compromise, relationship stayed good.

        ## 7. Other common questions
        - Are you willing to relocate / work in shifts? (be honest; usually yes)
        - Do you have other offers? (honest, positive)
        - Why did you choose engineering / this branch?
        - What do you do outside academics?
        - Do you have any questions for us? → **Always ask 1–2**: *"What does a typical first 6 months look like for a new graduate?"*, *"What tech stack does the team use?"*, *"How is success measured in this role?"*

        ## Service-company specifics
        Bond/service agreement questions, willingness to learn any technology, night shifts, relocation — answer positively and honestly.
      `,
      keyPoints: [
        'STAR: Situation, Task, Action (most detail), Result (quantified + learning).',
        'Tell me about yourself: present → past → future in 60–90 seconds, tailored to the role.',
        'Weakness: real, non-critical, with concrete improvement steps.',
        'Why us: specific research on product/tech/values + your matching evidence.',
        'Prepare 5–6 STAR stories: failure, conflict, leadership, deadline, quick learning.',
        'Always ask the interviewer 1–2 thoughtful questions.'
      ]
    },
    {
      id: 'gd-etiquette', title: 'Group Discussion, Etiquette & Offers',
      content: `
        ## Group discussion (GD)
        - **Evaluated on**: content, communication, listening, leadership, team behaviour — not on shouting the most.
        - Starting is a plus *only* if you have a strong, structured opening (define the topic, give context, frame 2–3 angles).
        - Use facts/examples, build on others ("Adding to what X said…"), bring quieter members in, summarise at the end if possible.
        - Common topics: AI and jobs, remote work, social media regulation, EVs, cryptocurrency, startups vs MNCs, online education, data privacy.

        ## Interview etiquette
        - **Online**: stable internet, quiet room, good lighting, camera at eye level, test tools (Zoom/Meet, CoderPad/HackerRank) beforehand, keep water, pen & paper.
        - **Offline**: formal/business casual, carry printed resumes, ID, reach 15 minutes early.
        - Be polite, make eye contact, don't interrupt, be honest, show enthusiasm.
        - After the interview: a short thank-you note (optional, nice touch).

        ## Day-before checklist
        1. Re-read your resume and every project's architecture.
        2. Skim cheat sheets for OS, DBMS, CN, OOP (use the ⚡ cheat sheets here).
        3. Revise your 5 STAR stories and "tell me about yourself".
        4. Research the company: products, recent news, values, tech stack.
        5. Sleep well — it matters more than one more problem.

        ## Understanding an offer
        - **CTC ≠ in-hand**: CTC includes base, bonuses (joining, performance), PF (employer contribution), gratuity, insurance, **ESOPs/RSUs** (vesting schedule, e.g. 4 years with 1-year cliff).
        - Check: base salary, location, role/team, bond or service agreement, notice period, probation, joining date.
        - Campus placements usually follow a **one-offer policy** — know your college's rules before applying to "dream" companies.
        - Negotiation is limited on campus but possible off-campus; always be polite and data-driven.
      `,
      keyPoints: [
        'GD: quality and structure over volume; listen, build on others, summarise.',
        'Online interviews: test setup, lighting, internet and coding tools in advance.',
        'Day before: resume & projects, core CS cheat sheets, STAR stories, company research, sleep.',
        'CTC includes bonuses, PF, gratuity, ESOPs/RSUs — compute in-hand separately.',
        'Know vesting schedules, bonds and your college’s one-offer policy.'
      ]
    }
  ],
  flashcards: [
    { q: 'What is the STAR method?', a: 'Situation, Task, Action, Result — a structure for behavioural answers; spend most time on Action and quantify the Result.' },
    { q: 'Structure for "Tell me about yourself"?', a: 'Present (who you are now) → past (key experiences/projects with impact) → future (why this role/company). 60–90 seconds.' },
    { q: 'How to answer "What is your weakness?"', a: 'Name a real, non-critical weakness, show self-awareness and the concrete steps you are taking to improve, with evidence.' },
    { q: 'Resume bullet formula?', a: 'Accomplished X, as measured by Y, by doing Z — start with an action verb and quantify.' },
    { q: 'What makes a resume ATS-friendly?', a: 'Single column, standard headings, simple fonts, keywords from the JD, no images/tables for key info, PDF.' },
    { q: 'How to present a project in 2 minutes?', a: 'Problem → your role → architecture & why → hardest challenge → results/metrics → what you would improve.' },
    { q: 'Steps in a technical interview answer?', a: 'Clarify → brute force with complexity → optimise → code → dry run with edge cases → final complexity.' },
    { q: 'Good questions to ask the interviewer?', a: 'What does success look like in the first 6 months? What does the team work on / tech stack? How do new grads get mentored?' },
    { q: 'CTC vs in-hand salary?', a: 'CTC is the total cost including bonuses, PF, gratuity, insurance and stock; in-hand is monthly base after tax and deductions.' },
    { q: 'What are RSUs and vesting?', a: 'Restricted Stock Units granted as compensation that become yours over time (e.g. 4 years, 1-year cliff).' }
  ],
  quiz: [
    { q: 'In STAR, which part should get the most detail?', options: ['Situation', 'Task', 'Action', 'Result'], answer: 2, explain: 'Interviewers want to know what YOU did.', topic: 'hr-questions' },
    { q: 'Best resume bullet?', options: ['Worked on a website', 'Responsible for backend', 'Reduced API latency 40% by adding Redis caching to a 10k-user app', 'Good knowledge of Node.js'], answer: 2, explain: 'Action verb + quantified impact + how.', topic: 'resume' },
    { q: 'You are stuck on a coding question in an interview. Best move?', options: ['Stay silent and think', 'Explain your current approach and where you are stuck', 'Say you cannot do it', 'Change the topic'], answer: 1, explain: 'Thinking aloud lets the interviewer give hints and evaluate reasoning.', topic: 'process' },
    { q: 'At the end of an interview you are asked "Any questions?". You should:', options: ['Say no', 'Ask about salary only', 'Ask 1–2 thoughtful questions about the role/team', 'Ask about holidays'], answer: 2, explain: 'Shows interest and preparation.', topic: 'hr-questions' },
    { q: 'In a GD, the best way to stand out is:', options: ['Speak the most', 'Interrupt strong speakers', 'Give structured, fact-based points and build on others', 'Stay silent'], answer: 2, explain: 'Quality, listening and leadership are evaluated.', topic: 'gd-etiquette' }
  ]
});

/* ---------------- 30-day study plan (links: "subject/topic" or "#/route") ---------------- */
window.STUDY_PLAN_INTRO = `
  A **30-day plan** that covers everything once and revises it. Do ~2–3 DSA problems every day alongside the listed topic (use the **must-do list** in DSA → Patterns). Tick a day when done.
  If you have more time, stretch each day into two; if you have less, prioritise **DSA + DBMS/SQL + OOP + OS + your projects** (SDE) or **DSA + ML + DL/GenAI + projects** (AI roles).
`;
window.STUDY_PLAN = [
  { day: 1, title: 'Kick-off: process, complexity analysis', links: ['hr/process', 'dsa/complexity'], task: 'Set up a LeetCode/GFG account; solve 3 easy array problems.' },
  { day: 2, title: 'Arrays, strings, two pointers, sliding window', links: ['dsa/arrays'], task: 'Two Sum II, 3Sum, Longest Substring Without Repeating Characters.' },
  { day: 3, title: 'Hashing + binary search & sorting', links: ['dsa/hashing', 'dsa/searching-sorting'], task: 'Group Anagrams, Search in Rotated Array, Koko Eating Bananas.' },
  { day: 4, title: 'Linked lists, stacks & queues', links: ['dsa/linked-list', 'dsa/stack-queue'], task: 'Reverse List, LRU Cache, Daily Temperatures.' },
  { day: 5, title: 'Recursion & backtracking', links: ['dsa/recursion-backtracking'], task: 'Subsets, Permutations, N-Queens.' },
  { day: 6, title: 'Trees & BST', links: ['dsa/trees'], task: 'Level Order, Diameter, LCA, Validate BST.' },
  { day: 7, title: 'Heaps + weekly revision', links: ['dsa/heaps', '#/cheat/dsa', '#/quiz/dsa'], task: 'Kth Largest, Top K Frequent; take the DSA quiz.' },
  { day: 8, title: 'Graphs I: BFS, DFS, topo sort', links: ['dsa/graphs'], task: 'Number of Islands, Rotting Oranges, Course Schedule.' },
  { day: 9, title: 'Graphs II: shortest paths, MST, DSU + greedy', links: ['dsa/graphs', 'dsa/greedy'], task: 'Network Delay Time, Redundant Connection, Jump Game.' },
  { day: 10, title: 'Dynamic programming I', links: ['dsa/dp'], task: 'Climbing Stairs, House Robber, Coin Change, 0/1 Knapsack.' },
  { day: 11, title: 'Dynamic programming II', links: ['dsa/dp'], task: 'LCS, Edit Distance, LIS, Partition Equal Subset Sum.' },
  { day: 12, title: 'Tries, bits + patterns', links: ['dsa/tries-bits', 'dsa/patterns'], task: 'Implement Trie, Single Number; do one timed contest.' },
  { day: 13, title: 'OOP I: basics, pillars, interfaces', links: ['oop/basics', 'oop/pillars', 'oop/abstract-interface'] },
  { day: 14, title: 'OOP II: SOLID, design patterns, language specifics', links: ['oop/solid', 'oop/design-patterns', 'oop/language-specifics'], task: 'Design a parking lot (LLD) on paper.' },
  { day: 15, title: 'DBMS I: basics, ER, keys, normalization', links: ['dbms/intro', 'dbms/er-keys', 'dbms/normalization'] },
  { day: 16, title: 'DBMS II: SQL deep practice', links: ['dbms/sql'], task: 'Solve 10 SQL problems (joins, GROUP BY, window functions).' },
  { day: 17, title: 'DBMS III: transactions, indexing, NoSQL', links: ['dbms/transactions', 'dbms/indexing', 'dbms/nosql'] },
  { day: 18, title: 'OS I: processes, threads, scheduling', links: ['os/intro', 'os/process-thread', 'os/scheduling'], task: 'Solve 3 scheduling Gantt-chart problems.' },
  { day: 19, title: 'OS II: synchronization & deadlocks', links: ['os/synchronization', 'os/deadlock'] },
  { day: 20, title: 'OS III: memory, virtual memory, files', links: ['os/memory', 'os/virtual-memory', 'os/files-disk'] },
  { day: 21, title: 'CN I: models, IP & subnetting, TCP/UDP', links: ['cn/models', 'cn/ip-subnet', 'cn/transport'] },
  { day: 22, title: 'CN II: routing, application layer, URL journey', links: ['cn/network-datalink', 'cn/application', 'cn/url-journey'] },
  { day: 23, title: 'System design basics', links: ['sd/fundamentals', 'sd/building-blocks', 'sd/data-messaging'] },
  { day: 24, title: 'APIs & classic designs', links: ['sd/api-design', 'sd/case-studies'], task: 'Design a URL shortener end-to-end out loud.' },
  { day: 25, title: 'ML I: foundations, math & stats, data prep', links: ['ml/foundations', 'ml/math-stats', 'ml/data-prep'] },
  { day: 26, title: 'ML II: regression, classification, trees, clustering, evaluation', links: ['ml/regression', 'ml/classification', 'ml/trees-ensembles', 'ml/unsupervised', 'ml/evaluation'] },
  { day: 27, title: 'Deep learning & GenAI', links: ['dl/nn-basics', 'dl/cnn', 'dl/transformers', 'dl/llms', 'dl/rag-agents'] },
  { day: 28, title: 'Aptitude & reasoning sprint', links: ['apti/percent-profit', 'apti/time-work-speed', 'apti/pnc-prob', 'apti/reasoning'], task: 'Take one full timed aptitude mock (60 min).' },
  { day: 29, title: 'Resume, projects & HR answers', links: ['hr/resume', 'hr/hr-questions', 'hr/gd-etiquette'], task: 'Write your "tell me about yourself" and 5 STAR stories.' },
  { day: 30, title: 'Grand revision + mock interview', links: ['#/cheat/all', '#/quiz/all', '#/cards/due'], task: 'Do a full mock interview with a friend: 1 DSA + core CS + HR.' }
];
