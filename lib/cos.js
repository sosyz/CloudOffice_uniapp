// #ifdef MP-WEIXIN
var CosAuth = require('cos-auth');
// #endif
//CosAuth.cosauth();
var config = {
    Bucket: 'cloudprinter-1251472184',
    Region: 'ap-beijing',
};

var uploadFile = function (filePath) {
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
		console.log("res", res);
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
            console.log('getAuthorization', options, credentials);
            callback({
                XCosSecurityToken: credentials.Token,
                Authorization: CosAuth({
                    Bucket:Bucket,
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
    var uploadFile = function (filePath) {
        var Key = filePath.substr(filePath.lastIndexOf('/') + 1); // 这里指定上传的文件名
        getAuthorization({Method: 'POST', Pathname: '/' + uni.getStorageSync('openid') + '/' + Key}, function (AuthData) {
            console.log('AuthData', AuthData);
            var requestTask = uni.uploadFile({
                url: prefix,
                name: 'file',
                filePath: filePath,
                formData: {
                    'key': Key,
                    'success_action_status': 200,
                    'Signature': AuthData.Authorization,
                    'x-cos-security-token': AuthData.XCosSecurityToken,
                    'Content-Type': '',
                },
                success: function (res) {
                    var url = prefix + camSafeUrlEncode(Key).replace(/%2F/g, '/');
                    if (res.statusCode === 200) {
                        uni.showModal({title: '上传成功', content: url, showCancel: false});
                    } else {
                        console.log('fail', res);
                        uni.showModal({title: '上传失败', content: JSON.stringify(res), showCancel: false});
                    }
                    console.log(res.statusCode);
                    console.log(url);
                },
                fail: function (res) {
                    console.log('fail', res);
                    uni.showModal({title: '上传失败', content: JSON.stringify(res), showCancel: false});
                }
            });
            requestTask.onProgressUpdate(function (res) {
                console.log('正在进度:', res);
            });
        });
    };

    // 上传文件文件
    
    console.log('CosAuth', CosAuth);
    uploadFile(filePath);
};

export default {
	uploadFile,
}