

var Directory = require('./lib/Directory');
var File = require('./lib/File');

var Exif = require('./modules/Exif');
var Image = require('./modules/Image');


var config = File.readJSON('./config.json');

console.log('扫描目录:', config.src.yellow);

var files = Directory.getFiles(config.src);

console.log('共找到', files.length.toString().cyan, '个文件');



Exif.config(config.exif);
Image.config(config.dest);

Exif.get(files, function (json) {

    files.forEach(function (file) {
        var data = json[file];

        if (data) {
            Image.processPhoto(file, data);
        }
        else {
            Image.processDefault(file);
        }
    });

});








