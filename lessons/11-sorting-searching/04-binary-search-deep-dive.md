# Binary Search Deep Dive & Search-Space Reduction

**Objective:** Master binary search's invariant-based narrowing of `[low, high]`, then generalize it to "search on the answer" over any monotonic predicate, not just sorted arrays.

## Concept

Binary search maintains an invariant: the answer, if it exists, is
always within `[low, high]`. Each step halves that range by inspecting
the midpoint. Trace searching for `9` in `[1, 3, 5, 7, 9, 11, 13]`:

```
index:   0  1  2  3  4   5   6
value:   1  3  5  7  9  11  13

low=0, high=6, mid=3 -> arr[3]=7 < 9  -> low = mid+1 = 4
                        [1,3,5,7 | 9,11,13]   search space: indices 4..6

low=4, high=6, mid=5 -> arr[5]=11 > 9 -> high = mid-1 = 4
                        [9 | 11,13]           search space: index 4..4

low=4, high=4, mid=4 -> arr[4]=9 == 9 -> found at index 4
```

**Search-space reduction** generalizes the same idea: instead of a
sorted array, you have a monotonic *predicate* over a range of
candidate answers — false for every value below some threshold, true
for every value at or above it — and you binary search for that
threshold directly. Finding `isqrt(27)` (largest `x` with `x*x <= 27`)
over the range `[0, 27]`:

```
low=0,  high=27, mid=13 -> 169 <= 27? no  -> high = 12
low=0,  high=12, mid=6  -> 36  <= 27? no  -> high = 5
low=0,  high=5,  mid=2  -> 4   <= 27? yes -> answer=2, low = 3
low=3,  high=5,  mid=4  -> 16  <= 27? yes -> answer=4, low = 5
low=5,  high=5,  mid=5  -> 25  <= 27? yes -> answer=5, low = 6
low=6 > high=5 -> stop

Result: isqrt(27) = 5   (floor(sqrt(27)) = 5.19... -> 5)
```

No array is involved at all — the "search space" is the integer range
`[0, 27]` and the predicate `x*x <= n` plays the role of `arr[mid] <= target`.

## Complexity

| Operation                                | Time       | Space |
|-------------------------------------------|------------|-------|
| Classic binary search (`binarySearch`)    | O(log n)   | O(1) iterative |
| Recursive binary search                   | O(log n)   | O(log n) stack |
| `lowerBound` / `upperBound`               | O(log n)   | O(1)  |
| Search in rotated sorted array            | O(log n)   | O(1)  |
| Search space reduction (`binarySearchOnAnswer`, `isqrt`) | O(log(range)) per call to the predicate | O(1) |

## Walkthrough

`04-binary-search-deep-dive.ts` builds up from the array case to the
general pattern:

- `binarySearch(arr, target)` is the classic iterative version from the
  trace above, using `low + Math.floor((high - low) / 2)` to avoid
  overflow-style mid-calculation bugs.
- `lowerBound(arr, target)` and `upperBound(arr, target)` find the first
  index `>= target` and the first index `> target` respectively, using a
  half-open `[low, high)` range — the building blocks for range queries
  on arrays with duplicates.
- `binarySearchOnAnswer(low, high, predicate)` is the generalized
  pattern: given a predicate that is `false` then `true` across
  `[low, high]`, it returns the smallest value where the predicate holds.
- `binarySearchRecursive` is the first exercise solution: the same
  narrowing logic expressed recursively instead of with a `while` loop.
- `isqrt(n)` is the second exercise solution: it adapts the narrowing
  logic to find the *largest* value satisfying a predicate (by moving
  `low` up on success instead of shrinking toward the first true value),
  matching the search-space-reduction trace above.
- `search` solves LeetCode 704 directly with `binarySearch`.
- `searchRange` solves LeetCode 34 using `lowerBound`/`upperBound` to
  find both boundaries of the target's range.
- `searchRotated` solves LeetCode 33 by checking which half of `[low,
  high]` is sorted at each step and deciding which half the target could
  be in.
- `guessNumber` solves LeetCode 374 by expressing it as
  `binarySearchOnAnswer(1, n, mid => guess(mid) !== 1)` — the smallest
  `mid` where the guess API says "not too low" is exactly the pick,
  directly reusing the general pattern.

## LeetCode practice

- 704. Binary Search (Easy)
- 34. Find First and Last Position of Element in Sorted Array (Medium)
- 33. Search in Rotated Sorted Array (Medium)
- 374. Guess Number Higher or Lower (Easy)

## Key takeaways

- Binary search's invariant is "the answer is in `[low, high]`" — every
  step must preserve that invariant, which is why `low = mid + 1` and
  `high = mid - 1` (not `mid`) are used once `arr[mid]` is ruled out.
- `lowerBound`/`upperBound` on a half-open range are the cleanest way to
  handle duplicates and answer "first/last occurrence" questions.
- Binary search doesn't require a sorted array, only a **monotonic
  predicate** over the search space — this is the "search on the answer"
  pattern used throughout interview problems (capacity/speed/distance
  minimization problems all reduce to this).
- A rotated sorted array is still binary-searchable because at least one
  half of any subrange is guaranteed to be properly sorted.
- Recursive binary search is O(log n) time like the iterative version,
  but costs O(log n) stack space instead of O(1).

Companion code: [`04-binary-search-deep-dive.ts`](./04-binary-search-deep-dive.ts)
