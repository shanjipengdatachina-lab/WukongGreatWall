<template>
  <div class="my-topics">
    <t-page-header title="我的课题" />
    <t-loading :loading="loading">
      <t-row :gutter="16" v-if="list.length">
        <t-col v-for="m in list" :key="m.id" :span="4">
          <t-card :bordered="true" hover-shadow>
            <h4>{{ m.Topic?.name }}</h4>
            <p>{{ m.Topic?.code }}</p>
            <t-tag :theme="m.role === 'leader' ? 'danger' : 'primary'" variant="light" size="small">{{ m.role === 'leader' ? '组长' : '成员' }}</t-tag>
            <t-tag :theme="m.status === 'accepted' ? 'success' : 'warning'" variant="light" size="small" style="margin-left:4px">
              {{ m.status === 'accepted' ? '已加入' : m.status }}
            </t-tag>
          </t-card>
        </t-col>
      </t-row>
      <t-empty v-else description="暂未参与课题" />
    </t-loading>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useStudentStore } from '@/stores/student'

const studentStore = useStudentStore()
const list = ref<any[]>([])
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  await studentStore.loadAll()
  list.value = studentStore.myTopics
  loading.value = false
})
</script>

<style scoped>
.my-topics { max-width: 1200px; }
</style>
