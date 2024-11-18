import LogicFlow from "@logicflow/core/types/LogicFlow"

const updateEdgeById = (lf: LogicFlow,edgeId:string) => {
    lf.updateAttributes(edgeId,{
            style:{
              stroke: 'green'
            }
    })
    return lf;
}

export { updateEdgeById }