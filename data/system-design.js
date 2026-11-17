window.SUBJECTS = window.SUBJECTS || [];
window.SUBJECTS.push({
  id: 'sd', title: 'System Design', short: 'System Design', icon: '🏗️', color: '#8b5cf6', group: 'core',
  desc: 'Scalability fundamentals, caching, load balancing, databases at scale, messaging, APIs, and step-by-step designs of classic systems.',
  intro: `
    > 💡 Freshers usually get **basic HLD** (URL shortener, rate limiter, chat) or **LLD** (parking lot) questions. Focus on clear reasoning and trade-offs, not buzzwords.
  `,
  topics: [
    {
      id: 'fundamentals', title: 'Scalability Fundamentals',
      content: `
        ## Key qualities
        | Term | Meaning |
        |---|---|
        | **Scalability** | handle growing load by adding resources |
        | **Availability** | % of time the system is up (99.9% ≈ 8.76 h downtime/year; 99.99% ≈ 52 min) |
        | **Reliability** | works correctly over time, tolerates faults |
        | **Latency** | time for one request; **Throughput**: requests per second |
        | **Consistency** | all clients see the same data |
        | **Fault tolerance** | keeps working when components fail (redundancy, replication) |

        ## Vertical vs horizontal scaling
        | Vertical (scale up) | Horizontal (scale out) |
        |---|---|
        | bigger machine (CPU/RAM) | more machines |
        | simple, no code change | needs load balancing, stateless services |
        | hardware limit, single point of failure | near-unlimited, fault tolerant |

        ## Stateless services
        Keep application servers **stateless** (store sessions in Redis/DB or use JWT) so any server can handle any request → easy horizontal scaling.

        ## Latency numbers every engineer should know (approx.)
        | Operation | Time |
        |---|---|
        | L1 cache reference | 1 ns |
        | Main memory reference | 100 ns |
        | Read 1 MB sequentially from memory | ~10 µs |
        | SSD random read | ~100 µs |
        | Round trip within same datacenter | ~0.5 ms |
        | Read 1 MB from disk (HDD) | ~5–20 ms |
        | Round trip India ↔ US | ~150–250 ms |

        ## Back-of-the-envelope estimation
        - 1 day ≈ 86,400 s ≈ **10⁵ s**.
        - 100M daily active users × 10 requests/day = 10⁹/day ≈ **~12k QPS** average; peak ≈ 2–3× average.
        - Storage: 1M new items/day × 1 KB = 1 GB/day ≈ 365 GB/year.
        - Powers: 2¹⁰ ≈ 1 thousand (KB), 2²⁰ ≈ 1 million (MB), 2³⁰ ≈ 1 billion (GB), 2⁴⁰ ≈ 1 trillion (TB).

        ## Consistency models
        **Strong** (read sees latest write), **eventual** (replicas converge over time), **causal**, **read-your-writes**. Tied to the **CAP theorem** (choose C or A during partitions).
      `,
      keyPoints: [
        'Vertical = bigger machine (limit, SPOF); horizontal = more machines (needs LB, stateless services).',
        'Keep app servers stateless; store sessions in Redis/DB or use JWT.',
        '99.9% availability ≈ 8.76 h downtime/year; 99.99% ≈ 52 min.',
        '1 day ≈ 10⁵ seconds — 1M requests/day ≈ 12 QPS.',
        'Memory ~100 ns, SSD ~100 µs, same-DC round trip ~0.5 ms, cross-continent ~150 ms.',
        'Strong vs eventual consistency; CAP forces a choice during partitions.'
      ]
    },
    {
      id: 'building-blocks', title: 'Building Blocks: LB, Cache, CDN, Proxy',
      content: `
        ## Load balancer
        Distributes requests across servers; enables horizontal scaling and failover (health checks).
        - **Algorithms:** round robin, weighted round robin, least connections, least response time, IP hash (sticky sessions), **consistent hashing**.
        - **L4** (transport — IP/port, fast) vs **L7** (application — routes by URL, headers, cookies).
        - Examples: Nginx, HAProxy, AWS ELB/ALB. Avoid the LB being a single point of failure → active-passive pair.

        ## Caching ⭐
        Store frequently read data in fast storage (memory) to cut latency and DB load.
        **Where:** browser → CDN → reverse proxy → application (Redis/Memcached) → database buffer.

        ### Caching strategies
        | Strategy | How | Trade-off |
        |---|---|---|
        | **Cache-aside (lazy loading)** | app checks cache; on miss reads DB and fills cache | most common; first read is slow, possible stale data |
        | **Read-through** | cache itself loads from DB on miss | simpler app code |
        | **Write-through** | write to cache and DB together | consistent, slower writes |
        | **Write-back (write-behind)** | write to cache, flush to DB later | fast writes, risk of data loss |
        | **Write-around** | write directly to DB, skip cache | avoids polluting cache with rarely-read data |

        ### Eviction policies
        **LRU** (most common), LFU, FIFO, TTL-based expiry.

        ### Cache problems
        - **Cache invalidation** — "one of the two hard things in CS". Use TTLs, delete-on-write.
        - **Thundering herd / cache stampede** — many requests miss simultaneously → locks, request coalescing, early refresh.
        - **Cache penetration** — requests for non-existent keys → cache nulls, Bloom filter.
        - **Hot keys** — replicate key, local caches.

        ## CDN (Content Delivery Network)
        Edge servers cache static assets (images, JS, video) near users. **Push** CDN (you upload) vs **pull** CDN (fetches from origin on first request). Examples: Cloudflare, Akamai, CloudFront.

        ## Proxies
        - **Forward proxy** — sits in front of **clients** (hides client, filtering, VPN-like).
        - **Reverse proxy** — sits in front of **servers** (load balancing, SSL termination, caching, compression, security) — Nginx.

        ## API Gateway
        Single entry point for microservices: routing, authentication, rate limiting, request aggregation, logging.

        ## Consistent hashing
        Map servers and keys onto a hash ring; each key goes to the next server clockwise. Adding/removing a server moves only **~K/N keys** instead of reshuffling everything. **Virtual nodes** smooth out uneven distribution. Used by DynamoDB, Cassandra, CDNs, distributed caches.
      `,
      keyPoints: [
        'Load balancer algorithms: round robin, least connections, IP hash, consistent hashing; L4 vs L7.',
        'Cache-aside is the most common caching pattern.',
        'Write-through = consistent but slower writes; write-back = fast but risk of loss.',
        'LRU is the default eviction policy.',
        'Cache stampede: use locks/coalescing; cache penetration: cache nulls or Bloom filter.',
        'Reverse proxy fronts servers (LB, SSL termination); forward proxy fronts clients.',
        'Consistent hashing moves only ~K/N keys when nodes change; virtual nodes balance load.'
      ]
    },
    {
      id: 'data-messaging', title: 'Databases at Scale & Messaging',
      content: `
        ## Choosing a database
        - Structured data, relations, transactions → **SQL** (PostgreSQL, MySQL).
        - Massive writes, simple access by key → **wide-column / key-value** (Cassandra, DynamoDB).
        - Flexible JSON documents → **MongoDB**.
        - Relationships/graphs → **Neo4j**. Search → **Elasticsearch**. Embeddings → **vector DB**.
        - Blobs (images, videos) → **object storage** (S3) + store the URL in DB.

        ## Replication
        - **Leader–follower (master–slave)**: writes go to leader, reads scale via followers. **Replication lag** → read-your-writes issues.
        - **Multi-leader**: writes in multiple regions; needs conflict resolution.
        - **Leaderless** (Dynamo-style): quorum reads/writes, **R + W > N** for consistency.
        - Synchronous (safe, slow) vs asynchronous (fast, possible loss).

        ## Sharding (partitioning)
        - **Range-based** (A–M, N–Z): easy range queries, risk of hotspots.
        - **Hash-based**: even distribution, no range queries; use consistent hashing.
        - **Directory/lookup-based**: flexible, lookup service is a dependency.
        - Choose a **shard key** with high cardinality and even access (user_id, not country).
        - Challenges: cross-shard joins/transactions, resharding, celebrity (hot) keys.

        ## Indexes, denormalisation & CQRS
        Read-heavy systems denormalise; **CQRS** separates the write model from read models.

        ## Message queues & async processing
        Decouple producers from consumers; absorb traffic spikes; retry failed work.
        - **Queue (point-to-point)**: each message processed by one consumer — RabbitMQ, SQS.
        - **Pub/Sub / log**: many consumer groups read the same stream — **Kafka** (partitions, offsets, retention, ordering within a partition).
        - Delivery semantics: **at-most-once**, **at-least-once** (most common → make consumers **idempotent**), **exactly-once** (hard).
        - Patterns: background jobs (email, thumbnails), event-driven architecture, fan-out, **dead-letter queue** for poison messages.

        ## Monolith vs microservices
        | Monolith | Microservices |
        |---|---|
        | one deployable unit | many small independently deployable services |
        | simple to develop/test/deploy at first | independent scaling & tech choices, team autonomy |
        | scaling = whole app | network calls, distributed transactions (Saga), observability complexity |

        ## Reliability patterns
        Rate limiting, **circuit breaker** (stop calling a failing service), retries with **exponential backoff + jitter**, timeouts, bulkheads, health checks, graceful degradation, idempotency keys.

        ## Observability
        Logs, metrics (Prometheus), traces (OpenTelemetry), alerts; SLIs/SLOs/SLAs.
      `,
      keyPoints: [
        'Replication scales reads and adds redundancy; sharding scales writes/storage.',
        'Leader–follower replication suffers replication lag; quorum R + W > N gives consistency.',
        'Pick a high-cardinality, evenly-accessed shard key.',
        'Queues decouple services and absorb spikes; Kafka = partitioned durable log.',
        'At-least-once delivery ⇒ consumers must be idempotent.',
        'Microservices: independent deploy/scale but network & distributed-data complexity.',
        'Circuit breaker, retries with exponential backoff + jitter, timeouts, rate limiting.',
        'Store large files in object storage (S3), keep URLs/metadata in the DB.'
      ]
    },
    {
      id: 'api-design', title: 'API Design & Communication',
      content: `
        ## REST principles
        Resources identified by URLs (nouns), HTTP verbs as actions, stateless, cacheable, uniform interface.
        ~~~text
        GET    /users/42           read user
        POST   /users              create user
        PUT    /users/42           replace user
        PATCH  /users/42           partial update
        DELETE /users/42           delete
        GET    /users/42/orders?status=paid&limit=20&cursor=abc   nested + filter + pagination
        ~~~
        - Version APIs (\`/v1/\`), use proper status codes, consistent error format.
        - **Pagination**: offset/limit (simple, slow at depth) vs **cursor-based** (stable, fast).
        - **Idempotency keys** for safe retries of POST (payments).

        ## REST vs GraphQL vs gRPC
        | | REST | GraphQL | gRPC |
        |---|---|---|---|
        | Format | JSON over HTTP | single endpoint, client specifies fields | Protocol Buffers over HTTP/2 |
        | Strength | simple, cacheable, universal | no over/under-fetching | very fast, streaming, typed contracts |
        | Use | public APIs | complex front-ends | internal microservice calls |

        ## Real-time communication
        | Technique | How | Use |
        |---|---|---|
        | Short polling | client asks every N seconds | simple, wasteful |
        | Long polling | server holds request until data arrives | fallback |
        | **WebSockets** | full-duplex persistent connection | chat, games, collaboration |
        | Server-Sent Events | server → client one-way stream | notifications, live feeds, LLM token streaming |

        ## Authentication & authorization
        - **Authentication** = who you are; **authorization** = what you can do.
        - Session cookies vs **JWT** (header.payload.signature — stateless, hard to revoke → short expiry + refresh tokens).
        - **OAuth 2.0** (delegated authorization — "Login with Google") + **OpenID Connect** (identity layer).
        - Store passwords with **bcrypt/argon2** (salted, slow hash), never plain or MD5.

        ## Rate limiting algorithms
        | Algorithm | Idea |
        |---|---|
        | **Token bucket** | tokens refill at rate r; a request consumes a token; allows bursts — most popular |
        | Leaky bucket | queue drains at fixed rate; smooths traffic |
        | Fixed window counter | count per minute; burst at window edges |
        | Sliding window log / counter | accurate, more memory |
        Implemented at the API gateway, typically with Redis counters. Return **429 Too Many Requests**.
      `,
      keyPoints: [
        'REST: nouns in URLs, HTTP verbs, stateless, proper status codes, versioning.',
        'Cursor-based pagination beats offset for large/changing datasets.',
        'Idempotency keys make retried POSTs safe.',
        'gRPC = Protobuf over HTTP/2, fast internal calls; GraphQL avoids over/under-fetching.',
        'WebSockets = bidirectional real-time; SSE = server → client stream.',
        'AuthN = identity, AuthZ = permissions; JWT is stateless but hard to revoke.',
        'Token bucket is the most common rate-limiting algorithm; respond 429.',
        'Hash passwords with bcrypt/argon2 + salt.'
      ]
    },
    {
      id: 'case-studies', title: 'Classic Design Problems',
      content: `
        ## The framework (use for every question)
        1. **Clarify requirements** — functional (features) & non-functional (scale, latency, availability, consistency). (~5 min)
        2. **Estimate** — users, QPS, storage, bandwidth.
        3. **API design** — main endpoints.
        4. **Data model** — entities, SQL vs NoSQL.
        5. **High-level design** — boxes: clients, LB, services, cache, DB, queue, CDN.
        6. **Deep dive** — bottlenecks, scaling, trade-offs, failure handling.

        ---
        ## 1. URL shortener (TinyURL / bit.ly)
        - **Requirements:** shorten URL, redirect, optional custom alias & expiry. Read-heavy (100:1).
        - **Estimate:** 100M new URLs/month → ~40 writes/s, ~4k redirects/s.
        - **Key generation:** base62 encoding \`[a-zA-Z0-9]\` — 7 characters → 62⁷ ≈ 3.5 trillion keys.
          - Option A: auto-increment ID (or distributed ID like **Snowflake**) → base62 encode. Predictable but unique.
          - Option B: hash (MD5) of URL, take 7 chars — handle collisions.
          - Option C: pre-generated **key generation service** hands out unused keys.
        - **Storage:** key-value store (short → long, created_at, expiry).
        - **Redirect:** \`301\` (permanent, cached by browser — less analytics) vs \`302\` (temporary — every hit reaches you, good for analytics).
        - **Scale:** cache hot URLs in Redis (LRU), DB replicas, shard by key.

        ## 2. Rate limiter
        Token bucket per user/IP stored in Redis (\`INCR\` + \`EXPIRE\` or a Lua script for atomicity); place in API gateway; return 429 with \`Retry-After\`.

        ## 3. Chat application (WhatsApp)
        - **WebSocket** connections to chat servers; a **session service** maps user → server.
        - Message flow: sender → chat server → persist (Cassandra/HBase — write heavy, partition by conversation_id) → push to recipient's server via a message queue → deliver; if offline, store & push notification.
        - Delivery receipts (sent ✓, delivered ✓✓, read), ordering per conversation (sequence numbers), presence via heartbeats, group fan-out, end-to-end encryption.

        ## 4. News feed (Twitter/Instagram)
        - **Fan-out on write (push)**: on post, write to followers' feed caches — fast reads, expensive for celebrities.
        - **Fan-out on read (pull)**: build feed when requested — slower reads.
        - **Hybrid**: push for normal users, pull for celebrities. Feed cached in Redis; media on CDN; ranking service.

        ## 5. Others to practise
        Notification system · Distributed cache · Web crawler (BFS frontier, politeness, dedupe with Bloom filter) · Typeahead/autocomplete (trie + top-k cache) · YouTube/Netflix (upload → transcode queue → multiple resolutions → CDN, adaptive bitrate streaming) · Uber (geohash/quadtree for nearby drivers) · Parking lot (LLD) · BookMyShow (seat locking with TTL to prevent double booking) · Payment system (idempotency, ledger, exactly-once).

        > 🎯 Interviewers grade **trade-off discussion**: always say *why* (e.g. "Cassandra because writes are 10× reads and we only query by conversation ID").
      `,
      keyPoints: [
        'Framework: requirements → estimates → API → data model → high-level design → deep dive.',
        'URL shortener: base62 with 7 chars ≈ 3.5 trillion keys; ID + base62 or key-generation service.',
        '301 is cached by browsers (less analytics); 302 hits the server every time.',
        'Chat: WebSockets + session registry + write-optimised store + queue for offline delivery.',
        'News feed: fan-out on write for normal users, on read for celebrities (hybrid).',
        'Always justify each component choice with a trade-off.'
      ]
    }
  ],
  flashcards: [
    { q: 'Vertical vs horizontal scaling?', a: 'Vertical: add resources to one machine (simple, limited, SPOF). Horizontal: add more machines (needs LB & stateless design, scales further, fault tolerant).' },
    { q: 'What is consistent hashing?', a: 'Placing nodes and keys on a hash ring so a key maps to the next node clockwise; adding/removing a node remaps only ~K/N keys. Virtual nodes balance load.' },
    { q: 'Cache-aside pattern?', a: 'App reads cache; on miss reads DB and writes the result to cache. On update, write DB and invalidate cache.' },
    { q: 'Write-through vs write-back cache?', a: 'Write-through: write cache and DB synchronously (consistent, slower). Write-back: write cache, persist later (fast, risk of loss).' },
    { q: 'What is a cache stampede and how to avoid it?', a: 'Many requests miss the same expired key at once and hammer the DB. Use locks/single-flight, staggered TTLs, early refresh.' },
    { q: 'Forward vs reverse proxy?', a: 'Forward proxy acts for clients (hides them). Reverse proxy acts for servers (LB, SSL termination, caching).' },
    { q: 'L4 vs L7 load balancer?', a: 'L4 routes on IP/port (fast, protocol agnostic). L7 routes on HTTP content (URL, headers, cookies).' },
    { q: 'What is a CDN and push vs pull?', a: 'Edge servers caching static content near users. Push: you upload content. Pull: CDN fetches from origin on first request.' },
    { q: 'Sharding vs replication?', a: 'Sharding splits data across nodes (scales writes/storage). Replication copies data (scales reads, availability).' },
    { q: 'Why use a message queue?', a: 'Decoupling, async processing, buffering traffic spikes, retries, fan-out to multiple consumers.' },
    { q: 'At-least-once delivery implication?', a: 'Messages may be processed more than once ⇒ consumers must be idempotent.' },
    { q: 'What is a circuit breaker?', a: 'Stops calling a failing dependency after errors cross a threshold (open state), retries after a cool-down (half-open), restoring when healthy.' },
    { q: 'Token bucket algorithm?', a: 'Bucket holds up to B tokens refilled at rate r; each request takes one token; empty bucket ⇒ reject (429). Allows short bursts.' },
    { q: 'REST vs gRPC?', a: 'REST: JSON over HTTP, human-readable, public APIs. gRPC: Protobuf over HTTP/2, fast, streaming, typed — internal services.' },
    { q: 'Polling vs WebSockets vs SSE?', a: 'Polling: repeated requests. WebSockets: full-duplex persistent channel. SSE: one-way server→client stream over HTTP.' },
    { q: 'How many unique keys with 7 base62 characters?', a: '62⁷ ≈ 3.5 trillion.' },
    { q: 'Fan-out on write vs fan-out on read?', a: 'Write: push post to all followers’ feeds at post time (fast reads). Read: assemble feed when requested (cheap writes). Hybrid for celebrities.' },
    { q: 'Monolith vs microservices?', a: 'Monolith: single deployable, simpler initially. Microservices: independent services, independent scaling and deploys, but network & data consistency complexity.' },
    { q: 'What is the Saga pattern?', a: 'Managing a distributed transaction as a sequence of local transactions with compensating actions on failure.' },
    { q: 'What is CQRS?', a: 'Command Query Responsibility Segregation — separate models (often stores) for writes and reads.' }
  ],
  quiz: [
    { q: 'Which strategy writes to cache and DB at the same time?', options: ['Write-back', 'Write-through', 'Write-around', 'Cache-aside'], answer: 1, explain: 'Write-through keeps cache and DB consistent.', topic: 'building-blocks' },
    { q: 'Adding a node in consistent hashing remaps roughly:', options: ['All keys', 'Half the keys', 'K/N keys', 'No keys'], answer: 2, explain: 'Only the keys in the new node’s arc move.', topic: 'building-blocks' },
    { q: 'SSL termination is typically done at the:', options: ['Database', 'Reverse proxy / load balancer', 'Client', 'Message queue'], answer: 1, explain: 'Reverse proxies offload TLS from app servers.', topic: 'building-blocks' },
    { q: 'Read-heavy app with a single DB is slow. First scaling step?', options: ['Shard immediately', 'Add a cache and read replicas', 'Switch to microservices', 'Use a bigger CDN'], answer: 1, explain: 'Caching + replicas address read load cheaply.', topic: 'data-messaging' },
    { q: 'For quorum consistency with N replicas you need:', options: ['R + W > N', 'R + W = N', 'R = W = 1', 'R > N'], answer: 0, explain: 'Read and write sets must overlap.', topic: 'data-messaging' },
    { q: 'Kafka guarantees message ordering:', options: ['Globally', 'Within a partition', 'Never', 'Within a consumer group only'], answer: 1, explain: 'Ordering is per partition.', topic: 'data-messaging' },
    { q: 'Best real-time technique for a two-way chat?', options: ['Short polling', 'WebSockets', 'Cron jobs', 'Email'], answer: 1, explain: 'Full-duplex persistent connection.', topic: 'api-design' },
    { q: 'Which HTTP status indicates rate limiting?', options: ['403', '404', '429', '503'], answer: 2, explain: '429 Too Many Requests.', topic: 'api-design' },
    { q: 'URL shortener wanting click analytics should redirect with:', options: ['301', '302', '200', '404'], answer: 1, explain: '302 is not permanently cached, so every click reaches your server.', topic: 'case-studies' },
    { q: 'For a celebrity with 50M followers, a news feed should use:', options: ['Fan-out on write', 'Fan-out on read (pull)', 'No caching', 'A single SQL join'], answer: 1, explain: 'Pushing to 50M feeds per post is too expensive; hybrid pulls celebrity posts at read time.', topic: 'case-studies' }
  ]
});
