<template>
  <div class="page-header">
    <div class="page-header-left">
      <h2 class="page-header-title">{{ title }}</h2>
      <t-breadcrumb v-if="breadcrumb && breadcrumb.length" class="page-header-breadcrumb">
        <t-breadcrumb-item
          v-for="(item, index) in breadcrumb"
          :key="index"
          :to="index < breadcrumb.length - 1 ? item.path : undefined"
        >
          {{ item.title }}
        </t-breadcrumb-item>
      </t-breadcrumb>
    </div>
    <div class="page-header-right">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface BreadcrumbItem {
  title: string
  path?: string
}

defineProps<{
  title: string
  breadcrumb?: BreadcrumbItem[]
}>()
</script>

<style scoped>
.page-header {
  background: #fff;
  padding: 16px 24px;
  border-radius: 6px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.page-header-left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  min-width: 0;
}

.page-header-title {
  font-size: 20px;
  font-weight: 600;
  color: #1F2329;
  margin: 0;
  line-height: 28px;
  white-space: nowrap;
}

.page-header-breadcrumb {
  font-size: 14px;
}

.page-header-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
</style>
