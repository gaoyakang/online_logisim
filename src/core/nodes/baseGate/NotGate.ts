import { h, RectNode, RectNodeModel } from "@logicflow/core";

// 节点形状
class NotGateView extends RectNode {
    getShape() {
        // 获取形状属性
        const { model } = this.props;
        const { x, y, width } = model;
        // 获取样式属性
        // const style = model.getNodeStyle();
    
        // 计算等边三角形的高，高 = (sqrt(3) / 2) * 边长
        const height = (width * Math.sqrt(3)) / 2;
        // 定义等边三角形的路径
        const trianglePath = h('path', {
            // 三角
            // 
            d: `
                M ${x} ${y}
                L ${x} ${y + width}
                L ${x + height} ${y + width/2}
                Z
            `,
            stroke: 'black',
            'stroke-width': 2,
            fill: 'white'
        });
        return h('g', {}, [
            // 非门线条
            trianglePath,
            h('circle',{
                cx: `${x + height + 5 }`,
                cy: `${y + width/2}`,
                r: 5,
                fill: 'none',
                stroke: 'black',
                'stroke-width': 2,
            }),
            // 左实心连接圆点
            h('circle', {
                cx: x,
                cy: y + width/2,
                r: 5,
                fill: 'orange',
            }),
            // 右实心连接圆点
            h('circle', {
                cx: x + height+15,
                cy: y + width/2,
                r: 5,
                fill: 'orange',
            }),
        ]);
    }
}

// 节点数据
class NotGateModel extends RectNodeModel {
    // 节点形状初始化数据
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
        // 当鼠标悬浮上去时取消显示外选框
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
            // 左侧锚点
            {
                x: x,
                y: y + width/2,
                id: 'notgate-left',
                type: 'left-top',
                direction: 'left',
                style: { r: 3, fill: 'orange' }
            },
            // 右侧锚点
            {
                x: x + ((width * Math.sqrt(3)) / 2) +15,
                y: y + width/2,
                id: 'notgate-right',
                type: 'right',
                direction: 'right',
                style: { r: 3, fill: 'orange' }
            }
        ];
    }
}

export default {
    type: "NotGate",
    view: NotGateView,
    model: NotGateModel,
}
