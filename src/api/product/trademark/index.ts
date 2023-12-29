import request from '@/utils/request'
import type { TradeMarkResponseData } from './type'
enum API {
    TRADEMARK_URL = '/admin/product/baseTrademark/',
}
// 获取品牌接口方法
export const reqHasTradeMark = (page: number, limit: number) =>
  request.get<any, TradeMarkResponseData>(
    API.TRADEMARK_URL + `${page}/${limit}`,
  )