import request from '@/utils/request'
import type { SkuResponseData, SkuInfoData } from './type'
enum API {
  SKU_URL = '/admin/product/list/',
  SALE_URL = '/admin/product/onSale/',
  CANCELSALE_URL = '/admin/product/cancelSale/',
  SKUINFO_URL = '/admin/product/getSkuInfo/',
  DELETESKU_URL = '/admin/product/deleteSku/'
}
// 获取商品SKU的接口
export const reqSkuList = (page: number, limit: number) =>
  request.get<any, SkuResponseData>(API.SKU_URL + `${page}/${limit}`)
// 已有商品上架的请求
export const reqSaleSku = (skuId: number) => request.get<any, any>(API.SALE_URL + skuId)
// 下架的请求
export const reqCancelSale = (skuId: number) => request.get<any, any>(API.CANCELSALE_URL + skuId)

export const reqSkuInfo = (skuId: number) => request.get<any, SkuInfoData>(API.SKUINFO_URL + skuId)

export const reqRemoveSku = (skuId: number) => request.delete<any, any>(API.DELETESKU_URL + skuId)
