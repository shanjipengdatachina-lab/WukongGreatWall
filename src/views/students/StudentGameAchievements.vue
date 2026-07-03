<template>
  <div class="achievements-page">
    <t-page-header title="成就徽章" @back="() => $router.push('/student/game')" />
    <t-card :bordered="false">
      <t-tabs v-model="cat" :default-value="cat">
        <t-tab-panel value="" label="全部" />
        <t-tab-panel value="学习" label="学习" />
        <t-tab-panel value="创作" label="创作" />
        <t-tab-panel value="协作" label="协作" />
        <t-tab-panel value="里程碑" label="里程碑" />
      </t-tabs>
      <t-loading :loading="loading">
        <t-row :gutter="16" v-if="filtered.length">
          <t-col v-for="ach in filtered" :key="ach.code" :span="3">
            <t-card class="ach-detail-card" :class="{ unlocked: ach.unlocked }" :bordered="true" size="small">
              <div class="ach-detail-icon">{{ ach.unlocked ? '✅' : '🔒' }}</div>
              <div class="ach-detail-name">{{ ach.name }}</div>
              <div class="ach-detail-desc">{{ ach.description }}</div>
              <t-progress :percentage="ach.target ? Math.round(ach.progress / ach.target * 100) : 0" theme="primary" size="small" />
              <div class="ach-detail-xp">+{{ ach.xpReward }} XP</div>
            </t-card>
          </t-col>
        </t-row>
        <t-empty v-else description="暂无成就数据" size="small" />
      </t-loading>
    </t-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getAchievements } from '@/api/student'

const cat = ref('')
const list = ref<any[]>([])
const loading = ref(false)

const filtered = computed(() => cat.value ? list.value.filter((a: any) => a.category === cat.value) : list.value)

async function loadData() {
  loading.value = true
  try { list.value = await getAchievements() || [] }
  catch { list.value = [] }
  finally { loading.value = false }
}

onMounted(loadData)
</script>

<style scoped>
.achievements-page { max-width: 1200px; }
.ach-detail-card { text-align: center; }
.ach-detail-card.unlocked { border-color: #0052D9; background: #f0f5ff; }
.ach-detail-card:not(.unlocked) { opacity: 0.6; }
.ach-detail-icon { font-size: 28px; margin-bottom: 6px; }
.ach-detail-name { font-weight: 600; font-size: 14px; }
.ach-detail-desc { font-size: 11px; color: #86909C; margin: 4px 0; }
.ach-detail-xp { font-size: 12px; color: #0052D9; font-weight: 500; margin-top: 4px; }
</style>
