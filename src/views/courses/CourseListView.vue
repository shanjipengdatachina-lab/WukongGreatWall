<template>
  <div class="page-container">
    <div class="page-header">
      <span class="page-title">课程管理</span>
    </div>

    <t-tabs v-model="activeTab" class="course-tabs">
      <t-tab-panel value="course" label="课程">
        <div class="table-container">
          <div class="table-header">
            <span class="table-title">课程列表</span>
            <div class="toolbar-actions">
              <t-button theme="primary" @click="openChapterDialog()">
                <template #icon><t-icon name="add" /></template>
                新建章节
              </t-button>
            </div>
          </div>

          <t-loading :loading="loading">
            <t-table
              v-if="!isEmpty"
              :data="chapterRows"
              :columns="courseColumns"
              row-key="id"
              hover
              stripe
              :pagination="coursePagination"
              @page-change="onCoursePageChange"
            >
              <template #status="{ row }">
                <t-tag :theme="row.status === 'published' ? 'success' : 'default'" variant="light">
                  {{ row.status === 'published' ? '已发布' : '未发布' }}
                </t-tag>
              </template>
              <template #operation="{ row }">
                <t-space size="small">
                  <t-link theme="primary" hover="color" @click="openChapterDialog(row)">编辑</t-link>
                  <t-popconfirm content="确定删除该章节？" @confirm="handleDeleteChapter(row)">
                    <t-link theme="danger" hover="color">删除</t-link>
                  </t-popconfirm>
                  <t-popconfirm
                    v-if="row.status === 'published'"
                    content="确定取消发布该章节？"
                    @confirm="handleTogglePublish(row)"
                  >
                    <t-link theme="warning" hover="color">取消发布</t-link>
                  </t-popconfirm>
                  <t-popconfirm
                    v-else
                    content="确定发布该章节？"
                    @confirm="handleTogglePublish(row)"
                  >
                    <t-link theme="success" hover="color">发布</t-link>
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
                <t-option value="link" label="工具链接" />
                <t-option value="pdf" label="课件PDF" />
                <t-option value="project" label="示例工程" />
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
              v-if="!resourceEmpty"
              :data="filteredResources"
              :columns="resourceColumns"
              row-key="id"
              hover
              stripe
              :pagination="resourcePagination"
              @page-change="onResourcePageChange"
            >
              <template #type="{ row }">
                <t-tag :theme="resourceTypeTheme(row.type)" variant="light">
                  {{ resourceTypeLabel(row.type) }}
                </t-tag>
              </template>
              <template #status="{ row }">
                <t-tag :theme="row.status === 'published' ? 'success' : 'default'" variant="light">
                  {{ row.status === 'published' ? '已发布' : '未发布' }}
                </t-tag>
              </template>
              <template #operation="{ row }">
                <t-space size="small">
                  <t-link theme="primary" hover="color" @click="openResourceDialog(row)">编辑</t-link>
                  <t-popconfirm content="确定删除该资源？" @confirm="handleDeleteResource(row)">
                    <t-link theme="danger" hover="color">删除</t-link>
                  </t-popconfirm>
                  <t-link theme="primary" hover="color" @click="handleDownload(row)">下载</t-link>
                  <t-link theme="primary" hover="color" @click="handleCopyLink(row)">复制链接</t-link>
                </t-space>
              </template>
            </t-table>
            <t-empty v-else description="暂无资源数据" />
          </t-loading>
        </div>
      </t-tab-panel>
    </t-tabs>

    <t-dialog
      v-model:visible="chapterDialogVisible"
      :header="chapterFormData.editingId ? '编辑章节' : '新建章节'"
      :confirm-btn="{ content: '保存', theme: 'primary' }"
      width="560px"
      @confirm="handleSaveChapter"
      @close="resetChapterForm"
    >
      <t-form ref="chapterFormRef" :data="chapterFormData" :rules="chapterFormRules" label-width="90px">
        <t-form-item label="所属课程" name="courseId">
          <t-select v-model="chapterFormData.courseId" placeholder="请选择所属课程">
            <t-option v-for="c in allCourses" :key="c.id" :value="c.id" :label="c.title" />
          </t-select>
        </t-form-item>
        <t-form-item label="章节标题" name="chapterTitle">
          <t-input v-model="chapterFormData.chapterTitle" placeholder="请输入章节标题" />
        </t-form-item>
        <t-form-item label="章节说明" name="chapterDesc">
          <t-textarea v-model="chapterFormData.chapterDesc" placeholder="请输入章节说明" :maxlength="200" />
        </t-form-item>
        <t-form-item label="课时数量" name="lessonCount">
          <t-input v-model.number="chapterFormData.lessonCount" placeholder="请输入课时数量" />
        </t-form-item>
        <t-form-item label="总时长" name="duration">
          <t-input v-model="chapterFormData.duration" placeholder="例如：45分钟" />
        </t-form-item>
        <t-form-item label="发布对象" name="publishTarget">
          <t-select v-model="chapterFormData.publishTarget" placeholder="请选择发布对象">
            <t-option value="all" label="全部学员" />
            <t-option value="group" label="指定分组" />
          </t-select>
        </t-form-item>
      </t-form>
    </t-dialog>

    <t-dialog
      v-model:visible="resourceDialogVisible"
      :header="resourceFormData.editingId ? '编辑资源' : '上传资源'"
      :confirm-btn="{ content: '保存', theme: 'primary' }"
      width="560px"
      @confirm="handleSaveResource"
      @close="resetResourceForm"
    >
      <t-form ref="resourceFormRef" :data="resourceFormData" :rules="resourceFormRules" label-width="90px">
        <t-form-item label="资源名称" name="title">
          <t-input v-model="resourceFormData.title" placeholder="请输入资源名称" />
        </t-form-item>
        <t-form-item label="资源类型" name="type">
          <t-select v-model="resourceFormData.type" placeholder="请选择资源类型">
            <t-option value="link" label="工具链接" />
            <t-option value="pdf" label="课件PDF" />
            <t-option value="project" label="示例工程" />
            <t-option value="other" label="其他" />
          </t-select>
        </t-form-item>
        <t-form-item label="上传文件" name="file">
          <t-upload
            v-model="resourceFormData.files"
            theme="file"
            :auto-upload="false"
            :max="1"
            accept=".pdf,.zip,.rar,.7z,.doc,.docx"
          />
        </t-form-item>
      </t-form>
    </t-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { mockCourses, mockCourseResources } from '@/mock'
import type { Course, CourseChapter, CourseResource } from '@/mock/types'

interface ChapterRow {
  id: string
  courseId: string
  title: string
  description: string
  lessonCount: number
  duration: string
  publishTarget: string
  status: 'published' | 'draft'
}

interface ResourceRow extends CourseResource {
  status: 'published' | 'draft'
  uploaderName: string
}

const activeTab = ref('course')
const loading = ref(false)
const resourceLoading = ref(false)

const allCourses = ref<Course[]>([])
const allChapters = ref<CourseChapter[]>([])

const coursePage = ref(1)
const coursePageSize = ref(10)

const chapterRows = computed<ChapterRow[]>(() => {
  const start = (coursePage.value - 1) * coursePageSize.value
  const end = start + coursePageSize.value
  return allCourses.value.flatMap(course =>
    course.chapters.map(ch => ({
      id: `${course.id}_${ch.id}`,
      courseId: course.id,
      title: ch.title,
      description: `所属课程：${course.title}`,
      lessonCount: ch.resourceCount,
      duration: ch.duration,
      publishTarget: '全部学员',
      status: course.status,
    }))
  ).slice(start, end)
})

const courseTotal = computed(() => allCourses.value.reduce((sum, c) => sum + c.chapters.length, 0))

const coursePagination = computed(() => ({
  current: coursePage.value,
  pageSize: coursePageSize.value,
  total: courseTotal.value,
  showJumper: true,
}))

const isEmpty = computed(() => chapterRows.value.length === 0)

const courseColumns = [
  { colKey: 'title', title: '章节标题', width: 200, ellipsis: true },
  { colKey: 'description', title: '章节说明', width: 240, ellipsis: true },
  { colKey: 'lessonCount', title: '课时数量', width: 100, align: 'center' },
  { colKey: 'duration', title: '总时长', width: 120, align: 'center' },
  { colKey: 'publishTarget', title: '发布对象', width: 120 },
  { colKey: 'status', title: '发布状态', width: 100, align: 'center' },
  { colKey: 'operation', title: '操作', width: 240, fixed: 'right' },
]

function onCoursePageChange(pageInfo: { current: number; pageSize: number }) {
  coursePage.value = pageInfo.current
  coursePageSize.value = pageInfo.pageSize
}

const chapterDialogVisible = ref(false)
const chapterFormRef = ref()

const chapterFormData = ref({
  editingId: '',
  courseId: '',
  chapterTitle: '',
  chapterDesc: '',
  lessonCount: 0,
  duration: '',
  publishTarget: 'all',
})

const chapterFormRules = {
  courseId: [{ required: true, message: '请选择所属课程', type: 'error' }],
  chapterTitle: [{ required: true, message: '请输入章节标题', type: 'error' }],
  lessonCount: [{ required: true, message: '请输入课时数量', type: 'error' }],
  duration: [{ required: true, message: '请输入总时长', type: 'error' }],
  publishTarget: [{ required: true, message: '请选择发布对象', type: 'error' }],
}

function openChapterDialog(row?: ChapterRow) {
  if (row) {
    const course = allCourses.value.find(c => c.id === row.courseId)
    chapterFormData.value = {
      editingId: row.id,
      courseId: row.courseId,
      chapterTitle: row.title,
      chapterDesc: row.description,
      lessonCount: row.lessonCount,
      duration: row.duration,
      publishTarget: row.publishTarget,
    }
  } else {
    chapterFormData.value = {
      editingId: '',
      courseId: '',
      chapterTitle: '',
      chapterDesc: '',
      lessonCount: 0,
      duration: '',
      publishTarget: 'all',
    }
  }
  chapterDialogVisible.value = true
}

function resetChapterForm() {
  chapterFormData.value = {
    editingId: '',
    courseId: '',
    chapterTitle: '',
    chapterDesc: '',
    lessonCount: 0,
    duration: '',
    publishTarget: 'all',
  }
}

function handleSaveChapter() {
  chapterFormRef.value?.validate().then((result: any) => {
    if (result === true || (typeof result === 'object' && Object.keys(result).length === 0)) {
      if (chapterFormData.value.editingId) {
        MessagePlugin.success('章节更新成功')
      } else {
        MessagePlugin.success('章节创建成功')
      }
      chapterDialogVisible.value = false
      resetChapterForm()
    }
  })
}

function handleDeleteChapter(row: ChapterRow) {
  MessagePlugin.success(`章节"${row.title}"已删除`)
}

function handleTogglePublish(row: ChapterRow) {
  const action = row.status === 'published' ? '取消发布' : '发布'
  MessagePlugin.success(`章节"${row.title}"${action}成功`)
}

const allResources = ref<ResourceRow[]>([])
const resourceFilters = ref({ keyword: '', type: '' })
const resourcePage = ref(1)
const resourcePageSize = ref(10)

const filteredResources = computed(() => {
  let list = allResources.value
  if (resourceFilters.value.keyword) {
    const kw = resourceFilters.value.keyword.toLowerCase()
    list = list.filter(r => r.title.toLowerCase().includes(kw))
  }
  if (resourceFilters.value.type) {
    list = list.filter(r => r.type === resourceFilters.value.type)
  }
  const start = (resourcePage.value - 1) * resourcePageSize.value
  return list.slice(start, start + resourcePageSize.value)
})

const resourceTotal = computed(() => {
  let list = allResources.value
  if (resourceFilters.value.keyword) {
    const kw = resourceFilters.value.keyword.toLowerCase()
    list = list.filter(r => r.title.toLowerCase().includes(kw))
  }
  if (resourceFilters.value.type) {
    list = list.filter(r => r.type === resourceFilters.value.type)
  }
  return list.length
})

const resourcePagination = computed(() => ({
  current: resourcePage.value,
  pageSize: resourcePageSize.value,
  total: resourceTotal.value,
  showJumper: true,
}))

const resourceEmpty = computed(() => filteredResources.value.length === 0)

const resourceColumns = [
  { colKey: 'title', title: '资源名称', width: 220, ellipsis: true },
  { colKey: 'type', title: '资源类型', width: 120, align: 'center' },
  { colKey: 'fileSize', title: '文件大小', width: 100, align: 'center' },
  { colKey: 'uploaderName', title: '上传人', width: 120 },
  { colKey: 'status', title: '发布状态', width: 100, align: 'center' },
  { colKey: 'operation', title: '操作', width: 260, fixed: 'right' },
]

function resourceTypeTheme(type: string): string {
  const map: Record<string, string> = { link: 'primary', pdf: 'warning', project: 'success', other: 'default' }
  return map[type] || 'default'
}

function resourceTypeLabel(type: string): string {
  const map: Record<string, string> = { link: '链接', pdf: 'PDF', project: '工程', other: '其他' }
  return map[type] || type
}

function onResourceFilter() {
  resourcePage.value = 1
}

function resetResourceFilter() {
  resourceFilters.value = { keyword: '', type: '' }
  resourcePage.value = 1
}

function onResourcePageChange(pageInfo: { current: number; pageSize: number }) {
  resourcePage.value = pageInfo.current
  resourcePageSize.value = pageInfo.pageSize
}

const resourceDialogVisible = ref(false)
const resourceFormRef = ref()

const resourceFormData = ref({
  editingId: '',
  title: '',
  type: 'link',
  files: [] as any[],
})

const resourceFormRules = {
  title: [{ required: true, message: '请输入资源名称', type: 'error' }],
  type: [{ required: true, message: '请选择资源类型', type: 'error' }],
}

function openResourceDialog(row?: ResourceRow) {
  if (row) {
    resourceFormData.value = {
      editingId: row.id,
      title: row.title,
      type: row.type,
      files: [],
    }
  } else {
    resourceFormData.value = {
      editingId: '',
      title: '',
      type: 'link',
      files: [],
    }
  }
  resourceDialogVisible.value = true
}

function resetResourceForm() {
  resourceFormData.value = {
    editingId: '',
    title: '',
    type: 'link',
    files: [],
  }
}

function handleSaveResource() {
  resourceFormRef.value?.validate().then((result: any) => {
    if (result === true || (typeof result === 'object' && Object.keys(result).length === 0)) {
      if (resourceFormData.value.editingId) {
        MessagePlugin.success('资源更新成功')
      } else {
        MessagePlugin.success('资源上传成功')
      }
      resourceDialogVisible.value = false
      resetResourceForm()
    }
  })
}

function handleDeleteResource(row: ResourceRow) {
  MessagePlugin.success(`资源"${row.title}"已删除`)
}

function handleDownload(row: ResourceRow) {
  MessagePlugin.success(`正在下载"${row.title}"`)
}

function handleCopyLink(row: ResourceRow) {
  navigator.clipboard.writeText(row.url || window.location.origin + '/resources/' + row.id).then(() => {
    MessagePlugin.success('链接已复制到剪贴板')
  }).catch(() => {
    MessagePlugin.warning('复制失败，请手动复制')
  })
}

onMounted(() => {
  loading.value = true
  resourceLoading.value = true
  try {
    const result = mockCourses(1, 100)
    allCourses.value = result.items
    allChapters.value = result.items.flatMap(c => c.chapters)
  } catch {
    MessagePlugin.error('加载课程数据失败')
  } finally {
    loading.value = false
  }

  try {
    const resResult = mockCourseResources(1, 100)
    allResources.value = resResult.items.map(r => ({
      ...r,
      status: 'published' as const,
      uploaderName: '管理员',
    }))
  } catch {
    MessagePlugin.error('加载资源数据失败')
  } finally {
    resourceLoading.value = false
  }
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
</style>
