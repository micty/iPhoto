

var path = require('path');
var $ = require('defineJS');
var config = require('./config.js'); //配置项。
var fs = require('fs');



$.config({
    base: __dirname,
    modules: [
        'lib/',
        'modules/',
    ],
});



$.launch(function (require, module) {
    
    var Directory = require('Directory');
    var File = require('File');
    var Exif = module.require('Exif');
    var Image = module.require('Image');



    Exif.config(config.exif);
    Image.config(config.dest);



    var excludes = {};

    config.excludes.forEach(function (item) {
        excludes[item] = true;
    });



    //扫描输入目录列表。
    var files = [];

    config.src.forEach(function (src) {

        var list = Directory.getFiles(src, function (dir) {
            console.log('扫描目录:', dir.yellow);
        });

        console.log('找到', list.length.toString().cyan, '个文件');
        files = files.concat(list);
    });

    var total = files.length;

    console.log('共找到', total.toString().cyan, '个文件');





    var index = 0;
    var maxIndex = total - 1;

    function process() {
        var order = index + 1;
        var percent = ((order / total) * 100).toFixed(2);
        var item = order + '/' + total + ' = ' + percent + '%';

        console.log(item.bgBlue);

        var file = files[index];
        var ext = path.extname(file).toLowerCase();

        if (excludes[ext]) {
            next();
            return;
        }

        Exif.get(file, function (data) {
            if (data) {
                console.log('提取 EXIF:', file.green);
                Image.processPhoto(file, data);
            }
            else {
                Image.processDefault(file);
            }

            next();
        });

    }

    function next() {
        if (index < maxIndex) {
            index++;
            process();
        }
    }

    process();

    
});







