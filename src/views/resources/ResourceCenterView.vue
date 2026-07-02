<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">资源中心</h2>
    </div>

    <div class="filter-bar">
      <t-form layout="inline" :data="filters" @submit="handleSearch" @reset="handleReset">
        <t-form-item label="文件名">
          <t-input v-model="filters.keyword" placeholder="请输入文件名" clearable style="width: 200px" />
        </t-form-item>
        <t-form-item label="文件类型">
          <t-select v-model="filters.format" placeholder="全部" clearable style="width: 140px">
            <t-option value="pdf" label="PDF" />
            <t-option value="zip" label="ZIP" />
            <t-option value="blend" label="BLEND" />
            <t-option value="ply" label="PLY" />
          </t-select>
        </t-form-item>
        <t-form-item label="归属模块">
          <t-select v-model="filters.module" placeholder="全部" clearable style="width: 140px">
            <t-option value="course" label="课程" />
            <t-option value="assignment" label="作业" />
            <t-option value="topic" label="课题" />
            <t-option value="outcome" label="成果" />
          </t-select>
        </t-form-item>
        <t-form-item label="可见范围">
          <t-select v-model="filters.visibility" placeholder="全部" clearable style="width: 140px">
            <t-option value="all" label="全部可见" />
            <t-option value="topic_member" label="课题成员" />
            <t-option value="admin" label="仅管理员" />
          </t-select>
        </t-form-item>
        <t-form-item>
          <t-space size="8px">
            <t-button theme="primary" type="submit">查询</t-button>
            <t-button variant="outline" type="reset">重置</t-button>
          </t-space>
        </t-form-item>
      </t-form>
    </div>

    <t-loading :loading="loading" size="medium">
      <div v-if="!isEmpty" class="table-container">
        <t-table
          row-key="id"
          :data="dataSource"
          :columns="columns"
          :pagination="{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
          }"
          stripe
          hover
          table-layout="auto"
          @page-change="handlePageChange"
        >
          <template #format="{ row }">
            <t-tag :theme="formatTagTheme(row.format)" variant="light" size="small">
              {{ row.format.toUpperCase() }}
            </t-tag>
          </template>
          <template #moduleTitle="{ row }">
            <t-tag :theme="moduleTagTheme(row.module)" variant="light" size="small">
              {{ row.moduleTitle }}
            </t-tag>
          </template>
          <template #visibility="{ row }">
            <t-tag :theme="visibilityTagTheme(getVisibility(row))" variant="light" size="small">
              {{ visibilityLabel(getVisibility(row)) }}
            </t-tag>
          </template>
          <template #operation="{ row }">
            <t-space size="small">
              <t-popconfirm content="确认下载该资源？" @confirm="handleDownload(row)">
                <t-link theme="primary" hover="color">下载</t-link>
              </t-popconfirm>
              <t-link theme="primary" hover="color" @click="handleCopyLink(row)">复制链接</t-link>
              <t-link theme="warning" hover="color" @click="handleOpenReplace(row)">替换</t-link>
              <t-popconfirm content="确认删除该资源？删除后不可恢复。" @confirm="handleDelete(row)">
                <t-link theme="danger" hover="color">删除</t-link>
              </t-popconfirm>
            </t-space>
          </template>
        </t-table>
      </div>
      <t-empty v-else description="暂无资源数据" />
    </t-loading>

    <t-dialog
      v-model:visible="replaceDialogVisible"
      header="替换资源文件"
      :confirm-btn="{ content: '确认替换', theme: 'primary' }"
      :cancel-btn="{ content: '取消' }"
      width="480px"
      @confirm="handleReplaceConfirm"
    >
      <div class="replace-info">
        <t-descriptions :column="1" bordered>
          <t-descriptions-item label="当前文件">
            {{ replaceTarget?.title }}
          </t-descriptions-item>
          <t-descriptions-item label="当前格式">
            {{ replaceTarget?.format?.toUpperCase() }}
          </t-descriptions-item>
        </t-descriptions>
      </div>
      <t-divider />
      <t-upload
        v-model="replaceFiles"
        :auto-upload="false"
        theme="file"
        accept="*"
        :max="1"
        placeholder="选择新文件替换"
      />
    </t-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { mockResources } from '@/mock/resources'
import type { Resource } from '@/mock/types'

const loading = ref(false)
const dataSource = ref<Resource[]>([])
const isEmpty = computed(() => !loading.value && dataSource.value.length === 0)

const filters = reactive({
  keyword: '',
  format: '',
  module: '',
  visibility: '',
})

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
})

const replaceDialogVisible = ref(false)
const replaceTarget = ref<Resource | null>(null)
const replaceFiles = ref<any[]>([])

const columns = [
  { colKey: 'title', title: '文件名', ellipsis: true, width: 260 },
  { colKey: 'format', title: '文件类型', width: 100 },
  { colKey: 'moduleTitle', title: '归属模块', ellipsis: true, width: 200 },
  { colKey: 'fileSize', title: '文件大小', width: 100 },
  { colKey: 'uploader', title: '上传人', width: 100 },
  { colKey: 'uploadTime', title: '上传时间', width: 170 },
  { colKey: 'visibility', title: '可见范围', width: 100 },
  { colKey: 'operation', title: '操作', width: 240 },
]

function getVisibility(row: Resource): string {
  if (row.module === 'course' || row.module === 'outcome') return 'all'
  if (row.module === 'assignment') return 'admin'
  return 'topic_member'
}

function visibilityLabel(val: string): string {
  const map: Record<string, string> = {
    all: '全部可见',
    topic_member: '课题成员',
    admin: '仅管理员',
  }
  return map[val] || val
}

function visibilityTagTheme(val: string): string {
  const map: Record<string, string> = {
    all: 'success',
    topic_member: 'warning',
    admin: 'danger',
  }
  return map[val] || 'default'
}

function formatTagTheme(format: string): string {
  const map: Record<string, string> = {
    pdf: 'danger',
    zip: 'warning',
    ppt: 'success',
    pptx: 'success',
    doc: 'default',
    docx: 'default',
    blend: 'primary',
    ply: 'default',
  }
  return map[format?.toLowerCase()] || 'default'
}

function moduleTagTheme(module: string): string {
  const map: Record<string, string> = {
    course: 'primary',
    assignment: 'warning',
    topic: 'success',
    outcome: 'default',
  }
  return map[module] || 'default'
}

function fetchData() {
  loading.value = true
  try {
    const res = mockResources(pagination.current, pagination.pageSize, {
      type: filters.format || undefined,
      module: filters.module || undefined,
    })
    let filtered = res.items
    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase()
      filtered = filtered.filter(r => r.title.toLowerCase().includes(kw))
    }
    dataSource.value = filtered
    pagination.total = res.total
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  pagination.current = 1
  fetchData()
}

function handleReset() {
  filters.keyword = ''
  filters.format = ''
  filters.module = ''
  filters.visibility = ''
  pagination.current = 1
  fetchData()
}

function handlePageChange(pageInfo: { current: number; pageSize: number }) {
  pagination.current = pageInfo.current
  pagination.pageSize = pageInfo.pageSize
  fetchData()
}

function handleDownload(row: Resource) {
  MessagePlugin.success(`开始下载: ${row.title}`)
}

function handleCopyLink(row: Resource) {
  const link = `https://resource.wukongcloud.com/resources/${row.id}`
  navigator.clipboard.writeText(link).then(() => {
    MessagePlugin.success('链接已复制到剪贴板')
  }).catch(() => {
    MessagePlugin.warning('复制失败，请手动复制')
  })
}

function handleOpenReplace(row: Resource) {
  replaceTarget.value = row
  replaceFiles.value = []
  replaceDialogVisible.value = true
}

function handleReplaceConfirm() {
  if (replaceFiles.value.length === 0) {
    MessagePlugin.warning('请选择要替换的文件')
    return
  }
  MessagePlugin.success(`文件 ${replaceTarget.value?.title} 替换成功`)
  replaceDialogVisible.value = false
  replaceTarget.value = null
  replaceFiles.value = []
  fetchData()
}

function handleDelete(row: Resource) {
  MessagePlugin.success(`资源 ${row.title} 已删除`)
  fetchData()
}

onMounted(() => {
  fetchData()
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

.filter-bar {
  margin-bottom: 16px;
  padding: 16px;
  background: #fff;
  border-radius: 6px;
}

.table-container {
  background: #fff;
  border-radius: 6px;
  padding: 0;
}

.replace-info {
  margin-bottom: 8px;
}
</style>
