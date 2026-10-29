# Expression Evaluator Using Stacks

A beginner-friendly DSA mini project with a browser-based calculator and a C implementation of postfix expression evaluation.

## Project files

- `index.html` — website layout
- `style.css` — website design and responsive styling
- `script.js` — browser calculator logic using stacks
- `main.c` — beginner C program that evaluates postfix expressions using a stack

## Run the website

1. Download or clone this repository.
2. Open `index.html` in Chrome, Edge, or Firefox.
3. Type an expression such as `(5 + 3) * 2` and click **Evaluate**.

No server or installation is required for the website.

## Run the C program

Compile with GCC:

```bash
gcc main.c -o evaluator
```

Run on Windows:

```bash
evaluator.exe
```

Run on Linux/macOS:

```bash
./evaluator
```

The C program is intentionally a small beginner version. It accepts single-digit postfix expressions using `+`, `-`, `*`, and `/`. Example: `23*5+` gives `11`.

## DSA concepts

- Stack (LIFO: Last In, First Out)
- Push and pop operations
- Postfix expression evaluation
- Operator precedence in the website demo

## Algorithm for the C program

1. Start and create an empty stack.
2. Read the postfix expression.
3. Scan each character from left to right.
4. If it is a digit, convert it to an integer and push it onto the stack.
5. If it is an operator, pop two values and perform the operation.
6. Push the result onto the stack.
7. When scanning is complete, display the final value at the top of the stack.

## GitHub Pages (publish the website)

1. Create a GitHub repository named `expression-evaluator-stack-c`.
2. Upload `index.html`, `style.css`, `script.js`, `main.c`, and `README.md`.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Select branch **main** and folder **/(root)**, then click **Save**.
6. Wait for GitHub Pages to publish. Your site URL will be shown in the Pages section, usually `https://YOUR-USERNAME.github.io/expression-evaluator-stack-c/`.

Replace `YOUR-USERNAME` with your GitHub username. The URL will not work until you publish the repository and GitHub Pages finishes deployment.
