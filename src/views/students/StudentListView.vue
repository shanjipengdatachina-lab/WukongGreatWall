<template>
  <div class="student-list-page">
    <div class="filter-bar">
      <t-form :data="filters" layout="inline" @submit="handleSearch" @reset="handleReset">
        <t-form-item label="姓名" name="nameKeyword">
          <t-input v-model="filters.nameKeyword" placeholder="请输入姓名" clearable />
        </t-form-item>
        <t-form-item label="Scholar ID" name="scholarId">
          <t-input v-model="filters.scholarId" placeholder="请输入Scholar ID" clearable />
        </t-form-item>
        <t-form-item label="院校" name="university">
          <t-select
            v-model="filters.university"
            placeholder="请选择院校"
            clearable
            filterable
            :options="universityOptions"
          />
        </t-form-item>
        <t-form-item label="研究方向" name="researchDirection">
          <t-select
            v-model="filters.researchDirection"
            placeholder="请选择研究方向"
            clearable
            filterable
            :options="researchDirectionOptions"
          />
        </t-form-item>
        <t-form-item label="角色" name="roleType">
          <t-select
            v-model="filters.roleType"
            placeholder="请选择角色"
            clearable
            :options="roleOptions"
          />
        </t-form-item>
        <t-form-item label="权限可见性" name="visibility">
          <t-select
            v-model="filters.visibility"
            placeholder="请选择"
            clearable
            :options="visibilityOptions"
          />
        </t-form-item>
        <t-form-item>
          <t-space>
            <t-button theme="primary" type="submit">查询</t-button>
            <t-button theme="default" variant="outline" type="reset">重置</t-button>
          </t-space>
        </t-form-item>
      </t-form>
    </div>

    <div class="table-container">
      <div class="table-header">
        <span class="table-title">学员列表</span>
        <div class="toolbar-actions">
          <t-button theme="primary" @click="handleCreate">
            <t-icon name="add" />
            新增学员
          </t-button>
          <t-button variant="outline" @click="batchImportVisible = true">
            <t-icon name="upload" />
            批量导入
          </t-button>
        </div>
      </div>

      <t-loading :loading="loading" size="medium">
        <t-table
          v-if="tableData.length > 0 || !loading"
          row-key="id"
          :data="tableData"
          :columns="columns"
          :hover="true"
          :stripe="true"
          table-layout="auto"
        >
          <template #roleType="{ row }">
            <t-tag
              :theme="getRoleTheme(row.roleType)"
              variant="light"
              size="small"
            >
              {{ row.roleType }}
            </t-tag>
          </template>
          <template #courseProgress="{ row }">
            <t-progress
              :percentage="row.courseProgress"
              :label="`${row.courseProgress}%`"
              size="small"
            />
          </template>
          <template #visibility="{ row }">
            <t-tag
              :theme="row.visibility === 'visible' ? 'success' : 'default'"
              variant="light"
              size="small"
            >
              {{ row.visibility === 'visible' ? '可见' : '隐藏' }}
            </t-tag>
          </template>
          <template #reviewerAuthorized="{ row }">
            <t-tag
              :theme="getReviewerTheme(row)"
              variant="light"
              size="small"
            >
              {{ getReviewerLabel(row) }}
            </t-tag>
          </template>
          <template #operation="{ row }">
            <t-space size="small">
              <t-button variant="text" theme="primary" size="small" @click="handleView(row)">
                查看
              </t-button>
              <t-button variant="text" theme="primary" size="small" @click="handleEdit(row)">
                编辑
              </t-button>
              <t-button variant="text" theme="warning" size="small" @click="handleAuthorize(row)">
                授权
              </t-button>
              <t-popconfirm
                content="确定要禁用该学员吗？"
                theme="warning"
                @confirm="handleDisable(row)"
              >
                <t-button variant="text" theme="danger" size="small">
                  禁用
                </t-button>
              </t-popconfirm>
            </t-space>
          </template>
        </t-table>
        <t-empty v-else-if="!loading" description="暂无学员数据" />
      </t-loading>

      <div class="pagination-wrap" v-if="total > 0">
        <t-pagination
          v-model="pagination.current"
          v-model:page-size="pagination.pageSize"
          :total="total"
          :page-size-options="[10, 20, 50]"
          show-page-size
          show-jumper
          @change="handlePageChange"
          @page-size-change="handlePageSizeChange"
        />
      </div>
    </div>

    <t-drawer
      v-model:visible="detailVisible"
      header="学员详情"
      size="480px"
      :footer="false"
    >
      <div v-if="detailStudent" class="detail-content">
        <div class="detail-avatar-row">
          <t-avatar size="80px">{{ detailStudent.name?.charAt(0) }}</t-avatar>
          <div class="detail-avatar-info">
            <h3>{{ detailStudent.name }}</h3>
            <t-tag :theme="getRoleTheme(detailStudent.roleType)" variant="light" size="small">
              {{ detailStudent.roleType }}
            </t-tag>
          </div>
        </div>
        <t-divider />
        <div class="detail-grid">
          <div class="detail-item">
            <span class="detail-label">Scholar ID</span>
            <span class="detail-value">{{ detailStudent.scholarId }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">性别</span>
            <span class="detail-value">{{ detailStudent.gender }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">院校</span>
            <span class="detail-value">{{ detailStudent.university }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">专业</span>
            <span class="detail-value">{{ detailStudent.major }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">年级</span>
            <span class="detail-value">{{ detailStudent.grade }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">研究方向</span>
            <span class="detail-value">{{ detailStudent.researchDirection }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">手机号</span>
            <span class="detail-value">{{ detailStudent.phone }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">邮箱</span>
            <span class="detail-value">{{ detailStudent.email }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">入学日期</span>
            <span class="detail-value">{{ detailStudent.enrollmentDate }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">状态</span>
            <span class="detail-value">
              <t-tag :theme="detailStudent.status === 'active' ? 'success' : 'default'" variant="light" size="small">
                {{ detailStudent.status === 'active' ? '正常' : '已禁用' }}
              </t-tag>
            </span>
          </div>
        </div>
        <t-divider />
        <div class="detail-extra" v-if="detailStudentExtra">
          <div class="detail-item">
            <span class="detail-label">已完成作业</span>
            <span class="detail-value">{{ detailStudentExtra.completedAssignments }} / {{ detailStudentExtra.totalAssignments }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">参与课题</span>
            <span class="detail-value">{{ detailStudentExtra.topicCount }} 个</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">产出成果</span>
            <span class="detail-value">{{ detailStudentExtra.outcomeCount }} 项</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">登录次数</span>
            <span class="detail-value">{{ detailStudentExtra.loginCount }} 次</span>
          </div>
          <div class="detail-item detail-item-full">
            <span class="detail-label">最近登录</span>
            <span class="detail-value">{{ detailStudentExtra.lastLoginTime }}</span>
          </div>
          <div class="detail-item detail-item-full">
            <span class="detail-label">备注</span>
            <span class="detail-value">{{ detailStudentExtra.notes }}</span>
          </div>
        </div>
      </div>
      <t-loading v-else-if="detailLoading" text="加载中…" size="medium" />
    </t-drawer>

    <t-dialog
      v-model:visible="editVisible"
      :header="editMode === 'create' ? '新增学员' : '编辑学员'"
      width="600px"
      :confirm-btn="null"
      :cancel-btn="null"
    >
      <t-form
        ref="editFormRef"
        :data="editFormData"
        :rules="editFormRules"
        label-align="right"
        label-width="100px"
        @submit="handleEditSubmit"
      >
        <t-form-item label="姓名" name="name">
          <t-input v-model="editFormData.name" placeholder="请输入姓名" />
        </t-form-item>
        <t-form-item label="Scholar ID" name="scholarId">
          <t-input v-model="editFormData.scholarId" placeholder="请输入Scholar ID" />
        </t-form-item>
        <t-form-item label="角色" name="roleType">
          <t-select v-model="editFormData.roleType" placeholder="请选择角色" :options="roleOptions" />
        </t-form-item>
        <t-form-item label="院校" name="university">
          <t-input v-model="editFormData.university" placeholder="请输入院校" />
        </t-form-item>
        <t-form-item label="专业" name="major">
          <t-input v-model="editFormData.major" placeholder="请输入专业" />
        </t-form-item>
        <t-form-item label="研究方向" name="researchDirection">
          <t-input v-model="editFormData.researchDirection" placeholder="请输入研究方向" />
        </t-form-item>
        <t-form-item label="年级" name="grade">
          <t-input v-model="editFormData.grade" placeholder="请输入年级" />
        </t-form-item>
        <t-form-item label="手机号" name="phone">
          <t-input v-model="editFormData.phone" placeholder="请输入手机号" />
        </t-form-item>
        <t-form-item label="邮箱" name="email">
          <t-input v-model="editFormData.email" placeholder="请输入邮箱" />
        </t-form-item>
        <t-form-item label="权限可见性" name="visibility">
          <t-radio-group v-model="editFormData.visibility">
            <t-radio value="visible">可见</t-radio>
            <t-radio value="hidden">隐藏</t-radio>
          </t-radio-group>
        </t-form-item>
        <t-form-item>
          <t-space>
            <t-button theme="primary" type="submit" :loading="editSubmitting">
              {{ editMode === 'create' ? '创建' : '保存' }}
            </t-button>
            <t-button theme="default" variant="outline" @click="handleEditCancel">
              取消
            </t-button>
          </t-space>
        </t-form-item>
      </t-form>
    </t-dialog>

    <t-dialog
      v-model:visible="batchImportVisible"
      header="批量导入学员"
      width="520px"
      :confirm-btn="null"
      :cancel-btn="null"
    >
      <t-alert theme="info" message="请上传Excel文件（.xlsx/.xls），文件需包含学员基本信息列" style="margin-bottom: 16px" />
      <t-upload
        v-model="uploadFiles"
        theme="file"
        accept=".xlsx,.xls"
        :auto-upload="false"
        :max="1"
        tips="仅支持 .xlsx / .xls 格式文件"
      />
      <t-space style="margin-top: 16px">
        <t-button theme="primary" @click="handleBatchImportConfirm" :loading="importLoading">
          开始导入
        </t-button>
        <t-button theme="default" variant="outline" @click="batchImportVisible = false">
          取消
        </t-button>
      </t-space>
    </t-dialog>

    <t-dialog
      v-model:visible="authorizeVisible"
      header="评审员授权"
      width="480px"
      :confirm-btn="null"
      :cancel-btn="null"
    >
      <t-form
        ref="authFormRef"
        :data="authFormData"
        :rules="authFormRules"
        label-align="right"
        label-width="100px"
        @submit="handleAuthorizeSubmit"
      >
        <t-form-item label="学员">
          <t-input :value="authorizeStudent?.name" disabled />
        </t-form-item>
        <t-form-item label="授权状态" name="authorized">
          <t-switch v-model="authFormData.authorized" />
          <span style="margin-left: 8px; color: #86909C;">
            {{ authFormData.authorized ? '已授权' : '未授权' }}
          </span>
        </t-form-item>
        <t-form-item label="授权范围" name="scope">
          <t-checkbox-group v-model="authFormData.scope">
            <t-checkbox value="course">课程评审</t-checkbox>
            <t-checkbox value="assignment">作业评审</t-checkbox>
            <t-checkbox value="outcome">成果评审</t-checkbox>
          </t-checkbox-group>
        </t-form-item>
        <t-form-item>
          <t-space>
            <t-button theme="primary" type="submit" :loading="authSubmitting">
              确认授权
            </t-button>
            <t-button theme="default" variant="outline" @click="authorizeVisible = false">
              取消
            </t-button>
          </t-space>
        </t-form-item>
      </t-form>
    </t-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import type { FormInstanceFunctions, FormRule } from 'tdesign-vue-next'
import { mockStudents, mockStudent } from '@/mock/students'
import type { Student, StudentDetail } from '@/mock/types'

const loading = ref(true)
const tableData = ref<Student[]>([])
const total = ref(0)

const filters = reactive({
  nameKeyword: '',
  scholarId: '',
  university: '',
  researchDirection: '',
  roleType: '',
  visibility: '',
})

const pagination = reactive({
  current: 1,
  pageSize: 10,
})

const universityOptions = [
  { label: '唐山工业职业技术大学', value: '唐山工业职业技术大学' },
  { label: '河北工业大学', value: '河北工业大学' },
  { label: '沧州师范学院', value: '沧州师范学院' },
  { label: '河北经贸大学', value: '河北经贸大学' },
  { label: '华北理工大学', value: '华北理工大学' },
  { label: '鲁迅美术学院', value: '鲁迅美术学院' },
  { label: '燕山大学', value: '燕山大学' },
  { label: '河北大学', value: '河北大学' },
  { label: '河北师范大学', value: '河北师范大学' },
  { label: '石家庄铁道大学', value: '石家庄铁道大学' },
  { label: '河北科技大学', value: '河北科技大学' },
  { label: '唐山学院', value: '唐山学院' },
  { label: '唐山师范学院', value: '唐山师范学院' },
  { label: '河北工程大学', value: '河北工程大学' },
]

const researchDirectionOptions = [
  { label: 'UE5可视化开发', value: 'UE5可视化开发' },
  { label: '数字人文研究', value: '数字人文研究' },
  { label: '交互设计', value: '交互设计' },
  { label: '数字文化遗产保护', value: '数字文化遗产保护' },
  { label: 'AI辅助设计', value: 'AI辅助设计' },
  { label: '可视化设计', value: '可视化设计' },
  { label: 'Blender建模', value: 'Blender建模' },
  { label: '虚拟现实应用', value: '虚拟现实应用' },
  { label: 'Houdini特效制作', value: 'Houdini特效制作' },
  { label: '游戏引擎开发', value: '游戏引擎开发' },
  { label: '影视特效', value: '影视特效' },
]

const roleOptions = [
  { label: '学员', value: '学员' },
  { label: '教师', value: '教师' },
  { label: '评审员', value: '评审员' },
  { label: '管理员', value: '管理员' },
]

const visibilityOptions = [
  { label: '可见', value: 'visible' },
  { label: '隐藏', value: 'hidden' },
]

const columns = [
  { colKey: 'scholarId', title: 'Scholar ID', width: 130, ellipsis: true },
  { colKey: 'name', title: '姓名', width: 100 },
  { colKey: 'university', title: '院校', width: 180, ellipsis: true },
  { colKey: 'researchDirection', title: '研究方向', width: 140, ellipsis: true },
  { colKey: 'roleType', title: '角色', width: 90, cell: 'roleType' },
  { colKey: 'courseProgress', title: '课程进度', width: 160, cell: 'courseProgress' },
  { colKey: 'visibility', title: '权限可见性', width: 100, cell: 'visibility' },
  { colKey: 'reviewerAuthorized', title: '评审员授权', width: 100, cell: 'reviewerAuthorized' },
  { colKey: 'operation', title: '操作', width: 240, cell: 'operation', fixed: 'right' },
]

const detailVisible = ref(false)
const detailLoading = ref(false)
const detailStudent = ref<Student | null>(null)
const detailStudentExtra = ref<StudentDetail | null>(null)

const editVisible = ref(false)
const editMode = ref<'create' | 'edit'>('create')
const editSubmitting = ref(false)
const editFormRef = ref<FormInstanceFunctions>()
const editingId = ref<string>('')

const editFormData = reactive({
  name: '',
  scholarId: '',
  roleType: '学员',
  university: '',
  major: '',
  researchDirection: '',
  grade: '',
  phone: '',
  email: '',
  visibility: 'visible' as 'visible' | 'hidden',
})

const editFormRules: Record<string, FormRule[]> = {
  name: [{ required: true, message: '请输入姓名', type: 'error' }],
  scholarId: [{ required: true, message: '请输入Scholar ID', type: 'error' }],
  roleType: [{ required: true, message: '请选择角色', type: 'error' }],
  university: [{ required: true, message: '请输入院校', type: 'error' }],
  email: [{ email: true, message: '请输入正确的邮箱格式', type: 'error' }],
}

const batchImportVisible = ref(false)
const importLoading = ref(false)
const uploadFiles = ref<any[]>([])

const authorizeVisible = ref(false)
const authSubmitting = ref(false)
const authorizeStudent = ref<Student | null>(null)
const authFormRef = ref<FormInstanceFunctions>()

const authFormData = reactive({
  authorized: false,
  scope: [] as string[],
})

const authFormRules: Record<string, FormRule[]> = {
  scope: [{ required: true, message: '请选择授权范围', type: 'error' }],
}

const roleThemeMap: Record<string, string> = {
  '学员': 'primary',
  '教师': 'success',
  '评审员': 'warning',
  '管理员': 'danger',
}

function getRoleTheme(roleType: string): string {
  return roleThemeMap[roleType] || 'default'
}

function getReviewerTheme(row: Student): string {
  return row.roleType === '评审员' ? 'success' : 'default'
}

function getReviewerLabel(row: Student): string {
  return row.roleType === '评审员' ? '已授权' : '未授权'
}

function fetchData() {
  loading.value = true
  setTimeout(() => {
    const keyword = filters.nameKeyword || filters.scholarId || undefined
    const result = mockStudents(pagination.current, pagination.pageSize, {
      keyword,
      university: filters.university || undefined,
      researchDirection: filters.researchDirection || undefined,
    })

    let filtered = result.items || []
    if (filters.roleType) {
      filtered = filtered.filter((s) => s.roleType === filters.roleType)
    }
    if (filters.visibility) {
      filtered = filtered.filter((s) => s.visibility === filters.visibility)
    }

    if (filters.roleType || filters.visibility) {
      const allResult = mockStudents(1, 200, {
        keyword,
        university: filters.university || undefined,
        researchDirection: filters.researchDirection || undefined,
      })
      let allFiltered = allResult.items || []
      if (filters.roleType) {
        allFiltered = allFiltered.filter((s) => s.roleType === filters.roleType)
      }
      if (filters.visibility) {
        allFiltered = allFiltered.filter((s) => s.visibility === filters.visibility)
      }
      total.value = allFiltered.length
      const start = (pagination.current - 1) * pagination.pageSize
      tableData.value = allFiltered.slice(start, start + pagination.pageSize)
    } else {
      total.value = result.total
      tableData.value = filtered
    }

    loading.value = false
  }, 300)
}

function handleSearch() {
  pagination.current = 1
  fetchData()
}

function handleReset() {
  filters.nameKeyword = ''
  filters.scholarId = ''
  filters.university = ''
  filters.researchDirection = ''
  filters.roleType = ''
  filters.visibility = ''
  pagination.current = 1
  fetchData()
}

function handlePageChange() {
  fetchData()
}

function handlePageSizeChange() {
  pagination.current = 1
  fetchData()
}

async function handleView(row: Student) {
  detailVisible.value = true
  detailLoading.value = true
  detailStudent.value = row
  detailStudentExtra.value = null

  setTimeout(() => {
    const detail = mockStudent(row.id)
    if (detail) {
      detailStudentExtra.value = detail
    }
    detailLoading.value = false
  }, 300)
}

function handleCreate() {
  editMode.value = 'create'
  editingId.value = ''
  editFormData.name = ''
  editFormData.scholarId = ''
  editFormData.roleType = '学员'
  editFormData.university = ''
  editFormData.major = ''
  editFormData.researchDirection = ''
  editFormData.grade = ''
  editFormData.phone = ''
  editFormData.email = ''
  editFormData.visibility = 'visible'
  editVisible.value = true
}

function handleEdit(row: Student) {
  editMode.value = 'edit'
  editingId.value = row.id
  editFormData.name = row.name
  editFormData.scholarId = row.scholarId
  editFormData.roleType = row.roleType
  editFormData.university = row.university
  editFormData.major = row.major
  editFormData.researchDirection = row.researchDirection
  editFormData.grade = row.grade
  editFormData.phone = row.phone
  editFormData.email = row.email
  editFormData.visibility = row.visibility
  editVisible.value = true
}

async function handleEditSubmit() {
  const valid = await editFormRef.value?.validate()
  if (valid !== true) return

  editSubmitting.value = true
  setTimeout(() => {
    if (editMode.value === 'create') {
      MessagePlugin.success('学员创建成功')
    } else {
      MessagePlugin.success('学员信息已更新')
    }
    editSubmitting.value = false
    editVisible.value = false
    fetchData()
  }, 500)
}

function handleEditCancel() {
  editVisible.value = false
}

function handleDisable(row: Student) {
  MessagePlugin.success(`学员 ${row.name} 已禁用`)
  fetchData()
}

function handleAuthorize(row: Student) {
  authorizeStudent.value = row
  authFormData.authorized = row.roleType === '评审员'
  authFormData.scope = row.roleType === '评审员' ? ['course', 'assignment', 'outcome'] : []
  authorizeVisible.value = true
}

async function handleAuthorizeSubmit() {
  const valid = await authFormRef.value?.validate()
  if (valid !== true) return

  authSubmitting.value = true
  setTimeout(() => {
    MessagePlugin.success('授权设置已保存')
    authSubmitting.value = false
    authorizeVisible.value = false
  }, 400)
}

function handleBatchImportConfirm() {
  if (uploadFiles.value.length === 0) {
    MessagePlugin.warning('请先选择文件')
    return
  }
  importLoading.value = true
  setTimeout(() => {
    importLoading.value = false
    batchImportVisible.value = false
    uploadFiles.value = []
    MessagePlugin.success('导入成功')
    fetchData()
  }, 1500)
}

fetchData()
</script>

<style scoped>
.student-list-page {
  padding: 0;
}

.filter-bar {
  background: #fff;
  padding: 16px 24px 4px;
  border-radius: 6px;
  margin-bottom: 16px;
}

.table-container {
  background: #fff;
  padding: 0 24px 24px;
  border-radius: 6px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
}

.table-title {
  font-size: 16px;
  font-weight: 600;
  color: #1F2329;
}

.toolbar-actions {
  display: flex;
  gap: 8px;
}

.pagination-wrap {
  display: flex;
  justify-content: flex-end;
  padding-top: 16px;
}

.detail-content {
  padding: 0 4px;
}

.detail-avatar-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
}

.detail-avatar-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.detail-avatar-info h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1F2329;
  margin: 0;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 24px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-item-full {
  grid-column: span 2;
}

.detail-label {
  font-size: 13px;
  color: #86909C;
}

.detail-value {
  font-size: 14px;
  color: #1F2329;
}

.detail-extra {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 24px;
}
</style>
