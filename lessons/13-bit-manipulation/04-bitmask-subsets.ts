// Companion code for ./04-bitmask-subsets.md

/**
 * Enumerates every subset of `items` by treating an integer mask in
 * 0 .. 2^n - 1 as a membership flag: bit `i` set means `items[i]` is included.
 * Returns the subsets in mask order (empty set first).
 */
export function allSubsets<T>(items: readonly T[]): T[][] {
  const n = items.length;
  const total = 1 << n; // 2^n masks
  const result: T[][] = [];
  for (let mask = 0; mask < total; mask++) {
    const subset: T[] = [];
    for (let i = 0; i < n; i++) {
      if ((mask >> i) & 1) subset.push(items[i]);
    }
    result.push(subset);
  }
  return result;
}

/**
 * Iterates every non-empty submask of `mask` in descending order using the
 * classic `sub = (sub - 1) & mask` recurrence, returning them as a list.
 */
export function submasks(mask: number): number[] {
  const result: number[] = [];
  for (let sub = mask; sub > 0; sub = (sub - 1) & mask) {
    result.push(sub);
  }
  return result;
}

/** Adds element `i` to a set represented as an integer bitmask. */
export function addToSet(set: number, i: number): number {
  return set | (1 << i);
}

/** True when element `i` is a member of the set bitmask. */
export function inSet(set: number, i: number): boolean {
  return ((set >> i) & 1) === 1;
}

// Exercise: given a set bitmask, return the sorted list of element indices it
// contains (its "expanded" form).
export function setToIndicesStub(_set: number): number[] {
  throw new Error('not implemented');
}
// Solution:
export function setToIndices(set: number): number[] {
  const indices: number[] = [];
  for (let i = 0; (set >> i) !== 0; i++) {
    if ((set >> i) & 1) indices.push(i);
  }
  return indices;
}

// --- run ---
if (require.main === module) {
  const subsets = allSubsets(['a', 'b', 'c']);
  console.assert(subsets.length === 8, '3 items produce 2^3 = 8 subsets');
  console.assert(JSON.stringify(subsets[0]) === JSON.stringify([]), 'mask 0 is the empty set');
  console.assert(JSON.stringify(subsets[1]) === JSON.stringify(['a']), 'mask 001 = {a}');
  console.assert(JSON.stringify(subsets[5]) === JSON.stringify(['a', 'c']), 'mask 101 = {a, c}');
  console.assert(JSON.stringify(subsets[7]) === JSON.stringify(['a', 'b', 'c']), 'mask 111 = full set');

  console.assert(
    JSON.stringify(submasks(0b101)) === JSON.stringify([0b101, 0b100, 0b001]),
    'submasks of 101 are 101, 100, 001 in descending order'
  );

  let set = 0;
  set = addToSet(set, 2);
  set = addToSet(set, 0);
  console.assert(set === 0b101, 'adding elements 2 and 0 gives bitmask 101');
  console.assert(inSet(set, 0) && inSet(set, 2) && !inSet(set, 1), 'membership matches the mask');
  console.assert(JSON.stringify(setToIndices(set)) === JSON.stringify([0, 2]), 'expanded set is [0, 2]');

  console.log('04-bitmask-subsets: all assertions passed');
}
