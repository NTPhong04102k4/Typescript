// Companion code for ./02-engine-pipeline.md
//
// This file models V8's real pipeline (source -> parser -> AST -> Ignition
// bytecode -> TurboFan JIT) with a small toy arithmetic language. It is a
// pedagogical simulation, not V8's actual source, but every stage mirrors a
// real stage: tokenize (lexer), Parser (parser), compileToBytecode
// (Ignition's bytecode generator), runBytecode (Ignition's interpreter loop),
// and TieredExpressionEvaluator (TurboFan's tiering-up-after-hot-calls idea).

// --- Stage 1: Lexer (source text -> tokens) ---

export type TokenType = 'NUMBER' | 'PLUS' | 'MINUS' | 'STAR' | 'SLASH' | 'LPAREN' | 'RPAREN' | 'EOF';

export interface Token {
  readonly type: TokenType;
  readonly value: string;
}

const SYMBOL_TOKENS: Record<string, TokenType> = {
  '+': 'PLUS',
  '-': 'MINUS',
  '*': 'STAR',
  '/': 'SLASH',
  '(': 'LPAREN',
  ')': 'RPAREN',
};

export function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < source.length) {
    const c = source[i];
    if (c === ' ' || c === '\t') {
      i++;
      continue;
    }
    if (c >= '0' && c <= '9') {
      let j = i;
      while (j < source.length && source[j] >= '0' && source[j] <= '9') j++;
      tokens.push({ type: 'NUMBER', value: source.slice(i, j) });
      i = j;
      continue;
    }
    const symbolType = SYMBOL_TOKENS[c];
    if (symbolType) {
      tokens.push({ type: symbolType, value: c });
      i++;
      continue;
    }
    throw new Error(`Unexpected character '${c}' at position ${i}`);
  }
  tokens.push({ type: 'EOF', value: '' });
  return tokens;
}

// --- Stage 2: Parser (tokens -> AST) ---

export interface NumberLiteral {
  readonly kind: 'Number';
  readonly value: number;
}

export interface BinaryExpr {
  readonly kind: 'Binary';
  readonly operator: '+' | '-' | '*' | '/';
  readonly left: Expr;
  readonly right: Expr;
}

export type Expr = NumberLiteral | BinaryExpr;

/** Recursive-descent parser producing an AST, mirroring V8's parser stage. */
export class Parser {
  private position = 0;

  constructor(private readonly tokens: readonly Token[]) {}

  parseExpression(): Expr {
    const expr = this.parseAdditive();
    if (this.peek().type !== 'EOF') {
      throw new Error(`Unexpected trailing token: ${this.peek().type}`);
    }
    return expr;
  }

  private parseAdditive(): Expr {
    let left = this.parseMultiplicative();
    while (this.peek().type === 'PLUS' || this.peek().type === 'MINUS') {
      const operator = this.advance().type === 'PLUS' ? '+' : '-';
      const right = this.parseMultiplicative();
      left = { kind: 'Binary', operator, left, right };
    }
    return left;
  }

  private parseMultiplicative(): Expr {
    let left = this.parsePrimary();
    while (this.peek().type === 'STAR' || this.peek().type === 'SLASH') {
      const operator = this.advance().type === 'STAR' ? '*' : '/';
      const right = this.parsePrimary();
      left = { kind: 'Binary', operator, left, right };
    }
    return left;
  }

  private parsePrimary(): Expr {
    const token = this.advance();
    if (token.type === 'NUMBER') {
      return { kind: 'Number', value: Number(token.value) };
    }
    if (token.type === 'LPAREN') {
      const expr = this.parseAdditive();
      this.expect('RPAREN');
      return expr;
    }
    throw new Error(`Unexpected token: ${token.type}`);
  }

  private peek(): Token {
    return this.tokens[this.position];
  }

  private advance(): Token {
    return this.tokens[this.position++];
  }

  private expect(type: TokenType): Token {
    const token = this.advance();
    if (token.type !== type) throw new Error(`Expected ${type} but got ${token.type}`);
    return token;
  }
}

// --- Stage 3: Bytecode compiler (AST -> stack bytecode, like Ignition) ---

export type OpCode = 'PUSH' | 'ADD' | 'SUB' | 'MUL' | 'DIV';

export interface Instruction {
  readonly op: OpCode;
  readonly operand?: number;
}

const OPERATOR_TO_OPCODE: Record<BinaryExpr['operator'], OpCode> = {
  '+': 'ADD',
  '-': 'SUB',
  '*': 'MUL',
  '/': 'DIV',
};

/** Post-order compiles an AST into a flat stack-machine bytecode array. */
export function compileToBytecode(expr: Expr, out: Instruction[] = []): Instruction[] {
  if (expr.kind === 'Number') {
    out.push({ op: 'PUSH', operand: expr.value });
    return out;
  }
  compileToBytecode(expr.left, out);
  compileToBytecode(expr.right, out);
  out.push({ op: OPERATOR_TO_OPCODE[expr.operator] });
  return out;
}

// --- Stage 4: Interpreter (bytecode -> value, like Ignition's dispatch loop) ---

export function runBytecode(instructions: readonly Instruction[]): number {
  const stack: number[] = [];
  for (const instr of instructions) {
    switch (instr.op) {
      case 'PUSH':
        stack.push(instr.operand as number);
        break;
      case 'ADD': {
        const b = stack.pop() as number;
        const a = stack.pop() as number;
        stack.push(a + b);
        break;
      }
      case 'SUB': {
        const b = stack.pop() as number;
        const a = stack.pop() as number;
        stack.push(a - b);
        break;
      }
      case 'MUL': {
        const b = stack.pop() as number;
        const a = stack.pop() as number;
        stack.push(a * b);
        break;
      }
      case 'DIV': {
        const b = stack.pop() as number;
        const a = stack.pop() as number;
        stack.push(a / b);
        break;
      }
    }
  }
  return stack[stack.length - 1];
}

// --- Stage 5: Tiering simulation (Ignition warm path -> TurboFan hot path) ---

/**
 * Simulates V8's tiering: the first calls to a given source string run the
 * full tokenize -> parse -> compile -> interpret pipeline (Ignition). After
 * `optimizationThreshold` calls, the result is cached behind a closure,
 * modeling TurboFan compiling a "hot" function so future calls skip
 * re-parsing and re-interpreting entirely.
 */
export class TieredExpressionEvaluator {
  private readonly callCounts = new Map<string, number>();
  private readonly optimized = new Map<string, number>();

  constructor(private readonly optimizationThreshold = 3) {}

  evaluate(source: string): number {
    const cached = this.optimized.get(source);
    if (cached !== undefined) return cached; // TurboFan fast path

    const count = (this.callCounts.get(source) ?? 0) + 1;
    this.callCounts.set(source, count);

    const tokens = tokenize(source);
    const ast = new Parser(tokens).parseExpression();
    const bytecode = compileToBytecode(ast);
    const result = runBytecode(bytecode);

    if (count >= this.optimizationThreshold) {
      this.optimized.set(source, result);
    }
    return result;
  }

  tierOf(source: string): 'Ignition (interpreted)' | 'TurboFan (optimized)' {
    return this.optimized.has(source) ? 'TurboFan (optimized)' : 'Ignition (interpreted)';
  }
}

// --- LeetCode 150. Evaluate Reverse Polish Notation (Medium) ---
// https://leetcode.com/problems/evaluate-reverse-polish-notation/
// A direct real-world analogue of runBytecode: RPN tokens ARE a stack
// bytecode, evaluated the same way Ignition evaluates our Instruction[].
export function evalRPN(tokens: readonly string[]): number {
  const stack: number[] = [];
  const operators = new Set(['+', '-', '*', '/']);
  for (const token of tokens) {
    if (operators.has(token)) {
      const b = stack.pop() as number;
      const a = stack.pop() as number;
      switch (token) {
        case '+':
          stack.push(a + b);
          break;
        case '-':
          stack.push(a - b);
          break;
        case '*':
          stack.push(a * b);
          break;
        case '/':
          stack.push(Math.trunc(a / b));
          break;
      }
    } else {
      stack.push(Number(token));
    }
  }
  return stack[stack.length - 1];
}

// --- LeetCode 227. Basic Calculator II (Medium) ---
// https://leetcode.com/problems/basic-calculator-ii/
export function calculateBasicII(s: string): number {
  const stack: number[] = [];
  let num = 0;
  let sign = '+';
  const str = s.replace(/\s+/g, '') + '+'; // sentinel flushes the last number
  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    if (c >= '0' && c <= '9') {
      num = num * 10 + Number(c);
      continue;
    }
    if (sign === '+') stack.push(num);
    else if (sign === '-') stack.push(-num);
    else if (sign === '*') stack.push((stack.pop() as number) * num);
    else if (sign === '/') stack.push(Math.trunc((stack.pop() as number) / num));
    sign = c;
    num = 0;
  }
  return stack.reduce((a, b) => a + b, 0);
}

// --- LeetCode 224. Basic Calculator (Hard) ---
// https://leetcode.com/problems/basic-calculator/
export function calculateBasic(s: string): number {
  let result = 0;
  let sign = 1;
  let num = 0;
  const stack: number[] = [];
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c >= '0' && c <= '9') {
      num = num * 10 + Number(c);
    } else if (c === '+') {
      result += sign * num;
      num = 0;
      sign = 1;
    } else if (c === '-') {
      result += sign * num;
      num = 0;
      sign = -1;
    } else if (c === '(') {
      stack.push(result, sign);
      result = 0;
      sign = 1;
    } else if (c === ')') {
      result += sign * num;
      num = 0;
      const prevSign = stack.pop() as number;
      const prevResult = stack.pop() as number;
      result = prevResult + prevSign * result;
    }
  }
  return result + sign * num;
}

// Exercise: Write `countInstructions` which reports how many bytecode
// instructions a raw arithmetic expression compiles to, by running it
// through tokenize -> Parser -> compileToBytecode.
export function countInstructionsStub(_source: string): number {
  throw new Error('not implemented');
}
// Solution:
export function countInstructions(source: string): number {
  const tokens = tokenize(source);
  const ast = new Parser(tokens).parseExpression();
  return compileToBytecode(ast).length;
}

// Exercise: Write `disassemble`, a mini version of `node --print-bytecode`
// (see lesson 03) that renders instructions as readable text lines such as
// "PUSH 3" or "ADD".
export function disassembleStub(_instructions: readonly Instruction[]): string[] {
  throw new Error('not implemented');
}
// Solution:
export function disassemble(instructions: readonly Instruction[]): string[] {
  return instructions.map((instr) => (instr.operand !== undefined ? `${instr.op} ${instr.operand}` : instr.op));
}

// --- run ---
if (require.main === module) {
  const source = '3 + 4 * 2';
  const tokens = tokenize(source);
  console.assert(tokens.length === 6, 'expected 5 real tokens + EOF'); // 3 + 4 * 2 EOF

  const ast = new Parser(tokens).parseExpression();
  console.assert(ast.kind === 'Binary' && ast.operator === '+', 'top-level operator should be + due to precedence');

  const bytecode = compileToBytecode(ast);
  console.assert(runBytecode(bytecode) === 11, '3 + 4 * 2 should evaluate to 11 (precedence respected)');

  const parens = new Parser(tokenize('(3 + 4) * 2')).parseExpression();
  console.assert(runBytecode(compileToBytecode(parens)) === 14, '(3 + 4) * 2 should evaluate to 14');

  const evaluator = new TieredExpressionEvaluator(3);
  console.assert(evaluator.tierOf(source) === 'Ignition (interpreted)', 'unseen source starts in Ignition');
  evaluator.evaluate(source);
  evaluator.evaluate(source);
  console.assert(evaluator.tierOf(source) === 'Ignition (interpreted)', 'still warming up before threshold');
  evaluator.evaluate(source); // 3rd call hits the optimization threshold
  console.assert(evaluator.tierOf(source) === 'TurboFan (optimized)', 'after 3 calls the evaluator should tier up');
  console.assert(evaluator.evaluate(source) === 11, 'TurboFan path must return the same result');

  console.assert(evalRPN(['2', '1', '+', '3', '*']) === 9, 'RPN "2 1 + 3 *" should evaluate to 9');
  console.assert(calculateBasicII('3+2*2') === 7, '"3+2*2" should evaluate to 7');
  console.assert(calculateBasic('(1+(4+5+2)-3)') === 9, '"(1+(4+5+2)-3)" should evaluate to 9');

  console.assert(countInstructions('1 + 2 + 3') === 5, 'three PUSH + two ADD = 5 instructions');
  console.assert(disassemble(bytecode).join(', ') === 'PUSH 3, PUSH 4, PUSH 2, MUL, ADD', 'disassembly should read left-to-right in evaluation order');

  console.log('02-engine-pipeline: all assertions passed');
}
