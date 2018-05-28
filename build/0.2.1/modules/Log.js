
var Colors = require('colors');


define('/Log', function (require, module, exports) {


    var File = require('File');


    var colors = [
        'black',
        'red',
        'green',
        'yellow',
        'blue',
        'magenta',
        'cyan',
        'white',
        'gray',
        'grey',
    ];


    var fails = [];


    function add(text) {

        console.log(text);

        text = text.replace(/\u001b\[\d\dm/g, '') + '\n';


        try { //防止 log.txt 被锁死，避免整个程序挂掉
            File.append('./log.txt', text);

            if (fails.length > 0) {
                File.append('./log.txt', fails.join(''));
                fails = [];
            }
        }
        catch (ex) {
            var msg = Colors.magenta(ex.message);
            console.log(msg);
            fails.push(text);
        }


    }


    function clear() {
        File.write('./log.txt', '');
    }


    colors.forEach(function (item, index) {

        exports[item] = function () {

            var args = [].slice.call(arguments, 0);
            var s = $.String.format.apply(null, args);
            s = Colors[item](s);

            add(s);

        };
    });



    exports.add = add;
    exports.clear = clear;


    return exports;




});
