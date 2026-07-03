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
        <t-form-item label="状态" name="status">
          <t-select
            v-model="filters.status"
            placeholder="请选择状态"
            clearable
            :options="statusOptions"
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
          <template #avatar="{ row }">
            <t-avatar v-if="getAvatarUrl(row)" :image="getAvatarUrl(row)" size="36px" />
            <t-avatar v-else size="36px">{{ getDisplayName(row)?.charAt(0) }}</t-avatar>
          </template>
          <template #realName="{ row }">
            <span class="student-name">{{ getDisplayName(row) }}</span>
          </template>
          <template #roleType="{ row }">
            <t-tag :theme="getRoleTheme(row.role)" variant="light" size="small">
              {{ roleLabelMap[row.role] || row.role }}
            </t-tag>
          </template>
          <template #status="{ row }">
            <t-tag :theme="row.status === 'active' ? 'success' : 'default'" variant="light" size="small">
              {{ row.status === 'active' ? '正常' : '已禁用' }}
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
              <t-popconfirm
                content="确定要重置该学员的密码为默认密码吗？"
                theme="warning"
                @confirm="handleResetPassword(row)"
              >
                <t-button variant="text" theme="warning" size="small">
                  重置密码
                </t-button>
              </t-popconfirm>
              <t-popconfirm
                content="确定要禁用该学员吗？"
                theme="danger"
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
      <div v-if="detailData" class="detail-content">
        <div class="detail-avatar-row">
          <t-avatar v-if="getAvatarUrl(detailData)" :image="getAvatarUrl(detailData)" size="80px" />
          <t-avatar v-else size="80px">{{ getDisplayName(detailData)?.charAt(0) }}</t-avatar>
          <div class="detail-avatar-info">
            <h3>{{ getDisplayName(detailData) }}</h3>
            <t-tag :theme="getRoleTheme(detailData.role)" variant="light" size="small">
              {{ roleLabelMap[detailData.role] || detailData.role }}
            </t-tag>
          </div>
        </div>
        <t-divider />
        <div class="detail-grid">
          <div class="detail-item">
            <span class="detail-label">Scholar ID</span>
            <span class="detail-value">{{ detailData.scholar_id || '-' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">学号</span>
            <span class="detail-value">{{ detailData.profile?.student_id || '-' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">院校</span>
            <span class="detail-value">{{ detailData.profile?.institution?.name || '-' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">研究方向</span>
            <span class="detail-value">{{ detailData.profile?.research_direction || '-' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">手机号</span>
            <span class="detail-value">{{ detailData.profile?.phone || '-' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">邮箱</span>
            <span class="detail-value">{{ detailData.email || '-' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">用户名</span>
            <span class="detail-value">{{ detailData.username || '-' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">角色</span>
            <span class="detail-value">
              <t-tag :theme="getRoleTheme(detailData.role)" variant="light" size="small">
                {{ roleLabelMap[detailData.role] || detailData.role }}
              </t-tag>
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-label">状态</span>
            <span class="detail-value">
              <t-tag :theme="detailData.status === 'active' ? 'success' : 'default'" variant="light" size="small">
                {{ detailData.status === 'active' ? '正常' : '已禁用' }}
              </t-tag>
            </span>
          </div>
          <div class="detail-item detail-item-full">
            <span class="detail-label">个人简介</span>
            <span class="detail-value">{{ detailData.profile?.bio || '-' }}</span>
          </div>
        </div>
      </div>
      <t-loading v-else text="加载中…" size="medium" />
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
        <t-form-item label="姓名" name="real_name">
          <t-input v-model="editFormData.real_name" placeholder="请输入姓名" />
        </t-form-item>
        <t-form-item label="学号" name="student_id">
          <t-input v-model="editFormData.student_id" placeholder="请输入学号" />
        </t-form-item>
        <t-form-item label="院校" name="institution_name">
          <t-input v-model="editFormData.institution_name" placeholder="请输入院校" />
        </t-form-item>
        <t-form-item label="邮箱" name="email">
          <t-input v-model="editFormData.email" placeholder="请输入邮箱" />
        </t-form-item>
        <t-form-item label="手机号" name="phone">
          <t-input v-model="editFormData.phone" placeholder="请输入手机号" />
        </t-form-item>
        <t-form-item label="研究方向" name="research_direction">
          <t-input v-model="editFormData.research_direction" placeholder="请输入研究方向" />
        </t-form-item>
        <t-form-item>
          <t-space>
            <t-button theme="primary" type="submit" :loading="editSubmitting">
              {{ editMode === 'create' ? '创建' : '保存' }}
            </t-button>
            <t-button theme="default" variant="outline" @click="editVisible = false">
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import type { FormInstanceFunctions, FormRule } from 'tdesign-vue-next'
import { getStudents, getStudent, createStudent, updateStudent, disableStudent, resetPassword } from '@/api/students'

const AVATAR_BASE = 'http://localhost:3001'

const loading = ref(true)
const tableData = ref<any[]>([])
const total = ref(0)

const filters = reactive({
  nameKeyword: '',
  scholarId: '',
  university: '',
  status: '',
})

const pagination = reactive({
  current: 1,
  pageSize: 10,
})

const universityOptions = [
  { label: '唐山工业职业技术大学', value: '唐山工业职业技术大学' },
  { label: '河北工业大学', value: '河北工业大学' },
  { label: '沧州师范学院', value: '沧州师范学院' },
  { label: '河北工艺美术职业学院', value: '河北工艺美术职业学院' },
  { label: '华北理工大学', value: '华北理工大学' },
  { label: '华北理工大学艺术学院', value: '华北理工大学艺术学院' },
  { label: '河北科技大学艺术学院', value: '河北科技大学艺术学院' },
  { label: '河北经贸大学', value: '河北经贸大学' },
  { label: '河北农业大学艺术学院', value: '河北农业大学艺术学院' },
  { label: '河北建材职业技术学院', value: '河北建材职业技术学院' },
  { label: '河北美术学院', value: '河北美术学院' },
  { label: '河北大学', value: '河北大学' },
  { label: '河北东方学院文物艺术学院', value: '河北东方学院文物艺术学院' },
  { label: '北华航天工业学院', value: '北华航天工业学院' },
  { label: '唐山师范学院美术学院', value: '唐山师范学院美术学院' },
  { label: '榆林大学艺术学院', value: '榆林大学艺术学院' },
  { label: '鲁迅美术学院', value: '鲁迅美术学院' },
  { label: '四川旅游学院', value: '四川旅游学院' },
  { label: '河南工学院', value: '河南工学院' },
  { label: '泉州海洋职业学院', value: '泉州海洋职业学院' },
  { label: '内蒙古艺术学院', value: '内蒙古艺术学院' },
  { label: '兰州文理学院', value: '兰州文理学院' },
  { label: '自由创作人', value: '自由创作人' },
  { label: '自由插画师', value: '自由插画师' },
]

const statusOptions = [
  { label: '正常', value: 'active' },
  { label: '已禁用', value: 'inactive' },
]

const roleLabelMap: Record<string, string> = {
  admin: '管理员',
  student: '学员',
  reviewer: '评审员',
}

const columns = [
  { colKey: 'avatar', title: '头像', width: 60, cell: 'avatar' },
  { colKey: 'realName', title: '姓名', width: 100, cell: 'realName' },
  { colKey: 'scholar_id', title: 'Scholar ID', width: 130, ellipsis: true },
  { colKey: 'university', title: '院校', width: 180, ellipsis: true },
  { colKey: 'roleType', title: '角色', width: 80, cell: 'roleType' },
  { colKey: 'status', title: '状态', width: 80, cell: 'status' },
  { colKey: 'operation', title: '操作', width: 200, cell: 'operation', fixed: 'right' },
]

const roleThemeMap: Record<string, string> = {
  admin: 'danger',
  student: 'primary',
  reviewer: 'warning',
}

function getRoleTheme(role: string): string {
  return roleThemeMap[role] || 'default'
}

function getDisplayName(row: any): string {
  return row?.profile?.real_name || row?.username || ''
}

function getAvatarUrl(row: any): string {
  const avatarPath = row?.profile?.avatar
  if (!avatarPath) return ''
  return `${AVATAR_BASE}${avatarPath}`
}

function getInstitutionName(row: any): string {
  return row?.profile?.institution?.name || ''
}

async function fetchData() {
  loading.value = true
  try {
    const params: Record<string, any> = {
      role: 'student',
      page: pagination.current,
      limit: pagination.pageSize,
    }
    if (filters.status) params.status = filters.status
    const res: any = await getStudents(params)

    let items = res.data || []
    if (filters.nameKeyword) {
      const kw = filters.nameKeyword.toLowerCase()
      items = items.filter((s: any) =>
        (s.profile?.real_name || '').includes(kw) ||
        (s.username || '').includes(kw)
      )
    }
    if (filters.scholarId) {
      const kw = filters.scholarId.toLowerCase()
      items = items.filter((s: any) =>
        (s.scholar_id || '').toLowerCase().includes(kw) ||
        (s.profile?.student_id || '').includes(kw)
      )
    }
    if (filters.university) {
      items = items.filter((s: any) =>
        getInstitutionName(s) === filters.university
      )
    }

    const enriched = items.map((item: any) => ({
      ...item,
      university: getInstitutionName(item),
    }))

    total.value = res.pagination?.total || 0
    tableData.value = enriched
  } catch (error) {
    console.error('Failed to fetch students:', error)
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  pagination.current = 1
  fetchData()
}

function handleReset() {
  filters.nameKeyword = ''
  filters.scholarId = ''
  filters.university = ''
  filters.status = ''
  pagination.current = 1
  fetchData()
}

function handlePageChange() { fetchData() }
function handlePageSizeChange() { pagination.current = 1; fetchData() }

const detailVisible = ref(false)
const detailData = ref<any>(null)

async function handleView(row: any) {
  detailVisible.value = true
  detailData.value = null
  try {
    const res: any = await getStudent(row.id)
    detailData.value = res
  } catch (error) {
    detailData.value = row
  }
}

const editVisible = ref(false)
const editMode = ref<'create' | 'edit'>('create')
const editSubmitting = ref(false)
const editFormRef = ref<FormInstanceFunctions>()
const editingId = ref<number>(0)

const editFormData = reactive({
  real_name: '',
  student_id: '',
  institution_name: '',
  email: '',
  phone: '',
  research_direction: '',
})

const editFormRules: Record<string, FormRule[]> = {
  real_name: [{ required: true, message: '请输入姓名', type: 'error' }],
  student_id: [{ required: true, message: '请输入学号', type: 'error' }],
}

function handleCreate() {
  editMode.value = 'create'
  editingId.value = 0
  editFormData.real_name = ''
  editFormData.student_id = ''
  editFormData.institution_name = ''
  editFormData.email = ''
  editFormData.phone = ''
  editFormData.research_direction = ''
  editVisible.value = true
}

function handleEdit(row: any) {
  editMode.value = 'edit'
  editingId.value = row.id
  editFormData.real_name = row.profile?.real_name || ''
  editFormData.student_id = row.profile?.student_id || ''
  editFormData.institution_name = row.profile?.institution?.name || ''
  editFormData.email = row.email || ''
  editFormData.phone = row.profile?.phone || ''
  editFormData.research_direction = row.profile?.research_direction || ''
  editVisible.value = true
}

async function handleEditSubmit() {
  const valid = await editFormRef.value?.validate()
  if (valid !== true) return

  editSubmitting.value = true
  try {
    if (editMode.value === 'create') {
      await createStudent({
        username: `student${editFormData.student_id}`,
        email: editFormData.email || `student${editFormData.student_id}@wukong.com`,
        password: 'student@123',
        role: 'student',
        profile: {
          real_name: editFormData.real_name,
          student_id: editFormData.student_id,
        }
      })
      MessagePlugin.success('学员创建成功')
    } else {
      await updateStudent(editingId.value, {
        email: editFormData.email,
        real_name: editFormData.real_name,
        student_id: editFormData.student_id,
        institution_name: editFormData.institution_name,
        phone: editFormData.phone,
        research_direction: editFormData.research_direction,
      })
      MessagePlugin.success('学员信息已更新')
    }
    editVisible.value = false
    fetchData()
  } catch (error) {
    MessagePlugin.error('操作失败')
  } finally {
    editSubmitting.value = false
  }
}

async function handleResetPassword(row: any) {
  try {
    const res: any = await resetPassword(row.id)
    MessagePlugin.success(`学员 ${getDisplayName(row)} 密码已重置为: ${res.password || 'student@123'}`)
  } catch (error) {
    MessagePlugin.error('密码重置失败')
  }
}

async function handleDisable(row: any) {
  try {
    await disableStudent(row.id)
    MessagePlugin.success(`学员 ${getDisplayName(row)} 已禁用`)
    fetchData()
  } catch (error) {
    MessagePlugin.error('禁用失败')
  }
}

const batchImportVisible = ref(false)
const importLoading = ref(false)
const uploadFiles = ref<any[]>([])

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

.student-name {
  font-weight: 500;
  color: #1F2329;
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
</style>
