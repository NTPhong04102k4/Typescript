// Companion code for ./05-enums-literal-types.md

// A string enum: TypeScript emits a real runtime object, so `TrafficLight`
// exists at runtime and its values are inspectable (TrafficLight.Red === 'RED').
export enum TrafficLight {
  Red = 'RED',
  Yellow = 'YELLOW',
  Green = 'GREEN',
}

export function nextEnumState(state: TrafficLight): TrafficLight {
  switch (state) {
    case TrafficLight.Red:
      return TrafficLight.Green;
    case TrafficLight.Green:
      return TrafficLight.Yellow;
    case TrafficLight.Yellow:
      return TrafficLight.Red;
    default: {
      const exhaustiveCheck: never = state;
      return exhaustiveCheck;
    }
  }
}

// The literal-type-union alternative: zero runtime footprint (erased by the
// compiler), same exhaustiveness checking, and it composes naturally with
// discriminated unions (see lesson 04).
export type Signal = 'red' | 'yellow' | 'green';

export function nextSignal(state: Signal): Signal {
  switch (state) {
    case 'red':
      return 'green';
    case 'green':
      return 'yellow';
    case 'yellow':
      return 'red';
    default: {
      const exhaustiveCheck: never = state;
      return exhaustiveCheck;
    }
  }
}

// A small parser state machine: literal-typed states/events driven by an
// explicit transition table. This pattern generalizes to the stack-based
// expression evaluators covered in 04-stack.
export type ParserState = 'start' | 'inNumber' | 'inOperator' | 'error';
export type ParserEvent = 'digit' | 'operator' | 'space';

const parserTransitions: Record<ParserState, Partial<Record<ParserEvent, ParserState>>> = {
  start: { digit: 'inNumber', operator: 'error', space: 'start' },
  inNumber: { digit: 'inNumber', operator: 'inOperator', space: 'start' },
  inOperator: { digit: 'inNumber', operator: 'error', space: 'error' },
  error: {},
};

export function stepParser(state: ParserState, event: ParserEvent): ParserState {
  return parserTransitions[state][event] ?? 'error';
}

// Exercise: report whether a ParserState cannot make further progress
// (in this simplified machine, only 'error' is terminal-and-stuck).
export function stubIsFinal(_state: ParserState): boolean {
  throw new Error('not implemented');
}
// Solution:
export function isFinal(state: ParserState): boolean {
  return state === 'error';
}

// Exercise: drive stepParser across a whole event stream, folding it into
// the final ParserState.
export function stubRunParser(_events: readonly ParserEvent[]): ParserState {
  throw new Error('not implemented');
}
// Solution:
export function runParser(events: readonly ParserEvent[]): ParserState {
  let state: ParserState = 'start';
  for (const event of events) {
    state = stepParser(state, event);
  }
  return state;
}

// --- run ---
if (require.main === module) {
  console.assert(nextEnumState(TrafficLight.Red) === TrafficLight.Green, 'enum: red -> green');
  console.assert(nextEnumState(TrafficLight.Green) === TrafficLight.Yellow, 'enum: green -> yellow');
  console.assert(nextEnumState(TrafficLight.Yellow) === TrafficLight.Red, 'enum: yellow -> red');

  console.assert(nextSignal('red') === 'green', 'literal: red -> green');
  console.assert(nextSignal('green') === 'yellow', 'literal: green -> yellow');
  console.assert(nextSignal('yellow') === 'red', 'literal: yellow -> red');

  // Tokenized "12+3": digit, digit, operator, digit.
  const wellFormed: ParserEvent[] = ['digit', 'digit', 'operator', 'digit'];
  console.assert(runParser(wellFormed) === 'inNumber', 'well-formed "12+3" should end in inNumber');
  console.assert(isFinal(runParser(wellFormed)) === false, 'inNumber is not a stuck/final state');

  // Tokenized "+3": operator with no leading number is invalid.
  const malformed: ParserEvent[] = ['operator', 'digit'];
  console.assert(runParser(malformed) === 'error', 'a leading operator should push the machine into error');
  console.assert(isFinal(runParser(malformed)) === true, 'error should be reported as final/stuck');

  console.log('05-enums-literal-types: all assertions passed');
}
