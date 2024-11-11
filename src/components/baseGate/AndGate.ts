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
                fill: 'orange',
            }),
            h('circle', {
                cx: x,
                cy: y + width/4,
                r: 5,
                fill: 'orange',
            }),
            h('circle', {
                cx: x,
                cy: y + width*3/4,
                r: 5,
                fill: 'orange',
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
        return style;
    }

    // 外选框样式
    getOutlineStyle() {
        const style = super.getOutlineStyle()
        style.stroke = 'none'
        if (style.hover) {
          style.hover.stroke = 'none'
        }
        return style
    }

    // 自定义锚点
    getDefaultAnchor() {
        const { x, y, width } = this;
        return [
            // 左侧上方锚点
            {
                x: x,
                y: y + width / 4,
                id: 'left-top',
                type: 'left-top',
                direction: 'top',
                style: { r: 5, fill: 'orange' }
            },
            // 左侧下方锚点
            {
                x: x,
                y: y + width * 3 / 4,
                id: 'left-bottom',
                type: 'left-bottom',
                direction: 'bottom',
                style: { r: 5, fill: 'orange' }
            },
            // 右侧锚点
            {
                x: x + width * (3/2),
                y: y + width / 2,
                id: 'right',
                type: 'right',
                direction: 'right',
                style: { r: 5, fill: 'orange' }
            }
        ];
    }
}

export default {
    type: "AndGate",
    view: AndGateView,
    model: AndGateModel,
}
