<template>
  <div class="my-courses">
    <t-page-header title="我的课程" />
    <t-loading :loading="loading">
      <t-row :gutter="16" v-if="courses.length">
        <t-col v-for="c in courses" :key="c.id" :span="4">
          <t-card :bordered="true" hover-shadow class="course-card" @click="showDetail(c)">
            <h4>{{ c.name }}</h4>
            <p class="course-code">{{ c.code }}</p>
            <p class="course-desc">{{ c.description?.substring(0,60) }}...</p>
            <t-tag :theme="c.status === 'published' ? 'success' : 'default'" variant="light" size="small">{{ c.status === 'published' ? '进行中' : c.status }}</t-tag>
          </t-card>
        </t-col>
      </t-row>
      <t-empty v-else description="暂无课程数据" />
    </t-loading>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useStudentStore } from '@/stores/student'
import { MessagePlugin } from 'tdesign-vue-next'

const studentStore = useStudentStore()
const courses = ref<any[]>([])
const loading = ref(false)

async function load() {
  loading.value = true
  try {
    await studentStore.loadAll()
    courses.value = studentStore.enrolledCourses
  } catch {}
  finally { loading.value = false }
}

function showDetail(c: any) { MessagePlugin.info(`课程详情: ${c.name} (建设中)`) }

onMounted(load)
</script>

<style scoped>
.my-courses { max-width: 1200px; }
.course-card { cursor: pointer; }
.course-code { color: #86909C; font-size: 12px; margin: 4px 0; }
.course-desc { font-size: 13px; color: #4E5969; }
</style>
