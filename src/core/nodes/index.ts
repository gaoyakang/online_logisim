import LogicFlow from "@logicflow/core";
import { ref } from "vue";
import { sortNodes } from "./sortNodes";
import { handleInputNode } from "./handleInputNode";
import { handleOutputNode } from "./handleOutputNode";
import { handleAndGateNode } from "./handleAndGateNode";
import { handleOrGateNode } from "./handleOrGateNode";
import { handleNotGateNode } from "./handleNotGateNode";
import { handleXorGateNode } from "./handleXorGateNode";
import { handleClockNode } from "./handleClockNode";

// 需要点亮的节点和边的id合集类型
type Timeout = /*unresolved*/ any
export type ActiveNodes = {
  // clicked是input节点要表明是否被点击了
  // active是所有节点维护的代表当前节点导通，即输出为1
  [id: string]: { clicked: boolean, type: string, active: boolean, timer?:Timeout };
}
export let activeNodes = ref<ActiveNodes>({});//需要点亮的节点和边的id合集


// 根据节点类型处理节点
const handleNodeBasedOnType = (lf: LogicFlow, node: any, clickId:string) => {
  switch (node.type) {
    case 'Input':
      activeNodes = handleInputNode(lf, node.id, clickId, activeNodes);
      break;
    case 'Output':
      activeNodes = handleOutputNode(lf, node.id, activeNodes);
      break;
    case 'AndGate':
      activeNodes = handleAndGateNode(lf, node, activeNodes);
      break;
    case 'OrGate':
        activeNodes = handleOrGateNode(lf, node, activeNodes);
      break;
    case 'NotGate':
        activeNodes = handleNotGateNode(lf, node, activeNodes, clickId);
      break;
    case 'XorGate':
        activeNodes = handleXorGateNode(lf, node, activeNodes);
      break;
    case 'Clock':
        activeNodes = handleClockNode(lf, node,activeNodes);
      break;
    default:
      console.log('未处理的节点类型');
  }
};

// 处理节点点击
export const handleNodeClick = (lf: LogicFlow, clickId: string, isInitialProcessing:boolean = false) => {

  // 对树结构进行节点排序
  const { sortedKey, sortedNodesData } = sortNodes(lf)

  // issue#1 : https://github.com/gaoyakang/online_logisim/issues/1
  // 如果是初次处理，先处理clock节点
  if (isInitialProcessing) {
    sortedNodesData[Number(sortedKey[0])].forEach(nodeId => {
      const node = lf.graphModel.getNodeModelById(nodeId);
      if (node.type === 'Clock') {
        // 处理clock节点
        handleNodeBasedOnType(lf, node, clickId);
      }
    });
  }

  // 处理其他节点
  sortedKey.forEach(item => {
    sortedNodesData[Number(item)].forEach(nodeId => {
      const node = lf.graphModel.getNodeModelById(nodeId);
      if (node.type !== 'Clock' || isInitialProcessing) {
        handleNodeBasedOnType(lf, node, clickId);
      }
    });
  });

  return lf;
};

// 监听节点点击
const onNodeClick = (lf: LogicFlow) => {
  lf.on('node:click', (node) => {
    const { id, type, properties } = node.data;
    // 是否是仿真状态下点击
    if(properties.status === 'simulation'){
      // 被点击的节点是否是输入节点
      if(type === "Input"){
        // debugger
        handleNodeClick(lf,id);
      }
    }
  })
  return lf;
}

export { onNodeClick }