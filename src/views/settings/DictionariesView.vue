<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">基础字典</h2>
    </div>

    <t-loading :loading="loading" size="medium">
      <template v-if="error">
        <t-alert theme="error" :message="error" close @close="error = ''" />
      </template>

      <template v-else-if="!loading && dictionaries.length > 0">
        <div class="dict-layout">
          <t-card class="dict-left" :bordered="true">
            <div class="category-title">字典分类</div>
            <div class="category-list">
              <div
                v-for="dict in dictionaries"
                :key="dict.id"
                class="category-item"
                :class="{ active: activeCategory === dict.id }"
                @click="selectCategory(dict.id)"
              >
                <t-icon name="layers" size="16px" />
                <span>{{ dict.name }}</span>
                <span class="category-count">{{ dict.items.length }}</span>
              </div>
            </div>
          </t-card>

          <t-card class="dict-right" :bordered="true">
            <template v-if="activeDict">
              <div class="dict-header">
                <span class="dict-name">{{ activeDict.name }}</span>
                <t-button theme="primary" size="small" @click="handleCreateItem">
                  <template #icon><t-icon name="add" /></template>
                  新增字典项
                </t-button>
              </div>

              <t-table
                row-key="id"
                :data="activeDict.items"
                :columns="itemColumns"
                stripe
                hover
                table-layout="auto"
              >
                <template #sort="{ row }">
                  <span class="sort-num">{{ row.sort }}</span>
                </template>
                <template #status="{ row }">
                  <t-tag :theme="row.status === 'enabled' ? 'success' : 'default'" variant="light">
                    {{ row.status === 'enabled' ? '启用' : '禁用' }}
                  </t-tag>
                </template>
                <template #operation="{ row }">
                  <t-space size="small">
                    <t-link theme="primary" hover="color" @click="handleEditItem(row)">编辑</t-link>
                    <template v-if="row.status === 'enabled'">
                      <t-popconfirm content="确认禁用该字典项？" @confirm="handleToggleStatus(row)">
                        <t-link theme="warning" hover="color">禁用</t-link>
                      </t-popconfirm>
                    </template>
                    <template v-else>
                      <t-popconfirm content="确认启用该字典项？" @confirm="handleToggleStatus(row)">
                        <t-link theme="success" hover="color">启用</t-link>
                      </t-popconfirm>
                    </template>
                  </t-space>
                </template>
              </t-table>
            </template>
            <t-empty v-else description="请选择左侧字典分类" />
          </t-card>
        </div>
      </template>

      <t-empty v-else-if="!loading" description="暂无字典数据" />
    </t-loading>

    <t-dialog
      v-model:visible="itemFormVisible"
      :header="isEditingItem ? '编辑字典项' : '新增字典项'"
      width="520px"
      :confirm-btn="null"
      :cancel-btn="null"
      @close="handleItemFormClose"
    >
      <t-form
        ref="itemFormRef"
        :data="itemFormData"
        :rules="itemFormRules"
        label-width="100px"
        @submit="handleItemFormSubmit"
      >
        <t-form-item label="所属类别" name="categoryId">
          <t-select
            v-model="itemFormData.categoryId"
            placeholder="请选择所属类别"
            :disabled="isEditingItem"
          >
            <t-option
              v-for="dict in dictionaries"
              :key="dict.id"
              :value="dict.id"
              :label="dict.name"
            />
          </t-select>
        </t-form-item>
        <t-form-item label="字典名称" name="label">
          <t-input v-model="itemFormData.label" placeholder="请输入字典名称" />
        </t-form-item>
        <t-form-item label="字典值" name="value">
          <t-input v-model="itemFormData.value" placeholder="请输入字典值" />
        </t-form-item>
        <t-form-item label="排序" name="sort">
          <t-input-number
            v-model="itemFormData.sort"
            :min="0"
            :max="999"
            placeholder="请输入排序号"
            style="width: 160px"
          />
        </t-form-item>
        <t-form-item>
          <t-space>
            <t-button theme="primary" type="submit">保存</t-button>
            <t-button variant="outline" @click="handleItemFormClose">取消</t-button>
          </t-space>
        </t-form-item>
      </t-form>
    </t-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import type { FormInstanceFunctions, FormRule } from 'tdesign-vue-next'
import { mockDictionaries } from '@/mock'
import type { Dictionary, DictionaryItem } from '@/mock/types'

const loading = ref(false)
const error = ref('')
const dictionaries = ref<Dictionary[]>([])
const activeCategory = ref('')
const itemFormVisible = ref(false)
const isEditingItem = ref(false)
const editingItemId = ref('')
const itemFormRef = ref<FormInstanceFunctions | null>(null)

const activeDict = computed(() => {
  return dictionaries.value.find((d) => d.id === activeCategory.value) || null
})

const itemColumns = [
  { colKey: 'label', title: '字典项名称', width: 180 },
  { colKey: 'value', title: '字典项值', width: 200 },
  { colKey: 'sort', title: '排序', width: 80 },
  { colKey: 'status', title: '状态', width: 80 },
  { colKey: 'operation', title: '操作', width: 160 },
]

interface ItemFormData {
  categoryId: string
  label: string
  value: string
  sort: number
}

const defaultItemForm: ItemFormData = {
  categoryId: '',
  label: '',
  value: '',
  sort: 1,
}

const itemFormData = reactive<ItemFormData>({ ...defaultItemForm })

const itemFormRules: Record<string, FormRule[]> = {
  categoryId: [{ required: true, message: '请选择所属类别', trigger: 'change' }],
  label: [{ required: true, message: '请输入字典名称', trigger: 'blur' }],
  value: [{ required: true, message: '请输入字典值', trigger: 'blur' }],
}

function loadDictionaries() {
  loading.value = true
  error.value = ''
  try {
    dictionaries.value = mockDictionaries()
    if (dictionaries.value.length > 0) {
      activeCategory.value = dictionaries.value[0].id
    }
  } catch (e: any) {
    error.value = e?.message || '字典数据加载失败'
  } finally {
    loading.value = false
  }
}

function selectCategory(id: string) {
  activeCategory.value = id
}

function handleCreateItem() {
  if (!activeCategory.value) {
    MessagePlugin.warning('请先选择字典分类')
    return
  }
  isEditingItem.value = false
  editingItemId.value = ''
  Object.assign(itemFormData, { ...defaultItemForm, categoryId: activeCategory.value })
  itemFormVisible.value = true
}

function handleEditItem(row: DictionaryItem) {
  isEditingItem.value = true
  editingItemId.value = row.id
  itemFormData.categoryId = activeCategory.value
  itemFormData.label = row.label
  itemFormData.value = row.value
  itemFormData.sort = row.sort
  itemFormVisible.value = true
}

function handleToggleStatus(row: DictionaryItem) {
  row.status = row.status === 'enabled' ? 'disabled' : 'enabled'
  MessagePlugin.success(row.status === 'enabled' ? '已启用' : '已禁用')
}

async function handleItemFormSubmit() {
  const valid = await itemFormRef.value?.validate()
  if (valid !== true) return

  const dict = dictionaries.value.find((d) => d.id === itemFormData.categoryId)
  if (!dict) return

  if (isEditingItem.value) {
    const target = dict.items.find((i) => i.id === editingItemId.value)
    if (target) {
      target.label = itemFormData.label
      target.value = itemFormData.value
      target.sort = itemFormData.sort
    }
    MessagePlugin.success('字典项已更新')
  } else {
    const newItem: DictionaryItem = {
      id: `DI_${Date.now()}`,
      label: itemFormData.label,
      value: itemFormData.value,
      sort: itemFormData.sort,
      status: 'enabled',
    }
    dict.items.push(newItem)
    dict.items.sort((a, b) => a.sort - b.sort)
    MessagePlugin.success('字典项已创建')
  }
  itemFormVisible.value = false
}

function handleItemFormClose() {
  itemFormVisible.value = false
  itemFormRef.value?.clearValidate()
}

loadDictionaries()
</script>

<style scoped>
.page-container {
  max-width: 1200px;
}

.page-header {
  margin-bottom: 20px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #1F2329;
  margin: 0;
}

.dict-layout {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.dict-left {
  width: 220px;
  flex-shrink: 0;
  border-radius: 8px;
}

.dict-left :deep(.t-card__body) {
  padding: 12px;
}

.category-title {
  font-size: 14px;
  font-weight: 600;
  color: #1F2329;
  padding: 8px 12px;
  border-bottom: 1px solid #F0F0F0;
  margin-bottom: 4px;
}

.category-list {
  display: flex;
  flex-direction: column;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: #555;
  transition: all 0.2s;
}

.category-item:hover {
  background: #F5F7FA;
}

.category-item.active {
  background: #E8F0FE;
  color: #0052D9;
  font-weight: 500;
}

.category-count {
  margin-left: auto;
  font-size: 12px;
  background: #F0F0F0;
  color: #999;
  padding: 1px 8px;
  border-radius: 10px;
}

.category-item.active .category-count {
  background: #0052D9;
  color: #fff;
}

.dict-right {
  flex: 1;
  border-radius: 8px;
  min-height: 400px;
}

.dict-right :deep(.t-card__body) {
  padding: 20px;
}

.dict-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.dict-name {
  font-size: 16px;
  font-weight: 600;
  color: #1F2329;
}

.sort-num {
  color: #999;
  font-size: 13px;
}
</style>
