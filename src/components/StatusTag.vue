<template>
  <t-tag :theme="current.theme" size="small">
    {{ current.label }}
  </t-tag>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface StatusMeta {
  label: string
  theme: string
}

const statusMap: Record<string, StatusMeta> = {
  published: { label: '已发布', theme: 'success' },
  unpublished: { label: '未发布', theme: 'default' },
  reviewing: { label: '审核中', theme: 'warning' },
  approved: { label: '审核通过', theme: 'success' },
  rejected: { label: '已退回', theme: 'danger' },
  pending: { label: '待审核', theme: 'warning' },
  submitted: { label: '已提交', theme: 'success' },
  processing: { label: '进行中', theme: 'primary' },
  in_progress: { label: '进行中', theme: 'primary' },
  overdue: { label: '已逾期', theme: 'danger' },
  completed: { label: '已完成', theme: 'success' },
  not_started: { label: '未开始', theme: 'default' },
  draft: { label: '草稿', theme: 'default' },
  active: { label: '启用', theme: 'success' },
  disabled: { label: '禁用', theme: 'default' },
  archived: { label: '已归档', theme: 'warning' },
  preparing: { label: '筹备中', theme: 'default' },
  contacted: { label: '已联系', theme: 'primary' },
  scheduled: { label: '已排期', theme: 'success' },
}

const props = defineProps<{
  status: string
}>()

const current = computed<StatusMeta>(() => {
  return statusMap[props.status] || { label: props.status, theme: 'default' }
})
</script>

<style scoped>
.t-tag {
  margin: 0;
}
</style>
