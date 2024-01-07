import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { CategoryResponseData } from '@/api/product/attr/type'
// import { CategoryState } from './types/types'
import { reqC1, reqC2, reqC3 } from '@/api/product/attr'

export const useCategoryStore = defineStore('Category', () => {
  let c1Id = ref('')
  let c2Id = ref('')
  let c3Id = ref('')
  let c1Arr = ref<any>([])
  let c2Arr = ref<any>([])
  let c3Arr = ref<any>([])

  const getC1 = async () => {
    const res: CategoryResponseData = await reqC1()
    if (res.code === 200) {
      c1Arr.value = res.data
    }
  }

  const getC2 = async () => {
    const res: CategoryResponseData = await reqC2(c1Id.value)
    if (res.code === 200) {
      c2Arr.value = res.data
    }
  }

  const getC3 = async () => {
    const res: CategoryResponseData = await reqC3(c2Id.value)
    if (res.code === 200) {
      c3Arr.value = res.data
    }
  }

  const $reset = () => {
    c1Id.value = ''
    c2Id.value = ''
    c3Id.value = ''
    c1Arr.value = []
    c2Arr.value = []
    c3Arr.value = []
  }
  return {
    c1Id,
    c2Id,
    c3Id,
    c1Arr,
    c2Arr,
    c3Arr,
    getC1,
    getC2,
    getC3,
    $reset
  }
})
