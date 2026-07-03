<template>
  <div class="my-tasks">
    <t-page-header title="我的任务" />
    <t-loading :loading="loading">
      <div class="task-columns">
        <div v-for="col in ['pending','in_progress','completed']" :key="col" class="task-column">
          <h4 class="col-title">{{ col === 'pending' ? '待开始' : col === 'in_progress' ? '进行中' : '已完成' }}</h4>
          <t-card v-for="t in tasksByStatus(col)" :key="t.id" :bordered="true" size="small" class="task-card">
            <h5>{{ t.title }}</h5>
            <p>{{ t.Topic?.name }}</p>
            <t-space size="small" style="margin-top:8px">
              <t-tag :theme="t.priority === 'urgent' ? 'danger' : t.priority === 'high' ? 'warning' : 'default'" variant="light" size="small">{{ t.priority }}</t-tag>
              <t-tag variant="light" size="small">{{ t.status }}</t-tag>
            </t-space>
          </t-card>
        </div>
      </div>
      <t-empty v-if="list.length === 0" description="暂无任务" />
    </t-loading>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useStudentStore } from '@/stores/student'

const studentStore = useStudentStore()
const list = ref<any[]>([])
const loading = ref(false)

function tasksByStatus(s: string) { return list.value.filter((t: any) => t.status === s) }

onMounted(async () => {
  loading.value = true
  await studentStore.loadAll()
  list.value = studentStore.myTasks
  loading.value = false
})
</script>

<style scoped>
.my-tasks { max-width: 1200px; }
.task-columns { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
.task-column { min-height: 200px; }
.col-title { font-size: 14px; font-weight: 600; color: #4E5969; margin-bottom: 12px; }
.task-card { margin-bottom: 8px; cursor: pointer; }
.task-card h5 { margin: 0 0 4px; font-size: 14px; }
.task-card p { font-size: 12px; color: #86909C; margin: 0; }
</style>
