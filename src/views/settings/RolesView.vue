<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">角色权限</h2>
      <t-button theme="primary" @click="handleCreate">
        <template #icon><t-icon name="add" /></template>
        新增角色
      </t-button>
    </div>

    <t-loading :loading="loading" size="medium">
      <template v-if="error">
        <t-alert theme="error" :message="error" close @close="error = ''" />
      </template>

      <template v-else-if="!loading && roleList.length > 0">
        <t-card :bordered="true" class="table-card">
          <t-table
            row-key="id"
            :data="roleList"
            :columns="columns"
            stripe
            hover
            table-layout="auto"
          >
            <template #name="{ row }">
              <span class="role-name">{{ row.name }}</span>
              <span class="role-code">{{ row.code }}</span>
            </template>
            <template #description="{ row }">
              <span class="role-desc">{{ row.description }}</span>
            </template>
            <template #userCount="{ row }">
              <t-tag theme="primary" variant="light">{{ row.userCount }} 人</t-tag>
            </template>
            <template #operation="{ row }">
              <t-space size="small">
                <t-link theme="primary" hover="color" @click="handleEdit(row)">编辑</t-link>
                <t-link theme="primary" hover="color" @click="handlePermission(row)">权限配置</t-link>
                <t-popconfirm
                  content="删除角色可能影响已有用户，确认删除？"
                  @confirm="handleDelete(row)"
                >
                  <t-link theme="danger" hover="color">删除</t-link>
                </t-popconfirm>
              </t-space>
            </template>
          </t-table>
        </t-card>
      </template>

      <t-empty v-else-if="!loading" description="暂无角色数据" />
    </t-loading>

    <t-dialog
      v-model:visible="formVisible"
      :header="isEditing ? '编辑角色' : '新增角色'"
      width="560px"
      :confirm-btn="null"
      :cancel-btn="null"
      @close="handleFormClose"
    >
      <t-form
        ref="formRef"
        :data="formData"
        :rules="formRules"
        label-width="100px"
        @submit="handleFormSubmit"
      >
        <t-form-item label="角色名称" name="name">
          <t-input v-model="formData.name" placeholder="请输入角色名称" />
        </t-form-item>
        <t-form-item label="角色编码" name="code">
          <t-input v-model="formData.code" placeholder="请输入角色编码" :disabled="isEditing" />
        </t-form-item>
        <t-form-item label="角色描述" name="description">
          <t-textarea
            v-model="formData.description"
            placeholder="请输入角色描述"
            :maxlength="200"
          />
        </t-form-item>
        <t-form-item label="权限配置" name="permissions">
          <t-checkbox-group v-model="formData.permissions">
            <div class="permission-grid">
              <t-checkbox
                v-for="perm in allPermissions"
                :key="perm.value"
                :value="perm.value"
              >
                {{ perm.label }}
              </t-checkbox>
            </div>
          </t-checkbox-group>
        </t-form-item>
        <t-form-item>
          <t-space>
            <t-button theme="primary" type="submit">保存</t-button>
            <t-button variant="outline" @click="handleFormClose">取消</t-button>
          </t-space>
        </t-form-item>
      </t-form>
    </t-dialog>

    <t-dialog
      v-model:visible="permVisible"
      header="权限配置"
      width="560px"
      :confirm-btn="null"
      :cancel-btn="null"
    >
      <t-form
        :data="permFormData"
        label-width="100px"
        @submit="handlePermSubmit"
        v-if="permTarget"
      >
        <t-form-item label="角色名称">
          <t-input :value="permTarget.name" disabled />
        </t-form-item>
        <t-form-item label="权限配置" name="permissions">
          <t-checkbox-group v-model="permFormData.permissions">
            <div class="permission-grid">
              <t-checkbox
                v-for="perm in allPermissions"
                :key="perm.value"
                :value="perm.value"
              >
                {{ perm.label }}
              </t-checkbox>
            </div>
          </t-checkbox-group>
        </t-form-item>
        <t-form-item>
          <t-space>
            <t-button theme="primary" type="submit">保存权限</t-button>
            <t-button variant="outline" @click="permVisible = false">取消</t-button>
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
import { mockRoles } from '@/mock'
import type { Role } from '@/mock/types'

const loading = ref(false)
const error = ref('')
const roleList = ref<Role[]>([])
const formVisible = ref(false)
const isEditing = ref(false)
const editingId = ref('')
const permVisible = ref(false)
const permTarget = ref<Role | null>(null)

const formRef = ref<FormInstanceFunctions | null>(null)

const allPermissions = [
  { label: '学员管理', value: 'student:manage' },
  { label: '课程管理', value: 'course:manage' },
  { label: '作业管理', value: 'assignment:manage' },
  { label: '评审管理', value: 'review:manage' },
  { label: '课题管理', value: 'topic:manage' },
  { label: '任务管理', value: 'task:manage' },
  { label: '成果管理', value: 'outcome:manage' },
  { label: '协作空间', value: 'collaboration:manage' },
  { label: '资源中心', value: 'resource:manage' },
  { label: '培训邀约', value: 'invitation:manage' },
  { label: '数据统计', value: 'analytics:view' },
  { label: '消息中心', value: 'message:manage' },
  { label: '系统设置', value: 'system:manage' },
]

const columns = [
  { colKey: 'name', title: '角色名称', width: 180 },
  { colKey: 'description', title: '角色描述', ellipsis: true },
  { colKey: 'userCount', title: '关联用户', width: 100 },
  { colKey: 'createdAt', title: '创建时间', width: 140 },
  { colKey: 'operation', title: '操作', width: 220 },
]

interface RoleForm {
  name: string
  code: string
  description: string
  permissions: string[]
}

const defaultFormData: RoleForm = {
  name: '',
  code: '',
  description: '',
  permissions: [],
}

const formData = reactive<RoleForm>({ ...defaultFormData })

const formRules: Record<string, FormRule[]> = {
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入角色编码', trigger: 'blur' }],
}

const permFormData = reactive({
  permissions: [] as string[],
})

function loadRoles() {
  loading.value = true
  error.value = ''
  try {
    roleList.value = mockRoles()
  } catch (e: any) {
    error.value = e?.message || '角色数据加载失败'
  } finally {
    loading.value = false
  }
}

function handleCreate() {
  isEditing.value = false
  editingId.value = ''
  Object.assign(formData, { ...defaultFormData })
  formVisible.value = true
}

function handleEdit(row: Role) {
  isEditing.value = true
  editingId.value = row.id
  formData.name = row.name
  formData.code = row.code
  formData.description = row.description
  formData.permissions = [...row.permissions]
  formVisible.value = true
}

function handleDelete(row: Role) {
  const idx = roleList.value.findIndex((r) => r.id === row.id)
  if (idx > -1) {
    roleList.value.splice(idx, 1)
    MessagePlugin.success('角色已删除')
  }
}

function handlePermission(row: Role) {
  permTarget.value = row
  permFormData.permissions = [...row.permissions]
  permVisible.value = true
}

async function handleFormSubmit() {
  const valid = await formRef.value?.validate()
  if (valid !== true) return

  const now = new Date().toISOString().slice(0, 10)
  if (isEditing.value) {
    const target = roleList.value.find((r) => r.id === editingId.value)
    if (target) {
      target.name = formData.name
      target.code = formData.code
      target.description = formData.description
      target.permissions = [...formData.permissions]
    }
    MessagePlugin.success('角色已更新')
  } else {
    const newRole: Role = {
      id: `ROLE_${Date.now()}`,
      name: formData.name,
      code: formData.code,
      description: formData.description,
      permissions: [...formData.permissions],
      userCount: 0,
      createdAt: now,
    }
    roleList.value.unshift(newRole)
    MessagePlugin.success('角色已创建')
  }
  formVisible.value = false
}

async function handlePermSubmit() {
  if (permTarget.value) {
    permTarget.value.permissions = [...permFormData.permissions]
    MessagePlugin.success('权限配置已保存')
  }
  permVisible.value = false
}

function handleFormClose() {
  formVisible.value = false
  formRef.value?.clearValidate()
}

loadRoles()
</script>

<style scoped>
.page-container {
  max-width: 1200px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #1F2329;
  margin: 0;
}

.table-card {
  border-radius: 8px;
}

.role-name {
  font-weight: 600;
  color: #1F2329;
}

.role-code {
  font-size: 12px;
  color: #999;
  margin-left: 8px;
  background: #F5F7FA;
  padding: 1px 6px;
  border-radius: 3px;
}

.role-desc {
  color: #666;
}

.permission-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px 16px;
  width: 100%;
  padding: 8px 0;
}
</style>
