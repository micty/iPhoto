
var path = require('path');
var colors = require('colors');
var ExifImage = require('exif').ExifImage;


var config = null;
var exts = {};




function get(file, fn) {

    var ext = path.extname(file).toUpperCase();
    
    if (!exts[ext]) {
        fn && fn();
        return;
    }



    new ExifImage({
        'image': file,

    }, function (error, data) {

        if (error) {
            console.log('Error:'.red, error.message.yellow);
            console.log('File:'.red, file.green);
            fn && fn();
            return;
        }

     

        //为了节省内存，这里只返回需要用到的几个字段。
        var image = data.image;
        var exif = data.exif;
      
        fn && fn({
            'make': image.Make,
            'model': image.Model,
            'datetime': exif.DateTimeOriginal,
        });
    });
}




module.exports = {

    'config': function (data) {
        config = data;

        config.exts.forEach(function (ext) {
            ext = ext.toUpperCase();
            exts[ext] = true;

        });
    },

    'get': function (files, fn) {

        //针对单个形式。
        if (!Array.isArray(files)) {
            get(files, fn);
            return;
        }


        //针对批量形式。
        var index = 0;
        var maxIndex = files.length - 1;
        var file$data = {};


        function extract() {
            var file = files[index];

            get(file, function (data) {

                if (data) {
                    file$data[file] = data;
                }

                //最后一项
                if (index >= maxIndex) {
                    fn && fn(file$data);
                    return;
                }

                index++;
                extract();

            });
        }
        
        extract();

    },
};


