## Sum to n — three simple approaches

Input: `n` (integer). Output: `1 + 2 + ... + n`. For `n <= 0`, return `0`. We assume the result stays below `Number.MAX_SAFE_INTEGER`.

### A) Plain loop
- Idea: add numbers from 1 up to n.
- Complexity: O(n) time, O(1) space.
- Note: clear and simple way

### B) Recursive
- Idea: `sum_to_n(n) = n + sum_to_n(n - 1)` with a base case at 0 (or 1).
- Complexity: O(n) time, O(n) space due to the call stack.
- Note: i think it's same like Approach A but with recursive approach; avoid for very large n because of stack limits.

### C) Gauss Summation
- Idea: use the formulation `n * (n + 1) / 2`.
- Complexity: O(1) time, O(1) space.
- Note: we need to know about "Gauss Summation" to know this approach
- Reference: https://letstalkscience.ca/educational-resources/backgrounders/gauss-summation

### Notes
- Prefer the Gauss Summation (Approach C). It’s fastest but need formulation

### How to run / test (Browser)
- Open `src/problem1/index.html` in a browser.
- Enter a value for each approach and click "Calculate" to see results.
