// 登录接口
// export interface loginForm {
//   username: string
//   password: string
// }

// interface dataType {
//   token?: string
//   message?: string
// }

// 登录接口返回数据类型
// export interface loginResponseData {
//   code: number
//   data: dataType
// }

// interface userInfo {
//   userId: 1
//   avatar: string
//   username: string
//   password: string
//   desc: string
//   roles: string[]
//   buttons: string[]
//   routes: string[]
//   token: string
// }

// interface user {
//   checkUser: userInfo
// }
// 定义服务器返回用户信息相关的数据类型
// export interface userResponseData {
//   code: number
//   data: user
// }

export interface LoginFormData {
  username?: string
  password?: string
}

// 定义全部接口返回数据ts类型
export interface ResponseData {
  code?: number
  message?: string
  ok?: boolean
}

// 定义登录接口返回数据类型
export interface LoginResponseData extends ResponseData {
  data?: string
}

// 定义获取用户信息返回数据类型
export interface userInfoResponseData extends ResponseData {
  data: {
    routes: string[]
    buttons: string[]
    roles: string[]
    name: string
    avatar: string
  }
}
