export const pdaExamples = [
  {
    id: "anbn",
    name: "a^n b^n",
    description: "Accepts strings with n 'a's followed by n 'b's (n >= 0).",
    definition: {
      states: ["q0", "q1", "q2", "q3"],
      alphabet: ["a", "b"],
      stackAlphabet: ["Z0", "A"],
      startState: "q0",
      startStackSymbol: "Z0",
      acceptStates: ["q3"],
      transitions: [
        { from: "q0", input: "", pop: "", push: "", to: "q1" },
        { from: "q1", input: "a", pop: "", push: "A", to: "q1" },
        { from: "q1", input: "b", pop: "A", push: "", to: "q2" },
        { from: "q2", input: "b", pop: "A", push: "", to: "q2" },
        { from: "q2", input: "", pop: "Z0", push: "", to: "q3" },
        { from: "q1", input: "", pop: "Z0", push: "", to: "q3" } // Empty string edge case
      ]
    },
    sampleInput: "aabb"
  },
  {
    id: "palindrome",
    name: "Palindrome (Even & Odd)",
    description: "Accepts palindromes over {a,b} (both even and odd length).",
    definition: {
      states: ["q0", "q1", "q2"],
      alphabet: ["a", "b"],
      stackAlphabet: ["Z0", "A", "B"],
      startState: "q0",
      startStackSymbol: "Z0",
      acceptStates: ["q2"],
      transitions: [
        { from: "q0", input: "a", pop: "", push: "A", to: "q0" },
        { from: "q0", input: "b", pop: "", push: "B", to: "q0" },
        { from: "q0", input: "", pop: "", push: "", to: "q1" }, // Non-deterministic guess for middle (even)
        { from: "q0", input: "a", pop: "", push: "", to: "q1" }, // Middle symbol for odd palindrome
        { from: "q0", input: "b", pop: "", push: "", to: "q1" }, // Middle symbol for odd palindrome
        { from: "q1", input: "a", pop: "A", push: "", to: "q1" },
        { from: "q1", input: "b", pop: "B", push: "", to: "q1" },
        { from: "q1", input: "", pop: "Z0", push: "", to: "q2" }
      ]
    },
    sampleInput: "ababa"
  },
  {
    id: "balanced_parens",
    name: "Balanced Parentheses",
    description: "Accepts strings with properly nested parentheses.",
    definition: {
      states: ["q0", "q1"],
      alphabet: ["(", ")"],
      stackAlphabet: ["Z0", "X"],
      startState: "q0",
      startStackSymbol: "Z0",
      acceptStates: ["q1"],
      transitions: [
        { from: "q0", input: "(", pop: "", push: "X", to: "q0" },
        { from: "q0", input: ")", pop: "X", push: "", to: "q0" },
        { from: "q0", input: "", pop: "Z0", push: "", to: "q1" }
      ]
    },
    sampleInput: "(()())"
  },
  {
    id: "wcwr",
    name: "wcw^R",
    description: "Accepts wcw^R where w is drawn from {a, b}*.",
    definition: {
      states: ["q0", "q1", "q2"],
      alphabet: ["a", "b", "c"],
      stackAlphabet: ["Z0", "A", "B"],
      startState: "q0",
      startStackSymbol: "Z0",
      acceptStates: ["q2"],
      transitions: [
        { from: "q0", input: "a", pop: "", push: "A", to: "q0" },
        { from: "q0", input: "b", pop: "", push: "B", to: "q0" },
        { from: "q0", input: "c", pop: "", push: "", to: "q1" }, // Separator
        { from: "q1", input: "a", pop: "A", push: "", to: "q1" },
        { from: "q1", input: "b", pop: "B", push: "", to: "q1" },
        { from: "q1", input: "", pop: "Z0", push: "", to: "q2" }
      ]
    },
    sampleInput: "abcba"
  },
  {
    id: "equal_ab",
    name: "Equal a's and b's",
    description: "Accepts strings with an equal number of 'a's and 'b's.",
    definition: {
      states: ["q0", "q1"],
      alphabet: ["a", "b"],
      stackAlphabet: ["Z0", "A", "B"],
      startState: "q0",
      startStackSymbol: "Z0",
      acceptStates: ["q1"],
      transitions: [
        { from: "q0", input: "a", pop: "Z0", push: "AZ0", to: "q0" },
        { from: "q0", input: "a", pop: "A", push: "AA", to: "q0" },
        { from: "q0", input: "a", pop: "B", push: "", to: "q0" },
        { from: "q0", input: "b", pop: "Z0", push: "BZ0", to: "q0" },
        { from: "q0", input: "b", pop: "B", push: "BB", to: "q0" },
        { from: "q0", input: "b", pop: "A", push: "", to: "q0" },
        { from: "q0", input: "", pop: "Z0", push: "", to: "q1" }
      ]
    },
    sampleInput: "ababba"
  },
  {
    id: "an_b2n",
    name: "a^n b^2n",
    description: "Accepts strings with 'n' a's followed by '2n' b's.",
    definition: {
      states: ["q0", "q1", "q2", "q3"],
      alphabet: ["a", "b"],
      stackAlphabet: ["Z0", "A"],
      startState: "q0",
      startStackSymbol: "Z0",
      acceptStates: ["q3"],
      transitions: [
        { from: "q0", input: "", pop: "", push: "", to: "q1" },
        { from: "q1", input: "a", pop: "", push: "AA", to: "q1" }, 
        { from: "q1", input: "b", pop: "A", push: "", to: "q2" }, 
        { from: "q2", input: "b", pop: "A", push: "", to: "q2" }, 
        { from: "q1", input: "", pop: "Z0", push: "", to: "q3" },
        { from: "q2", input: "", pop: "Z0", push: "", to: "q3" }
      ]
    },
    sampleInput: "aabbbb"
  },
  {
    id: "balanced_brackets",
    name: "Multiple Balanced Brackets",
    description: "Accepts strings with properly nested (), [], and {}.",
    definition: {
      states: ["q0", "q1"],
      alphabet: ["(", ")", "[", "]", "{", "}"],
      stackAlphabet: ["Z0", "R", "S", "C"],
      startState: "q0",
      startStackSymbol: "Z0",
      acceptStates: ["q1"],
      transitions: [
        { from: "q0", input: "(", pop: "", push: "R", to: "q0" },
        { from: "q0", input: ")", pop: "R", push: "", to: "q0" },
        { from: "q0", input: "[", pop: "", push: "S", to: "q0" },
        { from: "q0", input: "]", pop: "S", push: "", to: "q0" },
        { from: "q0", input: "{", pop: "", push: "C", to: "q0" },
        { from: "q0", input: "}", pop: "C", push: "", to: "q0" },
        { from: "q0", input: "", pop: "Z0", push: "", to: "q1" }
      ]
    },
    sampleInput: "{[()()]}"
  }
];
