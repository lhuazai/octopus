# octopus 在线-H5多页面应用（Vue项目）

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve --p demo
```

### Compiles and minifies for production
```
yarn build --p demo
```

### analyzer production
```
yarn analyzer --p demo
```

### Lints and fixes files
```
yarn lint
```

### 目录说明
```
--projects
 |--[项目]
    |--router  模块路由配置
    |--store   模块vuex配置  可以 与 src中的 store merge
    |--views   模块页面
    app.vue    模块入口页
    index.html 模块入口模板
    main.js    模块入口文件
 |--[项目]
--public 静态文件目录 不用webpack编译
   |--[第三方依赖文件]   模块入口模板选择引入
   |--images   大图像文件 不适合webpack 编译
--src
 |--assets       webpack可以编译的静态文件
   |--images     小图像文件
   |--styles     公共样式文件
 |--components   所有项目公用的组件
 |--http         所有项目http 封装
    |--axios     axios 封装
 |--libs         所有项目公用的方法类
 |--plugins      所有项目公用的vue插件（在项目中可以选择性使用）
    |--vant      vant UI
 |--store        所有项目公用的vuex
.eslintrc.js  //eslint 配置
babel.config.js  //babel 配置
pakcage.json   //依赖包 配置
vue.config.js  // vue cli serve webpack 配置
```

### 使用oct-cli 创建 project
```
1: 全局安装 oct-cli
  npm install -g oct-cli
2：oct-cli init【project】
```

### 待确定的问题
```
1：登录组件（页面）有几种 具体需求是什么
    比如任何页面需要登录就直接弹出登录模态窗或者是跳转到登录页面
2：目前使用的 eslint:recommended  大家熟悉的是哪种  vscode 目前没有对应的配置文件
3：axios 封装 暂不完善
```

### 外部cdn
```
1：iconfont   www.iconfont.cn active项目  模块模板选择性使用
```

### 项目指标
```
0：打包分离 不同项目生成不同的dist文件
1：eslint git钩子commit之前修正 保存的时候检测报错
2：各模块之间 vuex相互隔离
3：模块间 可以选择性共用 src下 store中的数据 模块可以相互跳转（生产环境）
4：各模块 共用 src下的 components文件  http文件
```

### 逻辑代码建议
```
1: 全部规范eslint
2: 样式注意事项
    2.1：需要编写样式的标签 必须使用class
    2.2：scss 嵌套 不要超过 3层
    2.3：命名规范 复杂命名 aaa-bbb
    2.4  每个文件根dom class 为当前文件名
3：methods 方法体 命名规范
   触发事件 ev【函数名】
   组件传值 cb【函数名】
   接口函数 get||post||del 【函数名】
   其他函数 fn【函数名】
```

### nginx 配置  host配置
```
    nginx
    server{
    listen 80; 
    server_name xxxx.com;
    location / 
        {
           proxy_pass http://127.0.0.1:9090;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
        }
      
    }

    host
    127.0.0.1 xxxx.com

    调试微信的时候 
    xxxx.com 可以统一改成 微信配置的域名 微信开发工具访问域名即可
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
