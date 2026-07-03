<template>
  <div class="page-container">
    <div class="page-header">
      <span class="page-title">课程管理</span>
    </div>

    <t-tabs v-model="activeTab" class="course-tabs" @change="onTabChange">
      <t-tab-panel value="course" label="课程">
        <div class="table-container">
          <div class="table-header">
            <span class="table-title">课程列表</span>
            <div class="toolbar-actions">
              <t-button theme="primary" @click="openCourseForm(false)">
                <template #icon><t-icon name="add" /></template>
                新建课程
              </t-button>
            </div>
          </div>

          <t-loading :loading="courseLoading">
            <t-table
              v-if="courses.length > 0"
              :data="courses"
              :columns="courseColumns"
              row-key="id"
              hover
              stripe
            >
              <template #status="{ row }">
                <t-tag :theme="row.status === 'published' ? 'success' : row.status === 'archived' ? 'warning' : 'default'" variant="light">
                  {{ row.status === 'published' ? '已发布' : row.status === 'archived' ? '已归档' : '草稿' }}
                </t-tag>
              </template>
              <template #chapters="{ row }">
                <t-space size="small">
                  <t-tag v-for="ch in (row.chapters || [])" :key="ch.id" variant="outline" size="small">
                    {{ ch.title }}
                  </t-tag>
                  <span v-if="!row.chapters || row.chapters.length === 0" style="color:#999">暂无章节</span>
                </t-space>
              </template>
              <template #operation="{ row }">
                <t-space size="small">
                  <t-link theme="primary" hover="color" @click="openChapterDialog(row)">管理章节</t-link>
                  <t-link theme="primary" hover="color" @click="openCourseForm(row)">编辑</t-link>
                  <t-popconfirm content="确定删除该课程？" @confirm="handleDeleteCourse(row)">
                    <t-link theme="danger" hover="color">删除</t-link>
                  </t-popconfirm>
                  <t-popconfirm
                    v-if="row.status !== 'published'"
                    content="确定发布该课程？"
                    @confirm="handleTogglePublish(row)"
                  >
                    <t-link theme="success" hover="color">发布</t-link>
                  </t-popconfirm>
                  <t-popconfirm
                    v-else
                    content="确定取消发布？"
                    @confirm="handleTogglePublish(row)"
                  >
                    <t-link theme="warning" hover="color">取消发布</t-link>
                  </t-popconfirm>
                </t-space>
              </template>
            </t-table>
            <t-empty v-else description="暂无课程数据" />
          </t-loading>
        </div>
      </t-tab-panel>

      <t-tab-panel value="resource" label="资源">
        <div class="filter-bar">
          <t-form layout="inline" :data="resourceFilters" @submit="onResourceFilter">
            <t-form-item label="资源名称">
              <t-input v-model="resourceFilters.keyword" placeholder="搜索资源名称" clearable />
            </t-form-item>
            <t-form-item label="资源类型">
              <t-select
                v-model="resourceFilters.type"
                placeholder="全部类型"
                clearable
                style="width: 160px"
              >
                <t-option value="" label="全部" />
                <t-option value="course" label="课件" />
                <t-option value="assignment" label="作业附件" />
                <t-option value="other" label="其他" />
              </t-select>
            </t-form-item>
            <t-form-item>
              <t-space>
                <t-button theme="primary" type="submit">查询</t-button>
                <t-button variant="outline" type="reset" @click="resetResourceFilter">重置</t-button>
              </t-space>
            </t-form-item>
          </t-form>
        </div>

        <div class="table-container">
          <div class="table-header">
            <span class="table-title">资源列表</span>
            <div class="toolbar-actions">
              <t-button theme="primary" @click="openResourceDialog()">
                <template #icon><t-icon name="upload" /></template>
                上传资源
              </t-button>
            </div>
          </div>

          <t-loading :loading="resourceLoading">
            <t-table
              v-if="filteredResources.length > 0"
              :data="filteredResources"
              :columns="resourceColumns"
              row-key="id"
              hover
              stripe
              :pagination="resourcePagination"
              @page-change="onResourcePageChange"
            >
              <template #type="{ row }">
                <t-tag :theme="resourceTypeTheme(row.file_type)" variant="light">
                  {{ resourceTypeLabel(row.file_type) }}
                </t-tag>
              </template>
              <template #operation="{ row }">
                <t-space size="small">
                  <t-popconfirm content="确定删除该资源？" @confirm="handleDeleteResource(row)">
                    <t-link theme="danger" hover="color">删除</t-link>
                  </t-popconfirm>
                  <t-link theme="primary" hover="color" @click="handleDownload(row)">下载</t-link>
                </t-space>
              </template>
            </t-table>
            <t-empty v-else description="暂无资源数据" />
          </t-loading>
        </div>
      </t-tab-panel>
    </t-tabs>

    <t-dialog
      v-model:visible="courseDialogVisible"
      :header="courseFormData.id ? '编辑课程' : '新建课程'"
      :confirm-btn="{ content: '保存', theme: 'primary', loading: submitting }"
      width="560px"
      @confirm="handleSaveCourse"
      @close="resetCourseForm"
    >
      <t-form ref="courseFormRef" :data="courseFormData" :rules="courseFormRules" label-width="90px">
        <t-form-item label="课程名称" name="name">
          <t-input v-model="courseFormData.name" placeholder="请输入课程名称" />
        </t-form-item>
        <t-form-item label="课程编码" name="code">
          <t-input v-model="courseFormData.code" placeholder="请输入课程编码" />
        </t-form-item>
        <t-form-item label="课程描述" name="description">
          <t-textarea v-model="courseFormData.description" placeholder="请输入课程描述" :maxlength="500" />
        </t-form-item>
        <t-form-item label="开始日期" name="start_date">
          <t-date-picker v-model="courseFormData.start_date" placeholder="请选择开始日期" style="width:100%" />
        </t-form-item>
        <t-form-item label="结束日期" name="end_date">
          <t-date-picker v-model="courseFormData.end_date" placeholder="请选择结束日期" style="width:100%" />
        </t-form-item>
      </t-form>
    </t-dialog>

    <t-dialog
      v-model:visible="chapterDialogVisible"
      :header="chapterDialogTitle"
      :confirm-btn="null"
      :cancel-btn="null"
      width="640px"
    >
      <div class="chapter-toolbar">
        <t-button theme="primary" size="small" @click="openChapterForm()">
          <template #icon><t-icon name="add" /></template>
          添加章节
        </t-button>
      </div>
      <t-table
        v-if="chapterList.length > 0"
        :data="chapterList"
        :columns="chapterColumns"
        row-key="id"
        hover
        stripe
        size="small"
        max-height="300"
      >
        <template #content="{ row }">
          <span style="color:#999;font-size:12px;">{{ (row.content || '').slice(0, 40) }}{{ (row.content || '').length > 40 ? '...' : '' }}</span>
        </template>
        <template #operation="{ row }">
          <t-space size="small">
            <t-link theme="primary" hover="color" size="small" @click="editChapter(row)">编辑</t-link>
            <t-popconfirm content="确定删除该章节？" @confirm="handleDeleteChapter(row)">
              <t-link theme="danger" hover="color" size="small">删除</t-link>
            </t-popconfirm>
          </t-space>
        </template>
      </t-table>
      <t-empty v-else description="暂无章节，请添加" />
    </t-dialog>

    <t-dialog
      v-model:visible="chapterFormVisible"
      :header="chapterFormData.id ? '编辑章节' : '新建章节'"
      :confirm-btn="{ content: '保存', theme: 'primary', loading: submitting }"
      width="520px"
      @confirm="handleSaveChapter"
      @close="resetChapterForm"
    >
      <t-form ref="chapterFormRef" :data="chapterFormData" :rules="chapterFormRules" label-width="90px">
        <t-form-item label="章节标题" name="title">
          <t-input v-model="chapterFormData.title" placeholder="请输入章节标题" />
        </t-form-item>
        <t-form-item label="章节描述" name="content">
          <t-textarea v-model="chapterFormData.content" placeholder="请输入章节内容/描述" :maxlength="500" />
        </t-form-item>
        <t-form-item label="排序" name="order">
          <t-input v-model.number="chapterFormData.order" placeholder="排序号（数字越小越靠前）" />
        </t-form-item>
        <t-form-item label="时长" name="duration">
          <t-input v-model="chapterFormData.duration" placeholder="例如：45分钟" />
        </t-form-item>
      </t-form>
    </t-dialog>

    <t-dialog
      v-model:visible="resourceDialogVisible"
      header="上传资源"
      :confirm-btn="{ content: '上传', theme: 'primary', loading: submitting }"
      width="560px"
      @confirm="handleSaveResource"
      @close="resetResourceForm"
    >
      <t-form ref="resourceFormRef" :data="resourceFormData" :rules="resourceFormRules" label-width="90px">
        <t-form-item label="资源名称" name="original_name">
          <t-input v-model="resourceFormData.original_name" placeholder="请输入资源名称" />
        </t-form-item>
        <t-form-item label="资源类型" name="file_type">
          <t-select v-model="resourceFormData.file_type" placeholder="请选择资源类型">
            <t-option value="course" label="课件资料" />
            <t-option value="assignment" label="作业附件" />
            <t-option value="topic" label="课题资料" />
            <t-option value="other" label="其他" />
          </t-select>
        </t-form-item>
        <t-form-item label="上传文件" name="file">
          <t-upload
            v-model="resourceFiles"
            theme="file"
            :auto-upload="false"
            :max="1"
            accept=".pdf,.zip,.rar,.7z,.doc,.docx,.jpg,.png"
          />
        </t-form-item>
      </t-form>
    </t-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { getCourses, createCourse, updateCourse, deleteCourse, createChapter, updateChapter, deleteChapter } from '@/api/courses'
import request from '@/api/index'
import type { Course, Chapter } from '@/types'

const activeTab = ref('course')
const courseLoading = ref(false)
const submitting = ref(false)
const courses = ref<any[]>([])
const allResources = ref<any[]>([])
const resourceFiles = ref<any[]>([])

const courseColumns = [
  { colKey: 'name', title: '课程名称', width: 200, ellipsis: true },
  { colKey: 'code', title: '课程编码', width: 100 },
  { colKey: 'chapters', title: '章节', width: 200 },
  { colKey: 'start_date', title: '开始日期', width: 110 },
  { colKey: 'end_date', title: '结束日期', width: 110 },
  { colKey: 'status', title: '状态', width: 80, align: 'center' as const },
  { colKey: 'operation', title: '操作', width: 300, fixed: 'right' as const },
]

async function fetchCourses() {
  courseLoading.value = true
  try {
    const res: any = await getCourses({ page: 1, limit: 100 })
    courses.value = res.data || res || []
  } catch {
    MessagePlugin.error('加载课程数据失败')
  } finally {
    courseLoading.value = false
  }
}

const courseDialogVisible = ref(false)
const courseFormRef = ref()
const courseFormData = ref<any>({ id: 0, name: '', code: '', description: '', start_date: '', end_date: '' })
const courseFormRules = {
  name: [{ required: true, message: '请输入课程名称', type: 'error' }],
  code: [{ required: true, message: '请输入课程编码', type: 'error' }],
}

function openCourseForm(row?: any) {
  if (row) {
    courseFormData.value = { ...row }
  } else {
    courseFormData.value = { id: 0, name: '', code: '', description: '', start_date: '', end_date: '' }
  }
  courseDialogVisible.value = true
}

function resetCourseForm() {
  courseFormData.value = { id: 0, name: '', code: '', description: '', start_date: '', end_date: '' }
}

async function handleSaveCourse() {
  const valid = await courseFormRef.value?.validate()
  if (valid !== true) return
  submitting.value = true
  try {
    if (courseFormData.value.id) {
      await updateCourse(courseFormData.value.id, courseFormData.value)
      MessagePlugin.success('课程更新成功')
    } else {
      await createCourse(courseFormData.value)
      MessagePlugin.success('课程创建成功')
    }
    courseDialogVisible.value = false
    resetCourseForm()
    await fetchCourses()
  } catch {
    MessagePlugin.error('操作失败')
  } finally {
    submitting.value = false
  }
}

async function handleDeleteCourse(row: any) {
  try {
    await deleteCourse(row.id)
    MessagePlugin.success('课程已删除')
    await fetchCourses()
  } catch {
    MessagePlugin.error('删除失败')
  }
}

async function handleTogglePublish(row: any) {
  try {
    const newStatus = row.status === 'published' ? 'draft' : 'published'
    await updateCourse(row.id, { status: newStatus })
    MessagePlugin.success(newStatus === 'published' ? '课程已发布' : '已取消发布')
    await fetchCourses()
  } catch {
    MessagePlugin.error('操作失败')
  }
}

const chapterDialogVisible = ref(false)
const chapterFormVisible = ref(false)
const chapterFormRef = ref()
const currentCourseId = ref(0)
const chapterDialogTitle = ref('管理章节')
const chapterList = ref<any[]>([])
const chapterFormData = ref<any>({ id: 0, title: '', content: '', order: 0, duration: '' })
const chapterFormRules = {
  title: [{ required: true, message: '请输入章节标题', type: 'error' }],
}

const chapterColumns = [
  { colKey: 'title', title: '章节标题', width: 160, ellipsis: true },
  { colKey: 'order', title: '排序', width: 60, align: 'center' as const },
  { colKey: 'duration', title: '时长', width: 80 },
  { colKey: 'content', title: '描述', ellipsis: true },
  { colKey: 'operation', title: '操作', width: 120, fixed: 'right' as const },
]

function openChapterDialog(course: any) {
  currentCourseId.value = course.id
  chapterDialogTitle.value = `管理章节 - ${course.name}`
  chapterList.value = course.chapters || []
  chapterDialogVisible.value = true
}

function openChapterForm(row?: any) {
  if (row) {
    chapterFormData.value = { id: row.id, title: row.title, content: row.content || '', order: row.order || 0, duration: row.duration || '' }
  } else {
    chapterFormData.value = { id: 0, title: '', content: '', order: (chapterList.value.length || 0) + 1, duration: '' }
  }
  chapterFormVisible.value = true
}

function editChapter(row: any) {
  openChapterForm(row)
}

function resetChapterForm() {
  chapterFormData.value = { id: 0, title: '', content: '', order: 0, duration: '' }
}

async function handleSaveChapter() {
  const valid = await chapterFormRef.value?.validate()
  if (valid !== true) return
  submitting.value = true
  try {
    const data = { title: chapterFormData.value.title, content: chapterFormData.value.content, order: chapterFormData.value.order, duration: chapterFormData.value.duration }
    if (chapterFormData.value.id) {
      await updateChapter(chapterFormData.value.id, data)
      MessagePlugin.success('章节更新成功')
    } else {
      await createChapter(currentCourseId.value, data)
      MessagePlugin.success('章节创建成功')
    }
    chapterFormVisible.value = false
    resetChapterForm()
    await fetchCourses()
    const updated = courses.value.find((c: any) => c.id === currentCourseId.value)
    if (updated) chapterList.value = updated.chapters || []
  } catch {
    MessagePlugin.error('操作失败')
  } finally {
    submitting.value = false
  }
}

async function handleDeleteChapter(row: any) {
  try {
    await deleteChapter(row.id)
    MessagePlugin.success('章节已删除')
    await fetchCourses()
    const updated = courses.value.find((c: any) => c.id === currentCourseId.value)
    if (updated) chapterList.value = updated.chapters || []
  } catch {
    MessagePlugin.error('删除失败')
  }
}

const resourceLoading = ref(false)
const resourceFilters = ref({ keyword: '', type: '' })
const resourcePage = ref(1)
const resourcePageSize = ref(10)

const filteredResources = computed(() => {
  let list = allResources.value
  if (resourceFilters.value.keyword) {
    const kw = resourceFilters.value.keyword.toLowerCase()
    list = list.filter((r: any) => (r.original_name || r.name || '').toLowerCase().includes(kw))
  }
  if (resourceFilters.value.type) {
    list = list.filter((r: any) => r.file_type === resourceFilters.value.type)
  }
  const start = (resourcePage.value - 1) * resourcePageSize.value
  return list.slice(start, start + resourcePageSize.value)
})

const resourceTotal = computed(() => {
  let list = allResources.value
  if (resourceFilters.value.keyword) {
    const kw = resourceFilters.value.keyword.toLowerCase()
    list = list.filter((r: any) => (r.original_name || r.name || '').toLowerCase().includes(kw))
  }
  if (resourceFilters.value.type) {
    list = list.filter((r: any) => r.file_type === resourceFilters.value.type)
  }
  return list.length
})

const resourcePagination = computed(() => ({
  current: resourcePage.value,
  pageSize: resourcePageSize.value,
  total: resourceTotal.value,
  showJumper: true,
}))

const resourceColumns = [
  { colKey: 'original_name', title: '资源名称', width: 250, ellipsis: true },
  { colKey: 'file_type', title: '资源类型', width: 120, align: 'center' as const },
  { colKey: 'size', title: '文件大小', width: 100, align: 'center' as const },
  { colKey: 'created_at', title: '上传时间', width: 160 },
  { colKey: 'operation', title: '操作', width: 160, fixed: 'right' as const },
]

function resourceTypeTheme(type: string): string {
  const map: Record<string, string> = { course: 'primary', assignment: 'warning', topic: 'success', other: 'default' }
  return map[type] || 'default'
}

function resourceTypeLabel(type: string): string {
  const map: Record<string, string> = { course: '课件', assignment: '作业附件', topic: '课题资料', avatar: '头像', other: '其他' }
  return map[type] || type
}

function formatFileSize(bytes: number): string {
  if (!bytes) return '-'
  if (bytes < 1024) return bytes + 'B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + 'KB'
  return (bytes / (1024 * 1024)).toFixed(1) + 'MB'
}

function onResourceFilter() { resourcePage.value = 1 }
function resetResourceFilter() { resourceFilters.value = { keyword: '', type: '' }; resourcePage.value = 1 }
function onResourcePageChange(pageInfo: { current: number; pageSize: number }) {
  resourcePage.value = pageInfo.current
  resourcePageSize.value = pageInfo.pageSize
}

async function fetchResources() {
  resourceLoading.value = true
  try {
    const res: any = await request.get('/files', { params: { page: 1, limit: 200 } })
    const data = res.data || res || []
    allResources.value = data.map((f: any) => ({
      ...f,
      sizeFormatted: formatFileSize(f.size),
      created_at: f.created_at ? new Date(f.created_at).toLocaleString('zh-CN') : '-'
    }))
  } catch {
    MessagePlugin.error('加载资源数据失败')
  } finally {
    resourceLoading.value = false
  }
}

const resourceDialogVisible = ref(false)
const resourceFormRef = ref()
const resourceFormData = ref({ original_name: '', file_type: 'course' as string })
const resourceFormRules = {
  original_name: [{ required: true, message: '请输入资源名称', type: 'error' }],
  file_type: [{ required: true, message: '请选择资源类型', type: 'error' }],
}

function openResourceDialog() {
  resourceFormData.value = { original_name: '', file_type: 'course' }
  resourceFiles.value = []
  resourceDialogVisible.value = true
}

function resetResourceForm() {
  resourceFormData.value = { original_name: '', file_type: 'course' }
  resourceFiles.value = []
}

async function handleSaveResource() {
  const valid = await resourceFormRef.value?.validate()
  if (valid !== true) return
  submitting.value = true
  try {
    const form = new FormData()
    if (resourceFiles.value.length > 0) {
      const raw = resourceFiles.value[0].raw || resourceFiles.value[0]
      form.append('file', raw)
    }
    form.append('original_name', resourceFormData.value.original_name)
    form.append('file_type', resourceFormData.value.file_type)

    await request.post(`/files/upload?type=${resourceFormData.value.file_type}`, form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    MessagePlugin.success('资源上传成功')
    resourceDialogVisible.value = false
    resetResourceForm()
    await fetchResources()
  } catch {
    MessagePlugin.error('上传失败')
  } finally {
    submitting.value = false
  }
}

async function handleDeleteResource(row: any) {
  try {
    await request.delete(`/files/${row.id}`)
    MessagePlugin.success('资源已删除')
    await fetchResources()
  } catch {
    MessagePlugin.error('删除失败')
  }
}

function handleDownload(row: any) {
  window.open(`http://localhost:3001${row.path}`, '_blank')
}

function onTabChange(value: string) {
  if (value === 'resource' && allResources.value.length === 0) {
    fetchResources()
  }
}

onMounted(() => {
  fetchCourses()
})
</script>

<style scoped>
.course-tabs {
  background: #fff;
  border-radius: 6px;
  padding: 0 24px;
}

.course-tabs :deep(.t-tabs__header) {
  border-bottom: 1px solid #E7E7E7;
}

.chapter-toolbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 12px;
}
</style>
