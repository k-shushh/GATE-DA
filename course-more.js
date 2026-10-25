m=module('mapping','Dictionaries & sets','Hashing, counting, grouping and fast membership');
lesson(m,'01 · Dictionaries and hashable keys',[
'A dict maps unique keys to values. A new assignment to an existing key replaces its value; it does not create another entry. Modern Python preserves insertion order. Replacing a value does not move its key; deleting and reinserting does.',
'Keys must be hashable: their hash must remain stable and equality must agree with hashing. Integers, strings and tuples of hashable elements work. Lists, dicts and mutable sets do not. frozenset is immutable and hashable. True, 1 and 1.0 compare equal and address the same dictionary key.',
'd[k] raises KeyError if absent. d.get(k, default) returns a fallback without inserting. setdefault inserts a fallback when absent. in d checks keys; d.values() and d.items() expose values and key-value pairs. These views reflect later changes.',
'A hash table first uses a hash to narrow down where a key might be, then checks equality. Collisions are possible and must be resolved. Lookup, insertion and deletion are expected O(1) under suitable hashing, but can be O(n) in the worst case; hashing a long fresh string itself costs work.'
],`counts = {}
for word in ["data", "python", "data"]:
    counts[word] = counts.get(word, 0) + 1
print(counts)
print("python" in counts, 2 in counts)
d = {True: "first", 1: "second", 1.0: "third"}
print(len(d), d[True])`,`{'data': 2, 'python': 1}\nTrue False\n1 third`,'Each repeated word updates a count. True, 1, and 1.0 identify equal numeric keys, so the final dict has one entry with the last value.','get does not insert. Also, adding or removing keys while iterating a dictionary can raise RuntimeError; iterate a copy or collect changes first.','Build a histogram for [2,2,3,1,3,3] without Counter.',`counts = {}
for value in [2, 2, 3, 1, 3, 3]:
    counts[value] = counts.get(value, 0) + 1
print(counts)`,q('Which can be a dictionary key?',['[1,2]','(1,2)','{1,2}'],1,'A tuple of integers is hashable; a list and a mutable set are not.'));
lesson(m,'02 · Sets and choosing the right container',[
'A set stores distinct hashable elements and supports membership, union |, intersection &, difference -, and symmetric difference ^. Its iteration order is not a language-level insertion-order guarantee. Sort a set when you need deterministic ordered output.',
'{} creates an empty dictionary; set() creates an empty set. add inserts one element; update inserts elements from an iterable. remove raises KeyError when missing; discard does not. A subset test <= includes equality; a proper subset test < excludes equality.',
'Use a list for ordered sequences with duplicates, tuple for a fixed record, dict for key-to-value association, and set for uniqueness and membership. Order-preserving deduplication can use dict.fromkeys(values) when the values are hashable.',
'A set trades memory for fast expected membership. Building a set of n elements is expected O(n); repeatedly converting a list into a set inside a loop defeats the intended benefit. For unhashable records, choose a hashable key or a different comparison method.'
],`a, b = {1, 2, 3}, {3, 4}
print(sorted(a | b))
print(sorted(a & b))
print(sorted(a - b))
print(sorted(a ^ b))
print(list(dict.fromkeys([3, 1, 3, 2, 1])))`,`[1, 2, 3, 4]\n[3]\n[1, 2]\n[1, 2, 4]\n[3, 1, 2]`,'Intersection keeps only 3. Symmetric difference keeps elements in exactly one set. dict.fromkeys retains the first insertion order of unique keys.','Do not answer a question with a fixed set print order unless the question explicitly imposes one.','Find IDs present in yesterday=[1,2,3] but absent today=[2,4].',`yesterday, today = {1, 2, 3}, {2, 4}
print(sorted(yesterday - today))`,q('What is the type of {}?',['set','dict','tuple'],1,'Use set() for an empty set.'));
lesson(m,'03 · Counting and grouping patterns',[
'Counting stores one aggregate per key. Grouping stores a collection per key. collections.Counter handles counts; defaultdict(list) creates an empty list when a missing key is indexed. Ordinary dict plus setdefault is another option.',
'The two-sum pattern scans values while storing what has been seen. For each x, check whether target-x occurred earlier; then insert x. Checking before insertion prevents reusing the same position. This gives expected O(n) time and O(n) space.',
'To group anagrams, choose a canonical key: a sorted character tuple, or a fixed-alphabet frequency tuple. The key must preserve exactly the equivalence relation you intend. Case and punctuation handling must be explicit.',
'When using a mutable default value, create a new object for each group. dict.fromkeys(keys, []) gives every key the same list, much like repeated matrix rows. A comprehension {k: [] for k in keys} creates independent lists.'
],`from collections import Counter, defaultdict
print(Counter("banana")["a"])
groups = defaultdict(list)
for name, team in [("Asha", "red"), ("Dev", "blue"), ("Ira", "red")]:
    groups[team].append(name)
print(dict(groups))
def two_sum(values, target):
    seen = {}
    for i, x in enumerate(values):
        if target - x in seen:
            return seen[target - x], i
        seen[x] = i
    return None
print(two_sum([3, 3, 8], 6))`,`3\n{'red': ['Asha', 'Ira'], 'blue': ['Dev']}\n(0, 1)`,'The first 3 is stored at index 0; when the second 3 arrives, its complement has already been seen. The two indices are distinct.','Do not initialise all grouping buckets with the same shared list.','Group ["ant","apple","bat","bee"] by first letter.',`groups = {}
for word in ["ant", "apple", "bat", "bee"]:
    groups.setdefault(word[0], []).append(word)
print(groups)`,q('Why check the two-sum complement before inserting the current item?',['To sort values','To avoid using the same position twice','To make hashes unique'],1,'Only earlier positions should be eligible as partners.'));
m=module('functions','Functions, scope & recursion','Contracts, call frames, shared state and recursive reasoning');
lesson(m,'01 · Parameters, return and contracts',[
'A function packages a reusable computation. Define inputs, output, side effects and invalid-input behaviour. def creates a function object and binds its name; the body runs when called. return ends the call and sends a value to its caller.',
'A function without an executed value-return returns None. Printing and returning are different: printing is an output side effect; return makes a value available for further computation. Multiple return values are usually a tuple that the caller unpacks.',
'Parameters are local names bound to the argument objects. Mutating a passed list can affect the caller; rebinding the parameter cannot rebind the caller name. This model is often called call by object sharing; it is more precise than saying all arguments are copied.',
'A pure function gives the same output for the same inputs without changing external state. Pure cores are easier to test. Keep input parsing and printing near the edges of a program and computation inside functions.'
],`def summary(values):
    if not values:
        raise ValueError("at least one value required")
    return min(values), max(values), sum(values) / len(values)
low, high, mean = summary([2, 4, 9])
print(low, high, mean)
def touch(items):
    items.append(3)
    items = [99]
a = [1, 2]
print(touch(a))
print(a)`,`2 9 5.0\nNone\n[1, 2, 3]`,'touch mutates the shared list, then rebinds only its local name. Its implicit return is None. summary returns a tuple of three values.','A function that prints a result is not automatically usable as a numeric expression.','Write safe_mean(values), returning None for an empty sequence.',`def safe_mean(values):
    return sum(values) / len(values) if values else None
print(safe_mean([]), safe_mean([2, 4]))`,q('What does a function return if it reaches the end without return?',['0','None','Its last expression'],1,'Python uses an implicit return None.'));
lesson(m,'02 · Arguments and the mutable-default trap',[
'Arguments may be positional or named. Defaults are evaluated when the def statement executes, not on every call. A mutable default can therefore retain modifications across calls. Use None as a sentinel and create a fresh object inside the function.',
'*args collects additional positional arguments into a tuple; **kwargs collects additional keyword arguments into a dict. At a call site, *sequence and **mapping unpack arguments. Positional-only parameters precede /; keyword-only parameters follow * or *args.',
'A default is a reference to the object at definition time. Reassigning a separate name later does not update that reference. Passing the same parameter both positionally and by keyword raises TypeError.',
'Prefer an explicit, small signature over accepting arbitrary arguments without validation. Document whether a function mutates inputs and what types it expects. Type annotations help readers and tools but do not automatically enforce types at runtime.'
],`def collect_bad(x, bucket=[]):
    bucket.append(x)
    return bucket
print(collect_bad(1))
print(collect_bad(2))
def collect(x, bucket=None):
    if bucket is None:
        bucket = []
    bucket.append(x)
    return bucket
print(collect(1), collect(2))
def scale(x, *, factor=2):
    return x * factor
print(scale(3, factor=4))`,`[1]\n[1, 2]\n[1] [2]\n12`,'collect_bad reuses its one default list. collect creates a new list on each omitted-bucket call. factor is keyword-only.','The bad example is intentionally wrong for independent collections; shared defaults can be deliberate, but should not be accidental.','Implement total(*values, offset=0) and call it with an unpacked list.',`def total(*values, offset=0):
    return sum(values) + offset
print(total(*[2, 3, 4], offset=1))`,q('When are default argument expressions evaluated?',['At every call','When the def statement executes','When the function returns'],1,'One evaluation at definition time creates the stored defaults.'));
lesson(m,'03 · Scope, closures and name lookup',[
'For ordinary function bodies, name lookup follows Local, Enclosing function scopes, Global module scope, and Built-ins (LEGB). Assignment in a function normally makes that name local throughout the function, even before the assignment executes.',
'Reading a local name before it has been bound raises UnboundLocalError. global targets a module-level name; nonlocal targets an already existing binding in an enclosing function. Neither is needed merely to mutate an object reached through a name.',
'A closure retains access to its enclosing bindings after the outer function returns. It does not freeze the values of loop variables at creation time. Several lambdas can therefore all observe the final loop value.',
'Capture a value deliberately with a default parameter, or build each closure in a helper call with a distinct local binding. Avoid unnecessary globals: explicit parameters make dependencies visible and tests independent.'
],`x = 10
def outer():
    count = 0
    def step():
        nonlocal count
        count += 1
        return count
    return step
counter = outer()
print(counter(), counter(), x)
late = [lambda: i for i in range(3)]
early = [lambda i=i: i for i in range(3)]
print([f() for f in late])
print([f() for f in early])`,`1 2 10\n[2, 2, 2]\n[0, 1, 2]`,'counter retains one count binding and increments it twice. The late lambdas share the loop binding; the early lambdas each store a default value.','A name is not automatically global because it has not yet been assigned on the current execution path. Assignment anywhere in the function normally classifies it as local.','Create make_multiplier(k) returning a function that multiplies its input by k.',`def make_multiplier(k):
    def multiply(x):
        return k * x
    return multiply
triple = make_multiplier(3)
print(triple(7))`,q('Which statement changes an existing enclosing function binding?',['global','nonlocal','import'],1,'nonlocal targets an enclosing function scope rather than the module scope.'));
lesson(m,'04 · Recursion: descent, base case, unwind',[
'A recursive function solves a problem using smaller instances of itself. You need a base case, a reduction that reaches it, and a rule that combines the smaller answer. A base case alone is not enough if some inputs move away from it.',
'Every active call has its own local parameters and pending work. For factorial(4), the multiplication by 4 waits for factorial(3), which waits for factorial(2), and so on. Returning from the base case unwinds these pending operations in reverse order.',
'Distinguish printing before a recursive call from printing after it. Before-call output appears during descent; after-call output appears during unwind. Draw frames and return values rather than trying to simulate everything mentally.',
'A linear-depth recursive routine uses O(n) call-stack space even if each frame has only a few variables. Python has a recursion limit and does not generally eliminate tail calls. Iteration is preferable for very deep simple recurrences.'
],`def factorial(n):
    if n < 0:
        raise ValueError("n must be nonnegative")
    if n == 0:
        return 1
    return n * factorial(n - 1)
print(factorial(4))
def trace(n):
    if n == 0:
        return
    print("enter", n)
    trace(n - 1)
    print("leave", n)
trace(3)`,`24\nenter 3\nenter 2\nenter 1\nleave 1\nleave 2\nleave 3`,'factorial reaches 0 then returns 1, 1, 2, 6 and 24. trace prints enter on descent and leave on unwind.','Do not forget the recursive call consumes stack space. Raising the recursion limit is not a substitute for choosing an appropriate algorithm.','Write recursive sum_digits(n) for nonnegative integers, using // and %.',`def sum_digits(n):
    if n < 10:
        return n
    return n % 10 + sum_digits(n // 10)
print(sum_digits(4072))`,q('For factorial(n), how many calls are active at maximum including factorial(0)?',['1','n','n+1'],2,'The stack contains calls with arguments n through 0.'));
lesson(m,'05 · Repeated work and memoisation',[
'A branching recursion can solve the same subproblem many times. Naive Fibonacci computes fib(n-1) and fib(n-2), whose recursion trees overlap. Its running time grows exponentially, although the maximum stack depth is only O(n).',
'Memoisation stores answers by input so each distinct subproblem is computed once. functools.cache provides an unbounded memo table for hashable arguments. Cached functions should be deterministic for their arguments; mutable external state can make cached answers stale.',
'Bottom-up dynamic programming computes smaller results first. Fibonacci needs only the previous two values, so an iterative implementation can use O(1) auxiliary variables. For huge integers, arithmetic bit costs and output size still grow.',
'Euclid’s gcd recursion uses gcd(a,b)=gcd(b,a%b), ending at b=0. Its argument shrinks rapidly; it is an example where recursive depth is logarithmic rather than linear. Recursion cost depends on the actual reduction and branching, not the presence of def calling itself.'
],`from functools import cache
@cache
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)
print(fib(10))
def fib_loop(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a
def gcd(a, b):
    return abs(a) if b == 0 else gcd(b, a % b)
print(fib_loop(10), gcd(48, 18))`,`55\n55 6`,'The memoised function evaluates each argument from 0 to 10 once. The loop advances the pair (F(k),F(k+1)). Euclid follows (48,18)→(18,12)→(12,6)→(6,0).','A cache is useful only when repeated calls reuse results; it also consumes memory and requires hashable inputs.','Compare fib_loop with fib for every n from 0 through 20.',`from functools import cache
@cache
def fib(n):
    return n if n < 2 else fib(n-1) + fib(n-2)
def fib_loop(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a
assert all(fib(n) == fib_loop(n) for n in range(21))
print("all matched")`,q('Why does memoisation speed up naive Fibonacci?',['It removes the need for base cases','It avoids recomputing the same arguments','It makes each integer smaller'],1,'Overlapping subproblems are evaluated once and then reused.'));
m=module('idioms','Write expressive Python','Comprehensions, iterators, generators and sorting keys');
lesson(m,'01 · Comprehensions and iteration helpers',[
'A comprehension describes a new collection from an iterable: [expression for x in source if condition]. Read it as a loop plus optional filtering. Dict and set comprehensions use braces with key:value or element expressions.',
'Nested comprehension clauses follow the same left-to-right order as nested loops. [x for row in matrix for x in row] flattens rows. A conditional expression before for transforms every item; an if after for filters items out.',
'enumerate supplies index-value pairs; zip aligns multiple iterables and by default stops at the shortest. zip(..., strict=True) (Python 3.10+) raises if lengths differ. Use unpacking instead of manually indexing parallel arrays when possible.',
'any short-circuits at the first true item; all at the first false item. any([]) is False and all([]) is True. sum can count Boolean predicates because True and False act as 1 and 0 in arithmetic.'
],`values = [-2, -1, 0, 1, 2]
print([x * x for x in values if x > 0])
print(["+" if x > 0 else "-" for x in values])
print([(i, value) for i, value in enumerate(["a", "b"], start=1)])
print(list(zip([1, 2, 3], ["x", "y"])))
print(any([]), all([]))`,`[1, 4]\n['-', '-', '-', '+', '+']\n[(1, 'a'), (2, 'b')]\n[(1, 'x'), (2, 'y')]\nFalse True`,'The first expression filters; the second maps all five inputs. zip creates only two pairs because one input ends.','Dense comprehensions can hide logic. Use an ordinary loop when there are several updates, exceptions, or side effects.','Flatten [[1,2],[],[3,4]] and keep only even values.',`rows = [[1, 2], [], [3, 4]]
print([x for row in rows for x in row if x % 2 == 0])`,q('What is all([])?',['False','True','An exception'],1,'No element violates the condition; the conjunction identity is True.'));
lesson(m,'02 · Iterators and generators',[
'An iterable can provide an iterator with iter(). An iterator produces the next value with next() and raises StopIteration when exhausted. A list is reusable; a particular iterator is consumed as it advances.',
'A generator function contains yield. Calling it creates a generator without immediately executing the body. Each next resumes until the next yield; local state is suspended between yields. return ends iteration.',
'A generator expression uses parentheses and computes values lazily. This avoids materialising a large intermediate list when the consumer processes values one at a time. The source itself may still occupy memory.',
'map, filter, zip and enumerate produce lazy iterator objects in Python 3. Converting to list consumes them. To iterate twice, recreate the iterator or deliberately materialise it. Laziness also means errors may occur during consumption rather than construction.'
],`def squares(n):
    for i in range(n):
        yield i * i
g = squares(4)
print(next(g))
print(list(g))
print(list(g))
it = iter([10, 20])
print(next(it), next(it), next(it, "done"))`,`0\n[1, 4, 9]\n[]\n10 20 done`,'The first next consumes 0. list consumes the remaining three values. The exhausted generator subsequently produces no values. The default argument to next avoids StopIteration.','A generator is not an automatically reusable list. Saving it does not save all its produced values.','Write a generator yielding running totals of [2,5,-1].',`def running_total(values):
    total = 0
    for value in values:
        total += value
        yield total
print(list(running_total([2, 5, -1])))`,q('When does a generator function body first run?',['At definition','When the function is called','When the generator is first advanced'],2,'Calling creates the generator; next or iteration starts execution.'));
lesson(m,'03 · Functions as values and stable sorting',[
'Functions can be passed as arguments, returned, or stored in containers. lambda creates a function from one expression; def is clearer for multi-step logic. A key function transforms each item into the value used for ordering.',
'sorted returns a new list; list.sort mutates. Python sorting is stable: elements with equal keys retain their original relative order. A tuple key compares lexicographically, letting you express primary and secondary criteria.',
'To sort by descending score then ascending name, use key=lambda row: (-row[1], row[0]). reverse=True reverses the full ordering, which is different when only one criterion should descend.',
'min and max also accept key and, for an iterable, a default for empty input. Sorting all n elements to find one minimum does unnecessary O(n log n) work compared with one O(n) scan. Think about what result is actually required.'
],`rows = [("Ira", 80), ("Dev", 90), ("Asha", 90)]
print(sorted(rows, key=lambda row: (-row[1], row[0])))
print(rows)
print(max(rows, key=lambda row: row[1]))
words = ["aa", "b", "cc", "d"]
print(sorted(words, key=len))`,`[('Asha', 90), ('Dev', 90), ('Ira', 80)]\n[('Ira', 80), ('Dev', 90), ('Asha', 90)]\n('Dev', 90)\n['b', 'd', 'aa', 'cc']`,'Scores descend through negation, then names ascend. max returns the first maximum encountered. Stable sorting preserves b before d and aa before cc.','reverse=True does not mean reverse only the first component of a tuple key.','Sort ["pear","fig","apple","kiwi"] by length, breaking ties alphabetically.',`words = ["pear", "fig", "apple", "kiwi"]
print(sorted(words, key=lambda w: (len(w), w)))`,q('What does a stable sort preserve?',['The whole original order','Relative order of equal-key items','Only numeric order'],1,'Ties retain their input order.'));
m=module('reliable','Build reliable programs','Exceptions, tests, modules and data files','Practical extension');
lesson(m,'01 · Exceptions and debugging deliberately',[
'Read a traceback from its final exception line, then inspect the relevant frames and source lines. SyntaxError concerns parsing; NameError an unresolved name; TypeError an unsuitable operation/type; ValueError an unsuitable value; IndexError an invalid sequence index; KeyError an absent mapping key.',
'try handles only exceptions raised in its suite. except should name the specific exceptions you can meaningfully handle. else runs when the try suite succeeds; finally runs during normal exit and exception unwinding. A return in finally can suppress an earlier return or exception and should generally be avoided.',
'raise communicates a failed contract. Use ValueError for an invalid value and TypeError for an incompatible type when writing a reusable API. Do not hide every error with except: pass; unexpected failures then become much harder to diagnose.',
'Debug systematically: reproduce with the smallest input, state the expected result, inspect intermediate values using repr, change one hypothesis at a time, and add a regression test. Assertions express programmer expectations, but may be removed in optimised execution; do not use them as the only validation for user input.'
],`def parse_nonnegative(text):
    value = int(text)
    if value < 0:
        raise ValueError("negative value")
    return value
for text in ["12", "oops", "-3"]:
    try:
        value = parse_nonnegative(text)
    except ValueError:
        print("invalid:", text)
    else:
        print("accepted:", value)`,`accepted: 12\ninvalid: oops\ninvalid: -3`,'The second input fails conversion; the third fails the explicit range check. Both are handled as invalid user values.','Catching Exception around an entire application can conceal coding errors. Handle failures close to where recovery makes sense.','Convert a list of strings into integers, collecting invalid entries separately.',`valid, invalid = [], []
for item in ["2", "x", "-4", "3.5"]:
    try:
        valid.append(int(item))
    except ValueError:
        invalid.append(item)
print(valid, invalid)`,q('Which exception does int("apple") raise?',['TypeError','ValueError','IndexError'],1,'The input type is accepted, but the string has no valid integer representation.'));
lesson(m,'02 · Tests and edge cases',[
'A test compares observed behaviour to a specification. Include typical examples, boundaries, empty input, singleton input, duplicates, negative values, and invalid input where relevant. A function that passes one demonstration is not established as correct.',
'Use assertions for small development checks and unittest or another test runner for a growing project. Each test should be independent. Test returned values and intended mutation, not merely whether execution produces no exception.',
'Properties can catch errors beyond fixed examples: sorting should preserve length and element counts, reversing twice should recover the sequence, and normalising an already normalised value should leave it unchanged. Randomised tests can help, but use a seed for reproducibility.',
'Use a simple trusted method as an oracle for small inputs, then compare a faster implementation. Testing increases confidence; an invariant or proof explains why an algorithm works for all valid inputs. Both are useful for exam reasoning.'
],`def unique_in_order(values):
    return list(dict.fromkeys(values))
cases = [([], []), ([1], [1]), ([2, 1, 2, 3, 1], [2, 1, 3])]
for values, expected in cases:
    before = values[:]
    assert unique_in_order(values) == expected
    assert values == before
print("3 cases passed")`,`3 cases passed`,'The second assertion checks a non-mutation promise. A correct output is insufficient if the function unexpectedly damages its input.','Do not generate expected answers using the same buggy algorithm under test.','Write tests for a palindrome function, including empty text and mixed case.',`def palindrome(s):
    s = s.casefold()
    return s == s[::-1]
assert palindrome("")
assert palindrome("Aba")
assert not palindrome("ab")
print("passed")`,q('Which is a useful sorting property?',['Output length always increases','Output is ordered and preserves element counts','Output contains only unique values'],1,'Sorting rearranges; it should not lose or duplicate elements.'));
lesson(m,'03 · Files, JSON, CSV and context managers',[
'Use with open(path, mode, encoding="utf-8") as f to close a file even when processing raises an exception. r reads, w truncates or creates, a appends, and x creates only if absent. Binary modes use bytes rather than text strings.',
'read loads content; iterating over a file reads lines progressively. write returns the number of characters written and does not append a newline automatically. Relative paths are resolved from the current working directory, not necessarily the script directory.',
'json encodes structured objects such as lists and dicts. JSON object keys are strings; JSON has no tuple or set type. csv handles delimiters and quoting correctly; use newline="" when opening CSV files. Never use eval to load a data file.',
'The browser lab uses a temporary virtual filesystem, separate from your computer. Each run starts fresh. Download the .py example and run it locally to create persistent local files. Explicitly choosing paths and encoding avoids many portability surprises.'
],`import json, csv, io
data = {"topic": "Python", "scores": [8, 9, 10]}
with open("progress.json", "w", encoding="utf-8") as f:
    json.dump(data, f)
with open("progress.json", encoding="utf-8") as f:
    restored = json.load(f)
print(restored["scores"])
text = 'name,score\\n"Rao, A",90\\nDev,80\\n'
rows = list(csv.DictReader(io.StringIO(text)))
print(rows[0]["name"], rows[0]["score"])`,`[8, 9, 10]\nRao, A 90`,'The quoted comma belongs inside the first name. csv recognises that structure; a plain comma split would incorrectly create three fields. CSV values remain strings until explicitly converted.','Opening an existing file with w erases its previous content. Know the mode before writing.','Round-trip a list of two student records through JSON and verify equality.',`import json
students = [{"name": "Asha", "mark": 82}, {"name": "Dev", "mark": 90}]
encoded = json.dumps(students)
assert json.loads(encoded) == students
print(encoded)`,q('Which mode appends without truncating an existing file?',['w','a','r'],1,'a writes at the end; w truncates.'));
lesson(m,'04 · Modules and a practical workflow',[
'A module is a Python file with its own namespace. import math binds the module name; from math import sqrt binds a particular attribute. Avoid wildcard imports because they obscure where names came from. Do not name your own file random.py or json.py when you need the standard module.',
'A script commonly puts orchestration in main() and calls it under if __name__ == "__main__". When imported, the module can expose reusable functions without automatically running its command-line workflow. Top-level code still executes on first import.',
'Use python -m venv .venv to create a project environment and python -m pip install package to install into the chosen interpreter. Record dependencies for reproducibility. This course’s examples use the standard library; NumPy and pandas are useful later, but not prerequisites here.',
'Develop in a cycle: write a small specification, implement one function, run tests, inspect failures, refactor, and document. Use version control for meaningful checkpoints. A docstring explains a function’s contract; comments should explain a non-obvious reason rather than restating every line.'
],`import math
def distance(x1, y1, x2, y2):
    """Return Euclidean distance between two 2D points."""
    return math.hypot(x2 - x1, y2 - y1)
def main():
    print(distance(0, 0, 3, 4))
if __name__ == "__main__":
    main()`,`5.0`,'math.hypot computes the length robustly. The guard runs main when executed as a script. Imported callers can use distance without that print.','A module name can be shadowed by a local file or variable of the same name.','Extract a reusable clamp(x,low,high) function with validation and three tests.',`def clamp(x, low, high):
    if low > high:
        raise ValueError("reversed bounds")
    return min(high, max(low, x))
assert clamp(-1, 0, 10) == 0
assert clamp(5, 0, 10) == 5
assert clamp(12, 0, 10) == 10
print("passed")`,q('Why use the __name__ guard?',['To prevent all imports','To separate script execution from reusable definitions','To make code run faster'],1,'The guarded workflow runs when executed directly, not when imported.'));
