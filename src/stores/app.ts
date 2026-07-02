import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const collapsed = ref(false)
  const breadcrumbs = ref<{ title: string; path?: string }[]>([])

  function toggleCollapsed() {
    collapsed.value = !collapsed.value
  }

  function setBreadcrumbs(list: { title: string; path?: string }[]) {
    breadcrumbs.value = list
  }

  return { collapsed, breadcrumbs, toggleCollapsed, setBreadcrumbs }
})
