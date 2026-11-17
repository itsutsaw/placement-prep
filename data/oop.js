window.SUBJECTS = window.SUBJECTS || [];
window.SUBJECTS.push({
  id: 'oop', title: 'Object-Oriented Programming', short: 'OOP', icon: '🧱', color: '#0ea5e9', group: 'core',
  desc: 'Four pillars, classes & objects, polymorphism, SOLID, design patterns and language-specific interview favourites (Java/C++/Python).',
  topics: [
    {
      id: 'basics', title: 'Classes, Objects & Constructors',
      content: `
        ## What is OOP?
        A programming paradigm that organises software around **objects** — bundles of **state** (fields/attributes) and **behaviour** (methods). Goals: modularity, reusability, maintainability, modelling the real world.

        | Procedural | Object-oriented |
        |---|---|
        | Program = functions acting on data | Program = interacting objects |
        | Data is often global/shared | Data is encapsulated in objects |
        | Top-down design | Bottom-up design |
        | C, Pascal | Java, C++, Python, C# |

        ## Class vs Object
        - **Class** — a blueprint/template. Defines fields & methods. No memory for fields until instantiated.
        - **Object** — an instance of a class, occupies memory (heap in Java), has identity, state and behaviour.

        ~~~java
        class Car {
            private String model;          // state
            private int speed;
            Car(String model) {            // constructor
                this.model = model;
            }
            void accelerate(int by) { speed += by; }   // behaviour
        }
        Car c = new Car("Nexon");          // object
        ~~~

        ## Constructors
        - Same name as class, no return type, called automatically on object creation.
        - **Default** (no args; compiler provides one only if you write none), **parameterised**, **copy constructor** (C++; Java uses copy constructors manually or \`clone()\`).
        - **Constructor chaining**: \`this(...)\` calls another constructor of the same class; \`super(...)\` calls the parent's — must be the first statement.
        - Constructors are **not inherited** and cannot be \`virtual\` (C++) / overridden.
        - A **private constructor** prevents instantiation from outside (Singleton, utility classes).

        ## Destructors & garbage collection
        - **C++**: destructor \`~ClassName()\` runs deterministically when the object goes out of scope / \`delete\` is called. Make it **virtual** in base classes used polymorphically.
        - **Java**: no destructors; the **garbage collector** reclaims unreachable objects. \`finalize()\` is deprecated — use try-with-resources / \`AutoCloseable\`.
        - **Python**: reference counting + cyclic GC; \`__del__\` exists but avoid relying on it.

        ## static vs instance members
        - **static** belongs to the class (one copy shared by all objects); can be accessed without an object. Static methods can't use \`this\` or non-static members directly.
        - Instance members belong to each object.

        ## Access modifiers (Java)
        | Modifier | Class | Package | Subclass | World |
        |---|---|---|---|---|
        | private | ✓ | ✗ | ✗ | ✗ |
        | default (package-private) | ✓ | ✓ | ✗ (outside pkg) | ✗ |
        | protected | ✓ | ✓ | ✓ | ✗ |
        | public | ✓ | ✓ | ✓ | ✓ |

        C++ has public/protected/private (default **private** for \`class\`, **public** for \`struct\`). Python uses conventions: \`_protected\`, \`__private\` (name-mangled).

        ## The \`this\` / \`self\` reference
        Refers to the current object — used to disambiguate fields from parameters, chain constructors, and return the current object (fluent/builder APIs).
      `,
      keyPoints: [
        'Class = blueprint; object = instance with state, behaviour and identity.',
        'Constructors: same name, no return type, not inherited; this(...) / super(...) must be first.',
        'Compiler gives a default constructor only if you define none.',
        'Private constructor ⇒ prevents outside instantiation (Singleton, utility class).',
        'static members belong to the class, shared by all objects.',
        'Java access: private < default (package) < protected < public.',
        'C++ class members default to private; struct members default to public.',
        'Base-class destructors in C++ should be virtual when deleting through base pointers.'
      ]
    },
    {
      id: 'pillars', title: 'The Four Pillars',
      content: `
        ## 1. Encapsulation
        **Bundling data and methods together and restricting direct access** to the data. Fields are private; access goes through getters/setters that can validate.
        ~~~java
        class Account {
            private double balance;
            public void deposit(double amt) {
                if (amt <= 0) throw new IllegalArgumentException("Invalid amount");
                balance += amt;
            }
            public double getBalance() { return balance; }
        }
        ~~~
        Benefits: data hiding, validation, freedom to change internals without breaking callers.

        ## 2. Abstraction
        **Showing only essential features and hiding implementation details.** You call \`list.sort()\` without knowing the algorithm.
        - Achieved via **abstract classes** and **interfaces**.
        - *Encapsulation hides data (how it is stored); abstraction hides complexity (how it works).*

        ## 3. Inheritance
        A class (child/subclass) **acquires properties and behaviour** of another (parent/superclass) — an **IS-A** relationship. Promotes reuse.

        | Type | Description | Java | C++ |
        |---|---|---|---|
        | Single | A → B | ✓ | ✓ |
        | Multilevel | A → B → C | ✓ | ✓ |
        | Hierarchical | A → B, A → C | ✓ | ✓ |
        | Multiple | A, B → C | only via interfaces | ✓ |
        | Hybrid | mix | via interfaces | ✓ (diamond problem) |

        **Diamond problem**: class D inherits from B and C which both inherit from A → ambiguity about which A's members D gets. C++ solves it with **virtual inheritance**; Java avoids it by disallowing multiple class inheritance (default methods conflict must be overridden explicitly). Python uses **MRO (C3 linearisation)**.

        ## 4. Polymorphism
        **One interface, many forms.**

        | Compile-time (static) | Run-time (dynamic) |
        |---|---|
        | Method **overloading**, operator overloading | Method **overriding** |
        | Resolved by compiler (early binding) | Resolved at runtime via vtable (late binding) |
        | Same name, different parameter list | Same signature in subclass |

        ~~~java
        class Shape { double area() { return 0; } }
        class Circle extends Shape {
            double r; Circle(double r) { this.r = r; }
            @Override double area() { return Math.PI * r * r; }
        }
        Shape s = new Circle(2);   // upcasting
        s.area();                  // calls Circle.area() — dynamic dispatch
        ~~~

        ### Overloading rules
        Differ in number/type/order of parameters. **Return type alone is not enough.**
        ### Overriding rules (Java)
        - Same name, parameters; return type same or **covariant** (subtype).
        - Cannot reduce visibility; cannot throw broader checked exceptions.
        - \`static\`, \`private\` and \`final\` methods cannot be overridden (static methods are *hidden*).

        > 🎯 **Classic question:** "Can we override a static method?" — No. Defining the same static method in a subclass is *method hiding*; the call is resolved by the reference type at compile time.
      `,
      keyPoints: [
        'Encapsulation = bundle data + methods, hide data (private fields + getters/setters).',
        'Abstraction = expose what, hide how (abstract classes, interfaces).',
        'Inheritance = IS-A reuse; Java has no multiple class inheritance (interfaces only).',
        'Diamond problem: C++ virtual inheritance, Java forbids multiple class inheritance, Python uses MRO.',
        'Compile-time polymorphism = overloading (early binding); runtime = overriding (late binding, vtable).',
        'Overloading cannot differ by return type alone.',
        'static, private and final methods cannot be overridden (static ⇒ hiding).',
        'Covariant return types are allowed when overriding.'
      ]
    },
    {
      id: 'abstract-interface', title: 'Abstract Classes, Interfaces & Relationships',
      content: `
        ## Abstract class vs Interface (Java 8+)
        | | Abstract class | Interface |
        |---|---|---|
        | Methods | abstract + concrete | abstract, \`default\`, \`static\`, \`private\` (Java 9) |
        | Fields | any (instance state allowed) | only \`public static final\` constants |
        | Constructors | yes | no |
        | Inheritance | \`extends\` one class | \`implements\` many interfaces |
        | Access modifiers | any | methods implicitly public |
        | Use when | sharing code + state among closely related classes (IS-A) | defining a capability/contract (CAN-DO) across unrelated classes |

        ~~~java
        interface Payable { double pay(); default String currency() { return "INR"; } }
        abstract class Employee implements Payable {
            protected String name;
            Employee(String n) { name = n; }
            abstract double pay();
        }
        class Intern extends Employee {
            Intern(String n) { super(n); }
            double pay() { return 20000; }
        }
        ~~~

        In **C++**, an abstract class has at least one **pure virtual function** (\`virtual void f() = 0;\`). An "interface" is a class with only pure virtual functions.
        In **Python**, use \`abc.ABC\` and \`@abstractmethod\`.

        ## Object relationships
        | Relationship | Meaning | Lifetime | Example |
        |---|---|---|---|
        | **Association** | uses / knows | independent | Teacher ↔ Student |
        | **Aggregation** | HAS-A (weak) | part can exist alone | Department has Professors |
        | **Composition** | HAS-A (strong, owns) | part dies with whole | House has Rooms; Car has Engine |
        | **Inheritance** | IS-A | — | Dog is an Animal |

        > 💡 **Composition over inheritance:** prefer building classes from smaller objects rather than deep inheritance trees — more flexible, less coupling (the fragile base class problem).

        ## Virtual functions & vtable (C++)
        - A \`virtual\` function is resolved at runtime using the object's **vtable** (table of function pointers per class); each object stores a hidden **vptr**.
        - Without \`virtual\`, calls through a base pointer use the base implementation (static binding).
        - **Virtual destructor** is needed so \`delete basePtr\` calls the derived destructor (else memory leak / UB).
        - In Java all non-static, non-final, non-private methods are virtual by default.

        ## Coupling & cohesion
        - **Low coupling**: classes depend little on each other.
        - **High cohesion**: a class does one focused job.
      `,
      keyPoints: [
        'Abstract class: state + constructors + partial implementation, single inheritance.',
        'Interface: contract; multiple implementation; Java 8 default/static methods.',
        'Use abstract class for IS-A with shared code; interface for CAN-DO capability.',
        'C++ abstract class = has at least one pure virtual function (= 0).',
        'Aggregation = weak HAS-A (part outlives whole); Composition = strong HAS-A (part dies with whole).',
        'Prefer composition over inheritance.',
        'vtable/vptr enable runtime dispatch; base destructors must be virtual.',
        'Aim for low coupling and high cohesion.'
      ]
    },
    {
      id: 'solid', title: 'SOLID & Design Principles',
      content: `
        ## SOLID
        ### S — Single Responsibility Principle
        A class should have **one reason to change**. \`Invoice\` shouldn't also print and email itself → split into \`InvoicePrinter\`, \`InvoiceMailer\`.
        ### O — Open/Closed Principle
        **Open for extension, closed for modification.** Add new behaviour via new classes (polymorphism) instead of editing if-else chains.
        ~~~java
        interface Discount { double apply(double amt); }
        class Festive implements Discount { public double apply(double a) { return a * 0.8; } }
        class Student implements Discount { public double apply(double a) { return a * 0.9; } }
        // adding a new discount = add a class, no change to checkout code
        ~~~
        ### L — Liskov Substitution Principle
        Objects of a subclass must be usable wherever the parent is expected **without breaking correctness**. Classic violation: \`Square extends Rectangle\` (setting width changes height) or \`Penguin extends Bird\` with \`fly()\`.
        ### I — Interface Segregation Principle
        Many small, specific interfaces are better than one fat interface. Don't force \`Robot\` to implement \`eat()\`.
        ### D — Dependency Inversion Principle
        High-level modules should depend on **abstractions**, not concrete classes. Inject dependencies (constructor injection) → easy to test/mock.
        ~~~java
        class OrderService {
            private final PaymentGateway gw;            // interface
            OrderService(PaymentGateway gw) { this.gw = gw; }  // injected
        }
        ~~~

        ## Other principles
        - **DRY** — Don't Repeat Yourself.
        - **KISS** — Keep It Simple.
        - **YAGNI** — You Aren't Gonna Need It.
        - **Law of Demeter** — talk only to immediate friends (avoid \`a.getB().getC().do()\`).
      `,
      keyPoints: [
        'S: one class, one reason to change.',
        'O: extend with new classes, do not modify working code.',
        'L: subclasses must be substitutable for the parent (Square/Rectangle violation).',
        'I: many small interfaces > one fat interface.',
        'D: depend on abstractions; inject dependencies.',
        'DRY, KISS, YAGNI, Law of Demeter.'
      ]
    },
    {
      id: 'design-patterns', title: 'Design Patterns',
      content: `
        Reusable solutions to common design problems (Gang of Four, 23 patterns in 3 groups).

        ## Creational
        ### Singleton — exactly one instance
        ~~~java
        public class Config {
            private static volatile Config instance;
            private Config() {}
            public static Config get() {
                if (instance == null) {
                    synchronized (Config.class) {
                        if (instance == null) instance = new Config();   // double-checked locking
                    }
                }
                return instance;
            }
        }
        ~~~
        Uses: logger, config, connection pool. Simplest thread-safe Java version: an \`enum\` singleton, or a static holder class. Downsides: global state, harder to test.
        ### Factory Method — let a method decide which subclass to create
        ~~~java
        class ShapeFactory {
            static Shape create(String type) {
                return switch (type) {
                    case "circle" -> new Circle();
                    case "square" -> new Square();
                    default -> throw new IllegalArgumentException(type);
                };
            }
        }
        ~~~
        ### Abstract Factory — family of related objects (e.g. Windows vs Mac UI widgets).
        ### Builder — construct complex objects step by step (\`new Pizza.Builder().size(12).cheese().build()\`). Avoids telescoping constructors.
        ### Prototype — clone existing objects.

        ## Structural
        - **Adapter** — convert one interface into another (charger adapter; wrap legacy API).
        - **Decorator** — add responsibilities dynamically by wrapping (Java I/O streams: \`new BufferedReader(new FileReader(f))\`; Python \`@decorators\`).
        - **Facade** — simple interface over a complex subsystem.
        - **Proxy** — placeholder controlling access (lazy loading, caching, security).
        - **Composite** — tree of objects treated uniformly (files & folders).

        ## Behavioural
        - **Observer** — one-to-many: when subject changes, observers are notified (event listeners, pub-sub, YouTube subscribers).
        - **Strategy** — interchangeable algorithms behind an interface (payment methods, sorting strategy).
        - **Command** — encapsulate a request as an object (undo/redo, queues).
        - **Iterator** — sequential access without exposing internals.
        - **Template Method** — skeleton algorithm in base class, steps overridden by subclasses.
        - **State** — behaviour changes with internal state (vending machine, traffic light).
        - **Chain of Responsibility** — pass request along handlers (middleware, logging levels).

        > 🎯 **Most asked:** Singleton (and making it thread-safe), Factory, Observer, Strategy, Decorator, Builder. Be ready to give a real-world example of each.

        ## Low-Level Design (LLD) rounds
        Common prompts: Parking lot, Library management, Elevator system, Snake & Ladder, Tic-tac-toe, Splitwise, BookMyShow, Vending machine, Rate limiter.
        **Approach:** clarify requirements → identify entities (nouns → classes) → relationships → key methods (verbs) → apply patterns (Strategy for pricing, Observer for notifications, Singleton for the system, Factory for vehicles) → handle concurrency → write core classes.
      `,
      keyPoints: [
        'Creational: Singleton, Factory, Abstract Factory, Builder, Prototype.',
        'Structural: Adapter, Decorator, Facade, Proxy, Composite.',
        'Behavioural: Observer, Strategy, Command, Iterator, Template Method, State.',
        'Thread-safe singleton: double-checked locking with volatile, static holder, or enum.',
        'Observer = publish/subscribe; Strategy = swappable algorithms.',
        'Decorator wraps an object to add behaviour (Java I/O streams).',
        'LLD: requirements → entities → relationships → methods → patterns.'
      ]
    },
    {
      id: 'language-specifics', title: 'Java / C++ / Python Interview Favourites',
      content: `
        ## Java
        - **JDK ⊃ JRE ⊃ JVM.** Source → \`javac\` → bytecode → JVM (interpreter + JIT) → machine code. "Write once, run anywhere".
        - **Memory:** stack (method frames, local primitives & references) vs heap (objects; GC'd). Metaspace stores class metadata.
        - **String immutability:** strings are immutable and pooled (String Constant Pool) → security, caching hashCode, thread safety. \`StringBuilder\` (not thread-safe, fast) vs \`StringBuffer\` (synchronized).
        - **\`==\` vs \`equals()\`:** \`==\` compares references; \`equals()\` compares content.
        - **\`final\`**: variable → constant; method → can't override; class → can't extend. \`finally\` → always runs after try/catch. \`finalize()\` → deprecated GC hook.
        - **Checked vs unchecked exceptions:** checked (IOException, SQLException) must be declared/handled at compile time; unchecked (RuntimeException: NullPointerException, ArithmeticException, ArrayIndexOutOfBounds) need not be.
        - **Wrapper classes & autoboxing:** \`int ↔ Integer\`. Integer cache −128..127 makes \`==\` work surprisingly for small values.
        - **Collections:** \`ArrayList\` (dynamic array) vs \`LinkedList\`; \`HashMap\` (unordered) vs \`LinkedHashMap\` (insertion order) vs \`TreeMap\` (sorted, red-black tree); \`HashSet\`; \`ConcurrentHashMap\` (thread-safe, segment/bucket locking) vs \`Hashtable\` (legacy, fully synchronized).
        - **Comparable vs Comparator:** \`compareTo\` inside the class (natural order) vs external comparator objects (multiple orders).
        - Java is **pass-by-value** always — object references are copied by value.
        - **Multithreading:** \`Thread\` vs \`Runnable\`, \`synchronized\`, \`volatile\` (visibility, not atomicity), \`ExecutorService\`, deadlock.

        ## C++
        - **Pointers vs references:** reference must be initialised, can't be null or reseated.
        - **new/delete vs malloc/free:** new calls constructors, type-safe, throws \`bad_alloc\`.
        - **Smart pointers:** \`unique_ptr\` (sole ownership), \`shared_ptr\` (reference counted), \`weak_ptr\` (breaks cycles).
        - **RAII** — tie resource lifetime to object lifetime (destructor releases).
        - **Rule of three/five:** if you define a destructor, copy ctor or copy assignment, you probably need all (plus move ctor/assignment).
        - **Shallow vs deep copy:** default copy constructor copies pointer values (shallow) → double free.
        - **Friend function** accesses private members; **inline** functions; **templates** (generic programming); STL containers.
        - \`const\` correctness, \`static\` in functions, function overloading vs **name mangling**.

        ## Python
        - Everything is an object; dynamic typing; **duck typing**.
        - \`__init__\` (initialiser) vs \`__new__\` (creator). Dunder methods: \`__str__\`, \`__repr__\`, \`__eq__\`, \`__len__\`, \`__lt__\`.
        - \`@staticmethod\` (no self/cls), \`@classmethod\` (gets cls — alternative constructors), \`@property\` (getter/setter).
        - **Mutable vs immutable:** list/dict/set are mutable; int/str/tuple immutable. Default mutable argument trap: \`def f(x=[])\`.
        - **Shallow vs deep copy:** \`copy.copy\` vs \`copy.deepcopy\`.
        - **GIL** — only one thread executes Python bytecode at a time → use multiprocessing for CPU-bound work, threads/asyncio for I/O-bound.
        - Generators (\`yield\`) are lazy; list comprehensions; decorators; context managers (\`with\`).
        - \`is\` (identity) vs \`==\` (equality).
      `,
      keyPoints: [
        'JVM runs bytecode (interpreter + JIT); JDK ⊃ JRE ⊃ JVM.',
        'Java Strings are immutable & pooled; StringBuilder (fast) vs StringBuffer (synchronized).',
        '== compares references; equals() compares content.',
        'final (const/no override/no extend) vs finally (always runs) vs finalize (deprecated).',
        'Checked exceptions must be handled at compile time; unchecked extend RuntimeException.',
        'Java is always pass-by-value (references copied).',
        'C++ smart pointers: unique_ptr, shared_ptr, weak_ptr; RAII; rule of three/five.',
        'Python: GIL limits CPU-bound threads; mutable default argument trap; is vs ==.'
      ]
    }
  ],
  flashcards: [
    { q: 'Four pillars of OOP?', a: 'Encapsulation, Abstraction, Inheritance, Polymorphism.' },
    { q: 'Encapsulation vs Abstraction?', a: 'Encapsulation hides **data** (wrap state + methods, restrict access). Abstraction hides **implementation complexity** (expose only what an object does).' },
    { q: 'Overloading vs Overriding?', a: 'Overloading: same name, different parameters, same class, compile-time. Overriding: same signature in subclass, runtime dispatch.' },
    { q: 'Can we override a static method in Java?', a: 'No — it is method hiding, resolved by the reference type at compile time.' },
    { q: 'Can a constructor be private? Why?', a: 'Yes — to prevent external instantiation (Singleton, factory methods, utility classes).' },
    { q: 'Abstract class vs interface?', a: 'Abstract class: state, constructors, concrete + abstract methods, single inheritance. Interface: contract, constants only, multiple inheritance, default/static methods since Java 8.' },
    { q: 'What is the diamond problem?', a: 'Ambiguity when a class inherits from two classes that share a common base. C++: virtual inheritance. Java: no multiple class inheritance. Python: MRO.' },
    { q: 'Aggregation vs Composition?', a: 'Both HAS-A. Aggregation: weak, part can exist independently (Dept–Professor). Composition: strong, part is destroyed with the whole (House–Room).' },
    { q: 'What is a virtual function / vtable?', a: 'A function resolved at runtime via the per-class table of function pointers (vtable); each object has a hidden vptr to its class vtable.' },
    { q: 'Why do we need a virtual destructor?', a: 'So deleting a derived object through a base pointer calls the derived destructor too; otherwise resources leak (undefined behaviour).' },
    { q: 'SOLID stands for?', a: 'Single responsibility, Open/closed, Liskov substitution, Interface segregation, Dependency inversion.' },
    { q: 'Liskov Substitution Principle example violation?', a: 'Square extends Rectangle: setting width also changes height, breaking code that expects independent width/height.' },
    { q: 'How to make a Singleton thread-safe in Java?', a: 'Double-checked locking with a `volatile` instance, a static inner holder class, or an `enum` singleton.' },
    { q: 'Observer pattern?', a: 'One-to-many dependency: subject notifies all registered observers when its state changes (event listeners, pub-sub).' },
    { q: 'Strategy pattern?', a: 'Define a family of interchangeable algorithms behind an interface; pick one at runtime (payment method, sorting, pricing).' },
    { q: 'Decorator pattern example?', a: 'Java I/O: `new BufferedReader(new InputStreamReader(System.in))` — wrappers add behaviour without changing the class.' },
    { q: 'Why are Java Strings immutable?', a: 'String pool sharing, security (paths, URLs, class names), thread safety, and cached hashCode for HashMap keys.' },
    { q: '== vs equals() in Java?', a: '== compares references (same object?); equals() compares logical content (if overridden).' },
    { q: 'final vs finally vs finalize?', a: 'final: constant / no override / no inheritance. finally: block that always runs after try. finalize: deprecated GC callback.' },
    { q: 'Checked vs unchecked exceptions?', a: 'Checked are verified at compile time and must be caught/declared (IOException). Unchecked are RuntimeException subclasses (NullPointerException).' },
    { q: 'Shallow vs deep copy?', a: 'Shallow copies references (shared nested objects). Deep copies nested objects recursively (independent).' },
    { q: 'Is Java pass-by-value or pass-by-reference?', a: 'Always pass-by-value. For objects, the reference is copied — you can mutate the object but not rebind the caller’s variable.' },
    { q: 'unique_ptr vs shared_ptr vs weak_ptr?', a: 'unique_ptr: single owner. shared_ptr: reference-counted shared ownership. weak_ptr: non-owning reference to break shared_ptr cycles.' },
    { q: 'What is Python’s GIL?', a: 'Global Interpreter Lock — only one thread executes Python bytecode at a time; use multiprocessing for CPU-bound parallelism.' },
    { q: 'Composition over inheritance — why?', a: 'Less coupling, change behaviour at runtime, avoids fragile base class problems and deep hierarchies.' }
  ],
  quiz: [
    { q: 'Method overloading is an example of:', options: ['Runtime polymorphism', 'Compile-time polymorphism', 'Encapsulation', 'Inheritance'], answer: 1, explain: 'Overload resolution happens at compile time.', topic: 'pillars' },
    { q: 'Which cannot be used to overload a method in Java?', options: ['Number of parameters', 'Type of parameters', 'Order of parameter types', 'Return type only'], answer: 3, explain: 'Return type alone does not distinguish methods.', topic: 'pillars' },
    { q: 'Java supports multiple inheritance of:', options: ['Classes', 'Interfaces (types)', 'Both', 'Neither'], answer: 1, explain: 'A class can implement many interfaces but extend only one class.', topic: 'pillars' },
    { q: 'A car and its engine (engine cannot exist without the car in this model) is:', options: ['Association', 'Aggregation', 'Composition', 'Inheritance'], answer: 2, explain: 'Strong ownership with shared lifetime = composition.', topic: 'abstract-interface' },
    { q: 'In C++, a class becomes abstract when it:', options: ['Has a private constructor', 'Has at least one pure virtual function', 'Has a virtual destructor', 'Is declared static'], answer: 1, explain: 'A pure virtual function (= 0) makes it abstract.', topic: 'abstract-interface' },
    { q: '"Software entities should be open for extension but closed for modification" is:', options: ['SRP', 'OCP', 'LSP', 'DIP'], answer: 1, explain: 'Open/Closed Principle.', topic: 'solid' },
    { q: 'Injecting a PaymentGateway interface into OrderService follows:', options: ['Interface Segregation', 'Dependency Inversion', 'Single Responsibility', 'Liskov Substitution'], answer: 1, explain: 'High-level modules depend on abstractions.', topic: 'solid' },
    { q: 'Which pattern ensures a class has only one instance?', options: ['Factory', 'Singleton', 'Prototype', 'Builder'], answer: 1, explain: 'Singleton.', topic: 'design-patterns' },
    { q: 'Event listeners in UI frameworks are an example of:', options: ['Observer', 'Adapter', 'Command', 'Facade'], answer: 0, explain: 'Subjects notify subscribed observers.', topic: 'design-patterns' },
    { q: 'Which pattern avoids telescoping constructors with many optional parameters?', options: ['Builder', 'Proxy', 'Iterator', 'State'], answer: 0, explain: 'Builder constructs the object step by step.', topic: 'design-patterns' },
    { q: 'Which Java class is mutable and NOT thread-safe?', options: ['String', 'StringBuffer', 'StringBuilder', 'Integer'], answer: 2, explain: 'StringBuilder is unsynchronised and faster; StringBuffer is synchronized.', topic: 'language-specifics' },
    { q: 'Which of these is a checked exception?', options: ['NullPointerException', 'ArithmeticException', 'IOException', 'ArrayIndexOutOfBoundsException'], answer: 2, explain: 'IOException must be caught or declared.', topic: 'language-specifics' },
    { q: 'Which smart pointer breaks reference cycles?', options: ['unique_ptr', 'shared_ptr', 'weak_ptr', 'auto_ptr'], answer: 2, explain: 'weak_ptr does not increase the reference count.', topic: 'language-specifics' },
    { q: 'Which member of a Java class is shared by all objects?', options: ['Instance variable', 'static variable', 'Local variable', 'final variable'], answer: 1, explain: 'static belongs to the class.', topic: 'basics' },
    { q: 'Default access for members of a C++ class is:', options: ['public', 'private', 'protected', 'package'], answer: 1, explain: 'class → private, struct → public.', topic: 'basics' }
  ]
});
