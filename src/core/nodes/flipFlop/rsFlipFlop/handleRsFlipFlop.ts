import LogicFlow from "@logicflow/core/types/LogicFlow";
import { BaseNodeModel } from "@logicflow/core/types/model/node";
import { Ref } from "vue";
import { ActiveNodes } from "../../types";

// 处理RsFlipFlop类型节点
const handleRsFlipFlopNode = (lf: LogicFlow, node: BaseNodeModel, activeNodes: Ref<ActiveNodes>) => {
  // 获取节点的R和S输入值
    // node.anchors包含了当前节点的所有锚点，
    // 在锚点中id=“rsFlipFlop-lefttop-input”对应的是s
    // 在锚点中id=“rsFlipFlop-leftmiddle-input”对应的是c
    // 在锚点中id=“rsFlipFlop-leftmiddle-input”对应的是r
    // 而r/s/c的输入值取决于与其连线的上一节点的状态
    // 所以需要先找到node.anchors中id=“rsFlipFlop-xxx-input”的锚点
    // 然后遍历lf.graphModel.edges中的每条线，通过edge.targetAnchorId === “rsFlipFlop-xxx-input”找到
    // edge.sourceAnchorNodeId,然后在activeNodes中找到该id对应的节点的active状态值，true=1.false=0
    
  // 初始化输入值
  let S = '0'; // 默认为0
  let R = '0'; // 默认为0
  let C = '0'; // 默认为0

  // 遍历锚点以确定S、R和C的值
  node.anchors.forEach((anchor) => {
    const { id } = anchor;
    // 找到对应的锚点
    if (id === 'rsFlipFlop-lefttop-input') {
      // S输入
      lf.graphModel.edges.forEach((edge) => {
        if (edge.targetAnchorId === id) {
          const sourceNode = activeNodes.value[edge.sourceNodeId] || false ;
          S = sourceNode.active ? '1' : '0';
        }
      });
    } else if (id === 'rsFlipFlop-leftbottom-input') {
      // R输入
      lf.graphModel.edges.forEach((edge) => {
        if (edge.targetAnchorId === id) {
          const sourceNode = activeNodes.value[edge.sourceNodeId] || false;
          R = sourceNode.active ? '1' : '0';
        }
      });
    } else if (id === 'rsFlipFlop-leftmiddle-input') {
      // C输入
      lf.graphModel.edges.forEach((edge) => {
        if (edge.targetAnchorId === id) {
          const sourceNode = activeNodes.value[edge.sourceNodeId] || false;
          C = sourceNode.active ? '1' : '0';
        }
      });
    }
  });
  

  // 根据RS触发器的真值表来确定Q的下一个状态
  let nextQ = activeNodes.value[node.id]?.nextQstate || '0'; // 如果没有nextQstate，则默认为'0'
  if (C === '1') { // 只有当时钟信号C为1时，才更新Q的状态
    switch (true) {
      case R === '1' && S === '1':
        // 冲突情况，Q状态保持不变
        break;
      case R === '1' && S === '0':
        // R置位，Q设置为1
        nextQ = '1';
        break;
      case R === '0' && S === '1':
        // S复位，Q设置为0
        nextQ = '0';
        break;
      case R === '0' && S === '0':
        // 无操作，Q状态保持不变
        break;
      default:
        // 默认情况，Q状态保持不变
        break;
    }
  }
  // 更新activeNodes中的节点数据
  activeNodes.value[node.id] = { clicked: false, type: node.type, active: nextQ === '1' ? true : false, nextQstate:nextQ};

  return activeNodes;
};

export { handleRsFlipFlopNode };