'use client'

import { useEffect, useState } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  NodeTypes,
  useNodesState,
  useEdgesState
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

// Custom node component for test bundles
const BundleNode = ({ data }: { data: any }) => (
  <Card className="p-4 min-w-[200px] bg-primary text-primary-foreground">
    <h3 className="font-bold">{data.label}</h3>
    <p className="text-sm opacity-80">{data.description}</p>
    <div className="mt-2 flex gap-2">
      <Badge variant="secondary">{data.testCount} تست</Badge>
      <Badge variant="secondary">{data.difficulty}</Badge>
    </div>
  </Card>
)

// Custom node component for tests
const TestNode = ({ data }: { data: any }) => (
  <Card className="p-4 min-w-[200px]">
    <h3 className="font-bold">{data.label}</h3>
    <p className="text-sm text-muted-foreground">{data.description}</p>
    <div className="mt-2 flex gap-2">
      <Badge variant="outline">{data.difficulty}</Badge>
      <Badge variant="outline">{data.timeLimit} دقیقه</Badge>
      <Badge variant="outline">{data.points} امتیاز</Badge>
    </div>
  </Card>
)

const nodeTypes: NodeTypes = {
  bundle: BundleNode,
  test: TestNode
}

export default function TestGraphPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const response = await fetch('/api/admin/test-bundles/graph')
        if (!response.ok) throw new Error('خطا در دریافت اطلاعات گراف')
        
        const bundles = await response.json()
        const allNodes: Node[] = []
        const allEdges: Edge[] = []

        bundles.forEach((bundle: any, i: number) => {
          const bundleId = `bundle-${bundle.id}`
          allNodes.push({
            id: bundleId,
            type: 'bundle',
            data: {
              label: bundle.title,
              description: bundle.description,
              testCount: bundle.tests.length,
              difficulty: bundle.difficulty
            },
            position: { x: i * 300, y: 50 },
          })

          bundle.tests.forEach((test: any, j: number) => {
            const testId = `test-${test.id}`
            allNodes.push({
              id: testId,
              type: 'test',
              data: {
                label: test.title,
                description: test.description,
                difficulty: test.difficulty,
                timeLimit: test.timeLimit,
                points: test.points
              },
              position: { x: i * 300, y: 150 + j * 120 },
            })

            allEdges.push({
              id: `e-${bundleId}-${testId}`,
              source: bundleId,
              target: testId,
              animated: true,
              style: { stroke: '#0066cc' }
            })
          })
        })

        setNodes(allNodes)
        setEdges(allEdges)
      } catch (error) {
        console.error('Error fetching graph data:', error)
        toast.error('خطا در دریافت اطلاعات گراف')
      } finally {
        setLoading(false)
      }
    }

    fetchGraphData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-100px)]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-100px)] p-4">
      <h2 className="text-2xl font-bold mb-4">نقشه ارتباط تست‌ها و باندل‌ها</h2>
      <div className="h-[calc(100%-60px)] border rounded-lg">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-right"
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  )
} 