window.SUBJECTS = window.SUBJECTS || [];
window.SUBJECTS.push({
  id: 'dsa', title: 'Data Structures & Algorithms', short: 'DSA', icon: '🧮', color: '#4f46e5', group: 'core',
  desc: 'The #1 filter in coding rounds. Complexity, patterns, every core data structure, DP, graphs and a must-do problem list.',
  intro: `
    > 🎯 **Interview reality:** Online assessments (OA) and technical rounds at product companies are 60–80% DSA. Aim to recognise the *pattern* within 2–3 minutes, state brute force → optimise, then code cleanly.

    💻 **Every code example is in both Python and C++.** Switch with the **Python / C++** toggle in the top bar or the tabs on any code block, and your choice is remembered.

    **Suggested order:** Complexity → Arrays & Strings → Hashing → Binary Search & Sorting → Linked List → Stack & Queue → Recursion & Backtracking → Trees → Heaps → Graphs → Greedy → DP → Tries & Bits → Patterns.
  `,
  topics: [
    {
      id: 'complexity', title: 'Time & Space Complexity',
      content: `
        ## Why it matters
        Every interviewer asks "What is the complexity?" after you code. Constraints in the problem statement tell you the target complexity *before* you start.

        ## Asymptotic notations
        | Notation | Meaning | Intuition |
        |---|---|---|
        | **O(f(n))** | Upper bound | grows *at most* like f(n) — worst case |
        | **Ω(f(n))** | Lower bound | grows *at least* like f(n) — best case |
        | **Θ(f(n))** | Tight bound | grows *exactly* like f(n) |

        Drop constants and lower-order terms: \`3n² + 5n + 7 = O(n²)\`.

        ## Common complexities (fastest → slowest)
        \`O(1) < O(log n) < O(√n) < O(n) < O(n log n) < O(n²) < O(n³) < O(2ⁿ) < O(n!)\`

        ## Constraint → target complexity (≈10⁸ simple ops per second)
        | n up to | Acceptable complexity | Typical technique |
        |---|---|---|
        | 10–12 | O(n!) | permutations, brute force |
        | 20–25 | O(2ⁿ) | subsets, bitmask DP |
        | 100–500 | O(n³) | Floyd–Warshall, interval DP |
        | 10³–5·10³ | O(n²) | 2D DP, nested loops |
        | 10⁵–10⁶ | O(n log n) | sorting, heaps, binary search |
        | 10⁷–10⁸ | O(n) | two pointers, hashing, prefix sums |
        | > 10⁹ | O(log n) / O(1) | binary search on answer, math |

        ## Analysing code
        - Sequential blocks → **add**; nested loops → **multiply**.
        - Loop where \`i\` doubles/halves (\`i *= 2\`) → **O(log n)**.
        - \`for i in range(n): for j in range(i, n)\` → n(n+1)/2 = **O(n²)**.
        - Harmonic loop: \`for i in 1..n: for j in range(i, n, i)\` → n(1 + 1/2 + … + 1/n) = **O(n log n)**.

        ## Recursion — Master Theorem
        For \`T(n) = a·T(n/b) + O(n^d)\`:
        - if d > log_b(a) → **O(n^d)**
        - if d = log_b(a) → **O(n^d log n)**
        - if d < log_b(a) → **O(n^(log_b a))**

        | Recurrence | Example | Result |
        |---|---|---|
        | T(n) = T(n/2) + O(1) | Binary search | O(log n) |
        | T(n) = 2T(n/2) + O(n) | Merge sort | O(n log n) |
        | T(n) = 2T(n/2) + O(1) | Tree traversal | O(n) |
        | T(n) = T(n−1) + O(1) | Linear recursion | O(n) |
        | T(n) = 2T(n−1) + O(1) | Naive Fibonacci / subsets | O(2ⁿ) |

        ## Space complexity
        Count **auxiliary** memory: extra arrays, hash maps, and the **recursion stack** (depth × frame size). A recursive DFS on a skewed tree uses O(n) stack.

        ## Amortised analysis
        Dynamic array (\`vector\`, Python \`list\`) append is O(1) **amortised**: capacity doubles, so n appends cost ≤ 3n copies in total.

        > ⚠️ **Trap:** Python string concatenation in a loop (\`s += c\`) can be O(n²). Use a list and \`''.join()\`. Similarly \`list.pop(0)\` is O(n) — use \`collections.deque\`.
      `,
      keyPoints: [
        'Big-O = upper bound (worst case), Ω = lower bound, Θ = tight bound.',
        '~10⁸ ops/sec: n ≤ 10⁵ ⇒ need O(n log n); n ≤ 20 ⇒ O(2ⁿ) is fine.',
        'Halving/doubling loop ⇒ O(log n); harmonic loop ⇒ O(n log n).',
        'Master theorem: T(n)=aT(n/b)+n^d — compare d with log_b(a).',
        'Recursion stack counts toward space complexity.',
        'Dynamic array append is O(1) amortised (capacity doubling).'
      ]
    },
    {
      id: 'arrays', title: 'Arrays, Strings & Two Pointers',
      content: `
        ## Arrays
        Contiguous memory → **O(1) random access**, O(n) insert/delete in the middle, cache-friendly.

        | Operation | Static array | Dynamic array |
        |---|---|---|
        | Access \`a[i]\` | O(1) | O(1) |
        | Append | — | O(1) amortised |
        | Insert/delete middle | O(n) | O(n) |
        | Search (unsorted) | O(n) | O(n) |

        ## Pattern 1 — Two pointers
        Use when the array is **sorted** or you need pairs/partitions.
        ~~~python
        # Pair with target sum in a sorted array — O(n)
        def two_sum_sorted(a, target):
            l, r = 0, len(a) - 1
            while l < r:
                s = a[l] + a[r]
                if s == target: return (l, r)
                if s < target: l += 1
                else: r -= 1
            return None
        ~~~
        ~~~cpp
        // Pair with target sum in a sorted array — O(n)
        pair<int,int> twoSumSorted(vector<int>& a, int target) {
            int l = 0, r = a.size() - 1;
            while (l < r) {
                int s = a[l] + a[r];
                if (s == target) return {l, r};
                if (s < target) l++;
                else r--;
            }
            return {-1, -1};
        }
        ~~~
        Classic problems: 3Sum, Container With Most Water, Remove Duplicates, Trapping Rain Water, Dutch National Flag (sort 0/1/2).

        ## Pattern 2 — Sliding window
        For **contiguous subarray/substring** problems with a condition (max/min length, at most K distinct…).
        ~~~python
        # Longest substring without repeating characters — O(n)
        def longest_unique(s):
            last, start, best = {}, 0, 0
            for i, ch in enumerate(s):
                if ch in last and last[ch] >= start:
                    start = last[ch] + 1          # shrink window
                last[ch] = i
                best = max(best, i - start + 1)
            return best
        ~~~
        ~~~cpp
        // Longest substring without repeating characters — O(n)
        int longestUnique(const string& s) {
            vector<int> last(256, -1);
            int start = 0, best = 0;
            for (int i = 0; i < (int)s.size(); i++) {
                unsigned char ch = s[i];
                if (last[ch] >= start) start = last[ch] + 1;   // shrink window
                last[ch] = i;
                best = max(best, i - start + 1);
            }
            return best;
        }
        ~~~
        - **Fixed window** (size k): add a[i], remove a[i−k].
        - **Variable window**: expand right; while invalid, shrink left.

        ## Pattern 3 — Prefix sums
        \`pre[i] = a[0] + … + a[i−1]\` ⇒ sum(l..r) = \`pre[r+1] − pre[l]\` in O(1).
        ~~~python
        # Count subarrays with sum == k (works with negatives) — O(n)
        from collections import defaultdict
        def subarray_sum(a, k):
            seen, cur, count = defaultdict(int), 0, 0
            seen[0] = 1
            for x in a:
                cur += x
                count += seen[cur - k]
                seen[cur] += 1
            return count
        ~~~
        ~~~cpp
        // Count subarrays with sum == k (works with negatives) — O(n)
        int subarraySum(vector<int>& a, int k) {
            unordered_map<long long, int> seen;
            seen[0] = 1;
            long long cur = 0; int count = 0;
            for (int x : a) {
                cur += x;
                if (seen.count(cur - k)) count += seen[cur - k];
                seen[cur]++;
            }
            return count;
        }
        ~~~
        Variants: 2D prefix sums, difference array for range updates.

        ## Kadane's algorithm — maximum subarray sum
        ~~~python
        def max_subarray(a):
            best = cur = a[0]
            for x in a[1:]:
                cur = max(x, cur + x)   # extend or restart
                best = max(best, cur)
            return best
        ~~~
        ~~~cpp
        int maxSubarray(vector<int>& a) {
            int best = a[0], cur = a[0];
            for (size_t i = 1; i < a.size(); i++) {
                cur = max(a[i], cur + a[i]);   // extend or restart
                best = max(best, cur);
            }
            return best;
        }
        ~~~

        ## Other must-know array tricks
        - **Moore's voting** — majority element (> n/2) in O(n), O(1) space.
        - **Next permutation** — find first dip from right, swap with next larger, reverse suffix.
        - **Rotate array by k** — reverse whole, reverse first k, reverse rest.
        - **Cyclic sort** — numbers in range 1..n → place each at index x−1; find missing/duplicate.
        - **Merge intervals** — sort by start, merge overlapping.

        ## Strings
        - Immutable in Java/Python → building strings in loops: use \`StringBuilder\` / list + join.
        - Anagram check: frequency count array of 26 → O(n).
        - Palindrome: two pointers, or **expand around center** for longest palindromic substring (O(n²)).
        - Pattern matching: naive O(nm); **KMP** O(n+m) uses LPS (longest proper prefix which is also suffix) array; **Rabin–Karp** uses rolling hash.

        ~~~python
        def build_lps(p):
            lps, j = [0] * len(p), 0
            for i in range(1, len(p)):
                while j and p[i] != p[j]:
                    j = lps[j - 1]
                if p[i] == p[j]:
                    j += 1
                lps[i] = j
            return lps
        ~~~
        ~~~cpp
        vector<int> buildLPS(const string& p) {
            vector<int> lps(p.size(), 0);
            int j = 0;
            for (size_t i = 1; i < p.size(); i++) {
                while (j > 0 && p[i] != p[j]) j = lps[j - 1];
                if (p[i] == p[j]) j++;
                lps[i] = j;
            }
            return lps;
        }
        ~~~

        > 🎯 **Interview tip:** When you see "subarray/substring" think sliding window or prefix sum. When you see "sorted" think two pointers or binary search. When you see "pair/count with property" think hashing.
      `,
      keyPoints: [
        'Sorted array + pairs ⇒ two pointers (O(n)).',
        'Contiguous subarray with a condition ⇒ sliding window: expand right, shrink left while invalid.',
        'Subarray sum = k (with negatives) ⇒ prefix sum + hashmap of counts.',
        "Kadane: cur = max(x, cur + x); best = max(best, cur).",
        "Moore's voting finds the majority element in O(1) space.",
        'Rotate by k: reverse all, reverse first k, reverse the rest.',
        'KMP uses the LPS array for O(n+m) pattern matching.',
        'Avoid s += c in loops; use a list/StringBuilder.'
      ]
    },
    {
      id: 'hashing', title: 'Hashing (HashMap & HashSet)',
      content: `
        ## Idea
        A hash function maps a key to a bucket index → average **O(1)** insert, delete, lookup.

        ## Collision handling
        - **Chaining** — each bucket holds a linked list (Java 8+ converts long chains to red-black trees → O(log n) worst).
        - **Open addressing** — probe for next free slot: linear probing, quadratic probing, double hashing.
        - **Load factor** α = n / buckets. Java's HashMap resizes (doubles) at α = 0.75.

        | | Average | Worst |
        |---|---|---|
        | Insert / Lookup / Delete | O(1) | O(n) (all keys collide) |

        ## Language cheat sheet
        | Need | Python | Java | C++ |
        |---|---|---|---|
        | Hash map | \`dict\` | \`HashMap\` | \`unordered_map\` |
        | Hash set | \`set\` | \`HashSet\` | \`unordered_set\` |
        | Sorted map (O(log n)) | \`sortedcontainers\` | \`TreeMap\` | \`map\` |
        | Counter | \`collections.Counter\` | \`getOrDefault\` | \`mp[x]++\` |

        ## Classic uses
        ~~~python
        # Two Sum (unsorted) — O(n)
        def two_sum(nums, target):
            idx = {}
            for i, x in enumerate(nums):
                if target - x in idx:
                    return [idx[target - x], i]
                idx[x] = i

        # Group anagrams — key = sorted word (or 26-count tuple)
        from collections import defaultdict
        def group_anagrams(words):
            g = defaultdict(list)
            for w in words:
                g[''.join(sorted(w))].append(w)
            return list(g.values())

        # Longest consecutive sequence — O(n)
        def longest_consecutive(nums):
            s, best = set(nums), 0
            for x in s:
                if x - 1 not in s:          # start of a run
                    y = x
                    while y + 1 in s: y += 1
                    best = max(best, y - x + 1)
            return best
        ~~~
        ~~~cpp
        // Two Sum (unsorted) — O(n)
        vector<int> twoSum(vector<int>& nums, int target) {
            unordered_map<int, int> idx;
            for (int i = 0; i < (int)nums.size(); i++) {
                auto it = idx.find(target - nums[i]);
                if (it != idx.end()) return {it->second, i};
                idx[nums[i]] = i;
            }
            return {};
        }

        // Group anagrams — key = sorted word
        vector<vector<string>> groupAnagrams(vector<string>& words) {
            unordered_map<string, vector<string>> g;
            for (auto& w : words) {
                string key = w;
                sort(key.begin(), key.end());
                g[key].push_back(w);
            }
            vector<vector<string>> res;
            for (auto& [k, v] : g) res.push_back(v);
            return res;
        }

        // Longest consecutive sequence — O(n)
        int longestConsecutive(vector<int>& nums) {
            unordered_set<int> s(nums.begin(), nums.end());
            int best = 0;
            for (int x : s) {
                if (!s.count(x - 1)) {            // start of a run
                    int y = x;
                    while (s.count(y + 1)) y++;
                    best = max(best, y - x + 1);
                }
            }
            return best;
        }
        ~~~

        ## hashCode & equals (Java)
        If two objects are \`equals()\`, they **must** have the same \`hashCode()\`. Override both when using custom objects as keys. Mutable keys are dangerous — changing a field after insertion "loses" the entry.

        > ⚠️ **Trap:** \`unordered_map\` in C++ can be hacked with anti-hash tests on Codeforces — use a custom hash or \`map\` if TLE.
      `,
      keyPoints: [
        'HashMap: average O(1), worst O(n) when everything collides.',
        'Collisions: chaining vs open addressing (linear/quadratic probing, double hashing).',
        'Java HashMap resizes at load factor 0.75; chains become trees after 8 nodes (Java 8+).',
        'equal objects ⇒ equal hashCodes; override equals and hashCode together.',
        'Two Sum unsorted ⇒ hashmap of value → index.',
        'Longest consecutive sequence: only start counting from x where x−1 is absent.'
      ]
    },
    {
      id: 'searching-sorting', title: 'Binary Search & Sorting',
      content: `
        ## Binary search — the template
        Works on any **monotonic** predicate, not just sorted arrays.
        ~~~python
        # First index where cond(i) is True (lower_bound style)
        def first_true(lo, hi, cond):
            while lo < hi:
                mid = (lo + hi) // 2      # in C++/Java: lo + (hi - lo) / 2 to avoid overflow
                if cond(mid): hi = mid
                else: lo = mid + 1
            return lo
        ~~~
        ~~~cpp
        // First index where cond(i) is true (lower_bound style)
        int firstTrue(int lo, int hi, function<bool(int)> cond) {
            while (lo < hi) {
                int mid = lo + (hi - lo) / 2;     // avoids overflow
                if (cond(mid)) hi = mid;
                else lo = mid + 1;
            }
            return lo;
        }
        // STL: lower_bound(a.begin(), a.end(), x) / upper_bound(...)
        ~~~

        ### Variants you must know
        - First / last occurrence, count of x (= last − first + 1).
        - Search in **rotated sorted array**: one half is always sorted — check which, then decide.
        - Find **peak element**: if \`a[mid] < a[mid+1]\` go right.
        - **Binary search on answer**: minimise the max / maximise the min. E.g. *Koko eating bananas*, *allocate books*, *aggressive cows*, *split array largest sum*. Check feasibility(x) in O(n) ⇒ total O(n log range).
        - Square root, median of two sorted arrays (O(log min(m,n))).

        ## Sorting algorithms
        | Algorithm | Best | Average | Worst | Space | Stable | Notes |
        |---|---|---|---|---|---|---|
        | Bubble | O(n) | O(n²) | O(n²) | O(1) | ✓ | swap adjacent |
        | Selection | O(n²) | O(n²) | O(n²) | O(1) | ✗ | min swaps (n−1) |
        | Insertion | O(n) | O(n²) | O(n²) | O(1) | ✓ | great for nearly sorted / small n |
        | Merge | O(n log n) | O(n log n) | O(n log n) | O(n) | ✓ | linked lists, external sort |
        | Quick | O(n log n) | O(n log n) | O(n²) | O(log n) | ✗ | fastest in practice |
        | Heap | O(n log n) | O(n log n) | O(n log n) | O(1) | ✗ | in place, guaranteed |
        | Counting | O(n+k) | O(n+k) | O(n+k) | O(k) | ✓ | small integer range |
        | Radix | O(d(n+b)) | — | — | O(n+b) | ✓ | digits |

        **Stable** = equal elements keep their relative order. Python's \`sorted\` (Timsort) and Java's object sort are stable; Java's primitive sort (dual-pivot quicksort) isn't.
        **Lower bound** for comparison sorts: Ω(n log n).

        ### Merge sort
        ~~~python
        def merge_sort(a):
            if len(a) <= 1: return a
            m = len(a) // 2
            L, R = merge_sort(a[:m]), merge_sort(a[m:])
            out, i, j = [], 0, 0
            while i < len(L) and j < len(R):
                if L[i] <= R[j]: out.append(L[i]); i += 1
                else: out.append(R[j]); j += 1
            return out + L[i:] + R[j:]
        ~~~
        ~~~cpp
        void mergeSort(vector<int>& a, int l, int r) {   // sorts a[l..r]
            if (l >= r) return;
            int m = l + (r - l) / 2;
            mergeSort(a, l, m); mergeSort(a, m + 1, r);
            vector<int> tmp;
            int i = l, j = m + 1;
            while (i <= m && j <= r) tmp.push_back(a[i] <= a[j] ? a[i++] : a[j++]);
            while (i <= m) tmp.push_back(a[i++]);
            while (j <= r) tmp.push_back(a[j++]);
            for (int k = l; k <= r; k++) a[k] = tmp[k - l];
        }
        ~~~
        Bonus: **count inversions** during merge (when R[j] < L[i], add len(L) − i).

        ### Quick sort (Lomuto partition)
        ~~~python
        def quick_sort(a, lo, hi):
            if lo >= hi: return
            pivot, i = a[hi], lo
            for j in range(lo, hi):
                if a[j] < pivot:
                    a[i], a[j] = a[j], a[i]; i += 1
            a[i], a[hi] = a[hi], a[i]
            quick_sort(a, lo, i - 1); quick_sort(a, i + 1, hi)
        ~~~
        ~~~cpp
        void quickSort(vector<int>& a, int lo, int hi) {
            if (lo >= hi) return;
            int pivot = a[hi], i = lo;
            for (int j = lo; j < hi; j++)
                if (a[j] < pivot) swap(a[i++], a[j]);
            swap(a[i], a[hi]);
            quickSort(a, lo, i - 1); quickSort(a, i + 1, hi);
        }
        ~~~
        Worst case O(n²) on sorted input with a bad pivot → use **random pivot**. **Quickselect** finds the k-th smallest in average O(n).

        > 🎯 **Common question:** "Why is quicksort preferred over merge sort for arrays but merge sort for linked lists?" — Quicksort is in-place and cache-friendly; merge sort on linked lists needs no extra array and no random access.
      `,
      keyPoints: [
        'Binary search works on any monotonic predicate; mid = lo + (hi−lo)/2 avoids overflow.',
        'Rotated sorted array: one half is always sorted — decide using it.',
        '"Minimise the maximum / maximise the minimum" ⇒ binary search on answer + feasibility check.',
        'Merge sort: O(n log n) always, stable, O(n) space. Quick sort: O(n²) worst, in-place, not stable.',
        'Heap sort: O(n log n) guaranteed, O(1) space, not stable.',
        'Comparison sorting lower bound is Ω(n log n); counting/radix beat it for bounded integers.',
        'Insertion sort is best for nearly-sorted or tiny arrays (used inside Timsort).',
        'Quickselect: k-th smallest in average O(n).'
      ]
    },
    {
      id: 'linked-list', title: 'Linked Lists',
      content: `
        ## Basics
        Nodes connected by pointers. O(1) insert/delete given the node, O(n) access by index. Types: singly, doubly, circular.
        ~~~python
        class Node:
            def __init__(self, val, nxt=None):
                self.val, self.next = val, nxt
        ~~~
        ~~~cpp
        struct Node {
            int val;
            Node* next;
            Node(int v, Node* n = nullptr) : val(v), next(n) {}
        };
        ~~~

        | | Array | Linked list |
        |---|---|---|
        | Access by index | O(1) | O(n) |
        | Insert at head | O(n) | O(1) |
        | Memory | contiguous, cache friendly | extra pointer per node |

        ## Must-know techniques
        ### 1. Reverse a list (iterative)
        ~~~python
        def reverse(head):
            prev = None
            while head:
                head.next, prev, head = prev, head, head.next
            return prev
        ~~~
        ~~~cpp
        Node* reverse(Node* head) {
            Node* prev = nullptr;
            while (head) {
                Node* nxt = head->next;
                head->next = prev;
                prev = head;
                head = nxt;
            }
            return prev;
        }
        ~~~
        ### 2. Fast & slow pointers (Floyd)
        - **Middle**: slow moves 1, fast moves 2 → slow is at middle when fast ends.
        - **Cycle detection**: if they meet, a cycle exists.
        - **Cycle start**: after meeting, move one pointer to head; advance both by 1; they meet at the start.
        ~~~python
        def cycle_start(head):
            slow = fast = head
            while fast and fast.next:
                slow, fast = slow.next, fast.next.next
                if slow is fast:
                    slow = head
                    while slow is not fast:
                        slow, fast = slow.next, fast.next
                    return slow
            return None
        ~~~
        ~~~cpp
        Node* cycleStart(Node* head) {
            Node *slow = head, *fast = head;
            while (fast && fast->next) {
                slow = slow->next; fast = fast->next->next;
                if (slow == fast) {
                    slow = head;
                    while (slow != fast) { slow = slow->next; fast = fast->next; }
                    return slow;
                }
            }
            return nullptr;
        }
        ~~~
        ### 3. Dummy node
        Simplifies edge cases when the head may change (merge two sorted lists, remove elements, partition).
        ### 4. Two pointers with gap
        **Remove N-th node from end**: move first pointer n steps ahead, then move both.

        ## Classic problems
        - Merge two sorted lists / **merge k sorted lists** (min-heap, O(N log k)).
        - Palindrome linked list (find middle → reverse second half → compare).
        - Intersection of two lists (switch heads trick: a+b = b+a).
        - Reverse in groups of k.
        - Add two numbers represented as lists.
        - Copy list with random pointer (interleave copies or hashmap).
        - **LRU cache** = hashmap + doubly linked list → O(1) get/put. (Very frequently asked!)

        ~~~python
        from collections import OrderedDict
        class LRUCache:
            def __init__(self, cap):
                self.cap, self.d = cap, OrderedDict()
            def get(self, k):
                if k not in self.d: return -1
                self.d.move_to_end(k); return self.d[k]
            def put(self, k, v):
                self.d[k] = v; self.d.move_to_end(k)
                if len(self.d) > self.cap: self.d.popitem(last=False)
        ~~~
        ~~~cpp
        class LRUCache {
            int cap;
            list<pair<int,int>> dll;                                   // front = most recent
            unordered_map<int, list<pair<int,int>>::iterator> pos;
        public:
            LRUCache(int capacity) : cap(capacity) {}
            int get(int k) {
                auto it = pos.find(k);
                if (it == pos.end()) return -1;
                dll.splice(dll.begin(), dll, it->second);              // move to front, O(1)
                return it->second->second;
            }
            void put(int k, int v) {
                if (pos.count(k)) {
                    pos[k]->second = v;
                    dll.splice(dll.begin(), dll, pos[k]);
                    return;
                }
                dll.emplace_front(k, v);
                pos[k] = dll.begin();
                if ((int)dll.size() > cap) {                           // evict least recent
                    pos.erase(dll.back().first);
                    dll.pop_back();
                }
            }
        };
        ~~~
        > 🎯 In interviews, be ready to implement LRU **without** OrderedDict using your own doubly linked list with head/tail sentinels.
      `,
      keyPoints: [
        'Linked list: O(1) insert/delete at known node, O(n) indexed access, not cache friendly.',
        'Reverse iteratively with prev/curr/next — O(n) time, O(1) space.',
        'Floyd: slow/fast pointers for middle, cycle detection; reset one to head to find cycle start.',
        'Use a dummy node when the head might change.',
        'Remove N-th from end: advance one pointer n steps, then move both.',
        'Merge k sorted lists with a min-heap: O(N log k).',
        'LRU cache = HashMap + doubly linked list ⇒ O(1) get/put.'
      ]
    },
    {
      id: 'stack-queue', title: 'Stacks, Queues & Monotonic Stack',
      content: `
        ## Stack (LIFO)
        push/pop/peek O(1). Used in: function calls, undo, expression evaluation, DFS, backtracking.

        ## Queue (FIFO) and variants
        - **Queue** — BFS, scheduling. Python: \`collections.deque\`.
        - **Deque** — insert/remove both ends O(1).
        - **Circular queue** — fixed array with front/rear modulo n.
        - **Priority queue** — see Heaps.

        ## Classic stack problems
        ~~~python
        # Valid parentheses
        def is_valid(s):
            pairs, st = {')': '(', ']': '[', '}': '{'}, []
            for c in s:
                if c in pairs:
                    if not st or st.pop() != pairs[c]: return False
                else:
                    st.append(c)
            return not st
        ~~~
        ~~~cpp
        // Valid parentheses
        bool isValid(const string& s) {
            stack<char> st;
            for (char c : s) {
                if (c == '(' || c == '[' || c == '{') { st.push(c); continue; }
                if (st.empty()) return false;
                char o = st.top(); st.pop();
                if ((c == ')' && o != '(') || (c == ']' && o != '[') || (c == '}' && o != '{'))
                    return false;
            }
            return st.empty();
        }
        ~~~
        - **Min stack**: store (value, current_min) pairs → getMin in O(1).
        - Evaluate postfix / infix → postfix (shunting-yard).
        - Implement queue using two stacks (amortised O(1)), stack using queues.

        ## Monotonic stack ⭐
        Keeps elements in increasing/decreasing order. Solves **"next greater/smaller element"** family in O(n).
        ~~~python
        def next_greater(a):
            res, st = [-1] * len(a), []      # st stores indices, values decreasing
            for i, x in enumerate(a):
                while st and a[st[-1]] < x:
                    res[st.pop()] = x
                st.append(i)
            return res
        ~~~
        ~~~cpp
        vector<int> nextGreater(vector<int>& a) {
            vector<int> res(a.size(), -1);
            stack<int> st;                        // indices, values decreasing
            for (int i = 0; i < (int)a.size(); i++) {
                while (!st.empty() && a[st.top()] < a[i]) {
                    res[st.top()] = a[i]; st.pop();
                }
                st.push(i);
            }
            return res;
        }
        ~~~
        Problems: daily temperatures, stock span, **largest rectangle in histogram**, maximal rectangle, trapping rain water, sum of subarray minimums, remove k digits.

        ## Monotonic deque — sliding window maximum
        ~~~python
        from collections import deque
        def max_window(a, k):
            dq, out = deque(), []
            for i, x in enumerate(a):
                while dq and a[dq[-1]] <= x: dq.pop()
                dq.append(i)
                if dq[0] <= i - k: dq.popleft()
                if i >= k - 1: out.append(a[dq[0]])
            return out
        ~~~
        ~~~cpp
        vector<int> maxWindow(vector<int>& a, int k) {
            deque<int> dq; vector<int> out;
            for (int i = 0; i < (int)a.size(); i++) {
                while (!dq.empty() && a[dq.back()] <= a[i]) dq.pop_back();
                dq.push_back(i);
                if (dq.front() <= i - k) dq.pop_front();
                if (i >= k - 1) out.push_back(a[dq.front()]);
            }
            return out;
        }
        ~~~
        > 💡 **Tip:** "Next greater / previous smaller / span / histogram" ⇒ monotonic stack. "Max/min of every window" ⇒ monotonic deque.
      `,
      keyPoints: [
        'Stack = LIFO (DFS, undo, parsing); Queue = FIFO (BFS, scheduling).',
        'Min stack: store (value, min-so-far) pairs.',
        'Queue via two stacks: amortised O(1) per operation.',
        'Next greater/smaller element, stock span, histogram ⇒ monotonic stack in O(n).',
        'Sliding window maximum ⇒ monotonic deque storing indices, O(n).',
        'Use collections.deque in Python — list.pop(0) is O(n).'
      ]
    },
    {
      id: 'recursion-backtracking', title: 'Recursion & Backtracking',
      content: `
        ## Recursion checklist
        1. **Base case** — when to stop.
        2. **Recursive case** — trust the function for a smaller input ("leap of faith").
        3. **Combine** results.

        Every recursive call uses a stack frame → deep recursion can overflow (Python default limit ≈ 1000; use \`sys.setrecursionlimit\` or iterate).

        ## Backtracking template
        Build a solution step by step, **undo** the choice after exploring it.
        ~~~python
        def backtrack(path, choices):
            if is_solution(path):
                result.append(path[:])    # copy!
                return
            for c in choices:
                if not valid(c): continue
                path.append(c)            # choose
                backtrack(path, next_choices)  # explore
                path.pop()                # un-choose
        ~~~
        ~~~cpp
        void backtrack(vector<int>& path, /* choices */ ...) {
            if (isSolution(path)) {
                result.push_back(path);           // copies the vector
                return;
            }
            for (int c : choices) {
                if (!valid(c)) continue;
                path.push_back(c);                // choose
                backtrack(path, nextChoices);     // explore
                path.pop_back();                  // un-choose
            }
        }
        ~~~

        ## Canonical problems
        ~~~python
        # Subsets — O(n · 2^n)
        def subsets(nums):
            res = []
            def go(i, path):
                if i == len(nums): res.append(path[:]); return
                go(i + 1, path)                              # skip
                path.append(nums[i]); go(i + 1, path); path.pop()  # take
            go(0, []); return res

        # Permutations — O(n · n!)
        def permute(nums):
            res = []
            def go(path, used):
                if len(path) == len(nums): res.append(path[:]); return
                for i, x in enumerate(nums):
                    if used[i]: continue
                    used[i] = True; path.append(x)
                    go(path, used)
                    used[i] = False; path.pop()
            go([], [False] * len(nums)); return res
        ~~~
        ~~~cpp
        // Subsets — O(n · 2^n)
        void subsetsGo(vector<int>& nums, int i, vector<int>& path, vector<vector<int>>& res) {
            if (i == (int)nums.size()) { res.push_back(path); return; }
            subsetsGo(nums, i + 1, path, res);                        // skip
            path.push_back(nums[i]);
            subsetsGo(nums, i + 1, path, res);                        // take
            path.pop_back();
        }

        // Permutations — O(n · n!)
        void permGo(vector<int>& nums, vector<bool>& used, vector<int>& path, vector<vector<int>>& res) {
            if (path.size() == nums.size()) { res.push_back(path); return; }
            for (int i = 0; i < (int)nums.size(); i++) {
                if (used[i]) continue;
                used[i] = true; path.push_back(nums[i]);
                permGo(nums, used, path, res);
                used[i] = false; path.pop_back();
            }
        }
        ~~~
        | Problem | Key idea |
        |---|---|
        | Subsets II / Permutations II (duplicates) | sort, then skip \`nums[i] == nums[i-1]\` at same level |
        | Combination sum | reuse allowed → recurse with same index |
        | N-Queens | track used columns, diagonals (r−c) and anti-diagonals (r+c) |
        | Sudoku solver | try 1–9 in empty cells, check row/col/box sets |
        | Word search | DFS on grid, mark visited, unmark on return |
        | Palindrome partitioning | cut at every palindromic prefix |
        | Rat in a maze | 4-direction DFS with visited |

        > 💡 **Pruning** (stopping early when the partial solution can't work) is what makes backtracking fast enough.
      `,
      keyPoints: [
        'Recursion = base case + smaller sub-problem + combine.',
        'Backtracking: choose → explore → un-choose (undo).',
        'Subsets O(n·2ⁿ), permutations O(n·n!).',
        'Handle duplicates: sort and skip equal elements at the same recursion level.',
        'N-Queens: track columns, r−c diagonals and r+c anti-diagonals.',
        'Always append a copy of the path (path[:]) to results.'
      ]
    },
    {
      id: 'trees', title: 'Binary Trees & BST',
      content: `
        ## Terminology
        Root, parent, child, leaf, **height** (edges on longest root→leaf path), **depth**, subtree.
        - **Full**: every node has 0 or 2 children. **Complete**: all levels full except possibly last, filled left→right (heaps). **Perfect**: all leaves at same level (2^(h+1) − 1 nodes). **Balanced**: height difference ≤ 1 everywhere.

        ## Traversals
        | Traversal | Order | Use |
        |---|---|---|
        | Preorder | Root, L, R | copy/serialise tree |
        | Inorder | L, Root, R | **BST → sorted order** |
        | Postorder | L, R, Root | delete tree, compute heights |
        | Level order | BFS by level | level-wise views, min depth |

        ~~~python
        def inorder(root):            # iterative
            st, res, cur = [], [], root
            while cur or st:
                while cur: st.append(cur); cur = cur.left
                cur = st.pop(); res.append(cur.val); cur = cur.right
            return res

        from collections import deque
        def level_order(root):
            if not root: return []
            q, res = deque([root]), []
            while q:
                level = []
                for _ in range(len(q)):
                    n = q.popleft(); level.append(n.val)
                    if n.left: q.append(n.left)
                    if n.right: q.append(n.right)
                res.append(level)
            return res
        ~~~
        ~~~cpp
        struct TreeNode { int val; TreeNode *left, *right; };

        vector<int> inorder(TreeNode* root) {        // iterative
            stack<TreeNode*> st; vector<int> res;
            TreeNode* cur = root;
            while (cur || !st.empty()) {
                while (cur) { st.push(cur); cur = cur->left; }
                cur = st.top(); st.pop();
                res.push_back(cur->val);
                cur = cur->right;
            }
            return res;
        }

        vector<vector<int>> levelOrder(TreeNode* root) {
            vector<vector<int>> res;
            if (!root) return res;
            queue<TreeNode*> q; q.push(root);
            while (!q.empty()) {
                vector<int> level;
                for (int sz = q.size(); sz > 0; sz--) {
                    TreeNode* n = q.front(); q.pop();
                    level.push_back(n->val);
                    if (n->left) q.push(n->left);
                    if (n->right) q.push(n->right);
                }
                res.push_back(level);
            }
            return res;
        }
        ~~~
        **Morris traversal** does inorder in O(1) space using temporary threads.

        ## The "return info from children" pattern
        Most tree problems = postorder DFS returning something useful.
        ~~~python
        def diameter(root):
            best = 0
            def h(n):
                nonlocal best
                if not n: return 0
                l, r = h(n.left), h(n.right)
                best = max(best, l + r)       # path through n
                return 1 + max(l, r)
            h(root); return best
        ~~~
        ~~~cpp
        int best = 0;
        int height(TreeNode* n) {
            if (!n) return 0;
            int l = height(n->left), r = height(n->right);
            best = max(best, l + r);              // path through n
            return 1 + max(l, r);
        }
        int diameter(TreeNode* root) { best = 0; height(root); return best; }
        ~~~
        Same shape: height, balanced check, max path sum, diameter, LCA.

        ## Lowest Common Ancestor
        ~~~python
        def lca(root, p, q):
            if not root or root is p or root is q: return root
            l, r = lca(root.left, p, q), lca(root.right, p, q)
            return root if l and r else l or r
        ~~~
        ~~~cpp
        TreeNode* lca(TreeNode* root, TreeNode* p, TreeNode* q) {
            if (!root || root == p || root == q) return root;
            TreeNode* l = lca(root->left, p, q);
            TreeNode* r = lca(root->right, p, q);
            if (l && r) return root;
            return l ? l : r;
        }
        ~~~

        ## Binary Search Tree
        Left subtree < node < right subtree. Search/insert/delete **O(h)**: O(log n) balanced, O(n) skewed.
        - **Validate BST**: pass (low, high) bounds down — not just compare with children!
        - Delete node with two children: replace with **inorder successor** (min of right subtree).
        - k-th smallest: inorder traversal, stop at k.
        - LCA in BST: go left if both smaller, right if both larger, else current node.
        - **Self-balancing**: AVL (strict, rotations, faster lookups), Red-Black (looser, faster inserts; used in Java TreeMap, C++ map).

        ## Other must-dos
        Views (left/right/top/bottom), zigzag traversal, build tree from inorder + preorder, serialize/deserialize, boundary traversal, vertical order, symmetric tree, path sum, flatten to linked list.
      `,
      keyPoints: [
        'Inorder of a BST gives sorted order.',
        'Preorder = Root-L-R (copy), Postorder = L-R-Root (delete/heights), Level order = BFS.',
        'Most tree problems: postorder DFS that returns info from children (height, diameter, balanced).',
        'Diameter at a node = left height + right height.',
        'LCA: return node if it is p or q; if both sides non-null, current node is LCA.',
        'Validate BST with (min, max) bounds, not just parent-child comparisons.',
        'BST operations are O(h): O(log n) balanced, O(n) skewed. AVL/Red-Black keep it balanced.',
        'Complete binary tree with n nodes has height ⌊log₂ n⌋.'
      ]
    },
    {
      id: 'heaps', title: 'Heaps & Priority Queues',
      content: `
        ## What is a heap?
        A **complete binary tree** stored in an array where every parent ≤ children (**min-heap**) or ≥ (**max-heap**).
        For index i (0-based): left = 2i+1, right = 2i+2, parent = (i−1)//2.

        | Operation | Complexity |
        |---|---|
        | peek min/max | O(1) |
        | push / pop | O(log n) |
        | build heap from array | **O(n)** (not n log n!) |

        ## In code
        ~~~python
        import heapq
        h = []
        heapq.heappush(h, 5); heapq.heappush(h, 1)
        heapq.heappop(h)              # 1 — Python heapq is a MIN-heap
        heapq.heappush(h, -x)         # trick for max-heap: push negatives
        heapq.nlargest(3, nums)
        ~~~
        ~~~cpp
        priority_queue<int> maxH;                               // MAX-heap by default
        priority_queue<int, vector<int>, greater<int>> minH;    // min-heap
        minH.push(5); minH.push(1);
        minH.top();   // 1
        minH.pop();
        // custom order: priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;
        ~~~
        Java: \`PriorityQueue<Integer> pq = new PriorityQueue<>(Collections.reverseOrder());\` · C++: \`priority_queue<int>\` is a **max**-heap by default.

        ## Patterns
        ### Top-K elements
        Keep a **min-heap of size k** for the k largest → O(n log k).
        ~~~python
        def k_largest(nums, k):
            h = []
            for x in nums:
                heapq.heappush(h, x)
                if len(h) > k: heapq.heappop(h)
            return h      # h[0] is the k-th largest
        ~~~
        ~~~cpp
        vector<int> kLargest(vector<int>& nums, int k) {
            priority_queue<int, vector<int>, greater<int>> h;   // min-heap of size k
            for (int x : nums) {
                h.push(x);
                if ((int)h.size() > k) h.pop();
            }
            vector<int> res;                                   // h.top() is the k-th largest
            while (!h.empty()) { res.push_back(h.top()); h.pop(); }
            return res;
        }
        ~~~
        ### Two heaps — running median
        Max-heap for the lower half, min-heap for the upper half; keep sizes balanced (differ by ≤ 1).
        ### K-way merge
        Merge k sorted lists/arrays — push the head of each, pop smallest, push its successor.
        ### Scheduling / greedy
        Task scheduler, meeting rooms II (min rooms = min-heap of end times), Dijkstra, CPU scheduling, reorganise string.
      `,
      keyPoints: [
        'Heap = complete binary tree in an array; children of i are 2i+1 and 2i+2.',
        'push/pop O(log n), peek O(1), build-heap O(n).',
        "Python heapq is a min-heap (negate for max); C++ priority_queue is a max-heap by default.",
        'Top-K largest: min-heap of size k ⇒ O(n log k).',
        'Running median: max-heap (lower half) + min-heap (upper half).',
        'Merge k sorted lists with a heap: O(N log k).'
      ]
    },
    {
      id: 'graphs', title: 'Graphs',
      content: `
        ## Representation
        | | Adjacency list | Adjacency matrix |
        |---|---|---|
        | Space | O(V + E) | O(V²) |
        | Check edge u–v | O(deg u) | O(1) |
        | Best for | sparse graphs (most problems) | dense graphs, Floyd–Warshall |

        Types: directed/undirected, weighted/unweighted, cyclic/acyclic (DAG), connected components. Grids are implicit graphs (4 or 8 neighbours).

        ## BFS & DFS — O(V + E)
        ~~~python
        from collections import deque
        def bfs(start, adj):
            dist = {start: 0}; q = deque([start])
            while q:
                u = q.popleft()
                for v in adj[u]:
                    if v not in dist:
                        dist[v] = dist[u] + 1; q.append(v)
            return dist          # shortest path in UNWEIGHTED graph

        def dfs(u, adj, seen):
            seen.add(u)
            for v in adj[u]:
                if v not in seen: dfs(v, adj, seen)
        ~~~
        ~~~cpp
        vector<int> bfs(int start, vector<vector<int>>& adj) {
            vector<int> dist(adj.size(), -1);
            queue<int> q; q.push(start); dist[start] = 0;
            while (!q.empty()) {
                int u = q.front(); q.pop();
                for (int v : adj[u])
                    if (dist[v] == -1) { dist[v] = dist[u] + 1; q.push(v); }
            }
            return dist;          // shortest path in UNWEIGHTED graph
        }

        void dfs(int u, vector<vector<int>>& adj, vector<bool>& seen) {
            seen[u] = true;
            for (int v : adj[u])
                if (!seen[v]) dfs(v, adj, seen);
        }
        ~~~
        - **BFS**: shortest path in unweighted graphs, level order, multi-source BFS (rotting oranges, 0/1 matrix).
        - **DFS**: connected components, cycle detection, topological sort, number of islands, path finding.

        ## Cycle detection
        - **Undirected**: DFS — a visited neighbour that's not the parent ⇒ cycle. Or Union-Find.
        - **Directed**: DFS with 3 colours (white/grey/black) — reaching a **grey** node ⇒ cycle. Or Kahn's algorithm (if not all nodes processed ⇒ cycle).

        ## Topological sort (DAG only)
        ~~~python
        def topo_sort(n, edges):           # Kahn's algorithm
            adj, indeg = [[] for _ in range(n)], [0] * n
            for u, v in edges: adj[u].append(v); indeg[v] += 1
            q = deque(i for i in range(n) if indeg[i] == 0); order = []
            while q:
                u = q.popleft(); order.append(u)
                for v in adj[u]:
                    indeg[v] -= 1
                    if indeg[v] == 0: q.append(v)
            return order if len(order) == n else []   # [] ⇒ cycle
        ~~~
        ~~~cpp
        vector<int> topoSort(int n, vector<pair<int,int>>& edges) {   // Kahn's algorithm
            vector<vector<int>> adj(n); vector<int> indeg(n, 0);
            for (auto [u, v] : edges) { adj[u].push_back(v); indeg[v]++; }
            queue<int> q;
            for (int i = 0; i < n; i++) if (indeg[i] == 0) q.push(i);
            vector<int> order;
            while (!q.empty()) {
                int u = q.front(); q.pop(); order.push_back(u);
                for (int v : adj[u]) if (--indeg[v] == 0) q.push(v);
            }
            if ((int)order.size() != n) return {};   // empty => cycle
            return order;
        }
        ~~~
        Use cases: course schedule, build order, alien dictionary.

        ## Shortest paths
        | Algorithm | Graph | Complexity | Notes |
        |---|---|---|---|
        | BFS | unweighted | O(V+E) | |
        | 0-1 BFS | weights 0/1 | O(V+E) | deque: 0 → front, 1 → back |
        | **Dijkstra** | non-negative weights | O((V+E) log V) | min-heap; fails with negative edges |
        | **Bellman–Ford** | negative weights OK | O(VE) | relax V−1 times; V-th relaxation ⇒ negative cycle |
        | **Floyd–Warshall** | all pairs | O(V³) | \`d[i][j] = min(d[i][j], d[i][k]+d[k][j])\` |
        | Topo order + relax | DAG | O(V+E) | works with negatives |

        ~~~python
        import heapq
        def dijkstra(src, adj, n):          # adj[u] = [(v, w), ...]
            dist = [float('inf')] * n; dist[src] = 0
            pq = [(0, src)]
            while pq:
                d, u = heapq.heappop(pq)
                if d > dist[u]: continue     # stale entry
                for v, w in adj[u]:
                    if d + w < dist[v]:
                        dist[v] = d + w; heapq.heappush(pq, (dist[v], v))
            return dist
        ~~~
        ~~~cpp
        vector<long long> dijkstra(int src, vector<vector<pair<int,int>>>& adj) {  // adj[u] = {v, w}
            const long long INF = LLONG_MAX;
            vector<long long> dist(adj.size(), INF);
            priority_queue<pair<long long,int>, vector<pair<long long,int>>, greater<>> pq;
            dist[src] = 0; pq.push({0, src});
            while (!pq.empty()) {
                auto [d, u] = pq.top(); pq.pop();
                if (d > dist[u]) continue;                 // stale entry
                for (auto [v, w] : adj[u])
                    if (d + w < dist[v]) { dist[v] = d + w; pq.push({dist[v], v}); }
            }
            return dist;
        }
        ~~~

        ## Minimum Spanning Tree (connected, undirected, weighted)
        - **Kruskal**: sort edges, add if it doesn't form a cycle (Union-Find). O(E log E).
        - **Prim**: grow from a node using a min-heap of edges. O(E log V).

        ## Disjoint Set Union (Union-Find)
        ~~~python
        class DSU:
            def __init__(self, n): self.p, self.r = list(range(n)), [0] * n
            def find(self, x):
                while self.p[x] != x:
                    self.p[x] = self.p[self.p[x]]   # path compression
                    x = self.p[x]
                return x
            def union(self, a, b):
                a, b = self.find(a), self.find(b)
                if a == b: return False
                if self.r[a] < self.r[b]: a, b = b, a
                self.p[b] = a
                if self.r[a] == self.r[b]: self.r[a] += 1
                return True
        ~~~
        ~~~cpp
        struct DSU {
            vector<int> p, r;
            DSU(int n) : p(n), r(n, 0) { iota(p.begin(), p.end(), 0); }
            int find(int x) { return p[x] == x ? x : p[x] = find(p[x]); }   // path compression
            bool unite(int a, int b) {
                a = find(a); b = find(b);
                if (a == b) return false;
                if (r[a] < r[b]) swap(a, b);                                // union by rank
                p[b] = a;
                if (r[a] == r[b]) r[a]++;
                return true;
            }
        };
        ~~~
        With path compression + union by rank: nearly O(1) (inverse Ackermann α(n)).

        ## Advanced (for top product companies)
        Bipartite check (2-colouring with BFS), strongly connected components (Kosaraju / Tarjan), bridges & articulation points (Tarjan low-link), Eulerian path.
      `,
      keyPoints: [
        'Adjacency list O(V+E) space for sparse graphs; matrix O(V²) for dense.',
        'BFS ⇒ shortest path in unweighted graphs; DFS ⇒ components, cycles, topo sort.',
        'Directed cycle: DFS reaching a node currently on the recursion stack (grey).',
        "Topological sort (Kahn's): repeatedly remove in-degree-0 nodes; leftover nodes ⇒ cycle.",
        'Dijkstra: non-negative weights, O((V+E) log V). Bellman–Ford handles negatives, O(VE), detects negative cycles.',
        'Floyd–Warshall: all pairs, O(V³).',
        'MST: Kruskal (sort edges + DSU) or Prim (min-heap).',
        'DSU with path compression + union by rank ≈ O(1) per operation.',
        'Bipartite ⇔ 2-colourable ⇔ no odd cycle.'
      ]
    },
    {
      id: 'greedy', title: 'Greedy Algorithms',
      content: `
        ## Idea
        Make the **locally optimal** choice at each step and never revisit it. Works only when the problem has the **greedy-choice property** + **optimal substructure**. Prove it with an *exchange argument*, or find a counter-example.

        ## Classic greedy problems
        | Problem | Greedy rule |
        |---|---|
        | Activity selection / non-overlapping intervals | sort by **end time**, pick earliest finishing |
        | Fractional knapsack | sort by value/weight ratio |
        | Minimum platforms / meeting rooms | sort starts & ends, sweep |
        | Jump game | track farthest reachable index |
        | Gas station | if total gas ≥ total cost, start after the point where tank goes negative |
        | Huffman coding | repeatedly merge two smallest frequencies (min-heap) |
        | Job sequencing with deadlines | sort by profit, place in latest free slot |
        | Coin change (canonical coins like 1,2,5,10) | take largest coin first |
        | Candy distribution | two passes (left→right, right→left) |

        ~~~python
        def max_non_overlapping(intervals):
            intervals.sort(key=lambda x: x[1])
            count, end = 0, float('-inf')
            for s, e in intervals:
                if s >= end:
                    count += 1; end = e
            return count

        def can_jump(nums):
            reach = 0
            for i, x in enumerate(nums):
                if i > reach: return False
                reach = max(reach, i + x)
            return True
        ~~~
        ~~~cpp
        int maxNonOverlapping(vector<pair<int,int>>& iv) {
            sort(iv.begin(), iv.end(), [](auto& x, auto& y) { return x.second < y.second; });
            int count = 0; long long end = LLONG_MIN;
            for (auto [s, e] : iv)
                if (s >= end) { count++; end = e; }
            return count;
        }

        bool canJump(vector<int>& nums) {
            int reach = 0;
            for (int i = 0; i < (int)nums.size(); i++) {
                if (i > reach) return false;
                reach = max(reach, i + nums[i]);
            }
            return true;
        }
        ~~~
        > ⚠️ **Trap:** Greedy coin change fails for coins like {1, 3, 4} and amount 6 (greedy gives 4+1+1, optimal is 3+3). 0/1 knapsack also needs DP, not greedy.
      `,
      keyPoints: [
        'Greedy = locally optimal choice, never reconsidered; needs greedy-choice property.',
        'Interval scheduling: sort by END time.',
        'Fractional knapsack is greedy (value/weight); 0/1 knapsack needs DP.',
        'Greedy coin change fails for non-canonical coin systems, e.g. {1,3,4} for 6.',
        'Huffman coding: merge two smallest frequencies repeatedly.',
        'Jump game: track the farthest reachable index.'
      ]
    },
    {
      id: 'dp', title: 'Dynamic Programming',
      content: `
        ## When to use DP
        1. **Optimal substructure** — the answer is built from answers to sub-problems.
        2. **Overlapping sub-problems** — same sub-problems are solved again and again.

        Keywords: *count the ways*, *minimum/maximum*, *is it possible*, *longest/shortest*.

        ## Recipe
        1. Define the **state**: what does \`dp[i]\` (or \`dp[i][j]\`) mean, in words?
        2. Write the **transition** (recurrence).
        3. Set the **base cases**.
        4. Decide the **order** of computation and where the answer is.
        5. Optimise space if a row depends only on the previous row.

        ## Memoization vs Tabulation
        | Top-down (memo) | Bottom-up (table) |
        |---|---|
        | recursion + cache | iterative loops |
        | easy to write from recurrence | no recursion-stack overflow |
        | computes only needed states | easier space optimisation |

        ~~~python
        from functools import lru_cache
        @lru_cache(None)
        def fib(n): return n if n < 2 else fib(n-1) + fib(n-2)

        def fib_tab(n):
            a, b = 0, 1
            for _ in range(n): a, b = b, a + b
            return a
        ~~~
        ~~~cpp
        // Memoization (top-down)
        vector<long long> memo(100, -1);
        long long fib(int n) {
            if (n < 2) return n;
            if (memo[n] != -1) return memo[n];
            return memo[n] = fib(n - 1) + fib(n - 2);
        }

        // Tabulation (bottom-up), O(1) space
        long long fibTab(int n) {
            long long a = 0, b = 1;
            for (int i = 0; i < n; i++) { long long c = a + b; a = b; b = c; }
            return a;
        }
        ~~~

        ## The DP families you must know
        ### 1. 1-D DP
        Climbing stairs, house robber (\`dp[i] = max(dp[i-1], dp[i-2] + a[i])\`), decode ways, min cost climbing.
        ### 2. Knapsack family
        ~~~python
        # 0/1 knapsack — each item once; iterate capacity BACKWARDS
        def knapsack(wt, val, W):
            dp = [0] * (W + 1)
            for w, v in zip(wt, val):
                for c in range(W, w - 1, -1):
                    dp[c] = max(dp[c], dp[c - w] + v)
            return dp[W]
        ~~~
        ~~~cpp
        // 0/1 knapsack — each item once; iterate capacity BACKWARDS
        int knapsack(vector<int>& wt, vector<int>& val, int W) {
            vector<int> dp(W + 1, 0);
            for (size_t i = 0; i < wt.size(); i++)
                for (int c = W; c >= wt[i]; c--)
                    dp[c] = max(dp[c], dp[c - wt[i]] + val[i]);
            return dp[W];
        }
        ~~~
        - **Unbounded** knapsack (items reusable) → iterate capacity **forwards**: coin change, rod cutting.
        - Subset sum, partition equal subset sum, target sum, count subsets with given difference.
        ~~~python
        def coin_change(coins, amount):          # min coins
            dp = [0] + [float('inf')] * amount
            for a in range(1, amount + 1):
                for c in coins:
                    if c <= a: dp[a] = min(dp[a], dp[a - c] + 1)
            return dp[amount] if dp[amount] != float('inf') else -1
        ~~~
        ~~~cpp
        int coinChange(vector<int>& coins, int amount) {     // min coins
            const int INF = INT_MAX / 2;
            vector<int> dp(amount + 1, INF);
            dp[0] = 0;
            for (int a = 1; a <= amount; a++)
                for (int c : coins)
                    if (c <= a) dp[a] = min(dp[a], dp[a - c] + 1);
            return dp[amount] >= INF ? -1 : dp[amount];
        }
        ~~~
        ### 3. Strings (two sequences)
        ~~~python
        def lcs(a, b):
            m, n = len(a), len(b)
            dp = [[0] * (n + 1) for _ in range(m + 1)]
            for i in range(1, m + 1):
                for j in range(1, n + 1):
                    dp[i][j] = dp[i-1][j-1] + 1 if a[i-1] == b[j-1] else max(dp[i-1][j], dp[i][j-1])
            return dp[m][n]
        ~~~
        ~~~cpp
        int lcs(const string& a, const string& b) {
            int m = a.size(), n = b.size();
            vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
            for (int i = 1; i <= m; i++)
                for (int j = 1; j <= n; j++)
                    dp[i][j] = a[i-1] == b[j-1] ? dp[i-1][j-1] + 1
                                                : max(dp[i-1][j], dp[i][j-1]);
            return dp[m][n];
        }
        ~~~
        Edit distance (\`1 + min(insert, delete, replace)\`), longest palindromic subsequence (= LCS(s, reverse s)), shortest common supersequence (m + n − LCS), wildcard/regex matching, distinct subsequences.
        ### 4. LIS — Longest Increasing Subsequence
        O(n²) DP, or **O(n log n)** with patience sorting + binary search:
        ~~~python
        import bisect
        def lis(a):
            tails = []
            for x in a:
                i = bisect.bisect_left(tails, x)
                if i == len(tails): tails.append(x)
                else: tails[i] = x
            return len(tails)
        ~~~
        ~~~cpp
        int lis(vector<int>& a) {
            vector<int> tails;
            for (int x : a) {
                auto it = lower_bound(tails.begin(), tails.end(), x);
                if (it == tails.end()) tails.push_back(x);
                else *it = x;
            }
            return tails.size();
        }
        ~~~
        ### 5. Grid DP
        Unique paths, minimum path sum, dungeon game, maximal square, cherry pickup.
        ### 6. Interval / partition DP
        Matrix chain multiplication, burst balloons, palindrome partitioning II, boolean parenthesisation. \`dp[i][j]\` = best for segment i..j, try every split k. O(n³).
        ### 7. DP on trees, bitmask DP, digit DP (advanced)
        House robber III, travelling salesman (O(n² 2ⁿ)), count numbers with property ≤ N.
        ### 8. Stock buy-sell family
        State = (day, holding?, transactions left). Covers all 6 variants incl. cooldown & fee.

        > 🎯 **How to explain DP in an interview:** say the state in English ("dp[i] = max money robbing houses 0..i"), then the choice ("rob house i or skip it"), then complexity (#states × work per state).
      `,
      keyPoints: [
        'DP needs optimal substructure + overlapping sub-problems.',
        'Steps: state → transition → base case → order → space optimise.',
        'Complexity = number of states × work per state.',
        '0/1 knapsack: loop capacity backwards; unbounded: loop forwards.',
        'LCS: match ⇒ dp[i−1][j−1]+1, else max(dp[i−1][j], dp[i][j−1]).',
        'Edit distance = 1 + min(insert, delete, replace) when chars differ.',
        'LIS in O(n log n): tails array + binary search.',
        'Interval DP (MCM, burst balloons): try every split point k, O(n³).',
        'House robber: dp[i] = max(dp[i−1], dp[i−2] + a[i]).'
      ]
    },
    {
      id: 'tries-bits', title: 'Tries, Segment Trees & Bit Manipulation',
      content: `
        ## Trie (prefix tree)
        Each node = one character; paths spell words. Insert/search O(L) where L = word length.
        ~~~python
        class Trie:
            def __init__(self): self.root = {}
            def insert(self, w):
                n = self.root
                for c in w: n = n.setdefault(c, {})
                n['$'] = True
            def search(self, w, prefix=False):
                n = self.root
                for c in w:
                    if c not in n: return False
                    n = n[c]
                return prefix or '$' in n
        ~~~
        ~~~cpp
        struct Trie {
            struct Node { Node* ch[26] = {}; bool end = false; };
            Node* root = new Node();
            void insert(const string& w) {
                Node* n = root;
                for (char c : w) {
                    if (!n->ch[c - 'a']) n->ch[c - 'a'] = new Node();
                    n = n->ch[c - 'a'];
                }
                n->end = true;
            }
            bool search(const string& w, bool prefix = false) {
                Node* n = root;
                for (char c : w) {
                    if (!n->ch[c - 'a']) return false;
                    n = n->ch[c - 'a'];
                }
                return prefix || n->end;
            }
        };
        ~~~
        Uses: autocomplete, spell check, word search II, longest common prefix, **maximum XOR pair** (binary trie).

        ## Segment tree & Fenwick tree (BIT)
        For **range queries + point updates** in O(log n).
        | Structure | Query | Update | Notes |
        |---|---|---|---|
        | Prefix sum array | O(1) | O(n) | static data |
        | Fenwick / BIT | O(log n) | O(log n) | sums, simple to code |
        | Segment tree | O(log n) | O(log n) | any associative op (min, max, gcd); lazy propagation for range updates |
        | Sparse table | O(1) | — | static range min/max |

        ## Bit manipulation
        | Trick | Expression |
        |---|---|
        | Check i-th bit | \`(n >> i) & 1\` |
        | Set / clear / toggle i-th bit | \`n \\| (1<<i)\`, \`n & ~(1<<i)\`, \`n ^ (1<<i)\` |
        | Is power of 2 | \`n > 0 and n & (n-1) == 0\` |
        | Remove lowest set bit | \`n & (n-1)\` |
        | Isolate lowest set bit | \`n & -n\` |
        | Count set bits | loop \`n &= n-1\` (Brian Kernighan) |
        | Swap without temp | \`a ^= b; b ^= a; a ^= b\` |

        **XOR properties:** \`x ^ x = 0\`, \`x ^ 0 = x\`, commutative & associative ⇒ find the single non-repeating number by XOR-ing everything.
        ~~~python
        def single_number(nums):
            r = 0
            for x in nums: r ^= x
            return r

        def all_subsets(nums):           # bitmask enumeration
            n = len(nums)
            return [[nums[i] for i in range(n) if mask >> i & 1] for mask in range(1 << n)]
        ~~~
        ~~~cpp
        int singleNumber(vector<int>& nums) {
            int r = 0;
            for (int x : nums) r ^= x;
            return r;
        }

        vector<vector<int>> allSubsets(vector<int>& nums) {   // bitmask enumeration
            int n = nums.size();
            vector<vector<int>> res;
            for (int mask = 0; mask < (1 << n); mask++) {
                vector<int> s;
                for (int i = 0; i < n; i++) if (mask >> i & 1) s.push_back(nums[i]);
                res.push_back(s);
            }
            return res;
        }
        // __builtin_popcount(x) counts set bits
        ~~~
        Two's complement: \`-x = ~x + 1\`. Left shift by k = multiply by 2ᵏ.
      `,
      keyPoints: [
        'Trie insert/search O(L); great for prefix queries and autocomplete.',
        'Range query + point update ⇒ Fenwick tree or segment tree, O(log n).',
        'n & (n−1) removes the lowest set bit; power of 2 ⇔ n>0 and n&(n−1)==0.',
        'x ^ x = 0 and x ^ 0 = x ⇒ XOR all to find the unique element.',
        'n & −n isolates the lowest set bit.',
        'Bitmask over 0..2ⁿ−1 enumerates all subsets.'
      ]
    },
    {
      id: 'patterns', title: 'Problem-Solving Patterns & Must-Do List',
      content: `
        ## Pattern recognition table
        | If the problem says… | Try… |
        |---|---|
        | sorted array, pair/triplet | two pointers / binary search |
        | contiguous subarray/substring with condition | sliding window |
        | subarray sum equals k | prefix sum + hashmap |
        | top/k-th largest, frequent | heap / quickselect / bucket sort |
        | next greater/smaller, spans | monotonic stack |
        | all combinations/permutations/subsets | backtracking |
        | shortest path, minimum steps (unweighted) | BFS |
        | dependencies, ordering | topological sort |
        | connectivity, grouping, redundant edge | Union-Find |
        | linked list cycle/middle | fast & slow pointers |
        | overlapping intervals | sort + merge / sweep line |
        | min/max/count ways with choices | DP |
        | minimise max / maximise min | binary search on answer |
        | prefix/word lookups | trie |
        | numbers 1..n, find missing/duplicate | cyclic sort / XOR / sign marking |

        ## The interview approach (UMPIRE)
        1. **Understand** — restate, ask about constraints, duplicates, negative numbers, empty input.
        2. **Match** — which pattern? Talk about it.
        3. **Plan** — brute force first with complexity, then optimise.
        4. **Implement** — clean names, helper functions.
        5. **Review** — dry-run on a small example + edge cases.
        6. **Evaluate** — time & space complexity, possible improvements.

        ## Must-do problem list (≈ 75)
        **Arrays & Hashing:** Two Sum · Best Time to Buy/Sell Stock · Contains Duplicate · Product of Array Except Self · Maximum Subarray · Merge Intervals · Insert Interval · Group Anagrams · Top K Frequent · Longest Consecutive Sequence · Sort Colors · Next Permutation · Set Matrix Zeroes · Spiral Matrix · Rotate Image
        **Two pointers / Window:** 3Sum · Container With Most Water · Trapping Rain Water · Longest Substring Without Repeating · Longest Repeating Character Replacement · Minimum Window Substring · Sliding Window Maximum
        **Binary search:** Search in Rotated Sorted Array · Find Min in Rotated Array · Koko Eating Bananas · Median of Two Sorted Arrays · Aggressive Cows / Book Allocation
        **Linked list:** Reverse List · Merge Two Sorted Lists · Linked List Cycle II · Remove N-th From End · Reorder List · Merge K Sorted Lists · LRU Cache · Reverse Nodes in k-Group
        **Stack:** Valid Parentheses · Min Stack · Daily Temperatures · Largest Rectangle in Histogram · Evaluate RPN
        **Trees:** Max Depth · Invert Tree · Same Tree · Level Order · Diameter · Balanced Tree · LCA · Validate BST · Kth Smallest in BST · Build Tree from Preorder+Inorder · Max Path Sum · Serialize/Deserialize · Right Side View
        **Heap:** Kth Largest · Find Median from Data Stream · Task Scheduler
        **Backtracking:** Subsets · Permutations · Combination Sum · Word Search · N-Queens · Palindrome Partitioning
        **Graphs:** Number of Islands · Clone Graph · Rotting Oranges · Course Schedule I/II · Pacific Atlantic · Word Ladder · Network Delay Time (Dijkstra) · Redundant Connection (DSU) · Cheapest Flights Within K Stops
        **DP:** Climbing Stairs · House Robber I/II · Coin Change · Longest Increasing Subsequence · Longest Common Subsequence · Edit Distance · Word Break · Partition Equal Subset Sum · Unique Paths · Decode Ways · Longest Palindromic Substring · Burst Balloons
        **Bits & Tries:** Single Number · Counting Bits · Implement Trie · Word Search II

        > 💡 **Practice strategy:** Solve by pattern, not randomly. For each problem, write one line in your notes: *pattern + key insight*. Re-solve problems you failed after 3 days and after 7 days — that is spaced repetition for DSA.
      `,
      keyPoints: [
        'Match keywords to patterns: sorted ⇒ two pointers/BS; subarray ⇒ window/prefix; k-th ⇒ heap.',
        'Always state brute force + complexity before optimising.',
        'Ask about constraints, duplicates, negatives and empty input first.',
        'Dry-run your code on a small example and edge cases before saying "done".',
        'Practise by pattern; re-solve failed problems after 3 and 7 days.'
      ]
    }
  ],
  flashcards: [
    { q: 'Time complexity of binary search and why?', a: 'O(log n) — the search space halves every step: T(n) = T(n/2) + O(1).' },
    { q: 'Which sorting algorithms are stable?', a: 'Merge sort, insertion sort, bubble sort, counting sort, radix sort, Timsort. **Not stable:** quick sort, heap sort, selection sort.' },
    { q: 'Worst case of quicksort and how to avoid it?', a: 'O(n²) when the pivot is always the smallest/largest (e.g. sorted input with last-element pivot). Use a random pivot or median-of-three.' },
    { q: 'Complexity of building a heap from n elements?', a: 'O(n) using bottom-up heapify (most nodes are near the leaves and sift down very little).' },
    { q: 'How do you detect a cycle in a linked list?', a: "Floyd's tortoise and hare: slow moves 1 step, fast moves 2; if they meet there is a cycle. O(n) time, O(1) space." },
    { q: 'How do you find the start of a cycle in a linked list?', a: 'After slow and fast meet, reset one pointer to head and move both one step at a time — they meet at the cycle start.' },
    { q: 'Which data structures implement an LRU cache in O(1)?', a: 'HashMap (key → node) + doubly linked list (recency order). Move to front on access, evict from tail.' },
    { q: 'When does Dijkstra fail?', a: 'With negative edge weights. Use Bellman–Ford (O(VE)), which also detects negative cycles.' },
    { q: 'BFS vs DFS — when to use which?', a: 'BFS: shortest path in unweighted graphs, level-wise processing. DFS: connectivity, cycle detection, topological sort, backtracking / exhaustive search.' },
    { q: 'What is topological sort and when does it exist?', a: 'A linear ordering of a directed graph where every edge u→v has u before v. Exists only for DAGs (no cycles). Kahn (BFS with in-degrees) or DFS post-order reversed.' },
    { q: 'Two conditions for applying dynamic programming?', a: 'Optimal substructure and overlapping sub-problems.' },
    { q: 'Memoization vs tabulation?', a: 'Memoization = top-down recursion with cache (computes only needed states). Tabulation = bottom-up iterative table (no recursion stack, easier space optimisation).' },
    { q: 'Kadane’s algorithm recurrence?', a: 'cur = max(x, cur + x); best = max(best, cur). Finds the maximum subarray sum in O(n).' },
    { q: 'How to find k largest elements efficiently?', a: 'Keep a min-heap of size k: O(n log k). Or quickselect in average O(n).' },
    { q: 'What does n & (n − 1) do?', a: 'Clears the lowest set bit. If the result is 0 (and n > 0), n is a power of two.' },
    { q: 'Inorder traversal of a BST gives…?', a: 'The keys in sorted (ascending) order.' },
    { q: 'How do you validate a BST?', a: 'Recursively pass allowed (low, high) bounds; every node must satisfy low < val < high. Or check inorder is strictly increasing.' },
    { q: 'Kruskal vs Prim?', a: 'Kruskal: sort all edges, add if no cycle (DSU) — O(E log E), good for sparse. Prim: grow tree from a vertex with a min-heap — O(E log V), good for dense.' },
    { q: 'What two optimisations make Union-Find nearly O(1)?', a: 'Path compression (in find) and union by rank/size. Amortised O(α(n)).' },
    { q: 'Sliding window — when to use?', a: 'Contiguous subarray/substring problems with a constraint (max length, at most k distinct, sum ≥ target). Expand right; shrink left while the window is invalid.' },
    { q: 'Monotonic stack is used for…?', a: 'Next/previous greater or smaller element, stock span, largest rectangle in histogram, trapping rain water — all in O(n).' },
    { q: '0/1 knapsack vs unbounded knapsack loop direction (1-D dp)?', a: '0/1: iterate capacity backwards (each item used once). Unbounded: iterate forwards (item can be reused).' },
    { q: 'LIS in O(n log n)?', a: 'Maintain `tails`; for each x, binary-search the first tail ≥ x and replace it (or append). Length of tails = LIS length.' },
    { q: 'Master theorem result for T(n) = 2T(n/2) + O(n)?', a: 'O(n log n) (e.g. merge sort), since d = 1 = log₂2.' },
    { q: 'Array vs linked list?', a: 'Array: O(1) random access, cache-friendly, costly middle inserts. Linked list: O(1) insert/delete at a known node, O(n) access, extra pointer memory.' },
    { q: 'Hash collision resolution techniques?', a: 'Separate chaining (lists/trees per bucket) and open addressing (linear probing, quadratic probing, double hashing).' },
    { q: 'What is "binary search on the answer"?', a: 'When the answer lies in a range and feasibility is monotonic (e.g. min capacity to ship in D days), binary-search the answer and check feasibility each time.' },
    { q: 'How do you detect a cycle in a directed graph?', a: "DFS with three states (unvisited / in-stack / done) — an edge to an in-stack node means a cycle. Or Kahn's algorithm processing fewer than V nodes." },
    { q: 'Height of a complete binary tree with n nodes?', a: '⌊log₂ n⌋ — this is why heap operations are O(log n).' },
    { q: 'Why is merge sort preferred for linked lists?', a: 'It needs only sequential access, no random indexing, and merging lists needs O(1) extra space; quicksort relies on random access.' }
  ],
  quiz: [
    { q: 'What is the time complexity of this loop?\n\n~~~\ni = 1\nwhile i < n:\n    i *= 2\n~~~', options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(√n)'], answer: 1, explain: 'i doubles each iteration, so the loop runs log₂ n times.', topic: 'complexity' },
    { q: 'n ≤ 10⁵. Which complexity will most likely pass in 1 second?', options: ['O(n²)', 'O(n log n)', 'O(2ⁿ)', 'O(n³)'], answer: 1, explain: '10⁵ × 17 ≈ 1.7·10⁶ operations. O(n²) = 10¹⁰ is too slow.', topic: 'complexity' },
    { q: 'Which sorting algorithm has O(n log n) worst-case time and O(1) extra space?', options: ['Merge sort', 'Quick sort', 'Heap sort', 'Insertion sort'], answer: 2, explain: 'Heap sort is in-place with guaranteed O(n log n). Merge sort needs O(n); quicksort is O(n²) worst.', topic: 'searching-sorting' },
    { q: 'Which of these is NOT a stable sort (in its standard form)?', options: ['Merge sort', 'Insertion sort', 'Quick sort', 'Counting sort'], answer: 2, explain: 'Standard quicksort partitioning can reorder equal elements.', topic: 'searching-sorting' },
    { q: 'Best approach to find the longest substring without repeating characters?', options: ['Brute force all substrings', 'Sliding window with a hashmap', 'Dynamic programming O(n²)', 'Sorting the string'], answer: 1, explain: 'A variable sliding window gives O(n).', topic: 'arrays' },
    { q: 'Count subarrays whose sum equals k (array may contain negatives). Best approach?', options: ['Sliding window', 'Prefix sum + hashmap', 'Two pointers after sorting', 'Binary search'], answer: 1, explain: 'Sliding window fails with negatives; prefix sums with counts work in O(n).', topic: 'arrays' },
    { q: 'Fast and slow pointers meet inside a linked list. This means:', options: ['The list is sorted', 'The list has a cycle', 'The list length is even', 'The list is empty'], answer: 1, explain: "Floyd's algorithm: they can only meet if there is a cycle.", topic: 'linked-list' },
    { q: 'Which data structure gives the "next greater element" for each item in O(n)?', options: ['Queue', 'Min-heap', 'Monotonic stack', 'Trie'], answer: 2, explain: 'Keep a decreasing stack of indices; pop when a bigger element arrives.', topic: 'stack-queue' },
    { q: 'Which traversal of a BST outputs keys in sorted order?', options: ['Preorder', 'Inorder', 'Postorder', 'Level order'], answer: 1, explain: 'Left, root, right visits keys in ascending order.', topic: 'trees' },
    { q: 'Time to build a binary heap from an unsorted array of n elements (bottom-up)?', options: ['O(n log n)', 'O(n)', 'O(log n)', 'O(n²)'], answer: 1, explain: 'Bottom-up heapify sums to O(n).', topic: 'heaps' },
    { q: 'To find the k largest elements of a stream efficiently, use:', options: ['Max-heap of all elements', 'Min-heap of size k', 'Sorted array', 'Stack'], answer: 1, explain: 'Min-heap of size k keeps the k largest; root is the k-th largest. O(n log k).', topic: 'heaps' },
    { q: 'Shortest path in an unweighted graph is best found by:', options: ['DFS', 'BFS', 'Dijkstra', 'Floyd–Warshall'], answer: 1, explain: 'BFS visits nodes in increasing distance; O(V+E).', topic: 'graphs' },
    { q: 'Which algorithm works with negative edge weights and detects negative cycles?', options: ['Dijkstra', 'Prim', 'Bellman–Ford', 'Kruskal'], answer: 2, explain: 'Bellman–Ford relaxes all edges V−1 times; a further improvement means a negative cycle.', topic: 'graphs' },
    { q: 'Topological sort is possible only if the graph is:', options: ['Undirected', 'A DAG', 'Weighted', 'Complete'], answer: 1, explain: 'Any cycle makes a valid ordering impossible.', topic: 'graphs' },
    { q: 'Which problem CANNOT be solved correctly with a greedy approach?', options: ['Fractional knapsack', 'Activity selection', '0/1 knapsack', 'Huffman coding'], answer: 2, explain: '0/1 knapsack requires DP.', topic: 'greedy' },
    { q: 'Interval scheduling (max non-overlapping intervals): sort by…', options: ['Start time', 'End time', 'Length', 'Random order'], answer: 1, explain: 'Picking the earliest finishing interval leaves the most room.', topic: 'greedy' },
    { q: 'Time complexity of LCS of strings of length m and n using DP?', options: ['O(m + n)', 'O(m·n)', 'O(2^(m+n))', 'O(m log n)'], answer: 1, explain: 'There are m·n states, each O(1).', topic: 'dp' },
    { q: 'In a 1-D 0/1 knapsack DP, the capacity loop must run:', options: ['Forwards', 'Backwards', 'Either way', 'Twice'], answer: 1, explain: 'Backwards prevents reusing the same item in one pass.', topic: 'dp' },
    { q: 'Expression to check if n (> 0) is a power of 2:', options: ['n & 1 == 0', 'n & (n−1) == 0', 'n | (n−1) == 0', 'n ^ 1 == 0'], answer: 1, explain: 'Powers of two have exactly one set bit; n & (n−1) clears it.', topic: 'tries-bits' },
    { q: 'Every element appears twice except one. Fastest O(1)-space way to find it?', options: ['Sort and scan', 'HashSet', 'XOR of all elements', 'Sum formula'], answer: 2, explain: 'Pairs cancel because x ^ x = 0.', topic: 'tries-bits' },
    { q: 'Ship packages within D days with minimum capacity. The intended technique is:', options: ['DP', 'Binary search on answer', 'Backtracking', 'Topological sort'], answer: 1, explain: 'Feasibility is monotonic in capacity → binary search between max(weight) and sum(weights).', topic: 'searching-sorting' },
    { q: 'Union-Find with path compression and union by rank has amortised complexity:', options: ['O(log n)', 'O(n)', 'O(α(n)) ≈ constant', 'O(1) exactly'], answer: 2, explain: 'Inverse Ackermann — practically constant.', topic: 'graphs' }
  ]
});
