const router = require('koa-router')();
const msql = require('../lib/db');
const helper = require('../utils/helper');

//二级分类管理接口
router.get('/getbooknav', async (ctx) => {
    let sql = `select * from web0301_xm_class2`;
    let result = await msql.query(sql);

    ctx.body = result;
})

//获取当前分类数据
router.get('/getDataByC2id', async (ctx) => {
    // 接收参数
    let { start } = ctx.query;

    //当前图书的二级分类id
    let { c2id } = ctx.query;

    // 每页显示的记录数
    let pageSize = 4;

    // 开始读取的位置
    start = start ? start : 0;

    //获取数据
    if (c2id) {
        let sql = `select * from web0301_xm_book where c2id=${c2id} order by id desc limit ${start}, ${pageSize}`;
        let result = await msql.query(sql);

        //处理数据
        result = result.map((item) => {

            //封面地址补全
            item.poster = `http://localhost:1999/upload/${item.poster}`;

            //价格
            item.price = helper.handlePrice(item.price)

            //日期
            item.date = helper.dt2date(item.dt, false)

            return item

        })

        //获取每个产品的评论数据
        if (result.length) {
            for (let i = 0; i < result.length; i++) {
                //当前产品的二级分类id
                let pid = result[i].id

                //从评论表中获取当前产品的评论的平均星星数和总的记录数
                let sql2 = `select avg(stars) as avgstars, count(*) as total from web0301_xm_comment where c2id=${c2id} and pid=${pid}`
                let res2 = await msql.query(sql2) //结果：[{}]

                //处理数据
                res2 = res2.map((item) => {
                    if (item.total) {
                        //平均星星数
                        item.avgstars = Math.floor(item.avgstars)
                    } else {
                        //默认5星
                        item.avgstars = 5
                    }
                    return item
                })
                //保存评论数据到result集合
                result[i].comment = res2[0]
            }
        }
        // console.log(result);
        //返回结果给前端小程序
        ctx.body = result
    } else {
        ctx.body = []
    }
})

//书本详情页接口
router.get('/getBookDetail', async (ctx) => {
    //获取参数
    let { id } = ctx.query;

    if (id) {
        //获取数据
        let sql = `select b.id,code,title,price,poster,author,publicer,descript,isfree,isrecommend,dt,c1name,c2name from web0301_xm_book as b left join web0301_xm_class1 as c1 on b.c1id=c1.id left join web0301_xm_class2 as c2 on b.c2id=c2.id where b.id=${id}`;
        let result = await msql.query(sql);

        //处理数据
        result = result.map((item) => {

            //封面地址补全
            item.poster = `http://localhost:1999/upload/${item.poster}`;

            //价格
            item.price = helper.handlePrice(item.price)

            //日期
            item.date = helper.dt2date(item.dt, false)

            return item

        })

        //从评论表中获取当前产品的评论的平均星星数和总的记录数
        let sql2 = `select url from web0301_xm_swiper where pid=${id}`
        let res2 = await msql.query(sql2) //结果：[{}]
        // console.log(res2)

        result[0].swiper = res2
        // console.log(result);
        //返回结果给前端小程序
        ctx.body = result
    } else {
        ctx.body = []
    }
})


//暴露
module.exports = router.routes()