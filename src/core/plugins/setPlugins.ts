import { Ref, ref } from 'vue'
import { activeNodes, handleNodeClick } from "../nodes";
import LogicFlow from '@logicflow/core/types/LogicFlow';
import { dndData } from '../constant';
import { clearLocalstorage } from '../nodes/util/storageNodes';
import { ActiveNodes } from '../nodes/types';


// 仿真按钮的状态
export const simulationActive = ref(false); 

// 设置插件
const setPlugins = (lf: LogicFlow, containerRef: Ref<any, any>) => {
    // 设置拖拽插件dndPanelVue
    lf = setDndPanelVuePlugin(lf)
  
    // 设置控制面板插件Control
    lf = setControlPlugin(lf, containerRef)
    return lf;
}

// 设置拖拽插件dndPanelVue
const setDndPanelVuePlugin = (lf: LogicFlow) => {
  lf.extension.dndPanelVue.setPatternItems(dndData.value)
  return lf;
}
  
// 设置控制面板插件Control
const setControlPlugin = (lf: LogicFlow, containerRef: Ref<any, any>) => {
  let that = lf
  // 添加仿真按钮
  lf.extension.control.addItem({
      key: 'simulation',
      iconClass: simulationActive.value ? "fa fa-pause" : "fa fa-play", // 在html引入了font样式
      text: "仿真",
      /* @ts-ignore */
      onClick: (lf: LogicFlow, ev: any) => {

        // 切换状态
        simulationActive.value = !simulationActive.value;
        // 开始仿真就需要处理一遍节点，
        // 同时又可能有时钟，需要每隔固定时间遍历一遍节点
        if(simulationActive.value){
          handleNodeClick(that,'',true)
        }else{
          // 清空定时器
          clearClockTimers(activeNodes.value);
        }
        // 获取所有节点
        lf = lf.lf; // bug-#IB3T6D : https://gitee.com/lonelyzoom/online-logisim/issues/IB3T6D
        const nodes = lf.graphModel.nodes;

        // 遍历所有节点，并更新每个节点的status属性
        // simulation代表处于仿真状态
        // normal代表处于一般状态
        // 此处更改会导致对应节点的getShape处改变节点形状
        nodes.forEach((node: { id: any; }) => {
            lf.setProperties(node.id, {
              status: simulationActive.value ? 'simulation' : 'normal',
            });
        });
      },
  })
  // 添加导航按钮
  lf.extension.control.addItem({
      key: 'guide',
      iconClass: "fa fa-eye",
      title: "导航",
      text: "导航",
      /* @ts-ignore */
      onClick: (lf: any, ev: any) => {
        // 指定小地图显示在特定位置
        lf.extension.miniMap.show(containerRef.value.offsetWidth - 170, containerRef.value.offsetHeight - 320);
      }
  })
  // 清空画布按钮
  lf.extension.control.addItem({
      key: 'clearpage',
      iconClass: "fa fa-eraser",
      title: "清空",
      text: "清空",
      /* @ts-ignore */
      onClick: (lf: LogicFlow, ev: any) => {
        // 清空定时器
        clearClockTimers(activeNodes.value);

        // 清空数据节点和localstorage
        activeNodes.value = {};
        clearLocalstorage()

        // 重新渲染逻辑流图
        that.clearData();

        // 重置仿真状态
        simulationActive.value = false;
      }
  })
  // 添加源码按钮
  lf.extension.control.addItem({
    key: 'sourcecode',
    iconClass: "fa fa-code-branch",
    title: "源码",
    text: "源码",
    /* @ts-ignore */
    onClick: (lf: any, ev: any) => {
      // 跳转到源码地址
      const sourceCodeUrl = 'https://github.com/gaoyakang/online_logisim';
      // 使用 window.open 打开新标签页跳转到源码地址
      window.open(sourceCodeUrl, '_blank');
    }
  })
  // 移除适应/上一步/下一步按钮
  lf.extension.control.removeItem('reset')
  lf.extension.control.removeItem('undo')
  lf.extension.control.removeItem('redo')
  lf.extension.control.removeItem('zoom-in')
  lf.extension.control.removeItem('zoom-out')
  return lf;
}

export { setPlugins }

function clearClockTimers(activeNodes: ActiveNodes) {
  Object.keys(activeNodes).forEach((id) => {
    const node = activeNodes[id];
    if (node.type === 'Clock' && node.timer) {
      clearTimeout(node.timer); // 清除定时器
      node.timer = undefined; // 将timer置为空，以确保定时器不会被再次清除
    }
  });
}