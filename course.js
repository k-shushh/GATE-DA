/* Original lessons. Python 3 semantics; examples avoid version-specific tricks. */
window.COURSE = [];
function module(id,title,subtitle,tag='Core Python'){const m={id,title,subtitle,tag,lessons:[],questions:[],cards:[]};COURSE.push(m);return m;}
function lesson(m,title,concepts,code,output,walk,trap,task,solution,check){m.lessons.push({id:m.id+'-'+(m.lessons.length+1),title,concepts,code,output,walk,trap,task,solution,check});}
function q(prompt,options,answer,explain){return {prompt,options,answer,explain};}
let m=module('start','Think like Python','Execution, values, expressions and the first reliable mental model');
lesson(m,'01 · From a file to a running program',[
'A program is a sequence of instructions that transforms input into output. An algorithm is the method; Python is one language for expressing it. Before writing code, state the input, the expected result, and what counts as a valid input.',
'Save code as a .py file and run it with python filename.py (or py filename.py on Windows). A REPL evaluates one interaction at a time; a script runs top to bottom. In a script, an expression alone does not display its value: use print. Our browser lab runs real Python in a separate worker.',
'Indentation defines blocks. Use four spaces consistently, a colon before an indented suite, and # for a comment. Names are case-sensitive; total and Total differ. Choose meaningful identifiers and avoid shadowing built-ins such as list, str and sum. A newline usually ends a statement; brackets permit readable multi-line expressions.',
'Syntax errors prevent parsing. Runtime errors happen while executing valid syntax. Logic errors produce the wrong result without an exception. Debug by first predicting the state, then comparing it to observed output; do not randomly edit until a test passes.'
],`price = 120
quantity = 3
subtotal = price * quantity
discount = 0.10
total = subtotal * (1 - discount)
print(f"Total: {total:.2f}")`,`Total: 324.00`,'First multiply 120 by 3. Then apply the remaining fraction 0.9. The f-string formats the numeric value with two digits after the decimal point; formatting does not change the stored number.','10% is written as 0.10, not 10. Python does not infer units such as rupees or percentages.','Change the quantity to 5 and discount to 20%. Predict the total before running.',`price, quantity, discount = 120, 5, 0.20
print(f"Total: {price * quantity * (1-discount):.2f}")`,q('What displays the result of 4 + 5 in a script?',['4 + 5','print(4 + 5)','result = 4 + 5'],1,'Only print explicitly sends the value to standard output. Assignment binds a name.'));
lesson(m,'02 · Names, objects and types',[
'A name refers to an object; it is not a permanently typed storage box. x = 3 binds x to an integer object. x = "three" later rebinds that name to a string. Objects have types; names can refer to different types over time. Assignment itself does not copy an object.',
'The main scalar types are int (arbitrary precision within memory limits), float (binary floating point), bool (True or False), complex and NoneType. None is a singleton used to represent absence, not zero or an empty string. Test it with is None.',
'Use type(x) to inspect a type and isinstance(x, T) for a type relationship. bool is a subclass of int, so isinstance(True, int) is True. Numeric conversions are explicit when needed: int("12") is 12; int("12.5") fails; int(-2.9) is -2 because conversion truncates toward zero.',
'Parallel assignment evaluates the right side before binding the left side. This makes a, b = b, a a correct swap. Two names referring to the same mutable object matter later: changing that object through either name is visible through both.'
],`a = 7
b = a
a = a + 1
print(a, b)
a, b = b, a
print(a, b)
print(type(3).__name__, int(-2.9), None is None)`,`8 7\n7 8\nint -2 True`,'a + 1 creates a new integer value and rebinds a. b still refers to 7. Swapping then uses the old pair of values simultaneously.','Do not use is to compare numeric or string values. Object reuse is an implementation detail; use == for equal values.','Start with x=2,y=5. Swap them without a temporary name, then print their types.',`x, y = 2, 5
x, y = y, x
print(x, y, type(x).__name__, type(y).__name__)`,q('After a=4; b=a; a=9, what is b?',['4','9','An error'],0,'Rebinding a does not rebind b.'));
lesson(m,'03 · Arithmetic and the negative-number trap',[
'Use +, -, *, /, //, %, and ** for addition, subtraction, multiplication, true division, floor division, remainder, and exponentiation. True division of integers produces a float. Floor division rounds the quotient toward negative infinity; int conversion instead truncates toward zero.',
'For nonzero b, integer division obeys a == (a // b) * b + a % b. The remainder is zero or has the sign of b. Therefore -7 // 3 is -3 and -7 % 3 is 2. This identity is safer than memorising a rule from another language.',
'Exponentiation associates right-to-left: 2 ** 3 ** 2 is 2 ** 9. Unary minus on the left is applied after exponentiation: -2 ** 2 is -4. Parenthesise intentionally. Multiplication/division bind before addition/subtraction; operators at the same arithmetic level usually associate left-to-right.',
'Binary floats approximate most decimal fractions. Do not assume 0.1 + 0.2 == 0.3. Use math.isclose for measured quantities with suitable tolerances, Decimal constructed from strings for decimal arithmetic, or Fraction for exact rational arithmetic. Python integers do not have fixed 32-bit overflow, but huge integer operations are not constant-time.'
],`import math
print(-7 // 3, -7 % 3)
print((-7 // 3) * 3 + (-7 % 3))
print(-2 ** 2, (-2) ** 2, 2 ** 3 ** 2)
print(0.1 + 0.2 == 0.3, math.isclose(0.1 + 0.2, 0.3))`,`-3 2\n-7\n-4 4 512\nFalse True`,'The quotient -3 and remainder 2 reconstruct -7. Parentheses change whether the minus sign is part of the base. isclose checks approximate equality rather than identical binary representations.','/ and // are not interchangeable. Also, ^ is bitwise XOR, not exponentiation.','For a=7,b=-3, calculate quotient and remainder by hand, then check the identity.',`a, b = 7, -3
print(a // b, a % b)
assert a == (a // b) * b + a % b`,q('What is -8 // 3?',['-2','-3','-2.666…'],1,'The exact quotient is about -2.67; floor division rounds down to -3.'));
lesson(m,'04 · Comparisons, truth and bits',[
'Comparisons ==, !=, <, <=, > and >= produce Booleans. Chained comparisons such as 0 <= x < 10 express a range. Membership in asks whether a container contains a value (for a dict, it tests keys). is asks whether two references identify the same object.',
'False values include False, None, numeric zero and empty containers. Nonempty strings are true, including "False" and "0". and and or short-circuit and return an operand, not necessarily a bool: [] or [1] returns [1]; 0 and dangerous_call() returns 0 without making the call.',
'A practical precedence ladder is: indexing/calls; exponentiation; unary arithmetic; multiplication/division/remainder; addition/subtraction; shifts; bitwise &, ^, |; comparisons and membership/identity; not; and; or. Use parentheses for clarity rather than relying on obscure precedence.',
'For integers, & intersects set bits, | combines them, ^ toggles differing bits, and << or >> shifts. For nonnegative x, x << k equals x * 2**k. Python signed integers behave as though they have infinitely extended sign bits: ~x equals -x-1 and -3 >> 1 is -2. Bitwise & is not a replacement for Boolean and.'
],`print(bool("False"), bool([]))
print(0 or 7, 3 and 8)
print(0 < 4 < 5)
print(6 & 3, 6 | 3, 6 ^ 3, 1 << 3)
print(~5, -3 >> 1)`,`True False\n7 8\nTrue\n2 7 5 8\n-6 -2`,'6 is binary 110 and 3 is 011. AND keeps 010, OR yields 111, XOR yields 101. These correspond to 2, 7, and 5.','A fallback such as value or default replaces all false values, including legitimate zero. Use an explicit None check when zero must survive.','Write a safe test for a nonempty list whose first element is positive.',`values = []
print(bool(values) and values[0] > 0)`,q('What is [] or "ready"?',['False','True','"ready"'],2,'The empty list is false, so or evaluates and returns its second operand.'));
m=module('flow','Control the flow','Decisions, iteration, tracing and correctness');
lesson(m,'01 · Decisions and input contracts',[
'An if/elif/else chain selects the first true branch and skips the remaining branches. Separate if statements are independent and may all execute. Put the most specific conditions before more general ones when their ranges overlap.',
'input() returns a string, even when the user types digits. Parse with int or float only after deciding what inputs you accept. Our lab has an input-lines box: one line is consumed by each input call. For self-contained examples we often use literal inputs so the behaviour is reproducible.',
'Express preconditions explicitly. A percentage score should usually lie between 0 and 100; reject invalid values rather than silently classifying them. Boundary values deserve separate tests: just below, equal to, and just above each threshold.',
'A conditional expression is value_if_true if condition else value_if_false. It is useful for one short choice; deeply nested conditional expressions obscure logic. match/case (Python 3.10+) performs structural pattern matching, not arbitrary Boolean selection; ordinary if statements are enough for this course.'
],`score = 78
if not 0 <= score <= 100:
    print("Invalid")
elif score >= 80:
    print("Distinction")
elif score >= 60:
    print("Pass")
else:
    print("Revise")
print("even" if score % 2 == 0 else "odd")`,`Pass\neven`,'78 misses the 80 threshold, reaches the 60 threshold, and prints Pass. Only one branch runs. The separate expression then classifies parity.','if x == 1 or 2 is almost always wrong: it means (x == 1) or 2 and is always truthy. Use x in (1, 2).','Classify a year as leap if divisible by 400, or divisible by 4 but not 100. Test 1900, 2000, 2024.',`for year in [1900, 2000, 2024]:
    leap = year % 400 == 0 or (year % 4 == 0 and year % 100 != 0)
    print(year, leap)`,q('How many branches of one if/elif/else chain execute?',['Exactly two','At most one','All true branches'],1,'The first matching branch wins; without else, none may run.'));
lesson(m,'02 · for, range and while',[
'A for loop takes successive values from an iterable. range(start, stop, step) is a compact sequence of integers excluding stop. Defaults are start=0 and step=1; step cannot be zero. A negative step is needed to count down. range(5, 0, -2) yields 5, 3, 1.',
'A while loop repeats while its condition is true. Identify the initial state, condition, body and update. Prove that each iteration makes progress toward termination. A missing update is a common cause of infinite loops.',
'An accumulator combines values (sum, product, maximum); a counter counts events. Choose the initial value from the operation identity: 0 for addition, 1 for multiplication. For a maximum over potentially negative numbers, initialise from the first value or use None, not automatically 0.',
'An invariant is a statement that stays true before each iteration. In a running sum over a sequence, total equals the sum of all elements already visited. Initially no elements are visited and total=0; each update preserves the claim; at termination it proves correctness.'
],`total = 0
for number in range(1, 6):
    total += number
    print(number, total)
n = 13
bits = 0
while n > 0:
    bits += 1
    n //= 2
print("bits:", bits)`,`1 1\n2 3\n3 6\n4 10\n5 15\nbits: 4`,'The first loop adds 1 through 5. The while loop visits n=13,6,3,1 before reaching zero, giving four binary digits.','range endpoints are excluded. range(1, n) does not include n. An empty range executes the body zero times.','Compute the sum of odd integers from 1 to 99 with a loop. Then derive it without a loop.',`total = 0
for n in range(1, 100, 2):
    total += n
print(total)
print(50 ** 2)`,q('What is list(range(6, 0, -2))?',['[6, 4, 2]','[6, 4, 2, 0]','[]'],0,'Start at 6, subtract 2, and stop before reaching 0.'));
lesson(m,'03 · break, continue, else and nested loops',[
'break exits the nearest enclosing loop. continue skips the rest of the current iteration and proceeds to the next one. pass does nothing; it is a syntactic placeholder, not a skip instruction.',
'A loop else runs when the loop finishes without break, including when the loop executes zero times. It is useful for unsuccessful searches. A return inside a function exits the whole function and therefore does not execute the loop else.',
'For nested loops, draw one row per outer-loop value and count inner iterations. If the inner loop runs i times for i=0..n-1, the total is n(n-1)/2, not n. A break inside the inner loop does not exit the outer loop.',
'Avoid changing list length while iterating over it: shifted positions can be skipped. Construct a filtered list or iterate over a deliberate copy. If updating a while-loop variable, ensure a continue cannot accidentally bypass the update.'
],`n = 17
for divisor in range(2, int(n ** 0.5) + 1):
    if n % divisor == 0:
        print("composite")
        break
else:
    print("prime" if n >= 2 else "not prime")
count = 0
for i in range(4):
    for j in range(i):
        count += 1
print(count)`,`prime\n6`,'No divisor 2, 3 or 4 divides 17, so the else executes. The nested-loop counts are 0+1+2+3=6. For very large integers, math.isqrt is safer than a floating-point square root.','The else belongs to the loop at the same indentation, not the inner if.','Return the first negative number in a list, or None if no negative exists.',`def first_negative(values):
    for value in values:
        if value < 0:
            return value
    return None
print(first_negative([4, 0, -3, -7]))`,q('When does a for-loop else execute?',['Only after break','Whenever the loop ends without break','Only if the iterable is nonempty'],1,'Normal exhaustion triggers else, even for an empty iterable.'));
m=module('text','Work with text','Indexing, slicing, parsing and clean transformations');
lesson(m,'01 · Strings and slicing',[
'A str is an immutable sequence of Unicode code points. Index 0 selects the first element; -1 selects the last. Indexing outside the sequence raises IndexError. len counts code points, which need not equal the number of visually perceived characters.',
's[start:stop:step] selects indices beginning at start and ending before stop. For positive steps, omitted bounds cover left to right; for negative steps they cover right to left. Slices clip out-of-range bounds and can be empty. A zero step raises ValueError.',
's[::-1] reverses the sequence. s[-1:0:-1] includes the last character and excludes index 0. The omitted stop in s[::-1] is not the same as an explicit -1 in s[:-1:-1]; explicit negative indices are normalised first.',
'Strings cannot be edited in place. To replace a character, construct a new string from pieces. The original string is unaffected. Raw string literals make backslashes easier to write, but cannot end in a single unescaped backslash. Escape sequences such as \\n represent one newline character.'
],`s = "PYTHON"
print(s[0], s[-1])
print(s[1:5:2])
print(s[::-1])
print(s[-1:0:-1])
print(s[99:], s[:99])`,`P N\nYH\nNOHTYP\nNOHTY\n PYTHON`,'Indices 1 and 3 spell YH. Reversal visits 5,4,3,2,1,0. Excluding index 0 omits the P. The last print begins with a space because its first argument is an empty string.','A slice never changes the source string. Negative step does not automatically reverse arbitrary start/stop choices.','Extract every second character from "abcdefgh" starting at index 1, then reverse the result.',`s = "abcdefgh"
print(s[1::2][::-1])`,q('What is "GATE"[1:3]?',['GA','AT','ATE'],1,'The slice includes indices 1 and 2, excluding index 3.'));
lesson(m,'02 · Methods, parsing and formatting',[
'strip removes specified characters from the two ends, not a substring from the middle. split() with no separator collapses runs of whitespace; split(",") treats each comma as a delimiter and can preserve empty fields. separator.join(strings) assembles strings with separators.',
'lower and casefold support case normalisation; casefold is more aggressive for Unicode comparisons. startswith, endswith, find, count and replace support common text tasks. find returns -1 when absent; index raises ValueError. Never treat a find result directly as Boolean because 0 is a valid found index.',
'f-strings evaluate expressions inside braces. Use format specifications such as :.2f for two decimal places or :>8 for right alignment. repr exposes quotes and escape characters, while str produces a user-facing representation.',
'Parsing is a pipeline: normalise, split, validate, convert, then compute. Do not use eval to parse untrusted data. For structured formats use csv or json. CSV fields can contain quoted commas, so naive split(",") is appropriate only when the input contract excludes them.'
],`raw = "  Alice, 82, 91, 87  "
parts = raw.strip().split(",")
name = parts[0].strip()
marks = [int(piece) for piece in parts[1:]]
mean = sum(marks) / len(marks)
print(f"{name}: {mean:.2f}")
print("-".join(["DA", "Python", "2027"]))`,`Alice: 86.67\nDA-Python-2027`,'The first field remains text; the other fields become integers. The average is 260/3. Formatting rounds the displayed result without modifying mean.','strip("ab") removes any a or b at either end; it does not remove exactly the prefix "ab". Use removeprefix for that purpose.','Normalise "  Learn   PYTHON today  " into "learn python today".',`text = "  Learn   PYTHON today  "
print(" ".join(text.lower().split()))`,q('Which safely finds absence using s.find("x")?',['if s.find("x"):','if s.find("x") == -1:','if s.find("x") == 0:'],1,'-1 indicates absence; 0 means the match begins at the start.'));
lesson(m,'03 · Text algorithms and edge cases',[
'A palindrome reads identically forwards and backwards. First define the comparison rule: are spaces, punctuation and letter case significant? The preprocessing policy is part of the algorithm, not an afterthought.',
'A character histogram maps each character to a count. Comparing histograms tests whether two strings are anagrams under the chosen normalisation. Sorting also works but usually costs O(n log n), versus expected O(n) counting with a hash table.',
'A two-pointer palindrome check advances from both ends and can stop at the first mismatch. It uses O(1) extra space on the existing string. Constructing s[::-1] uses O(n) additional space. Normalisation may itself require O(n) space.',
'For repeated concatenation of many strings, collect pieces in a list and join once. Repeatedly creating a larger immutable string can require quadratic total copying. Always test empty text, one character, repeated characters, and mixed case.'
],`def palindrome(text):
    clean = "".join(c.casefold() for c in text if c.isalnum())
    left, right = 0, len(clean) - 1
    while left < right:
        if clean[left] != clean[right]:
            return False
        left += 1
        right -= 1
    return True
print(palindrome("Never odd or even"))
print(palindrome("Python"))`,`True\nFalse`,'The first string normalises to neveroddoreven. Each mirrored pair matches. Python fails on its first pair, p and n.','The empty string is usually a palindrome under the standard definition; document that decision rather than allowing a test to surprise you.','Count vowels in text without counting uppercase vowels differently.',`text = "Data Science AND AI"
print(sum(c in "aeiou" for c in text.casefold()))`,q('What extra space does s[::-1] require for a length-n string?',['O(1)','O(log n)','O(n)'],2,'A new reversed sequence stores n characters.'));
m=module('sequence','Lists, tuples & memory','Mutation, copying and the traps behind output questions');
lesson(m,'01 · Sequence operations and list methods',[
'A list is a mutable ordered sequence; a tuple is an immutable ordered sequence. Both support indexing, slicing, iteration, membership, concatenation and repetition. A one-element tuple needs a comma: (5,) is a tuple, (5) is an integer.',
'append(x) adds one object; extend(iterable) appends its elements. insert(i,x) inserts before index i. pop(i) removes and returns an item; remove(x) removes the first equal value. del can delete an index or slice. clear empties the list.',
'sort and reverse mutate a list and return None. sorted(iterable) creates a new list. Slicing creates a new outer sequence. Slice assignment such as a[1:3] = [9] can change list length; extended-slice assignment needs the same number of replacement elements as selected positions.',
'Sequence unpacking requires matching lengths unless a starred target absorbs remaining elements: first, *middle, last = values. Membership in a list typically scans; indexing is constant-time in the usual Python list model.'
],`a = [1, 2]
a.append([3, 4])
print(a)
b = [1, 2]
b.extend([3, 4])
print(b)
removed = b.pop(1)
result = b.reverse()
print(removed, b, result)
print((5,), type((5)).__name__)`,`[1, 2, [3, 4]]\n[1, 2, 3, 4]\n2 [4, 3, 1] None\n(5,) int`,'append keeps the nested list as one element. extend iterates through its two values. pop(1) removes 2; reverse changes b and returns None.','a = a.sort() loses the reference to the sorted list by rebinding a to None.','Remove duplicates from [3,1,3,2,1] while preserving the first occurrence order.',`values = [3, 1, 3, 2, 1]
result = []
for x in values:
    if x not in result:
        result.append(x)
print(result)`,q('What does a.append([2,3]) add?',['Two elements','One list element','Nothing'],1,'append always adds its argument as one element.'));
lesson(m,'02 · Aliasing, shallow and deep copies',[
'a = [1,2]; b = a gives two names for one list. b.append(3) changes the shared object. b = [9] instead rebinds b to a different object and leaves a unchanged. Distinguish an arrow change (rebinding) from an object change (mutation).',
'b = a[:] or a.copy() creates a new outer list, but nested objects remain shared. A shallow copy is sufficient when inner objects will not be mutated or are immutable. deepcopy recursively copies nested structure while tracking objects already copied.',
'Equality == asks whether values compare equal; identity is asks whether the objects are the same. A shallow copy usually satisfies a == b and a is not b initially. Independent outer lists can still refer to identical inner objects.',
'With lists, += generally extends the existing object, whereas a = a + values creates a new list and rebinds a. Aliases observe the first operation but continue pointing to the old list after the second. These details explain many Python output questions.'
],`from copy import deepcopy
a = [[1], [2]]
b = a[:]
c = deepcopy(a)
b[0].append(9)
b[1] = [7]
print(a)
print(b)
print(c)
print(a is b, a[0] is b[0])`,`[[1, 9], [2]]\n[[1, 9], [7]]\n[[1], [2]]\nFalse True`,'b[0].append changes the inner list shared with a. b[1]=[7] replaces only one reference in b. c contains separately copied nested lists.','A shallow copy protects the outer container, not arbitrary nested objects.','Create aliases x and y for [1], execute x += [2], then x = x + [3]. Predict y after each line.',`x = [1]
y = x
x += [2]
print(y)
x = x + [3]
print(x, y)`,q('After b=a[:], what is guaranteed for a list a?',['All nested objects are copied','The outer list b is a distinct object','b is a'],1,'Slicing makes a new outer list; the element references are copied.'));
lesson(m,'03 · Matrices and nested-container traps',[
'A matrix can be represented as a list of row lists. matrix[r][c] first selects a row, then a column. Define whether ragged rows are permitted; many matrix algorithms require equal row lengths.',
'[[0] * columns] * rows repeats references to the same row. Mutating one row through any position appears in every row. [[0] * columns for _ in range(rows)] evaluates the inner expression separately for each row and creates independent row objects.',
'Tuple immutability prevents replacing its element references, but a tuple may contain a mutable list whose contents can change. Consequently not every tuple is hashable: a tuple containing a list cannot be a dict key.',
'For a rectangular matrix, transpose swaps row and column positions. zip(*matrix) groups corresponding row elements and returns tuples; by default it stops at the shortest row. Use explicit shape validation if dropping values would be a bug.'
],`bad = [[0] * 3] * 2
good = [[0] * 3 for _ in range(2)]
bad[0][1] = 5
good[0][1] = 5
print(bad)
print(good)
t = ([1], 2)
t[0].append(3)
print(t)
print(list(zip(*[[1, 2], [3, 4]])))`,`[[0, 5, 0], [0, 5, 0]]\n[[0, 5, 0], [0, 0, 0]]\n([1, 3], 2)\n[(1, 3), (2, 4)]`,'Both entries in bad reference the same row. good has two rows. Mutating the list inside t changes the list, not which object the tuple points to.','[[0]] * n repeats references, not independent lists. Multiplication is safe for the row of immutable integers, but not for the outer repeated row.','Create a 3×3 identity matrix with independent rows.',`n = 3
identity = [[int(r == c) for c in range(n)] for r in range(n)]
print(identity)`,q('Which creates three independent empty lists?',['[[]] * 3','[[] for _ in range(3)]','Both'],1,'The comprehension evaluates [] separately on each iteration.'));
