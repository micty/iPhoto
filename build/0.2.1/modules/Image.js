
var path = require('path');
var fs = require('fs');
var $ = require('defineJS');


define('/Image', function (require, module, exports) {
    var File = require('File');
    var $String = $.require('String');
    var $Date = $.require('Date');

    var config = null;


    function copy(src, dest) {

        if (File.exists(dest)) {
            if (config.overwrite) {
                console.log('从:', src.green);
                console.log('到(覆盖):', dest.magenta);
                File.copy(src, dest);
            }
            else {
                console.log('已存在(跳过):', dest.gray);
            }

        }
        else {
            console.log('从:', src.green);
            console.log('到:', dest.yellow);
            File.copy(src, dest);
        }

    }




    module.exports = {

        /**
        * 配置。
        */
        config: function (data) {
            config = data;
        },

        /**
        * 处理普通图片和其它文档。
        * 该方法处理不带有 exif 信息的文件。
        */
        processDefault: function (file) {
            var name = file.split('/').slice(-1)[0];        //短文件名。
            var ext = path.extname(file).toLowerCase();     //扩展名。
            var stat = fs.statSync(file);
            var date = $Date.format(stat.mtime, 'yyyy-MM-dd'); //图片文件的生成日期。
            var sample = config[ext] || config['.*'] || '';
            var base = config.base || '';
            var process = config.process;
            var dest = '';


            //让外部有个机会处理路径生成规则。
            if (typeof process == 'funtion') {
                dest = process({
                    'date': date,
                    'name': name,
                    'file': file,
                    'ext': ext,
                    'sample': sample,
                    'stat': stat,
                    'base': base,
                });
            }

            if (!dest) {
                if (!sample) {
                    return;
                }

                dest = $String.format(sample, {
                    'date': date,
                    'name': name,
                });

                dest = base + dest;  //加上基准路径。
            }

            copy(file, dest);
        },

        /**
        * 处理照片。
        * 该方法处理带有 exif 信息的照片。
        */
        processPhoto: function (file, exif) {
            var make = exif.make;
            var model = exif.model;
            var dt = exif.datetime;

            if (!make || !model || !dt) {
                module.exports.processDefault(file);
                return;
            }

            try {
                var name = file.split('/').slice(-1)[0];    //短文件名。
                var process = config.process;
                var base = config.base || '';
                var sample = config.photo || '';
                var dest = '';

                //让外部有个机会处理路径生成规则。
                if (typeof process == 'funtion') {
                    var ext = path.extname(file);     //扩展名。
                    var stat = fs.statSync(file);

                    dest = process({
                        'name': name,
                        'file': file,
                        'sample': sample,
                        'base': base,
                        'ext': ext,
                        'stat': stat,
                        'exif': exif,
                    });
                }

                if (!dest) {
                    dt = dt.split(' ')[0];
                    dt = dt.split(':');

                    dest = $String.format(sample, {
                        'make': make,
                        'model': model,
                        'year': dt[0],
                        'month': dt[1],
                        'day': dt[2],
                        'name': name,
                    });

                    dest = base + dest;  //加上基准路径。
                }

                copy(file, dest);
            }
            catch (ex) {
                console.log('错误:'.bgRed, file.red, ex.message.yellow);

                var errorFile = config.error;

                if (errorFile) {
                    var json = {};

                    json[file] = {
                        'error': ex.message,
                        'exif': exif,
                    }

                    //加上基准路径。
                    errorFile = (config.base || '') + errorFile;

                    File.appendJSON(errorFile, json);
                }
            }
        },
    };



});