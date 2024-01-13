import request from '@/utils/request'
import type { RoleData, RoleResponseData } from './type'
enum API {
  ALLROLE_URL = '/admin/acl/role/',
  ADDROLE_URL = '/admin/acl/role/save',
  UPDATEROLE_URL = '/admin/acl/role/update',
  ALLROLEURL = '/admin/acl/permission/toAssign/',
  REMOVEROLE_URL = '/admin/acl/role/remove/',
  // 给相应职位下发权限
  SETPERMISSION_URL = '/admin/acl/permission/doAssign'
}

export const reqRoleInfo = (page: number, limit: number, roleName: string) =>
  request.get<any, RoleResponseData>(API.ALLROLE_URL + `${page}/${limit}/?roleName=${roleName}`)
// 新增管理用户
export const reqAddOrUpdateRole = (data: RoleData) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATEROLE_URL, data)
  } else {
    return request.post<any, any>(API.ADDROLE_URL, data)
  }
}

export const reqAllMenuList = (roleId: number) => request.get<any, any>(API.ALLROLEURL + roleId)

export const reqRemoveRole = (roleId: number) =>
  request.delete<any, any>(API.REMOVEROLE_URL + roleId)

export const reqSetPermission = (roleId: number, permissionId: number[]) =>
  request.post(API.SETPERMISSION_URL + `roleId=${roleId}&permissionId=${permissionId}`)
// export const reqAllRole = (userId: number) =>
//   request.get<any, AllRoleResponseData>(API.ALLROLEURL + userId)
// // 删除管理用户
// export const reqDeleteUser = (id: number) => request.delete<any, any>(API.REMOVEUSER_URL + id)

// export const reqSelectUser = (idList: number[]) =>
//   request.delete(API.DELETEALLUSER_URL, { data: idList })

// // 修改角色权限
// export const reqSetUserRole = (data: SetRoleData) => request.post<any, any>(API.SETROLE_url, data)
