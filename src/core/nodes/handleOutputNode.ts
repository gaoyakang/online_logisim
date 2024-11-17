import LogicFlow from "@logicflow/core";
import { Ref } from "vue";
import { ActiveNodes } from ".";
import { updateNodeById } from "./updateNodeById";


// 处理Output类型节点
const handleOutputNode = (lf: LogicFlow, nodeId: string, activeNodes: Ref<ActiveNodes>) => {
    // 1.获得output节点的id
    // 2.获得output节点的前一个节点的id
    // 3.获得前一节点的active状态
    // 如果前一节点的active状态为true则需要点亮该output节点，否则不做处理
  
    // 遍历所有边，找到与当前Output节点相连的边
    lf.graphModel.edges.forEach(edge => {
      if (edge.targetNodeId === nodeId) {
            // 获得前一节点的active状态
            const previousNodeActiveState = activeNodes.value[edge.sourceNodeId];
            // 如果前一节点的active状态为true则需要点亮该output节点，否则不做处理
            if (previousNodeActiveState && previousNodeActiveState.active) {
              updateNodeById(lf,nodeId,true)
              // 将当前节点存到全局数组中
              activeNodes.value[nodeId] = { clicked:false, type:'Output', active:true };
            } else {
              updateNodeById(lf,nodeId,false)
              // 将当前节点存到全局数组中
              activeNodes.value[nodeId] = { clicked:false, type:'Output', active:false };

            }
          }
    })

    return activeNodes;
  };

  export { handleOutputNode }