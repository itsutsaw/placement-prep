window.SUBJECTS = window.SUBJECTS || [];
window.SUBJECTS.push({
  id: 'dbms', title: 'DBMS & SQL', short: 'DBMS', icon: '🗄️', color: '#10b981', group: 'core',
  desc: 'ER model, keys, normalization, SQL queries (joins, window functions), transactions & ACID, concurrency, indexing and NoSQL.',
  topics: [
    {
      id: 'intro', title: 'DBMS Basics & Architecture',
      content: `
        ## DBMS vs File system
        A **DBMS** is software to store, retrieve and manage data efficiently and safely (MySQL, PostgreSQL, Oracle, MongoDB).

        | Problem with file systems | DBMS solution |
        |---|---|
        | Data redundancy & inconsistency | normalisation, single source of truth |
        | Difficult querying | declarative SQL |
        | Integrity constraints buried in code | constraints (PK, FK, CHECK) |
        | No atomicity | transactions |
        | Concurrent access anomalies | concurrency control, locks |
        | Weak security | users, roles, privileges |

        ## Three-schema architecture (data abstraction)
        1. **Physical (internal) level** — how data is stored (files, indexes, blocks).
        2. **Logical (conceptual) level** — what data is stored and relationships (tables, constraints).
        3. **View (external) level** — what each user sees.

        **Data independence:**
        - *Physical*: change storage without changing the logical schema (easy).
        - *Logical*: change the logical schema without changing views/apps (hard).

        ## Schema vs instance
        Schema = structure/design (rarely changes). Instance = the data at a particular moment.

        ## Database languages
        | Type | Purpose | Commands |
        |---|---|---|
        | **DDL** | define structure | CREATE, ALTER, DROP, TRUNCATE, RENAME |
        | **DML** | manipulate data | SELECT, INSERT, UPDATE, DELETE |
        | **DCL** | permissions | GRANT, REVOKE |
        | **TCL** | transactions | COMMIT, ROLLBACK, SAVEPOINT |

        ## DELETE vs TRUNCATE vs DROP
        | | DELETE | TRUNCATE | DROP |
        |---|---|---|---|
        | Type | DML | DDL | DDL |
        | Removes | selected rows (WHERE) | all rows | whole table + structure |
        | Rollback | yes | usually no (auto-commit in MySQL) | no |
        | Triggers fire | yes | no | no |
        | Speed | slow (row by row, logged) | fast | fast |

        ## Data models
        Hierarchical, network, **relational** (tables; Codd 1970), object-oriented, document/key-value/graph (NoSQL).
      `,
      keyPoints: [
        'DBMS solves redundancy, inconsistency, integrity, atomicity, concurrency and security issues of files.',
        'Three levels: physical, logical (conceptual), view (external).',
        'Physical data independence is easier than logical data independence.',
        'DDL: CREATE/ALTER/DROP/TRUNCATE; DML: SELECT/INSERT/UPDATE/DELETE; DCL: GRANT/REVOKE; TCL: COMMIT/ROLLBACK/SAVEPOINT.',
        'DELETE is DML (rollback-able, WHERE); TRUNCATE is DDL (all rows, fast); DROP removes the table itself.',
        'Schema = structure; instance = data snapshot.'
      ]
    },
    {
      id: 'er-keys', title: 'ER Model, Keys & Relational Algebra',
      content: `
        ## ER model
        - **Entity** (rectangle): real-world object, e.g. Student. **Weak entity** (double rectangle): no key of its own, depends on owner (Dependent of Employee).
        - **Attributes** (ellipse): simple/composite, single/**multivalued** (double ellipse), **derived** (dashed — age from DOB), key (underlined).
        - **Relationship** (diamond) with **cardinality**: 1:1, 1:N, M:N, and **participation**: total (double line) / partial.
        - **Generalisation** (bottom-up), **specialisation** (top-down), **aggregation** (relationship treated as entity).

        ### Mapping ER → tables
        - Entity → table; multivalued attribute → separate table.
        - 1:N → put the PK of the "1" side as FK in the "N" side.
        - M:N → separate junction table with both PKs (composite PK).

        ## Keys ⭐
        | Key | Definition |
        |---|---|
        | **Super key** | any set of attributes that uniquely identifies a row |
        | **Candidate key** | *minimal* super key (no proper subset is a super key) |
        | **Primary key** | the chosen candidate key; unique + NOT NULL; one per table |
        | **Alternate key** | candidate keys not chosen as primary |
        | **Composite key** | key with 2+ attributes |
        | **Foreign key** | attribute referencing a PK in another (or same) table → referential integrity |
        | **Unique key** | unique values, but NULLs allowed (one NULL in SQL Server, many in MySQL/Postgres) |
        | **Surrogate key** | system-generated ID (auto-increment, UUID) with no business meaning |

        Every candidate key is a super key, not every super key is a candidate key.

        ## Integrity constraints
        Domain, entity integrity (PK not null), referential integrity (FK must match a PK or be NULL), key constraints. FK actions: \`ON DELETE CASCADE / SET NULL / RESTRICT\`.

        ## Relational algebra (procedural query language)
        | Operator | Symbol | SQL equivalent |
        |---|---|---|
        | Selection | σ | WHERE |
        | Projection | π | SELECT columns (DISTINCT) |
        | Union / Intersection / Difference | ∪ ∩ − | UNION / INTERSECT / EXCEPT |
        | Cartesian product | × | CROSS JOIN |
        | Join | ⋈ | JOIN |
        | Rename | ρ | AS |
        | Division | ÷ | "for all" queries |

        *Relational calculus* (tuple/domain) is the non-procedural counterpart — SQL is based on it.
      `,
      keyPoints: [
        'Super key ⊇ candidate key (minimal) ⊇ primary key (chosen, not null).',
        'Foreign key enforces referential integrity; may be NULL.',
        'Unique key allows NULLs; primary key does not.',
        'M:N relationship ⇒ separate junction table; 1:N ⇒ FK on the N side.',
        'Weak entity has no key of its own; uses owner key + partial key.',
        'Relational algebra: σ select rows, π project columns, ⋈ join, ÷ division ("for all").'
      ]
    },
    {
      id: 'normalization', title: 'Functional Dependencies & Normalization',
      content: `
        ## Why normalize?
        Remove **redundancy** and the anomalies it causes:
        - **Insertion anomaly** — can't insert a course without a student.
        - **Update anomaly** — instructor's phone stored in 50 rows; updating one leaves inconsistency.
        - **Deletion anomaly** — deleting the last student of a course loses course info.

        ## Functional dependency (FD)
        \`X → Y\` means: if two rows agree on X, they agree on Y. (RollNo → Name)
        - **Trivial**: Y ⊆ X. **Partial**: non-prime attribute depends on *part* of a candidate key. **Transitive**: X → Y and Y → Z, so X → Z via a non-key.
        - **Armstrong's axioms**: reflexivity, augmentation, transitivity (+ derived: union, decomposition, pseudo-transitivity).
        - **Attribute closure X⁺**: all attributes determined by X. If X⁺ contains all attributes, X is a super key.

        ## Normal forms
        | NF | Rule | Removes |
        |---|---|---|
        | **1NF** | atomic values; no repeating groups/multivalued cells | multivalued attributes |
        | **2NF** | 1NF + no **partial dependency** (non-prime attr. depends on whole candidate key) | partial dependencies |
        | **3NF** | 2NF + no **transitive dependency**: for every X → A, X is a super key **or** A is prime | transitive dependencies |
        | **BCNF** | for every non-trivial X → A, **X is a super key** | all FD-based redundancy |
        | **4NF** | BCNF + no multi-valued dependencies | MVDs |
        | **5NF** | no join dependencies | join anomalies |

        ### Worked example
        \`Enrollment(StudentID, CourseID, StudentName, CourseName, Instructor, InstructorPhone)\`, key = (StudentID, CourseID)
        1. StudentID → StudentName is **partial** → violates 2NF. Split \`Student(StudentID, StudentName)\`.
        2. CourseID → CourseName, Instructor — partial → \`Course(CourseID, CourseName, Instructor)\`.
        3. Instructor → InstructorPhone is **transitive** inside Course → violates 3NF → \`Instructor(Instructor, Phone)\`.
        4. Remaining: \`Enrollment(StudentID, CourseID)\`.

        ## Decomposition properties
        - **Lossless join** (must): natural join of parts gives back the original. Condition: common attributes form a key of at least one part.
        - **Dependency preserving** (desirable): all FDs can be checked without joining.
        - 3NF decomposition can always be lossless **and** dependency preserving; BCNF always lossless but **not always** dependency preserving.

        ## Denormalization
        Intentionally adding redundancy to **speed up reads** (fewer joins) — common in analytics/data warehouses and NoSQL. Trade-off: harder writes, risk of inconsistency.
      `,
      keyPoints: [
        'Normalization removes redundancy ⇒ insertion, update and deletion anomalies.',
        'X → Y: equal X values imply equal Y values.',
        '1NF atomic values; 2NF no partial dependency; 3NF no transitive dependency; BCNF every determinant is a super key.',
        '3NF allows X → A when A is prime; BCNF does not — BCNF is stricter.',
        'Lossless join: common attributes must be a key of one of the decomposed tables.',
        'BCNF may lose dependency preservation; 3NF never needs to.',
        'Denormalization trades write complexity for faster reads.'
      ]
    },
    {
      id: 'sql', title: 'SQL — Queries You Must Write Fluently',
      content: `
        ## Order of execution
        \`FROM → JOIN → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT\`
        That's why you can't use a SELECT alias in WHERE, but can in ORDER BY.

        ## WHERE vs HAVING
        WHERE filters **rows before** grouping (no aggregates). HAVING filters **groups after** aggregation.

        ## Joins
        | Join | Returns |
        |---|---|
        | INNER | matching rows in both |
        | LEFT (OUTER) | all left rows + matches (NULL if none) |
        | RIGHT (OUTER) | all right rows + matches |
        | FULL (OUTER) | all rows from both |
        | CROSS | Cartesian product (m × n) |
        | SELF | table joined to itself (employee–manager) |
        | NATURAL | join on all same-named columns |

        ~~~sql
        -- Employees with their manager's name (self join)
        SELECT e.name AS employee, m.name AS manager
        FROM employees e LEFT JOIN employees m ON e.manager_id = m.id;

        -- Customers who never ordered (anti-join)
        SELECT c.* FROM customers c
        LEFT JOIN orders o ON o.customer_id = c.id
        WHERE o.id IS NULL;
        ~~~

        ## Classic interview queries
        ~~~sql
        -- 2nd highest salary
        SELECT MAX(salary) FROM employees
        WHERE salary < (SELECT MAX(salary) FROM employees);

        -- N-th highest salary (generic)
        SELECT DISTINCT salary FROM employees
        ORDER BY salary DESC LIMIT 1 OFFSET 2;        -- 3rd highest

        -- Departments with more than 5 employees
        SELECT dept_id, COUNT(*) AS cnt FROM employees
        GROUP BY dept_id HAVING COUNT(*) > 5;

        -- Find duplicate emails
        SELECT email, COUNT(*) FROM users GROUP BY email HAVING COUNT(*) > 1;

        -- Delete duplicates keeping the lowest id (MySQL)
        DELETE u1 FROM users u1 JOIN users u2
          ON u1.email = u2.email AND u1.id > u2.id;

        -- Employees earning more than their department average (correlated subquery)
        SELECT name, salary FROM employees e
        WHERE salary > (SELECT AVG(salary) FROM employees WHERE dept_id = e.dept_id);
        ~~~

        ## Window functions ⭐ (frequently asked now)
        Compute over a set of rows **without collapsing** them like GROUP BY.
        ~~~sql
        -- Top 3 salaries per department
        SELECT * FROM (
          SELECT name, dept_id, salary,
                 DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rnk
          FROM employees
        ) t WHERE rnk <= 3;

        -- Running total and previous-day comparison
        SELECT day, revenue,
               SUM(revenue) OVER (ORDER BY day) AS running_total,
               revenue - LAG(revenue) OVER (ORDER BY day) AS change
        FROM sales;
        ~~~
        | Function | 100, 100, 90 gives |
        |---|---|
        | ROW_NUMBER() | 1, 2, 3 |
        | RANK() | 1, 1, 3 (gaps) |
        | DENSE_RANK() | 1, 1, 2 (no gaps) |
        Others: \`LAG\`, \`LEAD\`, \`NTILE\`, \`FIRST_VALUE\`, aggregates with \`OVER\`.

        ## CTEs & subqueries
        ~~~sql
        WITH dept_avg AS (
          SELECT dept_id, AVG(salary) AS avg_sal FROM employees GROUP BY dept_id
        )
        SELECT e.name FROM employees e JOIN dept_avg d USING (dept_id)
        WHERE e.salary > d.avg_sal;
        ~~~
        Recursive CTEs traverse hierarchies (org chart). **Correlated subquery** runs once per outer row; **non-correlated** runs once.

        ## Other must-knows
        - \`UNION\` removes duplicates; \`UNION ALL\` keeps them (faster).
        - \`IN\` vs \`EXISTS\`: EXISTS stops at first match — often better for large correlated subqueries. \`NOT IN\` with a NULL in the list returns nothing!
        - \`COUNT(*)\` counts rows; \`COUNT(col)\` ignores NULLs. Aggregates ignore NULLs; \`NULL = NULL\` is unknown — use \`IS NULL\`.
        - \`CHAR\` (fixed length) vs \`VARCHAR\` (variable).
        - **Views** (virtual table, stored query), **materialized views** (stored result), **stored procedures**, **triggers** (auto-run on INSERT/UPDATE/DELETE), **cursors**.
        - \`LIKE 'a%'\` (starts with a), \`'_b%'\` (second letter b).
      `,
      keyPoints: [
        'Execution order: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT.',
        'WHERE filters rows before grouping; HAVING filters groups after aggregation.',
        'LEFT JOIN + WHERE right.id IS NULL ⇒ rows with no match (anti-join).',
        '2nd highest: MAX(salary) WHERE salary < (SELECT MAX(salary)); or DENSE_RANK.',
        'ROW_NUMBER 1,2,3; RANK 1,1,3; DENSE_RANK 1,1,2.',
        'Top-N per group ⇒ window function with PARTITION BY.',
        'UNION removes duplicates; UNION ALL keeps them and is faster.',
        'COUNT(*) counts all rows; COUNT(col) skips NULLs; NOT IN with NULLs returns nothing.'
      ]
    },
    {
      id: 'transactions', title: 'Transactions, ACID & Concurrency Control',
      content: `
        ## Transaction
        A logical unit of work (e.g. transfer ₹500: debit A, credit B) that must be all-or-nothing.

        ## ACID
        | Property | Meaning | Ensured by |
        |---|---|---|
        | **Atomicity** | all or nothing | undo logs / rollback |
        | **Consistency** | DB moves from one valid state to another (constraints hold) | constraints + app logic |
        | **Isolation** | concurrent txns behave as if run one by one | locking / MVCC |
        | **Durability** | committed changes survive crashes | redo logs (WAL), disk |

        ## Transaction states
        Active → Partially committed → Committed, or Active → Failed → Aborted (then restart or kill).

        ## Concurrency problems
        | Problem | Description |
        |---|---|
        | **Dirty read** | read uncommitted data of another txn that later rolls back |
        | **Non-repeatable read** | same row read twice gives different values (another txn updated it) |
        | **Phantom read** | same query returns new rows (another txn inserted) |
        | **Lost update** | two txns overwrite each other's update |

        ## Isolation levels
        | Level | Dirty | Non-repeatable | Phantom |
        |---|---|---|---|
        | Read Uncommitted | possible | possible | possible |
        | Read Committed (Postgres/Oracle default) | ✗ | possible | possible |
        | Repeatable Read (MySQL InnoDB default) | ✗ | ✗ | possible* |
        | Serializable | ✗ | ✗ | ✗ |
        *InnoDB prevents most phantoms with gap locks.

        ## Schedules & serializability
        - **Serial schedule**: txns run one after another — always consistent.
        - **Conflict serializable**: can be turned into a serial schedule by swapping non-conflicting ops. Test: build a **precedence graph**; **no cycle ⇒ conflict serializable**.
        - Conflicting operations: same data item, different txns, at least one write (R-W, W-R, W-W).
        - **Recoverable** schedule: a txn commits only after txns it read from commit. **Cascadeless**: read only committed data.

        ## Locking
        - **Shared (S) lock** for read — many can hold. **Exclusive (X) lock** for write — only one.
        - **Two-Phase Locking (2PL)**: growing phase (acquire only) then shrinking phase (release only) → guarantees conflict serializability but **can deadlock**.
        - **Strict 2PL**: hold X locks until commit → avoids cascading rollbacks.
        - **Timestamp ordering**, **optimistic concurrency** (validate at commit), **MVCC** (readers see a snapshot; writers create new versions — Postgres, InnoDB).

        ## Deadlock handling
        Wait-for graph cycle detection; prevention with **wait-die** (older waits, younger dies) / **wound-wait** (older wounds younger); timeouts.

        ## Recovery
        **Write-ahead logging (WAL)**: log record written before the data page. **Checkpoints** limit how much log to replay. Undo uncommitted, redo committed. Shadow paging is an alternative.
      `,
      keyPoints: [
        'ACID: Atomicity (all or nothing), Consistency (valid states), Isolation (as if serial), Durability (survives crashes).',
        'Dirty read = uncommitted data; non-repeatable = row changed; phantom = new rows appear.',
        'Isolation: Read Uncommitted < Read Committed < Repeatable Read < Serializable.',
        'Precedence graph with no cycle ⇒ conflict serializable.',
        '2PL (growing then shrinking) ⇒ serializable but deadlocks possible; Strict 2PL avoids cascading aborts.',
        'MVCC: readers do not block writers (snapshots).',
        'WAL: write log before data; undo uncommitted, redo committed on recovery.'
      ]
    },
    {
      id: 'indexing', title: 'Indexing, Storage & Query Optimisation',
      content: `
        ## What is an index?
        A data structure (usually a **B+ tree**) that speeds up lookups at the cost of extra storage and slower writes. Like a book's index.

        ## B-tree vs B+ tree
        | B-tree | B+ tree |
        |---|---|
        | data in internal + leaf nodes | data/pointers **only in leaves** |
        | leaves not linked | leaves form a **linked list** → fast range scans |
        | fewer keys per internal node | higher fan-out → shorter tree |
        B+ trees are used by almost every RDBMS: a 3–4 level tree indexes millions of rows → few disk reads.

        ## Types of indexes
        - **Clustered** — rows are physically stored in index order; **only one per table** (InnoDB: the primary key).
        - **Non-clustered (secondary)** — separate structure with pointers to rows; many allowed.
        - **Primary / unique / composite** (multi-column) indexes.
        - **Dense** (entry for every record) vs **sparse** (entry per block).
        - **Hash index** — O(1) equality lookups, useless for ranges.
        - **Bitmap index** — low-cardinality columns (gender, status) in warehouses.
        - **Covering index** — contains all columns a query needs → no table lookup.

        ## Composite index & leftmost prefix rule
        Index on \`(a, b, c)\` helps queries on \`a\`, \`(a, b)\`, \`(a, b, c)\` — **not** on \`b\` or \`c\` alone.

        ## When NOT to index
        Small tables, columns with low selectivity, heavily-written tables, columns wrapped in functions in WHERE (\`WHERE YEAR(date) = 2024\` can't use the index on date), leading wildcards (\`LIKE '%abc'\`).

        ## Query optimisation tips
        - Use \`EXPLAIN\` to view the plan (look for full table scans).
        - Select only needed columns (avoid \`SELECT *\`).
        - Index columns used in WHERE, JOIN, ORDER BY.
        - Prefer joins/EXISTS over large IN subqueries; paginate with keyset (\`WHERE id > last_id\`) instead of huge OFFSETs.

        ## Storage concepts
        Data stored in **pages/blocks** on disk; buffer pool caches pages in memory. **RAID** levels: RAID 0 (striping, speed), RAID 1 (mirroring), RAID 5 (striping + parity), RAID 10 (mirror + stripe).
      `,
      keyPoints: [
        'Index = faster reads, slower writes, extra space; usually a B+ tree.',
        'B+ tree: data only in leaves, leaves linked ⇒ efficient range queries.',
        'Clustered index = physical order, only one per table; non-clustered = separate pointers, many.',
        'Composite index (a,b,c) follows the leftmost-prefix rule.',
        'Hash index: equality only, no ranges.',
        'Functions on indexed columns and leading-wildcard LIKE prevent index use.',
        'Use EXPLAIN to inspect query plans.'
      ]
    },
    {
      id: 'nosql', title: 'NoSQL, CAP & Scaling Databases',
      content: `
        ## SQL vs NoSQL
        | | SQL (relational) | NoSQL |
        |---|---|---|
        | Schema | fixed, predefined | flexible / schemaless |
        | Scaling | vertical (mostly) | horizontal (sharding built in) |
        | Transactions | strong ACID | often BASE (eventual consistency); many now support ACID |
        | Query | SQL, joins | API / query language, few joins |
        | Best for | structured data, complex queries, consistency (banking) | huge scale, flexible/unstructured data, high write throughput |

        ## NoSQL types
        | Type | Examples | Use case |
        |---|---|---|
        | Key-value | Redis, DynamoDB | caching, sessions, leaderboards |
        | Document | MongoDB, Couchbase | JSON-like records, catalogs, CMS |
        | Column-family (wide column) | Cassandra, HBase | time-series, huge write volume |
        | Graph | Neo4j | social networks, recommendations, fraud |
        | Vector | Pinecone, Milvus, pgvector | similarity search for AI embeddings |

        ## CAP theorem
        A distributed system can guarantee only two of **Consistency**, **Availability**, **Partition tolerance** at the same time. Since partitions happen, the real choice is **CP** (e.g. HBase, MongoDB default, Zookeeper) vs **AP** (Cassandra, DynamoDB, CouchDB). **PACELC** extends it: else (no partition) choose Latency vs Consistency.

        ## BASE
        **B**asically **A**vailable, **S**oft state, **E**ventually consistent.

        ## Scaling a database
        - **Vertical scaling** — bigger machine. **Horizontal scaling** — more machines.
        - **Replication** — master-slave (primary-replica): writes to primary, reads from replicas; multi-master.
        - **Sharding / partitioning** — split data across machines by key (range, hash, directory). Problems: cross-shard joins, rebalancing, hotspots → consistent hashing.
        - **Partitioning types**: horizontal (rows) vs vertical (columns).
        - Caching (Redis) in front of the DB; connection pooling; read replicas.
      `,
      keyPoints: [
        'SQL: fixed schema, ACID, joins, vertical scaling. NoSQL: flexible schema, horizontal scaling, often eventual consistency.',
        'NoSQL types: key-value (Redis), document (MongoDB), wide-column (Cassandra), graph (Neo4j).',
        'CAP: during a partition choose Consistency or Availability (CP vs AP).',
        'BASE = Basically Available, Soft state, Eventually consistent.',
        'Replication scales reads; sharding scales writes and storage.',
        'Sharding issues: cross-shard joins, rebalancing, hotspots (use consistent hashing).'
      ]
    }
  ],
  flashcards: [
    { q: 'What does ACID stand for?', a: 'Atomicity, Consistency, Isolation, Durability.' },
    { q: 'Primary key vs unique key?', a: 'Primary: unique + NOT NULL, one per table, often clustered. Unique: unique values but allows NULL(s), many per table.' },
    { q: 'Super key vs candidate key?', a: 'Super key: any attribute set that uniquely identifies rows. Candidate key: a minimal super key.' },
    { q: 'Define 2NF.', a: '1NF and no partial dependency — every non-prime attribute depends on the whole of every candidate key.' },
    { q: 'Define 3NF.', a: '2NF and no transitive dependency: for each non-trivial X → A, X is a super key or A is a prime attribute.' },
    { q: 'Define BCNF.', a: 'For every non-trivial FD X → A, X must be a super key. Stricter than 3NF.' },
    { q: 'What anomalies does normalization remove?', a: 'Insertion, update and deletion anomalies caused by redundancy.' },
    { q: 'WHERE vs HAVING?', a: 'WHERE filters rows before grouping (no aggregates). HAVING filters groups after GROUP BY (can use aggregates).' },
    { q: 'DELETE vs TRUNCATE vs DROP?', a: 'DELETE: DML, row-wise with WHERE, can roll back. TRUNCATE: DDL, removes all rows fast, keeps structure. DROP: removes table and structure.' },
    { q: 'RANK vs DENSE_RANK vs ROW_NUMBER for 100,100,90?', a: 'RANK: 1,1,3. DENSE_RANK: 1,1,2. ROW_NUMBER: 1,2,3.' },
    { q: 'SQL query for the second highest salary?', a: '`SELECT MAX(salary) FROM emp WHERE salary < (SELECT MAX(salary) FROM emp);`' },
    { q: 'Dirty read vs non-repeatable read vs phantom read?', a: 'Dirty: reading uncommitted data. Non-repeatable: same row returns different values. Phantom: re-running a query returns new rows.' },
    { q: 'Isolation levels from weakest to strongest?', a: 'Read Uncommitted → Read Committed → Repeatable Read → Serializable.' },
    { q: 'What is two-phase locking?', a: 'Each txn acquires all locks in a growing phase and releases in a shrinking phase (never acquires after releasing). Guarantees conflict serializability; may deadlock.' },
    { q: 'How do you test conflict serializability?', a: 'Draw a precedence graph (Ti → Tj if Ti’s op conflicts with and precedes Tj’s). Acyclic ⇒ conflict serializable.' },
    { q: 'Clustered vs non-clustered index?', a: 'Clustered: table rows physically ordered by the key, one per table. Non-clustered: separate structure pointing to rows, many allowed.' },
    { q: 'Why B+ trees for indexes?', a: 'High fan-out ⇒ shallow tree ⇒ few disk I/Os; all data in linked leaves ⇒ efficient range scans.' },
    { q: 'Leftmost prefix rule?', a: 'A composite index (a, b, c) can serve queries filtering on a, (a,b) or (a,b,c) — not on b or c alone.' },
    { q: 'CAP theorem?', a: 'In a network partition, a distributed system must choose between Consistency and Availability (CP or AP).' },
    { q: 'SQL vs NoSQL — when to choose NoSQL?', a: 'Massive scale/high write throughput, flexible or evolving schema, simple access patterns, horizontal scaling needs.' },
    { q: 'What is a view?', a: 'A virtual table defined by a stored query; no data stored (unless materialized). Used for security and simplicity.' },
    { q: 'What is a trigger?', a: 'A stored procedure that runs automatically on INSERT/UPDATE/DELETE events on a table.' },
    { q: 'What is denormalization?', a: 'Deliberately adding redundancy to reduce joins and speed up reads, at the cost of write complexity.' },
    { q: 'Lossless join decomposition condition?', a: 'The common attributes of the two relations must form a super key of at least one of them.' }
  ],
  quiz: [
    { q: 'Which command is DDL?', options: ['DELETE', 'UPDATE', 'TRUNCATE', 'SELECT'], answer: 2, explain: 'TRUNCATE is DDL; DELETE/UPDATE are DML.', topic: 'intro' },
    { q: 'A minimal super key is called:', options: ['Primary key', 'Candidate key', 'Foreign key', 'Composite key'], answer: 1, explain: 'Candidate keys are minimal super keys; one is chosen as primary.', topic: 'er-keys' },
    { q: 'An M:N relationship is mapped to tables by:', options: ['FK in either table', 'A separate junction table', 'Merging both tables', 'A view'], answer: 1, explain: 'Junction table with both PKs.', topic: 'er-keys' },
    { q: 'R(A,B,C) with key A and FD B → C. R is in:', options: ['1NF only', '2NF but not 3NF', '3NF', 'BCNF'], answer: 1, explain: 'No partial dependency (single-attribute key) but B → C is transitive.', topic: 'normalization' },
    { q: 'Which normal form requires every determinant to be a super key?', options: ['2NF', '3NF', 'BCNF', '1NF'], answer: 2, explain: 'BCNF.', topic: 'normalization' },
    { q: 'Which clause filters after aggregation?', options: ['WHERE', 'HAVING', 'ORDER BY', 'FROM'], answer: 1, explain: 'HAVING works on groups.', topic: 'sql' },
    { q: 'DENSE_RANK on salaries 500, 500, 400 gives:', options: ['1,2,3', '1,1,3', '1,1,2', '1,2,2'], answer: 2, explain: 'Dense rank has no gaps.', topic: 'sql' },
    { q: 'Which returns all rows from the left table even without matches?', options: ['INNER JOIN', 'LEFT JOIN', 'CROSS JOIN', 'NATURAL JOIN'], answer: 1, explain: 'Unmatched right columns are NULL.', topic: 'sql' },
    { q: '`SELECT COUNT(col)` counts:', options: ['All rows', 'Non-NULL values of col', 'Distinct values', 'NULL values'], answer: 1, explain: 'COUNT(col) ignores NULLs.', topic: 'sql' },
    { q: 'Reading data written by an uncommitted transaction is a:', options: ['Phantom read', 'Dirty read', 'Lost update', 'Non-repeatable read'], answer: 1, explain: 'Dirty read.', topic: 'transactions' },
    { q: 'Which isolation level prevents dirty, non-repeatable and phantom reads?', options: ['Read Committed', 'Repeatable Read', 'Serializable', 'Read Uncommitted'], answer: 2, explain: 'Serializable.', topic: 'transactions' },
    { q: 'Which property is ensured by write-ahead logging after a crash?', options: ['Isolation', 'Durability (and atomicity)', 'Consistency', 'Normalization'], answer: 1, explain: 'Logs allow redo of committed and undo of uncommitted work.', topic: 'transactions' },
    { q: 'A schedule is conflict serializable if its precedence graph is:', options: ['Connected', 'Acyclic', 'Complete', 'Bipartite'], answer: 1, explain: 'No cycles ⇒ equivalent serial order exists.', topic: 'transactions' },
    { q: 'How many clustered indexes can a table have?', options: ['0', '1', '2', 'Unlimited'], answer: 1, explain: 'Rows can be physically ordered in only one way.', topic: 'indexing' },
    { q: 'Index on (city, age). Which query can use it efficiently?', options: ['WHERE age = 25', "WHERE city = 'Pune'", 'WHERE age > 20', 'None'], answer: 1, explain: 'Leftmost prefix rule.', topic: 'indexing' },
    { q: 'Cassandra is best described as:', options: ['CP document store', 'AP wide-column store', 'Graph DB', 'Relational DB'], answer: 1, explain: 'Cassandra favours availability and partition tolerance.', topic: 'nosql' }
  ]
});
