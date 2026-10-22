import React from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Controls from './components/Controls';
import InputTape from './components/InputTape';
import Stack3D from './components/Stack3D';
import StateDiagram from './components/StateDiagram';
import ExecutionInfo from './components/ExecutionInfo';
import { useExecution } from './hooks/useExecution';

export default function App() {
  const {
    pda,
    inputString,
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
  } = useExecution();

  const handleRunCustom = (customPda, customInput) => {
    loadPda(customPda, customInput);
  };

  const hasHistory = executionHistory.length > 0;
  const hasStarted = !!pda;

  return (
    <div className="app-layout">
      <Header />
      <div className="app-body">
        <Sidebar 
          onLoadExample={loadPda}
          onRunCustom={handleRunCustom}
        />
        
        <main className="main-content">
          <div className="top-panel">
            <InputTape 
              inputString={inputString} 
              currentConfig={currentConfig} 
            />
            <Controls 
              onRun={runExecution}
              onStepForward={stepForward}
              onStepBackward={stepBackward}
              onReset={resetExecution}
              onToggleAutoPlay={toggleAutoPlay}
              isAutoPlaying={isAutoPlaying}
              hasStarted={hasStarted}
              hasHistory={hasHistory}
            />
          </div>

          <div className="visualizations-grid">
            <div className="viz-panel stack-panel">
              <Stack3D stack={currentConfig ? currentConfig.stack : (pda ? [pda.startStackSymbol] : [])} />
            </div>
            
            <div className="viz-panel diagram-panel">
              <StateDiagram pda={pda} currentConfig={currentConfig} />
            </div>
          </div>

          <div className="bottom-panel">
            <ExecutionInfo 
              currentConfig={currentConfig}
              stepIndex={currentStepIndex}
              totalSteps={executionHistory.length}
              result={result}
              hasHistory={hasHistory}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
