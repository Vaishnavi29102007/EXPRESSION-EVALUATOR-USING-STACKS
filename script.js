const expressionInput = document.getElementById('expression');
const resultBox = document.getElementById('result');
const stackVisual = document.getElementById('stackVisual');

// Tokenize numbers and operators. This browser demo supports decimals and unary +/-.
function tokenize(text) {
  const tokens = [];
  let i = 0;
  while (i < text.length) {
    if (/\s/.test(text[i])) { i++; continue; }
    if (/[0-9.]/.test(text[i])) {
      let start = i, dots = 0;
      while (i < text.length && /[0-9.]/.test(text[i])) {
        if (text[i] === '.') dots++;
        i++;
      }
      const raw = text.slice(start, i);
      if (dots > 1 || raw === '.') throw new Error('Please check the number format.');
      tokens.push({ type: 'number', value: Number(raw), label: raw });
      continue;
    }
    if ('+-*/%^()'.includes(text[i])) { tokens.push({ type: 'symbol', value: text[i], label: text[i] }); i++; continue; }
    throw new Error(`Invalid character: ${text[i]}`);
  }
  if (!tokens.length) throw new Error('Enter an expression first.');
  return tokens;
}

function toPostfix(tokens) {
  const output = [], ops = [];
  const precedence = { 'u+': 4, 'u-': 4, '^': 3, '*': 2, '/': 2, '%': 2, '+': 1, '-': 1 };
  const rightAssociative = new Set(['^', 'u+', 'u-']);
  let expectValue = true;
  for (const token of tokens) {
    if (token.type === 'number') {
      if (!expectValue) throw new Error('Missing operator between numbers.');
      output.push(token); expectValue = false; continue;
    }
    const s = token.value;
    if (s === '(') {
      if (!expectValue) throw new Error('Add an operator before "(".');
      ops.push(s); expectValue = true; continue;
    }
    if (s === ')') {
      if (expectValue) throw new Error('Empty or incomplete parentheses.');
      while (ops.length && ops[ops.length - 1] !== '(') output.push({ type: 'operator', value: ops.pop() });
      if (!ops.length) throw new Error('Mismatched parentheses.');
      ops.pop(); expectValue = false; continue;
    }
    let op = s;
    if (expectValue) {
      if (s === '+') op = 'u+';
      else if (s === '-') op = 'u-';
      else throw new Error(`Operator "${s}" needs a number before it.`);
    } else expectValue = true;
    while (ops.length && ops[ops.length - 1] !== '(') {
      const top = ops[ops.length - 1];
      const shouldPop = rightAssociative.has(op) ? precedence[top] > precedence[op] : precedence[top] >= precedence[op];
      if (!shouldPop) break;
      output.push({ type: 'operator', value: ops.pop() });
    }
    ops.push(op);
  }
  if (expectValue) throw new Error('Expression cannot end with an operator.');
  while (ops.length) {
    const op = ops.pop();
    if (op === '(') throw new Error('Mismatched parentheses.');
    output.push({ type: 'operator', value: op });
  }
  return output;
}

function calculate(postfix) {
  const stack = [], steps = [];
  for (const token of postfix) {
    if (token.type === 'number') {
      stack.push(token.value); steps.push({ label: token.label, type: 'number', stack: [...stack] }); continue;
    }
    const op = token.value;
    if (op === 'u-' || op === 'u+') {
      if (stack.length < 1) throw new Error('Invalid expression.');
      const a = stack.pop(); stack.push(op === 'u-' ? -a : a);
      steps.push({ label: op === 'u-' ? 'unary −' : 'unary +', type: 'operator', stack: [...stack] }); continue;
    }
    if (stack.length < 2) throw new Error('Invalid expression: missing a number.');
    const b = stack.pop(), a = stack.pop(); let value;
    switch (op) {
      case '+': value = a + b; break;
      case '-': value = a - b; break;
      case '*': value = a * b; break;
      case '/': if (b === 0) throw new Error('Division by zero is not allowed.'); value = a / b; break;
      case '%': if (b === 0) throw new Error('Modulo by zero is not allowed.'); value = a % b; break;
      case '^': value = a ** b; break;
      default: throw new Error('Unknown operator.');
    }
    if (!Number.isFinite(value)) throw new Error('The result is outside the supported numeric range.');
    stack.push(value); steps.push({ label: op, type: 'operator', stack: [...stack] });
  }
  if (stack.length !== 1) throw new Error('Invalid expression.');
  return { value: stack[0], steps };
}

function showStack(steps) {
  stackVisual.innerHTML = '';
  const last = steps.slice(-7);
  if (!last.length) { stackVisual.innerHTML = '<div class="stack-empty">No stack steps to show.</div>'; return; }
  last.forEach(step => {
    const item = document.createElement('div');
    item.className = `stack-item ${step.type === 'operator' ? 'operator-item' : ''}`;
    item.textContent = `${step.label}  →  [${step.stack.map(n => Number(n.toPrecision(8))).join(', ')}]`;
    stackVisual.appendChild(item);
  });
}

function evaluateExpression() {
  resultBox.classList.remove('error');
  try {
    const tokens = tokenize(expressionInput.value);
    const postfix = toPostfix(tokens);
    const answer = calculate(postfix);
    resultBox.innerHTML = `<span class="result-label">RESULT</span><strong></strong><small>Expression evaluated successfully using a stack.</small>`;
    resultBox.querySelector('strong').textContent = Number(answer.value.toPrecision(12)).toString();
    showStack(answer.steps);
  } catch (error) {
    resultBox.classList.add('error');
    resultBox.innerHTML = `<span class="result-label">CHECK YOUR EXPRESSION</span><strong></strong><small></small>`;
    resultBox.querySelector('strong').textContent = 'Oops!';
    resultBox.querySelector('small').textContent = error.message;
    stackVisual.innerHTML = '<div class="stack-empty">Fix the expression and try again.</div>';
  }
}

document.getElementById('evaluate').addEventListener('click', evaluateExpression);
document.getElementById('clear').addEventListener('click', () => { expressionInput.value = ''; resultBox.classList.remove('error'); resultBox.innerHTML = '<span class="result-label">RESULT</span><strong>—</strong><small>Your answer will appear here.</small>'; stackVisual.innerHTML = '<div class="stack-empty">Evaluate an expression to see the stack steps.</div>'; expressionInput.focus(); });
document.getElementById('backspace').addEventListener('click', () => { expressionInput.value = expressionInput.value.slice(0, -1); expressionInput.focus(); });
document.querySelectorAll('[data-key]').forEach(button => button.addEventListener('click', () => { expressionInput.value += button.dataset.key; expressionInput.focus(); }));
document.querySelectorAll('[data-expression]').forEach(button => button.addEventListener('click', () => { expressionInput.value = button.dataset.expression; evaluateExpression(); }));
expressionInput.addEventListener('keydown', event => { if (event.key === 'Enter') evaluateExpression(); });
