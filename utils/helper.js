const fs = require('fs')
const root = __dirname.slice(0, -6)


const helper = {

    //文件上传
    upload(file) {
        //可读流
        let readStream = fs.createReadStream(file.filepath)

        //创建新的文件名
        let date = new Date()
        let dt = date.getTime()

        //随机数
        let rand = parseInt(Math.random() * 1000)

        //新的文件名称
        let newFileName = dt + '' + rand


        //扩展名
        let oldFileName = file.originalFilename
        let arr = oldFileName.split('.')
        let extension = arr[arr.length - 1]



        //写入流
        let writeStream = fs.createWriteStream(root + '/aserts/upload/' + newFileName + '.' + extension)

        //上传
        readStream.pipe(writeStream)

        //返回新的文件名
        return newFileName + '.' + extension
    },

    //时间(秒)戳转日期
    dt2date(dt, ishms = true) {

        let dateTime = dt * 1000

        let date = new Date(dateTime)

        if (ishms) {
            return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
        } else {
            return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
        }
    },

    //分割价格
    handlePrice(price) {

        //格式化2位小数
        let p = price.toFixed(2)

        //分别获取整数和小数
        let arr = p.split('.')

        return { price_int: arr[0], price_dec: arr[1] }

    }

}

module.exports = helper