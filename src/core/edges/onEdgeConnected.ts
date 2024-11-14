import LogicFlow from "@logicflow/core";

// 监听边的创建事件
const onEdgeConnected = (lf: LogicFlow) => {
  // TODO: 确定连接点之间是否允许连接
  lf.on("edge:add", (edge) => {
    const { id } = edge.data
    updateEdgeById(lf,id)
  })
  return lf;
}

  // 点亮线
const updateEdgeById = (lf: LogicFlow,edgeId:string) => {
  lf.updateAttributes(edgeId,{
          style:{
            stroke: 'green'
          }
  })
  return lf;
}

export { onEdgeConnected }