import React, { useEffect, useRef } from 'react';

export default function StateDiagram({ pda, currentConfig }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!pda) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Make canvas responsive to parent container size
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      
      const dpr = window.devicePixelRatio || 1;
      const rect = parent.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      
      ctx.scale(dpr, dpr);
      drawMap(rect.width, rect.height);
    };

    const drawMap = (width, height) => {
      ctx.clearRect(0, 0, width, height);

      const states = pda.states || [];
      const layoutMarginX = 60;
      const layoutMarginY = 120; // Extra margin top/bottom for tall text stacks
      const boundsWidth = Math.max(10, width - layoutMarginX * 2);
      const boundsHeight = Math.max(10, height - layoutMarginY * 2);
      
      // Radius should be smaller to fit long vertical lines comfortably
      const radiusX = boundsWidth / 2;
      const radiusY = Math.min(boundsHeight / 2, boundsWidth / 2); 
      
      const centerX = width / 2;
      const centerY = height / 2;
      
      const nodeRadius = 25;
      const positions = {};
      
      states.forEach((state, i) => {
        // If 2 states, draw them horizontally instead of vertically to give more text room
        let angle;
        if (states.length === 1) {
            angle = -Math.PI / 2;
        } else if (states.length === 2) {
            angle = i === 0 ? Math.PI : 0;
        } else {
            angle = (Math.PI * 2 * i) / states.length - Math.PI / 2;
        }
        
        positions[state] = {
          x: centerX + Math.cos(angle) * Math.max(radiusX, 0),
          y: centerY + Math.sin(angle) * Math.max(radiusY, 0)
        };
      });

      ctx.lineWidth = 2;
      ctx.font = '12px Inter, sans-serif';
      
      // Group transitions by from/to pairs
      const groupedTransitions = {};
      pda.transitions.forEach(t => {
        const key = `${t.from}->${t.to}`;
        if (!groupedTransitions[key]) {
          groupedTransitions[key] = { from: t.from, to: t.to, edges: [] };
        }
        groupedTransitions[key].edges.push(t);
      });

      Object.values(groupedTransitions).forEach(group => {
        const fromPos = positions[group.from];
        const toPos = positions[group.to];
        if (!fromPos || !toPos) return;

        const labels = group.edges.map(t => `${t.input || 'ε'},${t.pop || 'ε'}→${t.push || 'ε'}`);
        const isActiveGroup = group.edges.some(t => currentConfig && currentConfig.transition === t);

        ctx.strokeStyle = isActiveGroup ? '#10b981' : '#475569';
        ctx.fillStyle = isActiveGroup ? '#10b981' : '#94a3b8';

        if (group.from === group.to) {
          // Self-loop
          const loopR = 25;
          const dx = fromPos.x - centerX;
          const dy = fromPos.y - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          
          let dirX = dx / dist;
          let dirY = dy / dist;
          if (dist < 5) { dirX = 0; dirY = -1; }

          const cx = fromPos.x + dirX * (nodeRadius + loopR - 5);
          const cy = fromPos.y + dirY * (nodeRadius + loopR - 5);

          ctx.beginPath();
          ctx.arc(cx, cy, loopR, 0, Math.PI * 2);
          ctx.stroke();

          // Arrow along the circle
          const arrowAngle = Math.atan2(fromPos.y - cy, fromPos.x - cx);
          const arrowX = cx + Math.cos(arrowAngle - 0.4) * loopR;
          const arrowY = cy + Math.sin(arrowAngle - 0.4) * loopR;
          
          ctx.beginPath();
          const headlen = 8;
          ctx.moveTo(arrowX, arrowY);
          ctx.lineTo(arrowX - headlen * Math.cos(arrowAngle - 0.4 - Math.PI / 6), arrowY - headlen * Math.sin(arrowAngle - 0.4 - Math.PI / 6));
          ctx.lineTo(arrowX - headlen * Math.cos(arrowAngle - 0.4 + Math.PI / 6), arrowY - headlen * Math.sin(arrowAngle - 0.4 + Math.PI / 6));
          ctx.fill();

          // Labels
          const tx = cx + dirX * (loopR + 10);
          const ty = cy + dirY * (loopR + 10);

          ctx.textAlign = dirX > 0.5 ? 'left' : (dirX < -0.5 ? 'right' : 'center');
          ctx.textBaseline = dirY > 0.5 ? 'top' : (dirY < -0.5 ? 'bottom' : 'middle');

          const lineHeight = 14;
          const startYOffset = -((labels.length - 1) * lineHeight) / 2;
          
          ctx.fillStyle = '#cbd5e1';
          labels.forEach((lbl, idx) => {
            ctx.fillText(lbl, tx, ty + startYOffset + idx * lineHeight);
          });
        } else {
          // Normal edge
          const dx = toPos.x - fromPos.x;
          const dy = toPos.y - fromPos.y;
          const angle = Math.atan2(dy, dx);
          
          const isBidirectional = groupedTransitions[`${group.to}->${group.from}`];
          const curveOffset = isBidirectional ? 30 : 0;
          
          const startX = fromPos.x + Math.cos(angle) * nodeRadius;
          const startY = fromPos.y + Math.sin(angle) * nodeRadius;
          const endX = toPos.x - Math.cos(angle) * nodeRadius;
          const endY = toPos.y - Math.sin(angle) * nodeRadius;
          
          ctx.beginPath();
          let midX = (startX + endX) / 2;
          let midY = (startY + endY) / 2;

          if (curveOffset === 0) {
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
          } else {
            midX -= Math.sin(angle) * curveOffset;
            midY += Math.cos(angle) * curveOffset;
            ctx.moveTo(startX, startY);
            ctx.quadraticCurveTo(midX, midY, endX, endY);
          }
          ctx.stroke();
          
          // Labels
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          const lineHeight = 14;
          const startYOffset = -((labels.length - 1) * lineHeight) / 2;
          ctx.fillStyle = '#cbd5e1'; 
          labels.forEach((lbl, idx) => {
            ctx.fillText(lbl, midX, midY - 6 + startYOffset + idx * lineHeight);
          });
          ctx.fillStyle = isActiveGroup ? '#10b981' : '#94a3b8'; // reset fill

          const headlen = 8;
          let endAngle = angle;
          if (curveOffset !== 0) {
              endAngle = Math.atan2(endY - midY, endX - midX);
          }
          
          ctx.beginPath();
          ctx.moveTo(endX, endY);
          ctx.lineTo(endX - headlen * Math.cos(endAngle - Math.PI / 6), endY - headlen * Math.sin(endAngle - Math.PI / 6));
          ctx.lineTo(endX - headlen * Math.cos(endAngle + Math.PI / 6), endY - headlen * Math.sin(endAngle + Math.PI / 6));
          ctx.fill();
        }
      });

      states.forEach(state => {
        const pos = positions[state];
        const isStart = state === pda.startState;
        const isAccept = pda.acceptStates.includes(state);
        const isActiveState = currentConfig && currentConfig.state === state;
        
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, nodeRadius, 0, 2 * Math.PI);
        ctx.fillStyle = isActiveState ? '#3b82f6' : '#1e293b';
        ctx.fill();
        
        ctx.lineWidth = isActiveState ? 3 : 2;
        ctx.strokeStyle = isActiveState ? '#60a5fa' : '#64748b';
        ctx.stroke();

        if (isAccept) {
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, nodeRadius - 5, 0, 2 * Math.PI);
          ctx.stroke();
        }

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 13px Inter, sans-serif';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillText(state, pos.x, pos.y);
        
        if (isStart) {
          ctx.font = '10px Inter, sans-serif';
          ctx.fillStyle = '#94a3b8';
          
          let alignX, textDir;
          // Position start arrow smartly based on node position relative to center
          if (pos.x < centerX - 10) {
              alignX = pos.x - nodeRadius;
              textDir = 'right';
          } else {
              alignX = pos.x + nodeRadius;
              textDir = 'left';
          }

          ctx.textAlign = textDir;
          ctx.textBaseline = 'middle';
          
          if (textDir === 'right') {
             ctx.fillText('start', alignX - 15, pos.y);
             ctx.beginPath();
             ctx.moveTo(alignX, pos.y);
             ctx.lineTo(alignX - 10, pos.y - 5);
             ctx.lineTo(alignX - 10, pos.y + 5);
             ctx.fill();
          } else {
             ctx.fillText('start', alignX + 15, pos.y);
             ctx.beginPath();
             ctx.moveTo(alignX, pos.y);
             ctx.lineTo(alignX + 10, pos.y - 5);
             ctx.lineTo(alignX + 10, pos.y + 5);
             ctx.fill();
          }
        }
      });
    };

    // Initial draw
    resizeCanvas();

    // Listen to resize
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);

  }, [pda, currentConfig]);

  return (
    <div className="state-diagram-container">
      <h3>State Diagram</h3>
      <div className="canvas-wrapper" style={{ flexGrow: 1, position: 'relative' }}>
        <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0 }} />
      </div>
    </div>
  );
}
