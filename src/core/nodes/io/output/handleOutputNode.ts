import { Ref } from "vue";
import LogicFlow from "@logicflow/core/types/LogicFlow";
import { ActiveNodes } from "../../types";
import { updateNodeById } from "../../util/updateNodeById";
import { BaseEdgeModel } from "@logicflow/core/types/model/edge/BaseEdgeModel";


// 处理Output类型节点
const handleOutputNode = (lf: LogicFlow, nodeId: string, activeNodes: Ref<ActiveNodes>) => {
    // 1.获得output节点的id
    // 2.获得output节点的前一个节点的id
    // 3.获得前一节点的active状态
    // 如果前一节点的active状态为true则需要点亮该output节点，否则不做处理
  
    // 遍历所有边，找到与当前Output节点相连的边
    lf.graphModel.edges.forEach(edge => {
      if (edge.targetNodeId === nodeId) {
            // 判断上一节点是否为单输出
            const nodeType = activeNodes.value[edge.sourceNodeId].type;
            if(nodeType === 'RsFlipFlop'){
              // 判断当前节点连接的是哪个输出锚点
              if(edge.sourceAnchorId === 'rsFlipFlop-righttop-output'){
                activeNodes = getOutputActive(lf,nodeId,edge,activeNodes)
              }else{
                activeNodes = getOutputNotActive(lf,nodeId,edge,activeNodes)
              }
            } else if (nodeType === 'DFlipFlop'){
                // 判断当前节点连接的是哪个输出锚点
                if(edge.sourceAnchorId === 'dFlipFlop-righttop-output'){
                  activeNodes = getOutputActive(lf,nodeId,edge,activeNodes)
                }else{
                  activeNodes = getOutputNotActive(lf,nodeId,edge,activeNodes)
                }
            }else {
              activeNodes = getOutputActive(lf,nodeId,edge,activeNodes)
            }             
          }
    })

    return activeNodes;
  };

  export { handleOutputNode }

  const getOutputActive = (lf:LogicFlow, nodeId:string, edge:BaseEdgeModel, activeNodes:Ref<ActiveNodes>,updateNode:boolean = true) => {
    // 获得前一节点的active状态
    const previousNodeActiveState = activeNodes.value[edge.sourceNodeId];
    // 如果前一节点的active状态为true则需要点亮该output节点，否则不做处理
    if (previousNodeActiveState && previousNodeActiveState.active) {
      updateNodeById(lf,nodeId,true)
      // 将当前节点存到全局数组中
      activeNodes.value[nodeId] = { clicked:false, type:'Output', active:updateNode };
    } else {
      updateNodeById(lf,nodeId,false)
      // 将当前节点存到全局数组中
      activeNodes.value[nodeId] = { clicked:false, type:'Output', active:!updateNode };
    }
    return activeNodes;
  }

  const getOutputNotActive = (lf:LogicFlow, nodeId:string, edge:BaseEdgeModel, activeNodes:Ref<ActiveNodes>) => {
    // 获得前一节点的active状态
    const previousNodeActiveState = activeNodes.value[edge.sourceNodeId];
    // 如果前一节点的active状态为true则需要点亮该output节点，否则不做处理
    if (previousNodeActiveState && previousNodeActiveState.active) {
      updateNodeById(lf,nodeId,false)
      // 将当前节点存到全局数组中
      activeNodes.value[nodeId] = { clicked:false, type:'Output', active:false };
    } else {
      updateNodeById(lf,nodeId,true)
      // 将当前节点存到全局数组中
      activeNodes.value[nodeId] = { clicked:false, type:'Output', active:true };
    }
    return activeNodes
  }