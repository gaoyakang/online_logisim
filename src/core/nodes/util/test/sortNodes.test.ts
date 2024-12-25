import { describe, test } from 'vitest'

import { buildTree } from '../sortNodes'
import LogicFlow from '@logicflow/core'



describe('sortNodes', () => {
    test('buildTree', () => {
        const lf = new LogicFlow({
            container: document.createElement('div'),
        })
        const graphData = {
            nodes: [
              {
                id: 'fba7fc7b-83a8-4edd-b4be-21f694a5d490',
                type: 'CustomNode',
                x: 100,
                y: 100
              }
            ],
            edges:[
                {
                    id: 'edge-1',
                    type: 'edge',
                    sourceNodeId: 'fba7fc7b-83a8-4edd-b4be-21f694a5d490',
                    targetNodeId: 'fba7fc7b-83a8-4edd-b4be-21f694a5d490',
                    sourceAnchor: 2,
                    targetAnchor:0,
                }
            ]
          }
        //   lf.register()
          lf.render(graphData);
        // let data = buildTree(lf)
        // expect(data).toEqual({})
    })
})

