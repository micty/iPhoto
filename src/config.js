

module.exports = {

    //ɨ�����ԴĿ¼��
    src: [
        //'E:/Photo/iPhoto-test/',
        'E:/Photo/iPhone7P-Ori/1/',
    ],

    //�����Ŀ�ꡣ 
    dest: {
        //����Ļ�׼Ŀ¼������·������ڴ�Ŀ¼��
        //base: 'E:/Photo/iPhoto-test/dest/',
        base: 'E:/Photo/iPhone7P-dest/',

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
        //��Ҫ����һ���ַ����� 
        //������ṩ����ʹ��Ĭ�ϵġ�
        process: function (data) {
            
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
