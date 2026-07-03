<template>
  <div class="my-works">
    <t-page-header title="我的成果" />
    <t-loading :loading="loading">
      <t-row :gutter="16" v-if="works.length">
        <t-col v-for="w in works" :key="w.id" :span="4">
          <t-card :bordered="true" hover-shadow size="small">
            <h4>{{ w.original_name }}</h4>
            <p>{{ (w.size / 1024).toFixed(1) }} KB</p>
            <t-tag variant="light" size="small">成果</t-tag>
          </t-card>
        </t-col>
      </t-row>
      <t-empty v-else description="暂无成果作品" />
    </t-loading>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import request from '@/api/index'

const works = ref<any[]>([])
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try { const res: any = await request.get('/files?file_type=topic'); works.value = res.data || [] }
  catch { works.value = [] }
  finally { loading.value = false }
})
</script>

<style scoped>
.my-works { max-width: 1200px; }
</style>
