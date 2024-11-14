import LogicFlow from "@logicflow/core";

// 点亮节点
const updateNodeById = (lf:LogicFlow, clickId: string, status: boolean) => {
    lf.setProperties(clickId, {
      clicked: status
    });
  }

export { updateNodeById }