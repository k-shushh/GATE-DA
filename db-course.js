/* Original Database Management & Warehousing curriculum. All examples use Python 3. */
const DB_SEED=`PRAGMA foreign_keys=ON;
CREATE TABLE student(id INTEGER PRIMARY KEY, name TEXT NOT NULL, city TEXT, score REAL CHECK(score BETWEEN 0 AND 100));
INSERT INTO student VALUES(1,'Asha','Delhi',80),(2,'Bina','Pune',90),(3,'Chen','Delhi',NULL),(4,'Dev','Pune',70);
CREATE TABLE course(id TEXT PRIMARY KEY, title TEXT NOT NULL);
INSERT INTO course VALUES('P','Python'),('D','Databases'),('A','Algorithms');
CREATE TABLE enrol(sid INTEGER REFERENCES student(id), cid TEXT REFERENCES course(id), mark INTEGER, PRIMARY KEY(sid,cid));
INSERT INTO enrol VALUES(1,'P',80),(1,'D',90),(2,'P',95),(2,'D',85),(3,'P',60);
CREATE TABLE sales(city TEXT, month TEXT, product TEXT, revenue INTEGER, units INTEGER);
INSERT INTO sales VALUES('Delhi','Jan','Book',120,3),('Delhi','Feb','Book',80,2),('Pune','Jan','Book',100,2),('Pune','Jan','Pen',60,6);`;
function dbmodule(id,title,subtitle){const m=module('db-'+id,title,subtitle,'Database & warehouse');m.track='db';return m;}
function dbLesson(m,title,concepts,example,walk,trap,task,solution,check,visual='sql',isPython=false){const python=sql=>`import sqlite3\ndb = sqlite3.connect(':memory:')\ndb.executescript(${JSON.stringify(DB_SEED)})\nquery = ${JSON.stringify(sql)}\nrows = db.execute(query).fetchall()\nif not rows: print('(no rows)')\nfor row in rows:\n    print(row)`;lesson(m,String(m.lessons.length+1).padStart(2,'0')+' · '+title,concepts,isPython?example:python(example),'pending verification',walk,trap,task,isPython?solution:python(solution),check);const l=m.lessons.at(-1);l.visual=visual;if(!isPython){l.sql=example;l.sqlSolution=solution;}l.check.id=l.id+'-check';}
let dbm=dbmodule('model','Model the data','Entities, relationships, keys and integrity before you write SQL');
dbLesson(dbm,'From files to a relational database',[
'A database stores related facts under a schema. A DBMS supplies querying, constraints and controlled updates. Separate the logical schema (what attributes mean) from the current instance (the rows today) and the physical layout (pages and indexes). A spreadsheet can display a relation, but its row positions and formatting are not relational facts.',
'A relation has attributes with domains and tuples with one value per attribute. Degree is the number of attributes; cardinality is the number of tuples. In the mathematical model a relation is a set: no duplicate tuples and no meaningful row order. SQL normally uses bags, so duplicate query results are possible unless DISTINCT is requested.',
'A superkey uniquely identifies a tuple in every legal instance. A candidate key is a minimal superkey: remove any attribute and uniqueness is no longer guaranteed. Select one as the primary key; other candidates are alternate keys. A composite key contains several attributes. Observing unique names in four current rows does not establish a schema-level key.',
'Begin a design by writing facts such as “one enrolment per student and course”. That fact suggests the composite key (sid,cid), while student.id identifies a person. A foreign key expresses a reference to a declared unique or primary key in another relation. Avoid storing comma-separated course lists in one cell when each enrolment is a separate fact.'
],`SELECT id, name FROM student ORDER BY id;`,'Read each result as one identified student. ORDER BY is what makes the display order guaranteed.','A key is a constraint over all valid data, not an accidental property of the sample.','Return the distinct cities in alphabetical order.',`SELECT DISTINCT city FROM student ORDER BY city;`,q('If AB is a candidate key, which must be true?',['AB is unique and neither A nor B alone is a key','A must be unique','Every row must have a distinct B','The table is already in BCNF'],0,'Minimality applies to the attribute set AB, not to the uniqueness of each component.'));
dbLesson(dbm,'Draw an ER model, then map it',[
'An entity is a distinguishable object; an entity set groups objects of one kind. Attributes may be simple, composite, multivalued or derived. Model a person’s address as components when queries need those components. A derived age can be calculated from birth date rather than stored and allowed to become stale.',
'A relationship associates entities and may have its own attributes: mark belongs to an enrolment, not to a student alone. Maximum cardinality distinguishes 1:1, 1:N and M:N. Minimum participation distinguishes optional (0) from mandatory (1). “Each student takes many courses” says neither that every student takes a course nor that each course has a student.',
'Map a strong entity to a relation with its key. In 1:N, put the 1-side key as a foreign key on the N side; add NOT NULL for mandatory participation there. For 1:1, a UNIQUE foreign key enforces the maximum. For M:N, create a relationship relation containing both keys plus relationship attributes. A multivalued attribute gets its own relation.',
'A weak entity depends on an owner and has a partial key that is unique only within that owner. Its identifying key combines owner key and partial key. For example, OrderLine(order_id,line_no) needs both attributes. An ISA hierarchy may use a parent relation plus subtype relations sharing its key; state whether subtypes overlap and whether specialization is total. These choices alter constraints, not just the diagram.'
],`SELECT s.name, c.title, e.mark FROM enrol e JOIN student s ON s.id=e.sid JOIN course c ON c.id=e.cid ORDER BY s.id,c.id;`,'Enrol resolves the M:N relationship. Each join matches a key to its reference.','A foreign key alone does not enforce that every parent has at least one child.','Find courses with no enrolments; preserve the unmatched course.',`SELECT c.title FROM course c LEFT JOIN enrol e ON e.cid=c.id WHERE e.sid IS NULL;`,q('Where does a relationship attribute for an M:N relationship belong?',['In the relationship relation','Only in the first entity','Only in the second entity','It cannot be represented'],0,'The attribute depends on the participating combination, such as (student,course).'),'er');
dbLesson(dbm,'Integrity, domains and NULL',[
'Domain constraints restrict values: type, allowed range, format or enumeration. Entity integrity requires a primary key to be unique and non-NULL in the relational design. Referential integrity prevents a non-NULL foreign key from referring to an absent parent. The child may allow NULL if its participation is optional.',
'SQL expresses rules using PRIMARY KEY, UNIQUE, NOT NULL, CHECK and FOREIGN KEY. A composite key must be unique as a combination. CHECK is normally satisfied by TRUE or UNKNOWN, so CHECK(score>=0) alone does not forbid NULL. Combine it with NOT NULL when absence is forbidden. A UNIQUE constraint’s treatment of NULL depends on the database.',
'NULL represents missing or inapplicable information, not zero, an empty string or a value equal to itself. Comparisons such as score = NULL evaluate to UNKNOWN; WHERE retains only TRUE. Use IS NULL or IS NOT NULL. In three-valued logic FALSE AND UNKNOWN is FALSE, TRUE OR UNKNOWN is TRUE, and NOT UNKNOWN remains UNKNOWN.',
'When a parent changes, referential actions may reject the operation, cascade it or set child keys to NULL, subject to the schema. Prefer explicit behavior. In the SQLite exercises foreign-key checking is enabled explicitly and INTEGER PRIMARY KEY is used. SQLite has flexible typing and some historical key exceptions, so do not infer general exam SQL rules from every behavior it permits.'
],`SELECT name, score IS NULL AS missing FROM student ORDER BY id;`,'Chen has a missing score. IS NULL yields a usable true/false test.','WHERE score <> 80 also excludes NULL; it does not mean every row except the 80 row.','List students with a missing score or a score at least 90.',`SELECT name FROM student WHERE score IS NULL OR score>=90 ORDER BY id;`,q('What does WHERE retain?',['Rows for which its predicate is TRUE','TRUE and UNKNOWN','Only FALSE','Every nonempty row'],0,'FALSE and UNKNOWN are both rejected by WHERE.'));
dbm=dbmodule('algebra','Relational algebra','Build queries from sets, joins, division and equivalences');
dbLesson(dbm,'Selection, projection and set operations',[
'Relational algebra is a compositional language: each operator takes relations and returns a relation. Selection sigma_p(R) keeps tuples satisfying predicate p without changing the attributes. Projection pi_A(R) keeps specified attributes and eliminates duplicate tuples under set semantics. Rename rho changes relation or attribute names and enables self-joins.',
'Union, intersection and difference require union-compatible operands: the same degree and compatible corresponding domains. Union combines tuples, intersection retains common tuples, and R−S keeps those in R but not S. Difference is not commutative. SQL UNION, INTERSECT and EXCEPT normally remove duplicates; UNION ALL preserves them.',
'Cartesian product pairs every tuple of R with every tuple of S. If the relations have r and s tuples, the product has r*s tuples; rename colliding attribute names to avoid ambiguity. A selection over that product can express a theta join. Intermediate relations let you derive complicated queries one operator at a time.',
'To translate prose, identify the desired output attributes, the necessary source relations and predicates. Push a selection toward its source when valid; project away attributes only after retaining everything needed by later joins and predicates. Set algebra and SQL bags differ: a projection of city returns two distinct values in algebra but four rows in plain SQL here.'
],`SELECT DISTINCT city FROM student WHERE score>=70 ORDER BY city;`,'Apply the score predicate, then project city and deduplicate.','Projection in relational algebra removes duplicates; a plain SQL SELECT does not.','Use set difference to find all course IDs with no enrolment.',`SELECT id FROM course EXCEPT SELECT cid FROM enrol;`,q('R has 4 tuples and S has 3. How many tuples are in R × S?',['12','7','4','At most 3'],0,'Every tuple from R is paired with every tuple from S.'),'algebra');
dbLesson(dbm,'Joins, multiplicities and query equivalence',[
'A theta join selects pairs satisfying any stated predicate; an equijoin uses equality. A natural join equates all attributes having the same name and keeps one copy of each common attribute. Never assume a natural join uses only the key: an added same-named column can change its meaning.',
'An inner join drops unmatched rows. A left outer join retains every left row and fills missing right attributes with NULL; a full outer join also retains unmatched right rows. A semijoin keeps left tuples that have a match, without bringing right attributes or multiplying left tuples under set semantics. An antijoin keeps those without a match.',
'SQL bag joins multiply matching rows: if a key occurs a times on the left and b times on the right, it contributes a*b result rows. A foreign key to a unique parent gives at most one parent match per child. Joining two fact tables at different grains can silently double totals; inspect multiplicities before aggregating.',
'Selections on one input commute with an inner join when their attributes belong to that input. Outer joins need care: a right-side WHERE predicate can remove the NULL-extended rows and effectively make a left join behave like an inner join. Put restrictions defining acceptable right matches in ON when unmatched left rows must survive.'
],`SELECT s.name, e.cid FROM student s LEFT JOIN enrol e ON s.id=e.sid AND e.mark>=90 ORDER BY s.id,e.cid;`,'Every student appears. Only qualifying enrolments match; other right values become NULL.','ON and WHERE are not interchangeable for an outer join.','Count each student’s enrolments, including zero.',`SELECT s.name, COUNT(e.cid) AS n FROM student s LEFT JOIN enrol e ON s.id=e.sid GROUP BY s.id,s.name ORDER BY s.id;`,q('Two rows with key K join three rows with key K. Matching pairs?',['6','2','3','1'],0,'Each of the two left rows matches all three right rows.'),'algebra');
dbLesson(dbm,'Division and “for every” queries',[
'Division answers a universal question. Given R(A,B) and S(B), R ÷ S returns A values paired in R with every B in S. Other attributes or extra B values in R do not disqualify a candidate. The candidate domain must be specified, usually pi_A(R).',
'Derive division by finding failures: candidates C = pi_A(R); required pairs = C × S; missing = (C × S) − R; bad candidates = pi_A(missing); result = C − bad candidates. This derivation makes the “for every” logic concrete instead of treating division as a memorized symbol.',
'In SQL, “there is no required course that this student has not taken” becomes two nested NOT EXISTS predicates. This is robust to extra enrolments. A counting solution also works if it counts DISTINCT required course IDs and compares with the required-course count; counting all enrolments can produce wrong results.',
'Universal quantification over an empty required set is true for every candidate (vacuous truth). If candidates come from student, every student qualifies. If they come only from pi_sid(enrol), students with no enrolments are absent even before division. Always identify the candidate universe and distinguish set semantics from SQL duplicates and NULL.'
],`SELECT s.name FROM student s WHERE NOT EXISTS (SELECT 1 FROM course c WHERE c.id IN ('P','D') AND NOT EXISTS (SELECT 1 FROM enrol e WHERE e.sid=s.id AND e.cid=c.id)) ORDER BY s.id;`,'Asha and Bina have both required courses. Chen lacks D and Dev lacks both.','Counting two enrolments does not prove both required courses were taken unless duplicates and irrelevant courses are handled.','Find students enrolled in every course in the complete course table.',`SELECT s.name FROM student s WHERE NOT EXISTS (SELECT 1 FROM course c WHERE NOT EXISTS (SELECT 1 FROM enrol e WHERE e.sid=s.id AND e.cid=c.id));`,q('For a fixed candidate set, what happens when the required set in a universal query is empty?',['Every candidate qualifies','No candidate qualifies','Exactly one qualifies','It is undefined'],0,'No candidate has a missing required item, because no item is required.'));
dbm=dbmodule('calculus','Tuple relational calculus','Predicates, quantifiers, safety and translation into SQL');
dbLesson(dbm,'Read and write tuple predicates',[
'Tuple relational calculus (TRC) describes what should hold of the result, rather than an operator execution order. Write {t | P(t)} where t is an output tuple variable and P is a logical formula. R(t) says t belongs to relation R; t.A accesses attribute A. Comparisons and AND, OR, NOT combine predicates.',
'A free variable is not bound by a quantifier and contributes to the answer. An existentially bound variable exists only inside its scope. For students with a high mark, use {s | Student(s) AND EXISTS e (Enrol(e) AND e.sid=s.id AND e.mark>=90)}. The result is student tuples, not enrolment tuples.',
'For an output with selected fields, write the desired tuple of attributes explicitly, such as {<s.name> | Student(s) AND s.city="Delhi"}. Relational theory assumes set results and ordinary two-valued logic without SQL NULL. SQL implementations require explicit thought about duplicate elimination and missing values.',
'Translate a TRC formula by first listing free/output variables, then drawing quantifier scopes and finally enforcing membership in base relations. An existential relationship is naturally EXISTS in SQL. Returning columns from both variables may require a join instead of merely checking existence.'
],`SELECT s.name FROM student s WHERE EXISTS (SELECT 1 FROM enrol e WHERE e.sid=s.id AND e.mark>=90) ORDER BY s.id;`,'EXISTS tests whether at least one witness exists; extra witnesses do not duplicate the student.','A variable bound inside EXISTS is not freely available as an output variable outside its scope.','Return students with at least one enrolment below 70.',`SELECT s.name FROM student s WHERE EXISTS (SELECT 1 FROM enrol e WHERE e.sid=s.id AND e.mark<70);`,q('In {s | Student(s) AND EXISTS e P(s,e)}, which variable is free?',['s','e','Both','Neither'],0,'The existential quantifier binds e; s describes the output.'));
dbLesson(dbm,'Quantifier scope and universal conditions',[
'EXISTS x P(x) needs one witness; FOR ALL x P(x) requires every candidate to satisfy the predicate. Order matters: “every student has some course” allows different courses per student, while “some course is taken by every student” requires a shared course. Write the quantifiers before trying to simplify.',
'Use FOR ALL x P(x) equivalent to NOT EXISTS x NOT P(x). When restricting a universal domain, use implication: FOR ALL c (Required(c) implies Taken(s,c)). Replacing implication with AND incorrectly requires every possible tuple to belong to Required. Implication A implies B is equivalent to NOT A OR B.',
'For “has no failing enrolment”, use NOT EXISTS e (Enrol(e) AND e.sid=s.id AND e.mark<40). This includes a student with no enrolments. If the wording requires at least one enrolment, add a separate EXISTS condition. Negative phrasing often hides this distinction in exam questions.',
'Evaluate nested formulas from the inside out for a fixed outer candidate. List witnesses or counterexamples explicitly. SQL NOT EXISTS mirrors this logic, but comparisons involving NULL are UNKNOWN, not FALSE; a missing mark is not automatically a fail. Specify whether missing marks should count as failures.'
],`SELECT s.name FROM student s WHERE NOT EXISTS (SELECT 1 FROM enrol e WHERE e.sid=s.id AND e.mark<70) ORDER BY s.id;`,'Dev qualifies despite having no enrolments: there is no low-mark counterexample.','“All marks are high” does not imply “there is a mark”.','Require at least one enrolment as well as no mark below 70.',`SELECT s.name FROM student s WHERE EXISTS (SELECT 1 FROM enrol e WHERE e.sid=s.id) AND NOT EXISTS (SELECT 1 FROM enrol e WHERE e.sid=s.id AND e.mark<70) ORDER BY s.id;`,q('Which is equivalent to FOR ALL x P(x)?',['NOT EXISTS x NOT P(x)','EXISTS x NOT P(x)','NOT EXISTS x P(x)','EXISTS x P(x)'],0,'A universal statement fails precisely when a counterexample exists.'));
dbLesson(dbm,'Safe calculus and expressive equivalence',[
'A formula such as {t | NOT Student(t)} can range over infinitely many tuples outside the database. A practical query language must constrain answers to a finite domain determined by the database and constants in the query. Safe, range-restricted formulations bind candidates positively to relations before applying negation.',
'Domain independence means the result does not change merely because the ambient universe contains additional unused values. Safety is used to ensure finite, meaningful evaluation; syntactic restrictions are sufficient ways to enforce it. Do not classify every negation as unsafe: {s | Student(s) AND NOT EXISTS e (...)} is range-restricted.',
'Safe relational calculus and relational algebra have equivalent expressive power for the classical relational operations. Neither ordinary first-order calculus nor basic algebra provides arbitrary transitive closure without extension. SQL adds aggregation, bags, NULL and recursion in some dialects, so its full feature set goes beyond that equivalence.',
'To test a proposed answer, ask where every output value can come from, which variable is free, whether negation is guarded, and whether universal scope is correct. A translation should preserve the result relation, not just resemble the original words. Use small counterexamples including empty inputs to compare alternatives.'
],`SELECT s.name FROM student s WHERE NOT EXISTS (SELECT 1 FROM enrol e WHERE e.sid=s.id);`,'Student supplies the finite candidate domain; NOT EXISTS removes students having a witness.','Safe negation starts with a finite candidate relation. An unconstrained complement can describe infinitely many tuples.','Find courses not taken by student 3.',`SELECT c.title FROM course c WHERE NOT EXISTS (SELECT 1 FROM enrol e WHERE e.cid=c.id AND e.sid=3) ORDER BY c.id;`,q('Which query pattern is safely range-restricted?',['Student(s) AND NOT EXISTS e Enrolled(s,e)','NOT Student(s), with s unconstrained','All tuples outside every table','Every integer absent from a table'],0,'Positive membership in Student bounds the output candidates.'));
dbm=dbmodule('sql','SQL foundations','Filtering, NULL, grouping, joins and subqueries on real tables');
dbLesson(dbm,'SELECT and the logical query pipeline',[
'Read a query in logical order: FROM and joins construct rows; WHERE filters rows; GROUP BY forms groups; HAVING filters groups; SELECT constructs output; DISTINCT removes duplicate outputs; ORDER BY sorts; a row limit then restricts the display. The optimizer may execute a different physical plan while preserving this meaning.',
'Use aliases to name relations and expressions, qualify ambiguous columns, and put text literals in single quotes. BETWEEN includes both endpoints; LIKE uses % for any string and _ for one character. AND binds more tightly than OR, but parentheses make intent explicit. SQL has no guaranteed output order without ORDER BY.',
'ORDER BY can contain several expressions, each with its own ascending or descending direction. Ties remain unordered unless you add a tie-breaker. A top-k query needs a stable specification: “highest two scores” differs from “all students tied among the top two distinct scores”. LIMIT is SQLite syntax; other systems use FETCH FIRST or TOP.',
'SQL numeric types and conversion rules are dialect-sensitive. Use real-valued arithmetic deliberately when dividing, and use exact decimal types for financial data in systems supporting them. In this lab SQLite stores numbers dynamically; 5/2 with integer operands is 2, whereas 5.0/2 is 2.5. State assumptions in exam traces.'
],`SELECT name, score+5 AS adjusted FROM student WHERE score>=70 AND city='Pune' ORDER BY adjusted DESC, id;`,'Filter first, compute adjusted scores, then sort the selected rows.','A SELECT alias is not universally available in WHERE; use the underlying expression or an outer query.','Find the two highest nonmissing scores, breaking ties by student id.',`SELECT name,score FROM student WHERE score IS NOT NULL ORDER BY score DESC,id LIMIT 2;`,q('Which stage filters individual input rows before grouping?',['WHERE','HAVING','ORDER BY','DISTINCT'],0,'WHERE acts on rows; HAVING acts on groups.'));
dbLesson(dbm,'Aggregates, GROUP BY and HAVING',[
'COUNT(*) counts rows; COUNT(x) counts non-NULL x values. SUM, AVG, MIN and MAX ignore NULL inputs. On an empty input without GROUP BY, COUNT returns zero while SUM and AVG return NULL. A grouped query with no input rows has no groups and therefore normally returns no result rows.',
'A GROUP BY creates one result per distinct grouping combination. In portable SQL, each selected nonaggregate expression must be grouped or validly functionally dependent under the dialect’s rules. SQLite may accept an ungrouped bare column; that does not make its value a portable or generally deterministic answer.',
'HAVING evaluates group-level predicates such as COUNT(*)>=2. A row filter such as score>=80 belongs in WHERE if the intention is to discard those rows before computing a group average. Moving it to HAVING changes the question. DISTINCT inside COUNT counts distinct non-NULL values within each group.',
'An overall average cannot generally be obtained by averaging group averages. Preserve each group’s sum and count, then divide total sum by total count. Outer joins make COUNT especially important: COUNT(*) includes a NULL-extended row, whereas COUNT(nonnullable_child_key) correctly counts zero matching children.'
],`SELECT city,COUNT(*) AS students,COUNT(score) AS graded,AVG(score) AS mean FROM student GROUP BY city ORDER BY city;`,'Delhi has two students but one known score. Its average is 80, not 40.','NULL is ignored by AVG; it is not silently replaced with zero.','Find cities whose average known score is at least 80.',`SELECT city,AVG(score) FROM student GROUP BY city HAVING AVG(score)>=80 ORDER BY city;`,q('Values are 10, NULL, 20. COUNT(x) and AVG(x)?',['2 and 15','3 and 10','3 and 15','2 and 10'],0,'Both aggregate functions ignore the missing value.'));
dbLesson(dbm,'Subqueries, EXISTS and the NOT IN trap',[
'A scalar subquery is intended to return one value; an IN subquery supplies a membership set; EXISTS tests whether any row is produced. Standard SQL generally rejects a scalar subquery returning multiple rows, though SQLite takes a first row. Do not rely on that SQLite exception for GATE answers.',
'A correlated subquery refers to the current outer row. Understand it as a logical per-row test even when the optimizer decorrelates it. EXISTS does not care which columns are selected, so SELECT 1 expresses the intent. A semijoin implemented by EXISTS avoids multiplying an outer row when several inner matches exist.',
'NOT IN is dangerous when its list contains NULL. For an unmatched x, x NOT IN (1,NULL) is UNKNOWN, so WHERE rejects it. NOT EXISTS with an equality predicate often expresses the intended antijoin, provided the meaning of NULL outer keys is specified. For key columns declared NOT NULL, the comparison is simpler.',
'ANY and ALL compare a value with a subquery’s values: > ANY means greater than at least one; > ALL means greater than every one. Empty sets and NULL complicate shortcuts to MIN/MAX. SQLite does not implement quantified ANY/ALL comparisons; use EXISTS or NOT EXISTS with explicit conditions and study their logical definitions separately.'
],`SELECT s.name FROM student s WHERE s.id NOT IN (SELECT e.sid FROM enrol e) ORDER BY s.id;`,'The enrolment key sid is nonmissing in this fixture, so this antijoin finds Dev.','If a subquery can contain NULL, NOT IN can reject every unmatched outer value.','Express the same antijoin using NOT EXISTS.',`SELECT s.name FROM student s WHERE NOT EXISTS (SELECT 1 FROM enrol e WHERE e.sid=s.id);`,q('For x=5, what is 5 NOT IN (1,NULL) in SQL logic?',['UNKNOWN','TRUE','FALSE','A syntax error'],0,'5 differs from 1, but comparison with NULL is unknown, so the conjunction is unknown.'));
dbm=dbmodule('sqlplus','SQL in practice','Schema changes, transactions, views, CTEs and analytical queries');
dbLesson(dbm,'Define, change and query safely',[
'DDL defines schemas with CREATE, ALTER and DROP; DML changes rows with INSERT, UPDATE and DELETE. A missing WHERE on UPDATE or DELETE affects every row. A transaction lets several changes form one logical operation; COMMIT accepts the changes and ROLLBACK discards uncommitted changes.',
'ACID summarizes atomicity (all or nothing), consistency (preserved declared rules and application invariants), isolation (controlled interference) and durability (committed changes survive failures according to system guarantees). Transactions are supporting practical depth here; detailed schedules and recovery are not explicitly named in DA Section 5.',
'Bind user data as parameters instead of concatenating it into SQL text. Parameter binding distinguishes values from syntax and handles quoting. Placeholders cannot usually substitute SQL identifiers such as table names; choose identifiers from a trusted allowlist when necessary. Validation and database constraints serve different purposes.',
'Check affected rows and constraints. A foreign-key failure is evidence that a relationship would be broken; do not simply disable the constraint to make an update succeed. In Python sqlite3, commit explicitly when saving changes to a persistent database. These examples use an in-memory database that is fresh on every run.'
],`import sqlite3
db=sqlite3.connect(':memory:')
db.execute('CREATE TABLE account(id INTEGER PRIMARY KEY, balance INTEGER CHECK(balance>=0))')
db.executemany('INSERT INTO account VALUES(?,?)',[(1,100),(2,50)])
db.commit()
db.execute('UPDATE account SET balance=balance-? WHERE id=?',(30,1))
db.execute('UPDATE account SET balance=balance+? WHERE id=?',(30,2))
db.commit()
print(db.execute('SELECT * FROM account ORDER BY id').fetchall())`,'The two parameterized updates transfer 30; total balance remains 150.','A parameter is a data value, not a fragment of SQL syntax.','Create a table, insert a row, roll back the insert, and verify zero rows.',`import sqlite3
db=sqlite3.connect(':memory:')
db.execute('CREATE TABLE t(x INTEGER)')
db.execute('INSERT INTO t VALUES(?)',(7,))
db.rollback()
print(db.execute('SELECT COUNT(*) FROM t').fetchone()[0])`,q('Which method safely inserts an arbitrary name value?',['Bind the name to a placeholder','Concatenate the name inside quotes','Remove spaces from the name','Disable constraints first'],0,'Binding keeps user data separate from SQL syntax.'),'sql',true);
dbLesson(dbm,'Views, CTEs and reusable query structure',[
'A view names a stored query. Querying it presents a logical relation, usually evaluated from its base data. A materialized view stores a result and needs a refresh strategy. A view is not automatically an index or a cached copy. Updateability depends on the query and database rules.',
'A common table expression introduced with WITH names a query result for the duration of one statement. Use it to separate stages: aggregate at a clear grain, then filter or join. A CTE does not by itself promise materialization or better speed; the optimizer chooses a plan under the dialect’s rules.',
'Set operators combine compatible result schemas. UNION removes duplicates, UNION ALL retains them; EXCEPT is directional. Parenthesize or use CTEs to make intended grouping explicit rather than relying on dialect precedence. A final ORDER BY governs the combined result.',
'Recursive CTEs have an anchor query and a recursive step and can express hierarchy traversal. Termination and cycles require care; this is practical enrichment beyond basic relational algebra. For ordinary exam SQL, accurate duplicate handling, correlation and NULL rules are more important than elaborate syntax.'
],`WITH totals AS (SELECT sid,SUM(mark) AS total FROM enrol GROUP BY sid) SELECT s.name,t.total FROM totals t JOIN student s ON s.id=t.sid ORDER BY t.total DESC,s.id;`,'The CTE produces one row per sid before the join. That grain prevents duplicate sums.','A CTE is a query organization tool, not a guarantee of a temporary table.','Use a CTE to find students with at least two enrolments.',`WITH counts AS (SELECT sid,COUNT(*) AS n FROM enrol GROUP BY sid) SELECT s.name FROM student s JOIN counts c ON c.sid=s.id WHERE c.n>=2 ORDER BY s.id;`,q('A normal SQL view stores what conceptually?',['A query definition','A permanently copied result in all systems','Only an index','A required physical sort order'],0,'A materialized view, unlike an ordinary view, stores query results.'));
dbLesson(dbm,'Window functions and an analytical capstone',[
'A window function calculates across related rows while retaining the original row grain. GROUP BY collapses rows; SUM(revenue) OVER(PARTITION BY city) repeats the city total beside each sale. Window functions are practical enrichment useful for data work, not separately named in the DA syllabus.',
'ROW_NUMBER assigns a sequence, RANK leaves gaps after ties, and DENSE_RANK does not. Define an ORDER BY and decide whether ties should share rank. Adding a unique tie-breaker to RANK changes which rows tie, while adding it to ROW_NUMBER provides deterministic numbering.',
'For a running total, state the frame explicitly: ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW. A default RANGE frame may include peers sharing the ordering value. Aggregate first when a question asks for one record per city-month rather than one record per transaction.',
'Capstone method: write the output grain in words, join only compatible facts, handle NULL deliberately, aggregate, then apply the window calculation. Validate totals against an independent query and test a tie and an unmatched row. These habits transfer directly to analytics projects and to tracing SQL exam questions.'
],`SELECT name,score,DENSE_RANK() OVER(ORDER BY score DESC) AS place FROM student WHERE score IS NOT NULL ORDER BY score DESC,id;`,'Ranking retains three student rows and orders the known scores.','Window calculations do not automatically reduce the number of rows.','Show each sale with its city total and share of that total.',`SELECT city,month,product,revenue,SUM(revenue) OVER(PARTITION BY city) AS city_total,ROUND(1.0*revenue/SUM(revenue) OVER(PARTITION BY city),2) AS share FROM sales ORDER BY city,month,product;`,q('Which operation retains individual rows while adding a group total?',['SUM(x) OVER(PARTITION BY g)','GROUP BY g alone','SELECT DISTINCT g','COUNT(*) without GROUP BY'],0,'The window partitions the calculation without collapsing the input rows.'));
dbm=dbmodule('fds','Dependencies and keys','Attribute closure, candidate keys, covers and decomposition tests');
dbLesson(dbm,'Functional dependencies and attribute closure',[
'A functional dependency X -> Y says any two legal tuples agreeing on all attributes of X must agree on all attributes of Y. It is a semantic rule, not a causal statement. A trivial FD has Y contained in X. A finite sample can disprove an FD with a counterexample, but cannot establish that it holds for every legal instance.',
'Armstrong’s rules are reflexivity, augmentation and transitivity. From A->B and B->C infer A->C. Augmenting A->B by D gives AD->BD. Union, decomposition and pseudotransitivity are derived rules. The closure F+ is the set of all dependencies implied by F.',
'Attribute closure X+ is the set determined by X under F. Start with X; whenever an FD’s left side is contained in the current closure, add its right side; repeat until nothing changes. X is a superkey of R exactly when X+ contains every attribute of R.',
'For R(A,B,C,D), F={A->B,B->C,AC->D}, closure A begins {A}, adds B, then C, then D. A is a candidate key because it is a superkey and its only proper subset, the empty set, determines none of these attributes under F. Always continue to a fixed point: one pass in the given FD order may miss implications.'
],`fds=[(set('A'),set('B')),(set('B'),set('C')),(set('AC'),set('D'))]
closure=set('A')
while True:
    old=closure.copy()
    for left,right in fds:
        if left<=closure: closure |= right
    if closure==old: break
print(''.join(sorted(closure)))`,'Each round adds only logically determined attributes; the finite attribute set guarantees termination.','An FD can hold in a sample by coincidence. Keys are derived from the schema’s declared dependencies.','Compute B+ for the same dependencies.',`fds=[(set('A'),set('B')),(set('B'),set('C')),(set('AC'),set('D'))]
c=set('B')
while True:
    old=c.copy()
    for x,y in fds:
        if x<=c:c|=y
    if old==c:break
print(''.join(sorted(c)))`,q('Under A->B and B->C, A+ contains?',['ABC','AB only','A only','BC only'],0,'Start with A, then add B and C by transitivity.'),'closure',true);
dbLesson(dbm,'Find all candidate keys and a minimal cover',[
'A candidate key is an inclusion-minimal superkey, not necessarily the shortest key among all keys. One schema may have keys of different sizes. An attribute is prime if it belongs to at least one candidate key. Normal-form tests require all candidate keys, not only the chosen primary key.',
'To enumerate keys, attributes absent from every nontrivial FD right side must be in every key. Begin with those mandatory attributes, add combinations of the others, compute closure, and discard any superkey containing an already found key. This pruning is useful, though key enumeration can still be exponential.',
'A minimal cover is an equivalent FD set with singleton right sides, no extraneous left-side attributes and no redundant dependencies. Split X->YZ into X->Y and X->Z. To test a left attribute, compute the closure of the reduced left side under the appropriate current set. To test a redundant FD, remove it and check whether the remainder still implies it.',
'Minimal covers need not be unique. Equivalence means each set implies the other; matching the number of written FDs is not enough. For {A->BC,B->C,A->B,AB->C}, a cover is {A->B,B->C}: A->C follows transitively and AB->C adds nothing.'
],`from itertools import combinations
attrs=set('ABC'); fds=[(set('A'),set('B')),(set('B'),set('A'))]
def close(x):
    x=set(x)
    while True:
        old=x.copy()
        for a,b in fds:
            if a<=x:x|=b
        if old==x:return x
keys=[]
for n in range(4):
    for t in combinations(sorted(attrs),n):
        s=set(t)
        if not any(k<=s for k in keys) and close(s)==attrs:keys.append(s)
print([''.join(sorted(k)) for k in keys])`,'C never appears on a right side, so every key needs C. Either A or B supplies the other two attributes.','Prime means membership in any candidate key, not just in the primary key.','Find keys of ABC with only A->B.',`from itertools import combinations
keys=[]
for n in range(4):
    for t in combinations('ABC',n):
        s=set(t);c=s|({'B'} if 'A' in s else set())
        if c==set('ABC') and not any(k<=s for k in keys):keys.append(s)
print([''.join(sorted(k)) for k in keys])`,q('For ABC with A->B and B->A, candidate keys are?',['AC and BC','A and B','AB only','ABC only'],0,'C is mandatory; A or B determines both A and B.'),'closure',true);
dbLesson(dbm,'Lossless joins and dependency preservation',[
'Decomposition replaces R with smaller relation schemas whose union of attributes is R. It is lossless if projecting any legal R and naturally joining the projections recovers exactly R, without extra spurious tuples. It is lossy if the join can invent combinations that were absent.',
'For a binary decomposition R1,R2 under functional dependencies, the lossless criterion is that the common attributes determine all of R1 or all of R2 in F+. Equivalently, the intersection is a superkey of at least one component. A common attribute alone is insufficient.',
'Dependency preservation asks whether enforcing dependencies projected onto the individual components suffices to enforce all original FDs without joining. Compute the union of projected dependencies and test whether its closure implies the original FDs. Losslessness and dependency preservation are separate properties; neither label should be inferred from the other.',
'For decompositions into more than two relations, use a chase/tableau or a valid sequence of lossless binary steps. In an FD chase, initialize distinguished symbols for present attributes and fresh symbols elsewhere, then equate right-side symbols for rows agreeing on determinants; a row becoming all distinguished proves losslessness. Merely checking that every pair shares an attribute is invalid.'
],`r={('a','b1','c1'),('a','b2','c2')}
ab={(a,b) for a,b,c in r}; ac={(a,c) for a,b,c in r}
joined={(a,b,c) for a,b in ab for a2,c in ac if a==a2}
print('original',len(r),'rejoined',len(joined))
print('spurious',sorted(joined-r))`,'AB and AC share A, but A does not determine B or C here, so cross combinations appear.','A smaller schema is not automatically a correct decomposition. Check losslessness before celebrating reduced redundancy.','Show that AB and BC rejoin losslessly when B->C holds in {(a1,b,c),(a2,b,c)}.',`r={('a1','b','c'),('a2','b','c')}
ab={(a,b) for a,b,c in r};bc={(b,c) for a,b,c in r}
j={(a,b,c) for a,b in ab for b2,c in bc if b==b2}
print(j==r)`,q('A binary decomposition is lossless under FDs if its intersection determines?',['All attributes of at least one component','Only itself','Neither component','Exactly one attribute outside both'],0,'The shared attributes must be a superkey of a component.'),'decompose',true);
dbm=dbmodule('normal','Normal forms','Remove anomalies with 1NF, 2NF, 3NF, BCNF and higher-form context');
dbLesson(dbm,'Anomalies, 1NF and 2NF',[
'Redundancy creates update, insertion and deletion anomalies. In Enrol(sid,cid,student_name,course_title,mark), the same student name repeats for every course. Updating only one copy creates inconsistency; a student without enrolments may be impossible to insert; deleting a last enrolment may accidentally lose the student’s information.',
'First normal form requires atomic attribute values relative to the chosen model and no repeating groups. Atomic does not mean a string can never be decomposed; it means the value is treated as one domain value. A comma-separated collection of course IDs prevents independent keys and relationships and should become enrolment rows.',
'Second normal form requires 1NF and no nonprime attribute partially dependent on a proper subset of any candidate key. With key (sid,cid), sid->student_name and cid->course_title are partial dependencies. Separate Student, Course and Enrol, leaving mark dependent on the full pair.',
'A single-attribute candidate key has no nonempty proper subset, so partial dependencies of the usual kind do not arise through that key. But inspect every candidate key. 2NF does not remove transitive dependencies between nonkey attributes; a department name dependent on department ID may still repeat.'
],`SELECT e.sid,e.cid,s.name,c.title,e.mark FROM enrol e JOIN student s ON s.id=e.sid JOIN course c ON c.id=e.cid ORDER BY e.sid,e.cid;`,'The displayed wide relation is reconstructed from three normalized relations; the stored names do not repeat per enrolment.','Normalization concerns dependencies and legal instances, not the visual neatness of a current table.','Return course titles and counts, including courses with no students.',`SELECT c.title,COUNT(e.sid) FROM course c LEFT JOIN enrol e ON c.id=e.cid GROUP BY c.id,c.title ORDER BY c.id;`,q('Key AB, with A->C and C nonprime. Which form is violated?',['2NF','Only BCNF, not 2NF','1NF necessarily','None'],0,'C depends on a proper subset A of the candidate key AB.'),'decompose');
dbLesson(dbm,'3NF and BCNF: use the exact conditions',[
'A schema is in third normal form if for every nontrivial FD X->A in F+, either X is a superkey or A is prime. The prime-attribute exception matters: the informal phrase “no transitive dependencies” is only a shortcut in restricted examples and can misclassify a schema with overlapping keys.',
'Boyce–Codd normal form requires every nontrivial FD determinant to be a superkey. Thus BCNF implies 3NF, but 3NF can hold while BCNF fails. For R(A,B,C) with AB->C and C->B, candidate keys are AB and AC. C is not a superkey, but B is prime: C->B violates BCNF and is allowed by 3NF.',
'To decompose a BCNF violation X->Y, use R1=X union Y and R2=R−(Y−X). Their intersection X determines R1, so the split is lossless. Repeat on components with their projected dependencies. In the example, BC and AC are BCNF, but AB->C is not enforceable by checking those components separately.',
'3NF synthesis starts from a minimal cover, creates a relation for each determinant and its dependents, removes contained schemas, and adds a relation containing a candidate key if none already contains one. The standard synthesis provides dependency preservation and losslessness. BCNF decomposition guarantees losslessness but can sacrifice dependency preservation.'
],`from itertools import combinations
fds=[(set('AB'),set('C')),(set('C'),set('B'))]
def close(s):
    s=set(s)
    while True:
        old=s.copy()
        for x,y in fds:
            if x<=s:s|=y
        if old==s:return s
print('C closure:', ''.join(sorted(close('C'))))
print('AB closure:', ''.join(sorted(close('AB'))))
print('AC closure:', ''.join(sorted(close('AC'))))`,'All attributes are prime, but C does not determine A. This is the standard distinction between 3NF and BCNF.','A prime right-side attribute can save 3NF; it cannot save BCNF.','For A->B and B->C on ABC, test whether B is a superkey.',`s=set('B');fds=[(set('A'),set('B')),(set('B'),set('C'))]
while True:
    old=s.copy()
    for x,y in fds:
        if x<=s:s|=y
    if old==s:break
print(s==set('ABC'))`,q('Every BCNF decomposition obtained by the standard violating-FD split guarantees?',['Lossless join','Dependency preservation in all cases','Only two final relations','No need to project dependencies'],0,'Each binary split is lossless; preservation of every FD is not guaranteed.'),'closure',true);
dbLesson(dbm,'Multivalued dependencies and higher forms',[
'An MVD X ->> Y states that, for a fixed X, Y values vary independently of the remaining attributes Z. Student(sid,hobby,language) may need every hobby-language combination for a student when hobbies and languages are independent facts. This is stronger than merely observing several values.',
'An MVD is trivial when Y is contained in X or X union Y is the full schema. Fourth normal form requires the determinant of every nontrivial MVD to be a superkey. Every FD implies a corresponding MVD, so 4NF implies BCNF. Split independent hobby and language relations to avoid storing their cross product.',
'A join dependency says a relation equals the join of specified projections. Fifth normal form addresses nontrivial join dependencies not implied by candidate keys, sometimes involving three or more projections. Use a proven dependency before decomposing: arbitrary projections may create spurious tuples.',
'The official syllabus says “normal form” without listing levels. Master 1NF through BCNF and the lossless/preservation tests first; this lesson supplies higher-form conceptual coverage. Do not confuse relational normalization, which restructures schemas, with numeric normalization, which rescales data values for analysis.'
],`hobbies={'chess','music'};languages={'Hindi','English'}
wide={(h,l) for h in hobbies for l in languages}
print('wide facts',len(wide))
print('separate facts',len(hobbies)+len(languages))
print(sorted(wide))`,'Independence requires every pair. Larger independent sets make the redundancy more pronounced.','Two multivalued attributes are not automatically independent; the MVD must be part of the semantics.','Compare storage for 5 independent hobbies and 7 languages.',`print('cross product',5*7)
print('separate',5+7)`,q('Independent hobbies and languages per person suggest which decomposition?',['PersonHobby and PersonLanguage','One arbitrary hobby per person','Delete all repeated names','No decomposition can be lossless'],0,'The stated MVD permits a lossless split into the two independent facts.'),'decompose',true);
dbm=dbmodule('storage','Files and indexes','Pages, records, ordered files, hashing and B+ tree arithmetic');
dbLesson(dbm,'Page organization and I/O cost',[
'A database moves data between storage and memory in blocks or pages. For a simplified unspanned fixed-record file, blocking factor bfr=floor(B/R), where B is usable block size and R is record size. N records need ceil(N/bfr) blocks. Include headers or pointers if the question specifies them.',
'Unspanned records fit entirely within one block; spanned records may cross block boundaries and require continuation information. Variable-length records often use slotted pages: a directory points to records so records can move within a page without changing their logical slot identifiers. Distinguish record addresses from keys.',
'A heap file has no key order: insertion is convenient but an unindexed search may scan all b blocks. An ordered file supports binary search on blocks for an equality lookup on its ordering field, roughly ceil(log2 b) reads plus any needed data reads under the stated model. Insertion may require moving data or overflow areas.',
'For range queries, ordered/clustered storage can retrieve adjacent matching records with fewer page reads. Physical cost depends on caching, selectivity, layout and whether index pages are already in memory. GATE problems generally provide a simplified model; write down exactly what one I/O counts before calculating.'
],`from math import ceil
B,R,N=4096,100,1000
bfr=B//R
print('records/block',bfr)
print('blocks',ceil(N/bfr))
print('unused bytes/block',B-bfr*R)`,'Forty records fit per block, leaving 96 bytes under the no-header assumption.','Do not compute ceil(N*R/B) for unspanned fixed records; unused space in each block matters.','Recalculate for usable block size 1000, record size 300 and 10 records.',`from math import ceil
bfr=1000//300
print(bfr,ceil(10/bfr))`,q('Unspanned 300-byte records in a usable 1000-byte block: blocking factor?',['3','4','3.33','300'],0,'Only whole records count, so floor(1000/300)=3.'),'index',true);
dbLesson(dbm,'Dense, sparse and secondary indexes',[
'An index stores search-key values with pointers so the DBMS can locate records without scanning the whole file. A search key need not be unique and need not be the relation’s primary key. A dense index provides entries covering every search-key value or record according to its duplicate representation.',
'A sparse index stores entries for only some keys, commonly one per data block. Searching an ordered data file finds the last index key not exceeding the target, then searches the corresponding block or run. Sparse indexing relies on suitable underlying order; a sparse index on an unrelated unsorted field cannot identify all matching records this way.',
'Traditional primary indexes refer to an ordered unique key; clustering indexes refer to an ordering nonkey field; secondary indexes refer to a nonordering field. Textbooks and products use “clustered” differently, so follow the problem’s definition. A secondary index typically needs dense coverage and may use buckets for duplicate-key pointers.',
'A multilevel index recursively indexes the previous level until the top fits in one block. A covering index contains everything a query needs and may avoid a data-page lookup. A composite index on (A,B) supports the ordering by A then B; queries only on B do not generally gain the same search advantage as a leading-A lookup.'
],`from math import ceil
entries=10000; per_block=100;levels=[]
while True:
    blocks=ceil(entries/per_block);levels.append(blocks)
    if blocks==1:break
    entries=blocks
print('index blocks bottom to top',levels)
print('index levels',len(levels))`,'Ten thousand dense entries occupy 100 lower-level blocks and one top block. A data fetch is separate.','Index levels and total search I/Os differ if the root is cached or a data block must also be read.','Repeat with 1,000,000 entries and 100 entries per index block.',`from math import ceil
n=1000000;levels=[]
while True:
    n=ceil(n/100);levels.append(n)
    if n==1:break
print(levels)`,q('A sparse index with one entry per block is most directly suitable when?',['The data file is ordered on the indexed field','The data file is randomly ordered on that field','There are no data blocks','Every record is NULL'],0,'Ordering makes the omitted keys locatable in the indicated block range.'),'index',true);
dbLesson(dbm,'B+ trees, hashing and plan selection',[
'A B+ tree is a balanced multilevel search index. Internal nodes hold separators and child pointers; leaf entries point to records or hold data according to implementation. All leaves are at the same depth, and linked leaves support range scans. Search descends by separators, then scans relevant leaves.',
'If an internal page fits p pointers of size P and p−1 keys of size K, solve pP+(p−1)K<=B after subtracting any header. Leaf capacity has a different equation because entries contain key-record pointers plus a sibling pointer. “Order” may mean maximum children or something else; use the stated definition. Root minimum occupancy is exceptional.',
'Insertion may split a full leaf, copy a separator to the parent, and propagate internal splits. Deletion may redistribute or merge nodes and shrink the root. Exact occupancy and promotion conventions depend on the specification. Height is logarithmic in record count with large fanout; a root cached in memory saves a storage read.',
'Hash indexes direct equality searches to buckets and handle overflow or resize by a stated method. They do not naturally preserve order for ranges. B+ trees support equality and ranges. An index is not always faster than a scan: many scattered matching records can cause many random data reads, and every extra index adds update work.'
],`B,K,P=4096,16,8
p=(B+K)//(P+K)
print('max children',p)
print('bytes',p*P+(p-1)*K)
print('next would need',(p+1)*P+p*K)`,'The integer inequality gives the largest legal fanout, not a rounded real-valued estimate.','Do not reuse an internal-node fanout formula for leaf capacity.','Find the internal fanout for B=1000, K=10, P=6 with no header.',`print((1000+10)//(6+10))`,q('Which structure naturally supports ordered range scans?',['B+ tree with linked leaves','A plain hash index alone','An unordered heap without scanning','A stack'],0,'The search finds a starting leaf and follows leaf links in key order.'),'index',true);
dbm=dbmodule('types','Data types and cleaning','Measurement scales, missing values, encoding and leakage');
dbLesson(dbm,'Know what a value means',[
'Nominal values are categories without intrinsic order, such as city. Ordinal values have an order but unequal or unknown spacing, such as low/medium/high. Interval scales have meaningful differences but no absolute zero, such as Celsius temperature. Ratio scales add a meaningful zero, such as length; ratios are meaningful there.',
'Discrete variables take countable values, while continuous measurements are conceptually real-valued even if stored at finite precision. Binary attributes can be symmetric or asymmetric: in rare-event detection, shared absences may carry less information than shared presences. Choose summaries and distances that reflect the meaning, not just the storage type.',
'A database type is an implementation domain: INTEGER, DECIMAL, floating-point, text, date/time, Boolean and binary objects. Use decimal arithmetic for exact base-10 financial requirements, distinguish dates from formatted strings, and specify time zones. Nominal IDs that look numeric should not automatically be averaged or treated as distances.',
'Before transforming a column, record its units, valid range, missing-value representation and measurement scale. A city code 1/2/3 is not a quantity. Choosing a transform without that information can invent relationships and bias later analysis.'
],`values=['low','high','medium','low']
order={'low':0,'medium':1,'high':2}
print([order[x] for x in values])
print(sorted(set(values),key=order.get))`,'The mapping preserves a declared order but does not prove equal distances between adjacent categories.','Numeric storage does not imply a ratio-scale quantity.','One-hot encode Delhi and Pune for [Delhi,Pune,Delhi].',`cities=['Delhi','Pune','Delhi'];levels=['Delhi','Pune']
print([[int(c==level) for level in levels] for c in cities])`,q('Which scale permits meaningful ratios such as “twice as long”?',['Ratio','Nominal','Ordinal in general','Celsius interval scale'],0,'A meaningful absolute zero makes such ratios interpretable.'),'transform',true);
dbLesson(dbm,'Missing values, duplicates and outliers',[
'Profile data before repairing it: row counts, key uniqueness, missing fractions, category frequencies and numeric ranges. Distinguish a duplicated entity from repeated legitimate events. Removing all identical sales rows can erase real transactions if no transaction identifier was retained.',
'Missingness may be completely random, dependent on observed values, or dependent on missing values themselves. Those mechanisms affect bias; simply filling every blank with a mean is not universally correct. Options include leaving NULL, adding a missing indicator, dropping unsuitable records or imputing with a justified statistic.',
'Use a median for a robust central-value imputation when appropriate; use group-specific values only if the grouping is meaningful and sufficiently populated. Estimate transformations and imputation parameters on training data only, then apply the fixed parameters to validation/test data. Otherwise information leaks across the evaluation boundary.',
'An outlier may be an error or a real extreme event. Check units and provenance before removing it. Z-scores and IQR fences are screening rules, not proof of corruption. For IQR, the common fences are Q1−1.5*IQR and Q3+1.5*IQR; quartile conventions can differ, so exam calculations should follow the specified convention.'
],`from statistics import median
train=[10,None,12,100,11]
fill=median(x for x in train if x is not None)
print('training median',fill)
print([fill if x is None else x for x in train])`,'The statistic ignores missing entries and is fit using this training sample only.','Do not fit an imputer on the test set or silently treat every extreme value as an error.','Apply the same fitted median 11.5 to a separate test list [None,20].',`fill=11.5
print([fill if x is None else x for x in [None,20]])`,q('When should a training imputation statistic be fitted?',['On the training portion only','On the entire dataset before splitting','On the test portion only','Separately on every prediction row'],0,'A fixed training-fitted transformation avoids using held-out information.'),'transform',true);
dbLesson(dbm,'Encoding, integration and reproducible pipelines',[
'One-hot encoding creates one indicator per category. An ordinal encoding is appropriate only when an order is meaningful. Integer codes for nominal values can introduce a false ordering for algorithms that interpret numeric distances. Handle unseen categories explicitly instead of silently reassigning old codes.',
'Data integration aligns schemas, units, keys and meanings across sources. Resolve entity identity carefully: names alone may collide. Maintain a data dictionary and record whether a timestamp refers to event time or ingestion time. A join that unexpectedly multiplies rows is a data-quality signal, often caused by a nonunique join key.',
'A reproducible pipeline separates fit from transform, versions its schema and parameters, and checks output invariants. Keep original raw data and transformation provenance so an incorrect unit conversion or category mapping can be reversed. Validation should check ranges, key uniqueness, row counts and missingness after each major stage.',
'Practical mini-project: integrate students and enrolments, report unmatched foreign keys, derive course completion counts, encode cities and save the mapping. First define the intended row grain. Keep exam focus on named data types and transformations; operational pipeline details here make those concepts usable beyond the exam.'
],`levels=['Delhi','Pune']; rows=['Delhi','Pune','Jaipur']
encoded=[[int(x==c) for c in levels]+[int(x not in levels)] for x in rows]
print('columns',levels+['unknown'])
print(encoded)`,'The unknown indicator preserves the distinction between an unseen category and a known category.','Never refit category-code assignments independently on training and test data.','Convert [100,250,0] centimetres to metres and assert all values are nonnegative.',`values=[100,250,0]
assert all(x>=0 for x in values)
print([x/100 for x in values])`,q('Joining on a nonunique key on both sides may cause?',['Row multiplication','Automatic duplicate removal','Always exactly one result row','A guaranteed syntax error'],0,'Each matching left row pairs with every matching right row.'),'transform',true);
dbm=dbmodule('transform','Normalize and discretize','Scaling formulas, bin boundaries and the meaning of transformed data');
dbLesson(dbm,'Min–max, z-score and decimal scaling',[
'Numeric normalization rescales values; it does not normalize a relational schema. Min–max scaling from [min,max] to [a,b] is a+(x−min)*(b−a)/(max−min). For [10,20,30] mapped to [0,1], the results are 0,0.5,1. A constant feature needs an explicit convention because the denominator is zero.',
'Z-score standardization is z=(x−mean)/standard_deviation. State whether the standard deviation is population or sample: divide squared deviations by n or n−1 respectively. Standardized data have zero mean and unit variance under the chosen convention, but need not be normally distributed. Outliers still influence the mean and deviation.',
'Decimal scaling divides by 10^j, where j is the smallest integer making the maximum absolute transformed value less than 1 under the strict convention. For a maximum magnitude of 100, j=3; j=2 leaves magnitude 1. Robust scaling instead uses a median and a dispersion measure such as IQR; that is useful supporting depth.',
'Fit parameters on training data and reuse them. A future value outside the fitted min–max interval can map below 0 or above 1; clipping is a separate policy that loses information. Preserve units and fitted parameters so you can interpret or invert a transform. Never recompute test-set bounds merely to force all outputs into [0,1].'
],`from statistics import mean,pstdev
x=[10,20,30]
print('minmax',[(v-min(x))/(max(x)-min(x)) for v in x])
print('z',[round((v-mean(x))/pstdev(x),3) for v in x])`,'The same relative spacing is retained by an affine transform, but the units change.','Standardization does not make an arbitrary distribution Gaussian.','Scale 40 using fitted training min=10 and max=30.',`print((40-10)/(30-10))`,q('Fitted min=10,max=30. Min–max transform of a new value 40?',['1.5','1 automatically','0.5','Undefined in every implementation'],0,'The unchanged training formula produces 30/20=1.5; clipping would be an extra decision.'),'transform',true);
dbLesson(dbm,'Equal-width and equal-frequency bins',[
'Discretization replaces a continuous value with a category or interval. Equal-width bins split the range into k intervals of width (max−min)/k. State whether boundaries belong to the lower or upper bin, and make the final endpoint inclusive. With edges 0,10,20,30 and left-closed intervals, 10 belongs to the second bin.',
'Equal-frequency (quantile) bins aim for similar numbers of observations, not equal numeric widths. Sort the data and place cut points by rank. Repeated values can prevent both equal counts and a rule that maps equal values to the same bin. Specify tie handling rather than pretending a unique answer exists.',
'Binning can reduce sensitivity to noise and improve interpretability but loses within-bin information. It may introduce sharp discontinuities around a cut point. Supervised discretization uses a target to choose boundaries; fitting those boundaries on held-out target labels leaks information.',
'For exam problems, first sort if needed, compute boundaries or bucket sizes, then apply the declared endpoint rule to every value. Test the minimum, maximum, an exact cut point and an out-of-range future value. Store edges learned from training data so future records use the same categories.'
],`from bisect import bisect_right
edges=[0,10,20,30]
def bin_id(x):
    if x<edges[0] or x>edges[-1]:return 'outside'
    return min(bisect_right(edges,x)-1,len(edges)-2)
print([(x,bin_id(x)) for x in [0,9,10,20,30]])`,'bisect_right puts a cut-point value into the bin starting there; the maximum is clamped to the last bin.','Equal-frequency does not mean equal-width, and ties make quantile bins ambiguous.','Use two equal-width bins on [0,100] for 0,49,50,100.',`def bucket(x):return min(int(x//50),1)
print([bucket(x) for x in [0,49,50,100]])`,q('Which binning method targets similar counts per bin?',['Equal-frequency','Equal-width','Decimal scaling','Z-score'],0,'Quantile/equal-frequency bins are chosen by ranks rather than equal interval widths.'),'transform',true);
dbLesson(dbm,'Smoothing, transformations and information loss',[
'Binning by means replaces every value in a bin by its bin mean; bin medians use the median; bin boundaries use the nearest boundary with a stated tie rule. These are smoothing methods. They discard individual variation, so the transformed dataset cannot generally reconstruct the original.',
'Log transforms compress large positive magnitudes. log(0) is undefined; log1p(x)=log(1+x) permits zero for x>=0 but changes the interpretation. Power transforms and clipping are other choices, each requiring a reason. A monotone transform preserves order but may change distances, means and linear relationships.',
'Aggregation reduces granularity: transactions become daily totals, and individual variation within a day disappears. Feature construction combines variables using a meaningful definition, such as revenue per unit. Guard zero denominators and avoid treating ratios as additive quantities.',
'Choose transformations by purpose and verify properties. If a scaling is invertible, test the inverse; if a smoothing is lossy, measure the change. Record which statistics were fit on training data. A transformation is not automatically beneficial merely because the resulting numbers look more regular.'
],`from statistics import mean,median
bins=[[2,4,9],[12,13,20]]
print('mean smoothing',[[mean(b)]*len(b) for b in bins])
print('median smoothing',[[median(b)]*len(b) for b in bins])`,'Every bin contributes a repeated representative. Median and mean differ in the presence of uneven values.','Smoothing loses information; it is not an invertible rescaling.','Apply log1p to 0,9,99 and round to three decimals.',`from math import log1p
print([round(log1p(x),3) for x in [0,9,99]])`,q('Which transformation generally loses individual within-bin variation?',['Bin-mean smoothing','Invertible nonzero affine scaling','Unit conversion from metres to centimetres','Adding a known constant'],0,'Many distinct original bins can share the same mean.'),'transform',true);
dbm=dbmodule('sample','Sampling and compression','Representative samples, streaming selection and compact representations');
dbLesson(dbm,'Random, stratified, cluster and systematic samples',[
'Simple random sampling without replacement gives every fixed-size subset the same probability; with replacement, the same unit may appear more than once. A random seed makes a particular computation reproducible, not representative by itself. A convenience sample of accessible records may be biased even if it is large.',
'Stratified sampling divides the population into meaningful groups and samples within every group. Proportional allocation uses n_h=n*N_h/N, with a rounding plan. Disproportionate allocation can ensure rare groups are represented, but estimating population quantities then requires appropriate weights.',
'Cluster sampling selects groups and then all or some units within selected groups. Clusters often have internally similar units, which affects uncertainty. Systematic sampling chooses a random start and every kth item; periodic ordering can align with the sampling interval and bias the result.',
'Sampling reduces computation but introduces sampling error and can miss rare patterns. Define the population, unit, frame, replacement policy and desired estimator first. Keep train/test splitting distinct from representative sampling; temporal data often require a chronological holdout to avoid future information influencing past predictions.'
],`import random
rng=random.Random(7)
population=list(range(10))
sample=rng.sample(population,4)
print(sample)
print('unique',len(set(sample))==4)`,'sample selects without replacement; the fixed seed reproduces this demonstration.','A fixed seed provides reproducibility, not freedom from bias.','Select two units from each of two strata using a seeded generator.',`import random
r=random.Random(7)
groups={'A':[1,2,3,4],'B':[5,6,7,8]}
print({k:r.sample(v,2) for k,v in groups.items()})`,q('Which design samples within every predefined subgroup?',['Stratified','One-stage cluster','Convenience','Only systematic'],0,'Strata are all represented; cluster sampling selects a subset of groups.'),'sampling',true);
dbLesson(dbm,'Reservoir sampling and estimator checks',[
'Reservoir sampling maintains a uniform size-k sample from a stream of unknown final length using O(k) storage. Keep the first k items. For the ith item, with i counted from 1, choose a random integer j uniformly from 1..i; if j<=k, replace reservoir slot j.',
'The incoming ith item is selected with probability k/i. An older retained item survives this step with probability 1−1/i, so its previous probability k/(i−1) becomes k/i. This inductive argument proves equal marginal inclusion probabilities; the standard algorithm also yields a uniform sample over k-subsets.',
'When estimating a mean from a simple random sample, the sample mean is unbiased under the sampling design. Variance and finite-population corrections depend on replacement and population size. Unequal-probability designs require weighting; an unweighted average of oversampled strata can distort a population estimate.',
'Use simulation to check an implementation over many runs, but distinguish evidence from proof. A histogram of inclusion counts should be roughly flat, not exactly equal. Test streams shorter than k, k=0 and invalid negative k. This algorithmic connection builds on the DSA randomization and invariant mindset.'
],`import random
def reservoir(stream,k,seed=7):
    if k<0:raise ValueError('k must be nonnegative')
    r=random.Random(seed);out=[]
    for i,x in enumerate(stream,1):
        if i<=k:out.append(x)
        else:
            j=r.randrange(i)
            if j<k:out[j]=x
    return out
print(reservoir(range(100),5))
print(reservoir(range(3),5))`,'At zero-based slot j, replacement occurs only if j is in 0..k−1.','Always selecting a replacement slot among k would force every new item into the sample and bias it.','Compute the marginal inclusion probability for k=5 from a stream of 100 items.',`print(5/100)`,q('For a uniform size-k reservoir after n>=k items, inclusion probability is?',['k/n','1/k','n/k','1 for recent items'],0,'The reservoir algorithm maintains equal marginal inclusion probability k/n.'),'sampling',true);
dbLesson(dbm,'Lossless and lossy compression',[
'Lossless compression allows exact reconstruction; lossy compression discards some information to reduce size. Compression ratio must state its convention: original/compressed is a size-reduction factor, while compressed/original is a retained fraction. Include metadata such as dictionaries or codebooks when comparing actual storage.',
'Run-length encoding stores repeated consecutive symbols as (symbol,count), so it benefits long runs but can expand alternating data. Dictionary encoding stores repeated values once and replaces them with short codes. Delta encoding stores differences between nearby values; it is useful for ordered timestamps or increasing identifiers before further encoding.',
'Huffman coding builds a prefix-free variable-length code by repeatedly merging the two least frequent symbols. Frequent symbols receive shorter codewords; ties can produce different valid code trees. Prefix-free means no codeword is a prefix of another, enabling unambiguous decoding. Entropy supplies a lower bound on average bits per symbol under the relevant idealized source model.',
'Quantization is lossy: nearby values are mapped to one representative. Dimensionality reduction can also be lossy unless all information is retained. Evaluate reconstruction error and downstream utility, not just compressed byte count. Compression and sampling both reduce data volume, but sampling removes observations whereas encoding may preserve every observation exactly.'
],`from itertools import groupby
x='AAAABBBCCAAAA'
encoded=[(symbol,len(list(run))) for symbol,run in groupby(x)]
decoded=''.join(symbol*n for symbol,n in encoded)
print(encoded)
print(decoded==x)`,'Decoding reproduces the exact sequence, including run order.','RLE size depends on runs, not merely the total number of repeated symbols.','Delta-encode [100,103,109,110], keeping the first value.',`x=[100,103,109,110]
d=[x[0]]+[b-a for a,b in zip(x,x[1:])]
print(d)
from itertools import accumulate
print(list(accumulate(d)))`,q('Which is lossless when its metadata is retained?',['Dictionary encoding','Rounding all values to integers','Dropping half the rows','Replacing each bin by its mean'],0,'Codes plus their dictionary recover the original values exactly.'),'compression',true);
dbm=dbmodule('warehouse','Warehousing and OLAP','Grain, star schemas, hierarchies, cubes and correct measure roll-ups');
dbLesson(dbm,'Choose the fact grain and warehouse schema',[
'A warehouse integrates historical data for analysis. OLTP systems emphasize current transactions and controlled updates; OLAP workloads emphasize scans, aggregation and comparison across dimensions. ETL extracts, transforms and loads data; ELT loads before transformations. A warehouse’s analytical model need not match the operational normalized schema.',
'Declare the fact grain before selecting measures: one row per sale line, per store-product-day snapshot, or per completed process. Mixing grains causes double counting. Fact tables contain dimension references and measures; dimension tables hold descriptive attributes such as product category, city and calendar month. A factless fact table records an event or relationship without numeric measures.',
'A star schema has a central fact table and comparatively denormalized dimensions. A snowflake normalizes dimension hierarchies into related tables. A fact constellation shares conformed dimensions across several fact tables. Star versus snowflake is a modeling tradeoff; neither implies that every measure can be safely summed.',
'Use surrogate dimension keys when integrating source identities or tracking history. Slowly changing dimension Type 1 overwrites an attribute; Type 2 adds a new version with validity dates and a new surrogate key. Join a fact to the version valid at the event time. This is practical depth supporting the named multidimensional-schema topic.'
],`SELECT city,product,SUM(revenue) AS revenue,SUM(units) AS units FROM sales GROUP BY city,product ORDER BY city,product;`,'The source fact grain is one fixture sales record. Aggregating changes it to city-product.','Joining fact tables directly can multiply facts. Aggregate to a compatible grain or use a carefully designed model.','Roll the same facts up to product totals.',`SELECT product,SUM(revenue),SUM(units) FROM sales GROUP BY product ORDER BY product;`,q('What should be declared first when designing a fact table?',['The grain of one fact row','The dashboard color','The largest possible sum','The physical row order'],0,'Grain determines what each measure and dimensional key combination means.'),'warehouse');
dbLesson(dbm,'Concept hierarchies, cubes and OLAP operations',[
'A concept hierarchy links detail to broader categories: city -> state -> country -> ALL, or day -> month -> quarter -> year -> ALL. A strict hierarchy gives each child one parent at a level; nonstrict membership needs allocation or distinct-count rules to avoid double counting. Ragged hierarchies can skip levels.',
'Roll-up aggregates to a coarser level; drill-down moves to finer detail if that detail is available. Slice fixes one dimension value; dice selects a subcube with multiple ranges or sets; pivot rotates the presentation axes. Drill-through retrieves underlying records and differs from merely navigating aggregate levels.',
'A cuboid is an aggregation at a chosen combination of dimension levels. With d dimensions and only base or ALL for each, there are 2^d possible cuboids, including base and apex. If dimension i has L_i allowed levels including ALL, the product of L_i counts combinations under independent hierarchy choices. Read whether ALL is already included.',
'A full cube may be expensive: the number of possible cells is a product of dimension cardinalities, and many cells are empty. Materialize useful aggregate cuboids, retain sufficient statistics for roll-up, and compute others on demand. SQL GROUP BY implements one cuboid; UNION ALL of grouped queries can illustrate a roll-up in SQLite, which lacks native CUBE/ROLLUP syntax.'
],`SELECT city,SUM(revenue) AS revenue FROM sales GROUP BY city UNION ALL SELECT 'ALL',SUM(revenue) FROM sales;`,'The query returns a city-level cuboid and the overall apex total.','Do not multiply cardinalities of cities or products when the question asks for the number of hierarchy-level cuboids.','Count cuboids for dimensions with 4,3,2 levels including ALL.',`SELECT 4*3*2 AS cuboids;`,q('Moving from country totals to state totals is?',['Drill-down','Roll-up','Compression','A primary-key lookup by definition'],0,'The analysis descends to a finer level in the geographic hierarchy.'),'warehouse');
dbLesson(dbm,'Measures: additive, algebraic and holistic',[
'Additive measures can be summed across all relevant dimensions, such as transaction revenue. Semi-additive measures can be summed across some dimensions but not others: account balance at a time can be summed across accounts, but summing daily balances usually has no desired meaning. Nonadditive measures such as ratios are not directly summable.',
'A separate classification concerns how aggregates can be combined. Distributive aggregates can combine partial results with the same kind of operator: SUM, COUNT, MIN, MAX. Algebraic aggregates need a fixed-size collection of distributive statistics: AVG uses SUM and COUNT; variance can use count, sum and sum of squares, with numerical-stability care.',
'Holistic aggregates such as an exact median generally need an amount of state that grows with the data; medians of groups are insufficient. Exact distinct count is also generally holistic under this bounded-summary definition, although approximate sketches exist. Do not confuse these categories with additive/semi-additive/nonadditive behavior.',
'For a weighted average selling price, sum revenue and units separately, then divide. For group means 10 over 2 items and 30 over 8 items, the overall mean is (20+240)/10=26, not 20. Before rolling up, verify compatible grain, disjoint groups, hierarchy membership and the sufficient statistics retained.'
],`SELECT SUM(revenue) AS revenue,SUM(units) AS units,ROUND(1.0*SUM(revenue)/SUM(units),2) AS price_per_unit FROM sales;`,'Revenue totals 360 and units total 13. The ratio of totals is the weighted price per unit.','An average of averages is valid only with appropriate equal weights or explicit count weighting.','Compute the overall mean of groups (mean=10,count=2) and (mean=30,count=8).',`SELECT 1.0*(10*2+30*8)/(2+8) AS weighted_mean;`,q('Which fixed-size summary is sufficient to combine group averages correctly?',['Sum and count','Average alone','Median alone','Maximum alone'],0,'Summed group sums divided by summed group counts gives the overall mean.'),'warehouse');
