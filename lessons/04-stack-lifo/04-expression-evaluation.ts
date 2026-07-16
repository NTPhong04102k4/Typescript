// Companion code for ./04-expression-evaluation.md

import { Stack } from './01-stack-fundamentals';

// LeetCode 150: Evaluate Reverse Polish Notation (Medium)
// Postfix notation is a perfect fit for a stack: push operands, and on an
// operator, pop the two most recent operands, apply it, push the result.
export function evalRPN(tokens: string[]): number {
  const stack = new Stack<number>();
  const operators = new Set(['+', '-', '*', '/']);
  for (const token of tokens) {
    if (operators.has(token)) {
      const b = stack.pop() as number;
      const a = stack.pop() as number;
      let result: number;
      switch (token) {
        case '+':
          result = a + b;
          break;
        case '-':
          result = a - b;
          break;
        case '*':
          result = a * b;
          break;
        case '/':
          result = Math.trunc(a / b);
          break;
        default:
          throw new Error(`Unknown operator: ${token}`);
      }
      stack.push(result);
    } else {
      stack.push(Number(token));
    }
  }
  return stack.pop() as number;
}

// LeetCode 227: Basic Calculator II (Medium)
// No parentheses, but +, -, *, / with normal precedence. Track only the
// current run of digits and the operator that precedes it; commit each
// number to the stack once its operator is known, applying * and / to the
// stack's top immediately (they bind tighter than + and -).
export function calculateII(s: string): number {
  const stack = new Stack<number>();
  let num = 0;
  let sign = '+';
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    const isDigit = ch >= '0' && ch <= '9';
    if (isDigit) {
      num = num * 10 + Number(ch);
    }
    const isLast = i === s.length - 1;
    if ((!isDigit && ch !== ' ') || isLast) {
      if (sign === '+') {
        stack.push(num);
      } else if (sign === '-') {
        stack.push(-num);
      } else if (sign === '*') {
        stack.push((stack.pop() as number) * num);
      } else if (sign === '/') {
        stack.push(Math.trunc((stack.pop() as number) / num));
      }
      sign = ch;
      num = 0;
    }
  }
  return stack.toArray().reduce((sum, value) => sum + value, 0);
}

// LeetCode 224: Basic Calculator (Hard)
// Parentheses plus +, -, and unary sign, no * or /. A running `result` and
// `sign` accumulate the current level; entering '(' pushes both onto the
// stack and resets them, and ')' pops them back to fold the sub-result
// into the enclosing expression.
export function calculateBasic(s: string): number {
  const stack = new Stack<number>();
  let result = 0;
  let number = 0;
  let sign = 1;
  for (const ch of s) {
    if (ch >= '0' && ch <= '9') {
      number = number * 10 + Number(ch);
    } else if (ch === '+') {
      result += sign * number;
      number = 0;
      sign = 1;
    } else if (ch === '-') {
      result += sign * number;
      number = 0;
      sign = -1;
    } else if (ch === '(') {
      stack.push(result);
      stack.push(sign);
      result = 0;
      sign = 1;
    } else if (ch === ')') {
      result += sign * number;
      number = 0;
      const signBeforeParen = stack.pop() as number;
      const resultBeforeParen = stack.pop() as number;
      result = result * signBeforeParen + resultBeforeParen;
      sign = 1;
    }
    // spaces are ignored
  }
  return result + sign * number;
}

// --- run ---
if (require.main === module) {
  console.assert(evalRPN(['2', '1', '+', '3', '*']) === 9, 'evalRPN example 1');
  console.assert(evalRPN(['4', '13', '5', '/', '+']) === 6, 'evalRPN example 2');

  console.assert(calculateII('3+2*2') === 7, 'calculateII example 1');
  console.assert(calculateII(' 3/2 ') === 1, 'calculateII example 2');

  console.assert(
    calculateBasic('(1+(4+5+2)-3)+(6+8)') === 23,
    'calculateBasic nested parentheses example',
  );

  console.log('04-expression-evaluation OK');
}
