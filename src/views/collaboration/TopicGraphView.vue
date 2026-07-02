<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">协作空间</h2>
    </div>

    <t-tabs :value="activeTab" @change="handleTabChange">
      <t-tab-panel value="map" label="协作地图" />
      <t-tab-panel value="graph" label="课题星图" />
    </t-tabs>

    <div class="stats-row">
      <t-card class="stat-card" bordered>
        <t-statistic title="节点数" :value="stats.nodeCount" color="#0052D9" />
      </t-card>
      <t-card class="stat-card" bordered>
        <t-statistic title="连接数" :value="stats.linkCount" color="#0052D9" />
      </t-card>
    </div>

    <div class="filter-bar">
      <t-space size="16px" align="center">
        <span class="filter-label">选择课题</span>
        <t-select
          v-model="selectedTopicId"
          placeholder="请选择课题"
          clearable
          style="width: 320px"
          @change="handleTopicChange"
        >
          <t-option value="T001" label="数字长城文化遗产数字化保护研究" />
          <t-option value="T002" label="UE5在文化遗产可视化中的应用" />
        </t-select>
      </t-space>
    </div>

    <t-loading :loading="loading" size="medium">
      <t-card v-if="!isEmpty" class="graph-card" bordered>
        <div ref="chartRef" class="chart-container" />
      </t-card>
      <t-empty v-else description="暂无课题星图数据" />
    </t-loading>

    <t-drawer
      v-model:visible="drawerVisible"
      header="节点详情"
      size="420px"
      :footer="false"
    >
      <template v-if="selectedNode">
        <t-descriptions :column="1" bordered>
          <t-descriptions-item label="节点ID">
            {{ selectedNode.id }}
          </t-descriptions-item>
          <t-descriptions-item label="名称">
            {{ selectedNode.name }}
          </t-descriptions-item>
          <t-descriptions-item label="类型">
            <t-tag :theme="nodeTypeTheme(selectedNode.type)" variant="light">
              {{ nodeTypeLabel(selectedNode.type) }}
            </t-tag>
          </t-descriptions-item>
          <t-descriptions-item v-if="selectedNode.university" label="所属院校">
            {{ selectedNode.university }}
          </t-descriptions-item>
          <t-descriptions-item label="节点大小">
            {{ selectedNode.symbolSize }}
          </t-descriptions-item>
          <t-descriptions-item label="关联边数">
            {{ relatedLinkCount }}
          </t-descriptions-item>
        </t-descriptions>
      </template>
    </t-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import { mockGraphData } from '@/mock/collaboration'
import type { GraphNode, GraphLink } from '@/mock/types'

const router = useRouter()
const activeTab = ref('graph')
const loading = ref(false)
const drawerVisible = ref(false)
const selectedNode = ref<GraphNode | null>(null)

const selectedTopicId = ref('T001')
const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null

const graphNodes = ref<GraphNode[]>([])
const graphLinks = ref<GraphLink[]>([])

const isEmpty = computed(() => graphNodes.value.length === 0)

const stats = computed(() => ({
  nodeCount: graphNodes.value.length,
  linkCount: graphLinks.value.length,
}))

const relatedLinkCount = computed(() => {
  if (!selectedNode.value) return 0
  return graphLinks.value.filter(
    l => l.source === selectedNode.value!.id || l.target === selectedNode.value!.id
  ).length
})

function nodeTypeLabel(type: string): string {
  const map: Record<string, string> = {
    student: '学员',
    topic: '课题',
    outcome: '成果',
    resource: '资源',
  }
  return map[type] || type
}

function nodeTypeTheme(type: string): string {
  const map: Record<string, string> = {
    student: 'primary',
    topic: 'warning',
    outcome: 'success',
    resource: 'default',
  }
  return map[type] || 'default'
}

function getNodeColor(type: string): string {
  const map: Record<string, string> = {
    student: '#0052D9',
    topic: '#E37318',
    outcome: '#00A870',
    resource: '#8B8B8B',
  }
  return map[type] || '#8B8B8B'
}

function getLinkStyle(linkType: string): { color: string; width: number; curveness: number } {
  const map: Record<string, { color: string; width: number; curveness: number }> = {
    member: { color: '#0052D9', width: 2, curveness: 0.1 },
    contribute: { color: '#00A870', width: 1.5, curveness: 0.2 },
    reference: { color: '#8B8B8B', width: 1, curveness: 0.15 },
    collaborate: { color: '#E37318', width: 2, curveness: 0.2 },
  }
  return map[linkType] || { color: '#8B8B8B', width: 1, curveness: 0.1 }
}

function handleTabChange(value: string) {
  if (value === 'map') {
    router.push('/collaboration/map')
  }
}

function handleTopicChange() {
  loadGraphData()
}

function handleNodeClick(params: any) {
  if (params.data && params.data._nodeData) {
    selectedNode.value = params.data._nodeData as GraphNode
    drawerVisible.value = true
  }
}

function renderChart() {
  if (!chartRef.value || !chartInstance) return

  const nodes = graphNodes.value
  const links = graphLinks.value

  if (nodes.length === 0) {
    chartInstance.clear()
    return
  }

  const categories = [
    { name: '学员', itemStyle: { color: '#0052D9' } },
    { name: '课题', itemStyle: { color: '#E37318' } },
    { name: '成果', itemStyle: { color: '#00A870' } },
    { name: '资源', itemStyle: { color: '#8B8B8B' } },
  ]

  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        if (params.dataType === 'node') {
          const d = params.data._nodeData as GraphNode
          let result = `<strong>${d.name}</strong><br/>类型: ${nodeTypeLabel(d.type)}`
          if (d.university) result += `<br/>院校: ${d.university}`
          return result
        }
        return ''
      },
    },
    legend: {
      data: categories.map(c => c.name),
      orient: 'vertical',
      right: 20,
      top: 20,
      textStyle: { fontSize: 12 },
    },
    series: [
      {
        type: 'graph',
        layout: 'force',
        animation: true,
        categories,
        data: nodes.map(n => ({
          id: n.id,
          name: n.name,
          symbolSize: n.symbolSize,
          category: categories.findIndex(c => n.type === 'student' ? c.name === '学员' : n.type === 'topic' ? c.name === '课题' : n.type === 'outcome' ? c.name === '成果' : c.name === '资源'),
          itemStyle: {
            color: getNodeColor(n.type),
            shadowBlur: 6,
            shadowColor: getNodeColor(n.type) + '40',
          },
          label: {
            show: n.symbolSize >= 35,
            fontSize: 11,
            color: '#333',
          },
          _nodeData: n,
        })),
        links: links.map(l => {
          const style = getLinkStyle(l.type)
          return {
            source: l.source,
            target: l.target,
            lineStyle: {
              color: style.color,
              width: style.width,
              curveness: style.curveness,
              opacity: 0.5,
            },
            label: {
              show: false,
            },
          }
        }),
        roam: true,
        draggable: true,
        force: {
          repulsion: 300,
          gravity: 0.08,
          edgeLength: [120, 200],
          layoutAnimation: true,
        },
        emphasis: {
          focus: 'adjacency',
          lineStyle: {
            width: 3,
          },
        },
        scaleLimit: {
          min: 0.5,
          max: 3,
        },
      },
    ],
  }

  chartInstance.setOption(option, true)
}

function loadGraphData() {
  loading.value = true
  try {
    const data = mockGraphData(selectedTopicId.value || 'T001')
    graphNodes.value = data.nodes
    graphLinks.value = data.links
  } finally {
    loading.value = false
    setTimeout(() => {
      initChart()
    }, 100)
  }
}

function initChart() {
  if (!chartRef.value) return
  if (chartInstance) {
    chartInstance.dispose()
  }
  chartInstance = echarts.init(chartRef.value)
  chartInstance.on('click', handleNodeClick)
  renderChart()
  window.addEventListener('resize', handleResize)
}

function handleResize() {
  chartInstance?.resize()
}

onMounted(() => {
  loadGraphData()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})
</script>

<style scoped>
.page-container {
  padding: 0;
}

.page-header {
  margin-bottom: 16px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #1F2329;
  margin: 0;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.stat-card {
  text-align: center;
}

.stat-card :deep(.t-statistic__title) {
  font-size: 13px;
  color: #646A73;
}

.stat-card :deep(.t-statistic__content) {
  font-size: 28px;
  font-weight: 700;
}

.filter-bar {
  margin-bottom: 16px;
  padding: 12px 16px;
  background: #fff;
  border-radius: 6px;
}

.filter-label {
  font-size: 14px;
  color: #646A73;
  font-weight: 500;
}

.graph-card {
  overflow: hidden;
}

.chart-container {
  width: 100%;
  height: 560px;
}
</style>
