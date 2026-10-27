/* Original practice. Correct options are rotated deterministically; no random scoring. */
const MATH_BANK={
'la-vectors':[
['2(1,−1)+3(0,2) equals…','(2,4)','(2,1)','(3,4)','(5,1)','Scale each vector, then add corresponding components.'],
['The dot product of (2,−1) and (1,2) is…','0','4','−4','2','2×1+(−1)×2=0.'],
['The Euclidean norm of (1,2,2) is…','3','5','9','√5','Square, sum and take a square root: √9=3.'],
['The angle of the zero vector with a nonzero vector is…','Undefined','Always 90°','Always 0°','Always 180°','The angle formula divides by both norms.'],
['A 4×3 matrix maps…','R³ to R⁴','R⁴ to R³','R⁴ to R⁴ only','R³ to R³ only','Columns count input coordinates; rows count output coordinates.'],
['In ABx, which map acts first?','B','A','Both simultaneously','Neither','The rightmost matrix acts on x first.'],
['Which condition is necessary but not sufficient for linearity?','T(0)=0','Additivity and homogeneity together','A matrix representation on finite-dimensional spaces','Preserving every linear combination','For example x↦x² preserves zero but is not linear.'],
['Normalizing two nonorthogonal vectors…','Does not generally make them orthogonal','Always makes them orthogonal','Makes their dot product zero','Makes them dependent','Scaling nonzero vectors does not change their angle.'],
['The 1-norm of (−2,3) is…','5','1','√13','13','Add absolute component values.'],
['For nonzero u,v, |uᵀv|=||u||||v|| implies…','Linear dependence','Orthogonality','Both are unit vectors','u=v necessarily','This is the equality case of Cauchy–Schwarz.']
],
'la-spaces':[
['Which subset of R² is a subspace?','x+y=0','x+y=1','x≥0','xy=0','The homogeneous linear constraint is closed under addition and scaling.'],
['A subspace must contain…','The zero vector','Every vector in the ambient space','Only nonzero vectors','A vector of every norm and direction','Scale any member by zero.'],
['Three vectors in R² are always…','Linearly dependent','Independent','A basis','Pairwise parallel','There are more vectors than the ambient dimension.'],
['A set containing the zero vector is…','Dependent','Independent if other vectors differ','Always a basis','Not a set of vectors','Give the zero vector a nonzero coefficient and every other vector coefficient zero.'],
['The dimension of polynomials of degree at most 3 is…','4','3','2','Infinite','A basis is 1,x,x²,x³.'],
['The union of two subspaces…','Need not be a subspace','Is always a subspace','Never contains zero','Equals their intersection','The union of two distinct lines fails closure under addition.'],
['The intersection of two subspaces is…','Always a subspace','Never a subspace','Their union','Always zero-dimensional','Both closure properties survive intersection.'],
['For basis (1,1),(1,−1), coordinates of (4,2) are…','(3,1)','(4,2)','(1,3)','(2,4)','Solve a+b=4 and a−b=2.'],
['If dim U=3, dim W=2, dim(U∩W)=1, then dim(U+W)=…','4','5','6','2','Use 3+2−1.'],
['Two independent vectors in R³ form…','A basis for their two-dimensional span','A basis of R³','A dependent pair','A one-dimensional span','They span a plane through zero, not all of R³.']
],
'la-matrices':[
['A is 2×3 and B is 3×4. AB is…','2×4','3×3','4×2','Undefined','The inner dimensions match and the outer dimensions remain.'],
['(AB)ᵀ equals…','BᵀAᵀ','AᵀBᵀ','ABᵀ','AᵀB','Transpose reverses multiplication order.'],
['For invertible A,B, (AB)⁻¹ equals…','B⁻¹A⁻¹','A⁻¹B⁻¹','AB','A⁻¹+B⁻¹','Multiply to check cancellation in the correct order.'],
['An n×n matrix has an inverse exactly when its rank is…','n','n−1','0','At least 1','Full rank means no nonzero null vector and a unique solution for every right-hand side.'],
['The inverse of diag(2,5) is…','diag(1/2,1/5)','diag(−2,−5)','diag(5,2)','diag(4,25)','Invert each nonzero diagonal entry.'],
['For general matrices, AB=0 implies…','Neither A=0 nor B=0 necessarily','A=0 necessarily','B=0 necessarily','Both are zero','Nonzero matrices can map into each other’s null spaces.'],
['A block product is valid when…','Block dimensions conform','Every block is square','Every block is invertible','Blocks commute','Ordinary row-by-column rules still apply with compatible sizes.'],
['The Schur complement of invertible A in [[A,B],[C,D]] is…','D−CA⁻¹B','A−BD⁻¹C always','D−BA⁻¹C','A+B+C+D','Eliminate the lower-left block using A.'],
['The determinant of [[A,B],[0,D]] with square diagonal blocks is…','det(A)det(D)','det(A)+det(D)','det(B)','Always zero','Block triangular determinants multiply, regardless of B.'],
['For A=[[1,2],[0,1]], A² is…','[[1,4],[0,1]]','[[1,4],[0,2]]','[[1,2],[0,1]]','[[2,4],[0,2]]','Use matrix multiplication; it is not entrywise squaring.']
],
'la-special':[
['A real symmetric matrix satisfies…','Aᵀ=A','Aᵀ=−A','A²=I','A²=A','Symmetry mirrors entries across the diagonal.'],
['Every diagonal entry of a real skew-symmetric matrix is…','0','1','−1','Positive','aᵢᵢ=−aᵢᵢ forces zero.'],
['An orthogonal square matrix Q has inverse…','Qᵀ','−Q','Q²','Q+I','QᵀQ=I.'],
['The determinant of a real orthogonal matrix is…','+1 or −1','Always +1','0','Any nonzero real number','Take determinants in QᵀQ=I to get det(Q)²=1.'],
['If P²=P, possible eigenvalues are…','0 and 1','−1 and 1','Any positive number','Only 0','Apply P² to an eigenvector: λ²=λ.'],
['An orthogonal projection matrix must be…','Symmetric and idempotent','Only idempotent','Only orthogonal','Only invertible','Symmetry ensures the projection direction is perpendicular to the target subspace.'],
['An invertible idempotent matrix is…','I','−I','0','Any orthogonal matrix','Multiply P²=P by P⁻¹.'],
['For idempotent P, rank(P) equals…','trace(P)','det(P) always','Number of rows always','0 always','Its eigenvalues are 0 and 1 and it is diagonalizable.'],
['A rectangular Q with orthonormal columns satisfies…','QᵀQ=I','QQᵀ=I in every shape','Q⁻¹=Q','Q²=Q','QQᵀ is a projection and is identity only when the columns span the full output space.'],
['For real skew-symmetric K, xᵀKx is…','0','Positive for all x','Negative for all x','||x||²','The scalar equals its transpose, which is its negative.']
],
'la-systems':[
['A homogeneous linear system always has…','At least the zero solution','No solution','Exactly one solution','Only nonzero solutions','A0=0 for every matrix.'],
['Ax=b is consistent exactly when…','rank(A)=rank([A|b])','rank(A)=0','b=0 only','A is square','The added column must lie in col(A).'],
['A consistent system with n variables and rank r has…','n−r free variables','r free variables','n+r free variables','No free variables always','Each pivot fixes one variable in terms of the free variables.'],
['The row [0,0,0|1] means…','Inconsistency','One free variable','Unique solution','A redundant equation','It asserts 0=1.'],
['For x+y=3 and x−y=1, x is…','2','1','3','0','Adding equations gives 2x=4.'],
['Swapping two rows of an augmented system…','Preserves its solution set','Changes the right-hand side only','Always changes rank','Makes it inconsistent','It reorders equations without changing their meaning.'],
['Over R, a linear system can have…','Zero, one or infinitely many solutions','Exactly two distinct solutions','Exactly three distinct solutions','Only one solution','Two distinct solutions generate an affine line of solutions.'],
['A zero first pivot in a nonsingular matrix calls for…','A suitable row swap','Immediate declaration of singularity','Division by zero','Discarding the first equation','A nonzero entry lower in the column can serve as pivot.'],
['Dense Gaussian elimination is ordinarily…','O(n³)','O(n)','O(log n)','O(1)','Updates occur over a shrinking two-dimensional trailing matrix across n pivots.'],
['If xₚ solves Ax=b, every solution is…','xₚ+z with Az=0','Any multiple of xₚ','Only xₚ','xₚ+b','Subtract two solutions to obtain a null vector.']
],
'la-rank':[
['A 3×5 matrix of rank 2 has nullity…','3','1','2','5','Rank plus nullity equals the number of columns.'],
['For that 3×5 rank-2 matrix, left nullity is…','1','3','2','5','Left nullity is rows minus rank.'],
['Row rank and column rank are…','Always equal','Equal only for square matrices','Always different','Unrelated','Both equal the number of pivots.'],
['rank(AᵀA) equals…','rank(A)','2 rank(A)','Number of rows of A always','0','Their null spaces agree because xᵀAᵀAx=||Ax||².'],
['For A:m×n and B:n×p, rank(AB) is at most…','min(rank A,rank B)','rank A+rank B','n+p','max(m,p)','The product cannot create directions unavailable in either factor.'],
['A:4×5 has rank 4 and B:5×3 rank 3. rank(AB) is at least…','2','0 only','3 necessarily','4','Sylvester gives 4+3−5=2.'],
['Pivot columns for a basis of col(A) should be taken from…','The original A','Only the RREF regardless of A','Aᵀ always','The augmented right-hand side','Row reduction identifies column indices but generally changes the column space.'],
['null(A) is orthogonal to…','row(A)','col(A) in every shape','null(Aᵀ) always','Every vector in Rⁿ','Ax=0 says x is orthogonal to each row.'],
['If yᵀA=0 but yᵀb≠0, then Ax=b is…','Inconsistent','Uniquely solvable','Homogeneous','Always rank zero','Multiplying Ax=b by yᵀ would give 0=yᵀb.'],
['Full column rank means…','Ax=0 has only x=0','Every b has a solution regardless of shape','A must be square','A is orthogonal','The nullity is zero.']
],
'la-det':[
['Swapping two rows changes a determinant by…','A factor −1','A factor 2','No change','Its reciprocal','The determinant is alternating in rows.'],
['Adding a multiple of one row to another…','Leaves the determinant unchanged','Always doubles it','Negates it','Makes it zero','This elementary row replacement preserves determinant.'],
['For a 3×3 A with det A=2, det(3A) is…','54','6','18','27','Scaling all three rows contributes 3³×2.'],
['det(AB) equals…','det(A)det(B)','det(A)+det(B)','det(A+B)','det(A)/det(B)','Determinants multiply for square matrices of the same size.'],
['det(Aᵀ) equals…','det(A)','−det(A)','1/det(A)','0','Transpose preserves the determinant.'],
['The determinant of [[2,1],[3,4]] is…','5','11','−5','8','2×4−1×3=5.'],
['A triangular matrix has determinant…','The product of its diagonal','The sum of its diagonal','Always 1','The product of all entries','Only the diagonal permutation contributes.'],
['A zero determinant for square A means…','A is singular','A is the zero matrix','Every entry is zero','A is not diagonalizable','The columns are dependent, but the matrix may contain many nonzero entries.'],
['For u,v in Rⁿ, det(I+uvᵀ) is…','1+vᵀu','1−vᵀu','uᵀu+vᵀv','Always 1','This is the rank-one determinant lemma.'],
['det(A+B) in general is…','Not determined by det(A) and det(B) alone','det(A)+det(B)','det(A)det(B)','Always zero','Determinants are not additive as matrix functions.']
],
'la-ortho':[
['Projection of b onto nonzero a is…','a(aᵀb)/(aᵀa)','b(aᵀb)','a/||b||','a+b','The coefficient minimizes the squared residual.'],
['Project (3,1) onto span((1,1)).','(2,2)','(3,3)','(1,1)','(3,1)','The scalar coefficient is (3+1)/2=2.'],
['An orthogonal projection residual is…','Perpendicular to the target subspace','Always zero','Parallel to the projection','Always a unit vector','At the closest point, no target-space direction reduces the residual.'],
['For orthonormal columns Q, the projector is…','QQᵀ','QᵀQ in the output space always','Q+Qᵀ','Q²','QQᵀ maps the ambient output space onto col(Q).'],
['For full-column-rank A, the projector onto col(A) is…','A(AᵀA)⁻¹Aᵀ','AᵀA','(AAᵀ)⁻¹','A⁻¹','Normal equations determine the coefficient of the closest vector.'],
['Gram–Schmidt subtracts…','Projections on previous orthonormal directions','The whole previous input vector always','Only lengths','All coordinates','Removing projected components leaves an orthogonal residual.'],
['If a Gram–Schmidt residual is exactly zero, the input vector is…','In the span of previous vectors','Necessarily the zero vector','Independent of previous vectors','An orthonormal vector','Its new direction has already been represented.'],
['Normal equations for min ||Ax−b||² are…','AᵀAx=Aᵀb','AAᵀx=b','Ax=0','Aᵀx=b','Differentiate or impose residual orthogonality.'],
['The best constant fit to 1,2,6 is…','3','2','6','9','The least-squares constant is the mean.'],
['Least-squares fitted vector Ax is…','Unique even if coefficients are not','Nonunique whenever A has dependent columns','Always b','Always zero','Orthogonal projection onto a subspace is unique; null directions can change coefficients without changing the fit.']
],
'la-eigen':[
['An eigenvector must be…','Nonzero','A unit vector','An integer vector','Unique','Zero satisfies every eigenvalue equation and therefore cannot identify a direction.'],
['Eigenvalues of a triangular matrix are…','Its diagonal entries','Its row sums always','Its singular values always','All 1','Its characteristic determinant factors along the diagonal.'],
['The sum of eigenvalues with algebraic multiplicities equals…','Trace','Determinant','Rank','Nullity','The trace is invariant under similarity and is the sum of roots.'],
['The product of eigenvalues equals…','Determinant','Trace','Largest entry','Dimension','This includes zero for singular matrices.'],
['A real symmetric matrix is…','Orthogonally diagonalizable','Always positive definite','Always invertible','Always diagonal','The spectral theorem supplies an orthonormal eigenbasis.'],
['Geometric multiplicity of λ is…','dim null(A−λI)','Its count on the diagonal of A always','det(A−λI)','trace(A)','It counts independent eigenvectors for that eigenvalue.'],
['[[1,1],[0,1]] is…','Not diagonalizable','Orthogonally diagonalizable','Symmetric','An identity matrix','Eigenvalue 1 has algebraic multiplicity 2 but eigenspace dimension 1.'],
['Distinct eigenvalues guarantee…','Linearly independent corresponding eigenvectors','Orthogonal vectors for every matrix','Positive eigenvalues','A symmetric matrix','Orthogonality needs extra assumptions such as symmetry.'],
['If Av=3v, then (A²−I)v equals…','8v','2v','9v','0','Evaluate the polynomial 3²−1=8.'],
['Similar matrices share…','Eigenvalues, rank, trace and determinant','Every entry','Every eigenvector in the same coordinates','Every singular value always','Similarity changes coordinates; singular values need not be preserved by a nonorthogonal basis change.']
],
'la-quad':[
['The symmetric matrix for x²+6xy+4y² is…','[[1,3],[3,4]]','[[1,6],[6,4]]','[[1,0],[0,4]]','[[1,6],[0,4]] only','Each symmetric off-diagonal entry contributes one copy of the cross term.'],
['Eigenvalues −2 and 3 make a symmetric form…','Indefinite','Positive definite','Negative definite','Positive semidefinite','Both signs occur along eigenvector directions.'],
['Eigenvalues 0 and 4 make a form…','Positive semidefinite but not definite','Positive definite','Indefinite','Negative definite','It is nonnegative with a nonzero flat direction.'],
['Sylvester’s positive-definite criterion checks…','All leading principal minors are positive','Only the determinant','Only diagonal entries','Only the trace','For symmetric matrices, these leading minors characterize strict positivity.'],
['Positive semidefiniteness via minors requires…','All principal minors nonnegative','Only leading principal minors nonnegative','Only determinant positive','Every entry nonnegative','The semidefinite criterion requires more than the leading subset.'],
['For symmetric A with eigenvalues 2,5, minimum xᵀAx on ||x||=1 is…','2','5','7','10','The Rayleigh quotient is bounded by the extreme eigenvalues.'],
['The skew-symmetric part of A contributes to xᵀAx…','Nothing','Its determinant','Its trace times ||x||²','A positive term','Its scalar quadratic expression equals its own negative.'],
['For SPD A, minimizer of ½xᵀAx−bᵀx solves…','Ax=b','Ax=0','A²x=b','x=b always','Gradient Ax−b vanishes and positive curvature gives uniqueness.'],
['Hessian of ½||Mx−y||² is…','MᵀM','MMᵀ in every shape','M','yᵀy','Differentiate the gradient Mᵀ(Mx−y).'],
['For eigenvalues 1 and 4, ellipse xᵀAx=1 has semiaxis lengths…','1 and 1/2','1 and 4','1 and 2','2 and 4','An axis length is the reciprocal square root of its eigenvalue.']
],
'la-factor':[
['In Doolittle LU, the diagonal of L contains…','Ones','Pivots of U','Zeros','Eigenvalues','This normalization fixes the scaling ambiguity.'],
['For [[2,1],[6,4]], the first elimination multiplier is…','3','2','6','1/3','Divide the lower entry 6 by pivot 2.'],
['For PA=LU, solving Ax=b starts with…','Ly=Pb','Ly=b in every case','Uy=Pb','Lx=Ub','Permutation must also be applied to b.'],
['Partial pivoting chooses…','Largest absolute available entry in the current column','Largest diagonal entry anywhere','Smallest absolute pivot','Always the first row','It avoids unnecessarily small divisors.'],
['After a later pivot row swap, stored L multipliers…','Must be swapped in previously completed columns','Must all be negated','Are never changed','Become eigenvalues','This preserves the factorization identity.'],
['With unit-lower L and no swaps, det A equals…','Product of U diagonal entries','Sum of L diagonal entries','det L alone','Zero','det L=1 and determinants multiply.'],
['Cholesky with positive diagonal is guaranteed for…','Real symmetric positive definite matrices','Every real matrix','Every singular matrix','Every orthogonal matrix','The square-root pivots are positive under this assumption.'],
['For A=[[9,3],[3,5]], Cholesky L is…','[[3,0],[1,2]]','[[9,0],[3,5]]','[[3,1],[0,2]]','[[1,0],[3,1]]','Multiply LLᵀ to obtain A.'],
['A small residual in an ill-conditioned system…','May coexist with large solution error','Guarantees exact coefficients','Proves A is orthogonal','Means no solution exists','Ill-conditioning amplifies small perturbations.'],
['For a fixed dense A and many b values, prefer…','Factor once, reuse triangular solves','Compute a fresh inverse for every b','Repeat symbolic determinants','Ignore conditioning','The expensive factorization can be amortized.']
],
'la-svd':[
['Singular values are square roots of eigenvalues of…','AᵀA','A always','A+Aᵀ always','A⁻¹','AᵀA is symmetric positive semidefinite.'],
['An m×n matrix has a full SVD with U shape…','m×m','n×n','m×n always','1×m','U is an orthonormal basis of the output space.'],
['Rank equals the number of…','Positive singular values','Positive eigenvalues of A always','Nonzero entries','Distinct singular values','Count nonzero singular values with multiplicity.'],
['SVD exists for…','Every real rectangular matrix','Only square matrices','Only invertible matrices','Only symmetric matrices','Rectangular or rank-deficient matrices are included.'],
['For diag(−3,2), singular values are…','3,2','−3,2','9,4','1/3,1/2','They are nonnegative square roots of 9 and 4.'],
['Pseudoinverse of diag(2,0) is…','diag(1/2,0)','diag(1/2,∞)','diag(2,0)','Undefined','Only positive singular values are inverted.'],
['A⁺b selects which least-squares solution?','The minimum Euclidean norm one','The maximum norm one','An arbitrary random one','Only an exact solution','It discards the free null-space component.'],
['For singular values 5,3,1, rank-one squared Frobenius error is…','10','4','9','1','Sum squares of discarded singular values: 3²+1².'],
['For singular values 4 and 0.5, κ₂ is…','8','4.5','2','0.125','The ratio of largest to smallest is 4/0.5.'],
['Before interpreting SVD as covariance PCA, usually…','Center feature columns','Add a row of zeros only','Normalize every singular value to one','Transpose without centering','PCA variation is measured about the mean; scaling is a separate choice.']
],
'calc-foundations':[
['Domain of ln(x−1) is…','x>1','x≥1','All real x','x≠1 only','The logarithm argument must be positive.'],
['Domain of 1/√x is…','x>0','x≥0','x≠0','All real x','The real square root needs nonnegative x and the denominator excludes zero.'],
['Which function is even?','x²','x³','x+1','sin x','Replacing x by −x leaves x² unchanged.'],
['f(x−2) shifts the graph of f…','Right by 2','Left by 2','Up by 2','Down by 2','The same old input occurs when the new x is two larger.'],
['f⁻¹ denotes…','Inverse function','Reciprocal function always','Negative derivative','Second derivative','It reverses a one-to-one mapping.'],
['For f=x², g=x+1, f∘g is…','(x+1)²','x²+1','x²+x','2x+1','Apply g first and then square.'],
['ln(e⁴) equals…','4','e⁴','1','ln 4','Natural logarithm reverses the exponential.'],
['π radians equals…','180°','90°','360°','1°','A half turn is π radians.'],
['On (0,1), f(x)=x has…','No attained maximum','Maximum 1','Minimum 0','No finite supremum','The endpoint is excluded though its limiting value is the supremum.'],
['Cancelling x−1 from (x²−1)/(x−1)…','Does not restore x=1 to the original domain','Makes the original defined at 1','Proves the function is constant','Changes its limit to 0','Formula simplification must preserve domain exclusions.']
],
'calc-limits':[
['limₓ→₀ sin x/x equals…','1','0','∞','Does not exist','Use radians and the standard limit.'],
['limₓ→₀ ln(1+2x)/x equals…','2','1','1/2','0','Scale the standard logarithm limit by 2.'],
['limₓ→₁ (x²−1)/(x−1) equals…','2','0','1','Does not exist','For x≠1 the expression is x+1.'],
['A two-sided limit with left value 2 and right value 3…','Does not exist','Equals 2.5','Equals 2','Equals 3','The one-sided limits must agree.'],
['Continuity at a requires…','The limit equals the defined value f(a)','Only that f(a) exists','Only that a finite limit exists','Only differentiability nearby','All three conditions must hold at the point.'],
['Which implies continuity at a?','Differentiability at a','A finite value at a','A left limit alone','A bounded neighborhood','A finite derivative gives a vanishing local function change.'],
['limₓ→∞ (3x²+1)/(2x²−x) equals…','3/2','0','∞','2/3','Divide by the highest power x².'],
['limₓ→₀ x sin(1/x) equals…','0','1','∞','Does not exist','Squeeze its absolute value by |x|.'],
['L’Hôpital applies directly to which form, with its other hypotheses?','0/0','1/0','2/3','0/1','A qualifying indeterminate quotient is needed.'],
['A continuous f on [a,b] with f(a)<0<f(b) has…','At least one root inside','Exactly one root always','No roots','A root at an endpoint only','The intermediate value theorem guarantees existence, not uniqueness.']
],
'calc-derivatives':[
['Derivative of x⁵ is…','5x⁴','x⁴','5x⁵','x⁶/6','Apply the power rule.'],
['Derivative of e^{2x} is…','2e^{2x}','e^{2x}','2xe^{2x}','eˣ','Chain rule multiplies by the inner derivative 2.'],
['Derivative of ln(1+x²) is…','2x/(1+x²)','1/(1+x²)','2x ln(1+x²)','1/x²','Apply the logarithm rule and chain rule.'],
['Derivative of x sin x is…','sin x+x cos x','cos x','x cos x','sin x cos x','Use the product rule.'],
['Derivative of cos x is…','−sin x','sin x','−cos x','sec²x','The cosine slope is negative sine in radians.'],
['At zero, derivative of |x|…','Does not exist','Is 0','Is 1','Is −1','The left and right slopes disagree.'],
['For x²+y²=1, dy/dx where y≠0 is…','−x/y','x/y','−y/x','2x','Differentiate implicitly and solve 2x+2yy′=0.'],
['Derivative of xˣ for x>0 is…','xˣ(ln x+1)','xˣ','x·xˣ⁻¹','xˣ ln x','Logarithmic differentiation handles the changing exponent.'],
['The second derivative of x³ is…','6x','3x²','6','x⁴/4','Differentiate 3x² once more.'],
['Tangent slope to x² at x=3 is…','6','9','3','12','The derivative 2x evaluates to 6.']
],
'calc-applications':[
['For f=x² on [0,2], an MVT point is…','1','0','2','4','Average slope is 2; solve 2c=2.'],
['Rolle’s theorem additionally requires…','Equal endpoint values','Positive derivative','Convexity','A zero second derivative','Together with continuity and interior differentiability, this ensures an interior zero slope.'],
['If f′>0 throughout an interval, f is…','Strictly increasing','Strictly decreasing','Constant','Necessarily convex','Positive slope controls monotonicity, not curvature.'],
['If f″>0 throughout an interval, the slope is…','Increasing','Decreasing','Always positive','Always zero','The second derivative measures change in the first.'],
['At zero, x⁴ has…','A minimum but no inflection','An inflection but no minimum','A maximum','Neither a minimum nor an inflection','It is nonnegative and convex on both sides.'],
['At zero, x³ has…','An inflection but no extremum','A maximum','A minimum','A discontinuity','Its concavity changes but it remains increasing.'],
['Linearization of √x at x=4 is…','2+(x−4)/4','2+(x−4)/2','4+2(x−4)','√4+(x−4)','Use f(4)=2 and f′(4)=1/4.'],
['For A=πr², dA/dt equals…','2πr dr/dt','π(dr/dt)²','2πr','πr² dr/dt','Chain rule accounts for time-dependent radius.'],
['If |f′|≤3 between a,b, then |f(b)−f(a)|≤…','3|b−a|','|b−a|/3','3 always','0','Apply the mean value theorem and bound the derivative.'],
['Strictly increasing f must have f′>0 at every point if differentiable?','No: x³ has f′(0)=0','Yes, without exception','Only if f is polynomial','No increasing function has derivatives','The sufficient positive-derivative condition is not necessary pointwise.']
],
'calc-taylor':[
['The quadratic Maclaurin polynomial of eˣ is…','1+x+x²/2','1+x+x²','x+x²/2','1+x²/2','All derivatives at zero are 1; divide by factorials.'],
['The cubic coefficient in sin x is…','−1/6','1/6','−1/3','0','The sine series begins x−x³/3!.'],
['The quadratic coefficient in cos x is…','−1/2','1/2','−1','0','The cosine series begins 1−x²/2!.'],
['Taylor expansion about a uses powers of…','x−a','x+a','a only','f(x)','The center is where the derivatives are matched.'],
['limₓ→₀ (eˣ−1−x)/x² is…','1/2','1','0','∞','The first surviving term is x²/2.'],
['ln(1+x)=x−x²/2+… is valid as a convergent real series at…','x=1','x=2','x=−1','Every real x','It converges conditionally at 1; −1 is outside the log domain.'],
['If |f‴|≤M, a degree-two Taylor error is bounded by…','M|x−a|³/6','M|x−a|²/2','M|x−a|','M/3','Use the third derivative and 3! in the remainder.'],
['If the first nonzero derivative at a stationary point is order 3, the point is…','Not a local extremum','A local minimum','A local maximum','Always a global minimum','The leading odd power changes sign across the point.'],
['If the first nonzero derivative is order 6 and positive, the point is…','A strict local minimum','A strict local maximum','Not an extremum','A discontinuity','A positive even leading power is positive on both sides.'],
['An infinitely differentiable function always equals its Taylor series?','No','Yes on all real inputs','Yes whenever f(0)=0','Yes if its derivatives exist','Smooth functions can have a zero Taylor series but be nonzero nearby.']
],
'calc-opt':[
['A differentiable interior local extremum must satisfy…','f′=0','f″=0','f=0','f′>0','This necessary condition is Fermat’s theorem.'],
['f′ changing from negative to positive gives…','A local minimum','A local maximum','An inflection always','No extremum','The function falls into the point and rises after it.'],
['When f′(c)=0 and f″(c)=0, the second derivative test is…','Inconclusive','Proof of a minimum','Proof of a maximum','Proof of no extremum','Use sign changes or higher-order behavior.'],
['Global extrema on [a,b] require checking…','Endpoints and all interior critical candidates','Only f′=0','Only endpoints','Only f″=0','Corners can matter too, and candidates must lie in the domain.'],
['Minimum of x+4/x on x>0 is…','4 at x=2','2 at x=1','0 at x=0','Not attained','Derivative vanishes at 2 and the function is strictly convex on x>0.'],
['A differentiable convex function with f′(c)=0 has…','A global minimum at c','A global maximum at c','No extremum','A unique minimum without further assumptions','Convexity gives global minimality; strict convexity is needed for guaranteed uniqueness.'],
['For f=(x−2)², one GD step from 0 with η=1/4 gives…','1','2','−1','4','Derivative at zero is −4, so 0−(1/4)(−4)=1.'],
['For f=x², η=1 makes nonzero GD iterates…','Oscillate without shrinking','Converge in one step','Diverge in magnitude','Become undefined','The update multiplier is 1−2η=−1.'],
['Newton’s optimization update is…','x−f′/f″','x−f/f′','x+f′','x−f″/f′','It solves for a zero of the derivative using local curvature.'],
['A local minimum is necessarily global?','No','Yes for every differentiable function','Yes on every bounded domain','Yes if f′=0','Multiple wells can have different values; convexity provides a useful global guarantee.']
],
'calc-bridge':[
['An antiderivative of 2x is…','x²+C','2+C','2x²+C','x+C','Differentiate x²+C to recover 2x.'],
['∫₀¹x² dx equals…','1/3','1/2','1','2','Evaluate x³/3 at the bounds.'],
['∫₋₁¹x dx equals…','0','1','2','−1','Signed areas cancel.'],
['Substitution u=x² gives du=…','2x dx','x dx','2 dx','dx/x','Differentiate the substitution.'],
['The gradient of x²+3y² is…','(2x,6y)','(x,3y)','(2,6)','2x+6y','Differentiate one coordinate at a time.'],
['For f=x²−y², the origin is…','A saddle','A minimum','A maximum','Not stationary','Curvature is positive in x and negative in y.'],
['The Hessian of ½xᵀAx for symmetric A is…','A','2A','AᵀA','A⁻¹','The gradient is Ax, whose derivative matrix is A.'],
['The least-squares residual r satisfies…','Xᵀr=0','r=0 always','Xr=0 in every shape','rᵀr=1','It is orthogonal to the design column space.'],
['The best constant least-squares fit to 2,4,9 is…','5','4','9','3','It is the mean 15/3.'],
['A PSD Hessian at one stationary point proves a minimum for any smooth function?','No','Yes always','Only if the dimension is 2','It proves a maximum','Zero-curvature directions need higher-order analysis; x⁴−y⁴ at zero is a counterexample.']
]};
for(const [id,rows] of Object.entries(MATH_BANK)){
 const m=COURSE.find(m=>m.id===id);
 m.questions=rows.map(([prompt,correct,...rest],i)=>{const explain=rest.pop(),options=[correct,...rest],shift=i%4;for(let j=0;j<shift;j++)options.push(options.shift());return {...q(prompt,options,(4-shift)%4,explain),id:id+'-q'+(i+1),tags:[id.split('-').slice(1).join('-')]};});
 m.cards=[0,2,4,7,9].map((i,j)=>({id:id+'-card'+(j+1),front:rows[i][0],back:rows[i][1]+'. '+rows[i].at(-1)}));
}
window.MATH_FINAL={};
for(const track of ['la','calc']){const mods=COURSE.filter(m=>m.track===track);MATH_FINAL[track]=Array.from({length:10},(_,i)=>{const m=mods[i%mods.length],item=m.questions[(i*3+4)%10];return {...item,id:track+'-final-'+(i+1),kind:'Original mixed revision'};});}
