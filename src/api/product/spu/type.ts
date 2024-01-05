// 服务器全部接口返回的数据类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// SPU数据的ts类型
export interface SpuData {
  id?: number
  spuName: string
  description: string
  categoryId: number | string
  tmId: number
  spuSaleAttrList: null
  spuImageList: null
}

// 数组:元素都是已有SPU数据类型
export type Records = SpuData[]

// 定义获取已有的SPU接口返回的数据ts类型
export interface HasSpuResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
  }
}

export interface Trademark {
  id: number
  tmName: string
  logoUrl: string
}

export interface AllTradeMark extends ResponseData {
  data: Trademark[]
}

// 商品图片的ts类型
export interface SpuImg {
  id?: number
  createTime?: string
  updateTime?: string
  spuId?: number
  imgName?: string
  imgUrl?: string
  name?: string
  url?: string
}

export interface SpuHasImg extends ResponseData {
  data: SpuImg[]
}

// 已有的销售属性值对象ts类型
export interface SaleAttrValue {
  id?: number
  createTime?: null
  updateTime?: null
  spuId?: number
  baseSaleAttrId: number | string
  saleAttrValueName: string
  saleAttrName?: string
  isChecked?: null
}

// 存储已有的销售属性值数组类型
export type SpuSaleAttrValueList = SaleAttrValue[]

// 销售属性对象类型
export interface SaleAttr {
  id?: number
  createTime?: null
  updateTime?: null
  spuId?: number
  baseSaleAttrId: number | string
  saleAttrName: string
  spuSaleAttrValueList: SpuSaleAttrValueList
  flag?: boolean
  saleAttrValue?: string
}

// SPU已有的销售属性接口返回数据 ts 类型
export interface SaleAttrResponseData extends ResponseData {
  data: SaleAttr[]
}

// 已有的全部SPU的返回数据ts类型
export interface HasSaleAttr {
  id: number
  name: string
}

export interface HasSaleAttrList extends ResponseData {
  data: HasSaleAttr[]
}
