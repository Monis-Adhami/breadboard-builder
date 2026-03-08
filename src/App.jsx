import React, { useCallback } from 'react';
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

const initialNodes = [
  {
    id: 'R1',
    type: 'resistor',
    position: { x: 0, y: 0 },
    data: { label: 'R1 (Resistor)', rotation: 0 },
  },
  {
    id: 'LED1',
    type: 'led',
    position: { x: 250, y: 0 },
    data: { label: 'LED1', rotation: 0 },
  },
];

const initialEdges = [
  // This will connect R1.p2 → LED1.anode
  { id: 'e1-2', source: 'R1', sourceHandle: 'p2', target: 'LED1', targetHandle: 'anode' },
];

function App() {
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

  const netlist = buildNetlist(nodes, edges);
  const breadboardLayout = mapNetlistToBreadboard(netlist);

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: 8, background: '#111', color: '#eee', fontSize: 12 }}>
        <button onClick={handleAddResistor}>Add Resistor</button>
        <button onClick={handleAddLed} style={{ marginLeft: 8 }}>Add LED</button>
        <button onClick={handleAddBattery} style={{ marginLeft: 8 }}>Add Battery</button>
        <button onClick={handleAddDip8} style={{ marginLeft: 8 }}>Add DIP-8 IC</button>
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
            fitView
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>

        <div style={{ flex: 1, borderLeft: '1px solid #333', background: '#181818' }}>
          <BreadboardView layout={breadboardLayout} />
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

function BreadboardView({ layout }) {
  const { pinPlacements, placedComponents, nets, errors } = layout;

  const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  const usedRows = new Set(
    Object.values(pinPlacements || {}).map((pos) => pos.row),
  );

  const sortedRows = Array.from(usedRows).sort((a, b) => a - b);

  if (sortedRows.length === 0) {
    return (
      <div style={{ padding: 12, color: '#ccc', fontSize: 12 }}>
        No pins placed on breadboard yet. Connect components in the schematic to see placements.
      </div>
    );
  }

  const minRow = sortedRows[0] - 1;
  const maxRow = sortedRows[sortedRows.length - 1] + 1;

  const width = 400;
  const height = 260;
  const rowCount = maxRow - minRow + 1;
  const xStep = width / (columns.length + 1);
  const yStep = height / (rowCount + 1);

  const occupied = {};
  placedComponents.forEach((comp) => {
    Object.entries(comp.pins).forEach(([pinName, pos]) => {
      const key = `${pos.row}-${pos.col}`;
      occupied[key] = `${comp.id}.${pinName}`;
    });
  });

  return (
    <div style={{ width: '100%', height: '100%', padding: 8, boxSizing: 'border-box' }}>
      <div style={{ marginBottom: 4, color: '#eee', fontSize: 12 }}>Breadboard view (simplified)</div>
      <svg width="100%" height="200" viewBox={`0 0 ${width} ${height}`} style={{ background: '#111' }}>
        {Array.from({ length: rowCount }).map((_, rowIdx) => {
          const rowNumber = minRow + rowIdx;
          const y = (rowIdx + 1) * yStep;

          return (
            <g key={rowNumber}>
              <text
                x={8}
                y={y + 4}
                fill="#666"
                fontSize="8"
              >
                {rowNumber}
              </text>
              {columns.map((col, colIdx) => {
                const x = (colIdx + 1.5) * xStep;
                const key = `${rowNumber}-${col}`;
                const label = occupied[key];
                const hasPin = Boolean(label);

                return (
                  <g key={col}>
                    <circle
                      cx={x}
                      cy={y}
                      r={4}
                      fill={hasPin ? '#ffb347' : '#333'}
                      stroke="#555"
                      strokeWidth={1}
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

  let currentRow = 5;
  const pinPlacements = {};
  const errors = [];
   const nets = [];

  netlist.connections.forEach((net) => {
    const row = currentRow;
    currentRow += 1;

    const pins = net.connected_pins;
    if (pins.length > leftColumns.length + rightColumns.length) {
      errors.push(
        `Net ${net.net_id} has ${pins.length} pins, but a breadboard row only has ${
          leftColumns.length + rightColumns.length
        } holes.`,
      );
    }

    pins.forEach((pinRef, index) => {
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
      pins,
    });
  });

  const placedComponents = netlist.components.map((comp) => {
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