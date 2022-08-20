//引入模块
const Koa = require('koa')
const router = require('koa-router')()
const koaBody = require('koa-body')
const path = require('path')
const static = require('koa-static')
const render = require('koa-art-template')
const admin = require('./routers/admin')
const session = require('koa-session')
const api = require('./routers/api')

//实例化对象
const app = new Koa()

//使用koa-body中间件
app.use(koaBody({
    multipart: true,
}))

//配置模板到KOA框架
render(app, {
    root: path.join(__dirname, "view"), //__dirname当前文件的所在的目录物理地址,类似：C:\Users\1\Desktop\3阶段课堂练习\node\view
    extname: ".html",
    debug: process.env.NODE_ENV !== "production",
});

//配置静态资源模块到KOA框架
app.use(static('aserts'))// 绑定aserts这个文件夹

//配置session到koa框架
app.keys = ['some secret hurr'];

const CONFIG = {
    key: 'koa.sess', /** (string) cookie key (default is koa.sess) */
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 86400000,
    autoCommit: true, /** (boolean) automatically commit headers (default true) */
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
    secure: false, /** (boolean) secure cookie*/
    sameSite: null, /** (string) session cookie sameSite options (default null, don't set it) */
};
app.use(session(CONFIG, app));

//测试
router.get('/', async (ctx) => {
    ctx.body = '<h1>欢迎来到后端</h1>'
})

//后台管理主页
router.use('/admin', admin)

//api接口
router.use('/api', api)

//把路由配置到KOA框架
app.use(router.routes()).use(router.allowedMethods());

//开启服务器
app.listen(1999, () => {
    console.log('serve running at localhost:1999');
})