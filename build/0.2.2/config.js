

module.exports = {

    //扫描的来源目录。
    src: [
        //'E:/Photo/iPhoto-test/',
        //'E:/Photo/iPhone7P-iTools/',
        //'E:/Photo/iPhone7P/'
        'E:/Photo/iPhone7P-iTools/',
    ],

    //输出的目标。 
    dest: {
        //输出的基准目录，以下路径相对于此目录。
        base: 'E:/Photo/iPhone7P-out/',





        //是否覆盖目标文件。
        overwrite: false,

        //发生错误时的输出文件。
        error: 'error.json',

        //可以提取出 exif 信息的照片的输出路径。
        photo: 'photo/{make}/{model}/{year}/{year}-{month}-{day}/{name}',

        //以下是不能提取出 exif 信息的文件。
        '.jpg': 'jpg/{date}/{name}',
        '.png': 'png/{date}/{name}',
        '.mov': 'mov/{date}/{name}',
        '.mp4': 'mp4/{date}/{name}',
        '.*': 'other/{date}/{name}',

        //生成文件名的处理函数。
        //可以返回一个字符串或一个对象。 
        //如果不提供，则使用默认的。
        process: function (require, data) {
            //由 iTools 导出的图片、视频等文件，
            //命名格式如 `20180529_IMG_1153.JPG`，前面的 8 位是文档创建的日期。
            //由 Windows 导出的，则为原始的文件名如 `IMG_1153.JPG`。 
            //因此需要判断是哪种格式。

            var name = data.name;
            var reg = /^\d{8}_/;

            //不符合以如 `20180529_` 开头的命名格式，不在这里处理。
            if (!reg.test(name)) {
                return;
            }

            var $ = require('$');           //defineJS 库。
            var $Date = $.require('Date');  //defineJS 库里的模块。
            var dt = name.slice(0, 8);      //日期串，如 `20180529`
            var year = dt.slice(0, 4);      //年份，如 `2018`
            var month = dt.slice(4, 6);     //月份，如 `05`
            var day = dt.slice(6);          //日份，如 `29`
            var date = year + '-' + month + '-' + day;  //如 `2018-05-29`

            //尝试解析成标准的 Date 实例。
            dt = $Date.parse(date);

            //前面的 8 位数字无法解析成有效的日期实例，不在这里处理。
            if (!dt) {
                return;
            }

            //至此，确定是如 `20180529_IMG_1153.JPG` 的命名规则，
            //则提取后半部分的名称，如 `IMG_1153.JPG`。
            name = name.slice(9);

            //有 exif 信息的，只需要改一下名称即可。
            //模板字符串填充中需要用到其它字段，如 `make`、`model`，则默认会从 exif 中提取。
            //此处只需要覆盖一下要改的字段即可。
            //有 exif 信息的对应的模板字符串名称为 `photo`
            if (data.exif) {
                return { 'name': name, };
            }

            //其它文档。
            //要提供的字段就参考对应的模板字符串，如名称为 `.jpg`、`.png` 等。
            return {
                'date': date,
                'name': name,
            };

        },
        
    },

    //要排除的文件类型。
    excludes: [
        '.ini',
    ],

    exif: {
        //需要进行 exif 信息抽取的文件类型。
        'exts': ['.JPG'],
    }

}
