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
            <t-option v-for="c in courseOptions" :key="c.id" :value="c.id" :label="c.title" />
          </t-select>
        </t-form-item>
        <t-form-item label="作业类型">
          <t-select v-model="filters.type" placeholder="全部类型" clearable style="width: 140px">
            <t-option value="" label="全部" />
            <t-option value="个人作业" label="课程作业" />
            <t-option value="小组作业" label="小组作业" />
            <t-option value="课题作业" label="课题任务" />
          </t-select>
        </t-form-item>
        <t-form-item label="截止时间">
          <t-date-range-picker
            v-model="filters.dateRange"
            placeholder="请选择截止时间范围"
            allow-input
            clearable
            style="width: 240px"
          />
        </t-form-item>
        <t-form-item label="提交状态">
          <t-select v-model="filters.status" placeholder="全部状态" clearable style="width: 140px">
            <t-option value="" label="全部" />
            <t-option value="pending" label="未提交" />
            <t-option value="submitted" label="已提交" />
            <t-option value="reviewing" label="评审中" />
            <t-option value="reviewed" label="已完成" />
            <t-option value="overdue" label="已逾期" />
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
          v-if="!isEmpty"
          :data="assignmentList"
          :columns="columns"
          row-key="id"
          hover
          stripe
          :pagination="pagination"
          @page-change="onPageChange"
        >
          <template #type="{ row }">
            <t-tag :theme="typeTheme(row.type)" variant="light">
              {{ row.type }}
            </t-tag>
          </template>
          <template #submitRate="{ row }">
            <t-progress
              :percentage="row.submitRate"
              :label="`${row.submittedCount}/${row.totalStudents}`"
              size="small"
              style="width: 120px"
            />
          </template>
          <template #reviewRate="{ row }">
            <t-progress
              :percentage="row.reviewRate"
              :label="`${row.reviewedCount}/${row.submittedCount}`"
              size="small"
              theme="plump"
              style="width: 120px"
            />
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
                v-if="row.status === 'pending'"
                content="确认发布该作业？"
                @confirm="handlePublish(row)"
              >
                <t-link theme="success" hover="color">发布</t-link>
              </t-popconfirm>
            </t-space>
          </template>
        </t-table>
        <t-empty v-else description="暂无作业数据" />
      </t-loading>
    </div>

    <t-dialog
      v-model:visible="dialogVisible"
      :header="formData.editingId ? '编辑作业' : '新建作业'"
      :confirm-btn="{ content: '保存', theme: 'primary' }"
      width="600px"
      @confirm="handleSave"
      @close="resetForm"
    >
      <t-form ref="formRef" :data="formData" :rules="formRules" label-width="100px">
        <t-form-item label="作业标题" name="title">
          <t-input v-model="formData.title" placeholder="请输入作业标题" />
        </t-form-item>
        <t-form-item label="所属课程" name="courseId">
          <t-select v-model="formData.courseId" placeholder="请选择所属课程">
            <t-option v-for="c in courseOptions" :key="c.id" :value="c.id" :label="c.title" />
          </t-select>
        </t-form-item>
        <t-form-item label="作业类型" name="type">
          <t-radio-group v-model="formData.type">
            <t-radio value="个人作业">课程作业</t-radio>
            <t-radio value="小组作业">小组作业</t-radio>
            <t-radio value="课题作业">课题任务</t-radio>
          </t-radio-group>
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
        <t-form-item label="提交要求" name="format">
          <t-radio-group v-model="formData.format">
            <t-radio value="image">图片</t-radio>
            <t-radio value="pdf">PDF</t-radio>
            <t-radio value="image+pdf">图片+PDF</t-radio>
          </t-radio-group>
        </t-form-item>
        <t-form-item label="发布对象" name="publishTarget">
          <t-select v-model="formData.publishTarget" placeholder="请选择发布对象">
            <t-option value="all" label="全部学员" />
            <t-option value="group" label="指定分组" />
          </t-select>
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
            :title="sub.studentName"
            :description="`${sub.scholarId} · ${sub.university}`"
          />
          <template #action>
            <t-space direction="vertical" size="4px" align="end">
              <t-tag :theme="subStatusTheme(sub.status)" variant="light" size="small">
                {{ subStatusLabel(sub.status) }}
              </t-tag>
              <span class="sub-meta-text">{{ sub.submitTime }}</span>
              <t-link
                v-if="sub.score !== null"
                theme="primary"
                hover="color"
                @click="goToReview(sub.id)"
              >
                查看评审
              </t-link>
              <t-link v-else theme="primary" hover="color" @click="goToReview(sub.id)">
                开始评审
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
import { mockAssignments, mockSubmissions, mockCourses } from '@/mock'
import type { Assignment, Submission, Course } from '@/mock/types'

const router = useRouter()

interface AssignmentFilters {
  keyword: string
  courseId: string
  type: string
  dateRange: string[]
  status: string
}

const loading = ref(false)
const allAssignments = ref<Assignment[]>([])
const courseOptions = ref<{ id: string; title: string }[]>([])
const page = ref(1)
const pageSize = ref(10)

const filters = ref<AssignmentFilters>({
  keyword: '',
  courseId: '',
  type: '',
  dateRange: [],
  status: '',
})

const filteredList = computed(() => {
  let list = allAssignments.value
  if (filters.value.keyword) {
    const kw = filters.value.keyword.toLowerCase()
    list = list.filter(a => a.title.toLowerCase().includes(kw))
  }
  if (filters.value.courseId) {
    list = list.filter(a => a.courseId === filters.value.courseId)
  }
  if (filters.value.type) {
    list = list.filter(a => a.type === filters.value.type)
  }
  if (filters.value.dateRange && filters.value.dateRange.length === 2) {
    const [start, end] = filters.value.dateRange
    list = list.filter(a => a.deadline >= start && a.deadline <= end)
  }
  if (filters.value.status) {
    list = list.filter(a => a.status === filters.value.status)
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

const isEmpty = computed(() => assignmentList.value.length === 0)

const columns = [
  { colKey: 'title', title: '作业标题', width: 200, ellipsis: true },
  { colKey: 'courseTitle', title: '所属课程', width: 180, ellipsis: true },
  { colKey: 'type', title: '作业类型', width: 100, align: 'center' },
  { colKey: 'deadline', title: '截止时间', width: 140, align: 'center' },
  { colKey: 'submitRate', title: '提交率', width: 140 },
  { colKey: 'reviewRate', title: '批注进度', width: 140 },
  { colKey: 'status', title: '提交状态', width: 100, align: 'center' },
  { colKey: 'operation', title: '操作', width: 260, fixed: 'right' },
]

function typeTheme(type: string): string {
  const map: Record<string, string> = { '个人作业': 'primary', '小组作业': 'warning', '课题作业': 'warning' }
  return map[type] || 'default'
}

function statusTheme(status: string): string {
  const map: Record<string, string> = { pending: 'default', submitted: 'primary', reviewing: 'primary', reviewed: 'success', overdue: 'danger' }
  return map[status] || 'default'
}

function statusLabel(status: string): string {
  const map: Record<string, string> = { pending: '未开始', submitted: '已提交', reviewing: '进行中', reviewed: '已完成', overdue: '已逾期' }
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

function onFilter() {
  page.value = 1
}

function resetFilters() {
  filters.value = { keyword: '', courseId: '', type: '', dateRange: [], status: '' }
  page.value = 1
}

function onPageChange(pageInfo: { current: number; pageSize: number }) {
  page.value = pageInfo.current
  pageSize.value = pageInfo.pageSize
}

const dialogVisible = ref(false)
const formRef = ref()

const formData = ref({
  editingId: '',
  title: '',
  courseId: '',
  type: '个人作业',
  deadline: '',
  format: 'image',
  publishTarget: 'all',
})

const formRules = {
  title: [{ required: true, message: '请输入作业标题', type: 'error' }],
  courseId: [{ required: true, message: '请选择所属课程', type: 'error' }],
  type: [{ required: true, message: '请选择作业类型', type: 'error' }],
  deadline: [
    { required: true, message: '请选择截止时间', type: 'error' },
    {
      validator: (val: string) => {
        if (!val) return { result: true }
        const now = new Date().toISOString().slice(0, 16)
        return { result: val >= now, message: '截止时间必须为未来时间', type: 'error' }
      },
    },
  ],
  format: [{ required: true, message: '请选择提交要求', type: 'error' }],
  publishTarget: [{ required: true, message: '请选择发布对象', type: 'error' }],
}

function openCreateDialog(row?: Assignment) {
  if (row) {
    formData.value = {
      editingId: row.id,
      title: row.title,
      courseId: row.courseId,
      type: row.type,
      deadline: row.deadline,
      format: 'image',
      publishTarget: 'all',
    }
  } else {
    formData.value = {
      editingId: '',
      title: '',
      courseId: '',
      type: '个人作业',
      deadline: '',
      format: 'image',
      publishTarget: 'all',
    }
  }
  dialogVisible.value = true
}

function resetForm() {
  formData.value = {
    editingId: '',
    title: '',
    courseId: '',
    type: '个人作业',
    deadline: '',
    format: 'image',
    publishTarget: 'all',
  }
}

function handleSave() {
  formRef.value?.validate().then((result: any) => {
    if (result === true || (typeof result === 'object' && Object.keys(result).length === 0)) {
      if (formData.value.editingId) {
        MessagePlugin.success('作业更新成功')
      } else {
        MessagePlugin.success('作业创建成功')
      }
      dialogVisible.value = false
      resetForm()
    }
  })
}

function handleDelete(row: Assignment) {
  MessagePlugin.success(`作业"${row.title}"已删除`)
}

function handlePublish(row: Assignment) {
  MessagePlugin.success(`作业"${row.title}"已发布`)
}

const submissionDrawerVisible = ref(false)
const submissionLoading = ref(false)
const submissions = ref<Submission[]>([])
const submissionTotal = ref(0)
const submissionPage = ref(1)
const submissionPageSize = ref(10)
const currentAssignmentId = ref('')
const submissionEmpty = computed(() => submissions.value.length === 0)

function openSubmissionDrawer(row: Assignment) {
  currentAssignmentId.value = row.id
  submissionPage.value = 1
  submissionDrawerVisible.value = true
  fetchSubmissions()
}

function fetchSubmissions() {
  submissionLoading.value = true
  try {
    const result = mockSubmissions(currentAssignmentId.value, submissionPage.value, submissionPageSize.value)
    submissions.value = result.items
    submissionTotal.value = result.total
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

function goToReview(submissionId: string) {
  submissionDrawerVisible.value = false
  router.push(`/reviews/${submissionId}`)
}

onMounted(() => {
  loading.value = true
  try {
    const result = mockAssignments(1, 100)
    allAssignments.value = result.items
  } catch {
    MessagePlugin.error('加载作业数据失败')
  } finally {
    loading.value = false
  }

  try {
    const coursesResult = mockCourses(1, 100)
    courseOptions.value = coursesResult.items.map(c => ({ id: c.id, title: c.title }))
  } catch {
    MessagePlugin.error('加载课程选项失败')
  }
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
