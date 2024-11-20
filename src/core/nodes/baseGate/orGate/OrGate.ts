import { h, RectNode, RectNodeModel } from "@logicflow/core";

// 节点形状
class OrGateView extends RectNode {
    getShape() {
        // 获取形状属性
        const { model } = this.props;
        const { x, y, width } = model;
        // 获取样式属性
        const style = model.getNodeStyle();
    
        // 计算节点路径
        const orGatePath = `
                            M ${x} ${y} 
                            L ${x+(width/2)} ${y}

                            A ${(width/2)} ${(width/2)} 0 0 1 ${x+0.6*(width/2)} ${y + width}

                            M ${x} ${y+width}
                            L ${x+width} ${y+width}

                            M ${x + width/2} ${y} 
                            A ${width/2} ${width/4} 0 0 1 ${x + width} ${y + width}
                        `
        return h('g', {}, [
            // 或门线条
            h('path', {
                ...style,
                d: orGatePath,
            }),
            // 三个实心连接圆点
            h('circle', {
                cx: x + width*2 -5,
                cy: y + width/2,
                r: 5,
                fill: 'orange',
            }),
            h('circle', {
                cx: x,
                cy: y,
                r: 5,
                fill: 'orange',
            }),
            h('circle', {
                cx: x,
                cy: y + width,
                r: 5,
                fill: 'orange',
            }),
        ]);
    }
}

// 节点数据
class OrGateModel extends RectNodeModel {
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
            // 左侧上方锚点
            {
                x: x,
                y: y,
                id: 'orgate-lefttop-input',
                type: 'left-top',
                direction: 'top',
                style: { r: 5, fill: 'orange' }
            },
            // 左侧下方锚点
            {
                x: x,
                y: y+width,
                id: 'orgate-left-bottom',
                type: 'left-bottom',
                direction: 'bottom',
                style: { r: 5, fill: 'orange' }
            },
            // 右侧锚点
            {
                x: x + width*2 -5,
                y: y + width/2,
                id: 'orgate-right-output',
                type: 'right',
                direction: 'right',
                style: { r: 5, fill: 'orange' }
            }
        ];
    }
}

export default {
    type: "OrGate",
    view: OrGateView,
    model: OrGateModel,
}
