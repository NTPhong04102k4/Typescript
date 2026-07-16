// Companion code for ./04-discriminated-unions.md

// A binary tree modeled as a discriminated union: every node carries a
// `kind` literal tag that TypeScript narrows on inside a switch/if.
// This tree is "full": every 'node' has exactly two children, which keeps
// the exhaustiveness demo focused on the union mechanics.
export type TreeNode =
  | { readonly kind: 'leaf'; readonly value: number }
  | { readonly kind: 'node'; readonly value: number; readonly left: TreeNode; readonly right: TreeNode };

export function leaf(value: number): TreeNode {
  return { kind: 'leaf', value };
}

export function node(value: number, left: TreeNode, right: TreeNode): TreeNode {
  return { kind: 'node', value, left, right };
}

// Exhaustive switch: assigning the switch's fallthrough value to a `never`
// binding makes the compiler flag any future TreeNode variant left unhandled.
export function sumTree(t: TreeNode): number {
  switch (t.kind) {
    case 'leaf':
      return t.value;
    case 'node':
      return t.value + sumTree(t.left) + sumTree(t.right);
    default: {
      const exhaustiveCheck: never = t;
      return exhaustiveCheck;
    }
  }
}

export function heightOf(t: TreeNode): number {
  switch (t.kind) {
    case 'leaf':
      return 1;
    case 'node':
      return 1 + Math.max(heightOf(t.left), heightOf(t.right));
    default: {
      const exhaustiveCheck: never = t;
      return exhaustiveCheck;
    }
  }
}

export function countLeaves(t: TreeNode): number {
  switch (t.kind) {
    case 'leaf':
      return 1;
    case 'node':
      return countLeaves(t.left) + countLeaves(t.right);
    default: {
      const exhaustiveCheck: never = t;
      return exhaustiveCheck;
    }
  }
}

// A graph vertex's traversal status modeled the same way — exactly the
// state discriminated unions are built for (see 10-graphs, cycle detection
// via white/gray/black coloring).
export type VertexState =
  | { readonly kind: 'unvisited' }
  | { readonly kind: 'visiting'; readonly discoveredAt: number }
  | { readonly kind: 'visited'; readonly discoveredAt: number; readonly finishedAt: number };

export function describeVertex(state: VertexState): string {
  switch (state.kind) {
    case 'unvisited':
      return 'unvisited';
    case 'visiting':
      return `visiting since t=${state.discoveredAt}`;
    case 'visited':
      return `visited [${state.discoveredAt}, ${state.finishedAt}]`;
    default: {
      const exhaustiveCheck: never = state;
      return exhaustiveCheck;
    }
  }
}

// Exercise: implement mirror, producing a new TreeNode with every internal
// node's left/right children swapped (LeetCode 226. Invert Binary Tree).
export function stubMirror(_t: TreeNode): TreeNode {
  throw new Error('not implemented');
}
// Solution:
export function mirror(t: TreeNode): TreeNode {
  switch (t.kind) {
    case 'leaf':
      return t;
    case 'node':
      return node(t.value, mirror(t.right), mirror(t.left));
    default: {
      const exhaustiveCheck: never = t;
      return exhaustiveCheck;
    }
  }
}

// Exercise: write isBalanced, checking whether every node's two subtrees
// differ in height by at most 1.
export function stubIsBalanced(_t: TreeNode): boolean {
  throw new Error('not implemented');
}
// Solution:
export function isBalanced(t: TreeNode): boolean {
  switch (t.kind) {
    case 'leaf':
      return true;
    case 'node':
      return (
        Math.abs(heightOf(t.left) - heightOf(t.right)) <= 1 && isBalanced(t.left) && isBalanced(t.right)
      );
    default: {
      const exhaustiveCheck: never = t;
      return exhaustiveCheck;
    }
  }
}

// --- run ---
if (require.main === module) {
  // Build:
  //         1
  //        / \
  //       2   3
  //      / \
  //     4   5
  const tree: TreeNode = node(1, node(2, leaf(4), leaf(5)), leaf(3));

  console.assert(sumTree(tree) === 15, 'sumTree should total 1+2+3+4+5 = 15');
  console.assert(heightOf(tree) === 3, 'heightOf should be 3 (root -> node 2 -> leaf)');
  console.assert(countLeaves(tree) === 3, 'countLeaves should find leaves 4, 5, 3');
  console.assert(isBalanced(tree) === true, 'this tree should be height-balanced');

  const mirrored = mirror(tree);
  console.assert(sumTree(mirrored) === 15, 'mirror should preserve the total sum');
  console.assert(mirrored.kind === 'node' && mirrored.value === 1, 'mirrored root should stay a node with value 1');
  if (mirrored.kind === 'node') {
    console.assert(
      mirrored.left.kind === 'leaf' && mirrored.left.value === 3,
      "mirrored left child should be the original right leaf (3)"
    );
    console.assert(
      mirrored.right.kind === 'node' && mirrored.right.value === 2,
      'mirrored right child should be the original left subtree (rooted at 2)'
    );
  }

  const unvisited: VertexState = { kind: 'unvisited' };
  const visiting: VertexState = { kind: 'visiting', discoveredAt: 0 };
  const visited: VertexState = { kind: 'visited', discoveredAt: 0, finishedAt: 5 };
  console.assert(describeVertex(unvisited) === 'unvisited', 'unvisited vertex description');
  console.assert(describeVertex(visiting) === 'visiting since t=0', 'visiting vertex description');
  console.assert(describeVertex(visited) === 'visited [0, 5]', 'visited vertex description');

  console.log('04-discriminated-unions: all assertions passed');
}
