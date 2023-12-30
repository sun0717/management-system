import request from '@/utils/request'
import type { CategoryResponseData } from './type'
enum API {
    // 获取一级分类接口
    C1_URL = '/admin/product/getCategory1',
    // 获取二级分类接口
    C2_URL = '/admin/product/getCategory2/{category1Id}',
    // 获取三级分类接口
    C3_URL = '/admin/product/getCategory3/',
}

// 获取一级分类的接口方法
export const reqC1 = () => request.get<any, any>(API.C1_URL)
// 获取二级分类的接口方法
export const reqC2 = (category1Id: number | string) => request.get<any, CategoryResponseData>(API.C2_URL + category1Id)
// 获取三级分类的接口方法
export const reqC3 = (category2Id: number | string) => request.get<any, CategoryResponseData>(API.C3_URL + category2Id)

// export const reqAttr = (
//     category1Id: number | string,
//     category2Id: number | string,
//     category3Id: number | string
// )