const CosAuth = require('cos-auth');
const md5Util = require('md5.js');
const { config } = require('config.js');

var uploadFile = async function(filePath, name, resStatus) {
	// 存储桶链接
	let prefix = 'https://' + config.Bucket + '.cos.' + config.Region + '.myqcloud.com/';

	// 对更多字符编码的 url encode 格式
	var camSafeUrlEncode = function(str) {
		return encodeURIComponent(str)
			.replace(/!/g, '%21')
			.replace(/'/g, '%27')
			.replace(/\(/g, '%28')
			.replace(/\)/g, '%29')
			.replace(/\*/g, '%2A');
	};

	// 获取临时密钥
	let stsCache = getApp().tmpKey;
	if (stsCache && Date.now() / 1000 + 30 > stsCache.expiredTime) {
		await updateTmpKey();
	}
	console.log(stsCache)
	if (!stsCache.Credentials) {
		uni.showModal({
			title: '临时密钥获取失败',
			content: JSON.stringify(data),
			showCancel: false
		});
		return "失败"
	}
	let credentials = stsCache.Credentials;

	// 计算签名
	console.log("MD5opendid", md5Util.md5(uni.getStorageSync('openid')));
	let namekey = uni.getStorageSync('openid') + '/' + name; // 这里指定上传的文件名
	let authsign = {
		XCosSecurityToken: credentials.Token,
		Authorization: CosAuth({
			Bucket: config.Bucket,
			Token: credentials.Token,
			SecretId: credentials.TmpSecretId,
			SecretKey: credentials.TmpSecretKey,
			Method: 'POST',
			Pathname: namekey
		})
	};

	// 上传文件
	var requestTask = uni.uploadFile({
		url: prefix,
		name: 'file',
		filePath: filePath,
		formData: Object.assign({
				'key': namekey,
				'success_action_status': 200,
			},
			authsign.Authorization
		),
		success: function(res) {
			var url = prefix + camSafeUrlEncode(namekey).replace(/%2F/g, '/');
			if (res.statusCode === 200) {
				//uni.showModal({title: '上传成功', content: url, showCancel: false});
				resStatus("完成");
			} else {
				console.log('fail', res.data);
				resStatus(
					"失败"
				); //uni.showModal({title: '上传失败', content: JSON.stringify(res), showCancel: false});
			}
		},
		fail: function(res) {
			console.log('fail', res.data);
			resStatus("失败");
			//uni.showModal({title: '上传失败', content: JSON.stringify(res), showCancel: false});
		}
	});
	
	// 进度显示
	requestTask.onProgressUpdate(function(res) {
		resStatus(res.progress + "%");
	});
};

export default {
	uploadFile,
}
