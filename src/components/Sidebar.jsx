import React, { useState, useEffect } from 'react';
import { pdaExamples } from '../data/examples';

export default function Sidebar({ onLoadExample, onRunCustom }) {
  const [selectedExample, setSelectedExample] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [customPdaJson, setCustomPdaJson] = useState('');

  // Auto-load first example on mount
  useEffect(() => {
    if (pdaExamples.length > 0) {
      loadExample(pdaExamples[0].id);
    }
  }, []);

  const loadExample = (id) => {
    setSelectedExample(id);
    const example = pdaExamples.find(ex => ex.id === id);
    if (example) {
      setCustomInput(example.sampleInput);
      setCustomPdaJson(JSON.stringify(example.definition, null, 2));
      onLoadExample(example.definition, example.sampleInput);
    }
  };

  const handleExampleChange = (e) => {
    loadExample(e.target.value);
  };

  const handleRunCustom = () => {
    try {
      const parsedPda = JSON.parse(customPdaJson);
      onRunCustom(parsedPda, customInput);
    } catch (err) {
      alert("Invalid JSON for PDA Definition");
    }
  };

  return (
    <aside className="sidebar">
      <h2>Configuration</h2>
      
      <div className="form-group">
        <label>Load Example</label>
        <select value={selectedExample} onChange={handleExampleChange}>
          <option value="" disabled>Select an example</option>
          {pdaExamples.map(ex => (
            <option key={ex.id} value={ex.id}>{ex.name}</option>
          ))}
        </select>
        {selectedExample && (
          <div className="example-desc">
            {pdaExamples.find(e => e.id === selectedExample)?.description}
          </div>
        )}
      </div>

      <div className="form-group">
        <label>Input String</label>
        <input 
          type="text" 
          value={customInput} 
          onChange={(e) => setCustomInput(e.target.value)}
          placeholder="Enter input string to test"
        />
      </div>

      <div className="form-group">
        <label>PDA Definition (JSON)</label>
        <textarea 
          value={customPdaJson}
          onChange={(e) => setCustomPdaJson(e.target.value)}
          rows={15}
          disabled={!!selectedExample}
        />
        {selectedExample && (
          <div className="text-hint">Clear selection to edit JSON</div>
        )}
        <button className="clear-btn" onClick={() => {
          setSelectedExample('');
          setCustomPdaJson('{\n  "states": [],\n  "alphabet": [],\n  "stackAlphabet": [],\n  "startState": "",\n  "startStackSymbol": "",\n  "acceptStates": [],\n  "transitions": []\n}');
        }}>Custom PDA</button>
      </div>

      <button className="btn-primary" onClick={handleRunCustom}>
        Load & Initialize
      </button>
    </aside>
  );
}
