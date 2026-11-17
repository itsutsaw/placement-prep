window.SUBJECTS = window.SUBJECTS || [];
window.SUBJECTS.push({
  id: 'ml', title: 'Machine Learning', short: 'ML', icon: '🤖', color: '#f97316', group: 'ai',
  desc: 'Math & statistics foundations, the ML workflow, regression, classification, trees & ensembles, clustering, PCA, evaluation metrics and practical Python.',
  intro: `
    > 🎯 **AI/ML interviews** test: (1) intuition behind algorithms, (2) the math you can derive on a whiteboard (gradient descent, logistic loss, Bayes), (3) evaluation & debugging (overfitting, leakage, imbalance), (4) your projects end to end, and usually (5) a DSA/coding round too.
  `,
  topics: [
    {
      id: 'foundations', title: 'ML Foundations & Bias–Variance',
      content: `
        ## What is ML?
        Learning a function f: X → y from data rather than hand-writing rules. Tom Mitchell: a program learns from experience **E** w.r.t. task **T** and performance **P** if P on T improves with E.

        ## Types of learning
        | Type | Data | Examples |
        |---|---|---|
        | **Supervised** | labelled (X, y) | regression (price), classification (spam) |
        | **Unsupervised** | unlabelled X | clustering, dimensionality reduction, anomaly detection |
        | **Semi-supervised** | few labels + many unlabelled | label propagation, pseudo-labelling |
        | **Self-supervised** | labels created from the data itself | next-token prediction (LLMs), masked image modelling |
        | **Reinforcement** | rewards from interaction | games, robotics, RLHF |

        ## The ML workflow
        1. Define the problem & metric (business → ML objective).
        2. Collect data → **EDA** (distributions, missing values, correlations, outliers).
        3. Clean & preprocess, feature engineering.
        4. **Split** data: train / validation / test (e.g. 70/15/15) — test set touched **once**.
        5. Baseline model → iterate models & hyperparameters (cross-validation).
        6. Evaluate on the test set; error analysis.
        7. Deploy, monitor (data drift, concept drift), retrain.

        ## Bias–variance trade-off ⭐
        Expected error = **Bias² + Variance + Irreducible noise**
        | | High bias (underfitting) | High variance (overfitting) |
        |---|---|---|
        | Symptom | high train error, high val error | low train error, **much higher** val error |
        | Cause | model too simple | model too complex / too little data |
        | Fixes | more features, more complex model, less regularisation, train longer | more data, regularisation (L1/L2, dropout), simpler model, feature selection, early stopping, ensembling (bagging), data augmentation |

        **Learning curves** (error vs training size) diagnose which one you have: converging high errors → bias; large gap → variance.

        ## Parametric vs non-parametric
        - **Parametric** — fixed number of parameters (linear/logistic regression, Naive Bayes, neural nets): fast, strong assumptions.
        - **Non-parametric** — complexity grows with data (KNN, decision trees, kernel SVM): flexible, need more data.

        ## Generative vs discriminative
        - **Discriminative** models P(y | x) directly (logistic regression, SVM, neural classifiers).
        - **Generative** models P(x, y) or P(x) (Naive Bayes, GMM, HMM, GANs, diffusion, LLMs).

        ## No Free Lunch theorem
        No single algorithm is best for every problem — always validate empirically.

        ## Curse of dimensionality
        As features grow, data becomes sparse, distances become less meaningful (KNN suffers) and more data is needed. Remedies: feature selection, PCA, regularisation.
      `,
      keyPoints: [
        'Supervised (labels), unsupervised (no labels), self-supervised (labels from data), reinforcement (rewards).',
        'Error = bias² + variance + irreducible noise.',
        'Underfitting: high train & val error ⇒ more complex model/features.',
        'Overfitting: low train, high val error ⇒ more data, regularisation, simpler model, early stopping.',
        'Test set is used once at the very end; tune on validation/CV.',
        'Discriminative models P(y|x); generative models P(x,y).',
        'Curse of dimensionality: distances lose meaning, need exponentially more data.'
      ]
    },
    {
      id: 'math-stats', title: 'Math & Statistics for ML',
      content: `
        ## Linear algebra
        - **Vectors, matrices**, dot product \`a·b = |a||b|cos θ\` (similarity), matrix multiplication (m×n · n×p = m×p).
        - **Transpose, inverse, rank** (number of independent rows/cols), **determinant** (0 ⇒ singular).
        - **Eigenvectors/eigenvalues**: \`Av = λv\` — directions only scaled by A. Basis of PCA.
        - **SVD**: \`A = UΣVᵀ\` — any matrix; used in PCA, recommender systems, compression.
        - Norms: L1 = Σ|xᵢ| (Manhattan), L2 = √Σxᵢ² (Euclidean).

        ## Calculus
        - Derivative = slope; **gradient** = vector of partial derivatives, points in direction of steepest ascent.
        - **Chain rule** → backpropagation: \`dL/dw = dL/dy · dy/dw\`.
        - Convex function → any local minimum is global (linear & logistic regression losses are convex; neural nets are not).

        ## Probability
        - **Conditional**: P(A|B) = P(A∩B)/P(B). **Independence**: P(A∩B) = P(A)P(B).
        - **Bayes' theorem**: \`P(A|B) = P(B|A)·P(A) / P(B)\` — posterior = likelihood × prior / evidence.

        > 🎯 **Classic:** A disease affects 1% of people. A test is 99% sensitive and has a 5% false-positive rate. P(disease | positive)?
        > P = (0.99 × 0.01) / (0.99 × 0.01 + 0.05 × 0.99) = 0.0099 / 0.0594 ≈ **16.7%**. Low prior dominates!

        ## Distributions
        | Distribution | Use | Mean | Variance |
        |---|---|---|---|
        | Bernoulli(p) | single yes/no | p | p(1−p) |
        | Binomial(n, p) | # successes in n trials | np | np(1−p) |
        | Poisson(λ) | # events in an interval | λ | λ |
        | Uniform(a, b) | equal likelihood | (a+b)/2 | (b−a)²/12 |
        | Normal(μ, σ²) | natural phenomena, errors | μ | σ² |
        | Exponential(λ) | time between events | 1/λ | 1/λ² |

        **Normal distribution 68–95–99.7 rule**: ±1σ, ±2σ, ±3σ. **Z-score** = (x − μ)/σ.
        **Central Limit Theorem**: the mean of many i.i.d. samples is approximately normal regardless of the original distribution (n ≳ 30).

        ## Descriptive statistics
        Mean (sensitive to outliers), **median** (robust), mode; variance, standard deviation; **IQR** = Q3 − Q1 (outliers outside Q1 − 1.5·IQR, Q3 + 1.5·IQR); skewness; **covariance** vs **correlation** (Pearson, −1 to 1, only linear). *Correlation ≠ causation.*

        ## Inferential statistics
        - **Hypothesis testing**: H₀ (no effect) vs H₁. **p-value** = probability of seeing data this extreme if H₀ is true. If p < α (0.05) → reject H₀.
        - **Type I error** (α) = false positive (reject a true H₀). **Type II error** (β) = false negative. **Power** = 1 − β.
        - Tests: **t-test** (compare means), **chi-square** (categorical independence), **ANOVA** (3+ means), z-test (large n, known σ).
        - **Confidence interval**: range that would contain the true parameter in 95% of repeated samples.
        - **A/B testing**: randomised experiment comparing two variants using a hypothesis test.

        ## MLE & MAP
        - **Maximum Likelihood Estimation**: choose θ maximising P(data | θ). MSE loss ⇔ MLE under Gaussian noise; cross-entropy ⇔ MLE for Bernoulli/categorical.
        - **MAP** adds a prior: maximise P(data|θ)·P(θ). Gaussian prior ⇔ L2 regularisation; Laplace prior ⇔ L1.

        ## Information theory
        **Entropy** H = −Σ p log p (uncertainty). **Cross-entropy** and **KL divergence** measure difference between distributions (KL ≥ 0, not symmetric).
      `,
      keyPoints: [
        'Bayes: P(A|B) = P(B|A)·P(A)/P(B) — watch low base rates.',
        'Eigenvectors satisfy Av = λv; PCA uses eigenvectors of the covariance matrix (or SVD).',
        'Gradient points to steepest ascent; chain rule powers backprop.',
        'CLT: sample means are ~normal for large n.',
        '68–95–99.7 rule for ±1/2/3σ; z = (x−μ)/σ.',
        'p-value < α ⇒ reject H₀. Type I = false positive, Type II = false negative.',
        'MSE ⇔ Gaussian MLE; cross-entropy ⇔ Bernoulli MLE; L2 ⇔ Gaussian prior (MAP).',
        'Median and IQR are robust to outliers; correlation ≠ causation.'
      ]
    },
    {
      id: 'data-prep', title: 'Data Preprocessing & Feature Engineering',
      content: `
        ## Missing values
        - Drop rows/columns (if few / column mostly empty).
        - Impute: mean (normal data), **median** (skewed/outliers), mode (categorical), constant, KNN imputer, model-based, forward-fill (time series).
        - Add a "was_missing" indicator — missingness can be informative.

        ## Encoding categorical variables
        | Method | When |
        |---|---|
        | Label / ordinal encoding | ordered categories (low < mid < high); tree models |
        | **One-hot encoding** | nominal, low cardinality (linear models, NNs) — beware dummy variable trap: drop one column for linear models |
        | Target (mean) encoding | high cardinality — use CV folds to avoid leakage |
        | Frequency / hashing | very high cardinality |
        | Embeddings | deep learning |

        ## Feature scaling
        | Method | Formula | Use |
        |---|---|---|
        | Standardisation | (x − μ)/σ | most algorithms; roughly normal data |
        | Min–max normalisation | (x − min)/(max − min) → [0,1] | neural nets, image pixels |
        | Robust scaling | (x − median)/IQR | outliers present |
        **Needed** for distance/gradient-based models: KNN, K-means, SVM, PCA, linear/logistic regression with regularisation, neural nets. **Not needed** for tree-based models.

        > ⚠️ **Data leakage:** fit scalers/imputers/encoders on the **training set only**, then transform val/test. Use \`sklearn.pipeline.Pipeline\` so cross-validation does this automatically. Other leaks: features that encode the target, future information in time series, duplicates across splits.

        ## Outliers
        Detect with IQR rule, z-score (|z| > 3), isolation forest, visual box plots. Treat by removing, capping (winsorising), log transform, or robust models.

        ## Feature engineering ideas
        Ratios, differences, date parts (day of week, month, is_weekend), aggregations per group, text (TF-IDF, embeddings), interactions, polynomial features, log transform for skewed features, binning.

        ## Feature selection
        - **Filter**: correlation, chi-square, mutual information, variance threshold.
        - **Wrapper**: recursive feature elimination (RFE), forward/backward selection.
        - **Embedded**: L1 (Lasso) shrinks coefficients to zero, tree feature importances.
        - Remove **multicollinearity** (high VIF) for interpretable linear models.

        ## Imbalanced data (fraud, disease)
        - Use the right metric: precision, recall, F1, **PR-AUC** — not accuracy.
        - Resampling: random oversampling, **SMOTE** (synthetic minority samples), undersampling.
        - **Class weights** (\`class_weight='balanced'\`), threshold tuning, anomaly-detection framing.
        - Use **stratified** splits.

        ~~~python
        from sklearn.pipeline import Pipeline
        from sklearn.compose import ColumnTransformer
        from sklearn.preprocessing import StandardScaler, OneHotEncoder
        from sklearn.impute import SimpleImputer
        from sklearn.linear_model import LogisticRegression

        pre = ColumnTransformer([
            ("num", Pipeline([("imp", SimpleImputer(strategy="median")),
                              ("sc", StandardScaler())]), num_cols),
            ("cat", OneHotEncoder(handle_unknown="ignore"), cat_cols),
        ])
        model = Pipeline([("pre", pre), ("clf", LogisticRegression(class_weight="balanced"))])
        model.fit(X_train, y_train)
        ~~~
      `,
      keyPoints: [
        'Impute with median for skewed data; add missing indicators.',
        'One-hot for nominal (drop one for linear models); ordinal for ordered; target encoding for high cardinality (with CV).',
        'Scale for KNN, K-means, SVM, PCA, regularised linear models and NNs — not needed for trees.',
        'Fit preprocessing on train only; use Pipelines to avoid leakage.',
        'Imbalanced data: use F1/PR-AUC, class weights, SMOTE, threshold tuning, stratified splits.',
        'Feature selection: filter (correlation, MI), wrapper (RFE), embedded (Lasso, tree importance).',
        'Outliers: IQR rule, z-score > 3, isolation forest; cap or log-transform.'
      ]
    },
    {
      id: 'regression', title: 'Linear Regression & Gradient Descent',
      content: `
        ## Model
        \`ŷ = w₀ + w₁x₁ + … + wₙxₙ = wᵀx\`
        Loss: **Mean Squared Error** \`J(w) = (1/n) Σ (yᵢ − ŷᵢ)²\`

        ## Closed-form (Normal equation)
        \`w = (XᵀX)⁻¹ Xᵀy\` — exact, but O(n³) inversion in #features and fails if XᵀX is singular (multicollinearity).

        ## Gradient descent
        \`w := w − α · ∇J(w)\`, where for MSE: \`∇J = (2/n) Xᵀ(Xw − y)\`
        ~~~python
        import numpy as np
        def linear_regression_gd(X, y, lr=0.01, epochs=1000):
            X = np.c_[np.ones(len(X)), X]          # bias column
            w = np.zeros(X.shape[1])
            for _ in range(epochs):
                grad = 2 / len(X) * X.T @ (X @ w - y)
                w -= lr * grad
            return w
        ~~~
        ~~~cpp
        // X: n rows of d features, y: n targets. Returns weights w[0] = bias, w[1..d].
        vector<double> linearRegressionGD(const vector<vector<double>>& X, const vector<double>& y,
                                          double lr = 0.01, int epochs = 1000) {
            int n = X.size(), d = X[0].size();
            vector<double> w(d + 1, 0.0);
            for (int e = 0; e < epochs; e++) {
                vector<double> grad(d + 1, 0.0);
                for (int i = 0; i < n; i++) {
                    double pred = w[0];
                    for (int j = 0; j < d; j++) pred += w[j + 1] * X[i][j];
                    double err = pred - y[i];
                    grad[0] += err;
                    for (int j = 0; j < d; j++) grad[j + 1] += err * X[i][j];
                }
                for (int j = 0; j <= d; j++) w[j] -= lr * 2.0 / n * grad[j];
            }
            return w;
        }
        ~~~
        | Variant | Uses per step | Notes |
        |---|---|---|
        | Batch GD | all samples | stable, slow for big data |
        | **Stochastic GD** | 1 sample | noisy, fast, can escape shallow minima |
        | **Mini-batch GD** | 32–512 samples | standard in deep learning |
        Learning rate too high → divergence/oscillation; too low → slow. Scale features for faster convergence.

        ## Assumptions of linear regression (LINE + more)
        1. **L**inearity between features and target.
        2. **I**ndependence of errors.
        3. **N**ormality of residuals (for inference).
        4. **E**qual variance of errors (**homoscedasticity**).
        5. No/low **multicollinearity**.

        ## Regularisation ⭐
        | | Ridge (L2) | Lasso (L1) | Elastic Net |
        |---|---|---|---|
        | Penalty | λ Σ w² | λ Σ \\|w\\| | mix of both |
        | Effect | shrinks weights smoothly | drives some weights to **exactly 0** → feature selection | both |
        | Good when | many small effects, multicollinearity | few important features | correlated features + selection |
        Larger λ → simpler model (more bias, less variance). Don't penalise the bias term; scale features first.

        ## Metrics
        - **MAE** — average absolute error (robust to outliers).
        - **MSE / RMSE** — penalises large errors; RMSE in target units.
        - **R²** = 1 − SS_res/SS_tot — fraction of variance explained (can be negative on test data). **Adjusted R²** penalises extra useless features.
        - MAPE — percentage error (bad near zero).

        ## Polynomial regression
        Add x², x³, interaction terms → still *linear in parameters*. High degree → overfitting.
      `,
      keyPoints: [
        'Linear regression minimises MSE; closed form w = (XᵀX)⁻¹Xᵀy.',
        'Gradient descent: w ← w − α∇J; MSE gradient = (2/n)Xᵀ(Xw − y).',
        'Batch vs stochastic vs mini-batch GD; tune learning rate; scale features.',
        'Assumptions: linearity, independent errors, normal residuals, homoscedasticity, no multicollinearity.',
        'Ridge (L2) shrinks weights; Lasso (L1) sets some to zero (feature selection).',
        'Bigger λ ⇒ more bias, less variance.',
        'R² = 1 − SS_res/SS_tot; adjusted R² penalises useless features; RMSE punishes big errors.'
      ]
    },
    {
      id: 'classification', title: 'Classification: Logistic Regression, KNN, Naive Bayes, SVM',
      content: `
        ## Logistic regression
        Linear model + **sigmoid**: \`p = σ(wᵀx) = 1 / (1 + e^(−wᵀx))\` → probability of class 1. Decision boundary is **linear** (wᵀx = 0).
        - Loss: **binary cross-entropy (log loss)** \`−[y log p + (1−y) log(1−p)]\` — convex. (MSE with sigmoid is non-convex.)
        - Gradient has the same neat form: \`∇ = Xᵀ(p − y)/n\`.
        - Coefficients are **log-odds**: e^w = odds ratio per unit increase.
        - Multiclass: one-vs-rest or **softmax** regression.

        ## K-Nearest Neighbours
        Predict by majority vote (classification) or average (regression) of the k closest training points.
        - **Lazy learner**: no training, slow prediction O(n·d) per query (use KD-trees/ball trees/ANN indexes).
        - Needs feature scaling; suffers from curse of dimensionality.
        - Small k → overfit (high variance); large k → underfit. Choose k by CV (odd k for binary).

        ## Naive Bayes
        Bayes' theorem with the **naive** assumption that features are conditionally independent given the class:
        \`P(y | x₁..xₙ) ∝ P(y) Π P(xᵢ | y)\`
        - Variants: Gaussian (continuous), Multinomial (word counts — text classification, spam), Bernoulli (binary features).
        - **Laplace smoothing** avoids zero probabilities for unseen words.
        - Very fast, works well with little data and high dimensions, probabilities poorly calibrated.

        ## Support Vector Machine
        Finds the hyperplane with the **maximum margin** between classes. Points on the margin are **support vectors**.
        - **Hard margin** (perfectly separable) vs **soft margin** with slack; **C** controls the trade-off: large C → less tolerance for errors (low bias, high variance); small C → wider margin.
        - Loss: **hinge loss** \`max(0, 1 − y·f(x))\`.
        - **Kernel trick**: compute inner products in a higher-dimensional space without mapping explicitly. Kernels: linear, polynomial, **RBF/Gaussian** (γ: large → wiggly boundary/overfit).
        - Works well in high dimensions with clear margins; slow on very large datasets (O(n²)–O(n³)); needs scaling.

        ## Comparison
        | Model | Boundary | Scaling needed | Interpretability | Speed |
        |---|---|---|---|---|
        | Logistic regression | linear | yes (with regularisation) | high | fast |
        | KNN | any | yes | medium | slow predict |
        | Naive Bayes | linear-ish | no | medium | very fast |
        | SVM (RBF) | non-linear | yes | low | slow on big n |
        | Decision tree | axis-aligned | no | high | fast |

        > 🎯 "Why is it called logistic *regression* if it classifies?" — It regresses the **log-odds** (a continuous value) linearly; thresholding the probability gives the class.
      `,
      keyPoints: [
        'Logistic regression: sigmoid of a linear score, trained with log loss (convex); linear boundary.',
        'Logistic coefficients are log-odds; e^w is the odds ratio.',
        'KNN: lazy, needs scaling; small k overfits, large k underfits.',
        'Naive Bayes assumes conditional independence; Laplace smoothing prevents zero probabilities; great for text.',
        'SVM maximises the margin; support vectors define it; hinge loss.',
        'SVM C: large C ⇒ narrow margin/overfit; RBF γ: large ⇒ complex boundary.',
        'Kernel trick computes high-dimensional inner products implicitly.'
      ]
    },
    {
      id: 'trees-ensembles', title: 'Decision Trees & Ensembles (RF, Boosting)',
      content: `
        ## Decision trees
        Recursively split data on the feature/threshold that most increases purity.
        - **Gini impurity** = 1 − Σ pᵢ² (CART, default in sklearn).
        - **Entropy** = −Σ pᵢ log₂ pᵢ → **information gain** = parent entropy − weighted child entropy (ID3/C4.5).
        - Regression trees split to minimise variance/MSE.
        - Pros: interpretable, no scaling, handles non-linearity & mixed types. Cons: **overfit easily** (high variance), unstable.
        - Control overfitting: max_depth, min_samples_split/leaf, max_leaf_nodes, **pruning** (cost-complexity, ccp_alpha).

        ### Example
        Node with 4 positives, 4 negatives: Gini = 1 − (0.5² + 0.5²) = **0.5**, entropy = **1 bit**. Pure node: 0.

        ## Ensemble learning
        Combine many models to beat any single one.

        ### Bagging (Bootstrap AGGregating) → reduces **variance**
        Train models in **parallel** on bootstrap samples (sampling with replacement), average/vote.
        **Random Forest** = bagging of trees + random subset of features at each split (√d for classification) → decorrelates trees.
        - **OOB (out-of-bag) error**: each tree skips ~37% of samples → free validation estimate.
        - Feature importance (impurity-based or permutation).

        ### Boosting → reduces **bias**
        Train models **sequentially**, each correcting the previous ones' errors.
        - **AdaBoost**: reweights misclassified samples; weak learners are stumps.
        - **Gradient Boosting**: each new tree fits the **negative gradient (residuals)** of the loss; prediction = sum of trees × learning rate.
        - **XGBoost** (regularisation, second-order gradients, handles missing values, parallel split finding), **LightGBM** (histogram-based, leaf-wise growth, very fast), **CatBoost** (great with categorical features, ordered boosting).
        - Key hyperparameters: n_estimators, learning_rate (lower + more trees = better, slower), max_depth, subsample, colsample_bytree, early stopping.

        ### Stacking
        Train a **meta-model** on the predictions of several base models (use out-of-fold predictions).

        | | Bagging (Random Forest) | Boosting (XGBoost) |
        |---|---|---|
        | Training | parallel, independent | sequential, dependent |
        | Reduces | variance | bias (and variance) |
        | Overfitting risk | low | higher — tune & early stop |
        | Base learners | deep trees | shallow trees |

        > 💡 For **tabular data**, gradient-boosted trees (XGBoost/LightGBM/CatBoost) are usually the strongest baseline — often beating deep learning.
      `,
      keyPoints: [
        'Gini = 1 − Σp²; entropy = −Σp log p; split on max information gain / impurity decrease.',
        '50/50 node: Gini 0.5, entropy 1; pure node: 0.',
        'Trees overfit — limit depth, min samples per leaf, prune.',
        'Bagging (parallel, bootstrap) reduces variance; Random Forest adds random feature subsets.',
        'OOB samples (~37%) give a free validation estimate.',
        'Boosting (sequential) reduces bias; gradient boosting fits residuals / negative gradients.',
        'XGBoost/LightGBM/CatBoost are top choices for tabular data.',
        'Stacking trains a meta-model on out-of-fold predictions.'
      ]
    },
    {
      id: 'unsupervised', title: 'Clustering & Dimensionality Reduction',
      content: `
        ## K-Means
        1. Pick k centroids (use **k-means++** initialisation).
        2. Assign each point to the nearest centroid.
        3. Move centroids to the mean of assigned points.
        4. Repeat until assignments stop changing.
        - Minimises **within-cluster sum of squares (inertia)**. O(n·k·d·iterations).
        - Choose k: **elbow method** (inertia vs k), **silhouette score** (−1 to 1, higher better).
        - Limitations: must choose k, assumes spherical similar-size clusters, sensitive to outliers & scaling, local minima (run multiple inits).

        ~~~python
        import numpy as np
        def kmeans(X, k, iters=100):
            C = X[np.random.choice(len(X), k, replace=False)]
            for _ in range(iters):
                labels = np.argmin(((X[:, None] - C) ** 2).sum(-1), axis=1)
                newC = np.array([X[labels == j].mean(0) for j in range(k)])
                if np.allclose(newC, C): break
                C = newC
            return labels, C
        ~~~
        ~~~cpp
        using Vec = vector<double>;
        double dist2(const Vec& a, const Vec& b) {
            double s = 0;
            for (size_t d = 0; d < a.size(); d++) s += (a[d] - b[d]) * (a[d] - b[d]);
            return s;
        }
        // returns cluster label for each point; C holds the centroids
        vector<int> kmeans(const vector<Vec>& X, int k, vector<Vec>& C, int iters = 100) {
            mt19937 rng(42);
            C.clear();
            for (int j = 0; j < k; j++) C.push_back(X[rng() % X.size()]);   // (use k-means++ in practice)
            vector<int> labels(X.size(), 0);
            for (int it = 0; it < iters; it++) {
                bool changed = false;
                for (size_t i = 0; i < X.size(); i++) {                    // assignment step
                    int best = 0;
                    for (int j = 1; j < k; j++) if (dist2(X[i], C[j]) < dist2(X[i], C[best])) best = j;
                    if (best != labels[i]) { labels[i] = best; changed = true; }
                }
                vector<Vec> sum(k, Vec(X[0].size(), 0)); vector<int> cnt(k, 0);
                for (size_t i = 0; i < X.size(); i++) {                    // update step
                    cnt[labels[i]]++;
                    for (size_t d = 0; d < X[i].size(); d++) sum[labels[i]][d] += X[i][d];
                }
                for (int j = 0; j < k; j++)
                    if (cnt[j]) {
                for (auto& v : sum[j]) v /= cnt[j];
                C[j] = sum[j];
            }
                if (!changed && it > 0) break;
            }
            return labels;
        }
        ~~~

        ## Hierarchical clustering
        **Agglomerative** (bottom-up merge) or divisive. Linkage: single (min distance — chaining), complete (max), average, **Ward** (min variance increase). Visualise with a **dendrogram**; cut at a height to get clusters. O(n²) memory — small datasets.

        ## DBSCAN
        Density-based: core points have ≥ \`min_samples\` neighbours within \`eps\`. Finds **arbitrary-shaped** clusters, labels **outliers as noise**, no need for k. Struggles with varying densities.

        ## Gaussian Mixture Models
        Soft clustering — each point has a probability for each cluster; trained with **EM (Expectation–Maximisation)**. Handles elliptical clusters.

        ## PCA — Principal Component Analysis ⭐
        Finds orthogonal directions of **maximum variance** and projects data onto the top k.
        1. Standardise the data.
        2. Compute covariance matrix.
        3. Eigen-decomposition (or SVD) → eigenvectors = principal components, eigenvalues = variance explained.
        4. Keep top k components (e.g. 95% explained variance).
        - Linear, unsupervised, components are uncorrelated. Uses: compression, visualisation, noise removal, speeding up models, fixing multicollinearity.
        - Loses interpretability; sensitive to scaling.

        ## Other techniques
        - **t-SNE / UMAP** — non-linear, for **visualisation** of high-dimensional data (embeddings) in 2-D; t-SNE distances between clusters aren't meaningful.
        - **LDA (Linear Discriminant Analysis)** — supervised; maximises class separability.
        - **Autoencoders** — neural-network compression.

        ## Anomaly detection
        Isolation Forest (anomalies are isolated in fewer splits), One-Class SVM, Local Outlier Factor, statistical z-score/IQR, autoencoder reconstruction error.

        ## Recommender systems (bonus)
        Content-based (item features), **collaborative filtering** (user–item interactions: user-based, item-based, **matrix factorisation**/SVD), hybrid; cold-start problem; two-tower embedding models in industry.
      `,
      keyPoints: [
        'K-means: assign to nearest centroid, recompute means; minimises inertia; use k-means++.',
        'Choose k with the elbow method or silhouette score.',
        'K-means assumes spherical clusters, needs scaling, sensitive to outliers.',
        'DBSCAN: density-based, arbitrary shapes, marks noise, no k needed (eps, min_samples).',
        'GMM = soft clustering trained with EM.',
        'PCA: standardise → covariance → eigenvectors; keep components explaining ~95% variance.',
        't-SNE/UMAP are for visualisation; LDA is supervised dimensionality reduction.',
        'Isolation Forest isolates anomalies in fewer splits.'
      ]
    },
    {
      id: 'evaluation', title: 'Model Evaluation & Validation',
      content: `
        ## Confusion matrix
        | | Predicted + | Predicted − |
        |---|---|---|
        | **Actual +** | TP | FN (Type II) |
        | **Actual −** | FP (Type I) | TN |

        ## Classification metrics
        | Metric | Formula | Use when |
        |---|---|---|
        | Accuracy | (TP+TN)/all | balanced classes |
        | **Precision** | TP/(TP+FP) | false positives costly (spam filter, recommending) |
        | **Recall / Sensitivity / TPR** | TP/(TP+FN) | false negatives costly (cancer, fraud) |
        | Specificity / TNR | TN/(TN+FP) | |
        | **F1** | 2PR/(P+R) | balance P & R, imbalanced data |
        | **ROC-AUC** | area under TPR vs FPR curve | ranking quality, threshold-independent |
        | **PR-AUC** | area under precision–recall curve | highly imbalanced data |
        | Log loss | −mean(y log p + …) | probability quality |

        ### Example
        TP = 40, FP = 10, FN = 20, TN = 930 → Accuracy = 97% (looks great!), Precision = 0.80, Recall = 0.67, F1 ≈ 0.73. Shows why accuracy misleads with imbalance.

        **Precision–recall trade-off**: raising the threshold → precision ↑, recall ↓. Choose the threshold from business costs.
        **AUC = 0.5** → random; 1.0 → perfect. AUC = probability a random positive is ranked above a random negative.

        ## Multiclass averaging
        **Macro** (average per class equally), **micro** (pool all TP/FP — equals accuracy for single-label), **weighted** (by support).

        ## Validation strategies
        - **Hold-out**: train/val/test split.
        - **K-fold cross-validation**: split into k folds; train on k−1, validate on 1; average. k = 5 or 10.
        - **Stratified K-fold**: preserves class ratios — use for classification.
        - **Leave-one-out**: k = n; low bias, expensive.
        - **Time-series split**: always train on the past, validate on the future (no shuffling!).
        - **Group K-fold**: keep the same user/patient in one fold to avoid leakage.

        ## Hyperparameter tuning
        Grid search (exhaustive), random search (better in high dimensions), **Bayesian optimisation** (Optuna), early stopping. Tune on validation/CV, never on the test set.

        ## Debugging a model — checklist
        1. Train error high? → bias problem.
        2. Train low, val high? → variance problem.
        3. Val good, production bad? → leakage, distribution shift, train/serve skew.
        4. Look at errors manually (error analysis), check label quality, try a simple baseline.

        ## Calibration
        Do predicted probabilities match observed frequencies? Fix with Platt scaling or isotonic regression; check with reliability diagrams.
      `,
      keyPoints: [
        'Precision = TP/(TP+FP) (avoid false alarms); Recall = TP/(TP+FN) (avoid misses).',
        'F1 = harmonic mean of precision and recall.',
        'Accuracy misleads on imbalanced data — use F1, PR-AUC, ROC-AUC.',
        'ROC-AUC = P(random positive ranked above random negative); 0.5 = random.',
        'Raising the threshold increases precision and lowers recall.',
        'Use stratified K-fold for classification and time-series split for temporal data.',
        'Tune on validation/CV; the test set is for the final estimate only.',
        'Macro average treats classes equally; micro pools counts; weighted uses support.'
      ]
    },
    {
      id: 'ml-practice', title: 'Python for ML, MLOps & Project Talk',
      content: `
        ## NumPy & Pandas essentials
        ~~~python
        import numpy as np, pandas as pd
        a = np.arange(12).reshape(3, 4)
        a.mean(axis=0)          # column means
        a[a > 5]                # boolean masking
        a @ a.T                 # matrix multiply; broadcasting: a - a.mean(0)

        df = pd.read_csv("data.csv")
        df.info(); df.describe(); df.isna().sum()
        df["age"] = df["age"].fillna(df["age"].median())
        df.groupby("city")["salary"].agg(["mean", "count"])
        df.merge(other, on="id", how="left")
        df[(df.age > 25) & (df.city == "Pune")]
        df["date"] = pd.to_datetime(df["date"]); df["dow"] = df["date"].dt.dayofweek
        pd.get_dummies(df, columns=["city"], drop_first=True)
        ~~~
        Prefer **vectorised** operations over Python loops / \`apply\` — 10–100× faster.

        ## scikit-learn workflow
        ~~~python
        from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
        from sklearn.ensemble import RandomForestClassifier
        from sklearn.metrics import classification_report, roc_auc_score

        X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)
        grid = GridSearchCV(RandomForestClassifier(random_state=42),
                            {"n_estimators": [200, 500], "max_depth": [None, 10]},
                            cv=5, scoring="f1", n_jobs=-1)
        grid.fit(X_tr, y_tr)
        pred = grid.predict(X_te)
        print(classification_report(y_te, pred))
        print(roc_auc_score(y_te, grid.predict_proba(X_te)[:, 1]))
        ~~~

        ## MLOps basics
        - **Experiment tracking**: MLflow, Weights & Biases.
        - **Versioning**: code (git), data (DVC), models (model registry).
        - **Serving**: REST API with FastAPI/Flask, batch vs real-time inference, Docker containers, Kubernetes.
        - **Monitoring**: data drift (input distribution changes), concept drift (X→y relationship changes), latency, model metrics → retrain triggers.
        - **CI/CD for ML**, feature stores, reproducibility (seeds, environments).

        ## Explaining your ML project (STAR + technical)
        1. **Problem & impact** — what and why, metric chosen and why.
        2. **Data** — source, size, cleaning, imbalance, leakage checks.
        3. **Features** — the most useful engineered features.
        4. **Models** — baseline → final; why this model; hyperparameter tuning.
        5. **Results** — metric numbers on a held-out set vs baseline.
        6. **Deployment & learnings** — what you'd do differently.

        > 🎯 Expect follow-ups like: *Why F1 and not accuracy? How did you avoid leakage? What if the data doubles? Why not XGBoost? How would you explain the model to a business user? (SHAP/feature importance)*

        ## Explainability
        Feature importance, **permutation importance**, **SHAP** (Shapley values — per-prediction attribution), LIME, partial dependence plots.
      `,
      keyPoints: [
        'Vectorise with NumPy/Pandas instead of Python loops.',
        'train_test_split with stratify and random_state; GridSearchCV with cv and proper scoring.',
        'MLOps: tracking (MLflow), versioning (DVC), serving (FastAPI + Docker), monitoring drift.',
        'Data drift = input distribution changes; concept drift = X→y relationship changes.',
        'Explain projects: problem, data, features, model choice, results vs baseline, deployment, learnings.',
        'SHAP gives per-prediction feature attributions.'
      ]
    }
  ],
  flashcards: [
    { q: 'Bias vs variance?', a: 'Bias: error from overly simple assumptions (underfitting). Variance: error from sensitivity to training data (overfitting). Total error = bias² + variance + noise.' },
    { q: 'How do you detect and fix overfitting?', a: 'Train error ≪ validation error. Fix: more data, regularisation, simpler model, dropout, early stopping, feature selection, bagging, augmentation.' },
    { q: 'L1 vs L2 regularisation?', a: 'L1 (Lasso) adds λΣ|w| → sparse weights (feature selection). L2 (Ridge) adds λΣw² → small, spread weights; handles multicollinearity.' },
    { q: 'Why is logistic regression trained with log loss and not MSE?', a: 'MSE with a sigmoid is non-convex (many local minima, weak gradients); log loss is convex and is the MLE for Bernoulli outputs.' },
    { q: 'Precision vs recall?', a: 'Precision = TP/(TP+FP): of predicted positives, how many are right. Recall = TP/(TP+FN): of actual positives, how many were found.' },
    { q: 'When do you prefer recall over precision?', a: 'When missing a positive is costly: cancer screening, fraud detection, safety alerts.' },
    { q: 'What does ROC-AUC measure?', a: 'Threshold-independent ranking ability: probability a random positive scores higher than a random negative. 0.5 = random, 1 = perfect.' },
    { q: 'How to handle imbalanced datasets?', a: 'Right metrics (F1, PR-AUC), class weights, SMOTE/oversampling, undersampling, threshold tuning, stratified CV, anomaly detection framing.' },
    { q: 'What is data leakage?', a: 'Information unavailable at prediction time leaking into training (fitting scaler on all data, target-derived features, future data). Gives over-optimistic scores.' },
    { q: 'Bagging vs boosting?', a: 'Bagging: parallel models on bootstrap samples, averages → reduces variance (Random Forest). Boosting: sequential models fixing previous errors → reduces bias (XGBoost).' },
    { q: 'Why does Random Forest use random feature subsets?', a: 'To decorrelate the trees so averaging reduces variance more effectively.' },
    { q: 'Gini impurity formula?', a: '1 − Σ pᵢ². 0 for a pure node, 0.5 maximum for two balanced classes.' },
    { q: 'How does gradient boosting work?', a: 'Starts with a simple prediction, then each new tree fits the negative gradient (residuals) of the loss; predictions add up, scaled by a learning rate.' },
    { q: 'K-means steps?', a: 'Init k centroids (k-means++) → assign points to nearest centroid → recompute centroids as means → repeat until convergence.' },
    { q: 'How to choose k in K-means?', a: 'Elbow method on inertia, silhouette score, domain knowledge, gap statistic.' },
    { q: 'K-means vs DBSCAN?', a: 'K-means: need k, spherical clusters, no noise handling. DBSCAN: density-based, arbitrary shapes, detects noise, needs eps & min_samples.' },
    { q: 'What does PCA do?', a: 'Projects data onto orthogonal directions of maximum variance (eigenvectors of the covariance matrix) to reduce dimensions while keeping most information.' },
    { q: 'Which algorithms need feature scaling?', a: 'Distance/gradient based: KNN, K-means, SVM, PCA, linear/logistic regression with regularisation, neural nets. Not trees/forests/boosting.' },
    { q: 'What is the kernel trick?', a: 'Computing inner products in a high-dimensional feature space via a kernel function without explicitly mapping the data — lets SVM learn non-linear boundaries.' },
    { q: 'Naive Bayes "naive" assumption?', a: 'Features are conditionally independent given the class.' },
    { q: 'What is cross-validation and why use it?', a: 'Splitting data into k folds, training on k−1 and validating on 1, rotating; gives a more reliable estimate than one split and is used for tuning.' },
    { q: 'Type I vs Type II error?', a: 'Type I: false positive (reject true H₀, α). Type II: false negative (fail to reject false H₀, β).' },
    { q: 'What is a p-value?', a: 'Probability of observing data at least this extreme assuming H₀ is true. Small p (< α) ⇒ reject H₀.' },
    { q: 'Central Limit Theorem?', a: 'The distribution of sample means approaches normal as sample size grows, regardless of the population distribution.' },
    { q: 'Parametric vs non-parametric models?', a: 'Parametric: fixed number of parameters, strong assumptions (linear regression). Non-parametric: complexity grows with data (KNN, trees).' },
    { q: 'R² meaning?', a: 'Fraction of target variance explained by the model: 1 − SS_res/SS_tot. Adjusted R² penalises adding useless features.' },
    { q: 'Generative vs discriminative models?', a: 'Discriminative learn P(y|x) (logistic regression, SVM). Generative learn P(x,y) or P(x) (Naive Bayes, GMM, GANs, LLMs).' },
    { q: 'Assumptions of linear regression?', a: 'Linearity, independence of errors, homoscedasticity, normal residuals, little multicollinearity.' },
    { q: 'Data drift vs concept drift?', a: 'Data drift: the input distribution P(X) changes. Concept drift: the relationship P(y|X) changes.' },
    { q: 'Grid search vs random search?', a: 'Grid tries every combination (expensive); random samples combinations and is usually more efficient when few hyperparameters matter.' }
  ],
  quiz: [
    { q: 'Training accuracy 99%, validation accuracy 70%. The model is:', options: ['Underfitting', 'Overfitting', 'Well fit', 'Not trained'], answer: 1, explain: 'Big train/val gap = high variance.', topic: 'foundations' },
    { q: 'Which technique reduces variance?', options: ['Adding polynomial features', 'Bagging', 'Reducing training data', 'Removing regularisation'], answer: 1, explain: 'Averaging bootstrap models reduces variance.', topic: 'foundations' },
    { q: 'Disease prevalence 1%, test sensitivity 99%, false-positive rate 5%. P(disease | positive) is about:', options: ['99%', '95%', '50%', '17%'], answer: 3, explain: '0.0099 / (0.0099 + 0.0495) ≈ 16.7%.', topic: 'math-stats' },
    { q: 'For a normal distribution, about what % lies within ±2σ?', options: ['68%', '95%', '99.7%', '50%'], answer: 1, explain: '68–95–99.7 rule.', topic: 'math-stats' },
    { q: 'Rejecting a true null hypothesis is a:', options: ['Type I error', 'Type II error', 'Power', 'p-value'], answer: 0, explain: 'False positive.', topic: 'math-stats' },
    { q: 'Which is a source of data leakage?', options: ['Using a pipeline', 'Fitting StandardScaler on the full dataset before splitting', 'Stratified split', 'Using a validation set'], answer: 1, explain: 'Test statistics leak into training.', topic: 'data-prep' },
    { q: 'Which model does NOT need feature scaling?', options: ['KNN', 'SVM', 'Random Forest', 'K-means'], answer: 2, explain: 'Tree splits are invariant to monotonic scaling.', topic: 'data-prep' },
    { q: 'Which regularisation can shrink coefficients to exactly zero?', options: ['L2 / Ridge', 'L1 / Lasso', 'Dropout', 'Batch norm'], answer: 1, explain: 'L1 produces sparse solutions.', topic: 'regression' },
    { q: 'Increasing the regularisation strength λ will generally:', options: ['Increase variance', 'Increase bias', 'Decrease bias', 'Not change the model'], answer: 1, explain: 'Simpler model ⇒ more bias, less variance.', topic: 'regression' },
    { q: 'The loss used for logistic regression is:', options: ['MSE', 'Hinge loss', 'Binary cross-entropy', 'MAE'], answer: 2, explain: 'Log loss is convex and is the Bernoulli MLE.', topic: 'classification' },
    { q: 'In SVM, the support vectors are:', options: ['All training points', 'Points closest to the decision boundary', 'Outliers only', 'Cluster centroids'], answer: 1, explain: 'They define the margin.', topic: 'classification' },
    { q: 'A KNN with k = 1 most likely has:', options: ['High bias', 'High variance', 'Zero variance', 'Linear boundary'], answer: 1, explain: 'It memorises training points.', topic: 'classification' },
    { q: 'Gini impurity of a node with 50% class A and 50% class B:', options: ['0', '0.25', '0.5', '1'], answer: 2, explain: '1 − (0.25 + 0.25) = 0.5.', topic: 'trees-ensembles' },
    { q: 'Gradient boosting builds trees:', options: ['Independently in parallel', 'Sequentially on residuals', 'Only one deep tree', 'Randomly without data'], answer: 1, explain: 'Each tree corrects previous errors.', topic: 'trees-ensembles' },
    { q: 'Which clustering algorithm can find arbitrary shapes and label noise?', options: ['K-means', 'DBSCAN', 'PCA', 'Linear regression'], answer: 1, explain: 'Density-based clustering.', topic: 'unsupervised' },
    { q: 'PCA components are:', options: ['Correlated', 'Orthogonal directions of max variance', 'Class labels', 'Cluster centres'], answer: 1, explain: 'Eigenvectors of the covariance matrix.', topic: 'unsupervised' },
    { q: 'Fraud dataset with 0.5% positives. Best metric?', options: ['Accuracy', 'PR-AUC / F1', 'R²', 'MSE'], answer: 1, explain: 'Accuracy would be 99.5% for "never fraud".', topic: 'evaluation' },
    { q: 'TP = 40, FP = 10, FN = 20. Precision is:', options: ['0.67', '0.80', '0.73', '0.50'], answer: 1, explain: '40 / (40 + 10).', topic: 'evaluation' },
    { q: 'Validation for a stock-price model should use:', options: ['Random shuffled K-fold', 'Time-series split', 'Leave-one-out with shuffle', 'No validation'], answer: 1, explain: 'Never train on the future.', topic: 'evaluation' },
    { q: 'Input feature distribution changes in production. This is:', options: ['Concept drift', 'Data drift', 'Overfitting', 'Leakage'], answer: 1, explain: 'P(X) changed.', topic: 'ml-practice' }
  ]
});
