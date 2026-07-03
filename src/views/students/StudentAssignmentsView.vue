<template>
  <div class="my-assignments">
    <t-page-header title="我的作业" />
    <t-loading :loading="loading">
      <t-table v-if="list.length" row-key="id" :data="list" :columns="columns" :hover="true" :stripe="true" row-key="id">
        <template #course="{ row }"><t-tag variant="light" theme="primary" size="small">{{ row.Course?.name }}</t-tag></template>
        <template #deadline="{ row }">{{ row.deadline ? new Date(row.deadline).toLocaleDateString() : '-' }}</template>
        <template #status="{ row }"><t-tag :theme="row.status === 'published' ? 'warning' : 'default'" variant="light" size="small">{{ row.status === 'published' ? '待提交' : row.status }}</t-tag></template>
        <template #op="{ row }">
          <t-button variant="text" theme="primary" size="small" @click="$router.push(`/assignments/${row.id}`)">提交</t-button>
        </template>
      </t-table>
      <t-empty v-else description="暂无作业" />
    </t-loading>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useStudentStore } from '@/stores/student'

const studentStore = useStudentStore()
const list = ref<any[]>([])
const loading = ref(false)

const columns = [
  { colKey: 'title', title: '作业标题', ellipsis: true },
  { colKey: 'course', title: '所属课程', cell: 'course' },
  { colKey: 'deadline', title: '截止日期', cell: 'deadline' },
  { colKey: 'status', title: '状态', cell: 'status' },
  { colKey: 'op', title: '操作', cell: 'op', width: 80 },
]

onMounted(async () => {
  loading.value = true
  await studentStore.loadAll()
  list.value = studentStore.pendingAssignments
  loading.value = false
})
</script>

<style scoped>
.my-assignments { max-width: 1200px; }
</style>
