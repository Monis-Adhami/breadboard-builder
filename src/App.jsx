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
  return (
    <div style={{
      padding: '8px 16px',
      borderRadius: 4,
      border: '1px solid #999',
      background: '#222',
      color: 'white',
      fontSize: 12,
      position: 'relative',
    }}>
      <Handle type="source" position={Position.Left} id="p1" />
      <span>{data.label ?? 'Resistor'}</span>
      <Handle type="target" position={Position.Right} id="p2" />
    </div>
  );
}


function LedNode({ data }) {
  return (
    <div style={{
      padding: '8px 16px',
      borderRadius: 4,
      border: '1px solid #999',
      background: '#222',
      color: 'white',
      fontSize: 12,
      position: 'relative',
    }}>
      <Handle type="source" position={Position.Left} id="anode" />
      <span>{data.label ?? 'LED'}</span>
      <Handle type="target" position={Position.Right} id="cathode" />
    </div>
  );
}

const nodeTypes = {
  resistor: ResistorNode,
  led: LedNode,
};

const initialNodes = [
  {
    id: 'R1',
    type: 'resistor',
    position: { x: 0, y: 0 },
    data: { label: 'R1 (Resistor)' },
  },
  {
    id: 'LED1',
    type: 'led',
    position: { x: 250, y: 0 },
    data: { label: 'LED1' },
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
          data: { label: `${id} (Resistor)` },
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
          data: { label: id },
        },
      ];
    });
  }, [setNodes]);

  const netlist = buildNetlist(nodes, edges);

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: 8, background: '#111', color: '#eee', fontSize: 12 }}>
        <button onClick={handleAddResistor}>Add Resistor</button>
        <button onClick={handleAddLed} style={{ marginLeft: 8 }}>Add LED</button>
      </div>

      <div style={{ flex: 1 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>

      <div style={{ height: 200, overflow: 'auto', background: '#111', color: '#eee', fontSize: 12, padding: 8 }}>
        <strong>Netlist (debug):</strong>
        <pre>{JSON.stringify(netlist, null, 2)}</pre>
      </div>
    </div>
  );
}

function buildNetlist(nodes, edges) {
  // 1) Components list
  const components = nodes.map((node) => {
    let pins;

    if (node.type === 'resistor') {
      pins = ['p1', 'p2'];
    } else if (node.type === 'led') {
      pins = ['anode', 'cathode'];
    } else {
      pins = [];
    }

    return {
      id: node.id,
      type: node.type,
      pins,
    };
  });

  // 2) Very simple connections: each edge becomes its own net
  const connections = edges.map((edge, index) => {
    const netId = `Net_${index + 1}`;

    const srcPin = `${edge.source}.${edge.sourceHandle ?? 'p1'}`;
    const tgtPin = `${edge.target}.${edge.targetHandle ?? 'p2'}`;

    return {
      net_id: netId,
      connected_pins: [srcPin, tgtPin],
    };
  });

  return { components, connections };
}

export default App;