

/**
* 目录工具
*/

var fs = require('fs');
var path = require('path');

/**
* 格式化指定的路径为一个目录。
*/
function format(dir) {

    dir = dir.replace(/\\/g, '/');    //把 '\' 换成 '/'
    dir = dir.replace(/\/+/g, '/');   //把多个 '/' 合成一个

    if (dir.slice(-1) != '/') { //确保以 '/' 结束，统一约定，不易出错
        dir += '/';
    }

    return dir;

}


/**
* 检测指定的路径是否为目录。
*/
function check(path) {
    var stat = fs.statSync(path);
    return stat.isDirectory();
}



/**
* 递归的获取指定目录下及子目录下的所有文件列表。
*/
function getFiles(dir, fn) {

    dir = format(dir);
    fn && fn(dir);

    var list = fs.readdirSync(dir);
    var files = [];


    list.forEach(function (item, index) {

        item = dir + item;

        if (check(item)) { // item 还是个目录， 递归
            var list = getFiles(item, fn);
            files = files.concat(list);
            return;
        }

        files.push(item);
    });

    return files;
}




/**
* 递归地删除指定目录及子目录的所有文件。
*/
function deletes(dir) {

    dir = format(dir);

    var existed = fs.existsSync(dir);
    if (!existed) {
        return;
    }

    var list = fs.readdirSync(dir);

    list.forEach(function (item, index) {

        item = dir + item;

        if (check(item)) {
            deletes(item); //递归
        }
        else {
            fs.unlinkSync(item); //删除文件
        }

    });

    fs.rmdirSync(dir);

}


/**
* 递归地创建目录及子目录。
*/
function create(dir) {

    dir = dir.slice(-1) == '/' ?
        dir.slice(0, -1) :
        path.dirname(dir);


    if (fs.existsSync(dir)) { //已经存在该目录
        return;
    }


    var parent = path.dirname(dir) + '/';

    if (!fs.existsSync(parent)) {
        create(parent);
    }

    fs.mkdirSync(dir);
}





module.exports = {
    'getFiles': getFiles,
    'check': check,
    'delete': deletes,
    'format': format,
    'create': create,

};