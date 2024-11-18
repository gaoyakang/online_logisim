import { Ref, ref } from "vue";
import { sortNodes } from "./sortNodes";
import { handleInputNode } from "./handleInputNode";
import { handleOutputNode } from "./handleOutputNode";
import { handleAndGateNode } from "./handleAndGateNode";
import { handleOrGateNode } from "./handleOrGateNode";
import { handleNotGateNode } from "./handleNotGateNode";
import { handleXorGateNode } from "./handleXorGateNode";
import { handleClockNode } from "./handleClockNode";
import LogicFlow from "@logicflow/core/types/LogicFlow";
import { ActiveNodes } from "./types";

export let activeNodes: Ref<ActiveNodes> = ref<ActiveNodes>({})

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
  // 0 : ['5', '4', '3', '1']
  // 1 : ['4', '3', '1']

  // issue#1 : https://github.com/gaoyakang/online_logisim/issues/1
  // 如果是初次处理，先处理clock节点
  if (isInitialProcessing) {
    for(let i=0;i<sortedKey.length;i++){
      sortedNodesData[i][Number(sortedKey[i][0])].forEach((nodeId: string) => {
        const node = lf.graphModel.getNodeModelById(nodeId);
        if (node.type === 'Clock') {
          // 处理clock节点
          handleNodeBasedOnType(lf, node, clickId);
        }
      });
    }
  }

  // 处理其他节点
  for(let i=0;i<sortedKey.length;i++){
    for(let j=0;j<sortedKey[i].length;j++){
      sortedNodesData[i][Number(sortedKey[i][j])].forEach((nodeId: string) => {
        const node = lf.graphModel.getNodeModelById(nodeId);
        if (node.type !== 'Clock' || isInitialProcessing) {
          handleNodeBasedOnType(lf, node, clickId);
        }
      });
    }
  }

  // issue#2 : https://github.com/gaoyakang/online_logisim/issues/2
  // 在每次点击事件开始时重置所有节点的processedInCurrentRound标志
  // 这样下次节点点击来时不会被影响到更新
  Object.keys(activeNodes.value).forEach((id) => {
    activeNodes.value[id].processedInCurrentRound = false;
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