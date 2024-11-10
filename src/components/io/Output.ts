import { h, CircleNode, CircleNodeModel } from "@logicflow/core";

// 节点形状
class OutputView extends CircleNode {
    getShape() {
        // 获取形状属性
        const { model } = this.props;
        const { x, y, radius } = model;
        // 获取样式属性
        const style = model.getNodeStyle();
    
        // 计算节点路径
        return h('g', {}, [
            h('circle', {
                cx: x, // 圆心的x坐标与矩形中心的x坐标相同
                cy: y, // 圆心的y坐标与矩形中心的y坐标相同
                r: radius, // 圆的半径，可以根据需要调整
                stroke: 'black', // 圆环的边框颜色
                fill: 'none', // 确保圆内部是空的
                'stroke-width': 2, // 圆环的宽度，可以根据需要调整
            }),
            h('circle', {
                cx: x, // 圆心的x坐标与矩形中心的x坐标相同
                cy: y, // 圆心的y坐标与矩形中心的y坐标相同
                r: 0.7 * radius, // 圆的半径，可以根据需要调整
                stroke: 'black', // 圆环的边框颜色
                fill: 'none', // 确保圆内部是空的
                'stroke-width': 2, // 圆环的宽度，可以根据需要调整
            }),
            h('circle', {
                cx: x - radius , // 圆心的x坐标与矩形中心的x坐标相同
                cy: y, // 圆心的y坐标与矩形中心的y坐标相同
                r: 3, // 圆的半径，可以根据需要调整
                fill: 'blue', // 确保圆内部是空的
            }),
        ]);
    }
}

// 节点数据
class OutputModel extends CircleNodeModel {
    // 节点形状
    initNodeData(data: any): void {
        super.initNodeData(data);
        this.radius = 10
      }
    // 节点样式
    getNodeStyle() {
        const style = super.getNodeStyle();
        style.stroke = 'black';
        return style;
      }
}

export default {
    type: "Output",
    view: OutputView,
    model: OutputModel,
}
