import { updateNodeById } from "./updateNodeById";
import { ActiveNodes } from ".";
import { Ref } from "vue";
import LogicFlow from "@logicflow/core/types/LogicFlow";
import BaseNodeModel from "@logicflow/core/types/model/node/BaseNodeModel";

// 处理 NotGate 类型节点
const handleNotGateNode = (lf: LogicFlow, node: BaseNodeModel, activeNodes: Ref<ActiveNodes>, clickId:string) => {

    // 初次进入仿真后还没点击任何节点前clickId=‘’，此时有2种情况：
    // 1.单个输入输出非门
    // 2.多个输入输出非门：此时如果非门位于输出节点前会导致输出节点直接点亮
    if(!clickId){
      // 单个非门
      if(lf.graphModel.nodes.length === 3){
        // 更新当前节点的 active 状态
        activeNodes.value[node.id] = {
          clicked: false,
          type: 'NotGate',
          active: true
        };
      }else{
        // 多个非门
        // 更新当前节点的 active 状态
        activeNodes.value[node.id] = {
          clicked: false,
          type: 'NotGate',
          active: false
        };
      }
    }else{
      // 获取当前节点的所有锚点
      const anchors = lf.getNodeModelById(node.id).getDefaultAnchor();
      
      // 定义锚点 ID
      const topAnchorId = anchors[0].id; // 第一个锚点是左侧输入锚点
    
      // 初始化变量来存储前一个节点的 active 状态
      let frontAnchorActive = false;
    
      // 由于非门只有一个输入点，一旦找到该输入点的状态后，后续的遍历就不再需要
      let foundAnchors = 0; // 计数器
    
      // 遍历所有边，找到与当前节点锚点相连的边
      lf.graphModel.edges.forEach(edge => {
        // 因为OrGate的锚点名称都一样，所以要区分正在处理哪个OrGate节点的锚点
        if(edge.targetNodeId === node.id){
          // 非门左锚点
          if (edge.targetAnchorId === topAnchorId && foundAnchors < 1) {
            // 根据边的 sourceNodeId 找到前一个节点的 active 状态
            const sourceNodeId = edge.sourceNodeId;
            const sourceNodeActiveState = activeNodes.value[sourceNodeId];
            if (sourceNodeActiveState) { // 检查 sourceNodeActiveState 是否存在
              frontAnchorActive = sourceNodeActiveState.active;
              foundAnchors++; // 找到一个锚点，计数器加一
            }
          }
          // 如果已经找到锚点，停止遍历
          if (foundAnchors = 1) {
            return; // 结束遍历
          }
        }
      });
    
      // 判断两个输入节点的 active 状态
      const orGateActive = !frontAnchorActive;
      // 更新当前节点的 active 状态
      activeNodes.value[node.id] = {
        clicked: false,
        type: 'NotGate',
        active: orGateActive
      };
      // 更新 LogicFlow 中的节点属性
      updateNodeById(lf,node.id,orGateActive)
    }
    return activeNodes;
  };

  export { handleNotGateNode }