import LogicFlow from "@logicflow/core/types/LogicFlow";
import { ActiveNodes, EdgeType, TreeNode } from "./types";

// 序列化节点数据
function saveTreeToLocalStorage(treeData: { lf?: LogicFlow; treeNode: TreeNode[]; }) {
  const nodesArray = flattenTree(treeData.treeNode); // 将树结构展平为节点数组
  const edgesArray = getEdgesFromTree(treeData.treeNode); // 从树结构中提取边的信息

  // 序列化节点和边
  const serializedNodes = JSON.stringify(nodesArray);
  const serializedEdges = JSON.stringify(edgesArray);

  // 保存到 localStorage
  localStorage.setItem('nodes', serializedNodes);
  localStorage.setItem('edges', serializedEdges);
}

// 从树结构中提取边的信息
function getEdgesFromTree(treeNodes: TreeNode[], parent?: TreeNode): any[] {
  return treeNodes.reduce((edges:EdgeType[], node) => {
    if (parent) {
      edges.push({ sourceNodeId: node.id, targetNodeId: parent.id, type: "bezier" });
    }
    node.children.forEach((child: TreeNode) => {
      edges = edges.concat(getEdgesFromTree([child], node));
    });
    return edges;
  }, []);
}

// 将树结构展平为节点数组，便于存储转换重现
function flattenTree(treeNodes: any[]) {
  return treeNodes.reduce((acc, node) => {
    const { id, type, x, y } = node;
    acc.push({ id, type, x, y }); // 保留需要的属性
    return acc.concat(flattenTree(node.children));
  }, []);
}


// 反序列化节点数据
function restoreNodesFromLocalStorage() {
  // 从 localStorage 中读取保存的数据
  const serializedNodes = localStorage.getItem('nodes');
  // 检查 localStorage 中是否有保存的数据
  if (serializedNodes === null) {
    // 如果没有数据，可以选择返回空数组或者抛出错误
    return []; 
  }
  // 反序列化节点
  const nodes = JSON.parse(serializedNodes);

  return nodes;
}

// 反序列化边数据
function restoreEdgesFromLocalStorage(): EdgeType[] {
  // 从 localStorage 中读取保存的数据
  const serializedEdges = localStorage.getItem('edges');
  // 检查 localStorage 中是否有保存的数据
  if (serializedEdges === null) {
    // 如果没有数据，可以选择返回空数组或者抛出错误
    return []; 
  }
  // 反序列化边
  const edges = JSON.parse(serializedEdges);

  return edges;
}

// 从 localStorage 恢复并渲染逻辑流图
function restoreFromLocalStorage() {
  const nodes = restoreNodesFromLocalStorage();
  const edges = restoreEdgesFromLocalStorage()
  return {nodes, edges}
}

// 从本地存储中恢复数据，并将其转换为ActiveNodes类型
function restoreActiveNodesData(): ActiveNodes {
  const rawData = restoreFromLocalStorage() || { nodes: [], edges: [] };
  const nodes = rawData.nodes.map((node: any) => {
    return {
      ...node,
      clicked: false,
      active: false,
      timer: null,
      processedInCurrentRound: false,
    };
  });
  return nodes.reduce((acc: { [x: string]: any; }, node: { id: string | number; }) => {
    acc[node.id] = node;
    return acc;
  }, {} as ActiveNodes);
}

// 清空localstorage
function clearLocalstorage(){
  localStorage.clear();
}

export {
  saveTreeToLocalStorage,
  restoreFromLocalStorage,
  restoreActiveNodesData,
  clearLocalstorage
}