import request from '@/utils/request'
import type { User } from './type'
enum API {
    ALLUSER_URL = '/admin/acl/user/',
    ADDUSER_URL = '/admin/acl/user/save',
    UPDATEUSER_URL = '/admin/acl/user/update',
    REMOVEUSER_URL = '/admin/acl/user/remove/',
}

export const reqUserInfo = (page: number, limit: number, username: string) => request.get<any, any>(API.ALLUSER_URL + `${page}/${limit}/?username=${username}`)
// 新增管理用户
export const reqAddOrUpdateUser = (data: User) => {
    if (data.id) {
        return request.put<any, any>(API.UPDATEUSER_URL, data)
    } else {
        return request.post<any, any>(API.ADDUSER_URL, data)
    }
}
// 删除管理用户
export const reqDeleteUser = (id: number) => request.delete(API.REMOVEUSER_URL + id)