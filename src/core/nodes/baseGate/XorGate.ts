import { h, RectNode, RectNodeModel } from "@logicflow/core";

// 节点形状
class XorGateView extends RectNode {
    getShape() {
        // 获取形状属性
        const { model } = this.props;
        const { x, y, width } = model;
        // 获取样式属性
        const style = model.getNodeStyle();
    
        // 计算节点路径
        const xorGatePath = `
                            M ${x} ${y} 
                            L ${x+(width/2)} ${y}

                            A ${(width/2)} ${(width/2)} 0 0 1 ${x+0.6*(width/2)} ${y + width}

                            M ${x+0.6*(width/2)} ${y+width/4}
                            A ${(width/4)} ${(width/4)} 0 0 1 ${x+0.6*(width/2)} ${y + 3*width/4}

                            M ${x+0.5*(width/2) + 20} ${y+width/4 + 2}
                            L ${x - width/2} ${y+width/4 + 2}
                            
                            M ${x+0.5*(width/2) + 19} ${y+width/4 + 13}
                            L ${x - width/2} ${y+width/4 + 13}
                            
                            M ${x} ${y+width}
                            L ${x+width} ${y+width}

                            M ${x + width/2} ${y} 
                            A ${width/2} ${width/4} 0 0 1 ${x + width} ${y + width}
                        `
        return h('g', {}, [
            // 异或门线条
            h('path', {
                ...style,
                d: xorGatePath,
            }),
            // 三个实心连接圆点
            h('circle', {
                cx: x + width*2 -5,
                cy: y + width/2,
                r: 5,
                fill: 'orange',
            }),
            h('circle', {
                cx: x - 10,
                cy: y + width/4 + 1,
                r: 5,
                fill: 'orange',
            }),
            h('circle', {
                cx: x - 10,
                cy: y + 3*width/4 - 1 ,
                r: 5,
                fill: 'orange',
            }),
        ]);
    }
}

// 节点数据
class XorGateModel extends RectNodeModel {
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
                x: x - 10,
                y: y + width / 4,
                id: 'xorgate-left-top',
                type: 'left-top',
                direction: 'top',
                style: { r: 5, fill: 'orange' }
            },
            // 左侧下方锚点
            {
                x: x - 10,
                y: y + width * 3 / 4,
                id: 'xorgate-left-bottom',
                type: 'left-bottom',
                direction: 'bottom',
                style: { r: 5, fill: 'orange' }
            },
            // 右侧锚点
            {
                x: x + width*2 -5,
                y: y + width/2,
                id: 'xorgate-right',
                type: 'right',
                direction: 'right',
                style: { r: 5, fill: 'orange' }
            }
        ];
    }
}

export default {
    type: "XorGate",
    view: XorGateView,
    model: XorGateModel,
}
