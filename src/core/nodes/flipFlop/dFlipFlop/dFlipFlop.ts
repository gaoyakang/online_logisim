import { h, RectNode, RectNodeModel } from "@logicflow/core";

// 节点形状
class DFlipFlopView extends RectNode {
  getShape() {
    // 获取形状属性
    const { model } = this.props;
    const { x, y, width, height, } = model;
    // 获取样式属性
    const style = model.getNodeStyle();
    // 计算节点路径
    return h("g", {}, [
      // 节点的外框
      h("rect", {
        ...style,
        x: x,
        y: y,
        width,
        height,
        rx: 0,
        ry: 0,
      }),
      // 节点文字
      h('text',{
        x: x+2,
        y: y + height / 4 + 3,
        'font-size': 12,
        fill: '#333',
      },'D'),
      h('text',{
        x: x+4,
        y: y + 2*height / 4 + 7,
        'font-size': 12,
        fill: '#333',
      },'c'),
      h('text',{
        x: x+width-13,
        y: y + height / 4 + 3,
        'font-size': 12,
        fill: '#333',
      },'Q'),
      h('text',{
        x: x+width-14,
        y: y+22,
        'font-size': 12,
        fill: '#333',
      },'一'),
      h('text',{
        x: x+width-13,
        y: y + 3 * height / 4 + 5,
        'font-size': 12,
        fill: '#333',
      },'Q'),
      // 节点的输入点
      h("circle", {
        cx: x, 
        cy: y + height / 4, 
        r: 3, 
        fill: "orange", 
      }),
      h("circle", {
        cx: x, 
        cy: y + 2*height / 4 + 5,
        r: 3, 
        fill: "orange", 
      }),
      // 节点的输出点
      h("circle", {
        cx: x + width, 
        cy: y + height / 4, 
        r: 3, 
        fill: "orange", 
      }),
      h("circle", {
        cx: x + width, 
        cy: y + 3 * height / 4, 
        r: 3, 
        fill: "orange", 
      }),
    ]);
  }
}

// 节点数据
class DFlipFlopModel extends RectNodeModel {
  // 节点形状初始化数据
  initNodeData(data: any): void {
    super.initNodeData(data);
    this.width = 30;
    this.height = 30;
    this.radius = 5;
  }

  // 节点样式
  getNodeStyle() {
    const style = super.getNodeStyle();
    style.stroke = "black";
    return style;
  }

  // 外选框样式
  getOutlineStyle() {
    // 当鼠标悬浮上去时取消显示外选框
    const style = super.getOutlineStyle();
    style.stroke = "none";
    if (style.hover) {
      style.hover.stroke = "none";
    }
    return style;
  }

  // 自定义锚点
  getDefaultAnchor() {
    const { x, y, width, height } = this;
    return [
        //  左上
        {
            x: x,
            y: y + height / 4, 
            id: "dFlipFlop-lefttop-input",
            // 设置锚点样式
            style: { fill: "orange", r: 3 },
        },
        
        // 左下
        {
            x: x,
            y: y + 2*height / 4 + 5,
            id: "dFlipFlop-leftbottom-input",
            // 设置锚点样式
            style: { fill: "orange", r: 3 },
        },
        // 右上
        {
            x: x + width,
            y: y + height / 4,
            id: "dFlipFlop-righttop-output",
            // 设置锚点样式
            style: { fill: "orange", r: 3 },
        },
        // 右下
        {
            x: x + width,
            y: y + 3 * height / 4,
            id: "dFlipFlop-rightbottom-output",
            // 设置锚点样式
            style: { fill: "orange", r: 3 },
        },
    ];
  }
}

export default {
  type: "DFlipFlop",
  view: DFlipFlopView,
  model: DFlipFlopModel,
};

