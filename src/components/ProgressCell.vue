<template>
  <t-progress
    :percentage="value"
    :label="label"
    :size="size"
    :color="color"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    value: number
    label?: boolean
    size?: string
  }>(),
  {
    label: false,
    size: 'small',
  },
)

const color = computed(() => {
  const v = Number(props.value)
  if (Number.isNaN(v)) return '#2BA471'
  if (v < 30) return '#D54941'
  if (v <= 70) return '#E37318'
  return '#2BA471'
})
</script>

<style scoped>
.t-progress {
  width: 100%;
}
</style>
