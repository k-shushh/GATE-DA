/* Original concept questions; official PYQs are separately sourced. */
const DSA_QUIZZES={
cost:`A loop invariant must hold when?|Before each iteration~Only for the final input~Only after a failure|0|Initialization and preservation make it available at termination.
T(n)=T(n-1)+1 has tight growth?|Theta(log n)~Theta(n)~Theta(n log n)|1|There are n successive constant-work levels.
Two consecutive n-iteration loops cost?|Theta(n)~Theta(n^2)~Theta(2^n)|0|Their counts add to 2n.
A loop doubles i from 1 while i<n. Its growth is?|Theta(n)~Theta(log n)~Theta(n^2)|1|After k iterations i is 2^k.
O(n) is a statement about what?|An upper growth bound~Always the best case~Always an exact count|0|Big-O does not itself specify which input case is being analysed.
A dynamic array resize can make one append cost?|O(n)~Always O(1) worst case~O(log n) only|0|Existing elements may need copying; amortisation concerns the sequence.
Two recursive half-size calls do n local work. Total time?|Theta(n)~Theta(n log n)~Theta(log n)|1|Each of log n levels performs linear total work.
Depth-first recursion with one constant-size frame per level and depth n uses?|O(1) stack~O(log n) stack~O(n) stack|2|All n active frames can coexist.
Best-case linear search cost is?|Theta(1)~Theta(n)~Theta(log n)|0|The first item may match.
Average-case analysis requires what?|A distribution over inputs~Only the largest input~No assumptions|0|Without a model, the meaning of average is unspecified.`,
linear:`A stack removes which item?|Oldest~Most recently pushed~Smallest|1|LIFO removes the top.
A queue removes which item?|Oldest enqueued~Largest~Newest|0|FIFO preserves arrival order.
The efficient Python queue operation is?|list.pop(0)~deque.popleft()~sorted(q).pop()|1|Deque removal from the left is constant-time.
Circular queue: capacity5, head4, size2. Next insertion index?|0~1~4|1|(4+2) mod5 is1.
Postfix 9 4 - 2 * evaluates to?|10~-10~1|0|Compute9-4 first, then multiply by2.
Stack input1,2,3 can produce which pop order?|3,1,2~3,2,1~Both|1|After popping3,2 blocks1 until2 is popped.
A deque supports removal from?|Only front~Only back~Both ends|2|Double-ended queues permit operations at either end.
Two-stack queue dequeue has what cost?|O(1) amortised, O(n) worst single operation~O(1) worst always~O(n) amortised always|0|A transfer may move many entries, but each moves at most once.
Prefix P with P[0]=0 gives sum of a[l:r] as?|P[r]-P[l]~P[r]+P[l]~P[r-1]-P[l]|0|Half-open prefix differences exclude positions before l.
With a size counter, a circular buffer is full when?|head==0~size==capacity~head==tail always|1|The size counter disambiguates full from empty.`,
links:`Random access to the kth singly linked node takes?|O(1) always~O(k) traversals~O(log k)|1|Follow next pointers from the head.
Prepending to a singly linked list takes?|O(1)~O(n)~O(n log n)|0|Change new.next and head.
Appending with a maintained tail takes?|O(1)~O(n) always~O(log n)|0|The tail identifies the attachment point.
Deleting a known doubly linked node generally needs?|A full search from head~Constant link updates~Sorting first|1|Its predecessor and successor are directly available.
During reversal, prev denotes?|The reversed processed prefix~The untouched suffix~Always the original head|0|Current points at the untouched suffix.
What distinguishes a cycle from repeated data?|Repeated node identity~Repeated value alone~Equal node lengths|0|Different nodes may store equal values.
Floyd’s detection uses which pointer speeds?|1 and2~2 and2~0 and1|0|A relative speed of one ensures a meeting inside a cycle.
After Floyd pointers meet, to find the entry?|Reset one to head and move both one step~Restart both at head at speed2~Return the meeting point always|0|The equal-speed phase compensates for the noncyclic prefix.
A circular list traversal should stop when?|It always finds None~It returns to the starting node~A value repeats|1|An intentional circular list has no terminal None link.
Iterative linked-list reversal auxiliary space is?|Theta(n)~Theta(log n)~Theta(1)|2|Only a fixed set of references is needed.`,
hash:`A hash collision means?|Two keys map to one bucket~The table is corrupt~Keys must be equal|0|Unequal keys may share a hash or bucket.
For n=15,m=10, load factor is?|1.5~0.67~5|0|Alpha=n/m.
Can separate chaining have alpha>1?|Yes~No~Only with a broken hash|0|Buckets can each contain multiple entries.
Linear probing mainly suffers from?|Primary clustering~Recursion overflow~Stable sorting|0|Contiguous runs attract more collisions.
Deleting an open-address entry should usually leave?|A never-used marker~A tombstone~No trace in all cases|1|Search must continue through the old collision chain.
Double hashing step4 with capacity8 visits how many distinct slots?|8~4~2|2|8/gcd(8,4)=2.
Under ideal uniform hashing, unsuccessful open-address search has expected probes at most?|1/(1-alpha)~1-alpha~alpha only|0|The geometric bound requires alpha<1 and uniform-probing assumptions.
A chained lookup with all n keys in one bucket may take?|O(1) worst case~O(n)~O(log n) always|1|An ordinary chain may require a full scan.
Rehashing after a capacity change means?|Only changing the capacity number~Recomputing destinations for all stored keys~Sorting keys alphabetically|1|Bucket indices depend on the new modulus or compression.
For two-sum with distinct indices, check the complement when?|Before inserting the current element~After inserting it always~Only after sorting|0|This avoids matching an element with itself.`,
search:`Linear search requires sorted input?|Yes~No~Only for absent keys|1|It can inspect arbitrary sequences.
With a uniform successful position among n items, expected linear-search comparisons are?|(n+1)/2~log2 n~n^2|0|Average the counts1 through n.
Binary search needs which combination for logarithmic running time?|Sorted order and efficient midpoint access~Any linked sequence~Only a known length|0|Both elimination and access assumptions matter.
Inclusive binary-search loop condition is?|lo<hi only~lo<=hi~lo==hi only|1|A single remaining candidate must still be examined.
For n=15, maximum midpoint probes in standard binary search is?|3~4~15|1|floor(log2 15)+1=4.
lower_bound([1,2,2,5],2) is?|1~2~3|0|It returns the first value at least2.
upper_bound([1,2,2,5],2) is?|1~2~3|2|It returns the first value strictly greater than2.
An empty list’s lower bound for any x is?|-1~0~An error|1|The insertion boundary is index0.
Binary search on a predicate needs?|A monotone false-to-true boundary~Any arbitrary truth pattern~A balanced tree|0|Discarding a half is valid only with monotonicity.
If a[mid]<x in lower-bound search, update?|hi=mid~lo=mid+1~lo=mid-1|1|Mid and everything left are excluded.`,
sort:`Standard selection sort makes how many key comparisons on n items?|n(n-1)/2~n~log2 n|0|Suffix lengths are n-1,n-2,...,1.
Standard selection sort is generally?|Stable~Unstable~Linear time|1|Distant swaps can reverse equal keys.
One left-to-right bubble pass fixes what?|A maximum at the right end~A minimum at the right end~Every item|0|The largest encountered value bubbles right.
Early-stop bubble best-case time is?|Theta(1)~Theta(n)~Theta(n^2)|1|One no-swap pass verifies sorted order.
Insertion sort’s processed prefix is?|Sorted but not necessarily globally smallest~Always the globally smallest keys~Unchanged|0|Later keys can be smaller than every processed one.
To keep insertion sort stable, shift while?|a[j]>=key~a[j]>key~a[j]==key|1|Equal earlier keys should remain before the new key.
Strict inversions in [3,2,1] number?|2~3~6|1|Pairs(3,2),(3,1),(2,1).
Binary insertion sort’s array shifts can still cost?|Theta(n^2) total~Theta(log n) total~Zero|0|Fewer comparisons do not remove movement costs.
Which named elementary sort is naturally adaptive to few inversions?|Selection~Insertion~Neither|1|Insertion work is O(n+I) for I inversions.
After one insertion pass on [5,2,4,1], state is?|[1,2,4,5]~[2,5,4,1]~[2,4,1,5]|1|Only2 has been inserted into the prefix[5].`,
divide:`Merging sorted lengths p and q takes?|O(p+q)~O(p*q) always~O(log(p+q))|0|Each pointer advances at most its run length.
Standard merge sort worst-case time is?|Theta(n^2)~Theta(n log n)~Theta(n)|1|Balanced levels each perform linear merging work.
Stable merging resolves equal keys by choosing?|The earlier left-run record~The right-run record~A random record|0|That preserves original equal-key order.
Lomuto partition puts the pivot where?|At a valid final sorted position~Always index0~Always the middle index|0|Its rank determines the split, not a balance guarantee.
Endpoint-pivot quicksort on sorted distinct data can take?|Theta(n^2)~Always Theta(n log n)~Theta(n)|0|Each split can have sizes0 and n-1.
Random-pivot quicksort expected time is?|Theta(n log n)~Guaranteed Theta(n)~Guaranteed worst-case Theta(n log n)|0|Expectation does not remove the quadratic worst case.
Three-way partition is especially useful for?|Many duplicates~Only distinct sorted keys~Empty graphs|0|The equal region is removed from further recursion.
Comparison sorting’s worst-case lower bound is?|Omega(n log n)~Omega(n^2)~Omega(1) only|0|The decision tree must distinguish n! orders.
Standard in-place quicksort is usually?|Stable~Unstable~A noncomparison sort|1|Partition swaps can reverse equal records.
Merge sort’s recursion depth on balanced splits is?|Theta(n)~Theta(log n)~Theta(n log n)|1|Each level halves the subproblem size.`,
trees:`Leaf height under the edge-count convention is?|0~1~2|0|The longest downward path has zero edges.
A perfect binary tree of height3 has nodes?|7~8~15|2|2^(3+1)-1=15.
A full binary tree with7 internal nodes has leaves?|6~7~8|2|Leaves=internal nodes+1.
Inorder traversal of a distinct-key BST yields?|Sorted keys~Insertion order always~Level order|0|The left-root-right property applies recursively.
Preorder begins with?|The root~The smallest key always~The last leaf|0|Preorder visits root before subtrees.
Which pair uniquely determines a binary tree with distinct labels?|Preorder and inorder~Preorder and postorder always~Only preorder|0|Inorder separates the root’s left and right subtrees.
A complete binary tree fills its last level?|Right to left~Left to right~Arbitrarily|1|There are no gaps before the last occupied position.
Deleting a two-child BST node can use?|Its inorder successor~Any leaf anywhere~Its largest descendant always|0|The successor preserves the BST ordering when then removed.
BST operation time is most precisely?|O(h) for height h~Always O(log n)~Always O(1)|0|An ordinary BST may be skewed.
A rotation preserves?|Inorder key order~Every node’s depth~The root identity|0|It changes structure while retaining the search-order relation.`,
heaps:`In a min-heap, the root is?|A minimum~A median~A maximum|0|Parent order holds along every path.
Zero-based children of index i are?|2i and2i+1~2i+1 and2i+2~i+1 andi+2|1|These are the complete-tree array positions.
Heap insertion needs at most?|O(log n) sift-up work~O(n^2)~O(1) always|0|The new item can travel one root-to-leaf path.
Extract-min first replaces the root with?|The last leaf~An arbitrary median~A new zero|0|This preserves complete-tree shape before sift-down.
Bottom-up heapify is?|Theta(n)~Theta(n log n)~Theta(n^2)|0|Most nodes have small subtree height.
A heap’s array is necessarily sorted?|Yes~No~Only for n>10|1|Only parent-child priority order is guaranteed.
Heapsort on an array is generally?|Stable~Unstable~Expected quadratic|1|Root-to-end swaps can reverse equal-key records.
To retain largest k items, keep what heap of size k?|A min-heap~A FIFO queue~A max-heap and remove maximum|0|The smallest retained item is the replacement threshold.
Priority queue is a/an?|Abstract data type~Only one array layout~Sorting invariant|0|A heap is one implementation of the behaviour.
Standard iterative heapsort auxiliary array space is?|O(1)~O(n) mandatory~O(n^2)|0|Sift-down operates inside the input array.`,
graphs:`An undirected simple graph with5 vertices has at most edges?|10~20~25|0|Choose an unordered pair of distinct vertices.
Sum of undirected degrees equals?|E~2E~V+E|1|Every edge contributes two endpoints.
Total directed indegree equals?|E~2E~V|0|Each directed edge has one head.
Adjacency-list space is?|O(V+E)~Always O(V^2)~O(1)|0|Store vertices plus their incident/outgoing entries.
Matrix edge lookup takes?|O(1)~O(V)~O(E)|0|Access the cell for the vertex pair.
A self-loop prevents bipartiteness?|Yes~No~Only if weighted|0|The same vertex cannot have opposite colours to itself.
An undirected connected graph with no cycle is?|A tree~Always complete~A DAG by definition|0|This is the tree definition.
A directed graph is strongly connected when?|Every ordered pair has a directed path~Ignoring directions makes it connected~It has one edge|0|Both directions of reachability are required.
To preserve a zero-weight edge, absence should use?|An unambiguous marker such as infinity~Always numeric zero~The same value as the edge|0|Otherwise zero-weight edges and missing edges cannot be distinguished.
A triangle plus an isolated vertex has components?|1~2~4|1|The triangle is one component and the isolated vertex another.`,
traversal:`BFS uses which frontier?|Queue~Stack only~Sorted output array|0|FIFO exploration produces distance layers.
DFS recursion implicitly uses?|A stack~A FIFO queue~A hash function only|0|Active calls retain the return path.
BFS distances are shortest when edges have?|Equal positive weight or unit cost~Arbitrary signed weights~Arbitrary nonnegative weights always|0|Ordinary BFS minimises number of edges.
With adjacency lists, full BFS/DFS time is?|O(V+E)~O(VE) always~O(V^2) always|0|Each vertex and edge is handled a bounded number of times.
For directed DFS, a grey-neighbour edge is?|A cycle witness~Always safe~A shortest-path guarantee|0|It reaches an active ancestor.
For undirected cycle detection, the immediate parent edge is?|Ignored as the same tree edge~Always a cycle~Always absent|0|Each undirected edge is represented in both directions.
Kahn’s algorithm starts with vertices of?|Indegree0~Outdegree0~Maximum weight|0|They have no unfulfilled incoming dependencies.
If Kahn outputs fewer than V vertices, the graph has?|A directed cycle~No edges~Exactly one component|0|The remaining dependency cycle never reaches indegree0.
For a DAG, reverse DFS finishing order is?|A topological order~Always BFS order~Always numerical order|0|Every edge respects the reversed completion order.
Two eligible Kahn vertices at a step imply?|More than one topological order~No topological order~A mandatory cycle|0|Either eligible vertex can be chosen first.`,
paths:`Relaxation replaces d[v] when?|d[u]+w<d[v]~d[u]>d[v] always~v has a smaller label|0|Only a cheaper discovered route improves the bound.
Dijkstra settles the vertex with?|Smallest tentative total distance~Smallest outgoing edge~Fewest neighbours|0|The global frontier minimum is the greedy choice.
Dijkstra permits zero-weight edges?|Yes~No~Only in trees|0|Its assumption is nonnegative, not strictly positive.
Bellman–Ford uses at most ordinary passes?|V-1~E-1 always~V^2|0|A simple shortest path has at most V-1 edges.
An improvement on an extra Bellman–Ford pass indicates?|A reachable negative cycle~Any positive cycle~An isolated vertex|0|No simple finite optimal path can need more than V-1 edges.
Floyd–Warshall time and space are?|O(V^3), O(V^2)~O(V+E), O(V)~O(VE), O(E)|0|Three vertex loops update a distance matrix.
In Floyd–Warshall, D[k][k]<0 indicates?|A negative cycle~A zero-weight path only~An unreachable vertex|0|A negative-cost closed walk contains a negative cycle.
A DAG with negative edges should use?|Topological relaxation~Ordinary BFS always~No algorithm can work|0|Acyclic dependencies allow a single relaxation pass.
0–1 BFS places a zero-edge improvement at?|Deque front~Deque back always~An arbitrary position|0|It belongs before larger-distance frontier entries.
An MST guarantees source shortest paths?|Always~No~Only because it has V-1 edges|1|Minimum total tree weight and source distances are distinct objectives.`,
extend:`A greedy choice needs what to establish correctness?|A proof such as exchange or cut reasoning~One successful example~A fast implementation only|0|Local attractiveness alone is insufficient.
For coins1,3,4 and target6, the minimum count is?|2~3~6|0|3+3 beats greedy4+1+1.
Kruskal processes edges by?|Increasing weight~Vertex label only~Decreasing indegree|0|It repeatedly considers a lightest remaining candidate.
Disjoint-set union answers whether vertices are?|In the same current component~At equal BFS distance~Adjacent necessarily|0|It tracks partition membership.
Path compression changes what?|Parent pointers toward representatives~Original graph edges~Edge weights|0|It accelerates later find operations.
Memoisation stores?|Results indexed by subproblem state~Only final output~Every possible input file|0|Repeated states reuse their computed answers.
Explicitly listing all subsets of n items requires at least?|Exponential output count~Only linear output~Logarithmic output|0|There are2^n subsets.
Coin-change DP with amount A and k denominations costs?|O(Ak)~O(log A) always~O(k) always|0|Each amount considers every usable denomination.
A route planner should validate negative weights?|Across the whole input before relying on Dijkstra~Only after returning a route~Never|0|Early exit may leave invalid edges unexamined.
Which validation is independent of the implementation?|Compare small Dijkstra results with Bellman–Ford~Repeat the same code twice~Rename variables|0|Independent methods can reveal different classes of bugs.`
};
for(const mod of COURSE.filter(m=>m.track==='dsa')){
  const key=mod.id.slice(4);
  mod.questions=DSA_QUIZZES[key].split('\n').map((row,i)=>{const [prompt,options,answer,explain]=row.split('|');return {...q(dsaClean(prompt),options.split('~').map(dsaClean),Number(answer),dsaClean(explain)),id:mod.id+'-q'+i,kind:'Original DSA conceptual'};});
  for(const [i,item] of mod.questions.entries()){const shift=i%item.options.length;item.options=item.options.slice(shift).concat(item.options.slice(0,shift));item.answer=(item.answer-shift+item.options.length)%item.options.length;}
  mod.cards=mod.questions.slice(0,5).map((item,i)=>({id:mod.id+'-card'+i,front:item.prompt,back:item.options[item.answer]+' — '+item.explain}));
  mod.lessons.forEach(l=>{l.check.id=l.id+'-check';l.check.kind='DSA lesson checkpoint';});
}
window.DSA_FINAL=[
q('A two-stack queue performs n enqueues followed by n dequeues. Total stack operations grow as?',['Theta(n)','Theta(n log n)','Theta(n^2)'],0,'Each item is pushed into input, transferred once and popped from output.'),
q('Linear probing: m=7, insert10,17,24. Delete17. To find24 correctly, its old slot must be?',['Never-used empty','A tombstone','Removed from the array'],1,'The search from slot3 must continue through the deleted slot4 to slot5.'),
q('Lower and upper bounds for3 in [1,3,3,5] are?',['1 and2','1 and3','2 and3'],1,'Lower is first >=3; upper is first >3. Their difference2 counts duplicates.'),
q('After one Lomuto partition with last pivot3 on [4,2,5,1,3], state is?',['[1,2,3,4,5]','[2,1,3,4,5]','[4,2,3,1,5]'],1,'2 and1 move into the <=pivot region before the pivot swaps into index2.'),
q('A complete binary tree with10 nodes has edge-height?',['3','4','9'],0,'floor(log2 10)=3.'),
q('A graph has edges A->B weight5, A->C weight1, C->B weight1. Shortest A->B cost?',['5','2','1'],1,'The indirect path throughC costs2; BFS would only minimise edge count.'),
q('Which statement distinguishes a heap from a BST?',['Both support arbitrary-key logarithmic search','Heap order only compares ancestors and descendants by priority','A heap cannot use an array'],1,'The heap has no BST left/right separation for searching.'),
q('A directed DFS edge to a finished black vertex means?',['A cycle certainly exists','A cycle need not exist','The graph is disconnected'],1,'Only an edge to an active grey vertex directly witnesses a directed DFS cycle.'),
q('For T(n)=2T(n/2)+n, time and recursion depth are?',['Theta(n log n) and Theta(log n)','Theta(n^2) and Theta(n)','Theta(n) and Theta(n)'],0,'Each balanced level does linear total work; there are logarithmically many levels.'),
q('A binary tree has distinct labels, preorder A B D C and inorder D B A C. Its postorder is?',['D B C A','B D C A','D C B A'],0,'A is root; its left subtree is B with left child D, and its right subtree is C. Postorder visits D, B, C, then A.')
].map((x,i)=>({...x,prompt:dsaClean(x.prompt),options:x.options.map(dsaClean),explain:dsaClean(x.explain),id:'dsa-final-'+i,kind:'Original DSA final review'}));
