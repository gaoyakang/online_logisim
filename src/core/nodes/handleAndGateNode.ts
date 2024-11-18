import LogicFlow from "@logicflow/core/types/LogicFlow";
import { BaseNodeModel } from "@logicflow/core/types/model/node";
import { updateNodeById } from "./updateNodeById";
import { Ref } from "vue";
import { ActiveNodes } from "./types";

// 处理AndGate类型节点
const handleAndGateNode = (lf: LogicFlow, node: BaseNodeModel, activeNodes: Ref<ActiveNodes>) => {
    // 获取当前节点的所有锚点
    const anchors = lf.getNodeModelById(node.id).getDefaultAnchor();
    
    // 定义锚点 ID
    const topAnchorId = anchors[0].id; // 假设第一个锚点是顶部锚点
    const bottomAnchorId = anchors[1].id; // 假设第二个锚点是底部锚点
  
    // 初始化变量来存储前一个节点的 active 状态
    let firstAnchorActive = false;
    let secondAnchorActive = false;
  
    // 由于与门只有两个输入点，一旦找到两个输入点的状态后，后续的遍历就不再需要
    let foundAnchors = 0; // 计数器
  
    // 遍历所有边，找到与当前节点锚点相连的边
    lf.graphModel.edges.forEach(edge => {
      // 因为andgate的锚点名称都一样，所以要区分正在处理哪个andgate节点的锚点
      if(edge.targetNodeId === node.id){
        // 与门左上锚点
        if (edge.targetAnchorId === topAnchorId && foundAnchors < 2) {
          // 根据边的 sourceNodeId 找到前一个节点的 active 状态
          const sourceNodeId = edge.sourceNodeId;
          const sourceNodeActiveState = activeNodes.value[sourceNodeId];
          if (sourceNodeActiveState) { // 检查 sourceNodeActiveState 是否存在
            firstAnchorActive = sourceNodeActiveState.active;
            foundAnchors++; // 找到一个锚点，计数器加一
          }
  
          // 与门左下锚点
        } else if (edge.targetAnchorId === bottomAnchorId && foundAnchors < 2) {
          // 根据边的 sourceNodeId 找到前一个节点的 active 状态
          const sourceNodeId = edge.sourceNodeId;
          const sourceNodeActiveState = activeNodes.value[sourceNodeId];
          if (sourceNodeActiveState) { // 检查 sourceNodeActiveState 是否存在
            secondAnchorActive = sourceNodeActiveState.active;
            foundAnchors++; // 找到一个锚点，计数器加一
          }
        }
        // 如果已经找到两个锚点，停止遍历
        if (foundAnchors >= 2) {
          return; // 结束遍历
        }
      }
    });
  
    // 判断两个输入节点的 active 状态
    const andGateActive = firstAnchorActive && secondAnchorActive;
    // 更新当前节点的 active 状态
    activeNodes.value[node.id] = {
      clicked: false,
      type: 'AndGate',
      active: andGateActive
    };
    // 更新 LogicFlow 中的节点属性
    updateNodeById(lf,node.id,andGateActive)

    return activeNodes;
  };

  export { handleAndGateNode }