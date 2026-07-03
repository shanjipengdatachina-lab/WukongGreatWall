<template>
  <div class="page-container">
    <div class="page-header">
      <span class="page-title">作业管理</span>
    </div>

    <div class="filter-bar">
      <t-form layout="inline" :data="filters" @submit="onFilter">
        <t-form-item label="作业标题">
          <t-input v-model="filters.keyword" placeholder="搜索作业标题" clearable style="width: 180px" />
        </t-form-item>
        <t-form-item label="所属课程">
          <t-select v-model="filters.courseId" placeholder="全部课程" clearable style="width: 200px">
            <t-option value="" label="全部课程" />
            <t-option v-for="c in courseOptions" :key="c.id" :value="c.id" :label="c.name" />
          </t-select>
        </t-form-item>
        <t-form-item label="状态">
          <t-select v-model="filters.status" placeholder="全部状态" clearable style="width: 140px">
            <t-option value="" label="全部" />
            <t-option value="draft" label="草稿" />
            <t-option value="published" label="已发布" />
            <t-option value="closed" label="已关闭" />
          </t-select>
        </t-form-item>
        <t-form-item>
          <t-space>
            <t-button theme="primary" type="submit">查询</t-button>
            <t-button variant="outline" type="reset" @click="resetFilters">重置</t-button>
          </t-space>
        </t-form-item>
      </t-form>
    </div>

    <div class="table-container">
      <div class="table-header">
        <span class="table-title">作业列表</span>
        <div class="toolbar-actions">
          <t-button theme="primary" @click="openCreateDialog()">
            <template #icon><t-icon name="add" /></template>
            新建作业
          </t-button>
        </div>
      </div>

      <t-loading :loading="loading">
        <t-table
          v-if="assignmentList.length > 0"
          :data="assignmentList"
          :columns="columns"
          row-key="id"
          hover
          stripe
          :pagination="pagination"
          @page-change="onPageChange"
        >
          <template #course="{ row }">
            <t-tag variant="outline" size="small">{{ row.Course?.name || '-' }}</t-tag>
          </template>
          <template #deadline="{ row }">
            <span :style="{ color: isOverdue(row.deadline) ? '#e34d59' : '' }">
              {{ row.deadline ? formatDate(row.deadline) : '-' }}
            </span>
          </template>
          <template #status="{ row }">
            <t-tag :theme="statusTheme(row.status)" variant="light">
              {{ statusLabel(row.status) }}
            </t-tag>
          </template>
          <template #operation="{ row }">
            <t-space size="small">
              <t-link theme="primary" hover="color" @click="openSubmissionDrawer(row)">查看提交</t-link>
              <t-link theme="primary" hover="color" @click="openCreateDialog(row)">编辑</t-link>
              <t-popconfirm content="删除后历史提交不受影响，确认删除？" @confirm="handleDelete(row)">
                <t-link theme="danger" hover="color">删除</t-link>
              </t-popconfirm>
              <t-popconfirm
                v-if="row.status === 'draft'"
                content="确认发布该作业？"
                @confirm="handlePublish(row)"
              >
                <t-link theme="success" hover="color">发布</t-link>
              </t-popconfirm>
              <t-popconfirm
                v-if="row.status === 'published'"
                content="确认关闭该作业？"
                @confirm="handleClose(row)"
              >
                <t-link theme="warning" hover="color">关闭</t-link>
              </t-popconfirm>
            </t-space>
          </template>
        </t-table>
        <t-empty v-else description="暂无作业数据" />
      </t-loading>
    </div>

    <t-dialog
      v-model:visible="dialogVisible"
      :header="formData.id ? '编辑作业' : '新建作业'"
      :confirm-btn="{ content: '保存', theme: 'primary', loading: submitting }"
      width="600px"
      @confirm="handleSave"
      @close="resetForm"
    >
      <t-form ref="formRef" :data="formData" :rules="formRules" label-width="100px">
        <t-form-item label="作业标题" name="title">
          <t-input v-model="formData.title" placeholder="请输入作业标题" />
        </t-form-item>
        <t-form-item label="所属课程" name="course_id">
          <t-select v-model="formData.course_id" placeholder="请选择所属课程">
            <t-option v-for="c in courseOptions" :key="c.id" :value="c.id" :label="c.name" />
          </t-select>
        </t-form-item>
        <t-form-item label="作业描述" name="description">
          <t-textarea v-model="formData.description" placeholder="请输入作业要求说明" :maxlength="500" />
        </t-form-item>
        <t-form-item label="截止时间" name="deadline">
          <t-date-picker
            v-model="formData.deadline"
            placeholder="请选择截止时间"
            enable-time-picker
            allow-input
            clearable
            style="width: 100%"
          />
        </t-form-item>
        <t-form-item label="满分" name="max_score">
          <t-input v-model.number="formData.max_score" placeholder="默认100" />
        </t-form-item>
      </t-form>
    </t-dialog>

    <t-drawer
      v-model:visible="submissionDrawerVisible"
      header="提交列表"
      size="640px"
      :footer="false"
    >
      <div v-if="submissionLoading" class="drawer-loading">
        <t-loading text="加载提交数据中..." />
      </div>
      <div v-else-if="submissionEmpty" class="drawer-empty">
        <t-empty description="暂无提交记录" />
      </div>
      <t-list v-else :split="true">
        <t-list-item v-for="sub in submissions" :key="sub.id">
          <t-list-item-meta
            :title="sub.User?.profile?.real_name || sub.User?.username || '-'"
            :description="`${sub.User?.scholar_id || ''} · ${sub.User?.profile?.institution?.name || ''}`"
          />
          <template #action>
            <t-space direction="vertical" size="4px" align="end">
              <t-tag :theme="subStatusTheme(sub.status)" variant="light" size="small">
                {{ subStatusLabel(sub.status) }}
              </t-tag>
              <span class="sub-meta-text">{{ sub.created_at ? formatDate(sub.created_at) : '-' }}</span>
              <t-link theme="primary" hover="color" @click="goToReview(sub.id)">
                查看评审
              </t-link>
            </t-space>
          </template>
        </t-list-item>
      </t-list>
      <div v-if="!submissionEmpty && submissionTotal > submissionPageSize" class="drawer-pagination">
        <t-pagination
          :current="submissionPage"
          :page-size="submissionPageSize"
          :total="submissionTotal"
          size="small"
          @change="onSubmissionPageChange"
        />
      </div>
    </t-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { MessagePlugin } from 'tdesign-vue-next'
import { getAssignments, createAssignment, updateAssignment, deleteAssignment } from '@/api/assignments'
import { getCourses } from '@/api/courses'
import request from '@/api/index'

const router = useRouter()

const loading = ref(false)
const submitting = ref(false)
const allAssignments = ref<any[]>([])
const courseOptions = ref<any[]>([])
const page = ref(1)
const pageSize = ref(10)

const filters = ref({
  keyword: '',
  courseId: '',
  status: '',
})

const filteredList = computed(() => {
  let list = allAssignments.value
  if (filters.value.keyword) {
    const kw = filters.value.keyword.toLowerCase()
    list = list.filter((a: any) => a.title.toLowerCase().includes(kw))
  }
  if (filters.value.courseId) {
    list = list.filter((a: any) => String(a.course_id) === String(filters.value.courseId))
  }
  if (filters.value.status) {
    list = list.filter((a: any) => a.status === filters.value.status)
  }
  return list
})

const filteredTotal = computed(() => filteredList.value.length)

const assignmentList = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filteredList.value.slice(start, start + pageSize.value)
})

const pagination = computed(() => ({
  current: page.value,
  pageSize: pageSize.value,
  total: filteredTotal.value,
  showJumper: true,
}))

const columns = [
  { colKey: 'title', title: '作业标题', width: 200, ellipsis: true },
  { colKey: 'course', title: '所属课程', width: 200 },
  { colKey: 'deadline', title: '截止时间', width: 150 },
  { colKey: 'max_score', title: '满分', width: 70, align: 'center' as const },
  { colKey: 'status', title: '状态', width: 80, align: 'center' as const },
  { colKey: 'operation', title: '操作', width: 300, fixed: 'right' as const },
]

function statusTheme(status: string): string {
  const map: Record<string, string> = { draft: 'default', published: 'success', closed: 'warning' }
  return map[status] || 'default'
}

function statusLabel(status: string): string {
  const map: Record<string, string> = { draft: '草稿', published: '已发布', closed: '已关闭' }
  return map[status] || status
}

function subStatusTheme(status: string): string {
  const map: Record<string, string> = { submitted: 'primary', reviewing: 'warning', reviewed: 'success' }
  return map[status] || 'default'
}

function subStatusLabel(status: string): string {
  const map: Record<string, string> = { submitted: '待评审', reviewing: '评审中', reviewed: '已评审' }
  return map[status] || status
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return d.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

function isOverdue(deadline: string): boolean {
  if (!deadline) return false
  return new Date(deadline) < new Date()
}

function onFilter() { page.value = 1 }

function resetFilters() {
  filters.value = { keyword: '', courseId: '', status: '' }
  page.value = 1
}

function onPageChange(pageInfo: { current: number; pageSize: number }) {
  page.value = pageInfo.current
  pageSize.value = pageInfo.pageSize
}

async function fetchAssignments() {
  loading.value = true
  try {
    const res: any = await getAssignments({ page: 1, limit: 100 })
    allAssignments.value = res.data || res || []
  } catch {
    MessagePlugin.error('加载作业数据失败')
  } finally {
    loading.value = false
  }
}

async function fetchCourseOptions() {
  try {
    const res: any = await getCourses({ page: 1, limit: 100 })
    courseOptions.value = (res.data || res || []).map((c: any) => ({ id: c.id, name: c.name, code: c.code }))
  } catch { }
}

const dialogVisible = ref(false)
const formRef = ref()
const formData = ref<any>({ id: 0, title: '', course_id: '', description: '', deadline: '', max_score: 100 })
const formRules = {
  title: [{ required: true, message: '请输入作业标题', type: 'error' }],
  course_id: [{ required: true, message: '请选择所属课程', type: 'error' }],
}

function openCreateDialog(row?: any) {
  if (row) {
    formData.value = {
      id: row.id,
      title: row.title,
      course_id: row.course_id,
      description: row.description || '',
      deadline: row.deadline || '',
      max_score: row.max_score || 100,
    }
  } else {
    formData.value = { id: 0, title: '', course_id: '', description: '', deadline: '', max_score: 100 }
  }
  dialogVisible.value = true
}

function resetForm() {
  formData.value = { id: 0, title: '', course_id: '', description: '', deadline: '', max_score: 100 }
}

async function handleSave() {
  const valid = await formRef.value?.validate()
  if (valid !== true) return
  submitting.value = true
  try {
    if (formData.value.id) {
      await updateAssignment(formData.value.id, formData.value)
      MessagePlugin.success('作业更新成功')
    } else {
      await createAssignment(formData.value)
      MessagePlugin.success('作业创建成功')
    }
    dialogVisible.value = false
    resetForm()
    await fetchAssignments()
  } catch {
    MessagePlugin.error('操作失败')
  } finally {
    submitting.value = false
  }
}

async function handleDelete(row: any) {
  try {
    await deleteAssignment(row.id)
    MessagePlugin.success('作业已删除')
    await fetchAssignments()
  } catch {
    MessagePlugin.error('删除失败')
  }
}

async function handlePublish(row: any) {
  try {
    await updateAssignment(row.id, { status: 'published' })
    MessagePlugin.success('作业已发布')
    await fetchAssignments()
  } catch {
    MessagePlugin.error('操作失败')
  }
}

async function handleClose(row: any) {
  try {
    await updateAssignment(row.id, { status: 'closed' })
    MessagePlugin.success('作业已关闭')
    await fetchAssignments()
  } catch {
    MessagePlugin.error('操作失败')
  }
}

const submissionDrawerVisible = ref(false)
const submissionLoading = ref(false)
const submissions = ref<any[]>([])
const submissionTotal = ref(0)
const submissionPage = ref(1)
const submissionPageSize = ref(10)
const currentAssignmentId = ref<number>(0)
const submissionEmpty = computed(() => submissions.value.length === 0)

function openSubmissionDrawer(row: any) {
  currentAssignmentId.value = row.id
  submissionPage.value = 1
  submissionDrawerVisible.value = true
  fetchSubmissions()
}

async function fetchSubmissions() {
  submissionLoading.value = true
  try {
    const res: any = await request.get('/submissions', {
      params: { assignment_id: currentAssignmentId.value, page: submissionPage.value, limit: submissionPageSize.value }
    })
    const data = res.data || res || []
    submissions.value = Array.isArray(data) ? data : data.list || data.data || []
    submissionTotal.value = res.pagination?.total || submissions.value.length
  } catch {
    MessagePlugin.error('加载提交数据失败')
  } finally {
    submissionLoading.value = false
  }
}

function onSubmissionPageChange(pageInfo: { current: number; pageSize: number }) {
  submissionPage.value = pageInfo.current
  submissionPageSize.value = pageInfo.pageSize
  fetchSubmissions()
}

function goToReview(submissionId: number) {
  submissionDrawerVisible.value = false
  router.push(`/reviews/${submissionId}`)
}

onMounted(() => {
  fetchAssignments()
  fetchCourseOptions()
})
</script>

<style scoped>
.sub-meta-text {
  font-size: 12px;
  color: #999;
}

.drawer-loading,
.drawer-empty {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.drawer-pagination {
  display: flex;
  justify-content: center;
  padding: 16px 0;
}
</style>
