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

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
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
  );
}

export default App;