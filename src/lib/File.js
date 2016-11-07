

var fs = require('fs');
var iconv = require('iconv-lite');

/**
* 文件类。
*/
define('File', function (require, module, exports) {


    function exists(file) {
        return fs.existsSync(file);
    }


    function deletes(file) {

        //重载 deletes(list)
        if (file instanceof Array) {
            file.forEach(deletes);
            return;
        }


        if (!exists(file)) {
            return;
        }

        fs.unlinkSync(file);
    }



    /**
    * 读取文件。
    */
    function read(file, encoding) {

        file = String(file);
        encoding = encoding === null ? null : encoding || 'utf8'; //有可能为 undefined

        var contents = fs.readFileSync(file); //读到的是 buffer。

        //如果指定了 encoding 则把内容从 buffer 形式转成 string 形式。
        if (encoding) {
            contents = iconv.decode(contents, encoding); //解码成 string。

            // strip any BOM that might exist.
            if (contents.charCodeAt(0) === 0xFEFF) {
                contents = contents.substring(1);
            }
        }

        return contents;

    }




    function write(file, contents, encoding) {

        var Directory = require('Directory');
        Directory.create(file);

        // If contents is already a Buffer, don't try to encode it
        if (!Buffer.isBuffer(contents)) {
            contents = iconv.encode(contents, encoding || 'utf8'); //编码成 buffer。
        }

        fs.writeFileSync(file, contents);
    }


    function copy(src, dest) {
        var contents = read(src, null); //读到的是 buffer
        write(dest, contents, null);
    }




    function appendJSON(file, json, minify) {
        var all = readJSON(file);
        if (all) {
            for (var key in json) {
                all[key] = json[key];
            }
        }
        else {
            all = json;
        }

        writeJSON(file, all, minify);
    }



    function writeJSON(file, json, minify) {
        json = minify ?
            JSON.stringify(json) :
            JSON.stringify(json, null, 4);

        write(file, json);
    }

    function readJSON(file) {
        if (!exists(file)) {
            return;
        }

        var json = read(file);
        if (!json) {
            return;
        }

        json = JSON.parse(json);
        return json;

    }


    function append(file, content) {
        var Directory = require('Directory');
        Directory.create(file);
        fs.appendFileSync(file, content);
    }



    module.exports = {
        'delete': deletes,
        'read': read,
        'write': write,
        'copy': copy,
        'exists': exists,
        'appendJSON': appendJSON,
        'writeJSON': writeJSON,
        'readJSON': readJSON,
        'append': append,
    };


});