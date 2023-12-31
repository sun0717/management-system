export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

export interface CategoryObj {
  id: number | string
  name: string
  category1Id?: number
  category2Id?: number
}

export interface CategoryResponseData extends ResponseData {
  data: CategoryObj[]
}

// export interface AttrValue {
//     id?: number,
//     value
// }

// 属性与属性值的 ts 类型
export interface AttrValue {
  id?: number
  valueName: string
  attrId?: number
}

// 存储每一个属性值的数组类型
export type AttrValueList = AttrValue[]

// 属性对象
export interface Attr {
  id?: number
  attrName: string
  categoryId: number | string
  categoryLevel: number
  attrValueList: AttrValueList
}

// 存储每一个属性对象的数组ts类型
export type AttrList = Attr[]
// 属性接口返回的数据 ts 类型
export interface AttrResponseData extends ResponseData {
  data: Attr[]
}