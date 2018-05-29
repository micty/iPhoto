

module.exports = {

    //ɨ�����ԴĿ¼��
    src: [
        //'E:/Photo/iPhoto-test/',
        //'E:/Photo/iPhone7P-iTools/',
        //'E:/Photo/iPhone7P/'
        'E:/Photo/iPhone7P-iTools/',
    ],

    //�����Ŀ�ꡣ 
    dest: {
        //����Ļ�׼Ŀ¼������·������ڴ�Ŀ¼��
        base: 'E:/Photo/iPhone7P-out/',





        //�Ƿ񸲸�Ŀ���ļ���
        overwrite: false,

        //��������ʱ������ļ���
        error: 'error.json',

        //������ȡ�� exif ��Ϣ����Ƭ�����·����
        photo: 'photo/{make}/{model}/{year}/{year}-{month}-{day}/{name}',

        //�����ǲ�����ȡ�� exif ��Ϣ���ļ���
        '.jpg': 'jpg/{date}/{name}',
        '.png': 'png/{date}/{name}',
        '.mov': 'mov/{date}/{name}',
        '.mp4': 'mp4/{date}/{name}',
        '.*': 'other/{date}/{name}',

        //�����ļ����Ĵ�������
        //���Է���һ���ַ�����һ������ 
        //������ṩ����ʹ��Ĭ�ϵġ�
        process: function (require, data) {
            //�� iTools ������ͼƬ����Ƶ���ļ���
            //������ʽ�� `20180529_IMG_1153.JPG`��ǰ��� 8 λ���ĵ����������ڡ�
            //�� Windows �����ģ���Ϊԭʼ���ļ����� `IMG_1153.JPG`�� 
            //�����Ҫ�ж������ָ�ʽ��

            var name = data.name;
            var reg = /^\d{8}_/;

            //���������� `20180529_` ��ͷ��������ʽ���������ﴦ��
            if (!reg.test(name)) {
                return;
            }

            var $ = require('$');           //defineJS �⡣
            var $Date = $.require('Date');  //defineJS �����ģ�顣
            var dt = name.slice(0, 8);      //���ڴ����� `20180529`
            var year = dt.slice(0, 4);      //��ݣ��� `2018`
            var month = dt.slice(4, 6);     //�·ݣ��� `05`
            var day = dt.slice(6);          //�շݣ��� `29`
            var date = year + '-' + month + '-' + day;  //�� `2018-05-29`

            //���Խ����ɱ�׼�� Date ʵ����
            dt = $Date.parse(date);

            //ǰ��� 8 λ�����޷���������Ч������ʵ�����������ﴦ��
            if (!dt) {
                return;
            }

            //���ˣ�ȷ������ `20180529_IMG_1153.JPG` ����������
            //����ȡ��벿�ֵ����ƣ��� `IMG_1153.JPG`��
            name = name.slice(9);

            //�� exif ��Ϣ�ģ�ֻ��Ҫ��һ�����Ƽ��ɡ�
            //ģ���ַ����������Ҫ�õ������ֶΣ��� `make`��`model`����Ĭ�ϻ�� exif ����ȡ��
            //�˴�ֻ��Ҫ����һ��Ҫ�ĵ��ֶμ��ɡ�
            //�� exif ��Ϣ�Ķ�Ӧ��ģ���ַ�������Ϊ `photo`
            if (data.exif) {
                return { 'name': name, };
            }

            //�����ĵ���
            //Ҫ�ṩ���ֶξͲο���Ӧ��ģ���ַ�����������Ϊ `.jpg`��`.png` �ȡ�
            return {
                'date': date,
                'name': name,
            };

        },
        
    },

    //Ҫ�ų����ļ����͡�
    excludes: [
        '.ini',
    ],

    exif: {
        //��Ҫ���� exif ��Ϣ��ȡ���ļ����͡�
        'exts': ['.JPG'],
    }

}
