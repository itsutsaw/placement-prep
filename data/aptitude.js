window.SUBJECTS = window.SUBJECTS || [];
window.SUBJECTS.push({
  id: 'apti', title: 'Aptitude & Reasoning', short: 'Aptitude', icon: '🔢', color: '#14b8a6', group: 'prep',
  desc: 'Quantitative aptitude formulas & shortcuts, logical reasoning, verbal ability and puzzles for online assessments.',
  intro: `
    > 💡 The aptitude section of OAs (TCS, Infosys, Accenture, Wipro, Capgemini, Deloitte and many product companies) is about **speed**. Memorise formulas, practise timed sets, and skip questions that take more than 90 seconds.
  `,
  topics: [
    {
      id: 'numbers', title: 'Number System, HCF/LCM & Divisibility',
      content: `
        ## Divisibility rules
        | By | Rule |
        |---|---|
        | 2 | last digit even |
        | 3 / 9 | sum of digits divisible by 3 / 9 |
        | 4 | last two digits divisible by 4 |
        | 8 | last three digits divisible by 8 |
        | 5 | ends in 0 or 5 |
        | 6 | divisible by 2 and 3 |
        | 11 | (sum of odd-position digits − sum of even-position digits) divisible by 11 |
        | 7 | double the last digit, subtract from the rest; repeat |

        ## HCF & LCM
        - **HCF × LCM = product of two numbers** (only for two numbers).
        - HCF of fractions = HCF(numerators)/LCM(denominators); LCM of fractions = LCM(numerators)/HCF(denominators).
        - Greatest number dividing a, b, c leaving the **same remainder** = HCF(|a−b|, |b−c|, |a−c|).
        - Smallest number which when divided by x, y, z leaves remainder r = LCM(x, y, z) + r.
        - Euclid: HCF(a, b) = HCF(b, a mod b).

        ## Useful facts
        - Number of factors of N = p^a · q^b · r^c is **(a+1)(b+1)(c+1)**. Sum of factors = Π (p^(a+1) − 1)/(p − 1).
        - Number of trailing zeros in n! = ⌊n/5⌋ + ⌊n/25⌋ + ⌊n/125⌋ + … (e.g. 100! → 20 + 4 = **24**).
        - Sum of first n natural numbers = n(n+1)/2; squares = n(n+1)(2n+1)/6; cubes = [n(n+1)/2]².
        - Unit digit cycles: 2 → 2,4,8,6; 3 → 3,9,7,1; 7 → 7,9,3,1; 8 → 8,4,2,6 (cycle 4); 4 and 9 cycle of 2; 0,1,5,6 always themselves.
          Example: unit digit of 7⁹⁵ → 95 mod 4 = 3 → **3**.
        - Remainder theorem tricks: (a·b) mod n = ((a mod n)(b mod n)) mod n. **Fermat**: a^(p−1) ≡ 1 (mod p) for prime p not dividing a.
        - Primes up to 100: 25 of them. 1 is neither prime nor composite; 2 is the only even prime.

        ## Simplification
        **BODMAS** / VBODMAS, approximations, squares up to 30 and cubes up to 15 — memorise them.
      `,
      keyPoints: [
        'Divisible by 3/9: digit sum; by 11: alternating digit-sum difference.',
        'HCF × LCM = product (for two numbers).',
        'Factors of p^a·q^b = (a+1)(b+1).',
        'Trailing zeros in n! = Σ ⌊n/5^k⌋ (100! has 24).',
        'Unit digits repeat in cycles of 4 — use exponent mod 4.',
        'Same remainder ⇒ HCF of pairwise differences.',
        'Sum 1..n = n(n+1)/2; squares n(n+1)(2n+1)/6.'
      ]
    },
    {
      id: 'percent-profit', title: 'Percentages, Profit & Loss, Interest',
      content: `
        ## Percentages
        - x% of y = y% of x.
        - Successive changes a% and b%: **net = a + b + ab/100**. (+20% then −20% = −4%.)
        - If price rises by r%, consumption must fall by **r/(100+r) × 100%** to keep expenditure same. (25% rise → 20% cut.)
        - Population growth: P(1 + r/100)ⁿ.
        - Fraction ↔ % table: 1/2 = 50, 1/3 = 33.33, 1/4 = 25, 1/5 = 20, 1/6 = 16.67, 1/7 ≈ 14.28, 1/8 = 12.5, 1/9 = 11.11, 1/11 ≈ 9.09, 1/12 = 8.33.

        ## Profit & loss
        - Profit = SP − CP; Profit % = Profit/CP × 100 (always on **CP** unless stated).
        - SP = CP × (100 + P%)/100.
        - **Marked price** & discount: SP = MP × (100 − D%)/100. Discount is on MP.
        - Successive discounts d₁, d₂ → single discount = d₁ + d₂ − d₁d₂/100.
        - Selling two items at the same SP, one at x% profit and one at x% loss → always a **loss of x²/100 %**.
        - Dishonest dealer using a false weight: gain % = (error / (true value − error)) × 100.

        ## Simple & compound interest
        - **SI** = P·R·T/100.
        - **CI**: Amount = P(1 + R/100)ᵀ; CI = A − P.
        - Half-yearly: rate R/2, time 2T. Quarterly: R/4, 4T.
        - **CI − SI for 2 years = P(R/100)²**; for 3 years = P(R/100)²(3 + R/100).
        - Money doubles in ~**72/R** years at compound rate R (rule of 72).
      `,
      keyPoints: [
        'Successive % change: a + b + ab/100.',
        'Price up r% ⇒ cut consumption by r/(100+r)×100%.',
        'Profit % on CP; discount % on marked price.',
        'Same SP, x% profit and x% loss ⇒ net loss x²/100 %.',
        'Successive discounts: d₁ + d₂ − d₁d₂/100.',
        'SI = PRT/100; A = P(1+R/100)ᵀ.',
        'CI − SI (2 yrs) = P(R/100)².',
        'Rule of 72: doubling time ≈ 72/R.'
      ]
    },
    {
      id: 'ratio-avg-mix', title: 'Ratio, Averages, Ages & Mixtures',
      content: `
        ## Ratio & proportion
        - a:b = c:d ⇒ ad = bc. Mean proportional of a and b = √(ab). Third proportional of a, b = b²/a.
        - Dividing amount A in ratio a:b → A·a/(a+b) and A·b/(a+b).
        - Combine ratios: a:b = 2:3, b:c = 4:5 → make b common (12) → a:b:c = 8:12:15.
        - **Partnership**: profit ∝ capital × time.

        ## Averages
        - Average = sum/count. Adding a new value changes average: new value = old avg + (change × new count).
        - Average of consecutive numbers = (first + last)/2.
        - **Average speed** for equal distances at speeds x and y = **2xy/(x+y)** (not (x+y)/2!).

        ## Ages
        Translate statements to equations with present ages; "n years ago/hence" shifts every age equally; ratio-of-ages problems: use multipliers (3x, 4x).

        ## Mixtures & alligation
        **Alligation rule**: (cheaper : dearer) quantity = (d − m) : (m − c), where m = mean price.
        Example: rice at ₹20 and ₹30 mixed to get ₹26 → ratio (30−26):(26−20) = **2:3**.
        **Repeated replacement**: from x litres of liquid, y litres removed and replaced n times → remaining pure liquid = x(1 − y/x)ⁿ.
      `,
      keyPoints: [
        'Mean proportional = √(ab); third proportional = b²/a.',
        'Partnership profit ∝ capital × time.',
        'Average speed over equal distances = 2xy/(x+y).',
        'Alligation: cheaper : dearer = (d − m) : (m − c).',
        'Repeated replacement: remaining = x(1 − y/x)ⁿ.'
      ]
    },
    {
      id: 'time-work-speed', title: 'Time & Work, Pipes, Time-Speed-Distance',
      content: `
        ## Time & work
        - If A does work in a days → A's 1-day work = 1/a.
        - A and B together: **ab/(a+b)** days.
        - **LCM method**: total work = LCM of days; efficiency = work/days. Faster for 3+ people.
          Example: A = 10 days, B = 15 days → total 30 units, A = 3/day, B = 2/day → together 30/5 = **6 days**.
        - **Man-days**: M₁D₁H₁/W₁ = M₂D₂H₂/W₂.
        - Efficiency ratio is inverse of time ratio.

        ## Pipes & cisterns
        Same as work, but outlet pipes have **negative** work. Filling a in hours, emptying b in hours → net ab/(b−a).

        ## Time, speed & distance
        - Distance = speed × time. **km/h → m/s multiply by 5/18**; m/s → km/h × 18/5.
        - Relative speed: same direction **a − b**, opposite **a + b**.
        - **Trains**: crossing a pole/person → distance = train length; crossing a platform/bridge → train + platform length; two trains → sum of lengths with relative speed.
        - **Boats & streams**: downstream = u + v, upstream = u − v; boat speed u = (D + U)/2, stream v = (D − U)/2.
        - **Circular track**: first meeting time = track length / relative speed; meeting at start = LCM of individual lap times.
        - If speed ratio is a:b, time ratio is b:a (same distance).
      `,
      keyPoints: [
        'Together: ab/(a+b) days; use LCM method for 3+ workers.',
        'M₁D₁H₁/W₁ = M₂D₂H₂/W₂.',
        'Leaking pipes contribute negative work.',
        'km/h × 5/18 = m/s.',
        'Relative speed: same direction subtract, opposite add.',
        'Train crossing platform: distance = train + platform length.',
        'Boat speed = (down + up)/2; stream = (down − up)/2.'
      ]
    },
    {
      id: 'pnc-prob', title: 'Permutations, Combinations & Probability',
      content: `
        ## Counting principles
        - **Addition** (OR) and **multiplication** (AND) rules.
        - **nPr = n!/(n−r)!** — arrangements (order matters).
        - **nCr = n!/(r!(n−r)!)** — selections (order doesn't matter). nCr = nC(n−r).
        - Arrangements with repeated letters: n!/(p!q!…). "BANANA" → 6!/(3!2!) = **60**.
        - **Circular arrangements**: (n−1)!; necklace/garland (flip allowed): (n−1)!/2.
        - Items always together → treat as one block, multiply by internal arrangements. Never together = total − together.
        - Distributing n identical items to r people: C(n+r−1, r−1) (stars and bars); each gets ≥ 1: C(n−1, r−1).
        - Number of diagonals in an n-gon: n(n−3)/2. Handshakes among n people: nC2.

        ## Probability
        - P(E) = favourable / total, 0 ≤ P ≤ 1. P(not E) = 1 − P(E).
        - P(A ∪ B) = P(A) + P(B) − P(A ∩ B).
        - Independent: P(A ∩ B) = P(A)P(B). Conditional: P(A|B) = P(A ∩ B)/P(B).
        - **"At least one"** = 1 − P(none).
        - Two dice: 36 outcomes; sum 7 is most likely (6/36). Cards: 52 cards, 4 suits, 13 each, 12 face cards, 4 aces.
        - Expected value E[X] = Σ x·p(x).

        > 🎯 Example: probability of at least one head in 3 coin tosses = 1 − (1/2)³ = **7/8**.
      `,
      keyPoints: [
        'Order matters ⇒ permutation nPr; order doesn’t ⇒ combination nCr.',
        'Repeated letters: n!/(p!q!…). BANANA = 60.',
        'Circular: (n−1)!; necklace: (n−1)!/2.',
        'Identical items to r people: C(n+r−1, r−1).',
        'P(at least one) = 1 − P(none).',
        'P(A∪B) = P(A) + P(B) − P(A∩B).',
        'Diagonals of n-gon = n(n−3)/2.'
      ]
    },
    {
      id: 'reasoning', title: 'Logical Reasoning',
      content: `
        ## Number & letter series
        Check differences (and differences of differences), ratios, squares/cubes ±1, primes, alternating series, Fibonacci-like. Letters: convert to positions (A=1 … Z=26; **EJOTY** = 5, 10, 15, 20, 25 helps).

        ## Coding–decoding
        Look for shifts (+1, −1, reverse alphabet: A↔Z, B↔Y — position pairs sum to 27), letter rearrangements or positional numbering.

        ## Blood relations
        Draw a family tree: ♂/♀ symbols, = for married, vertical lines for generations. Watch for "only son of my grandfather" = father.

        ## Direction sense
        Track turns on N/E/S/W axes; right turn = clockwise. Final distance with Pythagoras. At sunrise, shadows fall to the **west**; at sunset, to the **east**.

        ## Seating arrangement
        Linear (facing north/south) and circular (facing centre/outside). Start with the most definite clue; fix one person; mark possible cases and eliminate.

        ## Syllogisms
        Use **Venn diagrams**. "All A are B" + "All B are C" ⇒ "All A are C". "Some A are B" does **not** imply "Some B are not A". Check for "either–or" pairs (Some + No combination).

        ## Clocks & calendars
        - Angle between hands = |30H − 5.5M| degrees. Hands coincide every 65 5/11 minutes (11 times in 12 h, 22 in a day); they are at right angles 22 times in 12 h (44 in a day).
        - **Odd days**: ordinary year = 1 odd day, leap year = 2. 100 years = 5 odd days, 200 = 3, 300 = 1, 400 = 0.
        - Leap year: divisible by 4, but century years must be divisible by 400 (1900 not leap, 2000 leap).

        ## Data interpretation & sufficiency
        Tables, bar/pie/line charts — approximate smartly, compute percentages and ratios fast. Data sufficiency: check each statement alone, then together.

        ## Puzzles commonly asked in interviews
        - **Burning ropes**: two ropes each burn in 60 min unevenly → measure 45 min (light rope 1 at both ends + rope 2 at one end; when rope 1 finishes (30 min), light the other end of rope 2 → 15 more min).
        - **8 balls, one heavier, 2 weighings**: split 3-3-2.
        - **25 horses, 5 tracks, find top 3**: **7 races**.
        - **Water jugs** (3 L & 5 L → 4 L), **100 doors** (open doors are perfect squares: 10), **2 eggs 100 floors**: **14 drops**, river crossing, bridge & torch (1,2,5,10 → **17 minutes**).
      `,
      keyPoints: [
        'Series: check differences, ratios, squares/cubes, primes, alternating patterns.',
        'Reverse alphabet pairs sum to 27 (A↔Z).',
        'Draw family trees for blood relations.',
        'Clock angle = |30H − 5.5M|°.',
        'Odd days: normal year 1, leap year 2; 400 years = 0.',
        'Century year is leap only if divisible by 400.',
        'Syllogisms: draw Venn diagrams; check all possible cases.',
        'Classic puzzles: 25 horses → 7 races; 2 eggs/100 floors → 14; bridge & torch → 17 min.'
      ]
    },
    {
      id: 'verbal', title: 'Verbal Ability',
      content: `
        ## Reading comprehension
        Read the questions first, skim for structure, identify main idea/tone. Answer only from the passage — avoid outside knowledge and extreme options ("always", "never").

        ## Sentence correction — common errors
        - **Subject–verb agreement**: "Each of the students *has*…", "Neither the teacher nor the students *are*…" (verb agrees with the nearer subject).
        - **Tense consistency**, "since/for" ("since 2019", "for three years").
        - Pronoun–antecedent agreement; "who" (subject) vs "whom" (object).
        - Articles: "an hour", "a university", "the" for unique things.
        - Prepositions: "different **from**", "comply **with**", "superior **to**".
        - Parallel structure: "She likes reading, writing and *swimming*".
        - Misplaced modifiers; redundancy ("return back", "revert back").
        - "Fewer" (countable) vs "less" (uncountable); "between" (two) vs "among" (more).

        ## Vocabulary
        Synonyms/antonyms, one-word substitutions, idioms (e.g. *bite the bullet*, *hit the nail on the head*). Learn roots: *bene* (good), *mal* (bad), *chron* (time), *-cide* (kill), *omni* (all).

        ## Para-jumbles
        Find the opening sentence (introduces the topic, no pronoun referring back), link pronouns & connectors (however, therefore), find mandatory pairs, then the conclusion.

        ## Email / essay writing (some OAs)
        Clear subject, greeting, purpose in the first line, short paragraphs, polite close; cover all given points; check grammar.
      `,
      keyPoints: [
        'Neither…nor / either…or: verb agrees with the nearer subject.',
        '"Each/every/one of" takes a singular verb.',
        'Fewer (countable) vs less (uncountable); between (two) vs among (many).',
        'Para-jumbles: find opener (no back-reference) and mandatory pairs.',
        'RC: answer only from the passage; avoid extreme options.'
      ]
    }
  ],
  flashcards: [
    { q: 'Successive percentage changes a% and b% — net change?', a: 'a + b + ab/100 (use negative values for decreases).' },
    { q: 'Price increases 25%. By how much must consumption decrease to keep expenditure the same?', a: '25/125 × 100 = 20%.' },
    { q: 'Selling two items at the same price, one at 10% profit and one at 10% loss?', a: 'Net loss of 10²/100 = 1%.' },
    { q: 'CI − SI for 2 years?', a: 'P(R/100)².' },
    { q: 'A does work in a days, B in b days. Together?', a: 'ab/(a+b) days.' },
    { q: 'Average speed for equal distances at x and y km/h?', a: '2xy/(x+y).' },
    { q: 'Convert km/h to m/s?', a: 'Multiply by 5/18.' },
    { q: 'Boat and stream speeds from downstream D and upstream U?', a: 'Boat = (D+U)/2, stream = (D−U)/2.' },
    { q: 'Number of factors of 360?', a: '360 = 2³·3²·5 → (3+1)(2+1)(1+1) = 24.' },
    { q: 'Trailing zeros in 100!?', a: '⌊100/5⌋ + ⌊100/25⌋ = 20 + 4 = 24.' },
    { q: 'Unit digit of 7⁹⁵?', a: 'Cycle of 7: 7,9,3,1. 95 mod 4 = 3 → 3.' },
    { q: 'nPr and nCr formulas?', a: 'nPr = n!/(n−r)!, nCr = n!/(r!(n−r)!).' },
    { q: 'Arrangements of the letters of BANANA?', a: '6!/(3!·2!) = 60.' },
    { q: 'Circular arrangements of n people?', a: '(n−1)!; if clockwise = anticlockwise (necklace): (n−1)!/2.' },
    { q: 'Probability of at least one six in two dice rolls?', a: '1 − (5/6)² = 11/36.' },
    { q: 'Alligation rule?', a: 'Cheaper : dearer = (dearer price − mean) : (mean − cheaper price).' },
    { q: 'Angle between clock hands at 3:40?', a: '|30·3 − 5.5·40| = |90 − 220| = 130°.' },
    { q: 'Odd days in a leap year and in 400 years?', a: 'Leap year: 2. 400 years: 0.' },
    { q: 'Is 1900 a leap year?', a: 'No — century years must be divisible by 400 (2000 was a leap year).' },
    { q: '25 horses, 5 per race, no timer — minimum races for top 3?', a: '7 races.' },
    { q: 'Bridge and torch (1, 2, 5, 10 minutes) — minimum time?', a: '17 minutes: 1+2 cross (2), 1 back (1), 5+10 cross (10), 2 back (2), 1+2 cross (2).' },
    { q: 'Two eggs, 100 floors — minimum drops in the worst case?', a: '14 (drop from 14, 27, 39, … reducing the gap by 1 each time).' }
  ],
  quiz: [
    { q: 'A price is increased by 20% and then decreased by 20%. Net change?', options: ['0%', '−4%', '+4%', '−2%'], answer: 1, explain: '20 − 20 − 400/100 = −4%.', topic: 'percent-profit' },
    { q: 'An article marked ₹1000 is sold at successive discounts of 10% and 20%. Selling price?', options: ['₹700', '₹720', '₹750', '₹680'], answer: 1, explain: '1000 × 0.9 × 0.8 = 720.', topic: 'percent-profit' },
    { q: 'SI on ₹5000 at 8% p.a. for 3 years?', options: ['₹1000', '₹1200', '₹1250', '₹1500'], answer: 1, explain: '5000 × 8 × 3/100 = 1200.', topic: 'percent-profit' },
    { q: 'HCF of two numbers is 12 and their product is 4320. LCM?', options: ['240', '360', '300', '480'], answer: 1, explain: '4320/12 = 360.', topic: 'numbers' },
    { q: 'A can finish a job in 12 days, B in 18 days. Together they take:', options: ['7.2 days', '6 days', '8 days', '15 days'], answer: 0, explain: '12·18/30 = 7.2.', topic: 'time-work-speed' },
    { q: 'A 150 m train at 54 km/h crosses a pole in:', options: ['8 s', '10 s', '12 s', '15 s'], answer: 1, explain: '54 km/h = 15 m/s → 150/15 = 10 s.', topic: 'time-work-speed' },
    { q: 'Going to a place at 40 km/h and returning at 60 km/h, average speed is:', options: ['50 km/h', '48 km/h', '45 km/h', '52 km/h'], answer: 1, explain: '2·40·60/100 = 48.', topic: 'ratio-avg-mix' },
    { q: 'In how many ways can 5 people sit around a round table?', options: ['120', '24', '60', '12'], answer: 1, explain: '(5−1)! = 24.', topic: 'pnc-prob' },
    { q: 'Probability of getting a sum of 7 with two dice:', options: ['1/12', '1/6', '5/36', '7/36'], answer: 1, explain: '6 favourable of 36.', topic: 'pnc-prob' },
    { q: 'Next in the series: 2, 6, 12, 20, 30, ?', options: ['40', '42', '44', '36'], answer: 1, explain: 'n(n+1): 6·7 = 42.', topic: 'reasoning' },
    { q: 'Angle between the clock hands at 3:15?', options: ['0°', '7.5°', '15°', '22.5°'], answer: 1, explain: '|90 − 82.5| = 7.5°.', topic: 'reasoning' },
    { q: 'Choose the correct sentence:', options: ['Neither the manager nor the employees was present.', 'Neither the manager nor the employees were present.', 'Neither the manager or the employees were present.', 'Neither of the manager nor employees were present.'], answer: 1, explain: 'Verb agrees with the nearer subject (employees → were).', topic: 'verbal' }
  ]
});
