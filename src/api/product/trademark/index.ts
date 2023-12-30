import request from '@/utils/request'
import type { TradeMark, TradeMarkResponseData } from './type'
enum API {
  TRADEMARK_URL = '/admin/product/baseTrademark/',
  // 添加品牌
  ADDTRADEMARK_URL = '/admin/product/baseTrademark/save',
  // 修改品牌
  UPDATETRADEMARK_URL = '/admin/product/baseTrademark/update',
  // 删除品牌
  DELETE_URL = '/admin/product/baseTrademark/remove/'
}
// 获取品牌接口方法
export const reqHasTradeMark = (page: number, limit: number) =>
  request.get<any, TradeMarkResponseData>(API.TRADEMARK_URL + `${page}/${limit}`)

// 添加与修改已有品牌接口方法
export const reqAddOrUpdateTrademark = (data: TradeMark) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATETRADEMARK_URL, data)
  } else {
    // 新增品牌
    return request.post<any, any>(API.UPDATETRADEMARK_URL, data)
  }
}

// 删除某一个已有品牌的数据
export const reqDeleteTrademark = (id: number) => {
  return request.delete<any, any>(API.DELETE_URL + id)
}
