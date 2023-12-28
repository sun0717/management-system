## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

业务：

- 路由鉴权

    ```typescript
        // 全局前置守卫
        const router = createRouter({ ... })
        router.beforeEach((to, from) => {
            // 返回 false 取消导航
            return false
        })

        router.beforeEach(async (to, from) => {
            if (
                // 检查用户是否已登录
                !isAuthenticated && 
                // 避免无限重定向
                to.name !== 'Login'
            ) {
                // 将用户重定向到登录页面
                return { name: 'Login' }
            }
        })

        // 全局解析守卫
        // 导航被确认之前, 所有组件内守卫和异步路由组件被解析之后调用。
        router.beforeResolve(async to => {
            if (to.meta.requiresCamera) {
                try {
                await askForCameraPermission()
                } catch (error) {
                if (error instanceof NotAllowedError) {
                    // ... 处理错误，然后取消导航
                    return false
                } else {
                    // 意料之外的错误，取消导航并把错误传给全局处理器
                    throw error
                }
                }
            }
        })

        router.beforeResolve 是获取数据或执行任何其他操作 (如果用户无法进入页面时你希望避免执行的操作) 的理想位置
    ```