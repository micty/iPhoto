
var path = require('path');


define('/Image', function (require, module, exports) {

    var File = require('File');
    var $String = require('String');

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

        'config': function (data) {
            config = data;
        },

        'processDefault': function (file) {

            var name = file.split('/').slice(-1)[0];        //短文件名。
            var ext = path.extname(file).toLowerCase();     //扩展名。
            var date = file.split('/').slice(-2)[0];        //最后一级目录，当作是日期

            var sample = config[ext] || config['.*'];
            if (!sample) {
                return;
            }


            var dest = $String.format(sample, {
                'date': date,
                'name': name,
            });

            copy(file, dest);
        },


        'processPhoto': function (file, data) {

            var make = data.make;
            var model = data.model;
            var dt = data.datetime;

            if (!make || !model || !dt) {
                module.exports.processDefault(file);
                return;
            }


            try {

                dt = dt.split(' ')[0];
                dt = dt.split(':');

                var name = file.split('/').slice(-1)[0];    //短文件名。

                var dest = $String.format(config.photo, {
                    'make': make,
                    'model': model,
                    'year': dt[0],
                    'month': dt[1],
                    'day': dt[2],
                    'name': name,
                });

                copy(file, dest);
            }
            catch (ex) {
                console.log('错误:'.bgRed, file.red, ex.message.yellow);

                var errorFile = config.error;
                if (errorFile) {
                    var json = {};

                    json[file] = {
                        'error': ex.message,
                        'data': data,
                    }
                    File.appendJSON(config.error, json);
                }
            }
        },
    };



});