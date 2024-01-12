import request from '@/utils/request'
import type { PermissionResponseData, MenuParams } from './type'
enum API {
    // 获取全部菜单与按钮的标识数据
    ALLPERMISSION_URL = '/admin/acl/permission',
    ADDMENU_URL = '/admin/acl/permission/save',
    // 更新某一个已有的菜单
    UPDATE_URL = '/admin/acl/permission/update',
    DELETEMENU_URL = '/admin/acl/permission/remove/',
}
// 获取菜单数据
export const reqAllPermission = () => request.get<any, PermissionResponseData>(API.ALLPERMISSION_URL)
// 添加与更新菜单的方法
export const reqAddOrUpdateMenu = (data: MenuParams) => {
    if (data.id) {
        return request.put<any, any>(API.UPDATE_URL, data)
    } else {
        return request.post<any, any>(API.ADDMENU_URL, data)
    }
}

export const reqRemoveMenu = (id: number) => request.delete<any, any>(API.DELETEMENU_URL + id)