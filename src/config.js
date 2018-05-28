

module.exports = {

    //扫描的来源目录。
    src: [
        //'E:/Photo/iPhoto-test/',
        'E:/Photo/iPhone7P-Ori/1/',
    ],

    //输出的目标。 
    dest: {
        //输出的基准目录，以下路径相对于此目录。
        //base: 'E:/Photo/iPhoto-test/dest/',
        base: 'E:/Photo/iPhone7P-dest/',

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
        //需要返回一个字符串。 
        //如果不提供，则使用默认的。
        process: function (data) {
            
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
