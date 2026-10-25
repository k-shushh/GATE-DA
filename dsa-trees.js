/* Trees and graph algorithms: continuation of the DSA track. */
dm=dmodule('trees','Trees, traversals & search trees','Understand structure, reconstruct traversals and maintain a BST');
dl(dm,'Tree terminology and traversal orders',[
'A tree is a connected undirected graph with no cycles. A nonempty tree with n vertices has n-1 edges and exactly one simple path between any two vertices. A rooted tree introduces parent/child relations. A node’s depth is its distance from the root; height is the longest downward path to a leaf. Here height counts edges, so a leaf has height0.',
'A binary tree allows at most two children, distinguished as left and right. Full means every node has zero or two children. Complete means all levels except possibly the last are full and the last is filled left to right. Perfect means every internal node has two children and all leaves share a depth. These words are not interchangeable.',
'For binary trees of height h, maximum nodes are 2^(h+1)-1, while a skewed tree of that height has h+1 nodes. In a full binary tree, leaves=internal nodes+1. A complete binary tree has height floor(log2 n) for n>0. State whether height counts edges or nodes before substituting formulas.',
'Preorder visits root,left,right; inorder left,root,right; postorder left,right,root. Level order uses a queue. Each traversal takes O(n) time. Recursive depth-first traversals use O(h) stack; level order may hold O(width) nodes, which can be O(n). Inorder is sorted only for a binary search tree, not an arbitrary binary tree.'
],`tree=('A',('B',None,None),('C',('D',None,None),None))
def walk(t,order):
    if t is None: return []
    x,left,right=t
    if order=='pre': return [x]+walk(left,order)+walk(right,order)
    if order=='in': return walk(left,order)+[x]+walk(right,order)
    return walk(left,order)+walk(right,order)+[x]
for order in ['pre','in','post']: print(''.join(walk(tree,order)))`,`ABCD\nBADC\nBDCA`,'VisitA before both subtrees for preorder, betweenB and theC subtree for inorder, and after both subtrees for postorder. This simple list-concatenation implementation can cost more than linear on skewed trees; an append-to-output traversal avoids that overhead.','A complete tree need not be full, and a full tree need not be complete.','Write a linear-time inorder traversal using an output list and append.',`t=('A',('B',None,None),('C',('D',None,None),None)); out=[]
def visit(t):
    if t:
        visit(t[1]); out.append(t[0]); visit(t[2])
visit(t)
assert out==['B','A','D','C']`,q('A tree with 9 vertices has how many edges?',['8','9','10'],0,'A connected acyclic undirected graph has n-1 edges.'),'tree');
dl(dm,'Reconstructing trees and binary search insertion',[
'With distinct keys, preorder plus inorder uniquely determines a binary tree: the first preorder item is the root; locate it in inorder to separate left and right subtrees; recurse on matching segments. Postorder plus inorder also works, using the last postorder item as root.',
'Preorder plus postorder does not uniquely determine an arbitrary binary tree, because a lone child may be left or right. Duplicate labels also destroy the simple uniqueness argument unless extra identity information is supplied. For reconstruction, a map from value to inorder index avoids repeated linear searches.',
'A binary search tree (BST) has every left-subtree key less than the node key and every right-subtree key greater, assuming distinct keys. This is a global subtree property, not just a parent-child comparison. If duplicates are allowed, specify whether to count them at a node or place them on a chosen side.',
'Search and insertion follow comparisons from the root and cost O(h). Balanced height gives O(log n); sorted insertion into an ordinary BST can create a chain with O(n) height. Inorder traversal lists its keys sorted. For a fixed insertion order, draw each insertion path; never assume the resulting tree is balanced.'
],`class Node:
    def __init__(self,k): self.key,self.left,self.right=k,None,None
def insert(t,k):
    if t is None: return Node(k)
    if k<t.key: t.left=insert(t.left,k)
    elif k>t.key: t.right=insert(t.right,k)
    return t
def inorder(t,out):
    if t: inorder(t.left,out); out.append(t.key); inorder(t.right,out)
root=None
for k in [5,2,8,1,3]: root=insert(root,k)
out=[]; inorder(root,out)
print(out)`,`[1, 2, 3, 5, 8]`,'5 is root,2 and8 become its children, then1 and3 attach below2. Duplicate insertion is ignored in this contract.','Checking only child keys is insufficient: a descendant can violate an ancestor’s bound.','Reconstruct the root and left/right inorder segments for preorder A B D E C and inorder D B E A C.',`pre=list('ABDEC'); ino=list('DBEAC')
root=pre[0]; split=ino.index(root)
assert root=='A' and ino[:split]==list('DBE') and ino[split+1:]==['C']`,q('Inserting sorted distinct keys into an unbalanced BST can produce height?',['Theta(1)','Theta(log n)','Theta(n)'],2,'Every new key can extend the same rightward chain.'),'tree');
dl(dm,'BST deletion, successor and balanced-tree ideas',[
'Deleting a BST node has three structural cases. A leaf is removed directly. A node with one child is replaced by that child. A node with two children can copy its inorder successor’s key, then delete that successor from the right subtree; the successor has no left child.',
'The successor is the minimum of a nonempty right subtree. Without a right subtree, it is the lowest ancestor for which the node lies in the left subtree. A predecessor is symmetric. Deletion must return the possibly changed subtree root, including when deleting the overall root.',
'BST correctness depends on keeping all ancestor bounds valid. A validator should pass an allowed (low,high) range down the tree; merely checking left.key<root.key<right.key misses deeper violations. Search, insertion and deletion are all O(h), not automatically O(log n).',
'Balanced search trees maintain height logarithmic through structural rules. An AVL tree requires left and right subtree heights to differ by at most one; rotations preserve inorder order while restoring balance. LL/RR cases use one rotation and LR/RL two. Detailed AVL and red-black implementation is enrichment beyond the named DA tree basics, but recognising height versus node count is valuable.'
],`def delete(t,key):
    if t is None: return None
    k,left,right=t
    if key<k: return (k,delete(left,key),right)
    if key>k: return (k,left,delete(right,key))
    if left is None: return right
    if right is None: return left
    s=right
    while s[1] is not None: s=s[1]
    return (s[0],left,delete(right,s[0]))
t=(5,(2,None,None),(8,(6,None,None),(9,None,None)))
print(delete(t,5))`,`(6, (2, None, None), (8, None, (9, None, None)))`,'6 is the minimum in5’s right subtree. It replaces5, and the old6 node is then removed. This immutable-tuple version copies the O(h) search path.','Returning a changed subtree without assigning it back to its parent leaves the original tree unchanged.','Delete a root with only one child and verify the child becomes the root.',`def remove_root(t):
    k,left,right=t
    if left is None: return right
    if right is None: return left
    raise ValueError('two-child case needs successor')
assert remove_root((5,(2,None,None),None))==(2,None,None)`,q('The minimum node of a BST’s right subtree cannot have which child?',['Left child','Right child','Either child'],0,'If it had a left child, that child would have a smaller key.'),'tree');

dm=dmodule('heaps','Heaps & priority queues','Tree-backed priorities, heapify and heapsort','DSA supporting topic');
dl(dm,'Binary heaps and sift operations',[
'A min-heap is a complete binary tree where every parent key is no greater than its children. Only the root is guaranteed to be a global minimum; siblings and subtrees are not fully sorted. A max-heap reverses the comparison. The completeness property keeps height O(log n).',
'In a zero-based array, children of i are2i+1 and2i+2 and its parent is(i-1)//2 for i>0. Insertion appends at the next leaf position and sifts up while parent order is violated. Extract-min replaces the root with the last leaf, removes that leaf, then sifts down toward the smaller child.',
'Peek is O(1), insert and extract are O(log n), and searching for an arbitrary value is O(n) in the worst case. A priority queue is the ADT; a heap is an implementation. It can support schedulers, top-k selection and Dijkstra’s frontier.',
'Python heapq implements a min-heap. For max-priority behaviour portable across versions, store negated numeric priorities. Tuples compare lexicographically; use a counter as a tie-breaker when tasks themselves cannot be compared. Never assume list iteration over a heap yields sorted order.'
],`import heapq
h=[]
for x in [7,2,9,1]: heapq.heappush(h,x)
print(h[0])
print([heapq.heappop(h) for _ in range(len(h))])`,`1\n[1, 2, 7, 9]`,'The root tracks the minimum as insertions sift upward. Repeated extraction, not ordinary iteration, yields sorted order.','A heap is not a BST: it has parent-child priority order but no left-smaller/right-larger search rule.','Keep the largest three values of [4,8,1,7,6] in a min-heap.',`import heapq
h=[]
for x in [4,8,1,7,6]:
    heapq.heappush(h,x)
    if len(h)>3: heapq.heappop(h)
assert sorted(h)==[6,7,8]`,q('Searching a binary heap for an arbitrary key is worst-case?',['O(1)','O(log n)','O(n)'],2,'Heap order does not identify a unique search branch.'),'heap');
dl(dm,'Bottom-up heap construction and heapsort',[
'Bottom-up heap construction sifts down every internal node from the last one toward the root. Leaves are already heaps. When a node is processed, both child subtrees satisfy heap order, so one sift-down repairs the entire subtree.',
'Although one sift-down can take O(log n), most nodes lie near the leaves. At most about n/2^(h+1) nodes have height h, so total work is bounded by n times the convergent sum of h/2^h. Thus bottom-up heapify is O(n), while n separate heap insertions have O(n log n) worst-case cost.',
'Heapsort builds a max-heap, swaps the root with the last active element, reduces the active heap size and restores order. The sorted suffix grows from right to left. It takes O(n log n) time in the standard worst case, O(1) auxiliary space with iterative sift-down, and is generally unstable.',
'The active heap boundary is separate from total array length. A sift-down that accidentally enters the sorted suffix corrupts the result. Heapify is also useful before repeated priority operations: avoid paying for n individual pushes when all data is already available.'
],`def sift(a,i,n):
    while 2*i+1<n:
        c=2*i+1
        if c+1<n and a[c+1]>a[c]: c+=1
        if a[i]>=a[c]: break
        a[i],a[c]=a[c],a[i]; i=c
a=[4,1,3,2]
for i in range(len(a)//2-1,-1,-1): sift(a,i,len(a))
for end in range(len(a)-1,0,-1):
    a[0],a[end]=a[end],a[0]
    sift(a,0,end)
print(a)`,`[1, 2, 3, 4]`,'Each extraction fixes a largest remaining item in the suffix. Passing end as the heap size excludes that fixed item.','Multiplying n by the maximum sift height gives a loose O(n log n) bound for heapify; summing actual heights yields the tight O(n) bound.','Heapify [9,1,5,2] with heapq and verify each parent is no larger than its children.',`import heapq
a=[9,1,5,2]; heapq.heapify(a)
assert all(a[(i-1)//2]<=a[i] for i in range(1,len(a)))`,q('Bottom-up construction of a binary heap from n values costs?',['Theta(n)','Theta(n log n)','Theta(n^2)'],0,'The sum of node heights is linear.'),'heap');

dm=dmodule('graphs','Graph fundamentals & representations','Vertices, edges, connectivity and storage choices');
dl(dm,'Graph vocabulary and counting facts',[
'A graph G=(V,E) consists of vertices and edges. Undirected edges join unordered pairs; directed edges have a tail and head. Weighted edges attach a cost. A simple graph has no self-loops or parallel edges. Count formulas depend on those assumptions.',
'An undirected simple graph on n vertices has at most n(n-1)/2 edges; a directed simple graph without self-loops has at most n(n-1). The undirected degree sum is2|E|, because each edge contributes two endpoints. In a directed graph, total indegree=total outdegree=|E|.',
'A walk may repeat vertices and edges; a path here means no repeated vertices; a cycle returns to its start without other repeated vertices. An undirected connected graph has a path between every pair. A connected component is a maximal connected vertex set. In directed graphs, strong connectivity requires reachability in both directions; weak connectivity ignores directions.',
'A directed acyclic graph is a DAG. An undirected forest is a collection of trees and, with n vertices and c components, has n-c edges. A bipartite graph splits vertices into two groups with edges only across groups; an undirected graph is bipartite exactly when it has no odd cycle.'
],`edges=[(0,1),(1,2),(2,3),(3,0)]
degree=[0]*4
for u,v in edges:
    degree[u]+=1; degree[v]+=1
print(degree,sum(degree),2*len(edges))`,`[2, 2, 2, 2] 8 8`,'A four-cycle gives every vertex degree2. The degree sum counts each of its four edges twice.','An undirected edge appears twice in an adjacency list but is still one edge in |E|.','Compute maximum edges for a simple undirected graph with6 vertices.',`n=6
assert n*(n-1)//2==15`,q('A forest with 10 vertices and 3 components has how many edges?',['7','9','13'],0,'Summing (vertices-1) over three tree components gives10-3.'),'graph');
dl(dm,'Adjacency lists, matrices and edge lists',[
'An adjacency list stores each vertex’s outgoing neighbours. It takes O(V+E) space and enumerates neighbours of u in O(deg(u)). A matrix stores one entry per ordered vertex pair and uses O(V^2) space. Testing a specific edge is O(1) in a matrix but typically O(deg(u)) in an unsorted neighbour list.',
'An undirected adjacency matrix is symmetric. A directed one need not be. A weighted representation must distinguish no edge from a zero-weight edge: use infinity or None for absence, not an ambiguous zero. A diagonal zero usually represents a zero-length path, not necessarily a self-loop.',
'An edge list stores triples(u,v,w), useful when an algorithm scans all edges, as Bellman-Ford does. For an undirected graph, either store both directions for relaxation or explicitly relax both ways. Isolated vertices must still appear in the vertex set even if no edge names them.',
'Representation changes traversal complexity: scanning every row of a matrix costs O(V^2), while adjacency-list BFS/DFS takes O(V+E). Sparse graphs favour lists; dense graphs can justify matrices. State whether parallel edges are retained, collapsed or combined by minimum weight.'
],`n=4
edges=[(0,1),(1,2)]
adj=[[] for _ in range(n)]
mat=[[False]*n for _ in range(n)]
for u,v in edges:
    adj[u].append(v); adj[v].append(u)
    mat[u][v]=mat[v][u]=True
print(adj)
print(mat[0][2],mat[1][2])`,`[[1], [0, 2], [1], []]\nFalse True`,'Vertex3 is isolated but preserved as an empty list. The matrix makes direct edge tests immediate.','A zero edge weight is a valid weight; do not confuse it with absence.','Build directed adjacency lists for 0->1 and2->1.',`adj=[[] for _ in range(3)]
for u,v in [(0,1),(2,1)]: adj[u].append(v)
assert adj==[[1],[],[1]]`,q('Adjacency-matrix storage for V vertices is?',['O(V)','O(V+E) always','O(V^2)'],2,'There is a cell for each ordered pair.'),'graph');
dl(dm,'Reachability, components and bipartite colouring',[
'To count connected components of an undirected graph, launch a traversal from every still-unvisited vertex and increment a counter each time. A single traversal from one source reaches only its own component; isolated vertices each form a component.',
'Bipartite testing assigns one of two colours. Start an uncoloured component arbitrarily with colour0 and assign each newly discovered neighbour the opposite colour. An edge joining equal colours proves failure. Perform this across all components, not just the component containing vertex0.',
'A tree is bipartite because root-depth parity gives a valid two-colouring. An odd cycle cannot alternate two colours back to its start; an even cycle can. A self-loop immediately violates bipartiteness. The test costs O(V+E) on adjacency lists.',
'Directed reachability is not symmetric. A DFS following outgoing edges can answer whether v is reachable from u, but repeated such searches are not directly a strong-component algorithm. Kosaraju/Tarjan algorithms are enrichment; distinguish their purpose from ordinary undirected components.'
],`from collections import deque
def bipartite(adj):
    colour={}
    for start in range(len(adj)):
        if start in colour: continue
        colour[start]=0; q=deque([start])
        while q:
            u=q.popleft()
            for v in adj[u]:
                if v not in colour: colour[v]=1-colour[u]; q.append(v)
                elif colour[v]==colour[u]: return False
    return True
print(bipartite([[1,2],[0,2],[0,1]]))
print(bipartite([[1,3],[0,2],[1,3],[0,2]]))`,`False\nTrue`,'The triangle fails because two adjacent vertices receive the same colour. The four-cycle alternates consistently.','A graph with one bipartite component and a separate triangle is not bipartite.','Count components of the undirected graph [[1],[0],[]].',`adj=[[1],[0],[]]; seen=set(); components=0
for s in range(len(adj)):
    if s in seen: continue
    components+=1; stack=[s]; seen.add(s)
    while stack:
        for v in adj[stack.pop()]:
            if v not in seen: seen.add(v); stack.append(v)
assert components==2`,q('Which graph is not bipartite?',['Any tree','A four-cycle','A triangle'],2,'A triangle is an odd cycle.'),'bfs');

dm=dmodule('traversal','BFS, DFS & topological order','Trace frontiers, timestamps, cycles and dependency ordering');
dl(dm,'Breadth-first search and shortest-hop paths',[
'BFS explores in nondecreasing number of edges from a source. Mark the source discovered, enqueue it, then repeatedly dequeue a vertex and discover its unseen neighbours. Mark a vertex when enqueuing, not when removing it, so multiple incoming edges do not create duplicate queue entries.',
'Store dist[source]=0 and dist[v]=dist[u]+1 when v is first discovered from u. The queue contains vertices in distance layers, so the first discovery is a shortest-hop distance. Parent pointers reconstruct one shortest path; equal-length alternatives depend on neighbour order.',
'With adjacency lists, each reachable vertex is enqueued once and each outgoing edge scanned once: O(V+E) time and O(V) extra space. To traverse a disconnected graph fully, restart from unvisited vertices. Distances for unreachable vertices remain a sentinel, such as -1 or infinity.',
'BFS optimises the number of edges, which equals total cost only when all edges have the same positive weight. With arbitrary weights, a one-edge route can be more expensive than a two-edge route. Do not apply ordinary BFS to a weighted shortest-path task unless that assumption is justified.'
],`from collections import deque
adj=[[1,2],[3],[3],[]]
dist=[-1]*4; parent=[None]*4
dist[0]=0; q=deque([0])
while q:
    u=q.popleft()
    for v in adj[u]:
        if dist[v]==-1:
            dist[v]=dist[u]+1; parent[v]=u; q.append(v)
path=[]; v=3
while v is not None: path.append(v); v=parent[v]
print(dist)
print(path[::-1])`,`[0, 1, 1, 2]\n[0, 1, 3]`,'Vertex3 can be reached through1 or2. Because1 is processed first, this traversal chooses parent1.','Different valid BFS orders can yield different parent trees while retaining the same distances.','Change neighbour order at0 to[2,1] and predict parent[3].',`from collections import deque
a=[[2,1],[3],[3],[]]; p={0:None}; q=deque([0])
while q:
    u=q.popleft()
    for v in a[u]:
        if v not in p: p[v]=u; q.append(v)
assert p[3]==2`,q('When should a BFS vertex first be marked discovered?',['When enqueued','Only when dequeued','After all its neighbours finish'],0,'Marking on enqueue prevents repeated entries.'),'bfs');
dl(dm,'Depth-first search, finishing times and cycles',[
'DFS follows a branch as far as possible before backtracking. Recursion implicitly stores the continuation for each vertex; an explicit stack can store vertices or frames. Neighbour order determines a particular valid traversal, so an exam question must specify or imply that order for a unique trace.',
'Use white for undiscovered, grey for active and black for finished. In directed DFS, an edge to a grey vertex is a back edge and proves a directed cycle. An edge to a black vertex does not by itself prove a cycle. Finish a vertex only after all its outgoing edges have been explored.',
'In an undirected simple graph, ignore the edge back to the immediate parent when detecting a cycle; that is the same tree edge viewed in reverse. A visited neighbour other than the parent indicates a cycle. Parallel edges require edge identities or adjusted logic, because a second parent edge can form a multigraph cycle.',
'DFS costs O(V+E) on adjacency lists and uses O(V) visited/stack space. Discovery and finishing intervals are nested for ancestor/descendant vertices and disjoint otherwise. DFS does not generally find the shortest-hop path. In Python, use iterative frames for very deep graphs rather than assuming recursion can handle arbitrary V.'
],`adj=[[1,2],[2],[0],[]]
colour=[0]*4; order=[]; cycle=False
def dfs(u):
    global cycle
    colour[u]=1; order.append(u)
    for v in adj[u]:
        if colour[v]==0: dfs(v)
        elif colour[v]==1: cycle=True
    colour[u]=2
for u in range(4):
    if colour[u]==0: dfs(u)
print(order,cycle)`,`[0, 1, 2, 3] True`,'The edge2->0 reaches an active ancestor and exposes a directed cycle. A later traversal includes isolated3.','For directed cycle detection, “visited” alone loses the distinction between active and finished vertices.','Trace recursive preorder DFS on 0->[1,2],1->[3],2->[],3->[].',`a=[[1,2],[3],[],[]]; seen=set(); order=[]
def dfs(u):
    seen.add(u); order.append(u)
    for v in a[u]:
        if v not in seen: dfs(v)
dfs(0)
assert order==[0,1,3,2]`,q('A directed edge to a grey DFS vertex proves?',['A directed cycle','A disconnected graph','A shortest path'],0,'Grey vertices lie on the active DFS path.'),'dfs');
dl(dm,'Topological sorting and dependency scheduling',[
'A topological order of a directed graph places u before v for every edge u->v. Such an order exists exactly when the graph is a DAG. It need not be unique: unrelated tasks can be scheduled in either order. It is not a numerical sorting of vertex labels.',
'Kahn’s algorithm counts indegrees and queues all zero-indegree vertices. Remove one, append it to the order and decrement indegrees of its outgoing neighbours. Newly zero-indegree vertices become eligible. If fewer than V vertices are output, a directed cycle prevented completion.',
'DFS gives another method: in a DAG, reverse the finishing order. Check for cycles before treating this as a topological order; reversing any DFS output is not sufficient. Both approaches take O(V+E) time using adjacency lists.',
'The order is unique if Kahn’s algorithm has exactly one eligible choice at every step. Topological order also permits dynamic programming on a DAG, including shortest paths with negative edges, because every predecessor is processed before a vertex. This connects graph traversal to dependency resolution and build systems.'
],`from collections import deque
adj=[[2],[2],[3],[]]
indeg=[0]*4
for row in adj:
    for v in row: indeg[v]+=1
q=deque(i for i,d in enumerate(indeg) if d==0); order=[]
while q:
    u=q.popleft(); order.append(u)
    for v in adj[u]:
        indeg[v]-=1
        if indeg[v]==0: q.append(v)
print(order,len(order)==len(adj))`,`[0, 1, 2, 3] True`,'0 and1 are initially eligible, so swapping them gives another valid order.2 must precede3.','A partial Kahn output is not a topological order of the full graph when a cycle remains.','Validate [1,0,2,3] against edges0->2,1->2,2->3.',`order=[1,0,2,3]; pos={v:i for i,v in enumerate(order)}
assert all(pos[u]<pos[v] for u,v in [(0,2),(1,2),(2,3)])`,q('A graph admits a topological order exactly when it is?',['Undirected and connected','Directed and acyclic','Complete'],1,'A directed cycle would require each cycle vertex to precede itself transitively.'),'topo');

dm=dmodule('paths','Shortest-path algorithms','Choose BFS, Dijkstra, DAG relaxation, Bellman–Ford or Floyd–Warshall');
dl(dm,'Relaxation, path reconstruction and Dijkstra',[
'A shortest path minimises total edge weight. Maintain a tentative distance d[v], initialising the source to0 and others to infinity. Relaxing(u,v,w) means replacing d[v] with d[u]+w and parent[v] with u if that candidate is smaller. Each finite label represents a path actually found.',
'Dijkstra repeatedly settles the reachable vertex with minimum tentative distance and relaxes its outgoing edges. Nonnegative weights ensure no future route through a farther unsettled vertex can improve the settled label. Zero weights are allowed; negative edges invalidate this greedy proof.',
'Using a binary heap and adjacency lists, a decrease-key version takes O((V+E)log V). Python’s usual lazy version pushes improved pairs and skips stale entries; it takes O((V+E)log(E+1)) time and may hold O(E) entries. For simple graphs, the log factor is O(log V). A dense array-based implementation costs O(V^2).',
'To reconstruct a reachable path, follow parents backward from target to source and reverse. Distinguish an unreachable target from a source-to-source path of length0. With equal-cost paths, strict improvement keeps the earlier parent; never infer unique shortest paths from a unique distance.'
],`import heapq
adj=[[(1,4),(2,1)],[(3,1)],[(1,2),(3,5)],[]]
d=[float('inf')]*4; d[0]=0; heap=[(0,0)]
while heap:
    du,u=heapq.heappop(heap)
    if du!=d[u]: continue
    for v,w in adj[u]:
        if du+w<d[v]:
            d[v]=du+w; heapq.heappush(heap,(d[v],v))
print(d)`,`[0, 3, 1, 4]`,'The route0->2->1 costs3, improving the direct cost4; then1->3 gives cost4. The old heap entry(4,1) is ignored as stale.','Choosing a neighbour with the smallest individual edge is not Dijkstra. Choose the globally smallest tentative total distance.','Use relaxation to compare direct cost10 with a path of edges3 and4.',`d={'s':0,'a':3,'t':10}
if d['a']+4<d['t']: d['t']=d['a']+4
assert d['t']==7`,q('Which edge weights satisfy standard Dijkstra’s assumption?',['All weights nonnegative','All weights nonzero','Any weights if there is no negative cycle'],0,'No negative cycle is enough for finite shortest paths, but not for Dijkstra’s settling proof.'),'dijkstra');
dl(dm,'Bellman–Ford and negative-cycle detection',[
'Negative edges can make a later route improve an earlier label. Bellman–Ford relaxes every edge repeatedly. In a graph with no reachable negative cycle, a shortest walk can be reduced to a simple path with at most V-1 edges, so V-1 complete passes suffice.',
'The dynamic-programming invariant is that after i full passes, distances are no worse than the best source paths using at most i edges. In-place updates may propagate farther in one pass, depending on edge order, but never weaken that guarantee. A pass with no changes allows early termination.',
'If an edge can still improve after V-1 passes, a negative cycle is reachable from the source. To identify every vertex with distance unbounded below, propagate reachability from vertices relaxed on the extra pass. An unreachable negative cycle does not affect source distances.',
'Bellman–Ford costs O(VE) time and O(V) distance/parent storage. In an undirected graph represented in both directions, any negative edge creates a negative closed walk by travelling back and forth; finite shortest-walk distances in that component cease to exist. Always state whether the problem permits repeated vertices or specifically requests simple paths.'
],`edges=[(0,1,4),(0,2,5),(1,2,-2),(2,3,3)]
n=4; d=[float('inf')]*n; d[0]=0
for _ in range(n-1):
    changed=False
    for u,v,w in edges:
        if d[u]+w<d[v]: d[v]=d[u]+w; changed=True
    if not changed: break
negative=any(d[u]+w<d[v] for u,v,w in edges)
print(d,negative)`,`[0, 4, 2, 5] False`,'The negative edge1->2 improves5 to2, and2->3 then gives5. No extra relaxation is possible.','A negative edge is not itself a negative cycle in a directed graph.','Detect the reachable negative cycle0->1 weight1,1->2 weight-3,2->1 weight1.',`e=[(0,1,1),(1,2,-3),(2,1,1)]; d=[0,float('inf'),float('inf')]
for _ in range(2):
    for u,v,w in e:
        if d[u]+w<d[v]: d[v]=d[u]+w
assert any(d[u]+w<d[v] for u,v,w in e)`,q('A negative cycle disconnected from the source means?',['All source distances are invalid','It does not affect source-reachable distances','Dijkstra becomes safe on all negative edges'],1,'Only reachable negative cycles can improve paths from this source indefinitely.'),'bellman');
dl(dm,'Floyd–Warshall for all pairs',[
'Floyd–Warshall computes distances between every pair. Initialise D[i][i]=0, each existing edge with its weight, and absent edges to infinity. For parallel edges retain the minimum. A negative self-loop must retain its negative value rather than being overwritten by a diagonal zero.',
'At stage k, allow vertex k as an intermediate and update D[i][j]=min(D[i][j],D[i][k]+D[k][j]). The invariant says all internal vertices of considered paths come from the already allowed set. The k loop must be outermost in this standard in-place dynamic program.',
'Time is O(V^3), space O(V^2). It handles negative edges, but if D[k][k]<0 after completion, a negative cycle exists. A pair(i,j) is unbounded below if i can reach such a k and k can reach j; not every pair is necessarily affected.',
'To reconstruct paths, maintain a next-hop matrix and set next[i][j]=next[i][k] when an improvement via k occurs. Plain distances alone do not encode the route. For Boolean reachability, replacing min/+ with OR/AND gives Warshall’s transitive-closure recurrence.'
],`inf=float('inf')
d=[[0,4,10],[inf,0,3],[inf,inf,0]]
for k in range(3):
    for i in range(3):
        for j in range(3):
            d[i][j]=min(d[i][j],d[i][k]+d[k][j])
print(d[0][2])
print(any(d[i][i]<0 for i in range(3)))`,`7\nFalse`,'Allowing vertex1 as an intermediate replaces the direct cost10 with4+3=7.','Arbitrarily permuting the three loops can break the allowed-intermediate invariant.','Compute reachability closure for0->1->2 with Boolean Warshall.',`r=[[True,True,False],[False,True,True],[False,False,True]]
for k in range(3):
    for i in range(3):
        for j in range(3): r[i][j]=r[i][j] or (r[i][k] and r[k][j])
assert r[0][2]`,q('Which loop must be outermost in standard Floyd–Warshall?',['Source i','Destination j','Allowed intermediate k'],2,'Each stage extends the allowed intermediate set by exactly one vertex.'),'floyd');
dl(dm,'DAG paths, 0–1 BFS and choosing the right method',[
'On a DAG, process vertices in topological order and relax all outgoing edges. Every possible predecessor has already been processed, so one pass suffices even with negative weights. The time is O(V+E). Acyclicity, not nonnegative weights, makes this order valid.',
'When edge weights are only0 or1, 0–1 BFS uses a deque: push an improved neighbour to the front for weight0 and to the back for weight1. The frontier stays ordered by distance, yielding O(V+E) time with the standard algorithm. Ordinary FIFO BFS would count edges rather than their0/1 costs.',
'Choose by the input: equal positive weights -> BFS; DAG -> topological relaxation; arbitrary nonnegative weights -> Dijkstra; negative edges with source queries -> Bellman–Ford; dense all-pairs queries -> Floyd–Warshall. Negative cycles require reporting unbounded distances for affected pairs rather than a normal minimum.',
'Shortest-path trees and minimum spanning trees solve different problems. A shortest-path tree preserves distances from one source. A minimum spanning tree minimises the total chosen edge weight while connecting all vertices. Neither objective generally implies the other.'
],`adj=[[(1,2),(2,5)],[(2,-4)],[]]
order=[0,1,2]
d=[0,float('inf'),float('inf')]
for u in order:
    for v,w in adj[u]: d[v]=min(d[v],d[u]+w)
print(d)`,`[0, 2, -2]`,'Topological processing handles the negative edge1->2 safely because no later vertex can lead back into an earlier dependency.','A negative edge does not rule out linear-time shortest paths when the graph is a DAG.','Use 0–1 BFS to find distances in0->1(1),0->2(0),2->1(0).',`from collections import deque
a=[[(1,1),(2,0)],[],[(1,0)]]; d=[0,float('inf'),float('inf')]; q=deque([0])
while q:
    u=q.popleft()
    for v,w in a[u]:
        if d[u]+w<d[v]:
            d[v]=d[u]+w
            if w==0: q.appendleft(v)
            else: q.append(v)
assert d==[0,0,0]`,q('A DAG with negative edges supports shortest paths in?',['O(V+E) after topological ordering','Only O(VE)','No finite time'],0,'A topological pass respects all predecessor dependencies.'),'dijkstra');

dm=dmodule('extend','Advanced patterns & practical projects','Greedy reasoning, dynamic programming and a route planner','Enrichment beyond named DA topics');
dl(dm,'Greedy methods, disjoint sets and minimum spanning trees',[
'A greedy algorithm commits to a locally attractive choice. Correctness needs a proof, often an exchange argument or a cut property. Choosing the smallest coin repeatedly can fail for denominations1,3,4 on target6; greedy4+1+1 loses to3+3. Never assume a local rule is globally optimal.',
'A minimum spanning tree (MST) connects a weighted undirected connected graph with minimum total edge weight. Kruskal sorts edges by weight and adds an edge only if it joins different current components. A disjoint-set union structure tracks those components. A disconnected graph yields a minimum spanning forest.',
'Union by size/rank plus path compression gives almost constant amortised disjoint-set operations, commonly written O(alpha(V)). Kruskal’s sorting dominates at O(E log E). Prim instead grows a tree by the cheapest edge crossing from the chosen vertices to the rest, with a heap implementation typically O(E log V).',
'The cut property justifies choosing a lightest edge across a cut respected by the current forest. Tied weights can allow multiple MSTs; distinct weights guarantee uniqueness. MSTs are enrichment here, clearly separate from the explicitly listed shortest-path topic and its different objective.'
],`edges=[(1,0,1),(2,1,2),(5,0,2),(3,2,3)]
parent=list(range(4)); size=[1]*4
def find(x):
    while x!=parent[x]: parent[x]=parent[parent[x]]; x=parent[x]
    return x
total=0; chosen=[]
for w,u,v in sorted(edges):
    a,b=find(u),find(v)
    if a==b: continue
    if size[a]<size[b]: a,b=b,a
    parent[b]=a; size[a]+=size[b]; total+=w; chosen.append((u,v))
print(total,chosen)`,`6 [(0, 1), (1, 2), (2, 3)]`,'The edge0--2 of weight5 would close a cycle and is skipped. The selected tree has total weight6.','MST minimises total network cost, not each source-to-destination distance.','Show the greedy coin counterexample for target6 using coins1,3,4.',`remaining=6; used=[]
for coin in [4,3,1]:
    while remaining>=coin: used.append(coin); remaining-=coin
assert len(used)==3 and 3+3==6`,q('Kruskal rejects an edge when its endpoints are?',['In different components','Already in the same component','Both unvisited'],1,'Adding that edge would create a cycle.'));
dl(dm,'Dynamic programming and backtracking',[
'Dynamic programming stores answers to overlapping subproblems. Define a state, a recurrence, base cases and an evaluation order before coding. Memoisation caches a recursive solution; tabulation fills a table iteratively. The state must contain all information needed to determine future choices.',
'For minimum coins to form amount s, dp[0]=0 and dp[s]=1+min(dp[s-c]) over usable denominations c<=s. Use infinity for unreachable states. With amount A and k coin types this takes O(Ak) time and O(A) space. This is pseudo-polynomial in the numerical amount, not polynomial in its bit length.',
'Backtracking explores choices and reverses them when returning. Generating all subsets of n items requires2^n outputs, so exponential work is unavoidable for explicit enumeration. Pruning rejects branches that cannot lead to valid solutions, but does not automatically make the worst case polynomial.',
'Keep these techniques separate from the DA syllabus’s named divide-and-conquer sorting: merge sort solves disjoint subproblems; coin change reuses overlapping states. Dynamic programming and advanced backtracking are enrichment for deeper problem-solving, not additional claimed official syllabus headings.'
],`coins=[1,3,4]; amount=6
dp=[0]+[float('inf')]*amount
for s in range(1,amount+1):
    for c in coins:
        if c<=s: dp[s]=min(dp[s],1+dp[s-c])
print(dp)
print(dp[amount])`,`[0, 1, 2, 1, 1, 2, 2]\n2`,'At amount6, using a3 leaves amount3, which already costs one coin, so two coins suffice.','Caching by an incomplete state can return a correct answer for the wrong subproblem.','Generate all subsets of [1,2,3] iteratively.',`subsets=[[]]
for x in [1,2,3]: subsets += [s+[x] for s in subsets]
assert len(subsets)==8 and [1,2,3] in subsets`,q('Memoisation mainly avoids which repeated work?',['Sorting keys','Re-solving identical subproblems','Reading the input at all'],1,'Cached states reuse previously computed results.'));
dl(dm,'Build a route planner and an exam-solving workflow',[
'Build a small campus or delivery-route planner. Define locations as vertices and nonnegative travel times as weighted directed edges. Validate that every endpoint exists and weights meet the chosen algorithm’s assumptions. Preserve isolated vertices and distinguish one-way roads from two-way roads.',
'Use an adjacency list for storage, Dijkstra for fastest routes, and parent links for route reconstruction. Test a direct route, a cheaper indirect route, equal alternatives, an unreachable destination and source=target. Compare small nonnegative graphs against Bellman–Ford or Floyd–Warshall as an independent correctness check.',
'For exam traces, write the representation and convention first: zero/one indexing, inclusive/half-open intervals, neighbour order, pivot scheme, and height definition. Draw a state table with iteration, active structure, changed values and invariant. Count exactly the operation requested; comparisons, swaps and probes are different quantities.',
'A useful mastery loop is predict -> trace by hand -> execute -> change an edge case -> explain the invariant without notes. Move errors into the mistake notebook, then retry after a delay. Completing a lesson is a progress marker, not proof that you can solve unseen questions; use the authenticated PYQ bank for that next step.'
],`import heapq
def route(graph,source,target):
    d={source:0}; parent={source:None}; heap=[(0,source)]
    while heap:
        cost,u=heapq.heappop(heap)
        if cost!=d[u]: continue
        if u==target: break
        for v,w in graph[u]:
            if w<0: raise ValueError('nonnegative weights required')
            if cost+w<d.get(v,float('inf')):
                d[v]=cost+w; parent[v]=u; heapq.heappush(heap,(d[v],v))
    if target not in d: return None
    path=[]; u=target
    while u is not None: path.append(u); u=parent[u]
    return d[target],path[::-1]
g={'A':[('B',5),('C',1)],'B':[('D',2)],'C':[('B',2)],'D':[],'E':[]}
print(route(g,'A','D'))
print(route(g,'A','E'))`,`(5, ['A', 'C', 'B', 'D'])\nNone`,'The indirect path costs1+2+2=5;E is unreachable. This demonstration assumes valid endpoints and nonnegative input; validate the whole graph before early exit in production.','Checking only edges visited before an early exit is not a full input validation pass.','Add input validation that rejects negative weights anywhere in the graph.',`def validate_graph(g):
    for u,edges in g.items():
        for v,w in edges:
            if v not in g or w<0: raise ValueError('invalid graph')
    return True
assert validate_graph({'A':[('B',2)],'B':[]})
try: validate_graph({'A':[],'B':[('B',-1)]})
except ValueError: pass
else: raise AssertionError('negative edge was missed')`,q('What is the strongest small-graph check for a Dijkstra implementation?',['Compare only to its own trace','Compare distances with an independent correct algorithm','Test one sorted list'],1,'A different algorithm is less likely to share the same implementation mistake.'),'dijkstra');
