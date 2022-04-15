// #ifdef MP-WEIXIN
var CosAuth = require('cos-auth');
// #endif
//CosAuth.cosauth();
var config = {
    Bucket: 'cloudprinter-1251472184',
    Region: 'ap-beijing',
};

var uploadFile = async function (filePath, name, resStatus) {
    // 请求用到的参数
    // var prefix = 'https://cos.' + config.Region + '.myqcloud.com/' + config.Bucket + '/'; // 这个是后缀式，签名也要指定 Pathname: '/' + config.Bucket + '/'
    var prefix = 'https://' + config.Bucket + '.cos.' + config.Region + '.myqcloud.com/';

    // 对更多字符编码的 url encode 格式
    var camSafeUrlEncode = function (str) {
        return encodeURIComponent(str)
            .replace(/!/g, '%21')
            .replace(/'/g, '%27')
            .replace(/\(/g, '%28')
            .replace(/\)/g, '%29')
            .replace(/\*/g, '%2A');
    };

    // 获取临时密钥
    var stsCache;
    var getCredentials = function (callback) {
        if (stsCache && Date.now() / 1000 + 30 < stsCache.expiredTime) {
            callback(stsCache.credentials);
            return;
        }
        let res = getApp().tmpKey;
		//console.log("res", res);
        var data = res;
        var credentials = data.Credentials;
        if (credentials) {
            stsCache = data
        } else {
            // #ifdef MP-WEIXIN
            wx.showModal({title: '临时密钥获取失败', content: JSON.stringify(data), showCancel: false});
            // #endif
        }
        callback(stsCache && stsCache.Credentials);
        /*
        wx.request({
            method: 'GET',
            url: config.stsUrl, // 服务端签名，参考 server 目录下的两个签名例子
            dataType: 'json',
            success: function (result) {
                var data = result.data;
                var credentials = data.credentials;
                if (credentials) {
                    stsCache = data
                } else {
                    wx.showModal({title: '临时密钥获取失败', content: JSON.stringify(data), showCancel: false});
                }
                callback(stsCache && stsCache.credentials);
            },
            error: function (err) {
                wx.showModal({title: '临时密钥获取失败', content: JSON.stringify(err), showCancel: false});
            }
        });
        */
    };

    // 计算签名
    var getAuthorization = function (options, callback) {
        getCredentials(function (credentials) {
            callback({
                XCosSecurityToken: credentials.Token,
                Authorization: CosAuth({
                    Bucket: config.Bucket,
                    Token: credentials.Token,
                    SecretId: credentials.TmpSecretId,
                    SecretKey: credentials.TmpSecretKey,
                    Method: options.Method,
                    Pathname: options.Pathname
                })
            });
        });
    };

    // 上传文件
    var uploadFile = async function (filePath, name) {
        var Key = uni.getStorageSync('openid') + '/' + name; // 这里指定上传的文件名
        getAuthorization({Method: 'POST', Pathname: Key}, function (AuthData) {
			/*
			console.log('formData',  Object.assign(
					{
						'key': Key,
						'success_action_status': 200,
					},
					AuthData.Authorization
				));*/
            var requestTask = uni.uploadFile({
                url: prefix,
                name: 'file',
                filePath: filePath,
                formData: Object.assign(
					{
						'key': Key,
						'success_action_status': 200,
					},
					AuthData.Authorization
				),
                success: function (res) {
                    var url = prefix + camSafeUrlEncode(Key).replace(/%2F/g, '/');
                    if (res.statusCode === 200) {
                        //uni.showModal({title: '上传成功', content: url, showCancel: false});
						resStatus("完成");
                    } else {
                        console.log('fail', res.data);
                        resStatus("失败");//uni.showModal({title: '上传失败', content: JSON.stringify(res), showCancel: false});
                    }
                },
                fail: function (res) {
                    console.log('fail', res.data);
					resStatus("失败");
                    //uni.showModal({title: '上传失败', content: JSON.stringify(res), showCancel: false});
                }
            });
            requestTask.onProgressUpdate(function (res) {
                resStatus(res.progress + "%");
            });
        });
    };

    // 上传文件文件
    return uploadFile(filePath, name, resStatus);
};

export default {
	uploadFile,
}