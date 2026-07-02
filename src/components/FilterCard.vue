<template>
  <t-card class="filter-card" :bordered="false" :title="title">
    <div class="filter-card-body">
      <slot />
    </div>
    <div v-if="$slots.actions" class="filter-card-actions">
      <slot name="actions" />
    </div>
  </t-card>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>

<style scoped>
.filter-card {
  margin-bottom: 16px;
  background: #fff;
}

.filter-card :deep(.t-card__body) {
  padding: 16px 24px;
}

.filter-card-body {
  display: flex;
  flex-wrap: wrap;
  gap: 16px 24px;
  align-items: center;
}

.filter-card-body :deep(.t-form__item) {
  margin-bottom: 0;
}

.filter-card-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #E7E7E7;
}
</style>
