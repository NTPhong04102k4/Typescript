// Companion code for ./01-type-vs-interface.md

// The same shape declared two ways: TypeScript is structurally typed, so
// these are interchangeable wherever an object with { x, y } is expected.
export interface PointInterface {
  x: number;
  y: number;
}

export type PointType = {
  x: number;
  y: number;
};

export function distanceFromOrigin(p: PointInterface | PointType): number {
  return Math.sqrt(p.x * p.x + p.y * p.y);
}

// Declaration merging: only `interface` supports being reopened. These two
// blocks merge into a single Config shape { name: string; version: number }.
export interface Config {
  name: string;
}
export interface Config {
  version: number;
}

// A `type` alias cannot be redeclared this way — the following would be a
// compile error if uncommented ("Duplicate identifier 'ConfigType'"):
//
// type ConfigType = { name: string };
// type ConfigType = { version: number };

export function describeConfig(c: Config): string {
  return `${c.name}@${c.version}`;
}

// Unions and primitive aliases: only `type` can express these directly.
// There is no `interface` equivalent of a union or of aliasing a primitive.
export type NodeId = string | number;
export type Direction = 'left' | 'right';

// Interfaces read naturally as multi-extends object/class contracts.
export interface HasLength {
  length: number;
}
export interface HasValue<T> {
  value: T;
}
export interface Sized<T> extends HasLength, HasValue<T> {}

export class Box<T> implements Sized<T> {
  constructor(
    public value: T,
    public length: number
  ) {}
}

// The `type` equivalent of multi-extends is an intersection (`&`).
export type SizedType<T> = HasLength & HasValue<T>;

// Exercise: model a comparator that is either a real comparator function or
// the string literal 'default', then write a function that resolves it to
// a concrete comparator function.
export type Comparator<T> = ((a: T, b: T) => number) | 'default';
// Solution:
export function resolveComparator<T>(
  cmp: Comparator<T>,
  defaultCmp: (a: T, b: T) => number
): (a: T, b: T) => number {
  return cmp === 'default' ? defaultCmp : cmp;
}

// Exercise: write a function that only type-checks if the two `Config`
// interface declarations above actually merged (it must read both fields).
// Solution: see describeConfig above — it reads c.name and c.version, which
// only compiles because declaration merging combined both blocks.

// --- run ---
if (require.main === module) {
  const pI: PointInterface = { x: 3, y: 4 };
  const pT: PointType = { x: 3, y: 4 };
  console.assert(distanceFromOrigin(pI) === 5, 'distance from (3,4) should be 5');
  console.assert(distanceFromOrigin(pT) === 5, 'interface and type shapes should be interchangeable');

  const cfg: Config = { name: 'dsa', version: 1 };
  console.assert(describeConfig(cfg) === 'dsa@1', 'merged interface should expose both name and version');

  const box = new Box<number>(42, 1);
  console.assert(box.value === 42 && box.length === 1, 'Box<T> should satisfy Sized<T> via HasLength & HasValue<T>');

  const sizedViaIntersection: SizedType<string> = { value: 'hi', length: 2 };
  console.assert(sizedViaIntersection.value === 'hi', 'intersection type should behave like the merged interface');

  const numCmp: Comparator<number> = (a, b) => a - b;
  const resolvedCustom = resolveComparator<number>(numCmp, (a, b) => a - b);
  console.assert(resolvedCustom(5, 2) === 3, 'a custom comparator should be returned unchanged');

  const resolvedDefault = resolveComparator<number>('default', (a, b) => b - a);
  console.assert(resolvedDefault(5, 2) === -3, "'default' should defer to the supplied defaultCmp");

  console.log('01-type-vs-interface: all assertions passed');
}
