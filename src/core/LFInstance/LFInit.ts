import LogicFlow from "@logicflow/core";
import { BezierEdge, BezierEdgeModel } from '@logicflow/core';
import { DndPanelVue } from '../../extension/dnd-panel-vue';
import { Control } from '../../extension/control-vue';
import { SelectionSelect,MiniMap } from '@logicflow/extension';
import { Ref } from "vue";

// LogicFlow初始化
const lfInit = (containerRef: Ref<any, any>) => {
    // 创建容器
    const lf = new LogicFlow({
      container: containerRef.value,
      grid: true, // 使用网格
      stopMoveGraph: true, // 画布不允许移动
      plugins: [DndPanelVue, Control, SelectionSelect, MiniMap],
      keyboard: {
        enabled: true, // 开启快捷键
      }
    });
  
    // 设置连线箭头
    lf.setTheme({
      arrow: {
        offset: 0,
        verticalLength: 0,
      },
    });
  
    // 连线为曲线
    lf.register({
      type: 'bezier',
      model: BezierEdgeModel,
      view: BezierEdge
    });
    lf.setDefaultEdgeType('bezier');
  
    // 修改对齐辅助线样式
    lf.setTheme({
      snapline: {
        stroke: '#1E90FF', // 对齐线颜色
        strokeWidth: 1, // 对齐线宽度
      },
    })
  
    return lf;
  }


export { lfInit }