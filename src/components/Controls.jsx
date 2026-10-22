import React from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, FastForward } from 'lucide-react';

export default function Controls({ 
  onRun, 
  onStepForward, 
  onStepBackward, 
  onReset, 
  onToggleAutoPlay,
  isAutoPlaying,
  hasStarted,
  hasHistory
}) {
  return (
    <div className="controls-panel">
      {!hasHistory ? (
        <button className="btn-primary large" onClick={onRun} disabled={!hasStarted}>
          <FastForward size={20} />
          Compute Execution Path
        </button>
      ) : (
        <div className="playback-controls">
          <button className="icon-btn" onClick={onReset} title="Reset">
            <RotateCcw size={20} />
          </button>
          
          <button className="icon-btn" onClick={onStepBackward} title="Step Backward">
            <SkipBack size={20} />
          </button>
          
          <button className="icon-btn primary-circle" onClick={onToggleAutoPlay} title={isAutoPlaying ? "Pause" : "Auto Play"}>
            {isAutoPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          
          <button className="icon-btn" onClick={onStepForward} title="Step Forward">
            <SkipForward size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
