// Companion code for ./02-dynamic-programming-primer.md

/**
 * Top-down memoization: same recurrence as lesson 01's fibonacciRecursive,
 * but every result is cached in a Map before returning, so each n is
 * computed once instead of exponentially many times.
 */
export function fibonacciMemo(n: number, memo: Map<number, number> = new Map()): number {
  if (n <= 1) return n;
  const cached = memo.get(n);
  if (cached !== undefined) return cached;
  const result = fibonacciMemo(n - 1, memo) + fibonacciMemo(n - 2, memo);
  memo.set(n, result);
  return result;
}

// LeetCode 70: Climbing Stairs -- bottom-up tabulation.
// dp[i] = number of distinct ways to reach step i = dp[i-1] + dp[i-2].
export function climbingStairs(n: number): number {
  if (n <= 2) return n;
  const dp: number[] = new Array(n + 1).fill(0);
  dp[1] = 1;
  dp[2] = 2;
  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}

// LeetCode 322: Coin Change -- bottom-up tabulation.
// dp[a] = fewest coins to make amount a, relaxed over every coin.
export function coinChange(coins: number[], amount: number): number {
  const dp: number[] = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++) {
    for (const coin of coins) {
      if (coin <= a && dp[a - coin] + 1 < dp[a]) {
        dp[a] = dp[a - coin] + 1;
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}

// Exercise: implement lengthOfLIS(nums) -- dp[i] is the length of the
// longest increasing subsequence ending exactly at index i.
// Solution:
export function lengthOfLIS(nums: number[]): number {
  if (nums.length === 0) return 0;
  const dp: number[] = new Array(nums.length).fill(1);
  let longest = 1;
  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
    longest = Math.max(longest, dp[i]);
  }
  return longest;
}

// Exercise: implement rob(nums) (LeetCode 198, House Robber) -- you can't
// rob two adjacent houses; maximize total loot. The recurrence only looks
// back two steps, so it collapses to two rolling variables instead of an
// array.
// Solution:
export function rob(nums: number[]): number {
  let prevBest = 0; // best total using houses up to two back
  let currBest = 0; // best total using houses up to the previous one
  for (const amount of nums) {
    const next = Math.max(currBest, prevBest + amount);
    prevBest = currBest;
    currBest = next;
  }
  return currBest;
}

// --- run ---
if (require.main === module) {
  console.assert(fibonacciMemo(10) === 55, 'fibonacciMemo(10) should be 55');
  console.assert(fibonacciMemo(0) === 0, 'fibonacciMemo(0) should be 0');

  console.assert(climbingStairs(2) === 2, 'climbingStairs(2) should be 2');
  console.assert(climbingStairs(5) === 8, 'climbingStairs(5) should be 8');

  console.assert(coinChange([1, 2, 5], 11) === 3, 'coinChange([1,2,5], 11) should be 3 (5+5+1)');
  console.assert(coinChange([2], 3) === -1, 'coinChange([2], 3) should be -1 (unreachable)');

  console.assert(
    lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18]) === 4,
    'lengthOfLIS should find a subsequence of length 4 (e.g. [2,3,7,18])'
  );

  console.assert(rob([1, 2, 3, 1]) === 4, 'rob([1,2,3,1]) should be 4 (houses at index 0 and 2)');
  console.assert(rob([2, 7, 9, 3, 1]) === 12, 'rob([2,7,9,3,1]) should be 12 (houses at index 0,2,4)');

  console.log('02-dynamic-programming-primer: all assertions passed');
}
