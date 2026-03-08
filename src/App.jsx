import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  addEdge,
  useEdgesState,
  useNodesState,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import './App.css';


function ResistorNode({ data }) {
  const rotation = data.rotation ?? 0;

  return (
    <div style={{
      padding: '8px 16px',
      borderRadius: 4,
      border: '1px solid #999',
      background: '#222',
      color: 'white',
      fontSize: 12,
      position: 'relative',
      transform: `rotate(${rotation}deg)`,
      transformOrigin: 'center center',
    }}>
      <Handle type="source" position={Position.Left} id="p1" />
      <span>{data.label ?? 'Resistor'}</span>
      <Handle type="target" position={Position.Right} id="p2" />
    </div>
  );
}


function LedNode({ data }) {
  const rotation = data.rotation ?? 0;

  return (
    <div style={{
      padding: '8px 16px',
      borderRadius: 4,
      border: '1px solid #999',
      background: '#222',
      color: 'white',
      fontSize: 12,
      position: 'relative',
      transform: `rotate(${rotation}deg)`,
      transformOrigin: 'center center',
    }}>
      <Handle type="source" position={Position.Left} id="anode" />
      <span>{data.label ?? 'LED'}</span>
      <Handle type="target" position={Position.Right} id="cathode" />
    </div>
  );
}

function BatteryNode({ data }) {
  const rotation = data.rotation ?? 0;

  return (
    <div style={{
      padding: '8px 12px',
      borderRadius: 4,
      border: '1px solid #999',
      background: '#333',
      color: 'white',
      fontSize: 12,
      position: 'relative',
      transform: `rotate(${rotation}deg)`,
      transformOrigin: 'center center',
    }}>
      <Handle type="source" position={Position.Left} id="neg" />
      <span>{data.label ?? 'Battery'}</span>
      <Handle type="target" position={Position.Right} id="pos" />
    </div>
  );
}

function Dip8Node({ data }) {
  const label = data.label ?? 'DIP-8';
  const rotation = data.rotation ?? 0;

  return (
    <div style={{
      padding: '12px 24px',
      borderRadius: 4,
      border: '1px solid #999',
      background: '#222',
      color: 'white',
      fontSize: 12,
      position: 'relative',
      transform: `rotate(${rotation}deg)`,
      transformOrigin: 'center center',
    }}>
      <div style={{ marginBottom: 4 }}>{label}</div>
      <Handle type="source" position={Position.Left} id="pin1" style={{ top: 16 }} />
      <Handle type="source" position={Position.Left} id="pin2" style={{ top: 28 }} />
      <Handle type="source" position={Position.Left} id="pin3" style={{ top: 40 }} />
      <Handle type="source" position={Position.Left} id="pin4" style={{ top: 52 }} />
      <Handle type="target" position={Position.Right} id="pin5" style={{ top: 16 }} />
      <Handle type="target" position={Position.Right} id="pin6" style={{ top: 28 }} />
      <Handle type="target" position={Position.Right} id="pin7" style={{ top: 40 }} />
      <Handle type="target" position={Position.Right} id="pin8" style={{ top: 52 }} />
    </div>
  );
}

const nodeTypes = {
  resistor: ResistorNode,
  led: LedNode,
  battery: BatteryNode,
  dip8: Dip8Node,
};

const initialNodes = [];

const initialEdges = [];

const STORAGE_KEY = 'breadboard-builder:circuit';

function App() {
  const [selectedComponentId, setSelectedComponentId] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const handleAddResistor = useCallback(() => {
    setNodes((nds) => {
      const count = nds.filter((n) => n.type === 'resistor').length + 1;
      const id = `R${count}`;
      return [
        ...nds,
        {
          id,
          type: 'resistor',
          position: { x: 100, y: 100 + count * 50 },
          data: { label: `${id} (Resistor)`, rotation: 0 },
        },
      ];
    });
  }, [setNodes]);

  const handleAddLed = useCallback(() => {
    setNodes((nds) => {
      const count = nds.filter((n) => n.type === 'led').length + 1;
      const id = `LED${count}`;
      return [
        ...nds,
        {
          id,
          type: 'led',
          position: { x: 350, y: 100 + count * 50 },
          data: { label: id, rotation: 0 },
        },
      ];
    });
  }, [setNodes]);

  const handleAddBattery = useCallback(() => {
    setNodes((nds) => {
      const count = nds.filter((n) => n.type === 'battery').length + 1;
      const id = `BAT${count}`;
      return [
        ...nds,
        {
          id,
          type: 'battery',
          position: { x: -200, y: 100 + count * 60 },
          data: { label: `${id} (Battery)`, rotation: 0 },
        },
      ];
    });
  }, [setNodes]);

  const handleAddDip8 = useCallback(() => {
    setNodes((nds) => {
      const count = nds.filter((n) => n.type === 'dip8').length + 1;
      const id = `IC${count}`;
      return [
        ...nds,
        {
          id,
          type: 'dip8',
          position: { x: 100, y: -150 + count * 80 },
          data: { label: `${id} (DIP-8)`, rotation: 0 },
        },
      ];
    });
  }, [setNodes]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) return;
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed.nodes) && Array.isArray(parsed.edges)) {
        setNodes(parsed.nodes);
        setEdges(parsed.edges);
      }
    } catch (err) {
      // ignore malformed storage
      console.error('Failed to load stored circuit', err);
    }
  }, [setNodes, setEdges]);

  const handleNodeDoubleClick = useCallback(
    (_event, node) => {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === node.id
            ? {
                ...n,
                data: {
                  ...n.data,
                  rotation: ((n.data?.rotation ?? 0) + 90) % 360,
                },
              }
            : n,
        ),
      );
    },
    [setNodes],
  );

  const handleNodeClick = useCallback(
    (_event, node) => {
      setSelectedComponentId(node.id);
    },
    [],
  );

  const handleSaveCircuit = useCallback(() => {
    try {
      const payload = JSON.stringify({ nodes, edges });
      window.localStorage.setItem(STORAGE_KEY, payload);
      setStatusMessage('Circuit saved');
    } catch (err) {
      console.error('Failed to save circuit', err);
      setStatusMessage('Failed to save circuit');
    }
  }, [nodes, edges, setStatusMessage]);

  const handleLoadCircuit = useCallback(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setStatusMessage('No saved circuit found');
        return;
      }
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed.nodes) && Array.isArray(parsed.edges)) {
        setNodes(parsed.nodes);
        setEdges(parsed.edges);
        setStatusMessage('Circuit loaded');
      } else {
        setStatusMessage('Saved circuit is invalid');
      }
    } catch (err) {
      console.error('Failed to load circuit', err);
      setStatusMessage('Failed to load circuit');
    }
  }, [setNodes, setEdges, setStatusMessage]);

  const handleNewCircuit = useCallback(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    setSelectedComponentId(null);
    setStatusMessage('New empty circuit');
  }, [setNodes, setEdges, setStatusMessage]);

  const netlist = buildNetlist(nodes, edges);
  const breadboardLayout = mapNetlistToBreadboard(netlist);

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: 8, background: '#111', color: '#eee', fontSize: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
        <button onClick={handleAddResistor}>Add Resistor</button>
        <button onClick={handleAddLed}>Add LED</button>
        <button onClick={handleAddBattery}>Add Battery</button>
        <button onClick={handleAddDip8}>Add DIP-8 IC</button>
        <div style={{ flex: 1 }} />
        <button onClick={handleNewCircuit}>New</button>
        <button onClick={handleSaveCircuit}>Save</button>
        <button onClick={handleLoadCircuit}>Load</button>
        {statusMessage && (
          <span style={{ marginLeft: 8, fontSize: 11, color: '#aaa' }}>
            {statusMessage}
          </span>
        )}
      </div>

      <div style={{ flex: 1, display: 'flex' }}>
        <div style={{ flex: 2 }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeDoubleClick={handleNodeDoubleClick}
            onNodeClick={handleNodeClick}
            fitView
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>

        <div style={{ flex: 1, borderLeft: '1px solid #333', background: '#181818' }}>
          <BreadboardView layout={breadboardLayout} selectedComponentId={selectedComponentId} />
        </div>
      </div>

      <div style={{ height: 260, overflow: 'auto', background: '#111', color: '#eee', fontSize: 12, padding: 8 }}>
        <strong>Netlist (debug):</strong>
        <pre>{JSON.stringify(netlist, null, 2)}</pre>
        <strong>Breadboard layout (debug):</strong>
        <pre>{JSON.stringify(breadboardLayout, null, 2)}</pre>
      </div>
    </div>
  );
}

function BreadboardView({ layout, selectedComponentId }) {
  const { pinPlacements, placedComponents, nets, errors } = layout;

  const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  const minRow = 1;
  const maxRow = 30;

  const width = 400;
  const height = 260;
  const rowCount = maxRow - minRow + 1;
  const xStep = width / (columns.length + 1);
  const yStep = height / (rowCount + 1);

  const getPosition = (rowNumber, col) => {
    const rowIdx = rowNumber - minRow;
    const y = (rowIdx + 1) * yStep;
    const colIdx = columns.indexOf(col);
    const x = (colIdx + 1.5) * xStep;
    return { x, y };
  };

  const occupied = {};
  placedComponents.forEach((comp) => {
    Object.entries(comp.pins).forEach(([pinName, pos]) => {
      const key = `${pos.row}-${pos.col}`;
      occupied[key] = {
        label: `${comp.id}.${pinName}`,
        compId: comp.id,
      };
    });
  });

  const vccRows = new Set(
    (nets || [])
      .filter((net) => net.kind === 'VCC')
      .map((net) => net.row),
  );

  const gndRows = new Set(
    (nets || [])
      .filter((net) => net.kind === 'GND')
      .map((net) => net.row),
  );

  return (
    <div style={{ width: '100%', height: '100%', padding: 8, boxSizing: 'border-box' }}>
      <div style={{ marginBottom: 4, color: '#eee', fontSize: 12 }}>Breadboard view (simplified)</div>
      <svg width="100%" height="200" viewBox={`0 0 ${width} ${height}`} style={{ background: '#111' }}>
        {/* Center valley */}
        {(() => {
          const sampleRow = minRow;
          const { x: xE } = getPosition(sampleRow, 'E');
          const { x: xF } = getPosition(sampleRow, 'F');
          const valleyX = (xE + xF) / 2;
          const valleyWidth = Math.abs(xF - xE) * 0.6;
          return (
            <rect
              x={valleyX - valleyWidth / 2}
              y={yStep * 0.5}
              width={valleyWidth}
              height={height - yStep}
              fill="#151515"
            />
          );
        })()}

        {Array.from({ length: rowCount }).map((_, rowIdx) => {
          const rowNumber = minRow + rowIdx;
          const { y } = getPosition(rowNumber, columns[0]);

          const isVccRow = vccRows.size > 0 ? vccRows.has(rowNumber) : rowNumber === 1;
          const isGndRow = gndRows.size > 0 ? gndRows.has(rowNumber) : rowNumber === maxRow;

          return (
            <g key={rowNumber}>
              {isVccRow && (
                <rect
                  x={xStep}
                  y={y - yStep * 0.4}
                  width={width - xStep * 2}
                  height={yStep * 0.8}
                  fill="rgba(255, 82, 82, 0.08)"
                />
              )}
              {isGndRow && (
                <rect
                  x={xStep}
                  y={y - yStep * 0.4}
                  width={width - xStep * 2}
                  height={yStep * 0.8}
                  fill="rgba(33, 150, 243, 0.1)"
                />
              )}
              <text
                x={8}
                y={y + 4}
                fill="#666"
                fontSize="8"
              >
                {rowNumber}
              </text>
              {rowNumber === minRow && (
                <text
                  x={width - xStep * 0.5}
                  y={y}
                  fill="#ff5252"
                  fontSize="10"
                  textAnchor="middle"
                >
                  +
                </text>
              )}
              {rowNumber === maxRow && (
                <text
                  x={width - xStep * 0.5}
                  y={y}
                  fill="#2196f3"
                  fontSize="10"
                  textAnchor="middle"
                >
                  -
                </text>
              )}
              {columns.map((col, colIdx) => {
                const { x } = getPosition(rowNumber, col);
                const key = `${rowNumber}-${col}`;
                const entry = occupied[key];
                const label = entry?.label;
                const hasPin = Boolean(entry);
                const isSelected = hasPin && entry.compId === selectedComponentId;

                const isRailRow = isVccRow || isGndRow;

                return (
                  <g key={col}>
                    <circle
                      cx={x}
                      cy={y}
                      r={4}
                      fill={
                        hasPin
                          ? isSelected
                            ? '#ffeb3b'
                            : '#ffb347'
                          : isRailRow
                            ? isVccRow
                              ? '#402020'
                              : '#10263a'
                            : '#333'
                      }
                      stroke={isSelected ? '#ffe082' : isRailRow ? (isVccRow ? '#ff5252' : '#2196f3') : '#555'}
                      strokeWidth={isSelected ? 1.5 : 1}
                    />
                    {hasPin && (
                      <text
                        x={x}
                        y={y - 8}
                        fill="#ccc"
                        fontSize="7"
                        textAnchor="middle"
                      >
                        {label}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* Simple component bodies drawn between their pins */}
        {placedComponents.map((comp) => {
          if (comp.type === 'resistor' || comp.type === 'led' || comp.type === 'battery') {
            const pinNames =
              comp.type === 'resistor'
                ? ['p1', 'p2']
                : comp.type === 'led'
                  ? ['anode', 'cathode']
                  : ['neg', 'pos'];

            const [pinA, pinB] = pinNames.map((name) => comp.pins[name]).filter(Boolean);

            if (!pinA || !pinB) {
              return null;
            }

            const { x: x1, y: y1 } = getPosition(pinA.row, pinA.col);
            const { x: x2, y: y2 } = getPosition(pinB.row, pinB.col);

            const stroke =
              comp.type === 'resistor'
                ? '#f4d35e'
                : comp.type === 'led'
                  ? '#ff6b6b'
                  : '#6bc5ff';

            return (
              <g key={comp.id}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={comp.id === selectedComponentId ? '#ffffff' : stroke}
                  strokeWidth={comp.id === selectedComponentId ? 4 : 3}
                  strokeLinecap="round"
                />
              </g>
            );
          }

          if (comp.type === 'dip8') {
            const pinPositions = Object.values(comp.pins);
            if (pinPositions.length === 0) {
              return null;
            }

            const rows = pinPositions.map((p) => p.row);
            const cols = pinPositions.map((p) => columns.indexOf(p.col));

            const minRowBody = Math.min(...rows);
            const maxRowBody = Math.max(...rows);
            const minColBody = Math.min(...cols);
            const maxColBody = Math.max(...cols);

            const { x: xMin, y: yTop } = getPosition(minRowBody, columns[minColBody]);
            const { x: xMax, y: yBottom } = getPosition(maxRowBody, columns[maxColBody]);

            const widthBody = Math.abs(xMax - xMin) + xStep * 0.6;
            const heightBody = Math.abs(yBottom - yTop) + yStep * 0.6;

            const xBody = Math.min(xMin, xMax) - xStep * 0.3;
            const yBody = Math.min(yTop, yBottom) - yStep * 0.3;

            return (
              <g key={comp.id}>
                <rect
                  x={xBody}
                  y={yBody}
                  width={widthBody}
                  height={heightBody}
                  rx={4}
                  ry={4}
                  fill={comp.id === selectedComponentId ? '#333' : '#222'}
                  stroke={comp.id === selectedComponentId ? '#fff' : '#888'}
                  strokeWidth={comp.id === selectedComponentId ? 2.5 : 2}
                />
              </g>
            );
          }

          return null;
        })}
      </svg>

      {errors && errors.length > 0 && (
        <div style={{ marginTop: 4, color: '#ff8080', fontSize: 11 }}>
          {errors.map((err) => (
            <div key={err}>{err}</div>
          ))}
        </div>
      )}
    </div>
  );
}

function buildNetlist(nodes, edges) {
  const components = nodes.map((node) => {
    let pins;

    if (node.type === 'resistor') {
      pins = ['p1', 'p2'];
    } else if (node.type === 'led') {
      pins = ['anode', 'cathode'];
    } else if (node.type === 'battery') {
      pins = ['neg', 'pos'];
    } else if (node.type === 'dip8') {
      pins = ['pin1', 'pin2', 'pin3', 'pin4', 'pin5', 'pin6', 'pin7', 'pin8'];
    } else {
      pins = [];
    }

    return {
      id: node.id,
      type: node.type,
      pins,
    };
  });

  // Build nets by grouping all pins that are connected through edges (union–find)
  const parent = new Map();
  const allPins = new Set();

  const find = (pin) => {
    if (!parent.has(pin)) {
      parent.set(pin, pin);
    }
    let root = parent.get(pin);
    if (root !== pin) {
      root = find(root);
      parent.set(pin, root);
    }
    return root;
  };

  const union = (a, b) => {
    const rootA = find(a);
    const rootB = find(b);
    if (rootA !== rootB) {
      parent.set(rootB, rootA);
    }
  };

  edges.forEach((edge) => {
    const srcPin = `${edge.source}.${edge.sourceHandle ?? 'p1'}`;
    const tgtPin = `${edge.target}.${edge.targetHandle ?? 'p2'}`;
    allPins.add(srcPin);
    allPins.add(tgtPin);
    union(srcPin, tgtPin);
  });

  const groupsByRoot = new Map();
  allPins.forEach((pin) => {
    const root = find(pin);
    if (!groupsByRoot.has(root)) {
      groupsByRoot.set(root, new Set());
    }
    groupsByRoot.get(root).add(pin);
  });

  const connections = Array.from(groupsByRoot.values()).map((group, index) => ({
    net_id: `Net_${index + 1}`,
    connected_pins: Array.from(group),
  }));

  return { components, connections };
}

function mapNetlistToBreadboard(netlist) {
  const leftColumns = ['A', 'B', 'C', 'D', 'E'];
  const rightColumns = ['F', 'G', 'H', 'I', 'J'];

  // Reserve some rows for power rails (approximate top/bottom rails)
  const railRows = {
    VCC: 3,
    GND: 27,
  };

  let currentRow = 6;
  const pinPlacements = {};
  const errors = [];
  const nets = [];

  const batteryPins = new Set();
  netlist.components.forEach((comp) => {
    if (comp.type === 'battery') {
      comp.pins.forEach((pinName) => {
        batteryPins.add(`${comp.id}.${pinName}`);
      });
    }
  });

  netlist.connections.forEach((net) => {
    const pins = net.connected_pins;
    const hasBatteryPos = pins.some((p) => /\.pos$/.test(p));
    const hasBatteryNeg = pins.some((p) => /\.neg$/.test(p));

    let kind = 'normal';
    let row;

    if (hasBatteryPos && !hasBatteryNeg) {
      kind = 'VCC';
      row = railRows.VCC;
    } else if (hasBatteryNeg && !hasBatteryPos) {
      kind = 'GND';
      row = railRows.GND;
    } else {
      row = currentRow;
      currentRow += 1;
    }

    if (pins.length > leftColumns.length + rightColumns.length) {
      errors.push(
        `Net ${net.net_id} has ${pins.length} pins, but a breadboard row only has ${
          leftColumns.length + rightColumns.length
        } holes.`,
      );
    }

    pins.forEach((pinRef, index) => {
      if (batteryPins.has(pinRef)) {
        return;
      }

      let col = null;
      if (index < leftColumns.length) {
        col = leftColumns[index];
      } else if (index - leftColumns.length < rightColumns.length) {
        col = rightColumns[index - leftColumns.length];
      }

      if (col) {
        pinPlacements[pinRef] = { row, col };
      }
    });

    nets.push({
      net_id: net.net_id,
      row,
      kind,
      pins,
    });
  });

  const placedComponents = netlist.components
    .filter((comp) => comp.type !== 'battery')
    .map((comp) => {
      const pins = {};
      comp.pins.forEach((pinName) => {
        const ref = `${comp.id}.${pinName}`;
        if (pinPlacements[ref]) {
          pins[pinName] = pinPlacements[ref];
        }
      });
      return { id: comp.id, type: comp.type, pins };
    });

  return {
    pinPlacements,
    placedComponents,
    nets,
    errors,
  };
}

export default App;