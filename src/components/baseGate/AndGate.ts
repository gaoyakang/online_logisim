import { h, RectNode, RectNodeModel } from "@logicflow/core";

// 节点形状
class AndGateView extends RectNode {
    getShape() {
        // 获取形状属性
        const { model } = this.props;
        const { x, y, width } = model;
        // 获取样式属性
        const style = model.getNodeStyle();
    
        // 计算节点路径
        const path1 = `M ${x} ${y} L ${x+width} ${y}  A ${width/2} ${width/2} 0 0 1 ${x + width} ${y + width} L ${x} ${y+width} Z`
        return h('g', {}, [
            // 与门线条
            h('path', {
                ...style,
                d: path1,
            }),
            // 三个实心圆点
            h('circle', {
                cx: x + width*(3/2),
                cy: y + width/2,
                r: 5,
                fill: 'yellow',
            }),
            h('circle', {
                cx: x,
                cy: y + width/4,
                r: 5,
                fill: 'blue',
            }),
            h('circle', {
                cx: x,
                cy: y + width*3/4,
                r: 5,
                fill: 'blue',
            }),
        ]);
    }
}

// 节点数据
class AndGateModel extends RectNodeModel {
    // 节点形状
    initNodeData(data: any): void {
        super.initNodeData(data);
        this.width = 30;
      }
    // 节点样式
    getNodeStyle() {
        const style = super.getNodeStyle();
        style.stroke = 'black';
        style['node-selected-box'] = false; // 隐藏选中框
        return style;
      }
      // 自定义锚点
    getAnchor() {
        return [
            { id: 'top', x: this.width / 2, y: 0 },
            { id: 'bottom', x: this.width / 2, y: this.height },
            { id: 'left-top', x: 0, y: this.height / 4 },
            { id: 'left-bottom', x: 0, y: this.height * 3 / 4 },
        ];
    }
}

export default {
    type: "AndGate",
    view: AndGateView,
    model: AndGateModel,
}
