window.SUBJECTS = window.SUBJECTS || [];
window.SUBJECTS.push({
  id: 'cn', title: 'Computer Networks', short: 'CN', icon: '🌐', color: '#ec4899', group: 'core',
  desc: 'OSI & TCP/IP models, IP addressing & subnetting, TCP vs UDP, routing, DNS/HTTP/HTTPS, and the famous "what happens when you type a URL".',
  topics: [
    {
      id: 'models', title: 'OSI & TCP/IP Models',
      content: `
        ## OSI model (7 layers)
        Mnemonic (top → bottom): **A**ll **P**eople **S**eem **T**o **N**eed **D**ata **P**rocessing.

        | # | Layer | Job | PDU | Protocols / devices |
        |---|---|---|---|---|
        | 7 | Application | services to user apps | data | HTTP, HTTPS, FTP, SMTP, DNS, SSH |
        | 6 | Presentation | translation, encryption, compression | data | TLS/SSL, JPEG, ASCII |
        | 5 | Session | establish/maintain/terminate sessions | data | RPC, NetBIOS, sockets API |
        | 4 | Transport | process-to-process delivery, reliability, flow control, ports | **segment** (TCP) / datagram (UDP) | TCP, UDP |
        | 3 | Network | logical addressing (IP), routing | **packet** | IP, ICMP, ARP*, OSPF · **router** |
        | 2 | Data link | framing, MAC addressing, error detection, access control | **frame** | Ethernet, Wi-Fi, PPP · **switch**, bridge |
        | 1 | Physical | bits over medium | **bits** | cables, fibre · **hub**, repeater |
        *ARP is often placed between layers 2 and 3.

        ## TCP/IP model (practical)
        | TCP/IP layer | OSI equivalent |
        |---|---|
        | Application | Application + Presentation + Session |
        | Transport | Transport |
        | Internet | Network |
        | Network access (link) | Data link + Physical |

        **Encapsulation:** each layer adds its header going down (data → segment → packet → frame → bits); **decapsulation** removes them going up.

        ## Devices
        | Device | Layer | Notes |
        |---|---|---|
        | Hub | 1 | broadcasts to all ports; one collision domain |
        | Repeater | 1 | regenerates signal |
        | Switch | 2 | forwards by MAC table; each port = own collision domain |
        | Bridge | 2 | connects two LAN segments |
        | Router | 3 | forwards by IP; separates broadcast domains |
        | Gateway | all | protocol conversion between networks |

        ## Network topologies
        Bus, star (most common LAN), ring, mesh (n(n−1)/2 links, highly reliable), tree, hybrid.
        Types by size: PAN < LAN < MAN < WAN.

        ## Transmission modes
        Simplex (keyboard → CPU), half-duplex (walkie-talkie), full-duplex (phone).
      `,
      keyPoints: [
        'OSI: Physical, Data link, Network, Transport, Session, Presentation, Application ("All People Seem To Need Data Processing" top→down).',
        'PDUs: bits → frame (L2) → packet (L3) → segment (L4) → data.',
        'Hub = L1, Switch = L2 (MAC), Router = L3 (IP).',
        'TCP/IP: Application, Transport, Internet, Network access.',
        'Switch breaks collision domains; router breaks broadcast domains.',
        'Full mesh with n nodes needs n(n−1)/2 links.'
      ]
    },
    {
      id: 'ip-subnet', title: 'IP Addressing & Subnetting',
      content: `
        ## IPv4
        32 bits, written as 4 octets: \`192.168.1.10\`. Two parts: **network ID + host ID**.

        ### Classful addressing (legacy, still asked)
        | Class | First octet | Default mask | Networks / hosts |
        |---|---|---|---|
        | A | 1–126 | /8 (255.0.0.0) | 126 nets, 2²⁴−2 hosts |
        | B | 128–191 | /16 | 2¹⁴ nets, 2¹⁶−2 hosts |
        | C | 192–223 | /24 | 2²¹ nets, 254 hosts |
        | D | 224–239 | — | multicast |
        | E | 240–255 | — | experimental |
        127.x.x.x is **loopback** (localhost).

        ### Private ranges (RFC 1918)
        \`10.0.0.0/8\`, \`172.16.0.0/12\`, \`192.168.0.0/16\` — not routable on the internet; translated by **NAT**.

        ## CIDR & subnetting
        CIDR notation \`/n\` = number of network bits. Hosts per subnet = **2^(32−n) − 2** (minus network & broadcast addresses).

        ### Worked example: 192.168.10.0/26
        - Mask: 255.255.255.**192** → block size = 256 − 192 = **64**
        - Subnets: .0, .64, .128, .192 (4 subnets from a /24)
        - First subnet: network 192.168.10.0, hosts .1–.62, broadcast .63 → **62 usable hosts**

        ### Which subnet does 172.16.45.200/20 belong to?
        /20 → third octet mask = 240 → block size 16 → 45 lies in 32–47 → network **172.16.32.0**, broadcast **172.16.47.255**.

        | CIDR | Mask | Hosts |
        |---|---|---|
        | /24 | 255.255.255.0 | 254 |
        | /25 | .128 | 126 |
        | /26 | .192 | 62 |
        | /27 | .224 | 30 |
        | /28 | .240 | 14 |
        | /30 | .252 | 2 (point-to-point links) |

        **Supernetting / route aggregation** combines contiguous networks into one bigger prefix.

        ## IPv6
        128 bits, hex, e.g. \`2001:db8::1\`. Huge address space, no NAT needed, simplified header, built-in IPsec support, no broadcast (uses multicast/anycast), auto-configuration (SLAAC).

        ## Related protocols
        - **ARP** — IP → MAC address (broadcast request, unicast reply). **RARP** — MAC → IP (obsolete).
        - **DHCP** — automatically assigns IP, mask, gateway, DNS. Steps **DORA**: Discover, Offer, Request, Acknowledge (UDP 67/68).
        - **NAT** — maps private IPs to a public IP (PAT uses ports) — conserves IPv4 addresses.
        - **ICMP** — error & diagnostic messages; used by \`ping\` (echo request/reply) and \`traceroute\` (TTL expiry).
      `,
      keyPoints: [
        'IPv4 = 32 bits; IPv6 = 128 bits.',
        'Usable hosts = 2^(32−prefix) − 2.',
        'Block size = 256 − mask octet value (e.g. /26 → 64).',
        'Private ranges: 10/8, 172.16/12, 192.168/16; 127.0.0.1 is loopback.',
        'Class A 1–126, B 128–191, C 192–223, D multicast, E reserved.',
        'ARP: IP → MAC. DHCP: DORA (Discover, Offer, Request, Ack).',
        'NAT maps private addresses to a public one.',
        'ping uses ICMP echo; traceroute uses increasing TTL.'
      ]
    },
    {
      id: 'transport', title: 'Transport Layer: TCP & UDP',
      content: `
        ## TCP vs UDP
        | TCP | UDP |
        |---|---|
        | connection-oriented (handshake) | connectionless |
        | reliable: ACKs, retransmission, ordering | best-effort, may lose/reorder |
        | flow & congestion control | none |
        | 20–60 byte header | 8 byte header |
        | slower, heavier | fast, lightweight |
        | byte stream | message (datagram) |
        | HTTP/1.1, HTTP/2, SMTP, FTP, SSH | DNS, DHCP, VoIP, video streaming, online games, **QUIC (HTTP/3)** |

        ## 3-way handshake (connection setup)
        1. Client → **SYN** (seq = x)
        2. Server → **SYN-ACK** (seq = y, ack = x+1)
        3. Client → **ACK** (ack = y+1)
        Why 3, not 2? To confirm both sides' initial sequence numbers and avoid old duplicate connections.

        ## Connection termination (4-way)
        FIN → ACK → FIN → ACK. The side that closes first enters **TIME_WAIT** (2 × MSL) so delayed packets die out.

        ## Reliability mechanisms
        - Sequence numbers + cumulative **ACKs**; retransmission on timeout or **3 duplicate ACKs** (fast retransmit).
        - **Checksum** for error detection.
        - **Flow control** — receiver advertises a **window** (rwnd) so the sender doesn't overwhelm it (sliding window).
        - **ARQ protocols**: Stop-and-wait, **Go-Back-N** (resend everything after the lost frame; window ≤ 2ⁿ−1), **Selective Repeat** (resend only lost; window ≤ 2ⁿ⁻¹).

        ## Congestion control
        Protects the **network** (flow control protects the receiver).
        - **Slow start**: cwnd starts at 1 MSS and **doubles** every RTT until ssthresh.
        - **Congestion avoidance**: then grows **linearly** (+1 MSS per RTT) — AIMD.
        - On timeout: ssthresh = cwnd/2, cwnd = 1 (Tahoe). On 3 dup ACKs: **fast recovery**, cwnd = ssthresh (Reno).
        - Modern: CUBIC (Linux default), BBR (Google).

        ## Ports
        16-bit numbers identify processes: well-known 0–1023, registered 1024–49151, dynamic/ephemeral 49152–65535. A **socket** = IP + port; a TCP connection is identified by the 4-tuple (src IP, src port, dst IP, dst port) + protocol.

        | Port | Protocol |
        |---|---|
        | 20/21 | FTP (data/control) |
        | 22 | SSH |
        | 23 | Telnet |
        | 25 | SMTP |
        | 53 | DNS |
        | 67/68 | DHCP |
        | 80 | HTTP |
        | 110 / 143 | POP3 / IMAP |
        | 443 | HTTPS |
        | 3306 / 5432 / 6379 / 27017 | MySQL / PostgreSQL / Redis / MongoDB |
      `,
      keyPoints: [
        'TCP: connection-oriented, reliable, ordered, flow + congestion control. UDP: connectionless, fast, 8-byte header.',
        '3-way handshake: SYN → SYN-ACK → ACK.',
        'Termination uses FIN/ACK in both directions; closer waits in TIME_WAIT.',
        'Flow control protects the receiver (rwnd); congestion control protects the network (cwnd).',
        'Slow start doubles cwnd per RTT; congestion avoidance adds 1 MSS per RTT (AIMD).',
        'Go-Back-N resends all after loss; Selective Repeat resends only lost frames.',
        'DNS uses UDP 53 (TCP for large responses/zone transfers); HTTPS 443; SSH 22.',
        'HTTP/3 runs over QUIC, which is built on UDP.'
      ]
    },
    {
      id: 'network-datalink', title: 'Routing, Switching & Data Link',
      content: `
        ## Routing
        Routers forward packets using a **routing table** (longest prefix match wins).
        | Type | Algorithm | Protocol | Notes |
        |---|---|---|---|
        | **Distance vector** | Bellman–Ford | RIP (max 15 hops) | share table with neighbours; **count-to-infinity** problem (split horizon, poison reverse help) |
        | **Link state** | Dijkstra | OSPF, IS-IS | each router knows full topology; faster convergence |
        | **Path vector** | — | **BGP** | between autonomous systems — the routing protocol of the internet |
        Interior gateway protocols (IGP) work within an AS (RIP, OSPF); exterior (EGP) between ASes (BGP).

        Static vs dynamic routing; **default gateway** = router used for non-local destinations.

        ## Data link layer
        - **Framing**: character count, byte stuffing, bit stuffing (insert 0 after five 1s in HDLC).
        - **Error detection**: parity, checksum, **CRC** (cyclic redundancy check — polynomial division). **Error correction**: **Hamming code** (detects 2-bit, corrects 1-bit errors).
        - **MAC address**: 48-bit hardware address (e.g. \`00:1A:2B:3C:4D:5E\`), first 24 bits = manufacturer (OUI).

        ## Medium access control
        - **ALOHA**: pure (efficiency 18.4%), slotted (36.8%).
        - **CSMA/CD** (Ethernet, wired): listen before talking, detect collision, jam, **exponential backoff**.
        - **CSMA/CA** (Wi-Fi): collision *avoidance* with RTS/CTS and ACKs (can't detect collisions over wireless — hidden terminal problem).
        - Controlled access: token passing, polling.

        ## Switching techniques
        **Circuit switching** (dedicated path — old telephone), **packet switching** (internet; datagram or virtual circuit), message switching.

        ## VLAN
        Logically segments one physical switch into multiple broadcast domains (802.1Q tagging).
      `,
      keyPoints: [
        'Distance vector (RIP, Bellman–Ford) suffers count-to-infinity; link state (OSPF, Dijkstra) knows the full topology.',
        'BGP is the path-vector protocol routing between autonomous systems.',
        'Routers use longest prefix match.',
        'CRC detects errors; Hamming code corrects single-bit errors.',
        'MAC address = 48 bits; IPv4 = 32 bits.',
        'CSMA/CD for wired Ethernet; CSMA/CA for Wi-Fi.',
        'Pure ALOHA 18.4%, slotted ALOHA 36.8% max efficiency.',
        'Bit stuffing: insert a 0 after five consecutive 1s.'
      ]
    },
    {
      id: 'application', title: 'Application Layer: DNS, HTTP, HTTPS & more',
      content: `
        ## DNS — Domain Name System
        Translates names → IP addresses. Hierarchical & distributed: **root servers → TLD servers (.com) → authoritative servers**.
        - **Recursive query**: resolver does all the work for the client. **Iterative**: each server returns a referral.
        - Caching at browser, OS, resolver (TTL).
        - Records: **A** (IPv4), **AAAA** (IPv6), **CNAME** (alias), **MX** (mail), **NS** (name server), **TXT**, **PTR** (reverse lookup), SOA.
        - Uses UDP port 53 (TCP for zone transfers / large responses).

        ## HTTP
        Stateless request-response protocol (state via cookies, sessions, tokens).
        **Methods:**
        | Method | Purpose | Idempotent | Safe |
        |---|---|---|---|
        | GET | read | ✓ | ✓ |
        | POST | create / action | ✗ | ✗ |
        | PUT | replace | ✓ | ✗ |
        | PATCH | partial update | ✗ (usually) | ✗ |
        | DELETE | delete | ✓ | ✗ |
        | HEAD / OPTIONS | headers / CORS preflight | ✓ | ✓ |

        **Status codes:** 1xx info · **2xx success** (200 OK, 201 Created, 204 No Content) · **3xx redirect** (301 permanent, 302/307 temporary, 304 Not Modified) · **4xx client error** (400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 429 Too Many Requests) · **5xx server error** (500, 502 Bad Gateway, 503 Service Unavailable, 504 Gateway Timeout).

        **Versions:**
        - HTTP/1.0: new TCP connection per request.
        - HTTP/1.1: persistent (keep-alive) connections, pipelining; head-of-line blocking.
        - HTTP/2: binary framing, **multiplexing** many streams on one connection, header compression (HPACK), server push.
        - HTTP/3: over **QUIC (UDP)** — no TCP head-of-line blocking, faster handshakes (0-RTT).

        ## HTTPS & TLS
        HTTPS = HTTP over **TLS**. Provides confidentiality, integrity, authentication.
        TLS handshake (simplified): Client Hello (supported ciphers, random) → Server Hello + **certificate** (signed by a CA) → client verifies certificate → key exchange (ECDHE) → both derive the **symmetric session key** → encrypted traffic.
        **Asymmetric** crypto (RSA/ECC) is used to authenticate and agree on keys; **symmetric** (AES) encrypts the data because it's much faster.

        ## Other protocols
        - **FTP** (20/21), **SFTP** (over SSH), **SMTP** (send mail, 25/587), **POP3** (download & delete), **IMAP** (sync on server).
        - **WebSocket** — full-duplex persistent connection over a single TCP connection (chat, live feeds), starts with an HTTP Upgrade.
        - **Cookies vs sessions vs JWT**: cookie stored in browser; session stored on server (ID in cookie); JWT = signed self-contained token (stateless).
        - **CORS** — browser security policy controlling cross-origin requests via headers.
        - **REST vs SOAP vs GraphQL vs gRPC**.

        ## Network security essentials
        Firewalls, VPN, symmetric vs asymmetric encryption, hashing (SHA-256), digital signatures, common attacks: **DDoS**, **MITM**, **phishing**, **SQL injection**, **XSS**, **CSRF**, DNS spoofing.
      `,
      keyPoints: [
        'DNS: root → TLD → authoritative; A, AAAA, CNAME, MX, NS records; UDP 53.',
        'HTTP is stateless; state via cookies, sessions or tokens.',
        'Idempotent methods: GET, PUT, DELETE (and HEAD, OPTIONS). POST is not.',
        '401 = not authenticated; 403 = authenticated but forbidden; 404 not found; 502/503/504 gateway/server issues.',
        'HTTP/2 multiplexes streams over one TCP connection; HTTP/3 uses QUIC over UDP.',
        'TLS: asymmetric crypto to authenticate and exchange keys, then symmetric (AES) for data.',
        'WebSocket = full-duplex persistent connection, upgraded from HTTP.',
        'POP3 downloads mail; IMAP keeps it synced on the server; SMTP sends.'
      ]
    },
    {
      id: 'url-journey', title: 'What Happens When You Type a URL?',
      content: `
        > 🎯 Asked in almost every SDE interview. Walk through it layer by layer and go as deep as the interviewer wants.

        ## Step-by-step: \`https://www.google.com\`
        1. **URL parsing** — browser identifies scheme (https), host (www.google.com), path (/). Checks HSTS list → forces HTTPS.
        2. **DNS resolution** — browser cache → OS cache (/etc/hosts) → router → ISP's recursive resolver → root → .com TLD → Google's authoritative server → returns the IP.
        3. **ARP** — to send the packet to the default gateway, the machine needs the gateway's MAC → ARP request.
        4. **TCP connection** — 3-way handshake with the server IP on port 443 (or QUIC over UDP for HTTP/3).
        5. **TLS handshake** — certificate verification, key exchange, session keys.
        6. **HTTP request** — \`GET / HTTP/2\` with headers (Host, User-Agent, cookies, Accept-Encoding).
        7. **Server side** — load balancer → web server/reverse proxy (Nginx) → application server → cache / database → builds the response.
        8. **HTTP response** — status 200, headers (Content-Type, Cache-Control, Set-Cookie), body (HTML), possibly compressed (gzip/brotli).
        9. **Browser rendering** — parse HTML → **DOM**; parse CSS → **CSSOM**; combine → **render tree** → **layout** → **paint** → **composite**. JS is downloaded and executed (may block parsing unless \`async\`/\`defer\`). Additional requests for CSS, JS, images (often from a **CDN**).
        10. **Connection** kept alive for further requests; closed later with FIN/ACK.

        ## Layers involved
        Application (DNS, HTTP, TLS) → Transport (TCP/UDP ports) → Network (IP routing via many routers, BGP between ISPs) → Data link (Ethernet/Wi-Fi frames, MAC) → Physical (signals).

        ## Bonus points to mention
        - Caches at every level: browser cache, service worker, CDN edge, reverse proxy, application cache (Redis), DB buffer pool.
        - **NAT** at your home router rewrites your private IP to a public one.
        - Performance: DNS prefetch, keep-alive, HTTP/2 multiplexing, compression, lazy loading.
      `,
      keyPoints: [
        'Flow: parse URL → DNS → (ARP for gateway) → TCP handshake → TLS handshake → HTTP request → server → response → render.',
        'DNS lookup order: browser cache → OS → resolver → root → TLD → authoritative.',
        'Rendering: DOM + CSSOM → render tree → layout → paint → composite.',
        'Mention caches (browser, CDN, proxy, app, DB) and load balancers for bonus depth.'
      ]
    }
  ],
  flashcards: [
    { q: 'Seven OSI layers (bottom to top)?', a: 'Physical, Data link, Network, Transport, Session, Presentation, Application. ("Please Do Not Throw Sausage Pizza Away")' },
    { q: 'At which layers do hubs, switches and routers work?', a: 'Hub: L1 (physical). Switch: L2 (data link, MAC). Router: L3 (network, IP).' },
    { q: 'TCP vs UDP?', a: 'TCP: connection-oriented, reliable, ordered, flow/congestion control, heavier. UDP: connectionless, unreliable, low overhead — DNS, streaming, gaming, QUIC.' },
    { q: 'Explain the TCP 3-way handshake.', a: 'SYN (client seq x) → SYN-ACK (server seq y, ack x+1) → ACK (ack y+1). Synchronises sequence numbers on both sides.' },
    { q: 'Flow control vs congestion control?', a: 'Flow control prevents overwhelming the receiver (receiver window). Congestion control prevents overwhelming the network (congestion window, slow start, AIMD).' },
    { q: 'What is ARP?', a: 'Address Resolution Protocol — finds the MAC address for an IP address on the local network via broadcast.' },
    { q: 'What does DHCP do and what is DORA?', a: 'Automatically assigns IP configuration. Discover, Offer, Request, Acknowledge.' },
    { q: 'What is NAT?', a: 'Network Address Translation — maps private IP addresses to a public IP (with ports in PAT), conserving IPv4 addresses.' },
    { q: 'Usable hosts in a /27 subnet?', a: '2^(32−27) − 2 = 30.' },
    { q: 'Private IPv4 ranges?', a: '10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16.' },
    { q: 'IPv4 vs IPv6?', a: '32-bit vs 128-bit; IPv6 has a simpler header, no NAT needed, no broadcast, auto-configuration, built-in IPsec support.' },
    { q: 'Common DNS record types?', a: 'A (IPv4), AAAA (IPv6), CNAME (alias), MX (mail), NS (name server), TXT, PTR (reverse).' },
    { q: 'HTTP 401 vs 403?', a: '401 Unauthorized: not authenticated / missing credentials. 403 Forbidden: authenticated but not allowed.' },
    { q: 'Which HTTP methods are idempotent?', a: 'GET, PUT, DELETE, HEAD, OPTIONS. POST is not (PATCH usually not).' },
    { q: 'HTTP/1.1 vs HTTP/2 vs HTTP/3?', a: '1.1: persistent text connections, HOL blocking. 2: binary, multiplexed streams, header compression. 3: runs on QUIC (UDP), removes TCP HOL blocking, faster setup.' },
    { q: 'How does HTTPS work?', a: 'TLS handshake: server sends CA-signed certificate, client verifies it, both perform key exchange (ECDHE) to derive a symmetric session key; data is then encrypted with AES.' },
    { q: 'Symmetric vs asymmetric encryption?', a: 'Symmetric: one shared key, fast (AES). Asymmetric: public/private key pair, slow, used for key exchange & signatures (RSA, ECC).' },
    { q: 'Distance vector vs link state routing?', a: 'DV (RIP): share distance tables with neighbours, Bellman–Ford, count-to-infinity. LS (OSPF): flood link info, each router runs Dijkstra on full topology, faster convergence.' },
    { q: 'CSMA/CD vs CSMA/CA?', a: 'CD: detect collisions and back off (wired Ethernet). CA: avoid collisions with RTS/CTS and ACKs (Wi-Fi).' },
    { q: 'What is a socket?', a: 'An endpoint for communication = IP address + port number (+ protocol).' },
    { q: 'Ports: SSH, DNS, HTTP, HTTPS, SMTP?', a: 'SSH 22, DNS 53, HTTP 80, HTTPS 443, SMTP 25.' },
    { q: 'What happens when you type a URL? (one line)', a: 'DNS lookup → TCP (+TLS) handshake → HTTP request → server processing → HTTP response → browser parses HTML/CSS/JS and renders.' },
    { q: 'What is a CDN?', a: 'Content Delivery Network — geographically distributed edge servers caching static content close to users to reduce latency and load.' },
    { q: 'Cookies vs sessions vs JWT?', a: 'Cookie: data stored in the browser. Session: data on the server, ID in a cookie. JWT: signed, self-contained token, stateless for the server.' }
  ],
  quiz: [
    { q: 'Which OSI layer is responsible for routing?', options: ['Data link', 'Network', 'Transport', 'Session'], answer: 1, explain: 'Layer 3 (network) handles logical addressing and routing.', topic: 'models' },
    { q: 'The PDU at the transport layer (TCP) is called a:', options: ['Frame', 'Packet', 'Segment', 'Bit'], answer: 2, explain: 'TCP segment / UDP datagram.', topic: 'models' },
    { q: 'A switch operates at which layer?', options: ['Physical', 'Data link', 'Network', 'Application'], answer: 1, explain: 'Switches forward frames using MAC addresses.', topic: 'models' },
    { q: 'How many usable hosts are in 192.168.1.0/26?', options: ['64', '62', '30', '126'], answer: 1, explain: '2⁶ − 2 = 62.', topic: 'ip-subnet' },
    { q: 'Which protocol maps an IP address to a MAC address?', options: ['DNS', 'DHCP', 'ARP', 'ICMP'], answer: 2, explain: 'ARP.', topic: 'ip-subnet' },
    { q: 'Which address is private?', options: ['8.8.8.8', '172.20.5.4', '172.32.0.1', '11.0.0.1'], answer: 1, explain: '172.16.0.0 – 172.31.255.255 is private.', topic: 'ip-subnet' },
    { q: 'DNS primarily uses:', options: ['TCP 80', 'UDP 53', 'UDP 67', 'TCP 443'], answer: 1, explain: 'UDP 53 for queries; TCP 53 for zone transfers/large responses.', topic: 'transport' },
    { q: 'In TCP slow start, the congestion window:', options: ['Grows linearly', 'Doubles every RTT', 'Stays constant', 'Halves every RTT'], answer: 1, explain: 'Exponential growth until ssthresh.', topic: 'transport' },
    { q: 'Which is best suited for live video calls?', options: ['TCP', 'UDP', 'FTP', 'SMTP'], answer: 1, explain: 'Low latency matters more than retransmitting old frames.', topic: 'transport' },
    { q: 'OSPF uses which algorithm?', options: ['Bellman–Ford', 'Dijkstra', 'Kruskal', 'Prim'], answer: 1, explain: 'Link-state routing runs Dijkstra.', topic: 'network-datalink' },
    { q: 'The routing protocol used between ISPs / autonomous systems is:', options: ['RIP', 'OSPF', 'BGP', 'EIGRP'], answer: 2, explain: 'BGP.', topic: 'network-datalink' },
    { q: 'Wi-Fi uses:', options: ['CSMA/CD', 'CSMA/CA', 'Token ring', 'Pure ALOHA'], answer: 1, explain: 'Collision avoidance (wireless cannot reliably detect collisions).', topic: 'network-datalink' },
    { q: 'HTTP status for "resource created" is:', options: ['200', '201', '204', '301'], answer: 1, explain: '201 Created.', topic: 'application' },
    { q: 'HTTP/3 runs on top of:', options: ['TCP', 'QUIC over UDP', 'SCTP', 'Raw IP'], answer: 1, explain: 'QUIC is a UDP-based transport.', topic: 'application' },
    { q: 'In HTTPS, bulk data is encrypted using:', options: ['RSA', 'Symmetric keys (e.g. AES)', 'SHA-256', 'Base64'], answer: 1, explain: 'Asymmetric crypto only sets up the session key.', topic: 'application' },
    { q: 'Which DNS record maps a name to an IPv6 address?', options: ['A', 'AAAA', 'MX', 'CNAME'], answer: 1, explain: 'AAAA.', topic: 'application' }
  ]
});
