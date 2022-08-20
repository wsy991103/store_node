const mysql = require('mysql')

class DB {

    //构造函数
    constructor() {

        //创建连接池
        const pool = mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: 'wsy123',
            database: 'fox0301',
        })

        //创建连接
        pool.getConnection((err, connection) => {
            if (err) {
                console.log(err)
            } else {
                this.con = connection
            }
        })
    }

    //操作数据（增删改查）
    query(sql) {
        return new Promise((resolve, reject) => {
            this.con.query(sql, (err, result) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(result)
                }
            })
        })
    }
}


//暴露一个实例化对象
module.exports = new DB();