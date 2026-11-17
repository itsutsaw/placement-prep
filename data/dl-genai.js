window.SUBJECTS = window.SUBJECTS || [];
window.SUBJECTS.push({
  id: 'dl', title: 'Deep Learning & Generative AI', short: 'DL & GenAI', icon: '🧠', color: '#a855f7', group: 'ai',
  desc: 'Neural networks, backprop, optimisers, CNNs, RNNs/LSTMs, Transformers & attention, LLMs, RAG, fine-tuning, prompting, agents and evaluation.',
  topics: [
    {
      id: 'nn-basics', title: 'Neural Network Fundamentals',
      content: `
        ## The neuron & MLP
        A neuron computes \`a = f(wᵀx + b)\`. Stack neurons into layers → **Multi-Layer Perceptron**. Without non-linear activations, any number of layers collapses into one linear function.
        **Universal approximation theorem**: one hidden layer with enough neurons can approximate any continuous function (but depth makes it far more efficient).

        ## Activation functions
        | Function | Formula / range | Notes |
        |---|---|---|
        | Sigmoid | 1/(1+e⁻ˣ), (0,1) | output layer for binary; **vanishing gradients**, not zero-centred |
        | Tanh | (−1,1) | zero-centred, still saturates |
        | **ReLU** | max(0, x) | default for hidden layers; fast; "dying ReLU" (stuck at 0) |
        | Leaky ReLU / PReLU | max(αx, x) | fixes dying ReLU |
        | GELU / SiLU (Swish) | smooth ReLU-like | used in Transformers/LLMs |
        | Softmax | eˣⁱ/Σeˣʲ | multi-class output → probabilities summing to 1 |

        ## Loss functions
        - Regression: **MSE**, MAE, Huber.
        - Binary classification: **binary cross-entropy** (sigmoid output).
        - Multi-class: **categorical cross-entropy** (softmax output).
        - Others: hinge, contrastive / triplet loss (embeddings), KL divergence.

        ## Forward pass & backpropagation
        1. **Forward**: compute activations layer by layer → loss.
        2. **Backward**: apply the **chain rule** from the loss back to every weight: \`∂L/∂w = ∂L/∂a · ∂a/∂z · ∂z/∂w\`.
        3. **Update**: \`w ← w − η ∂L/∂w\`.
        Frameworks (PyTorch, TensorFlow) do this with **automatic differentiation** on a computation graph.

        ~~~python
        import torch, torch.nn as nn
        model = nn.Sequential(nn.Linear(784, 128), nn.ReLU(), nn.Dropout(0.2), nn.Linear(128, 10))
        opt = torch.optim.AdamW(model.parameters(), lr=1e-3)
        loss_fn = nn.CrossEntropyLoss()           # applies log-softmax internally
        for xb, yb in loader:
            opt.zero_grad()
            loss = loss_fn(model(xb), yb)
            loss.backward()                       # backprop
            opt.step()                            # update
        ~~~

        ## Vanishing & exploding gradients
        Gradients shrink/grow exponentially through many layers (multiplying many small/large numbers).
        **Fixes:** ReLU-family activations, proper **weight initialisation** (Xavier/Glorot for tanh, **He** for ReLU), **batch/layer normalisation**, **residual connections**, **gradient clipping** (exploding), LSTMs/GRUs for sequences.

        ## Epoch, batch, iteration
        Epoch = one pass over the dataset; batch = samples per update; iterations per epoch = N / batch size.
      `,
      keyPoints: [
        'Neuron: a = f(wᵀx + b); non-linear activations are what make depth useful.',
        'ReLU is the default hidden activation; sigmoid for binary output; softmax for multi-class.',
        'Sigmoid/tanh saturate ⇒ vanishing gradients; ReLU can "die" ⇒ Leaky ReLU.',
        'Backprop = chain rule from loss to every weight; autograd automates it.',
        'Vanishing/exploding fixes: ReLU, He/Xavier init, normalisation, residual connections, gradient clipping.',
        'Cross-entropy for classification, MSE for regression.',
        'Iterations per epoch = dataset size / batch size.'
      ]
    },
    {
      id: 'training', title: 'Optimisers, Regularisation & Training Tricks',
      content: `
        ## Optimisers
        | Optimiser | Idea |
        |---|---|
        | SGD | w −= η·g |
        | SGD + Momentum | accumulate a velocity: smooths and accelerates in consistent directions |
        | Nesterov | look-ahead momentum |
        | AdaGrad | per-parameter LR, shrinks for frequent features; LR decays too much |
        | RMSProp | exponential moving average of squared gradients — fixes AdaGrad decay |
        | **Adam** | momentum (1st moment) + RMSProp (2nd moment) + bias correction — default choice |
        | **AdamW** | Adam with *decoupled* weight decay — standard for Transformers |

        **Learning rate** is the most important hyperparameter. Schedules: step decay, cosine annealing, **warm-up** then decay (Transformers), one-cycle; LR finder.

        ## Regularisation
        - **Dropout**: randomly zero activations (p ≈ 0.1–0.5) during training → ensemble effect; disabled at inference (\`model.eval()\`).
        - **Weight decay / L2**.
        - **Early stopping** on validation loss.
        - **Data augmentation**: flips, crops, rotations, colour jitter (images); back-translation, synonym replacement (text); mixup/cutmix.
        - Label smoothing.

        ## Normalisation
        | | Batch Norm | Layer Norm |
        |---|---|---|
        | Normalises over | batch dimension (per feature) | features of each sample |
        | Depends on batch size | yes (bad for tiny batches) | no |
        | Used in | CNNs | Transformers, RNNs |
        Benefits: faster, more stable training, allows higher learning rates, mild regularisation. **RMSNorm** is common in modern LLMs.

        ## Transfer learning
        Start from a model pretrained on large data (ImageNet, web text), then:
        - **Feature extraction**: freeze backbone, train a new head (small data).
        - **Fine-tuning**: unfreeze some/all layers with a small LR (more data / domain shift).

        ## Practical training checklist
        1. Overfit a tiny batch first (sanity check).
        2. Normalise inputs; check data pipeline & labels visually.
        3. Start with Adam/AdamW, lr ≈ 1e-3 (1e-5 – 5e-5 for fine-tuning Transformers).
        4. Monitor train/val loss curves; use early stopping & checkpoints.
        5. Mixed precision (fp16/bf16) and gradient accumulation for bigger effective batches.
      `,
      keyPoints: [
        'Adam = momentum + RMSProp + bias correction; AdamW decouples weight decay (Transformers).',
        'Learning rate is the most important hyperparameter; warm-up + cosine decay is common.',
        'Dropout is active only in training (model.train()) and off in eval (model.eval()).',
        'BatchNorm normalises across the batch (CNNs); LayerNorm across features per sample (Transformers).',
        'Transfer learning: freeze backbone for small data; fine-tune with small LR for more data.',
        'Sanity check: overfit one small batch before full training.'
      ]
    },
    {
      id: 'cnn', title: 'Convolutional Neural Networks (Computer Vision)',
      content: `
        ## Why CNNs?
        Fully connected layers on images have too many parameters and ignore spatial structure. CNNs use **local connectivity**, **weight sharing** and **translation equivariance**.

        ## Building blocks
        - **Convolution**: a k×k filter slides over the input, computing dot products → feature map. Early layers detect edges, deeper layers detect parts/objects.
        - **Output size** = ⌊(W − K + 2P) / S⌋ + 1 (W input, K kernel, P padding, S stride).
          Example: 32×32 input, 5×5 kernel, P = 0, S = 1 → 28×28.
        - **Parameters per conv layer** = (K·K·C_in + 1) · C_out. A 3×3 conv from 64 → 128 channels has (9·64 + 1)·128 = **73,856** params.
        - **Padding**: "same" keeps size; "valid" = no padding.
        - **Pooling** (max/average): downsample, add slight translation invariance; no parameters.
        - **1×1 convolutions**: change channel depth cheaply (bottlenecks).
        - **Receptive field** grows with depth.

        ## Landmark architectures
        | Model | Year | Key idea |
        |---|---|---|
        | LeNet-5 | 1998 | first practical CNN (digits) |
        | AlexNet | 2012 | ReLU, dropout, GPUs — won ImageNet |
        | VGG | 2014 | stacks of 3×3 convs, deep & simple |
        | GoogLeNet / Inception | 2014 | parallel multi-size filters, 1×1 bottlenecks |
        | **ResNet** | 2015 | **skip/residual connections** y = F(x) + x → 100+ layers trainable |
        | MobileNet / EfficientNet | 2017/19 | depthwise separable convs, compound scaling — mobile |
        | **Vision Transformer (ViT)** | 2020 | split image into patches, treat as tokens |

        ## Vision tasks
        - **Classification** — one label per image.
        - **Object detection** — boxes + labels: two-stage (Faster R-CNN) vs one-stage (**YOLO**, SSD). Metrics: **IoU**, mAP. **Non-max suppression** removes duplicate boxes.
        - **Semantic segmentation** — label per pixel (**U-Net**, DeepLab); instance segmentation (Mask R-CNN); SAM (segment anything).
        - Image generation (GANs, diffusion), image captioning, CLIP (image–text embeddings).
      `,
      keyPoints: [
        'CNNs use local connectivity + weight sharing ⇒ far fewer parameters than dense layers.',
        'Output size = ⌊(W − K + 2P)/S⌋ + 1.',
        'Conv params = (K·K·C_in + 1)·C_out; pooling has no parameters.',
        'ResNet skip connections (y = F(x) + x) fix degradation and enable very deep nets.',
        '1×1 convs change channel depth cheaply.',
        'Detection: YOLO (one-stage) vs Faster R-CNN (two-stage); IoU, mAP, NMS.',
        'Segmentation: U-Net (semantic), Mask R-CNN (instance).',
        'ViT treats image patches as tokens.'
      ]
    },
    {
      id: 'rnn', title: 'Sequence Models: RNN, LSTM, GRU & NLP Basics',
      content: `
        ## Classic NLP pipeline
        Tokenisation → lowercasing/normalisation → stop-word removal → stemming (crude chop: "studies" → "studi") or **lemmatisation** (dictionary form: "studies" → "study") → vectorisation.
        - **Bag of Words**: counts, ignores order.
        - **TF-IDF**: term frequency × log(N / document frequency) — downweights common words.
        - **Word embeddings**: dense vectors capturing meaning — **Word2Vec** (CBOW predicts word from context; Skip-gram predicts context from word), GloVe, FastText (subwords). "king − man + woman ≈ queen".
        - Static embeddings give one vector per word; **contextual** embeddings (ELMo, BERT) depend on the sentence.

        ## Recurrent Neural Networks
        Process sequences step by step with a hidden state: \`hₜ = tanh(Wₓxₜ + Wₕhₜ₋₁ + b)\`. Weights shared across time; trained with **backpropagation through time (BPTT)**.
        Problems: **vanishing gradients** → can't learn long-range dependencies; sequential → can't parallelise.

        ## LSTM
        Adds a **cell state** (a conveyor belt) and three **gates**:
        - **Forget gate** — what to remove from the cell state.
        - **Input gate** — what new information to store.
        - **Output gate** — what to output as hidden state.
        The additive cell-state update lets gradients flow over long sequences.

        ## GRU
        Simplified LSTM with **update** and **reset** gates, no separate cell state — fewer parameters, often similar accuracy.

        ## Seq2Seq & attention
        Encoder RNN compresses the input into a vector; decoder generates the output (translation). The fixed-size bottleneck hurts on long inputs → **attention** (Bahdanau, 2014) lets the decoder look at all encoder states, weighting the relevant ones. This idea led to the Transformer.

        ## Other sequence tasks
        Sentiment analysis, NER (named entity recognition), POS tagging, machine translation, summarisation, speech recognition, time-series forecasting. Beam search vs greedy decoding.
      `,
      keyPoints: [
        'Stemming chops suffixes; lemmatisation returns the dictionary form.',
        'TF-IDF = term frequency × log(N/df) — downweights common words.',
        'Word2Vec: CBOW predicts word from context; Skip-gram predicts context from word.',
        'RNNs: shared weights over time, BPTT, vanishing gradients, no parallelism.',
        'LSTM gates: forget, input, output + additive cell state; GRU: update + reset gates.',
        'Attention lets the decoder focus on relevant encoder states — removes the fixed-vector bottleneck.'
      ]
    },
    {
      id: 'transformers', title: 'Transformers & Attention',
      content: `
        ## "Attention Is All You Need" (2017)
        Removes recurrence entirely; processes all tokens **in parallel** using self-attention → much faster training and better long-range modelling.

        ## Scaled dot-product attention ⭐
        Each token produces a **Query**, **Key** and **Value** vector (learned projections).
        \`Attention(Q, K, V) = softmax(QKᵀ / √d_k) · V\`
        - QKᵀ scores how much each token should attend to every other token.
        - Dividing by **√d_k** keeps dot products from growing large and saturating the softmax (tiny gradients).
        - Complexity **O(n²·d)** in sequence length n → long contexts are expensive (FlashAttention, sparse/linear attention, sliding windows help).

        ~~~python
        import torch, math
        def attention(Q, K, V, mask=None):
            scores = Q @ K.transpose(-2, -1) / math.sqrt(Q.size(-1))
            if mask is not None:
                scores = scores.masked_fill(mask == 0, float("-inf"))   # causal mask for decoders
            return torch.softmax(scores, dim=-1) @ V
        ~~~
        ~~~cpp
        #include <torch/torch.h>          // LibTorch — the C++ API of PyTorch
        torch::Tensor attention(torch::Tensor Q, torch::Tensor K, torch::Tensor V,
                                torch::optional<torch::Tensor> mask = {}) {
            auto scores = torch::matmul(Q, K.transpose(-2, -1)) / std::sqrt((double)Q.size(-1));
            if (mask) scores = scores.masked_fill(*mask == 0, -INFINITY);   // causal mask for decoders
            return torch::matmul(torch::softmax(scores, -1), V);
        }
        ~~~

        ## Multi-head attention
        Run h attention heads in parallel on lower-dimensional projections, concatenate, project. Different heads learn different relationships (syntax, coreference, position).

        ## Transformer block
        \`x → LayerNorm → Multi-head attention → + residual → LayerNorm → Feed-forward (MLP) → + residual\`
        (Modern LLMs use **pre-norm**, RMSNorm, SwiGLU activations.)

        ## Positional encoding
        Attention is permutation-invariant, so position information is added: sinusoidal (original), learned embeddings, **RoPE** (rotary — used by Llama and most modern LLMs), ALiBi.

        ## Three families
        | Type | Attention | Pretraining | Examples | Good for |
        |---|---|---|---|---|
        | **Encoder-only** | bidirectional | masked language modelling (MLM) | BERT, RoBERTa | classification, NER, embeddings |
        | **Decoder-only** | causal (masked) | next-token prediction | GPT, Llama, Claude, Mistral | text generation, chat — today's LLMs |
        | **Encoder–decoder** | both + cross-attention | span corruption / seq2seq | T5, BART | translation, summarisation |

        ## Tokenisation
        Subword algorithms — **BPE** (byte-pair encoding), WordPiece (BERT), SentencePiece/Unigram — balance vocabulary size and unknown words. ~1 token ≈ ¾ of an English word.

        ## Why Transformers beat RNNs
        Parallelisable training, direct paths between any two tokens (no vanishing over distance), scale extremely well with data and compute (**scaling laws**).
      `,
      keyPoints: [
        'Attention(Q,K,V) = softmax(QKᵀ/√d_k)·V.',
        'Scale by √d_k so softmax does not saturate.',
        'Self-attention is O(n²) in sequence length.',
        'Multi-head attention lets heads learn different relations in parallel.',
        'Block: attention + residual + norm, then feed-forward + residual + norm.',
        'Positional encodings: sinusoidal, learned, RoPE (modern LLMs).',
        'Encoder-only (BERT, MLM), decoder-only (GPT/Llama/Claude, next token), encoder–decoder (T5, BART).',
        'Causal mask stops tokens attending to the future in decoders.'
      ]
    },
    {
      id: 'llms', title: 'Large Language Models: Training, Fine-tuning & Inference',
      content: `
        ## How LLMs are built
        1. **Pretraining** — next-token prediction on trillions of tokens of text/code → a base model with broad knowledge.
        2. **Supervised fine-tuning (SFT / instruction tuning)** — train on (instruction, ideal response) pairs → follows instructions.
        3. **Preference alignment** — **RLHF** (train a reward model from human rankings, then optimise with PPO), **DPO** (directly optimise on preference pairs, no separate reward model), RLAIF/Constitutional AI (AI feedback guided by principles).
        4. Reasoning models are further trained with RL on verifiable tasks (math, code) to produce long chains of thought.

        ## Fine-tuning approaches
        | Approach | What changes | When |
        |---|---|---|
        | Prompting / few-shot | nothing | first thing to try |
        | **RAG** | nothing — inject knowledge at query time | fresh/private knowledge, citations |
        | Full fine-tuning | all weights | lots of data & compute |
        | **PEFT – LoRA** | small low-rank matrices A·B added to frozen weights (W + BA) | cheap, swappable adapters |
        | **QLoRA** | LoRA on a 4-bit quantised base model | fine-tune big models on one GPU |
        Fine-tune for **behaviour/style/format**; use RAG for **knowledge**.

        ## Decoding / sampling parameters
        - **Temperature**: <1 sharper (more deterministic), >1 more random. 0 ≈ greedy.
        - **Top-k**: sample from the k most likely tokens. **Top-p (nucleus)**: sample from the smallest set with cumulative probability ≥ p.
        - Greedy vs beam search; max tokens, stop sequences, repetition/frequency penalties.

        ## Inference efficiency
        - **KV cache** stores past keys/values so each new token doesn't recompute attention for the whole prefix.
        - **Quantisation** (8-bit, 4-bit: GPTQ, AWQ, GGUF) — less memory, small quality loss.
        - **Distillation** — train a small "student" to mimic a large "teacher".
        - Batching, speculative decoding, FlashAttention, **Mixture of Experts** (only some experts active per token).

        ## Key concepts & limitations
        - **Context window** — max tokens the model can attend to (prompt + output).
        - **Hallucination** — fluent but false output. Mitigate with RAG/grounding, citations, lower temperature, verification steps, "say I don't know".
        - **Knowledge cutoff**, bias, prompt injection, jailbreaks, privacy.
        - **Emergent abilities & scaling laws** — loss falls predictably with more parameters, data, compute (Chinchilla: ~20 tokens per parameter for compute-optimal training).
        - **Embeddings** — vectors representing meaning; similarity via **cosine similarity**.

        ## Evaluating LLMs
        Benchmarks (MMLU, GSM8K, HumanEval, SWE-bench), perplexity (language modelling), BLEU/ROUGE (translation/summaries — weak for open-ended text), **LLM-as-a-judge**, human evaluation, task-specific eval sets, RAG metrics (faithfulness, answer relevance, context precision/recall).
      `,
      keyPoints: [
        'Pipeline: pretraining (next token) → SFT (instructions) → preference alignment (RLHF/DPO).',
        'RLHF trains a reward model from human rankings then optimises with PPO; DPO skips the reward model.',
        'LoRA adds trainable low-rank matrices to frozen weights; QLoRA does it on a 4-bit base.',
        'Fine-tune for behaviour/format; use RAG for knowledge.',
        'Temperature controls randomness; top-p samples from the nucleus of cumulative probability p.',
        'KV cache avoids recomputing attention over the prefix for each new token.',
        'Quantisation and distillation shrink models; MoE activates only some experts per token.',
        'Hallucination mitigation: grounding/RAG, citations, low temperature, verification.'
      ]
    },
    {
      id: 'rag-agents', title: 'Prompt Engineering, RAG & AI Agents',
      content: `
        ## Prompt engineering
        - Be **specific**: role, task, context, constraints, output format (e.g. JSON schema), examples.
        - **Zero-shot** vs **few-shot** (include examples).
        - **Chain-of-thought** — ask the model to reason step by step before answering; improves math/logic.
        - **Self-consistency** — sample multiple reasoning paths, take the majority answer.
        - Delimit inputs (XML tags/triple quotes), put instructions clearly, ask for structured output, give the model a way out ("if unknown, say so").
        - System prompt vs user prompt.

        ## Retrieval-Augmented Generation (RAG) ⭐
        Give the LLM relevant external knowledge at query time.

        **Indexing (offline):** load documents → **chunk** (e.g. 300–1000 tokens with overlap) → **embed** each chunk → store vectors + metadata in a **vector database** (FAISS, Chroma, Pinecone, Weaviate, pgvector).
        **Query (online):** embed the question → **retrieve** top-k similar chunks (cosine similarity / ANN search like HNSW) → (optional) **re-rank** with a cross-encoder → put chunks in the prompt → LLM answers **with citations**.

        ~~~python
        # Minimal RAG sketch
        chunks = split(docs, size=500, overlap=50)
        vecs = embed(chunks)                            # embedding model
        index.add(vecs, metadata=chunks)

        def answer(q):
            hits = index.search(embed([q])[0], k=5)
            context = "\\n\\n".join(h.text for h in hits)
            prompt = f"Answer using only the context. Cite sources.\\n\\nContext:\\n{context}\\n\\nQuestion: {q}"
            return llm(prompt)
        ~~~

        **Improving RAG:** hybrid search (BM25 keyword + vectors), better chunking (semantic, by headings), query rewriting / HyDE, metadata filtering, re-ranking, parent-document retrieval, evaluating retrieval separately from generation.
        **Common failures:** wrong chunks retrieved, chunk too small (lost context) or too big (noise), "lost in the middle", outdated index.

        ## RAG vs fine-tuning
        | | RAG | Fine-tuning |
        |---|---|---|
        | Adds knowledge | ✓ easily updatable | partially, goes stale |
        | Changes style/behaviour | limited | ✓ |
        | Citations / traceability | ✓ | ✗ |
        | Cost | retrieval infra | training compute |

        ## AI agents
        An LLM that **plans and takes actions** in a loop using tools.
        - **Tool / function calling**: the model outputs a structured call (name + JSON args); your code executes it and returns the result.
        - **ReAct** pattern: Thought → Action → Observation → … → Final answer.
        - Components: LLM (reasoning), tools (search, code execution, APIs, DBs), **memory** (short-term context, long-term vector store), planning, guardrails.
        - Multi-agent systems (planner + workers), **MCP (Model Context Protocol)** — an open standard for connecting LLM apps to tools and data sources.
        - Frameworks: LangChain/LangGraph, LlamaIndex, provider agent SDKs.
        - Risks: prompt injection via tool outputs, runaway loops/costs, wrong actions → human-in-the-loop, permissions, evaluation.

        ## Other generative models
        - **VAE** — encoder → latent distribution → decoder; smooth latent space.
        - **GAN** — generator vs discriminator in a min-max game; sharp images, unstable training, mode collapse.
        - **Diffusion models** — learn to reverse a gradual noising process; Stable Diffusion runs it in a VAE latent space with text conditioning (CLIP/T5 encoders). State of the art for images/video.
      `,
      keyPoints: [
        'Prompting: role, context, constraints, output format, examples (few-shot), chain-of-thought.',
        'RAG indexing: chunk → embed → store in a vector DB; query: embed → retrieve top-k → (re-rank) → generate with citations.',
        'Improve RAG: hybrid BM25 + vector search, re-ranking, better chunking, query rewriting, metadata filters.',
        'RAG for fresh/private knowledge and citations; fine-tuning for style/behaviour.',
        'Agents = LLM + tools + memory in a loop (ReAct: thought → action → observation).',
        'Function calling: model emits structured tool calls; your code executes them.',
        'GAN: generator vs discriminator (mode collapse). Diffusion: learn to denoise. VAE: latent distribution.',
        'Prompt injection is the key security risk for LLM apps and agents.'
      ]
    }
  ],
  flashcards: [
    { q: 'Why do neural networks need non-linear activations?', a: 'Without them, stacked linear layers collapse into a single linear transformation and cannot model non-linear patterns.' },
    { q: 'What is backpropagation?', a: 'Computing gradients of the loss w.r.t. every weight by applying the chain rule backwards through the network, then updating with gradient descent.' },
    { q: 'Vanishing gradient problem and fixes?', a: 'Gradients shrink exponentially through layers/time, early layers stop learning. Fixes: ReLU, He/Xavier init, batch/layer norm, residual connections, LSTM/GRU.' },
    { q: 'ReLU advantages and problem?', a: 'Cheap, no saturation for x>0, sparse activations. Problem: dying ReLU (neurons stuck outputting 0) → Leaky ReLU/GELU.' },
    { q: 'What does Adam combine?', a: 'Momentum (first moment) + RMSProp (second moment, adaptive per-parameter LR) with bias correction.' },
    { q: 'How does dropout work?', a: 'Randomly zeroes activations with probability p during training (implicit ensemble, prevents co-adaptation); disabled at inference.' },
    { q: 'Batch norm vs layer norm?', a: 'BatchNorm normalises each feature across the batch (CNNs, depends on batch size). LayerNorm normalises across features of each sample (Transformers/RNNs).' },
    { q: 'CNN output size formula?', a: '⌊(W − K + 2P)/S⌋ + 1.' },
    { q: 'Why ResNet works?', a: 'Skip connections (y = F(x) + x) let gradients flow directly and make it easy to learn identity mappings, enabling very deep networks.' },
    { q: 'LSTM gates?', a: 'Forget gate (drop info), input gate (add info), output gate (expose info) around a cell state with additive updates.' },
    { q: 'Self-attention formula?', a: 'softmax(QKᵀ / √d_k) · V.' },
    { q: 'Why divide by √d_k in attention?', a: 'Dot products grow with dimension; scaling prevents the softmax from saturating and producing tiny gradients.' },
    { q: 'Complexity of self-attention?', a: 'O(n²·d) in sequence length n — quadratic in context length.' },
    { q: 'BERT vs GPT?', a: 'BERT: encoder-only, bidirectional, masked LM — understanding tasks/embeddings. GPT: decoder-only, causal next-token prediction — generation.' },
    { q: 'Why do Transformers need positional encoding?', a: 'Self-attention is order-agnostic; positional encodings (sinusoidal, learned, RoPE) inject token order.' },
    { q: 'What is RLHF?', a: 'Reinforcement Learning from Human Feedback: humans rank outputs → train a reward model → optimise the LLM against it (PPO) to align with preferences.' },
    { q: 'What is LoRA?', a: 'Low-Rank Adaptation: freeze base weights and train small low-rank matrices (W + BA), drastically reducing trainable parameters and memory.' },
    { q: 'What is RAG?', a: 'Retrieval-Augmented Generation: retrieve relevant documents (via embeddings/vector search) and include them in the prompt so the LLM answers grounded in them.' },
    { q: 'RAG vs fine-tuning — when to use which?', a: 'RAG for fresh, private or citable knowledge. Fine-tuning for style, format, behaviour or domain-specific skills.' },
    { q: 'Temperature and top-p?', a: 'Temperature scales logits (low = deterministic, high = creative). Top-p samples from the smallest token set whose cumulative probability ≥ p.' },
    { q: 'What is the KV cache?', a: 'Cached attention keys/values of previous tokens during generation so each new token only computes its own — speeds up autoregressive decoding.' },
    { q: 'What is hallucination and how to reduce it?', a: 'Confident but incorrect output. Reduce with RAG/grounding, citations, lower temperature, verification, letting the model say "I don’t know".' },
    { q: 'What is an AI agent?', a: 'An LLM that iteratively plans and calls tools (search, code, APIs) with memory to achieve a goal (e.g. ReAct loop).' },
    { q: 'GAN vs diffusion model?', a: 'GAN: generator vs discriminator adversarial training (fast sampling, unstable, mode collapse). Diffusion: learns to reverse noising step by step (stable, high quality, slower sampling).' },
    { q: 'Word2Vec CBOW vs Skip-gram?', a: 'CBOW predicts a word from its context (faster). Skip-gram predicts context words from a word (better for rare words).' },
    { q: 'What is transfer learning?', a: 'Reusing a model pretrained on large data and adapting it (freeze + new head, or fine-tune) to a new task with less data.' },
    { q: 'What is quantisation?', a: 'Representing weights/activations with fewer bits (8-bit, 4-bit) to cut memory and speed up inference with small accuracy loss.' },
    { q: 'What is chain-of-thought prompting?', a: 'Asking the model to reason step by step before the final answer, which improves multi-step reasoning accuracy.' }
  ],
  quiz: [
    { q: 'Which activation is the most common default for hidden layers?', options: ['Sigmoid', 'ReLU', 'Softmax', 'Step'], answer: 1, explain: 'ReLU is cheap and avoids saturation for positive inputs.', topic: 'nn-basics' },
    { q: 'For multi-class classification, the output layer typically uses:', options: ['Sigmoid + MSE', 'Softmax + cross-entropy', 'ReLU + MAE', 'Tanh + hinge'], answer: 1, explain: 'Softmax gives a probability distribution.', topic: 'nn-basics' },
    { q: 'Exploding gradients are commonly fixed with:', options: ['Gradient clipping', 'Higher learning rate', 'Removing normalisation', 'Sigmoid activations'], answer: 0, explain: 'Clip the gradient norm.', topic: 'nn-basics' },
    { q: 'Which optimiser is the standard for training Transformers?', options: ['Plain SGD', 'AdaGrad', 'AdamW', 'Newton’s method'], answer: 2, explain: 'Adam with decoupled weight decay.', topic: 'training' },
    { q: 'Dropout during inference is:', options: ['Applied with same p', 'Disabled', 'Doubled', 'Applied only to the output'], answer: 1, explain: 'model.eval() turns dropout off.', topic: 'training' },
    { q: '32×32 input, 3×3 kernel, padding 1, stride 1. Output size?', options: ['30×30', '32×32', '34×34', '16×16'], answer: 1, explain: '(32 − 3 + 2)/1 + 1 = 32.', topic: 'cnn' },
    { q: 'Which architecture introduced skip connections?', options: ['VGG', 'AlexNet', 'ResNet', 'LeNet'], answer: 2, explain: 'Residual learning (2015).', topic: 'cnn' },
    { q: 'YOLO is an example of:', options: ['Two-stage detector', 'One-stage detector', 'Segmentation network', 'Language model'], answer: 1, explain: 'Single pass predicts boxes and classes.', topic: 'cnn' },
    { q: 'The LSTM gate deciding what to discard from the cell state is the:', options: ['Input gate', 'Output gate', 'Forget gate', 'Reset gate'], answer: 2, explain: 'Forget gate.', topic: 'rnn' },
    { q: 'In attention, scores are divided by:', options: ['d_k', '√d_k', 'n', 'log n'], answer: 1, explain: 'Prevents softmax saturation.', topic: 'transformers' },
    { q: 'GPT-style models are:', options: ['Encoder-only', 'Decoder-only', 'Encoder–decoder', 'RNN-based'], answer: 1, explain: 'Causal decoders trained on next-token prediction.', topic: 'transformers' },
    { q: 'BERT is pretrained mainly with:', options: ['Next-token prediction', 'Masked language modelling', 'Contrastive images', 'Reinforcement learning'], answer: 1, explain: 'MLM (plus NSP originally).', topic: 'transformers' },
    { q: 'Which method fine-tunes by training small low-rank matrices?', options: ['RLHF', 'LoRA', 'Distillation', 'Pruning'], answer: 1, explain: 'LoRA.', topic: 'llms' },
    { q: 'Setting temperature close to 0 makes outputs:', options: ['More random', 'More deterministic', 'Longer', 'Multilingual'], answer: 1, explain: 'Approaches greedy decoding.', topic: 'llms' },
    { q: 'Your chatbot must answer from company documents updated daily. Best approach?', options: ['Fine-tune daily', 'RAG with a vector store', 'Increase temperature', 'Train from scratch'], answer: 1, explain: 'RAG keeps knowledge fresh and citable.', topic: 'rag-agents' },
    { q: 'In RAG, documents are split into chunks mainly to:', options: ['Reduce GPU usage in training', 'Retrieve focused relevant passages that fit the context', 'Encrypt data', 'Increase hallucinations'], answer: 1, explain: 'Smaller focused chunks improve retrieval precision.', topic: 'rag-agents' },
    { q: 'Mode collapse is a known problem of:', options: ['Diffusion models', 'GANs', 'Transformers', 'K-means'], answer: 1, explain: 'Generator produces limited variety.', topic: 'rag-agents' }
  ]
});
