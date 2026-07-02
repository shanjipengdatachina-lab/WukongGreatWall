<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">成果管理</h2>
    </div>

    <t-card class="content-card" :bordered="false">
      <t-tabs v-model="activeTab" @change="handleTabChange">
        <t-tab-panel value="all" label="全部成果" />
        <t-tab-panel value="excellent" label="优秀提交" />
        <t-tab-panel value="exhibition" label="结题成果展" />
      </t-tabs>

      <div class="filter-bar" style="margin-top:0;padding:16px 0">
        <t-form layout="inline" :data="filters" @submit="handleSearch" @reset="handleReset">
          <t-form-item label="成果名称">
            <t-input v-model="filters.keyword" placeholder="请输入成果名称" clearable style="width:180px" />
          </t-form-item>
          <t-form-item label="成果类型">
            <t-select v-model="filters.type" placeholder="请选择类型" clearable style="width:140px">
              <t-option value="render" label="渲染图" />
              <t-option value="document" label="技术文档" />
              <t-option value="video" label="视频" />
              <t-option value="model" label="模型" />
            </t-select>
          </t-form-item>
          <t-form-item label="所属课题">
            <t-select v-model="filters.topicId" placeholder="请选择课题" clearable style="width:200px">
              <t-option v-for="t in topicOptions" :key="t.id" :value="t.id" :label="t.title" />
            </t-select>
          </t-form-item>
          <t-form-item>
            <t-button theme="primary" type="submit">查询</t-button>
            <t-button variant="outline" type="reset" style="margin-left:8px">重置</t-button>
          </t-form-item>
        </t-form>
      </div>

      <div class="table-header">
        <span class="table-title">成果列表</span>
        <div class="toolbar-actions">
          <t-button theme="primary" @click="handleCreate">
            <template #icon><t-icon name="add" /></template>
            新建成果
          </t-button>
        </div>
      </div>

      <t-loading :loading="loading" size="medium">
        <t-table
          v-if="dataSource.length > 0"
          row-key="id"
          :data="dataSource"
          :columns="columns"
          :pagination="pagination"
          stripe
          hover
          table-layout="auto"
          @page-change="handlePageChange"
        >
          <template #thumbnail="{ row }">
            <t-image
              v-if="row.thumbnail"
              :src="row.thumbnail"
              fit="cover"
              style="width:60px;height:40px;border-radius:4px"
            />
            <div v-else class="thumbnail-placeholder">
              <t-icon :name="outcomeTypeIcon(row.type)" size="20px" />
            </div>
          </template>
          <template #type="{ row }">
            <t-tag :theme="outcomeTypeTheme(row.type)" variant="light" size="small">
              {{ outcomeTypeLabel(row.type) }}
            </t-tag>
          </template>
          <template #authors="{ row }">
            <span>{{ row.authors.join('、') }}</span>
          </template>
          <template #school="{ row }">
            <span>{{ getSchool(row) }}</span>
          </template>
          <template #status="{ row }">
            <t-tag :theme="outcomeStatusTheme(row.status)" variant="light" size="small">
              {{ outcomeStatusLabel(row.status) }}
            </t-tag>
          </template>
          <template #featured="{ row }">
            <t-switch
              :value="featuredMap[row.id] ?? false"
              size="small"
              @change="(val: boolean) => handleToggleFeatured(row, val)"
            />
          </template>
          <template #operation="{ row }">
            <t-space size="small">
              <t-link theme="primary" hover="color" @click="handleViewDetail(row)">预览</t-link>
              <t-link theme="primary" hover="color" @click="handleEdit(row)">编辑</t-link>
              <t-popconfirm content="删除不删除原始提交，确认删除？" @confirm="handleDelete(row)">
                <t-link theme="danger" hover="color">删除</t-link>
              </t-popconfirm>
            </t-space>
          </template>
        </t-table>
        <t-empty v-else :description="`暂无${activeTabLabel}数据`" />
      </t-loading>
    </t-card>

    <t-drawer
      v-model:visible="drawerVisible"
      header="成果详情"
      size="560px"
      :footer="false"
    >
      <t-loading :loading="drawerLoading" size="small">
        <template v-if="currentOutcome">
          <div class="drawer-section">
            <t-image
              v-if="currentOutcome.thumbnail"
              :src="currentOutcome.thumbnail"
              fit="cover"
              style="width:100%;height:240px;border-radius:8px;margin-bottom:16px"
            />
            <div v-else class="drawer-thumbnail-placeholder">
              <t-icon :name="outcomeTypeIcon(currentOutcome.type)" size="48px" />
            </div>
          </div>
          <div class="drawer-section">
            <h3 class="drawer-title">{{ currentOutcome.title }}</h3>
            <t-tag :theme="outcomeTypeTheme(currentOutcome.type)" variant="light" size="small" style="margin-top:8px">
              {{ outcomeTypeLabel(currentOutcome.type) }}
            </t-tag>
            <t-tag :theme="outcomeStatusTheme(currentOutcome.status)" variant="light" size="small" style="margin:8px 0 0 8px">
              {{ outcomeStatusLabel(currentOutcome.status) }}
            </t-tag>
          </div>
          <t-divider />
          <div class="drawer-section">
            <div class="drawer-info-grid">
              <div class="drawer-info-item">
                <span class="drawer-info-label">成果ID</span>
                <span class="drawer-info-value">{{ currentOutcome.id }}</span>
              </div>
              <div class="drawer-info-item">
                <span class="drawer-info-label">贡献者</span>
                <span class="drawer-info-value">{{ currentOutcome.authors.join('、') }}</span>
              </div>
              <div class="drawer-info-item">
                <span class="drawer-info-label">关联课题</span>
                <span class="drawer-info-value">{{ currentOutcome.topicTitle }}</span>
              </div>
              <div class="drawer-info-item">
                <span class="drawer-info-label">院校</span>
                <span class="drawer-info-value">{{ getSchool(currentOutcome) }}</span>
              </div>
              <div class="drawer-info-item">
                <span class="drawer-info-label">文件大小</span>
                <span class="drawer-info-value">{{ currentOutcome.fileSize }}</span>
              </div>
              <div class="drawer-info-item">
                <span class="drawer-info-label">创建时间</span>
                <span class="drawer-info-value">{{ currentOutcome.createdAt }}</span>
              </div>
              <div class="drawer-info-item">
                <span class="drawer-info-label">更新时间</span>
                <span class="drawer-info-value">{{ currentOutcome.updatedAt }}</span>
              </div>
            </div>
          </div>
          <t-divider />
          <div class="drawer-section">
            <h4 class="drawer-subtitle">成果描述</h4>
            <p class="drawer-desc">{{ currentOutcome.description }}</p>
          </div>
          <t-divider />
          <div class="drawer-section">
            <h4 class="drawer-subtitle">相关文件</h4>
            <div v-if="currentOutcome.fileUrl" class="file-item">
              <t-icon name="file" />
              <span class="file-name">{{ currentOutcome.title }}.zip</span>
              <span class="file-size">{{ currentOutcome.fileSize }}</span>
              <t-button variant="text" theme="primary" size="small" @click="handleDownload(currentOutcome)">下载</t-button>
            </div>
            <t-empty v-else description="暂无文件" size="small" />
          </div>
        </template>
        <t-empty v-else description="加载失败" />
      </t-loading>
    </t-drawer>

    <t-dialog
      v-model:visible="dialogVisible"
      :header="dialogTitle"
      :confirm-btn="{ content: '保存', theme: 'primary', loading: submitting }"
      :cancel-btn="{ content: '取消' }"
      width="560px"
      @confirm="handleSubmit"
      @close="handleDialogClose"
    >
      <t-form ref="formRef" :data="formData" :rules="formRules" label-width="90px">
        <t-form-item label="成果名称" name="title">
          <t-input v-model="formData.title" placeholder="请输入成果名称" />
        </t-form-item>
        <t-form-item label="成果类型" name="type">
          <t-select v-model="formData.type" placeholder="请选择成果类型">
            <t-option value="render" label="渲染图" />
            <t-option value="document" label="技术文档" />
            <t-option value="video" label="视频" />
            <t-option value="model" label="模型" />
          </t-select>
        </t-form-item>
        <t-form-item label="关联课题" name="topicId">
          <t-select v-model="formData.topicId" placeholder="请选择关联课题">
            <t-option v-for="t in topicOptions" :key="t.id" :value="t.id" :label="t.title" />
          </t-select>
        </t-form-item>
        <t-form-item label="贡献者" name="authors">
          <t-input v-model="formData.authorsText" placeholder="请输入贡献者名称，多个用顿号分隔" />
        </t-form-item>
        <t-form-item label="成果描述" name="description">
          <t-textarea v-model="formData.description" placeholder="请输入成果描述" :autosize="{ minRows: 3, maxRows: 5 }" />
        </t-form-item>
        <t-form-item label="文件上传" name="file">
          <t-upload
            v-model="formData.uploadFiles"
            theme="file"
            :auto-upload="false"
            :max="1"
            tips="支持 zip/rar/pdf/doc/docx/jpg/png/mp4 格式文件"
          />
        </t-form-item>
      </t-form>
    </t-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { mockOutcomes } from '@/mock/outcomes'
import { mockTopics } from '@/mock/topics'
import type { Outcome } from '@/mock/types'

const loading = ref(false)
const dataSource = ref<Outcome[]>([])
const allOutcomes = ref<Outcome[]>([])
const activeTab = ref('all')

const activeTabLabel = computed(() => {
  const map: Record<string, string> = { all: '全部成果', excellent: '优秀提交', exhibition: '结题成果展' }
  return map[activeTab.value] || '成果'
})

const featuredMap = reactive<Record<string, boolean>>({})

const topicMap = computed(() => {
  const map: Record<string, string> = {}
  const topics = mockTopics(1, 100).items
  topics.forEach(t => {
    map[t.id] = t.leaderUniversity
  })
  return map
})

const topicOptions = computed(() => {
  return mockTopics(1, 100).items.map(t => ({ id: t.id, title: t.title }))
})

function getSchool(row: Outcome): string {
  return topicMap.value[row.topicId] || '未知院校'
}

const filters = reactive({
  keyword: '',
  type: '',
  topicId: '',
})

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showJumper: true,
  showPageSize: true,
  pageSizeOptions: [10, 20, 50],
})

const columns = [
  { colKey: 'id', title: 'ID', width: 90 },
  { colKey: 'thumbnail', title: '缩略图', width: 80, cell: 'thumbnail' },
  { colKey: 'title', title: '成果名称', ellipsis: true, width: 200 },
  { colKey: 'type', title: '成果类型', width: 100, cell: 'type' },
  { colKey: 'authors', title: '贡献者', width: 140, ellipsis: true, cell: 'authors' },
  { colKey: 'school', title: '所属院校', width: 160, ellipsis: true, cell: 'school' },
  { colKey: 'topicTitle', title: '关联课题', width: 180, ellipsis: true },
  { colKey: 'status', title: '发布状态', width: 90, cell: 'status' },
  { colKey: 'featured', title: '加入成果展', width: 100, cell: 'featured' },
  { colKey: 'operation', title: '操作', width: 170, fixed: 'right', cell: 'operation' },
]

function outcomeTypeTheme(type: string): 'primary' | 'success' | 'warning' | 'danger' {
  const map: Record<string, 'primary' | 'success' | 'warning' | 'danger'> = {
    render: 'primary',
    document: 'success',
    video: 'warning',
    model: 'danger',
  }
  return map[type] || 'primary'
}

function outcomeTypeLabel(type: string): string {
  const map: Record<string, string> = {
    render: '渲染图',
    document: '技术文档',
    video: '视频',
    model: '模型',
  }
  return map[type] || type
}

function outcomeTypeIcon(type: string): string {
  const map: Record<string, string> = {
    render: 'image',
    document: 'file-paste',
    video: 'play-circle',
    model: 'layers',
  }
  return map[type] || 'file'
}

function outcomeStatusTheme(status: string): 'success' | 'default' | 'warning' {
  const map: Record<string, 'success' | 'default' | 'warning'> = {
    approved: 'success',
    draft: 'default',
    submitted: 'warning',
  }
  return map[status] || 'default'
}

function outcomeStatusLabel(status: string): string {
  const map: Record<string, string> = {
    approved: '已发布',
    draft: '未发布',
    submitted: '审核中',
  }
  return map[status] || status
}

function applyFilters(): Outcome[] {
  let filtered = [...allOutcomes.value]

  if (activeTab.value === 'exhibition') {
    filtered = filtered.filter(o => featuredMap[o.id])
  } else if (activeTab.value === 'excellent') {
    filtered = filtered.filter(o => o.status === 'approved')
  }

  if (filters.keyword) {
    const kw = filters.keyword.toLowerCase()
    filtered = filtered.filter(o => o.title.toLowerCase().includes(kw))
  }
  if (filters.type) {
    filtered = filtered.filter(o => o.type === filters.type)
  }
  if (filters.topicId) {
    filtered = filtered.filter(o => o.topicId === filters.topicId)
  }

  return filtered
}

function fetchData() {
  loading.value = true
  try {
    allOutcomes.value = mockOutcomes(1, 100).items
    const filtered = applyFilters()
    pagination.total = filtered.length
    const start = (pagination.current - 1) * pagination.pageSize
    dataSource.value = filtered.slice(start, start + pagination.pageSize)
  } catch {
    MessagePlugin.error('加载成果列表失败')
    dataSource.value = []
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
  filters.type = ''
  filters.topicId = ''
  pagination.current = 1
  fetchData()
}

function handleTabChange() {
  pagination.current = 1
  fetchData()
}

function handlePageChange(pageInfo: { current: number; pageSize: number }) {
  pagination.current = pageInfo.current
  pagination.pageSize = pageInfo.pageSize
  fetchData()
}

function handleToggleFeatured(row: Outcome, val: boolean) {
  featuredMap[row.id] = val
  MessagePlugin.success(val ? '已加入成果展' : '已移出成果展')
  if (activeTab.value === 'exhibition') {
    fetchData()
  }
}

const drawerVisible = ref(false)
const drawerLoading = ref(false)
const currentOutcome = ref<Outcome | null>(null)

function handleViewDetail(row: Outcome) {
  drawerLoading.value = true
  currentOutcome.value = row
  drawerVisible.value = true
  setTimeout(() => {
    drawerLoading.value = false
  }, 300)
}

function handleDownload(row: Outcome) {
  MessagePlugin.success(`正在下载: ${row.title}`)
}

const dialogVisible = ref(false)
const submitting = ref(false)
const editingOutcome = ref<Outcome | null>(null)

const dialogTitle = computed(() => (editingOutcome.value ? '编辑成果' : '新建成果'))

const formData = reactive({
  title: '',
  type: 'document' as string,
  topicId: '',
  authorsText: '',
  description: '',
  uploadFiles: [] as any[],
})

const formRules = {
  title: [{ required: true, message: '请输入成果名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择成果类型', trigger: 'change' }],
  topicId: [{ required: true, message: '请选择关联课题', trigger: 'change' }],
  authorsText: [{ required: true, message: '请输入贡献者', trigger: 'blur' }],
}

const formRef = ref()

function handleCreate() {
  editingOutcome.value = null
  formData.title = ''
  formData.type = 'document'
  formData.topicId = ''
  formData.authorsText = ''
  formData.description = ''
  formData.uploadFiles = []
  dialogVisible.value = true
}

function handleEdit(row: Outcome) {
  editingOutcome.value = row
  formData.title = row.title
  formData.type = row.type
  formData.topicId = row.topicId
  formData.authorsText = row.authors.join('、')
  formData.description = row.description
  formData.uploadFiles = []
  dialogVisible.value = true
}

function handleDialogClose() {
  formRef.value?.reset()
}

async function handleSubmit() {
  const valid = await formRef.value?.validate()
  if (valid !== true) return

  submitting.value = true
  try {
    if (editingOutcome.value) {
      editingOutcome.value.title = formData.title
      editingOutcome.value.type = formData.type as Outcome['type']
      editingOutcome.value.description = formData.description
      editingOutcome.value.authors = formData.authorsText.split('、').filter(Boolean)
      editingOutcome.value.fileSize = formData.uploadFiles.length > 0 ? '3.5MB' : editingOutcome.value.fileSize
      MessagePlugin.success('成果编辑成功')
    } else {
      const selectedTopic = mockTopics(1, 100).items.find(t => t.id === formData.topicId)
      const newOutcome: Outcome = {
        id: 'OUT' + String(Date.now()).slice(-5),
        topicId: formData.topicId,
        topicTitle: selectedTopic?.title || '未知课题',
        title: formData.title,
        description: formData.description,
        type: formData.type as Outcome['type'],
        authors: formData.authorsText.split('、').filter(Boolean),
        fileUrl: '',
        fileSize: formData.uploadFiles.length > 0 ? '3.5MB' : '0B',
        thumbnail: '',
        status: 'draft',
        createdAt: new Date().toISOString().slice(0, 10),
        updatedAt: new Date().toISOString().slice(0, 10),
      }
      allOutcomes.value.unshift(newOutcome)
      MessagePlugin.success('成果创建成功')
    }
    dialogVisible.value = false
    fetchData()
  } catch {
    MessagePlugin.error('操作失败，请重试')
  } finally {
    submitting.value = false
  }
}

function handleDelete(row: Outcome) {
  const idx = allOutcomes.value.findIndex(o => o.id === row.id)
  if (idx > -1) {
    allOutcomes.value.splice(idx, 1)
  }
  MessagePlugin.success('成果已删除')
  fetchData()
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.content-card {
  border-radius: 6px;
}

.content-card :deep(.t-card__body) {
  padding-top: 8px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 16px;
}

.table-title {
  font-size: 16px;
  font-weight: 600;
  color: #1F2329;
}

.thumbnail-placeholder {
  width: 60px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F5F7FA;
  border-radius: 4px;
  color: #BBBFC4;
}

.drawer-section {
  margin-bottom: 8px;
}

.drawer-thumbnail-placeholder {
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F5F7FA;
  border-radius: 8px;
  color: #BBBFC4;
}

.drawer-title {
  font-size: 18px;
  font-weight: 600;
  color: #1F2329;
}

.drawer-subtitle {
  font-size: 15px;
  font-weight: 600;
  color: #1F2329;
  margin-bottom: 8px;
}

.drawer-desc {
  font-size: 14px;
  color: #646A73;
  line-height: 1.8;
}

.drawer-info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.drawer-info-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.drawer-info-label {
  font-size: 12px;
  color: #646A73;
}

.drawer-info-value {
  font-size: 14px;
  color: #1F2329;
  font-weight: 500;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: #F5F7FA;
  border-radius: 6px;
}

.file-name {
  flex: 1;
  font-size: 14px;
  color: #1F2329;
}

.file-size {
  font-size: 12px;
  color: #646A73;
}
</style>
