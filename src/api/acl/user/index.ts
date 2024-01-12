import request from '@/utils/request'
import type { AllRoleResponseData, SetRoleData, User } from './type'
enum API {
  ALLUSER_URL = '/admin/acl/user/',
  ADDUSER_URL = '/admin/acl/user/save',
  UPDATEUSER_URL = '/admin/acl/user/update',
  ALLROLEURL = '/admin/acl/user/toAssign/',
  REMOVEUSER_URL = '/admin/acl/user/remove/',
  DELETEALLUSER_URL = '/admin/acl/user/batchRemove',
  SETROLE_url = '/admin/acl/user/doAssignRole'
}

export const reqUserInfo = (page: number, limit: number, username: string) =>
  request.get<any, any>(API.ALLUSER_URL + `${page}/${limit}/?username=${username}`)
// 新增管理用户
export const reqAddOrUpdateUser = (data: User) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATEUSER_URL, data)
  } else {
    return request.post<any, any>(API.ADDUSER_URL, data)
  }
}

export const reqAllRole = (userId: number) =>
  request.get<any, AllRoleResponseData>(API.ALLROLEURL + userId)
// 删除管理用户
export const reqDeleteUser = (id: number) => request.delete<any, any>(API.REMOVEUSER_URL + id)

export const reqSelectUser = (idList: number[]) =>
  request.delete(API.DELETEALLUSER_URL, { data: idList })

// 修改角色权限
export const reqSetUserRole = (data: SetRoleData) => request.post<any, any>(API.SETROLE_url, data)
