import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useLayoutSettingStore = defineStore('SettingStore', () => {
  const isCollapse = ref(false)
  const refsh = ref(false)
  return {
    isCollapse,
    refsh
  }
})
