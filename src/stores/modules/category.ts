import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { CategoryResponseData } from '@/api/product/attr/type'
// import { CategoryState } from './types/types'
import { reqC1, reqC2, reqC3 } from '@/api/product/attr'

export const useCategoryStore = defineStore('Category', () => {
    const c1Id = ref('')
    const c2Id = ref('')
    const c3Id = ref('')
    const c1Arr = ref<any>([])
    const c2Arr = ref<any>([])
    const c3Arr = ref<any>([])

    const getC1 = async () => {
        let res: CategoryResponseData = await reqC1()
        if (res.code === 200) {
            c1Arr.value = res.data
        }
    }

    const getC2 = async () => {
        let res: CategoryResponseData = await reqC2(c1Id)
        if (res.code === 200) {
            c2Arr.value = res.data
        }
    }

    const getC3 = async () => {
        let res: CategoryResponseData = await reqC3(c2Id)
        if (res.code === 200) {
            c3Arr.value = res.data
        }
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
        getC3
    }
})