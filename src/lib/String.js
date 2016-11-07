

/**
* 字符串工具
*/
define('String', function (require, module, exports) {

    module.exports = {

        'format': function (sample, data) {

            var s = sample;
            for (var key in data) {
                var value = data[key];

                //全局替换
                s = s.split('{' + key + '}').join(value);
            }

            return s;
        },

    };

});
