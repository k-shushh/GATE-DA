const banks = {
start: [
['What does type(7 / 2).__name__ return?',['int','float','str'],1,'True division produces a float, even for integer inputs.'],
['What is -7 % 3?',['-1','1','2'],2,'-7 = (-3)*3 + 2; the remainder follows the divisor sign.'],
['What is 2 ** 3 ** 2?',['64','512','36'],1,'Exponentiation associates right-to-left: 2 ** (3 ** 2).'],
['What is bool("0")?',['False','True','TypeError'],1,'Every nonempty ordinary string is truthy.'],
['What is 0 and (1/0)?',['0','False','ZeroDivisionError'],0,'and short-circuits on its false first operand, returning 0.'],
['What is 5 ^ 3?',['125','6','15'],1,'101 XOR 011 is 110, which is 6.'],
['What is int(-3.8)?',['-4','-3','3'],1,'int truncates toward zero; floor division behaves differently.'],
['After x=2; y=x; x+=1, what is y?',['2','3','None'],0,'The integer update rebinds x; it does not change y.'],
['Which reliably tests absence represented by None?',['x == 0','x is None','not x'],1,'not x also matches zero and empty containers.'],
['What is -2 ** 4?',['16','-16','-8'],1,'Exponentiation applies before the unary minus on its left.']
],
flow: [
['How many values does range(2,11,3) produce?',['3','4','5'],0,'The values are 2,5,8; 11 is excluded.'],
['What is list(range(3,0))?',['[3,2,1]','[]','[0,1,2]'],1,'The default step is positive and cannot move 3 toward the smaller stop.'],
['Which line correctly tests x equal to 1 or 2?',['x == 1 or 2','x in (1,2)','x == (1 or 2)'],1,'Membership tests both alternatives.'],
['What does continue skip?',['The whole function','The rest of the current iteration','All future iterations'],1,'Control proceeds to the next iteration.'],
['How many times does the body run: for i in range(5): for j in range(i)?',['25','15','10'],2,'0+1+2+3+4 = 10.'],
['A for loop over [] has an else. Does else run?',['Yes','No','Only if there is an if'],0,'The iterable is exhausted without break.'],
['What exits only the nearest loop?',['return','break','pass'],1,'break affects the innermost enclosing loop.'],
['A while counter starts at 9 and is floor-divided by 2 until 0. Iterations?',['3','4','5'],1,'The positive states are 9,4,2,1.'],
['Best initial maximum for a known nonempty all-negative list?',['0','The first element','1'],1,'Zero would produce a result not present in the input.'],
['What is the type returned by input()?',['int','str','It depends on the entered characters'],1,'Conversion must be explicit.']
],
text: [
['What is "abcdef"[::2]?',['ace','bdf','abc'],0,'Indices 0,2,4 are selected.'],
['What is "abc"[-1]?',['a','c','IndexError'],1,'-1 selects the last element.'],
['What is "abc"[99:]?',['IndexError','""','"abc"'],1,'Slicing clips bounds and gives an empty result.'],
['What is "abc"[:-1:-1]?',['"cba"','"cb"','""'],2,'The default start is the last index and the explicit -1 stop normalises to that same index.'],
['What does "  a  b ".split() produce?',['["a","b"]','["","a","","b",""]','["a  b"]'],0,'Default split collapses whitespace and strips empty edge fields.'],
['What is "ababa".count("aba")?',['1','2','3'],0,'str.count counts non-overlapping occurrences.'],
['Which expression joins ["a","b"] with a comma?',['["a","b"].join(",")','",".join(["a","b"])','join(",", ["a","b"])'],1,'The separator string owns join.'],
['What happens to s after s="abc"; s.replace("a","x")?',['s becomes "xbc"','s stays "abc"','TypeError'],1,'replace returns a new string; its result was not assigned.'],
['Which detects "py" at the start of s?',['bool(s.find("py"))','s.startswith("py")','s.find("py") > 0'],1,'A match at index 0 is valid but false when converted to bool.'],
['Extra space of comparing s == s[::-1]?',['O(1)','O(log n)','O(n)'],2,'The reverse slice allocates a length-n string.']
],
sequence: [
['After a=[1]; b=a; b.append(2), what is a?',['[1]','[1,2]','[2]'],1,'Both names refer to the same mutable list.'],
['After a=[1]; b=a[:]; b.append(2), what is a?',['[1]','[1,2]','None'],0,'b is a distinct outer list.'],
['What is len([1,2]+[3,4])?',['2','3','4'],2,'Concatenation produces four elements.'],
['What is the return value of [3,1,2].sort()?',['[1,2,3]','None','3'],1,'In-place sort returns None.'],
['Which is a one-element tuple?',['(4)','(4,)','[4]'],1,'The comma makes the tuple.'],
['For a=[[0]]*3; a[0].append(1), what is a?',['[[0,1],[0],[0]]','[[0,1],[0,1],[0,1]]','[[0],[0],[0],1]'],1,'All entries refer to the same inner list.'],
['Can t=([1],2) be a dictionary key?',['Yes','No','Only after appending to its list'],1,'The list element is unhashable, making the tuple unhashable.'],
['After a=[1,2,3]; a[1:3]=[9], what is a?',['[1,9]','[1,9,3]','ValueError'],0,'Ordinary slice assignment can change the length.'],
['What does pop(0) return from [7,8,9]?',['9','7','None'],1,'It removes and returns the item at index zero.'],
['Which operation changes an aliased list in place?',['a = a + [2]','a += [2]','a = [2]'],1,'List augmented addition extends the existing object.']
],
mapping: [
['What does "x" in {"x":3} test?',['A value','A key','Either key or value'],1,'Dictionary membership is over keys.'],
['What is len({1:"a",True:"b",1.0:"c"})?',['1','2','3'],0,'These numeric keys compare equal.'],
['Which mutates d={} by inserting a missing key?',['d.get("x",[])','d.setdefault("x",[])','"x" in d'],1,'setdefault inserts; get merely returns a fallback.'],
['What is {1,2,3} & {2,4}?',['{1,2,3,4}','{2}','{1,3,4}'],1,'& is intersection.'],
['Which set removal tolerates a missing element?',['remove','discard','pop with an argument'],1,'discard does nothing when absent.'],
['What is the expected lookup cost in a suitable hash table?',['O(1)','O(log n) always','O(n²)'],0,'Expected constant time is not a worst-case guarantee.'],
['Does updating an existing dict value move the key to the end?',['Yes','No','Always sorts the keys'],1,'Replacement retains insertion position.'],
['Which is hashable?',['{1,2}','frozenset({1,2})','[1,2]'],1,'frozenset is immutable and hashable.'],
['Why is dict.fromkeys(["a","b"],[]) risky?',['Keys become unhashable','Both values refer to one list','It creates a set'],1,'The supplied value object is reused for every key.'],
['Order-preserving deduplication for hashable values?',['list(set(values)) guarantees it','list(dict.fromkeys(values))','sorted(values)'],1,'Dict insertion order retains first occurrences.']
],
functions: [
['After def f(): print(3), what is f() + 1?',['4','None','TypeError after printing 3'],2,'f returns None; adding 1 to None is invalid.'],
['A default list argument is created when?',['Each call','When def executes','At interpreter shutdown'],1,'The same default may be reused on later calls.'],
['After def f(x): x=[9], does f(a) rebind caller name a?',['Yes','No','Only for a list'],1,'Rebinding a local parameter does not rebind the caller name.'],
['Which scope does global target?',['The nearest function','The module','Every module'],1,'global refers to the current module namespace.'],
['What type is *args inside a function?',['list','tuple','dict'],1,'Extra positional arguments form a tuple.'],
['What type is **kwargs inside a function?',['list','tuple','dict'],2,'Extra named arguments form a dictionary.'],
['For def f(x,*,y): ..., which call is valid?',['f(1,2)','f(1,y=2)','f(y=2)'],1,'y is keyword-only, while x is required.'],
['What is the recursion depth of factorial(n), including base n=0?',['O(1)','O(log n)','O(n)'],2,'Each call reduces n by one.'],
['What does [f() for f in [lambda: i for i in range(3)]] yield?',['[0,1,2]','[2,2,2]','[3,3,3]'],1,'All lambdas look up the same final loop binding.'],
['Why cache a recursive function?',['To remove all stack space','To reuse answers for repeated subproblems','To allow mutable dict keys'],1,'Memoisation trades stored results for avoided repeated work.']
],
idioms: [
['What is [x for x in range(5) if x%2]?',['[0,2,4]','[1,3]','[0,1,2,3,4]'],1,'Odd values have a truthy remainder of 1.'],
['What is len(list(zip([1,2,3],[4])))?',['1','3','ValueError by default'],0,'Default zip stops at the shortest input.'],
['What is any([])?',['True','False','None'],1,'No element is true.'],
['What is all([])?',['True','False','None'],0,'No element violates the conjunction.'],
['After g=iter([1,2]); next(g), what is list(g)?',['[1,2]','[2]','[]'],1,'One item was consumed.'],
['What follows exhausting a generator and calling list on it again?',['Original values','An empty list','Automatic restart'],1,'An exhausted iterator stays exhausted.'],
['What does yield do?',['Ends the entire interpreter','Suspends a generator with a value','Creates a list immediately'],1,'Execution resumes after yield on the next advance.'],
['Stable sort by length on ["bb","a","cc","d"] gives?',['["a","d","bb","cc"]','["d","a","cc","bb"]','["a","bb","cc","d"]'],0,'Equal-length items retain input order.'],
['Which returns a new sorted list?',['a.sort()','sorted(a)','a.reverse()'],1,'sorted constructs a new list from an iterable.'],
['Best operation for finding one minimum without sorting?',['min(values)','sorted(values)[0] is always faster','Reverse first'],0,'A linear scan avoids sorting all elements.']
],
reliable: [
['What does int("3.5") raise?',['ValueError','IndexError','KeyError'],0,'The string is not an integer literal.'],
['Which mode truncates an existing file?',['a','w','r'],1,'w starts a fresh file, removing previous contents.'],
['Why use with open(...)?',['It suppresses every error','It ensures closing on exit','It makes all paths absolute'],1,'The context manager closes the resource during normal or exceptional exit.'],
['Which module parses quoted comma-containing CSV fields?',['csv','A plain split always suffices','math'],0,'CSV quoting rules are handled by csv.'],
['A JSON array loaded by json.loads usually becomes?',['tuple','list','set'],1,'JSON arrays map to Python lists.'],
['Which is least appropriate for user-data validation?',['Explicit if and raise','Only assert','Specific exception handling'],1,'Assertions can be disabled in optimised execution.'],
['What triggers a try/except else block?',['The try suite completes without exception','Any exception','Only a return in try'],0,'else holds success-only work.'],
['Why avoid except: pass?',['It is always invalid syntax','It can hide unexpected failures','It is too verbose'],1,'Silently swallowing failures masks bugs and corrupt results.'],
['What does the main guard help avoid on import?',['Running the script workflow automatically','Importing any definitions','Loading Python itself'],0,'Reusable functions can be imported without running guarded orchestration.'],
['Which test adds useful coverage to ordinary positive examples?',['The same example repeated','An empty or boundary input','Only renaming variables'],1,'Boundaries and empty cases often expose incorrect assumptions.']
],
objects: [
['What does self refer to in an instance method?',['The class name string','The receiving instance','The module'],1,'The instance is passed as the first method parameter.'],
['Where is a mutable class attribute shared?',['Across instances that use it','Only inside one method','Nowhere'],0,'Instances can resolve the same class-level object.'],
['What does __init__ normally return?',['self','None','A new class'],1,'Initialisation methods must not return a non-None value.'],
['Which dataclass field makes a fresh list per instance?',['field(default_factory=list)','items=[] shared globally','One list passed as every default'],0,'A factory is called for each instance.'],
['What protocol powers for x in obj?',['Iteration','Hashing only','File writing'],0,'The object must be iterable.'],
['Which special method provides a useful developer representation?',['__repr__','__read__','__show__'],0,'repr calls the representation protocol.'],
['Does frozen dataclass deeply freeze a nested list?',['Yes','No','Only when printed'],1,'Nested mutable objects can still mutate.'],
['A decorator that wraps f but omits return f(...) typically returns?',['The original result','None','The function name'],1,'The wrapper has an implicit return None.'],
['Why use functools.wraps?',['To preserve useful wrapped-function metadata','To make every function recursive','To freeze arguments'],0,'It copies metadata such as name and docstring.'],
['Composition is best described as?',['An object containing and using another object','Every class inheriting from every other','Replacing all functions with globals'],0,'It combines behaviour through contained objects.']
],
patterns: [
['Tight time for a loop that halves n until zero?',['Theta(log n)','Theta(n)','Theta(n²)'],0,'Each step removes roughly one binary digit.'],
['Two consecutive O(n) loops usually combine to?',['O(n)','O(n²)','O(2^n)'],0,'Costs add: 2n is linear.'],
['Auxiliary space of a length-k list slice?',['O(1)','O(k)','O(log k)'],1,'A new outer list contains k references.'],
['Typical cost of inserting at the front of a Python list?',['O(1)','O(log n)','O(n)'],2,'Existing elements are shifted.'],
['For a=[2,5,1], prefix with initial zero is?',['[2,7,8]','[0,2,7,8]','[0,2,5,1]'],1,'The extra zero makes half-open queries uniform.'],
['With prefix=[0,2,7,8], sum(a[1:3]) is?',['8','6','7'],1,'prefix[3]-prefix[1]=8-2=6.'],
['Why initialise best window sum from a real window?',['To handle all-negative inputs','To sort the list','To skip validation'],0,'Initialising to zero can incorrectly beat every actual negative window.'],
['Binary search requires what?',['A sorted or suitably monotone search space','Only unique values','Only positive integers'],0,'Correct half elimination depends on order or monotonicity.'],
['What is lower_bound([],5)?',['-1','0','IndexError'],1,'The empty interval yields insertion index zero.'],
['Finding an insertion point by binary search then inserting in a list costs?',['O(log n) overall always','O(n) overall in the worst case','O(1)'],1,'Shifting elements dominates the logarithmic search.']
],
structures: [
['Push A,B,C then pop twice from a stack: outputs?',['A,B','C,B','B,C'],1,'Last-in, first-out removes C then B.'],
['Enqueue A,B,C then dequeue twice: outputs?',['A,B','C,B','B,C'],0,'First-in, first-out preserves arrival order.'],
['Which implements efficient FIFO removal?',['list.pop(0)','deque.popleft()','list.remove at random'],1,'Deque supports constant-time endpoint removal.'],
['Accessing the k-th node in a singly linked list from the head costs?',['O(1)','O(k)','O(log k)'],1,'Links must be followed sequentially.'],
['Inorder order is?',['Root-left-right','Left-root-right','Left-right-root'],1,'Visit the left subtree, then root, then right subtree.'],
['Worst-case height of an unbalanced BST with n nodes?',['O(log n)','O(n)','O(1)'],1,'Sorted insertion can produce a chain.'],
['Does a min-heap guarantee its entire backing array is sorted?',['Yes','No','Only for duplicate values'],1,'The parent-child priority constraint is weaker than total sorted order.'],
['BFS shortest distances are guaranteed for which usual model?',['Unweighted edges','Arbitrary negative weights','Every weighted graph'],0,'Each edge has equal unit cost in the layer interpretation.'],
['Adjacency-list BFS time over a whole reachable graph is?',['O(V+E)','O(VE) always','O(V²E)'],0,'Each vertex and adjacency entry is examined a bounded number of times.'],
['Why keep visited state in graph traversal?',['To sort vertex names','To avoid revisiting cycles indefinitely','To remove all edges'],1,'Cycles otherwise cause repeated work or nontermination.']
],
projects: [
['Which strict check excludes True from integer duration input?',['isinstance(x,int)','type(x) is int','bool(x)'],1,'bool subclasses int, so isinstance(True,int) is True.'],
['Why normalise topic labels before grouping?',['To intentionally combine equivalent spellings','To remove all information','To change every duration'],0,'Whitespace and case differences otherwise split one topic.'],
['A useful rejected-row report stores?',['Nothing','Original row index and reason','Only total valid count'],1,'The source location enables repair.'],
['Why count tokens before sorting frequency results?',['To aggregate repeats','To make words unhashable','To remove tie rules'],0,'Counts are needed for the frequency ordering.'],
['Sorting u unique word counts costs typically?',['O(u log u)','O(1)','O(2^u)'],0,'Comparison sorting applies to the u distinct records.'],
['What should you do before running an output-prediction example?',['Predict and trace it','Immediately reveal the answer','Only read the choices'],0,'Prediction exposes gaps that passive reading conceals.'],
['Best way to distinguish mutation from rebinding?',['Draw names and object references','Assume all assignments copy','Treat lists as integers'],0,'Mutation changes an object; rebinding moves a name reference.'],
['Does marking a lesson complete prove exam mastery?',['Yes','No','Only if it has a long title'],1,'Independent unseen problem solving is a stronger signal.'],
['Which is a better follow-up to a missed concept?',['Memorise the option letter','Explain the rule and solve a variant later','Never revisit it'],1,'Transfer and delayed recall test understanding.'],
['A complete Python lesson source also covers all DA subjects?',['Yes','No','Only probability'],1,'Programming is one part; mathematics, databases, ML, AI and full DSA need their own coverage.']
]};
for (const mod of COURSE) {
  mod.questions = banks[mod.id].map((a,i)=>({...q(...a),id:mod.id+'-q'+(i+1),kind:'Original conceptual'}));
  // Concise retrieval prompts, not fabricated PYQs. Five per topic.
  mod.cards=mod.questions.slice(0,5).map((item,i)=>({id:mod.id+'-card'+i,front:item.prompt,back:item.options[item.answer]+' — '+item.explain}));
  mod.lessons.forEach(l=>{l.check.id=l.id+'-check';l.check.kind='Lesson checkpoint';});
}
window.FINAL_CONCEPTUAL = [
q('Predict: a=[1]; b=a; a=a+[2]; b.append(3); print(a,b)',['[1,2] [1,3]','[1,2,3] [1,2,3]','[1] [1,3]'],0,'Concatenation creates a new list for a. b still refers to the original, which append changes.'),
q('Predict: print(-11//4, -11%4, int(-11/4))',['-2 -3 -2','-3 1 -2','-3 1 -3'],1,'Floor quotient is -3, remainder is 1, while int truncates -2.75 toward zero.'),
q('Predict: s="PROGRAM"; print(s[-2:1:-2])',['AR','AG','MR'],1,'Length 7: start -2 normalises to index 5 (A), then index 3 (G), stopping before index 1.'),
q('A function def f(x, a=[]): a.append(x); return len(a) is called as f(2), f(7), f(9,[]), f(4). Results?',['1,1,1,1','1,2,1,3','1,2,3,4'],1,'The first, second and fourth calls share the default list. The third gets a separate explicit list.'),
q('Predict: g=(x*x for x in range(4)); print(next(g),sum(g),list(g))',['0 14 []','0 14 [0,1,4,9]','1 13 []'],0,'next consumes 0; sum consumes 1+4+9; the final list is empty.'),
q('Predict: d={}; d.get("x",[]).append(1); print(d)',['{"x":[1]}','{}','KeyError'],1,'get returns the fallback list without inserting it. The mutated temporary is not stored in d.'),
q('For n=5, how many total recursive calls does f make if f(0)=0 and f(n)=1+f(n-1)?',['4','5','6'],2,'There is one call for each argument 5,4,3,2,1,0.'),
q('A prefix array for [4,-2,7,1] is [0,4,2,9,10]. Sum of indices 1 through 2 inclusive?',['5','7','9'],0,'Convert to the half-open interval [1,3): prefix[3]-prefix[1]=9-4=5.'),
q('A BFS from A marks nodes only on removal, allowing repeated enqueues. What improvement prevents that duplication?',['Sort every queue','Mark when enqueuing','Remove the visited set'],1,'Record discovery before placing a vertex in the queue; later edges cannot enqueue it again.'),
q('For n strings, code repeatedly checks word in a growing list of unique words. With all words distinct and constant-cost comparisons, worst-case time?',['Theta(n)','Theta(n log n)','Theta(n²)'],2,'Membership scans lists of lengths 0,1,...,n-1. A set can give expected linear total membership cost.')
].map((item,i)=>({...item,id:'final-concept-'+i,kind:'Original conceptual · final review'}));
