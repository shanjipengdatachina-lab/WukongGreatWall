<template>
  <div class="scholar-public">
    <div class="scholar-cover" v-if="data.cover_image" :style="{ backgroundImage: `url(http://localhost:3001${data.cover_image})` }" />
    <div class="scholar-body">
      <div class="scholar-header">
        <t-avatar v-if="data.avatar" :image="'http://localhost:3001' + data.avatar" size="80px" />
        <t-avatar v-else size="80px">{{ data.display_name?.charAt(0) }}</t-avatar>
        <div class="scholar-info">
          <h1>{{ data.display_name }}</h1>
          <p class="scholar-title">{{ data.title || '学者' }}</p>
          <p class="scholar-inst">{{ data.institution }}</p>
          <t-space size="small" style="margin-top:8px">
            <t-tag v-for="tag in data.research_fields" :key="tag" theme="primary" variant="light">{{ tag }}</t-tag>
          </t-space>
        </div>
      </div>

      <t-card :bordered="false" v-if="data.bio_full">
        <h3>关于我</h3>
        <p>{{ data.bio_full }}</p>
      </t-card>

      <t-card :bordered="false" v-if="data.education?.length" title="教育经历">
        <t-timeline>
          <t-timeline-item v-for="(e,i) in data.education" :key="i">
            {{ e.degree }} — {{ e.institution }} ({{ e.year }})
          </t-timeline-item>
        </t-timeline>
      </t-card>

      <t-card :bordered="false" v-if="data.achievements?.length" title="荣誉奖项">
        <t-timeline>
          <t-timeline-item v-for="(a,i) in data.achievements" :key="i">
            {{ a.name }} ({{ a.year }}) — {{ a.description }}
          </t-timeline-item>
        </t-timeline>
      </t-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getScholarProfile } from '@/api/student'

const route = useRoute()
const data = ref<any>({})

onMounted(async () => {
  const scholarId = route.params.scholarId as string
  try { data.value = await getScholarProfile(scholarId) }
  catch { data.value = { display_name: '学者未发布档案' } }
})
</script>

<style scoped>
.scholar-public { max-width: 800px; margin: 0 auto; background: #fff; min-height: 100vh; }
.scholar-cover { height: 200px; background-size: cover; background-position: center; }
.scholar-body { padding: 24px; }
.scholar-header { display: flex; gap: 20px; align-items: center; margin-bottom: 24px; }
.scholar-info h1 { margin: 0; font-size: 24px; }
.scholar-title { color: #4E5969; font-size: 15px; margin: 4px 0; }
.scholar-inst { color: #86909C; font-size: 14px; }
</style>
