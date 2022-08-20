const router = require('koa-router')()
const sha1 = require('sha1')
const msql = require('../lib/db')
const helper = require('../utils/helper')

//路由守卫
router.use(async (ctx, next) => {
    if (ctx.url.includes("login")) {
        await next();
    } else {
        if (!ctx.session.admin) {
            ctx.redirect("/admin/login");
        } else {
            await next();
        }
    }
})

//后台登录页面
router.get('/login', async (ctx) => {
    ctx.render('login')
})

//后台登录验证
router.post('/loginDo', async (ctx) => {
    let { uname, upwd } = ctx.request.body;

    let sql = `select * from web0301_xm_admin where username='${uname}' and pwd='${sha1(upwd).slice(3, 25)}'`;
    let result = await msql.query(sql);

    //结果
    if (result.length) {
        //创建session
        ctx.session.admin = uname;
        //返回结果给前端
        ctx.body = 'success';
    } else {
        //返回结果给前端
        ctx.body = 'error17';
    }
})

//后台管理系统主页面
router.get('/', async (ctx) => {
    ctx.render('admin')
})

//退出登录
router.get('/exit', async (ctx) => {
    //清除session
    ctx.session.admin = null;

    //返回结果给前端
    ctx.body = 'success';
})

//一级分类管理
router.get('/first-add', async (ctx) => {
    ctx.render('first-add')
})

//一级分类管理上传数据库
router.post('/first-add-do', async (ctx) => {
    let { title } = ctx.request.body;
    // console.log(title);

    let sql = `insert into web0301_xm_class1(c1name) values('${title}')`;
    let result = await msql.query(sql);

    //结果
    if (result.affectedRows) {
        //返回结果给前端
        ctx.body = { code: 200, msg: '保存成功' }
    } else {
        //返回结果给前端
        ctx.body = { code: 500, msg: '保存失败' };
    }
})

//一级分类管理列表
router.get('/first-list', async (ctx) => {
    let sql = `select * from web0301_xm_class1`;
    let result = await msql.query(sql);

    //结果
    ctx.render('first-list', { result })
})

//一级分类管理修改页面
router.get('/first-list-edit', async (ctx) => {
    let { id } = ctx.query;
    // console.log(id);
    let sql = `select * from web0301_xm_class1 where id=${id}`;
    let result = await msql.query(sql);
    // console.log(result);
    ctx.render('first-list-edit', { ...result[0] })
})

//一级分类管理修改数据库
router.post('/first-list-edit-do', async (ctx) => {
    let { id, title } = ctx.request.body;
    // console.log(id, title);
    let sql = `update web0301_xm_class1 set c1name='${title}' where id=${id}`;
    let result = await msql.query(sql);
    // console.log(result);
    if (result.affectedRows) {
        //返回结果给前端
        ctx.body = { code: 200, msg: '修改成功' }
    } else {
        //返回结果给前端
        ctx.body = { code: 500, msg: '修改失败' };
    }
})

//一级分类管理删除某条数据
router.get('/first-list-del', async (ctx) => {
    let { id } = ctx.query;
    // console.log(id);
    let sql = `delete from web0301_xm_class1 where id=${id}`;
    let result = await msql.query(sql);
    // console.log(result);
    if (result.affectedRows) {
        //返回结果给前端
        ctx.body = { code: 200, msg: '删除成功' }
    } else {
        //返回结果给前端
        ctx.body = { code: 500, msg: '删除失败' };
    }
})

//二级分类管理
router.get('/second-add', async (ctx) => {
    let sql = `select * from web0301_xm_class1`;
    let result = await msql.query(sql);
    // console.log(result);
    ctx.render('second-add', { result })
})

//二级分类管理上传数据库
router.post('/second-add-do', async (ctx) => {
    let { firstTitle, secondTitle, iconUrl } = ctx.request.body;
    // console.log(firstTitle, secondTitle, iconUrl);
    let sql = `insert into web0301_xm_class2(c1id,c2name,url) values(${firstTitle}, '${secondTitle}', '${iconUrl}')`;
    let result = await msql.query(sql);
    // console.log(result);
    if (result.affectedRows) {
        //返回结果给前端
        ctx.body = { code: 200, msg: '保存成功' }
    } else {
        //返回结果给前端
        ctx.body = { code: 500, msg: '保存失败' };
    }
})

//二级分类管理列表
router.get('/second-list', async (ctx) => {
    let sql = `select c2.id,c1name,c2name,url from web0301_xm_class2 as c2,web0301_xm_class1 where c2.c1id=web0301_xm_class1.id`;
    let result = await msql.query(sql);
    // console.log(result);
    ctx.render('second-list', { result })
})

//二级分类管理修改页面
router.get('/second-list-edit', async (ctx) => {
    let { id } = ctx.query;
    // console.log(id);
    let sql = `select * from web0301_xm_class2 where id=${id}`;
    let result = await msql.query(sql);

    let sql1 = `select * from web0301_xm_class1`;
    let result1 = await msql.query(sql1);
    // console.log(result);
    ctx.render('second-list-edit', { ...result[0], result1 })
})

//二级分类管理修改数据库
router.post('/second-list-edit-do', async (ctx) => {
    let { id, firstTitle, secondTitle, iconUrl } = ctx.request.body;
    // console.log(id, firstTitle, secondTitle, iconUrl);
    let sql = `update web0301_xm_class2 set c1id=${firstTitle},c2name='${secondTitle}',url='${iconUrl}' where id=${id}`;
    let result = await msql.query(sql);
    // console.log(result);
    if (result.affectedRows) {
        //返回结果给前端
        ctx.body = { code: 200, msg: '修改成功' }
    } else {
        //返回结果给前端
        ctx.body = { code: 500, msg: '修改失败' };
    }
})

//二级分类管理删除某条数据
router.get('/second-list-del', async (ctx) => {
    let { id } = ctx.query;
    // console.log(id);
    let sql = `delete from web0301_xm_class2 where id=${id}`;
    let result = await msql.query(sql);
    // console.log(result);
    if (result.affectedRows) {
        //返回结果给前端
        ctx.body = { code: 200, msg: '删除成功' }
    } else {
        //返回结果给前端
        ctx.body = { code: 500, msg: '删除失败' };
    }
})

//图书管理
router.get('/book-add', async (ctx) => {
    let sql = `select * from web0301_xm_class1`;
    let result = await msql.query(sql);
    // console.log(result);
    ctx.render('book-add', { result })
})

//图书管理下的根据一级分类查询二级分类
router.get('/fromFirstIdToGetSecondId', async (ctx) => {
    let { firstTitleId } = ctx.query;
    // console.log(firstTitleId);
    let sql = `select * from web0301_xm_class2 where c1id=${firstTitleId}`;
    let result = await msql.query(sql);
    // console.log(result);

    //返回数据
    let optionHtml = '<option value="">选择二级分类</option>';
    for (let i = 0; i < result.length; i++) {

        let { id, c2name } = result[i];

        optionHtml += `<option value="${id}">${c2name}</option>`

    }

    ctx.body = optionHtml;
})

//图书管理上传数据库
router.post('/book-add-do', async (ctx) => {
    let { firstTitle, secondTitle, code, bookName, author, whereFrom, price, baoyou, tuijian, descript, whenOn } = ctx.request.body;
    console.log(firstTitle, secondTitle, code, bookName, author, whereFrom, price, baoyou, tuijian, descript, whenOn);
    let poster = ctx.request.files.poster;
    // console.log(poster);
    let photos = ctx.request.files.photos;
    // console.log(photos);

    //包邮
    let baoyou1 = baoyou == 'on' ? 1 : 0;

    //推荐
    let tuijian1 = tuijian == 'on' ? 1 : 0;

    //处理日期
    let whenOn1 = new Date(whenOn).getTime() / 1000;

    //上传附件到服务器
    let newFileName = '';
    if (poster) {
        newFileName = helper.upload(poster)
    }
    // console.log(newFileName);

    //上传多文件
    let temp = [];
    if (photos && !(photos instanceof Array)) {//表示前端只选择了一个文件
        temp.push(helper.upload(photos))
    } else {//表示前端选择了多个文件
        if (photos && photos.length) {
            for (let i = 0; i < photos.length; i++) {
                let fileName = helper.upload(photos[i])
                temp.push(fileName)

            }
        }
    }
    // console.log(temp);

    //插入数据库
    let sql = `insert into web0301_xm_book(c1id,c2id,code,title,price,poster,author,publicer,descript,isfree,isrecommend,dt) values(${firstTitle},${secondTitle},${code},'${bookName}',${price},'${newFileName}','${author}','${whereFrom}','${descript}','${baoyou1}','${tuijian1}',${whenOn1})`;
    let result = await msql.query(sql);
    // console.log(result);
    if (result.affectedRows) {
        //图书id
        let pid = result.insertId

        //获取图片数据
        if (temp && temp.length) {

            //遍历
            let values = '';
            for (let i = 0; i < temp.length; i++) {
                values += `(${pid},'${temp[i]}'),`
            }

            //去掉末尾的逗号
            values = values.slice(0, -1)//(1,'1.jpg'),(2,'2.jpg'),(3,'3.jpg')

            //sql语句
            let sql2 = `insert into web0301_xm_swiper(pid,url) values ${values}`
            await msql.query(sql2)

        }

        //返回结果给前端
        ctx.body = { code: 200, msg: '添加成功' }
    } else {
        //返回结果给前端
        ctx.body = { code: 500, msg: '添加失败' };
    }

})

//图书管理列表
router.get('/book-list', async (ctx) => {
    let sql = `select b.id,code,title,price,poster,c1name,c2name from web0301_xm_book as b left join web0301_xm_class1 as c1 on b.c1id=c1.id left join web0301_xm_class2 as c2 on b.c2id=c2.id`;
    let result = await msql.query(sql);
    // console.log(result);

    //补全图片路径
    for (let i = 0; i < result.length; i++) {
        let { poster } = result[i];
        result[i].poster = `http://localhost:1999/upload/${poster}`
    }

    ctx.render('book-list', { result })
})




//暴露
module.exports = router.routes()