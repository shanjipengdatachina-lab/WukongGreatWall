<template>
  <div class="page-container" :class="{ 'fullscreen-mode': isFullscreen }">
    <div class="page-header">
      <h2 class="page-title">协作空间</h2>
    </div>

    <t-tabs :value="activeTab" @change="handleTabChange">
      <t-tab-panel value="map" label="协作地图" />
      <t-tab-panel value="graph" label="课题星图" />
    </t-tabs>

    <div class="stats-row">
      <t-card class="stat-card" bordered>
        <t-statistic title="学员节点数" :value="stats.nodeCount" color="#0052D9" />
      </t-card>
      <t-card class="stat-card" bordered>
        <t-statistic title="协作关系数" :value="stats.linkCount" color="#0052D9" />
      </t-card>
      <t-card class="stat-card" bordered>
        <t-statistic title="课题网络数" :value="stats.topicCount" color="#0052D9" />
      </t-card>
    </div>

    <div class="filter-bar">
      <t-space size="16px" break-line align="center">
        <t-radio-group v-model="mapMode" variant="default-filled" size="medium" @change="handleMapModeChange">
          <t-radio-button value="world">
            <template #icon><t-icon name="earth" /></template>
            全球模式
          </t-radio-button>
          <t-radio-button value="china">
            <template #icon><t-icon name="map" /></template>
            中国模式
          </t-radio-button>
        </t-radio-group>

        <t-select
          v-if="mapMode === 'china'"
          v-model="filterTopic"
          placeholder="筛选课题"
          clearable
          style="width: 240px"
          @change="handleFilterChange"
        >
          <t-option
            v-for="t in topicOptions"
            :key="t.value"
            :value="t.value"
            :label="t.label"
          />
        </t-select>

        <t-select
          v-if="mapMode === 'china'"
          v-model="filterRegion"
          placeholder="院校分布"
          clearable
          style="width: 160px"
          @change="handleFilterChange"
        >
          <t-option
            v-for="r in regionOptions"
            :key="r.value"
            :value="r.value"
            :label="r.label"
          />
        </t-select>

        <t-divider layout="vertical" />

        <t-space size="8px">
          <t-tooltip content="自动旋转开关">
            <t-button
              :theme="autoRotate ? 'primary' : 'default'"
              shape="square"
              variant="outline"
              @click="toggleAutoRotate"
            >
              <t-icon name="refresh" />
            </t-button>
          </t-tooltip>
          <t-tooltip content="重置视角">
            <t-button shape="square" variant="outline" @click="resetView">
              <t-icon name="locate" />
            </t-button>
          </t-tooltip>
          <t-tooltip content="放大">
            <t-button shape="square" variant="outline" @click="zoomIn">
              <t-icon name="add" />
            </t-button>
          </t-tooltip>
          <t-tooltip content="缩小">
            <t-button shape="square" variant="outline" @click="zoomOut">
              <t-icon name="minus" />
            </t-button>
          </t-tooltip>
          <t-tooltip content="俯视/侧视切换">
            <t-button shape="square" variant="outline" @click="toggleViewAngle">
              <t-icon name="map-3d" />
            </t-button>
          </t-tooltip>
          <t-tooltip :content="isFullscreen ? '退出全屏' : '全屏模式'">
            <t-button shape="square" variant="outline" @click="toggleFullscreen">
              <t-icon :name="isFullscreen ? 'minimize' : 'maximize'" />
            </t-button>
          </t-tooltip>
        </t-space>

        <t-tag theme="primary" variant="light-outline" size="small">
          鼠标左键拖拽旋转 · 右键平移 · 滚轮缩放
        </t-tag>
      </t-space>
    </div>

    <div class="map-wrapper" :class="{ 'map-fullscreen': isFullscreen }">
      <t-loading :loading="loading" size="medium" :text="loadingText">
        <div v-if="!isEmpty && mapReady" class="map-card">
          <div ref="chartRef" class="chart-container" />
        </div>
        <t-empty v-else-if="mapReady && isEmpty" description="暂无地图数据" />
        <t-empty v-else description="地图加载中..." />
      </t-loading>

      <div v-if="isFullscreen" class="fullscreen-topbar">
        <div class="fullscreen-title">协作地图</div>
        <t-space size="8px">
          <t-tooltip content="自动旋转开关">
            <t-button
              :theme="autoRotate ? 'primary' : 'default'"
              shape="square"
              variant="outline"
              @click="toggleAutoRotate"
            >
              <t-icon name="refresh" />
            </t-button>
          </t-tooltip>
          <t-tooltip content="重置视角">
            <t-button shape="square" variant="outline" @click="resetView">
              <t-icon name="locate" />
            </t-button>
          </t-tooltip>
          <t-tooltip content="放大">
            <t-button shape="square" variant="outline" @click="zoomIn">
              <t-icon name="add" />
            </t-button>
          </t-tooltip>
          <t-tooltip content="缩小">
            <t-button shape="square" variant="outline" @click="zoomOut">
              <t-icon name="minus" />
            </t-button>
          </t-tooltip>
          <t-tooltip content="俯视/侧视切换">
            <t-button shape="square" variant="outline" @click="toggleViewAngle">
              <t-icon name="map-3d" />
            </t-button>
          </t-tooltip>
          <t-tooltip content="退出全屏">
            <t-button theme="primary" shape="square" variant="outline" @click="toggleFullscreen">
              <t-icon name="minimize" />
            </t-button>
          </t-tooltip>
        </t-space>
      </div>

      <div class="layer-panel">
        <t-card :bordered="false" class="layer-card">
          <div class="layer-panel-header">
            <t-icon name="layers" size="18px" />
            <span class="layer-panel-title">地理图层</span>
          </div>
          <t-divider style="margin: 8px 0" />
          <div class="layer-group">
            <div class="layer-group-title">协作数据</div>
            <t-checkbox v-model="layerSettings.universities" @change="renderChart">
              <span class="layer-dot" style="background:#0052D9"></span>
              院校节点
            </t-checkbox>
            <t-checkbox v-model="layerSettings.topics" @change="renderChart">
              <span class="layer-dot" style="background:#E37318"></span>
              课题节点
            </t-checkbox>
            <t-checkbox v-model="layerSettings.links" @change="renderChart">
              <span class="layer-dot" style="background:#0052D9; height:2px"></span>
              协作连线
            </t-checkbox>
          </div>
          <div class="layer-group">
            <div class="layer-group-title">城市地理</div>
            <t-checkbox v-model="layerSettings.majorCities" @change="renderChart">
              <span class="layer-dot" style="background:#2BA471"></span>
              主要城市
            </t-checkbox>
            <t-checkbox v-model="layerSettings.ancientCities" @change="renderChart">
              <span class="layer-dot" style="background:#A06A00"></span>
              历史古城
            </t-checkbox>
          </div>
          <div class="layer-group">
            <div class="layer-group-title">交通线路</div>
            <t-checkbox v-model="layerSettings.highways" @change="renderChart">
              <span class="layer-dot" style="background:#00A870; height:2px"></span>
              高铁/高速
            </t-checkbox>
            <t-checkbox v-model="layerSettings.greatWall" @change="renderChart">
              <span class="layer-dot" style="background:#C24A4A; height:3px"></span>
              万里长城
            </t-checkbox>
            <t-checkbox v-model="layerSettings.ancientRoads" @change="renderChart">
              <span class="layer-dot" style="background:#A06A00; height:2px"></span>
              古道路
            </t-checkbox>
          </div>
          <div class="layer-group">
            <div class="layer-group-title">标签标注</div>
            <t-checkbox v-model="layerSettings.labels" @change="renderChart">
              <span class="layer-dot" style="background:transparent; border:1px solid #888"></span>
              点位名称
            </t-checkbox>
          </div>
          <t-divider style="margin: 8px 0" />
          <div class="quick-jump">
            <div class="layer-group-title">快速定位</div>
            <div class="jump-buttons">
              <t-button
                v-for="loc in quickLocations"
                :key="loc.name"
                size="small"
                variant="outline"
                @click="flyToLocation(loc)"
              >
                {{ loc.name }}
              </t-button>
            </div>
          </div>
        </t-card>
      </div>
    </div>

    <t-drawer
      v-model:visible="drawerVisible"
      :header="drawerTitle"
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
            <t-tag :theme="getTypeTheme(selectedNode.type)" variant="light">
              {{ getTypeLabel(selectedNode.type) }}
            </t-tag>
          </t-descriptions-item>
          <t-descriptions-item v-if="selectedNode.longitude !== undefined" label="经纬度">
            {{ selectedNode.longitude.toFixed(2) }}°E, {{ selectedNode.latitude.toFixed(2) }}°N
          </t-descriptions-item>
          <t-descriptions-item v-if="selectedNode.dynasty" label="朝代">
            {{ selectedNode.dynasty }}
          </t-descriptions-item>
          <t-descriptions-item v-if="selectedNode.ancientName" label="古称">
            {{ selectedNode.ancientName }}
          </t-descriptions-item>
          <t-descriptions-item v-if="selectedNode.province" label="所属省份">
            {{ selectedNode.province }}
          </t-descriptions-item>
          <t-descriptions-item v-if="selectedNode.population" label="人口">
            {{ selectedNode.population }} 万人
          </t-descriptions-item>
          <t-descriptions-item v-if="selectedNode.description" label="简介">
            {{ selectedNode.description }}
          </t-descriptions-item>
          <t-descriptions-item v-if="selectedNode.value !== undefined" label="参与学员数">
            {{ selectedNode.value }} 人
          </t-descriptions-item>
          <t-descriptions-item v-if="selectedNode.type === 'university' || selectedNode.type === 'topic'" label="协作关系">
            <div v-if="relatedLinks.length === 0" style="color:#999">暂无协作关系</div>
            <t-space direction="vertical" size="4px" v-else>
              <t-tag
                v-for="link in relatedLinks"
                :key="link.source + link.target"
                :theme="link.type === 'lead' ? 'primary' : 'default'"
                variant="light"
              >
                {{ getNodeName(link.source) }} ↔ {{ getNodeName(link.target) }}
              </t-tag>
            </t-space>
          </t-descriptions-item>
        </t-descriptions>
      </template>
    </t-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import 'echarts-gl'
import { MessagePlugin } from 'tdesign-vue-next'
import { mockMapData } from '@/mock/collaboration'
import { ancientCities, majorCities, roadSegments } from '@/mock/geoLayers'
import type { MapNode, MapLink } from '@/mock/types'
import type { AncientCity, MajorCity } from '@/mock/geoLayers'

const router = useRouter()
const activeTab = ref('map')
const loading = ref(true)
const mapReady = ref(false)
const drawerVisible = ref(false)
const autoRotate = ref(false)
const isTopView = ref(false)
const isFullscreen = ref(false)
const mapMode = ref<'world' | 'china'>('china')

const filterTopic = ref('')
const filterRegion = ref('')

const layerSettings = ref({
  universities: true,
  topics: true,
  links: true,
  majorCities: false,
  ancientCities: false,
  highways: false,
  greatWall: true,
  ancientRoads: false,
  labels: true,
})

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null

const allNodes = ref<MapNode[]>([])
const allLinks = ref<MapLink[]>([])

const loadingText = computed(() => {
  return mapMode.value === 'world' ? '正在加载全球地图...' : '正在加载中国地图...'
})

const quickLocations = computed(() => {
  if (mapMode.value === 'world') {
    return [
      { name: '中国', longitude: 104, latitude: 35, distance: 120 },
      { name: '欧洲', longitude: 10, latitude: 50, distance: 150 },
      { name: '北美', longitude: -100, latitude: 40, distance: 150 },
      { name: '全球视角', longitude: 0, latitude: 20, distance: 200 },
    ]
  }
  return [
    { name: '北京', longitude: 116.4, latitude: 39.9, distance: 60 },
    { name: '上海', longitude: 121.47, latitude: 31.23, distance: 60 },
    { name: '西安', longitude: 108.94, latitude: 34.34, distance: 60 },
    { name: '成都', longitude: 104.06, latitude: 30.67, distance: 60 },
    { name: '全国视角', longitude: 104, latitude: 35, distance: 120 },
  ]
})

const drawerTitle = computed(() => {
  if (!selectedNode.value) return '节点详情'
  const type = selectedNode.value.type
  if (type === 'ancientCity') return '古城详情'
  if (type === 'majorCity') return '城市详情'
  if (type === 'university') return '院校详情'
  if (type === 'topic') return '课题详情'
  return '节点详情'
})

const topicOptions = computed(() => {
  const topics = allNodes.value.filter(n => n.type === 'topic')
  return topics.map(t => ({ value: t.id, label: t.name }))
})

const regionOptions = computed(() => {
  const universities = allNodes.value.filter(n => n.type === 'university')
  const seen = new Set<string>()
  const result: { value: string; label: string }[] = []
  universities.forEach(u => {
    const key = u.name.length > 3 ? u.name.substring(0, 3) : u.name
    if (!seen.has(key)) {
      seen.add(key)
      result.push({ value: key, label: key })
    }
  })
  return result
})

const filteredNodes = computed(() => {
  let nodes = allNodes.value
  if (filterTopic.value) {
    const linkedIds = new Set<string>()
    linkedIds.add(filterTopic.value)
    allLinks.value.forEach(l => {
      if (l.source === filterTopic.value) linkedIds.add(l.target)
      if (l.target === filterTopic.value) linkedIds.add(l.source)
    })
    nodes = nodes.filter(n => linkedIds.has(n.id))
  }
  if (filterRegion.value) {
    nodes = nodes.filter(n => n.type !== 'university' || n.name.includes(filterRegion.value))
  }
  return nodes
})

const filteredLinks = computed(() => {
  const nodeIds = new Set(filteredNodes.value.map(n => n.id))
  return allLinks.value.filter(l => nodeIds.has(l.source) && nodeIds.has(l.target))
})

const isEmpty = computed(() => {
  if (mapMode.value === 'world') return false
  return filteredNodes.value.length === 0 && !layerSettings.value.majorCities && !layerSettings.value.ancientCities
})

const stats = computed(() => {
  const universities = allNodes.value.filter(n => n.type === 'university')
  return {
    nodeCount: universities.length,
    linkCount: allLinks.value.length,
    topicCount: allNodes.value.filter(n => n.type === 'topic').length,
  }
})

const relatedLinks = computed(() => {
  if (!selectedNode.value) return []
  return allLinks.value.filter(
    l => l.source === selectedNode.value!.id || l.target === selectedNode.value!.id
  )
})

const selectedNode = ref<any>(null)

function getNodeName(id: string): string {
  const node = allNodes.value.find(n => n.id === id)
  return node ? node.name : id
}

function getTypeLabel(type: string): string {
  const map: Record<string, string> = {
    university: '院校',
    topic: '课题',
    ancientCity: '历史古城',
    majorCity: '主要城市',
  }
  return map[type] || type
}

function getTypeTheme(type: string): string {
  const map: Record<string, string> = {
    university: 'primary',
    topic: 'warning',
    ancientCity: 'warning',
    majorCity: 'success',
  }
  return map[type] || 'default'
}

function handleTabChange(value: string) {
  if (value === 'graph') {
    router.push('/collaboration/graph')
  }
}

function handleFilterChange() {
  renderChart()
}

function handleMapModeChange() {
  loading.value = true
  mapReady.value = false
  loadMapData()
}

function handleNodeClick(params: any) {
  if (params.data && params.data._nodeData) {
    selectedNode.value = params.data._nodeData
    drawerVisible.value = true
  }
}

function toggleAutoRotate() {
  autoRotate.value = !autoRotate.value
  if (chartInstance) {
    chartInstance.setOption({
      geo3D: {
        viewControl: {
          autoRotate: autoRotate.value,
          autoRotateSpeed: 8,
          autoRotateAfterStill: 3,
        },
      },
    })
  }
}

function resetView() {
  if (!chartInstance) return
  const isWorld = mapMode.value === 'world'
  chartInstance.setOption({
    geo3D: {
      viewControl: {
        distance: isWorld ? 180 : 120,
        alpha: 40,
        beta: isWorld ? 0 : 0,
        center: [0, 0, 0],
      },
    },
  })
  isTopView.value = false
}

function zoomIn() {
  if (!chartInstance) return
  const currentOption: any = chartInstance.getOption()
  const geo3D = currentOption.geo3D?.[0] || {}
  const currentDistance = geo3D.viewControl?.distance || 120
  chartInstance.setOption({
    geo3D: {
      viewControl: {
        distance: Math.max(40, currentDistance - 20),
      },
    },
  })
}

function zoomOut() {
  if (!chartInstance) return
  const currentOption: any = chartInstance.getOption()
  const geo3D = currentOption.geo3D?.[0] || {}
  const currentDistance = geo3D.viewControl?.distance || 120
  chartInstance.setOption({
    geo3D: {
      viewControl: {
        distance: Math.min(300, currentDistance + 20),
      },
    },
  })
}

function toggleViewAngle() {
  isTopView.value = !isTopView.value
  if (chartInstance) {
    chartInstance.setOption({
      geo3D: {
        viewControl: {
          alpha: isTopView.value ? 90 : 40,
        },
      },
    })
  }
}

function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value
  setTimeout(() => {
    chartInstance?.resize()
  }, 300)
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isFullscreen.value) {
    isFullscreen.value = false
    setTimeout(() => {
      chartInstance?.resize()
    }, 300)
  }
}

function flyToLocation(loc: { longitude: number; latitude: number; distance: number }) {
  if (!chartInstance) return
  chartInstance.setOption({
    geo3D: {
      viewControl: {
        center: [loc.longitude, loc.latitude, 0],
        distance: loc.distance,
        alpha: 40,
        beta: 0,
        animation: true,
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'cubicInOut',
      },
    },
  })
  isTopView.value = false
}

async function loadChinaMap(): Promise<any> {
  const response = await fetch('/map/china.json')
  if (!response.ok) throw new Error('中国地图加载失败')
  return await response.json()
}

async function loadWorldMap(): Promise<any> {
  const response = await fetch('/map/world.json')
  if (!response.ok) throw new Error('全球地图加载失败')
  return await response.json()
}

function buildSeries(): any[] {
  const series: any[] = []
  const ls = layerSettings.value
  const isChina = mapMode.value === 'china'

  const nodes = filteredNodes.value
  const links = filteredLinks.value
  const showLabels = ls.labels

  if (isChina) {
    if (ls.links && links.length > 0) {
      const linkLines: any[] = []
      links.forEach(l => {
        const sourceNode = nodes.find(n => n.id === l.source)
        const targetNode = nodes.find(n => n.id === l.target)
        if (sourceNode && targetNode) {
          linkLines.push({
            coords: [
              [sourceNode.longitude, sourceNode.latitude],
              [targetNode.longitude, targetNode.latitude],
            ],
            lineStyle: {
              color: l.type === 'lead' ? '#0052D9' : '#A0C4FF',
              width: l.type === 'lead' ? 3 : 2,
              opacity: 0.7,
            },
          })
        }
      })
      series.push({
        type: 'lines3D',
        coordinateSystem: 'geo3D',
        effect: {
          show: true,
          period: 4,
          trailWidth: 2,
          trailLength: 0.4,
          trailOpacity: 0.8,
          trailColor: '#0052D9',
        },
        blendMode: 'lighter',
        lineStyle: {
          width: 2,
          color: '#0052D9',
          opacity: 0.7,
        },
        data: linkLines,
      })
    }

    if (ls.universities) {
      const universityNodes = nodes.filter(n => n.type === 'university')
      series.push({
        type: 'scatter3D',
        name: '院校',
        coordinateSystem: 'geo3D',
        data: universityNodes.map(n => ({
          value: [n.longitude, n.latitude, n.value],
          name: n.name,
          _nodeData: { ...n, type: 'university' },
        })),
        symbol: 'circle',
        symbolSize: (val: number[]) => Math.max(val[2] * 1.5, 10),
        itemStyle: {
          color: '#0052D9',
          opacity: 0.9,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: showLabels,
          position: 'right',
          formatter: (params: any) => params.name,
          fontSize: 11,
          color: '#1F2329',
          backgroundColor: 'rgba(255,255,255,0.8)',
          padding: [2, 4],
          borderRadius: 3,
        },
        emphasis: {
          label: { show: true, fontSize: 14, color: '#0052D9', fontWeight: 'bold' },
          itemStyle: { color: '#0052D9', opacity: 1 },
        },
      })
    }

    if (ls.topics) {
      const topicNodes = nodes.filter(n => n.type === 'topic')
      series.push({
        type: 'scatter3D',
        name: '课题',
        coordinateSystem: 'geo3D',
        data: topicNodes.map(n => ({
          value: [n.longitude, n.latitude, n.value * 1.5],
          name: n.name,
          _nodeData: { ...n, type: 'topic' },
        })),
        symbol: 'pin',
        symbolSize: (val: number[]) => Math.max(val[2] * 2, 20),
        itemStyle: {
          color: '#E37318',
          opacity: 1,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: showLabels,
          position: 'top',
          formatter: (params: any) => {
            const name = params.name
            return name.length > 12 ? name.substring(0, 12) + '...' : name
          },
          fontSize: 11,
          color: '#E37318',
          fontWeight: 'bold',
          backgroundColor: 'rgba(255,255,255,0.9)',
          padding: [2, 6],
          borderRadius: 3,
        },
        emphasis: {
          label: { show: true, fontSize: 14 },
          itemStyle: { color: '#E37318', opacity: 1 },
        },
      })
    }
  } else {
    if (ls.universities && nodes.length > 0) {
      const universityNodes = nodes.filter(n => n.type === 'university')
      series.push({
        type: 'scatter3D',
        name: '院校',
        coordinateSystem: 'geo3D',
        data: universityNodes.map(n => ({
          value: [n.longitude, n.latitude, n.value],
          name: n.name,
          _nodeData: { ...n, type: 'university' },
        })),
        symbol: 'circle',
        symbolSize: (val: number[]) => Math.max(val[2] * 1.2, 6),
        itemStyle: {
          color: '#0052D9',
          opacity: 0.9,
          borderColor: '#fff',
          borderWidth: 1,
        },
        label: {
          show: showLabels,
          position: 'right',
          formatter: (params: any) => params.name,
          fontSize: 10,
          color: '#1F2329',
          backgroundColor: 'rgba(255,255,255,0.8)',
          padding: [1, 3],
          borderRadius: 2,
        },
      })
    }
  }

  if (ls.majorCities && isChina) {
    series.push({
      type: 'scatter3D',
      name: '主要城市',
      coordinateSystem: 'geo3D',
      data: majorCities.map((c: MajorCity) => ({
        value: [c.longitude, c.latitude, Math.sqrt(c.population) / 3],
        name: c.name,
        _nodeData: { ...c, type: 'majorCity' },
      })),
      symbol: 'diamond',
      symbolSize: (val: number[]) => Math.max(val[2] * 0.8, 6),
      itemStyle: {
        color: '#2BA471',
        opacity: 0.8,
        borderColor: '#fff',
        borderWidth: 1,
      },
      label: {
        show: showLabels,
        position: 'top',
        formatter: (params: any) => params.name,
        fontSize: 10,
        color: '#2BA471',
        backgroundColor: 'rgba(255,255,255,0.7)',
        padding: [1, 3],
        borderRadius: 2,
      },
    })
  }

  if (ls.ancientCities && isChina) {
    series.push({
      type: 'scatter3D',
      name: '历史古城',
      coordinateSystem: 'geo3D',
      data: ancientCities.map((c: AncientCity) => ({
        value: [c.longitude, c.latitude, 3],
        name: c.name,
        _nodeData: { ...c, type: 'ancientCity' },
      })),
      symbol: 'rect',
      symbolSize: 12,
      itemStyle: {
        color: '#A06A00',
        opacity: 0.9,
        borderColor: '#FFD700',
        borderWidth: 1,
      },
      label: {
        show: showLabels,
        position: 'right',
        formatter: (params: any) => params.name,
        fontSize: 10,
        color: '#A06A00',
        backgroundColor: 'rgba(255,248,220,0.9)',
        padding: [1, 3],
        borderRadius: 2,
      },
    })
  }

  if (isChina) {
    if (ls.greatWall) {
      const gw = roadSegments.filter(r => r.type === 'great_wall')
      gw.forEach(road => {
        series.push({
          type: 'lines3D',
          coordinateSystem: 'geo3D',
          effect: {
            show: false,
          },
          lineStyle: {
            width: 4,
            color: '#C24A4A',
            opacity: 0.8,
          },
          data: [{ coords: road.coords, _nodeData: { id: road.id, name: road.name, type: 'greatWall', description: road.description } }],
          name: road.name,
        })
      })
    }

    if (ls.highways) {
      const hw = roadSegments.filter(r => r.type === 'highway')
      hw.forEach(road => {
        series.push({
          type: 'lines3D',
          coordinateSystem: 'geo3D',
          effect: {
            show: false,
          },
          lineStyle: {
            width: 2,
            color: '#00A870',
            opacity: 0.6,
            type: 'solid',
          },
          data: [{ coords: road.coords, _nodeData: { id: road.id, name: road.name, type: 'highway', description: road.description } }],
          name: road.name,
        })
      })
    }

    if (ls.ancientRoads) {
      const ar = roadSegments.filter(r => r.type === 'ancient_road')
      ar.forEach(road => {
        series.push({
          type: 'lines3D',
          coordinateSystem: 'geo3D',
          effect: {
            show: false,
          },
          lineStyle: {
            width: 2,
            color: '#A06A00',
            opacity: 0.7,
            type: 'dashed',
          },
          data: [{ coords: road.coords, _nodeData: { id: road.id, name: road.name, type: 'ancientRoad', description: road.description } }],
          name: road.name,
        })
      })
    }
  }

  return series
}

function renderChart() {
  if (!chartRef.value || !chartInstance) return

  const isWorld = mapMode.value === 'world'
  const series = buildSeries()

  const option: any = {
    backgroundColor: '#F5F7FA',
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        if (params.data && params.data._nodeData) {
          const d = params.data._nodeData
          let html = `<strong>${d.name}</strong><br/>`
          html += `类型: ${getTypeLabel(d.type)}<br/>`
          if (d.longitude !== undefined) {
            html += `经度: ${d.longitude.toFixed(2)}°E<br/>`
            html += `纬度: ${d.latitude.toFixed(2)}°N<br/>`
          }
          if (d.dynasty) html += `朝代: ${d.dynasty}<br/>`
          if (d.province) html += `省份: ${d.province}<br/>`
          if (d.population) html += `人口: ${d.population}万人<br/>`
          if (d.description) html += `简介: ${d.description}<br/>`
          if (d.value !== undefined) html += `参与学员: ${d.value}人<br/>`
          return html
        }
        if (params.name) return `<strong>${params.name}</strong>`
        return ''
      },
    },
    geo3D: {
      map: isWorld ? 'world' : 'china',
      roam: true,
      shading: 'realistic',
      environment: '#F5F7FA',
      realisticMaterial: {
        detailTexture: '#fff',
        textureTiling: 1,
        roughness: 0.6,
        metalness: 0,
      },
      viewControl: {
        autoRotate: autoRotate.value,
        autoRotateSpeed: 8,
        autoRotateAfterStill: 3,
        distance: isWorld ? 180 : 120,
        alpha: 40,
        beta: 0,
        panMouseButton: 'right',
        rotateMouseButton: 'left',
        animation: true,
        animationDurationUpdate: 1000,
        animationEasingUpdate: 'cubicInOut',
      },
      light: {
        main: {
          intensity: 1.2,
          shadow: true,
          alpha: 30,
          beta: 40,
        },
        ambient: {
          intensity: 0.4,
        },
      },
      atmosphere: {
        show: true,
        offset: 4,
        color: isWorld ? '#1E5BAA' : '#0052D9',
        glowPower: 3,
        innerGlowPower: 2,
      },
      itemStyle: {
        color: isWorld ? '#D4E3F7' : '#E8F0FE',
        borderColor: isWorld ? '#1E5BAA' : '#0052D9',
        borderWidth: isWorld ? 0.5 : 1,
        opacity: 0.9,
      },
      label: {
        show: false,
      },
      emphasis: {
        label: {
          show: true,
          color: isWorld ? '#1E5BAA' : '#0052D9',
          fontSize: 12,
        },
        itemStyle: {
          color: isWorld ? '#B8D0F0' : '#CCE0FF',
        },
      },
      regionHeight: isWorld ? 1 : 2,
    },
    series,
  }

  chartInstance.setOption(option, true)
}

async function loadMapData() {
  loading.value = true
  try {
    if (mapMode.value === 'world') {
      const worldJson = await loadWorldMap()
      echarts.registerMap('world', worldJson)
    } else {
      const chinaJson = await loadChinaMap()
      echarts.registerMap('china', chinaJson)
    }
    mapReady.value = true

    const data = mockMapData()
    allNodes.value = data.nodes
    allLinks.value = data.links

    await nextTick()
    initChart()
  } catch (e: any) {
    console.error('初始化地图失败:', e)
    MessagePlugin.error(e.message || '地图加载失败')
    mapReady.value = false
  } finally {
    loading.value = false
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
  loadMapData()
  document.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('keydown', handleKeydown)
  chartInstance?.dispose()
})

watch([filterTopic, filterRegion], () => {
  if (mapReady.value) renderChart()
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
  grid-template-columns: repeat(3, 1fr);
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
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.map-wrapper {
  position: relative;
}

.map-wrapper.map-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background: #F5F7FA;
}

.map-card {
  overflow: hidden;
  border-radius: 6px;
  border: 1px solid #E7E7EA;
  background: #fff;
}

.map-fullscreen .map-card {
  width: 100%;
  height: 100%;
  border-radius: 0;
  border: none;
}

.chart-container {
  width: 100%;
  height: 640px;
  min-height: 640px;
}

.map-fullscreen .chart-container {
  width: 100%;
  height: 100vh;
  min-height: 100%;
}

.fullscreen-topbar {
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
}

.fullscreen-title {
  font-size: 16px;
  font-weight: 600;
  color: #1F2329;
  white-space: nowrap;
}

.layer-panel {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 240px;
  z-index: 10;
}

.map-fullscreen .layer-panel {
  top: 70px;
  right: 20px;
  z-index: 20;
}

.layer-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 12px;
}

.layer-panel-header {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1F2329;
}

.layer-panel-title {
  font-size: 14px;
  font-weight: 600;
}

.layer-group {
  margin-bottom: 12px;
}

.layer-group-title {
  font-size: 12px;
  color: #646A73;
  margin-bottom: 6px;
  font-weight: 500;
}

.layer-group :deep(.t-checkbox) {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
}

.layer-dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 6px;
  flex-shrink: 0;
}

.quick-jump {
  margin-top: 4px;
}

.jump-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.jump-buttons :deep(.t-button) {
  flex: 1 1 calc(50% - 3px);
  min-width: 0;
}

:deep(.t-divider--vertical) {
  height: 24px;
}
</style>
