import { useState, useEffect, useCallback, useRef } from 'react';
import { simulatePDA } from '../engine/pdaEngine';

export function useExecution() {
  const [pda, setPda] = useState(null);
  const [inputString, setInputString] = useState('');
  const [executionHistory, setExecutionHistory] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [result, setResult] = useState(null); // 'accepted' | 'rejected' | null
  
  const autoPlayRef = useRef(null);

  const loadPda = useCallback((pdaDef, sampleInput) => {
    setPda(pdaDef);
    setInputString(sampleInput);
    setExecutionHistory([]);
    setCurrentStepIndex(0);
    setResult(null);
    setIsAutoPlaying(false);
  }, []);

  const runExecution = useCallback(() => {
    if (!pda) return;
    const { accepted, path } = simulatePDA(pda, inputString);
    setExecutionHistory(path);
    setCurrentStepIndex(0);
    setResult(accepted ? 'accepted' : 'rejected');
    setIsAutoPlaying(false);
  }, [pda, inputString]);

  const stepForward = useCallback(() => {
    setCurrentStepIndex((prev) => 
      prev < executionHistory.length - 1 ? prev + 1 : prev
    );
  }, [executionHistory]);

  const stepBackward = useCallback(() => {
    setCurrentStepIndex((prev) => (prev > 0 ? prev - 1 : 0));
  }, []);

  const resetExecution = useCallback(() => {
    setExecutionHistory([]);
    setCurrentStepIndex(0);
    setResult(null);
    setIsAutoPlaying(false);
  }, []);

  const toggleAutoPlay = useCallback(() => {
    setIsAutoPlaying(prev => !prev);
  }, []);

  useEffect(() => {
    if (isAutoPlaying) {
      if (currentStepIndex >= executionHistory.length - 1) {
        setIsAutoPlaying(false);
        return;
      }
      autoPlayRef.current = setTimeout(() => {
        stepForward();
      }, 800); // 800ms per step
    } else {
      clearTimeout(autoPlayRef.current);
    }
    return () => clearTimeout(autoPlayRef.current);
  }, [isAutoPlaying, currentStepIndex, executionHistory.length, stepForward]);

  const currentConfig = executionHistory[currentStepIndex] || null;

  return {
    pda,
    inputString,
    setInputString,
    loadPda,
    runExecution,
    stepForward,
    stepBackward,
    resetExecution,
    toggleAutoPlay,
    isAutoPlaying,
    executionHistory,
    currentStepIndex,
    currentConfig,
    result
  };
}
