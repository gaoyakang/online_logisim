import LogicFlow from "@logicflow/core";
import { Ref } from "vue";

const renderLF = (lf: LogicFlow,containerRef: Ref<any, any>) => {
    lf.render({
      nodes: [],
      edges: [],
    });
  
    // MiniMap.show()必须在lf.render()后调用。
    lf.extension.miniMap.show(containerRef.value.offsetWidth - 170, containerRef.value.offsetHeight - 320)
  }

  export { renderLF }