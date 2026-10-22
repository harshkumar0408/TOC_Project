export function simulatePDA(pda, inputString) {
  const startConfig = {
    state: pda.startState,
    unreadInput: inputString,
    stack: [pda.startStackSymbol],
    history: [],
  };

  startConfig.history = [
    {
      state: pda.startState,
      unreadInput: inputString,
      stack: [...startConfig.stack],
    },
  ];

  const queue = [startConfig];
  const maxSteps = 10000;
  let steps = 0;

  let longestRejectPath = startConfig;

  // Track visited configurations to prevent infinite epsilon loops.
  // configKey = state + unreadInput + stack content
  const visited = new Set();

  while (queue.length > 0 && steps < maxSteps) {
    const current = queue.shift();
    steps++;

    const configKey = `${current.state}|${current.unreadInput}|${current.stack.join(",")}`;
    if (visited.has(configKey)) continue;
    visited.add(configKey);

    // Track the deepest path we explored in case we reject
    if (current.history.length > longestRejectPath.history.length) {
      longestRejectPath = current;
    }

    // Check acceptance
    if (
      current.unreadInput === "" &&
      pda.acceptStates.includes(current.state)
    ) {
      return { accepted: true, path: current.history };
    }

    // Find valid transitions from this configuration
    const validTransitions = pda.transitions.filter((t) => {
      if (t.from !== current.state) return false;

      const inputMatches =
        t.input === "" ||
        (current.unreadInput.length > 0 && t.input === current.unreadInput[0]);

      // Top of stack is the last element
      const currentTop =
        current.stack.length > 0
          ? current.stack[current.stack.length - 1]
          : null;
      const stackMatches = t.pop === "" || t.pop === currentTop;

      return inputMatches && stackMatches;
    });

    for (let t of validTransitions) {
      let nextUnread = current.unreadInput;
      if (t.input !== "") {
        nextUnread = nextUnread.substring(1); // Consume character
      }

      let nextStack = [...current.stack];
      if (t.pop !== "" && nextStack.length > 0) {
        nextStack.pop(); // Remove top symbol
      }

      if (t.push !== "") {
        let remainingPush = t.push;
        let symbolsToPush = [];
        // Sort stack alphabet by length descending to match longest symbols first (e.g. "Z0" before "Z")
        const sortedAlphabet = [...pda.stackAlphabet].sort((a, b) => b.length - a.length);

        while (remainingPush.length > 0) {
          let matched = false;
          for (const symbol of sortedAlphabet) {
            if (remainingPush.startsWith(symbol)) {
              symbolsToPush.push(symbol);
              remainingPush = remainingPush.substring(symbol.length);
              matched = true;
              break;
            }
          }
          // Fallback if symbol isn't in stackAlphabet
          if (!matched) {
            symbolsToPush.push(remainingPush[0]);
            remainingPush = remainingPush.substring(1);
          }
        }

        // Push in reverse order, so first symbol ends up on top
        for (let i = symbolsToPush.length - 1; i >= 0; i--) {
          nextStack.push(symbolsToPush[i]);
        }
      }

      const nextConfig = {
        state: t.to,
        unreadInput: nextUnread,
        stack: nextStack,
        history: [
          ...current.history,
          {
            state: t.to,
            unreadInput: nextUnread,
            stack: [...nextStack],
            transition: t, // Include transition for UI reference later
          },
        ],
      };

      queue.push(nextConfig);
    }
  }

  // Finished BFS without finding an accepting configuration
  return { accepted: false, path: longestRejectPath.history };
}
