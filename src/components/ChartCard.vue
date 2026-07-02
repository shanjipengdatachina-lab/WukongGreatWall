<template>
  <t-card class="chart-card" :bordered="false" :title="title">
    <template #actions>
      <slot name="header-extra" />
    </template>
    <t-loading :loading="loading" size="small">
      <div v-if="!empty" class="chart-container" :style="{ height }">
        <slot />
      </div>
      <t-empty v-else description="暂无数据" />
    </t-loading>
  </t-card>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    height?: string
    loading?: boolean
    empty?: boolean
  }>(),
  {
    height: '320px',
    loading: false,
    empty: false,
  },
)
</script>

<style scoped>
.chart-card {
  background: #fff;
  height: auto;
}

.chart-container {
  width: 100%;
}
</style>
