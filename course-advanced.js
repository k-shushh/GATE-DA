lesson(COURSE.find(x=>x.id==='text'),'04 · Unicode, bytes and safe conversion',[
'Text and binary data are different abstractions. str represents Unicode code points; bytes represents integers from 0 to 255. Encoding turns text into bytes using a named encoding such as UTF-8. Decoding reverses that operation when the bytes are valid for the encoding.',
'A character can occupy multiple bytes in UTF-8. Therefore len(text) and len(text.encode("utf-8")) can differ. Indexing bytes gives an integer; slicing bytes gives bytes. bytearray is a mutable binary sequence.',
'ord converts a one-character string to its code point; chr performs the inverse. Alphabetical order in Python strings is based on code-point lexicographic comparisons, not human-language collation. Visually identical text may use different Unicode sequences; unicodedata.normalize helps when a defined normalisation policy is needed.',
'Specify encoding explicitly for portable file processing. A UnicodeDecodeError means the bytes do not satisfy the chosen decoding rules. Ignoring errors can silently discard data; prefer detecting the actual encoding or reporting the problem. JSON and CSV parsing happen after bytes have been decoded into text.'
],`text = "café"
data = text.encode("utf-8")
print(len(text), len(data))
print(data[0], data.decode("utf-8") == text)
print(ord("A"), chr(66))
mutable = bytearray(b"abc")
mutable[0] = 65
print(bytes(mutable))`,`4 5\n99 True\n65 B\nb'Abc'`,'The final character occupies two bytes in UTF-8, so four code points use five bytes. The first byte is 99, the code for c. Changing bytearray position zero to 65 changes a to A.','Do not assume a character is one byte, or that len counts visual grapheme clusters.','Round-trip the string "naïve" through UTF-8 and compare its text length with its byte length.',`text = "naïve"
data = text.encode("utf-8")
assert data.decode("utf-8") == text
print(len(text), len(data))`,q('What does indexing a bytes object return?',['A one-character str','An integer from 0 to 255','A list'],1,'bytes indexing exposes the integer value; a bytes slice remains bytes.'));
m=module('objects','Objects & advanced tools','Classes, data modelling, decorators and resource lifetimes','Practical extension');
lesson(m,'01 · Classes and independent state',[
'A class defines a type whose instances combine state and behaviour. __init__ initialises a new instance; self refers to the instance receiving a method call. Calling item.method(x) supplies item as self automatically.',
'Instance attributes belong to one object; class attributes are shared through the class. Put per-instance mutable collections inside __init__. A shared class-level list can accidentally mix the state of every instance.',
'Methods can enforce invariants: a bank balance or queue length should stay valid after each operation. Python conventions such as a leading underscore communicate internal implementation details; they are not strict access-control barriers.',
'Use a class when related state and operations form a coherent concept. A simple transformation may be clearer as a function. For data records, dataclasses reduce boilerplate; a mutable dataclass field should use field(default_factory=list), not a shared list.'
],`class StudyLog:
    def __init__(self, name):
        self.name = name
        self.minutes = []
    def add(self, minutes):
        if minutes < 0:
            raise ValueError("negative duration")
        self.minutes.append(minutes)
    def total(self):
        return sum(self.minutes)
a, b = StudyLog("Asha"), StudyLog("Dev")
a.add(25)
a.add(30)
print(a.total(), b.total())`,`55 0`,'Each constructor call creates a separate list. Adding to a does not change b. Methods protect the nonnegative-duration contract.','Defining minutes=[] on the class would share one list unless each instance explicitly overrides it.','Add an average method that returns zero when no sessions exist.',`class StudyLog:
    def __init__(self):
        self.minutes = []
    def average(self):
        return sum(self.minutes) / len(self.minutes) if self.minutes else 0
log = StudyLog()
print(log.average())
log.minutes.extend([20, 40])
print(log.average())`,q('Where should independent per-instance lists usually be created?',['As a mutable class attribute','Inside __init__','In one shared global'],1,'Each constructor call creates a fresh instance-owned list.'));
lesson(m,'02 · Protocols, composition and inheritance',[
'Python often cares about supported behaviour rather than an exact class. An iterable supplies iteration; a sized object supports len; a context manager supports with. This behavioural approach is often called duck typing.',
'Special methods let objects participate in language operations: __len__, __iter__, __repr__, __eq__, and others. Implement only meaningful operations and keep their contracts consistent. If you define equality for mutable objects, do not casually make them hashable.',
'Composition places one object inside another to reuse behaviour. Inheritance expresses an is-a relationship and lets subclasses override methods; super() follows the method resolution order. Prefer a simple design over a deep hierarchy.',
'Equality and identity remain different for objects. Unless a class defines value equality, two separately created instances typically compare unequal. dataclass can generate value-based comparison and a useful representation; frozen prevents normal field reassignment but is not deep immutability of nested objects.'
],`from dataclasses import dataclass, field
@dataclass
class Playlist:
    name: str
    tracks: list = field(default_factory=list)
    def __len__(self):
        return len(self.tracks)
    def __iter__(self):
        return iter(self.tracks)
p = Playlist("Focus", ["alpha", "beta"])
print(len(p), list(p))
print(Playlist("Empty") == Playlist("Empty"))`,`2 ['alpha', 'beta']\nTrue`,'len and list use the protocols implemented by the object. dataclass-generated equality compares fields of matching class instances.','A frozen dataclass containing a list still contains a mutable list; shallow freezing does not recursively freeze everything.','Model a Point(x,y) record and compare two equal coordinate pairs.',`from dataclasses import dataclass
@dataclass(frozen=True)
class Point:
    x: float
    y: float
print(Point(2, 3) == Point(2, 3))`,q('Which method allows len(obj)?',['__size__','__len__','length'],1,'len dispatches to the size protocol through __len__.'));
lesson(m,'03 · Decorators, context and advanced boundaries',[
'A decorator takes a function (or class) and returns a replacement. @decorate above def f is roughly f = decorate(f). A wrapper can add timing, validation, logging or caching. functools.wraps preserves useful metadata of the wrapped function.',
'A closure lets the wrapper remember the original function. Accepting *args and **kwargs forwards a flexible signature. Always return the wrapped function’s result unless deliberately changing the contract.',
'A context manager brackets an operation with setup and cleanup. with is useful for files and resources; contextlib.contextmanager can implement one using a generator with a single yield and cleanup in finally.',
'Advanced Python also includes async/await, concurrency, descriptors and metaclasses. They are professional specialisations, not individually named DA programming subtopics. This course gives the foundations needed to learn them; it does not treat every Python library or implementation detail as a GATE requirement.'
],`from functools import wraps
def announce(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        print("calling", fn.__name__)
        return fn(*args, **kwargs)
    return wrapper
@announce
def square(x):
    return x * x
print(square(5))`,`calling square\n25`,'The decorator replaces square with a wrapper that retains the original function. The wrapper logs and then returns 25 to print.','A wrapper that forgets return silently converts successful function results into None.','Write a decorator that rejects negative first arguments and preserves the original result.',`from functools import wraps
def nonnegative(fn):
    @wraps(fn)
    def wrapped(x):
        if x < 0:
            raise ValueError("negative")
        return fn(x)
    return wrapped
@nonnegative
def double(x):
    return 2*x
print(double(4))`,q('What is @decorator above def f approximately equivalent to?',['decorator = f','f = decorator(f)','f(decorator) on every line'],1,'The function object is transformed and its name rebound at definition time.'));
m=module('patterns','Reason about algorithms','Complexity, invariants, prefix sums and search','DSA bridge');
lesson(m,'01 · Time and space from code',[
'Choose the input size first: n might be list length, number of vertices, or number of digits. Count dominant operations as a function of n. Big-O is an asymptotic upper bound; Theta is a tight growth bound; Omega is a lower bound. State best, average or worst case where needed.',
'Sequential loops add costs; nested loops do not always multiply by n blindly. A triangular loop has n(n-1)/2 iterations and is Theta(n²). A loop halving its positive integer counter has Theta(log n) iterations. An early return can make best and worst cases different.',
'Under the standard list model, indexing and len are O(1), append is amortised O(1), and front insertion/removal is O(n). A length-k slice allocates O(k) space and takes O(k) time. Membership in a list is O(n), whereas hash containers offer expected O(1) lookup with caveats.',
'Auxiliary space excludes the input unless stated otherwise. Include recursion stack and allocated slices. Complexity statements often assume constant-cost arithmetic on bounded-size values; Python’s arbitrary-precision integers can violate that assumption for huge numbers.'
],`def operations(n):
    count = 0
    for i in range(n):
        for j in range(i):
            count += 1
    return count
for n in [0, 1, 4, 8]:
    print(n, operations(n), n * (n - 1) // 2)`,`0 0 0\n1 0 0\n4 6 6\n8 28 28`,'Exact counts agree with the triangular-number formula. Doubling a large n approximately quadruples this count.','O(n²) does not mean exactly n² operations. Also, O(n) can be a valid but loose upper bound for an O(1) routine.','Count iterations of repeated integer halving for n=1,2,8,9.',`for value in [1, 2, 8, 9]:
    n, count = value, 0
    while n:
        n //= 2
        count += 1
    print(value, count)`,q('What is the tight growth of sum(range(n)) iterations in a triangular loop?',['Theta(log n)','Theta(n)','Theta(n²)'],2,'The count n(n-1)/2 grows quadratically.'));
lesson(m,'02 · Prefix sums and sliding windows',[
'For repeated range-sum queries, precompute prefix[0]=0 and prefix[i+1]=prefix[i]+a[i]. Then the sum over the half-open interval [left,right) is prefix[right]-prefix[left]. Building costs O(n); each query costs O(1).',
'A fixed-width sliding window updates the previous sum by removing the outgoing value and adding the incoming value. This avoids recomputing each width-k sum from scratch. Keep the invariant that the variable equals the current window’s sum.',
'Validate k: it should be positive and no larger than the input length for the usual full-window problem. Initialise the best sum from the first real window rather than zero so all-negative inputs work.',
'Two pointers can also solve variable-window problems, but the rule for moving pointers needs a proof. For example, expanding a sum window is monotone for nonnegative values; negative values can invalidate a strategy that assumes every expansion increases the sum.'
],`a = [2, -1, 4, 3, -2]
prefix = [0]
for x in a:
    prefix.append(prefix[-1] + x)
print(prefix)
print(prefix[4] - prefix[1])
k = 3
window = best = sum(a[:k])
for right in range(k, len(a)):
    window += a[right] - a[right-k]
    best = max(best, window)
print(best)`,`[0, 2, 1, 5, 8, 6]\n6\n6`,'The query covers a[1:4], whose sum is -1+4+3=6. Width-three sums are 5,6,5, so the maximum is 6.','A half-open [left,right) query excludes right. Prefix arrays have n+1 entries for this convention.','Implement maximum sum of any two consecutive elements in [-8,-3,-5].',`a, k = [-8, -3, -5], 2
window = best = sum(a[:k])
for right in range(k, len(a)):
    window += a[right] - a[right-k]
    best = max(best, window)
print(best)`,q('Using prefix[0]=0, sum(a[l:r]) equals what?',['prefix[r]-prefix[l]','prefix[r]-prefix[l-1]','prefix[r+1]-prefix[l]'],0,'The prefix at r includes indices before r; subtract the indices before l.'));
lesson(m,'03 · Linear and binary search',[
'Linear search examines elements until it finds a match. It works on unsorted sequences and costs O(n) in the worst case. Specify whether you want any occurrence, the first occurrence, or all occurrences.',
'Binary search needs an ordered search space and a predicate that divides it consistently. With half-open bounds [lo,hi), use mid=(lo+hi)//2 and discard a half while preserving the invariant that the answer lies in the retained interval.',
'A lower-bound search returns the first index where a[i]>=target. If all elements are smaller, it returns n. It handles duplicates naturally. Membership is then pos<n and a[pos]==target. bisect_left implements this position search in the standard library.',
'Each iteration shrinks the interval, giving O(log n) comparisons. Searching by slicing recursively can add copying costs; indices avoid this. Inserting into a list at the located position still takes O(n) shifting time.'
],`def lower_bound(a, target):
    lo, hi = 0, len(a)
    while lo < hi:
        mid = (lo + hi) // 2
        if a[mid] < target:
            lo = mid + 1
        else:
            hi = mid
    return lo
a = [1, 3, 3, 7]
for target in [0, 3, 5, 9]:
    print(target, lower_bound(a, target))`,`0 0\n3 1\n5 3\n9 4`,'For 3 the first eligible position is 1. For 5 it is 3, before 7. For 9 no eligible element exists, so return len(a)=4.','Binary search on unsorted data is not correct merely because the code terminates.','Test lower_bound against bisect_left on empty, singleton and duplicate-containing lists.',`from bisect import bisect_left
def lower_bound(a, x):
    lo, hi = 0, len(a)
    while lo < hi:
        mid = (lo+hi)//2
        if a[mid] < x: lo = mid+1
        else: hi = mid
    return lo
for a in [[], [2], [1, 2, 2, 5]]:
    for x in range(7):
        assert lower_bound(a, x) == bisect_left(a, x)
print("passed")`,q('What does lower_bound([1,3,3,7],3) return?',['1','2','3'],0,'It finds the first position whose value is at least 3.'));
m=module('structures','Data structures in Python','Stacks, queues, linked nodes, trees and graph traversal','DSA bridge');
lesson(m,'01 · Stack and queue behaviour',[
'A stack is last-in, first-out. A list supports push via append and pop from the end. A queue is first-in, first-out; collections.deque supports append and popleft efficiently. Using list.pop(0) shifts remaining elements and costs O(n).',
'Stacks model pending work, undo history and matched delimiters. To check balanced parentheses, push opening symbols, and require each closing symbol to match the most recent opening one. At the end the stack must be empty.',
'Queues model tasks waiting in arrival order and breadth-first exploration. Always define what happens when removing from an empty container. For a bounded circular queue, head and tail indices wrap modulo capacity; distinguish full and empty states explicitly.',
'The abstract data type specifies behaviour; a representation implements it. A linked list or array can implement a stack or queue with different performance trade-offs. Do not confuse the FIFO/LIFO contract with one specific Python class.'
],`from collections import deque
stack = []
stack.append("A"); stack.append("B")
print(stack.pop())
queue = deque(["A", "B"])
print(queue.popleft())
def balanced(text):
    stack, pairs = [], {')': '(', ']': '[', '}': '{'}
    for c in text:
        if c in "([{": stack.append(c)
        elif c in pairs:
            if not stack or stack.pop() != pairs[c]: return False
    return not stack
print(balanced("([{}])"), balanced("([)]"))`,`B\nA\nTrue False`,'A stack removes B because it arrived last; the queue removes A because it arrived first. The mismatched delimiter example fails when ) expects ( but [ is on top.','Ignoring the empty-stack case can turn an invalid string into an IndexError rather than a clean False.','Use a deque to simulate serving three named tasks in arrival order.',`from collections import deque
tasks = deque(["read", "solve", "review"])
while tasks:
    print(tasks.popleft())`,q('Which removal is usually O(1)?',['list.pop(0)','deque.popleft()','Deleting the middle of a list'],1,'deque supports efficient operations at both ends.'));
lesson(m,'02 · Linked nodes and binary trees',[
'A singly linked list stores a value and a reference to the next node. Accessing the k-th item requires following links, so it is O(k). Inserting after a known node is O(1); finding that node may cost O(n).',
'A binary tree has at most two children per node. Preorder visits root-left-right; inorder visits left-root-right; postorder visits left-right-root. These are recursive definitions that naturally map to call frames.',
'A binary search tree maintains an ordering rule: left keys are smaller and right keys larger, with a declared duplicate policy. Inorder traversal yields sorted keys. Search costs O(h), where h is height; a skewed tree may have h=O(n).',
'A heap is different from a BST: the parent priority is no greater than its children in a min-heap, but sibling/subtree keys are not globally ordered. heapq supports O(log n) push/pop and O(n) heap construction. These are bridges; full tree algorithms require additional deliberate practice.'
],`class Node:
    def __init__(self, value, left=None, right=None):
        self.value, self.left, self.right = value, left, right
def inorder(node):
    if node is None:
        return []
    return inorder(node.left) + [node.value] + inorder(node.right)
root = Node(4, Node(2, Node(1), Node(3)), Node(6))
print(inorder(root))
import heapq
heap = [7, 2, 5, 1]
heapq.heapify(heap)
print([heapq.heappop(heap) for _ in range(4)])`,`[1, 2, 3, 4, 6]\n[1, 2, 5, 7]`,'Inorder recursively completes the left subtree before the root. heapify establishes the heap property, and repeated pops produce ascending values. The simple traversal uses concatenation for clarity; a generator avoids repeated list copies.','A BST is not automatically balanced. O(log n) search requires a logarithmic-height tree.','Rewrite inorder as a generator using yield from.',`class Node:
    def __init__(self, value, left=None, right=None):
        self.value, self.left, self.right = value, left, right
def inorder(node):
    if node is not None:
        yield from inorder(node.left)
        yield node.value
        yield from inorder(node.right)
print(list(inorder(Node(2, Node(1), Node(3)))))`,q('Which traversal yields sorted keys in a BST?',['Preorder','Inorder','Postorder'],1,'The ordering invariant combines with left-root-right traversal.'));
lesson(m,'03 · Graphs, visited state and BFS',[
'A graph consists of vertices and edges. An adjacency list maps each vertex to its neighbours and typically uses O(V+E) space; an adjacency matrix uses O(V²). Directed edges need not be symmetric; undirected edges appear in both adjacency lists.',
'Breadth-first search uses a queue and discovers vertices in distance layers. Mark a vertex visited when enqueuing, not only when removing it, to prevent duplicate work. In an unweighted graph, the first discovered distance is a shortest path length in number of edges.',
'Depth-first search explores deeply using recursion or an explicit stack. Both BFS and DFS need visited state for cyclic graphs. With adjacency lists they run in O(V+E) over the visited graph. Traversal order within a layer depends on neighbour order.',
'BFS does not solve arbitrary weighted shortest paths. Dijkstra requires nonnegative edge weights; negative weights need other reasoning. This lesson provides Python implementation literacy; the full graph/shortest-path syllabus remains a separate DSA study unit.'
],`from collections import deque
graph = {'A': ['B', 'C'], 'B': ['A', 'D'], 'C': ['A', 'D'], 'D': ['B', 'C']}
def bfs(graph, start):
    distance, queue = {start: 0}, deque([start])
    while queue:
        u = queue.popleft()
        for v in graph[u]:
            if v not in distance:
                distance[v] = distance[u] + 1
                queue.append(v)
    return distance
print(bfs(graph, 'A'))`,`{'A': 0, 'B': 1, 'C': 1, 'D': 2}`,'A discovers B and C at distance 1. B discovers D at distance 2. When C sees D, it is already recorded and is not enqueued again.','A graph may be disconnected. A traversal from one start visits only its reachable component.','Add an isolated vertex E and verify it is absent from bfs(graph,"A").',`from collections import deque
graph = {'A':['B'], 'B':['A'], 'E':[]}
seen, queue = {'A'}, deque(['A'])
while queue:
    for v in graph[queue.popleft()]:
        if v not in seen:
            seen.add(v); queue.append(v)
print(sorted(seen))`,q('When should a standard BFS mark a vertex visited?',['When enqueuing it','Only after all its neighbours','After the entire traversal'],0,'Marking on enqueue prevents the same vertex entering the queue repeatedly.'));
m=module('projects','Build, explain, revise','Three practical projects and a route to exam readiness','Hands-on studio');
lesson(m,'01 · Project: a study-session analyser',[
'Goal: take records with topic and minutes, reject malformed values, and report total minutes per topic. Separate validation, aggregation and presentation. This is a useful pattern for logs, expenses and analytics pipelines.',
'Define the contract: each row has a string topic and a nonnegative integer duration. Because bool subclasses int, a strict integer-duration check can use type(value) is int if True should be rejected.',
'The aggregation is a dict keyed by normalised topic. Normalisation strips extra spaces and folds case; an empty result is invalid. Keep rejected row indices so the user can repair the data instead of silently losing it.',
'Extend the project with CSV input, JSON output and a command-line interface after the pure aggregation function works. Test the pure function first; testing it should not require real files or keyboard input.'
],`def analyse(rows):
    totals, rejected = {}, []
    for i, row in enumerate(rows):
        topic, minutes = row.get('topic'), row.get('minutes')
        if not isinstance(topic, str) or not topic.strip() or type(minutes) is not int or minutes < 0:
            rejected.append(i)
            continue
        topic = ' '.join(topic.casefold().split())
        totals[topic] = totals.get(topic, 0) + minutes
    return totals, rejected
rows = [{'topic':' Python ', 'minutes':25}, {'topic':'python', 'minutes':35}, {'topic':'loops','minutes':-1}]
print(analyse(rows))`,`({'python': 60}, [2])`,'Two normalised Python rows combine into 60 minutes. The negative duration is rejected with its original index. The contract assumes every row is a mapping; add validation if arbitrary objects are allowed.','A silent skip hides data quality problems. Keep a useful error trail.','Add tests for an empty list, an empty topic, a Boolean duration, and repeated normalised topics.',`def analyse(rows):
    totals, rejected = {}, []
    for i, row in enumerate(rows):
        t, n = row.get('topic'), row.get('minutes')
        if not isinstance(t,str) or not t.strip() or type(n) is not int or n < 0:
            rejected.append(i); continue
        t = ' '.join(t.casefold().split())
        totals[t] = totals.get(t,0)+n
    return totals,rejected
assert analyse([]) == ({},[])
assert analyse([{'topic':'','minutes':1},{'topic':'x','minutes':True}]) == ({},[0,1])
assert analyse([{'topic':' X ','minutes':2},{'topic':'x','minutes':3}]) == ({'x':5},[])
print('passed')`,q('Why keep validation separate from presentation?',['It makes the pure logic easier to test and reuse','It removes the need for tests','It guarantees faster execution'],0,'A pure function can be tested with in-memory inputs, independent of UI or files.'));
lesson(m,'02 · Project: a text-frequency report',[
'Goal: extract words, count them, and display a deterministic top-k report. Decide what a word means. This example uses runs of ASCII letters for an explicitly English-only input contract; multilingual tokenisation requires a different policy.',
'Use re.findall to extract tokens, casefold to normalise, Counter to count, and a tuple sort key for frequency descending then word ascending. Tie rules are part of a reproducible report.',
'Complexity has several stages: tokenisation is proportional to text length for this simple pattern, counting is expected linear in token count, and sorting u unique words costs O(u log u). Memory includes tokens and counts; streaming can reduce token storage.',
'Extensions: ignore a configurable stop-word set, read UTF-8 files, export JSON, and compare reports from two documents. Keep the core report function independent of filesystem access. For huge inputs, consider iterating regex matches rather than materialising every token.'
],`import re
from collections import Counter
def top_words(text, k=3):
    if k < 0:
        raise ValueError('negative k')
    tokens = re.findall(r'[a-z]+', text.casefold())
    counts = Counter(tokens)
    return sorted(counts.items(), key=lambda item: (-item[1], item[0]))[:k]
print(top_words('Learn Python. Learn by doing. Python helps!', 3))`,`[('learn', 2), ('python', 2), ('by', 1)]`,'learn and python tie at count 2 and sort alphabetically. The one-count words follow, with by first alphabetically.','A plain split() retains punctuation, so "python" and "python." may be counted separately.','Add an optional stop-word set and verify that uppercase stop words are handled under a documented policy.',`import re
from collections import Counter
def top_words(text, stop=()):
    stop = {word.casefold() for word in stop}
    counts = Counter(w for w in re.findall(r'[a-z]+', text.casefold()) if w not in stop)
    return sorted(counts.items(), key=lambda item: (-item[1], item[0]))
print(top_words('The data and the model', {'THE', 'and'}))`,q('Which key orders count descending and word ascending?',['(count, word)','(-count, word)','(word, -count)'],1,'Negate only the numeric criterion that should descend.'));
lesson(m,'03 · Project: your exam tracing workflow',[
'For an output question, first identify types and aliases. Draw one object for each mutable container and arrows from names. Then trace statements in order. Record mutations separately from rebinding and remember that function default objects may survive between calls.',
'For a loop question, record the state immediately before the body, any output inside the body, and the update. For recursion, draw each call frame and the expression waiting for its result. For a complexity question, identify input size and count actual iterations or copies.',
'Predict before running. The runner is a verification tool, not a replacement for reasoning. If the prediction is wrong, classify the cause: language rule, state-tracing error, boundary error, complexity model, or arithmetic. Reattempt the question after a delay.',
'Completion criteria: explain each lesson without notes; pass its check; implement its hands-on task from a blank editor; solve unseen mixed questions; and justify your answer under time pressure. A checked lesson is a record of activity, not a guarantee of mastery. Review missed cards after 1, 3 and 7 days as a simple starting routine.'
],`def update(items):
    alias = items
    copy = items[:]
    alias.append(3)
    copy.append(4)
    return copy
a = [1, 2]
b = update(a)
print(a, b, a is b)`,`[1, 2, 3] [1, 2, 4] False`,'items and alias refer to a. copy is a new outer list. Each append therefore affects a different list. The returned list becomes b.','Do not assume an output option is correct because it resembles a previously seen example. Trace this exact program.','Write your own short program containing one alias, one copy, and one rebinding. Predict every output and explain the arrows.',`a = [1]
b = a
c = a[:]
b.append(2)
b = [9]
print(a, b, c)
assert a == [1,2] and b == [9] and c == [1]`,q('What is the best next step after predicting a program output incorrectly?',['Rerun until it feels familiar','Identify the exact rule or state transition missed, then reattempt later','Memorise only the final output'],1,'Understanding the cause transfers to unseen questions.'));
