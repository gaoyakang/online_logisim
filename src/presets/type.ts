export interface PresetGraph {
  name: string;
  nodes: Array<{
    id: string;
    type: string;
    x: number;
    y: number;
    [prop: string]: any;
  }>;
  edges: Array<{
    id: string;
    type: string;
    sourceNodeId: string;
    targetNodeId: string;
    [prop: string]: any;
  }>;
}
