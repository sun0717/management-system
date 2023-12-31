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

业务模块

上传文件模块
用el-upload
action: 对应的地址

- 每次点击添加品牌时再做清空数据
- 添加完和修改完不一样, 添加完回到第一页, 修改完留在当前页
    ```typescript
        getHasTradeMark(trademarkParams.id ? pageNo.value : 1)
    ```

bug: 添加失败 待解决


属性管理

首先获取一级分类内容，根据一级分类id捞二级分类,再根据二级分类捞三级分类, 根据以上三个id捞已有属性与属性值。

添加：卡片展示