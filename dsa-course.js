/* GATE Lab: original DSA teaching material. All examples are executable Python 3. */
function dmodule(id,title,subtitle,tag='DSA core'){const m=module('dsa-'+id,title,subtitle,tag);m.track='dsa';return m;}
function dsaClean(text){return text.replace(/\b(to|from|of|with|cost|costs|weight|weights|index|amount|size|pass|key|node|vertex|length|depth|step|root|mod|for|and|then|by|at|into|through|before|after|left|right|minimum|maximum|value|values|pivot|insert|Delete|find)(?=\d)/g,'$1 ');}
function dl(m,title,paragraphs,code,output,walk,trap,task,solution,check,visual){check={...check,prompt:dsaClean(check.prompt),options:check.options.map(dsaClean),explain:dsaClean(check.explain)};lesson(m,String(m.lessons.length+1).padStart(2,'0')+' · '+title,paragraphs.map(dsaClean),code,output,dsaClean(walk),dsaClean(trap),dsaClean(task),solution,check);m.lessons.at(-1).visual=visual;}
let dm=dmodule('cost','Algorithms, correctness & cost','Define a contract, prove an invariant, count time and space');
dl(dm,'From a problem to a correct algorithm',[
'An algorithm is a finite, unambiguous method for solving a specified problem. Write its input domain, output and preconditions before coding. For maximum(a), decide whether an empty list is valid. Returning zero silently is wrong when every element is negative; a clear error or an agreed sentinel is preferable.',
'Correctness has two parts: partial correctness says the result is right if the procedure terminates; termination says it eventually stops. A loop invariant is a statement true before each iteration. Establish it initially, show one iteration preserves it, then combine it with the stopping condition to prove the result.',
'For a running maximum, after processing the first k elements, best is the maximum of exactly those k elements. Initialising from a[0] establishes the invariant for k=1. Comparing each next element preserves it. At k=n, the whole input has been processed. The number of remaining elements strictly decreases, proving termination.',
'Testing samples cannot prove correctness for all inputs, but carefully selected tests expose errors. Include empty and singleton inputs, all equal values, duplicates, negative values, already sorted and reverse sorted data. Distinguish a violated precondition from an incorrect algorithm on valid input.'
],`def maximum(a):
    if not a:
        raise ValueError("empty input")
    best = a[0]
    for x in a[1:]:
        best = max(best, x)
    return best
print(maximum([-8, -3, -10]))`,`-3`,'The prefix maximum changes from -8 to -3 and stays -3. Slicing here allocates a copy; use an index loop if constant auxiliary space is required.','A plausible-looking output is not a proof. State exactly which prefix the invariant describes.','Implement minimum with the same contract without slicing.',`def minimum(a):
    if not a: raise ValueError("empty input")
    best = a[0]
    for i in range(1, len(a)):
        if a[i] < best: best = a[i]
    return best
assert minimum([-8, -3, -10]) == -10`,q('After k elements of a running-maximum algorithm, what should best represent?',['The maximum of all possible inputs','The maximum of the processed prefix','The last element'],1,'The invariant describes the part already processed, not the unknown suffix.'));
dl(dm,'Asymptotic analysis and loop counting',[
'Measure cost as a function of input size n under a stated model: count comparisons, assignments or other unit-cost operations. O(g(n)) is an eventual upper bound, Omega(g(n)) a lower bound, and Theta(g(n)) a matching bound. These symbols do not themselves mean worst, best or average case; specify the case separately.',
'For a fixed input length, best case is the minimum cost over valid inputs and worst case the maximum. Average case needs a probability model. Expected cost may also average over an algorithm’s random choices. Saying “binary search is O(log n)” permits a constant-time successful first probe; it describes its worst-case upper bound.',
'Sequential loops add costs; truly nested full loops multiply. A triangular loop with inner lengths 0,1,...,n-1 has n(n-1)/2 iterations and Theta(n^2) cost. Repeatedly doubling or halving a quantity until it crosses n yields Theta(log n) iterations. A nested loop is not automatically quadratic if one pointer advances only n times overall.',
'Drop constants and lower-order terms for asymptotic growth, but retain exact counts when a NAT question asks for them. log bases differ by constants. The common order is 1 < log n < n < n log n < n^2 < 2^n < n!. Assume bounded-size arithmetic unless a question explicitly concerns huge integers.'
],`n = 5
pairs = 0
for i in range(n):
    for j in range(i): pairs += 1
x, steps = 1, 0
while x < n:
    x *= 2
    steps += 1
print(pairs, steps)`,`10 3`,'The triangular count is 0+1+2+3+4=10. Doubling visits 1,2,4 then stops at 8: three iterations.','An upper bound need not be tight: a linear function is also O(n^2). Prefer Theta when the question asks for a tight bound.','Count all ordered pairs i,j with 0 <= i,j < n for n=5.',`n = 5
count = sum(1 for i in range(n) for j in range(n))
assert count == n*n
print(count)`,q('The sum 1+2+...+n has which tight growth?',['Theta(log n)','Theta(n)','Theta(n^2)'],2,'n(n+1)/2 has a quadratic leading term.'),'growth');
dl(dm,'Recurrences, stack space and amortisation',[
'Recursive cost includes the work outside recursive calls and all recursive children. T(n)=T(n-1)+Theta(1) gives Theta(n); T(n)=T(n/2)+Theta(1) gives Theta(log n); T(n)=2T(n/2)+Theta(n) gives Theta(n log n). A recursion tree reveals work per level and number of levels.',
'For T(n)=aT(n/b)+Theta(n^d), compare a with b^d: smaller means Theta(n^d), equal means Theta(n^d log n), larger means Theta(n^(log_b a)), under the usual balanced-subproblem assumptions. Do not force T(n-1) or irregular recurrences into this simplified Master theorem. Sum costs directly when its assumptions fail.',
'Time and live memory are different. Depth-first execution of two recursive branches does not keep every call alive simultaneously. Recursion stack space follows maximum depth times per-frame storage. Input storage is usually excluded from auxiliary space; temporary slices and output buffers must be counted according to the question’s convention.',
'Amortised cost bounds a whole operation sequence without a probability assumption. A dynamic array append occasionally copies n elements but geometric capacity growth yields O(n) total copying over n appends and O(1) amortised append. A single resizing append is still O(n). This is distinct from expected hash-table lookup.'
],`def depth(n):
    if n <= 1: return 1
    return 1 + depth(n // 2)
print(depth(16))
capacity, copies = 1, 0
for size in range(8):
    if size == capacity:
        copies += size
        capacity *= 2
print(capacity, copies)`,`5\n8 7`,'The call chain is 16,8,4,2,1: five frames. Resizes copy 1+2+4=7 items, although most appends copy none.','Space from recursive slices can exceed the call-stack-only bound. Analyse the implementation actually shown.','Write a recurrence for two half-sized calls doing n merge operations and compute total merge work for n=8.',`def work(n):
    if n <= 1: return 0
    return 2*work(n//2) + n
assert work(8) == 24
print(work(8))`,q('T(n)=2T(n/2)+Theta(n), T(1)=Theta(1), has tight time?',['Theta(n)','Theta(n log n)','Theta(n^2)'],1,'There are log n levels with Theta(n) total work per level.'));

dm=dmodule('linear','Arrays, stacks, queues & deques','Choose representations and implement ADT operations safely');
dl(dm,'Arrays, dynamic lists and operation costs',[
'An abstract data type specifies behaviour; a data structure specifies a representation. A sequence supports an ordered collection, but an array and a linked list implement it differently. An array stores positions so indexed access is constant time under the standard memory model. Python lists are dynamic arrays of references.',
'A list append is amortised O(1); pop() at the end is O(1). Inserting or removing at index i shifts a suffix and costs O(n-i). Searching an unsorted list is O(n). Copying a length-k slice costs O(k) time and space. These costs matter even when Python syntax is one short expression.',
'Dynamic capacity is not the same as logical length. A larger reserved buffer avoids reallocating on every append. Arrays have good locality, while linked nodes pay per-node link overhead and traversal. Choose based on the actual mix of operations rather than memorising that one representation is always faster.',
'A prefix-sum array P with P[0]=0 and P[i+1]=P[i]+a[i] answers the sum of a[l:r] as P[r]-P[l] in O(1), after O(n) preparation. It uses half-open ranges and O(n) extra space. A point update invalidates later prefixes, so it is suited to static range queries.'
],`a = [4, -1, 6, 2]
p = [0]
for x in a: p.append(p[-1] + x)
print(p)
print(p[4] - p[1])`,`[0, 4, 3, 9, 11]\n7`,'The range [1,4) contains -1,6,2. Subtract the sum before index 1 from the sum before index 4.','Python list.pop(0) is linear, even if your queue algorithm uses only one such operation per iteration.','Answer inclusive range [1,2] using prefix sums.',`a = [4, -1, 6, 2]
p = [0]
for x in a: p.append(p[-1]+x)
l, r = 1, 2
assert p[r+1]-p[l] == 5`,q('Removing the first element of a Python list of length n costs?',['O(1)','O(log n)','O(n)'],2,'All following references must shift left.'));
dl(dm,'Stacks: LIFO and expression processing',[
'A stack is last-in, first-out. push adds at the top, pop removes the top, and peek reads it. An empty pop is underflow. A fixed-capacity implementation can overflow. A Python list implements the top at its right end with append and pop; using the left end would waste shifting work.',
'Balanced brackets are a stack problem because the most recently opened bracket must be the first closed. Push opening symbols. On a closing symbol, reject an empty stack or a mismatched top. Accept only if the stack is empty at the end. Each symbol is processed once: O(n) time and O(n) worst-case space.',
'For postfix evaluation, push numbers and, on an operator, pop the right operand first and then the left. Apply left op right. Infix-to-postfix conversion uses an operator stack: respect precedence and associativity, pop higher-precedence operators and equal precedence for left-associative operators, and treat parentheses as boundaries.',
'For stack permutations of input 1,2,...,n, simulate pushes until the desired next output is on top, then pop. Once a value is buried below a smaller required output that has already passed, no later push can repair the order. Simulation is safer than trying to infer feasibility visually.'
],`def balanced(text):
    stack = []
    matching = {')':'(', ']':'[', '}':'{'}
    for ch in text:
        if ch in '([{': stack.append(ch)
        elif ch in matching:
            if not stack or stack.pop() != matching[ch]: return False
    return not stack
print(balanced('([{}])'), balanced('([)]'))`,`True False`,'([)] attempts to close a parenthesis while [ is on top, so it fails immediately.','For subtraction and division, reversed pop order changes the answer.','Evaluate postfix tokens 8 3 - 2 * with a stack.',`s=[]
for token in ['8','3','-','2','*']:
    if token not in ('-','*'): s.append(int(token))
    else:
        right,left=s.pop(),s.pop()
        s.append(left-right if token=='-' else left*right)
assert s == [10]`,q('After push(1), push(2), pop(), push(3), the next pop returns?',['1','2','3'],2,'The last item pushed is the top.'),'stack');
dl(dm,'Queues, circular buffers and deques',[
'A queue is first-in, first-out: enqueue at the rear and dequeue from the front. It models service order and BFS frontiers. collections.deque supports O(1) appends and pops at both ends. A deque permits both ends; it is neither forced FIFO nor forced LIFO.',
'A circular array queue reuses slots with modulo arithmetic. One robust convention stores head and size: the next insertion index is (head+size) mod capacity. On deletion, increment head modulo capacity and decrement size. Empty means size=0; full means size=capacity. A different convention wastes one slot to distinguish full from empty: never mix them.',
'A queue implemented by two stacks pushes arrivals into an input stack. When output is empty, transfer every input element to it, reversing order. Each element moves at most once between stacks and is popped once: amortised O(1) operations, even though a single dequeue may perform O(n) work.',
'Deques also support monotonic-window algorithms: remove expired indices at the front and dominated values at the back. Each index enters and leaves once, yielding O(n) total time. This is a useful extension; basic queue questions usually focus on operation traces, overflow and wraparound.'
],`capacity = 3
buf = [None]*capacity
head, size = 0, 0
for x in [10,20,30]:
    buf[(head+size)%capacity] = x
    size += 1
head = (head+1)%capacity
size -= 1
buf[(head+size)%capacity] = 40
size += 1
print([buf[(head+i)%capacity] for i in range(size)])`,`[20, 30, 40]`,'The slot formerly holding 10 is reused for 40, but logical FIFO order begins at head=1.','Equal head and tail indices alone are ambiguous unless your full/empty convention resolves them.','Use deque to enqueue 4,5, remove 4, add 6 and list the queue.',`from collections import deque
q = deque([4,5])
assert q.popleft()==4
q.append(6)
assert list(q)==[5,6]`,q('Two stacks implement a queue. What triggers transferring input to output?',['Every enqueue','Only when output is empty and a dequeue is needed','Every peek even if output is nonempty'],1,'Transferring only when necessary preserves order and gives the amortised bound.'),'queue');

dm=dmodule('links','Linked lists & pointer reasoning','Build, insert, delete, reverse and detect cycles');
dl(dm,'Nodes, head pointers and insertion',[
'A singly linked list is a chain of nodes containing data and a next reference. head refers to the first node; None ends an acyclic list. Its nodes need not be adjacent in memory. Reaching position k requires following k links, so random access is O(n), unlike an array.',
'Prepending a node is O(1): set new.next to the old head, then set head to new. Inserting after a known node is also O(1): save its old successor in new.next before changing the predecessor’s next. Finding that predecessor may take O(n), so distinguish locating from relinking.',
'Appending is O(1) with a maintained tail pointer, otherwise O(n) to locate the end. Empty-list insertion must establish both head and tail; deleting the last element must clear both. A dummy or sentinel head simplifies boundary operations by giving the first real node a predecessor.',
'A doubly linked list adds prev references, making deletion of a known node O(1) if head/tail updates are handled. A circular list links its last node back to the first, so traversal stops when it returns to its start rather than when it sees None. Sentinel and circular conventions change the boundary cases.'
],`class Node:
    def __init__(self, value, nxt=None): self.value,self.next=value,nxt
head = Node(2, Node(4))
head = Node(1, head)
head.next.next = Node(3, head.next.next)
values=[]
p=head
while p:
    values.append(p.value)
    p=p.next
print(values)`,`[1, 2, 3, 4]`,'First prepend 1. The node containing 2 is head.next; insert 3 between it and the old successor 4.','Overwriting p.next before saving the old successor can disconnect the remaining suffix.','Build the chain 5 -> 7 -> 9 by prepending values in reverse order.',`class Node:
    def __init__(self,x,n=None): self.value,self.next=x,n
head=None
for x in [9,7,5]: head=Node(x,head)
a=[]
while head: a.append(head.value); head=head.next
assert a==[5,7,9]`,q('Inserting after an already known singly linked node costs?',['O(1) relinking','O(n) relinking','O(log n) relinking'],0,'Only a constant number of references change; locating the node is a separate cost.'),'linked');
dl(dm,'Deletion and iterative reversal',[
'To delete a node by value in a singly linked list, keep a predecessor while searching. Relink predecessor.next to current.next. Deleting the head needs a head update or a sentinel. Return a consistent result when the value is absent. Deleting by value is O(n), although the link change itself is O(1).',
'Deleting a known non-tail node by copying its successor’s data is a specialised trick, not a general deletion operation: it changes node identity semantics and cannot delete a tail this way. A doubly linked node can be unlinked directly through its prev and next references.',
'Iterative reversal maintains prev, current and next. The invariant is that prev heads the reversed processed prefix, while current heads the untouched suffix. Save current.next, reverse current.next, advance prev and current. When current becomes None, prev is the new head. Time is O(n), auxiliary space O(1).',
'Recursive reversal can be elegant but uses O(n) call frames, and long lists can exceed Python’s recursion limit. Avoid using an output array if the task asks for in-place pointer reversal. Draw nodes as stable boxes and redraw arrows; do not confuse node data with references.'
],`class Node:
    def __init__(self,x,n=None): self.value,self.next=x,n
head=Node(1,Node(2,Node(3)))
prev,cur=None,head
while cur:
    nxt=cur.next
    cur.next=prev
    prev,cur=cur,nxt
head=prev
out=[]
while head: out.append(head.value); head=head.next
print(out)`,`[3, 2, 1]`,'At each iteration one arrow reverses. Saving nxt first preserves the path to the still-unprocessed nodes.','Updating current before preserving its next link can lose either the suffix or the node being reversed.','Remove the first node with value 2 from 1 -> 2 -> 3 using a sentinel.',`class Node:
    def __init__(self,x,n=None): self.value,self.next=x,n
dummy=Node(None,Node(1,Node(2,Node(3))))
p=dummy
while p.next and p.next.value!=2: p=p.next
if p.next: p.next=p.next.next
out=[]; p=dummy.next
while p: out.append(p.value); p=p.next
assert out==[1,3]`,q('Which link must be saved before reversing current.next?',['The original current.next','The head value','Only the tail value'],0,'Once the arrow is reversed, the original suffix is no longer reachable through current.next.'),'linked');
dl(dm,'Fast/slow pointers and cycle detection',[
'Two pointers at different speeds solve linked-list questions without indexing. For finding a middle, advance slow once and fast twice until fast cannot continue. On even lengths, the chosen loop convention determines whether you return the first or second middle; state it explicitly.',
'Floyd’s cycle algorithm starts slow and fast at the head and repeatedly advances them by one and two. Compare node identity after moving. If fast reaches None, the list is acyclic. Inside a cycle, their relative displacement changes by one modulo cycle length, so they must eventually meet.',
'To locate the cycle entry after a meeting, reset one pointer to head and advance both one step until they meet again. If the distance from head to entry is mu and the cycle length is lambda, the first meeting ensures that walking mu more steps from the meeting position reaches entry modulo lambda.',
'To measure cycle length, keep one pointer at the meeting node and walk another until it returns. Time for detection and entry finding is O(mu+lambda), auxiliary space O(1). A visited-node set is simpler but uses O(n) memory; equal data values do not imply a cycle.'
],`class Node:
    def __init__(self,x): self.value,self.next=x,None
a,b,c=Node(1),Node(2),Node(3)
a.next,b.next,c.next=b,c,b
slow=fast=a
while fast and fast.next:
    slow,fast=slow.next,fast.next.next
    if slow is fast: break
p=a
while p is not slow: p,slow=p.next,slow.next
print(p.value)`,`2`,'The list enters a two-node cycle at node 2. The two phases identify that node, not merely any repeated value.','The entry-finding phase is valid only after confirming a meeting. An acyclic list needs a separate exit path.','Find the second middle of [1,2,3,4] using slow/fast pointers.',`class Node:
    def __init__(self,x,n=None): self.value,self.next=x,n
h=Node(1,Node(2,Node(3,Node(4))))
slow=fast=h
while fast and fast.next: slow,fast=slow.next,fast.next.next
assert slow.value==3`,q('Floyd detection needs which equality test on nodes?',['Equal stored values','Object identity','Equal position numbers'],1,'Different nodes can contain identical values.'));

dm=dmodule('hash','Hash tables & collision strategies','Trace chains, probing, deletion and load factor');
dl(dm,'Hash functions, load factor and chaining',[
'A hash table maps keys to bucket indices with a hash function. Equal keys must hash equally; unequal keys may collide. A collision is expected behaviour, not an error. Distinguish hash computation from compression into m buckets, such as h(k)=k mod m in textbook integer examples.',
'Separate chaining stores all keys mapping to a bucket in a list or another collection. With n keys and m buckets, load factor alpha=n/m is the average number of keys per bucket. Under a suitable uniform-hashing assumption, lookup costs expected O(1+alpha); if all keys collide, worst-case search is O(n).',
'Insertion may first search for an existing key if duplicate keys are disallowed or values must be updated. Deleting from a chain must preserve the remaining entries. A chained table can have alpha greater than one. Resizing changes the bucket count and requires rehashing every stored key.',
'Python dict and set provide useful practical hash-table interfaces, but exam problems often specify a custom h, capacity and collision scheme. Trace that scheme exactly rather than assuming Python’s implementation. Keys must have stable equality and hash while stored; mutable lists cannot be dictionary keys.'
],`m=5
buckets=[[] for _ in range(m)]
for key in [12,7,20,17]: buckets[key % m].append(key)
print(buckets)
print(17 in buckets[17 % m])`,`[[20], [], [12, 7, 17], [], []]\nTrue`,'12,7 and17 all have remainder2. Chaining keeps all three in bucket2.','Expected O(1) requires assumptions about hashing and controlled load; it is not a universal worst-case guarantee.','Delete 7 from its chain and confirm 17 remains.',`b=[[] for _ in range(5)]
for x in [12,7,20,17]: b[x%5].append(x)
b[7%5].remove(7)
assert b[2]==[12,17]`,q('With 12 keys and 8 buckets, alpha is?',['2/3','1.5','8'],1,'Load factor is keys divided by buckets.'),'hash');
dl(dm,'Linear, quadratic and double probing',[
'Open addressing stores entries in the table itself. On a collision, a deterministic probe sequence searches alternative slots. Linear probing uses (h(k)+i) mod m. Quadratic probing uses (h(k)+c1*i+c2*i^2) mod m. Double hashing uses (h1(k)+i*h2(k)) mod m. The question’s starting i is usually zero but must be checked.',
'Linear probing tends to create primary clusters: contiguous occupied runs attract further collisions. Quadratic probing reduces primary clustering but keys with the same initial hash share a probe sequence, called secondary clustering. Quadratic probes do not necessarily visit every slot.',
'For double hashing, the step must be nonzero and relatively prime to m to visit all m slots. A prime m with a step in 1..m-1 works. If m=10 and step=2, only five slots are reachable, so insertion can fail despite free slots elsewhere.',
'An open-addressed table needs unused capacity; as alpha approaches one, searches become costly. Under ideal uniform probing and 0<alpha<1, unsuccessful search takes at most 1/(1-alpha) expected probes; a successful-search bound is (1/alpha)*ln(1/(1-alpha)). These are model-dependent expectations, not worst-case guarantees. Rehash before the chosen load threshold. Bound every probe loop by a table-size limit or the known cycle length to avoid infinite loops when a key is absent or the table is full.'
],`m=7
table=[None]*m
for key in [10,17,24,5]:
    for i in range(m):
        slot=(key % m+i)%m
        if table[slot] is None:
            table[slot]=key
            break
print(table)`,`[None, None, None, 10, 17, 24, 5]`,'10 starts at3;17 probes3 then4;24 probes3,4,5;5 starts at5 and goes to6.','A free slot somewhere is insufficient if your probe sequence cannot reach it.','List a double-hash probe sequence for m=7, h1=3, h2=2.',`slots=[(3+i*2)%7 for i in range(7)]
assert len(set(slots))==7
print(slots)`,q('For double hashing with m=10, which step visits all slots?',['2','5','3'],2,'gcd(3,10)=1, whereas 2 and5 create shorter cycles.'),'hash');
dl(dm,'Deletion tombstones and practical frequency maps',[
'Search in open addressing follows the same probe sequence as insertion. An entry that has never been occupied can terminate an unsuccessful search. A deleted slot cannot: other keys may have probed beyond it. Mark deletion with a tombstone so search continues.',
'Insertion can remember the first tombstone for later reuse, but a map that must update existing keys should continue probing to check that the key does not already exist farther along the sequence. Otherwise it can accidentally create duplicates. Periodic rebuilding removes accumulated tombstones.',
'Frequency maps are a direct application: for each value x, set count[x]=count.get(x,0)+1. Expected O(n) time and O(k) space count n inputs with k distinct keys. Grouping, deduplication and two-sum use the same lookup pattern; worst-case adversarial collision cost differs from expected cost.',
'For two-sum, look for target-x among earlier elements before inserting x. This prevents using one element twice when target=2*x. Whether to return indices, values, one pair or all pairs belongs in the contract. A hash map trades memory for avoiding a quadratic pair scan.'
],`def two_sum(a, target):
    seen={}
    for i,x in enumerate(a):
        if target-x in seen: return seen[target-x],i
        seen[x]=i
    return None
print(two_sum([3,3,8],6))
print(two_sum([3],6))`,`(0, 1)\nNone`,'The second3 finds the first3 in seen; a lone3 cannot match itself.','Replacing a deleted probe slot with an ordinary empty marker can make a later present key appear absent.','Count frequencies of a,b,a,c,b,a.',`counts={}
for x in ['a','b','a','c','b','a']: counts[x]=counts.get(x,0)+1
assert counts=={'a':3,'b':2,'c':1}`,q('A tombstone encountered during lookup means?',['Stop: key absent','Continue probing','Resize immediately'],1,'An entry may have been placed later in the same collision chain.'),'hash');

dm=dmodule('search','Searching & boundary reasoning','Linear search, binary search, duplicates and monotone predicates');
dl(dm,'Linear search and sentinels',[
'Linear search inspects elements one at a time until it finds the target or exhausts the sequence. It needs no sorted order. Best-case successful cost is one comparison; worst-case successful or unsuccessful cost is n comparisons. For a uniformly distributed successful position, the average is (n+1)/2 comparisons.',
'Decide whether the result is a Boolean, the first matching index, any matching index or all matches. Returning -1 is a common index convention, but -1 is also a valid Python index, so callers must check it before indexing. Returning None avoids that ambiguity if the contract permits it.',
'A sentinel search places a guaranteed matching value at a boundary so the loop does not repeatedly test for the end. It must preserve and restore any replaced input and distinguish an original match from the sentinel. This is a constant-factor technique, not an asymptotic improvement.',
'When the data is sorted, a linear search may stop after encountering a larger value. Binary search can do better only if access to the middle is efficient. A linked list cannot jump to its middle in constant time, so binary-search comparison counts do not imply logarithmic running time on a linked list.'
],`def find_first(a,x):
    for i,value in enumerate(a):
        if value==x: return i
    return None
print(find_first([9,2,9],9))
print(find_first([],9))`,`0\nNone`,'The first9 is returned immediately. The empty sequence never enters the loop.','If a question counts equality tests, count equality tests only; do not silently mix them with loop-condition tests.','Return every matching index of 2 in [2,4,2,2].',`a=[2,4,2,2]
indices=[i for i,x in enumerate(a) if x==2]
assert indices==[0,2,3]`,q('Worst-case equality comparisons for an absent key in n unsorted items?',['1','log2 n','n'],2,'Every position must be ruled out.'));
dl(dm,'Binary search with a precise invariant',[
'Binary search requires a sorted random-access sequence and a comparison order consistent with that sorting. Maintain a candidate interval and discard a half after inspecting its middle. For an inclusive interval [lo,hi], loop while lo<=hi and update hi=mid-1 or lo=mid+1 so the interval strictly shrinks.',
'The invariant is that any existing occurrence of the target remains within the candidate interval. If a[mid]<target, all indices at or left of mid are too small; if a[mid]>target, all indices at or right of mid are too large. Empty interval proves absence. The time is O(log n), iterative extra space O(1).',
'For the common mid=(lo+hi)//2 procedure that probes one element each iteration, the maximum number of probes on n>0 elements is floor(log2 n)+1. Exact comparisons may be more than probes if the code uses both == and < tests. Use the given code and success/failure condition for exact-count questions.',
'mid=lo+(hi-lo)//2 avoids overflow in fixed-width languages. Python integers do not overflow that way. Do not mix inclusive and half-open updates: hi=mid with an inclusive loop can stall. Empty inputs, one element and missing values on either end are essential tests.'
],`def binary_search(a,x):
    lo,hi=0,len(a)-1
    while lo<=hi:
        mid=(lo+hi)//2
        if a[mid]==x: return mid
        if a[mid]<x: lo=mid+1
        else: hi=mid-1
    return None
print(binary_search([1,3,5,8,12],8))
print(binary_search([1,3,5],4))`,`3\nNone`,'The search for8 probes5 then8. For4, the candidate interval eventually becomes empty.','Binary search on unsorted input has no correctness guarantee even if one sample happens to succeed.','Record the middle indices when searching for 12 in [1,3,5,8,12].',`a=[1,3,5,8,12]; lo,hi=0,4; trace=[]
while lo<=hi:
    mid=(lo+hi)//2; trace.append(mid)
    if a[mid]==12: break
    if a[mid]<12: lo=mid+1
    else: hi=mid-1
assert trace==[2,3,4]`,q('An inclusive search with a[mid] < target should set?',['lo=mid','lo=mid+1','hi=mid-1'],1,'mid is already known not to match and must be excluded.'),'binary');
dl(dm,'Lower bounds, duplicates and binary search on answers',[
'A lower bound returns the first index whose value is at least x; an upper bound returns the first index whose value is greater than x. Both may return n. Their difference counts occurrences of x in a sorted list. Membership needs an additional index-in-range and equality test.',
'Use [lo,hi) with lo=0,hi=n. For lower bound, everything before lo is less than x and everything from hi onward is at least x. If a[mid]<x, set lo=mid+1; otherwise set hi=mid. Termination at lo=hi identifies the boundary, even when no element equals x.',
'More generally, binary search finds the first true position of a monotone predicate with false values followed by true values. Search an answer domain when feasibility is monotone, for example the smallest capacity sufficient to carry a fixed workload. First prove the direction of monotonicity and choose a domain containing a valid answer.',
'For minimum integer k with k*k>=x and x>=0, the predicate is monotone. In Python multiplication handles large integers exactly but is not truly unit-cost for arbitrarily large values. For real-valued search, use a stopping tolerance or fixed iteration count rather than expecting exact floating-point equality.'
],`def lower(a,x):
    lo,hi=0,len(a)
    while lo<hi:
        mid=(lo+hi)//2
        if a[mid]<x: lo=mid+1
        else: hi=mid
    return lo
print(lower([1,3,3,3,7],3), lower([1,3,3,3,7],9))`,`1 5`,'The first3 is at1;9 belongs after the last element at insertion index5.','Any-match binary search does not automatically return the first duplicate.','Implement upper bound and count occurrences of3 in [1,3,3,3,7].',`from bisect import bisect_left, bisect_right
a=[1,3,3,3,7]
assert bisect_right(a,3)-bisect_left(a,3)==3
lo,hi=0,len(a)
while lo<hi:
    mid=(lo+hi)//2
    if a[mid]<=3: lo=mid+1
    else: hi=mid
assert lo==4`,q('lower_bound([2,2,5], 6) returns?',['2','3','None'],1,'The insertion boundary is one past the last index.'),'binary');

dm=dmodule('sort','Selection, bubble & insertion sort','Trace passes, count inversions and distinguish stability');
dl(dm,'Selection sort and sorting vocabulary',[
'Sorting arranges items by a key. Stability preserves the input order of equal keys; in-place usually means O(1) auxiliary array storage, though recursion-stack conventions vary. Adaptivity means performance improves for already or nearly sorted input. These properties are independent of one another.',
'Selection sort repeatedly finds the minimum of the unsorted suffix and swaps it into the first unsorted position. After i passes, the prefix of length i contains the i smallest items in final order. It makes n(n-1)/2 key comparisons regardless of initial order and at most n-1 swaps.',
'Standard swap-based selection sort is in-place and Theta(n^2) in best and worst cases, and generally unstable. For [2a,2b,1], swapping the minimum1 with2a produces [1,2b,2a], reversing the equal-key records. A shifting variant can be stable but is a different implementation.',
'When tracing an exam question, record the array after the requested pass, not after every comparison unless asked. “Pass” must refer to the outer loop. A variant selecting maxima from the right has a different intermediate state, even though its final sorted output agrees.'
],`a=[4,2,3,1]
for i in range(len(a)-1):
    k=i
    for j in range(i+1,len(a)):
        if a[j]<a[k]: k=j
    a[i],a[k]=a[k],a[i]
    print(a)`,`[1, 2, 3, 4]\n[1, 2, 3, 4]\n[1, 2, 3, 4]`,'One fortunate swap sorts this input, but the remaining selection passes still perform their comparisons.','A sorted-looking array does not cause standard selection sort to stop early.','Count selection-sort key comparisons for n=6.',`n=6
comparisons=sum(n-i-1 for i in range(n-1))
assert comparisons==15`,q('Which property fails for standard swap-based selection sort?',['In-place storage','Stability','Quadratic comparison count'],1,'A distant swap can reverse equal-key records.'),'sort');
dl(dm,'Bubble sort and early termination',[
'Bubble sort compares adjacent elements and swaps an inverted pair. A left-to-right pass moves a maximum to the right end. After i complete passes, the i largest elements are fixed in the suffix, so later passes can stop before that suffix.',
'The optimised algorithm resets swapped=False at the start of each pass and sets it when a swap occurs. A pass with no swaps proves the remaining prefix is sorted, allowing termination. Its best case is Theta(n), worst case Theta(n^2), and extra space O(1). Without early termination, best-case time remains Theta(n^2).',
'Swap only when left>right to preserve stability; swapping equal keys can destroy it. Each adjacent inversion swap reduces the inversion count by one. Therefore the number of swaps performed by standard bubble sort equals the number of strict inversions in the input.',
'An inversion is a pair of indices i<j with a[i]>a[j]. Reverse sorted distinct input has n(n-1)/2 inversions. Equal values are not inversions under the strict definition. Direction matters: right-to-left bubbling fixes a minimum at the left and gives different intermediate passes.'
],`a=[3,1,2]
swaps=0
for end in range(len(a)-1,0,-1):
    changed=False
    for j in range(end):
        if a[j]>a[j+1]:
            a[j],a[j+1]=a[j+1],a[j]
            changed=True; swaps+=1
    if not changed: break
print(a,swaps)`,`[1, 2, 3] 2`,'The inversions (3,1) and(3,2) disappear in two adjacent swaps.','Best-case Theta(n) applies only to a version with an early-stop check.','List strict inversion pairs for [3,1,2,1].',`a=[3,1,2,1]
pairs=[(i,j) for i in range(len(a)) for j in range(i+1,len(a)) if a[i]>a[j]]
assert len(pairs)==4
print(pairs)`,q('An already sorted list with early-stop bubble sort takes?',['Theta(1)','Theta(n)','Theta(n^2)'],1,'One full comparison pass is still needed to establish that no swaps occur.'),'sort');
dl(dm,'Insertion sort and nearly sorted data',[
'Insertion sort grows a sorted prefix. Store the next key, shift larger prefix elements one position right, and place the key into the gap. The invariant says the processed prefix is sorted and contains the same items as the corresponding original prefix.',
'Using a[j]>key rather than >= retains the order of equal keys, so the algorithm is stable. It uses O(1) extra space, Theta(n) best-case time and Theta(n^2) worst-case time. The number of shifts equals the input’s strict inversion count.',
'If the input has I inversions, ordinary insertion sort runs in O(n+I), making it useful for small or nearly sorted runs. Binary insertion sort uses binary search to reduce comparisons but still shifts elements in an array, so its worst-case time remains quadratic.',
'Selection, bubble and insertion all have quadratic worst cases, but their pass invariants differ. Selection fixes the smallest remaining item; left-to-right bubble fixes a largest item on the right; insertion sorts the prefix without claiming it contains the globally smallest items. This distinction is central to intermediate-array questions.'
],`a=[4,2,3,1]
for i in range(1,len(a)):
    key=a[i]; j=i-1
    while j>=0 and a[j]>key:
        a[j+1]=a[j]; j-=1
    a[j+1]=key
    print(a)`,`[2, 4, 3, 1]\n[2, 3, 4, 1]\n[1, 2, 3, 4]`,'The first three elements are sorted after two insertions, although1 still lies outside the prefix.','Binary search for the insertion location does not eliminate the cost of shifting an array suffix.','Count insertion shifts for reverse input [4,3,2,1].',`a=[4,3,2,1]; shifts=0
for i in range(1,len(a)):
    key=a[i]; j=i-1
    while j>=0 and a[j]>key:
        a[j+1]=a[j]; j-=1; shifts+=1
    a[j+1]=key
assert shifts==6 and a==[1,2,3,4]`,q('After two insertion passes on [4,2,3,1], the array is?',['[1,2,3,4]','[2,3,4,1]','[2,4,1,3]'],1,'Insert2 into[4], then3 into[2,4];1 has not been processed yet.'),'sort');

dm=dmodule('divide','Merge sort & quicksort','Divide-and-conquer, partition invariants and complexity tradeoffs');
dl(dm,'Merge two sorted sequences and build merge sort',[
'Merging combines two sorted sequences using a pointer to each next unused item. Append the smaller front item, advance that pointer, and append any remaining suffix when one side empties. The output prefix always contains the smallest processed items in sorted order. Merging lengths a and b costs O(a+b).',
'Merge sort divides the input into two nearly equal parts, recursively sorts them and merges their results. The base case is size zero or one. T(n)=2T(n/2)+Theta(n) gives Theta(n log n) time in best, average and worst cases for the standard implementation.',
'To make merging stable, take the left item first on equal keys. An array merge sort usually needs O(n) auxiliary buffer space and O(log n) recursion depth. The Python slicing version below creates temporary lists; peak live storage is O(n), but total allocations across all levels are O(n log n).',
'Bottom-up merge sort avoids recursion by merging runs of width1,2,4,... until the width covers the input. Merge sort works well for external sorting and linked lists because merging is sequential. It does not require random pivot choices to guarantee its worst-case bound.'
],`def merge_sort(a):
    if len(a)<2: return a[:]
    mid=len(a)//2
    left,right=merge_sort(a[:mid]),merge_sort(a[mid:])
    out=[]; i=j=0
    while i<len(left) and j<len(right):
        if left[i]<=right[j]: out.append(left[i]); i+=1
        else: out.append(right[j]); j+=1
    return out+left[i:]+right[j:]
print(merge_sort([5,1,3,1]))`,`[1, 1, 3, 5]`,'The split yields [5,1] and[3,1], which sort to[1,5] and[1,3]. The final merge takes the left1 first.','Taking from the right on equality can destroy stability even though numeric output remains sorted.','Merge [1,4,8] and [2,4,9] iteratively.',`a,b=[1,4,8],[2,4,9]; i=j=0; out=[]
while i<len(a) and j<len(b):
    if a[i]<=b[j]: out.append(a[i]); i+=1
    else: out.append(b[j]); j+=1
out+=a[i:]+b[j:]
assert out==[1,2,4,4,8,9]`,q('A stable merge chooses which side first when keys tie?',['Left run','Right run','Either always preserves stability'],0,'The left run appeared earlier in the original input.'),'merge');
dl(dm,'Quicksort and Lomuto partition',[
'Quicksort partitions around a pivot and recursively sorts the resulting sides. In Lomuto partition with the final element as pivot, maintain a boundary i: items before i are <=pivot, items from i to the current scan index are >pivot, and the rest have not been inspected.',
'When a scanned value is <=pivot, swap it into index i and advance i. Finally swap the pivot into index i. The pivot is now at a valid final sorted position, with smaller-or-equal values to its left and larger values to its right. Recursion must exclude that pivot index.',
'Balanced splits yield Theta(n log n); repeatedly splitting into0 and n-1 gives Theta(n^2). A fixed endpoint pivot on already sorted distinct input produces the bad case for this partition. Random pivots give expected O(n log n) time, but the worst case remains quadratic.',
'Standard in-place quicksort is unstable. The partition needs O(1) working storage, but recursion consumes expected O(log n) stack and O(n) in the naive worst case. Recursing only on the smaller side and iterating on the larger bounds stack depth by O(log n), without fixing the worst-case time.'
],`def partition(a,lo,hi):
    pivot=a[hi]; i=lo
    for j in range(lo,hi):
        if a[j]<=pivot:
            a[i],a[j]=a[j],a[i]; i+=1
    a[i],a[hi]=a[hi],a[i]
    return i
a=[4,2,5,1,3]
p=partition(a,0,len(a)-1)
print(a,p)`,`[2, 1, 3, 4, 5] 2`,'The pivot3 reaches index2. Its left side[2,1] is not yet sorted; partitioning is not a full sort.','Hoare and Lomuto partition return different boundaries. Never reuse one scheme’s recursion bounds with the other.','Complete recursive quicksort using this Lomuto partition.',`def sort(a,lo,hi):
    if lo>=hi: return
    p=a[hi]; i=lo
    for j in range(lo,hi):
        if a[j]<=p: a[i],a[j]=a[j],a[i]; i+=1
    a[i],a[hi]=a[hi],a[i]
    sort(a,lo,i-1); sort(a,i+1,hi)
a=[4,2,5,1,3]; sort(a,0,len(a)-1)
assert a==[1,2,3,4,5]`,q('After partition, which claim is necessarily true?',['Both sides are sorted','The pivot is placed with the required left/right relation','The array is fully sorted'],1,'The subarrays still need recursive sorting.'),'quick');
dl(dm,'Duplicates, lower bounds and choosing a sort',[
'Two-way partition schemes can perform poorly with many equal keys. Three-way partition separates values into <pivot, =pivot and >pivot regions. Only the outer regions need recursion. The equal region is finished, avoiding unnecessary work on repeated values.',
'Any comparison sort on n distinct keys has n! possible orders to distinguish. A binary comparison decision tree therefore needs height at least ceil(log2(n!))=Omega(n log n) in the worst case. This bound applies to comparison sorting, not every imaginable sorting method.',
'Counting sort can run in O(n+k) for integer keys in a known range of size k, trading range-dependent space for fewer comparisons. Stable counting passes support radix sort. These are useful extensions; the DA syllabus explicitly names selection, bubble, insertion, merge and quicksort, which you must trace precisely.',
'Choose a sort using the needed guarantee: stable array sorting suggests merge sort or Python’s stable built-in sort; tiny nearly sorted input favours insertion sort; predictable constant extra array storage may favour heapsort; quicksort is often fast but needs pivot care. Python sorted returns a new list; list.sort mutates and returns None.'
],`a=[3,1,3,2,3,4]
pivot=3
less=[x for x in a if x<pivot]
equal=[x for x in a if x==pivot]
greater=[x for x in a if x>pivot]
print(less,equal,greater)`,`[1, 2] [3, 3, 3] [4]`,'This clear three-list demonstration costs O(n) extra space. An in-place Dutch-flag implementation uses three indices and constant working storage.','Do not describe this allocating demonstration as in-place just because its partition idea can be implemented in-place.','Counting-sort nonnegative keys [3,1,3,0,2] with maximum3.',`a=[3,1,3,0,2]; count=[0]*4
for x in a: count[x]+=1
out=[x for x,c in enumerate(count) for _ in range(c)]
assert out==[0,1,2,3,3]`,q('Why does counting sort not contradict the comparison-sort lower bound?',['It sorts incorrectly','It uses key values as indices rather than only comparisons','It always takes quadratic time'],1,'The lower bound assumes a comparison-only decision model.'),'quick');
