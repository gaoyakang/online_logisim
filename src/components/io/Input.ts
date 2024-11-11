import { h, RectNode, RectNodeModel } from "@logicflow/core";

// 节点形状
class InputView extends RectNode {
    getShape() {
        // 获取形状属性
        const { model } = this.props;
        const { x, y, width,height,radius } = model;
        // 获取样式属性
        const style = model.getNodeStyle();
    
        // 计算节点路径
        return h('g', {}, [
            h('rect', {
                ...style,
                x: x,
                y: y,
                width,
                height,
                rx: 0,
                ry: 0,
            }),
            h('circle', {
                cx: x+width/2, // 圆心的x坐标与矩形中心的x坐标相同
                cy: y+height/2, // 圆心的y坐标与矩形中心的y坐标相同
                r: radius, // 圆的半径，可以根据需要调整
                stroke: 'black', // 圆环的边框颜色
                fill: 'none', // 确保圆内部是空的
                'stroke-width': 2, // 圆环的宽度，可以根据需要调整
            }),
            h('circle', {
                cx: x+width, // 圆心的x坐标与矩形中心的x坐标相同
                cy: y+height/2, // 圆心的y坐标与矩形中心的y坐标相同
                r: 3, // 圆的半径，可以根据需要调整
                fill: 'orange', // 确保圆内部是空的
            }),
        ]);
    }
}

// 节点数据
class InputModel extends RectNodeModel {
    // 节点形状
    initNodeData(data: any): void {
        super.initNodeData(data);
        this.width = 20;
        this.height = 20;
        this.radius = 5;
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
        const { x, y, width, height } = this;
        return [
            {
                x: x + width, // 锚点在矩形的最右侧
                y: y + height / 2,
                id: 'right',
                type: 'right',
                direction: 'right',
                // 设置锚点样式，与第三个circle相同
                style: { fill: 'orange', r: 3 }
            }
        ];
    }
}

export default {
    type: "Input",
    view: InputView,
    model: InputModel,
}
