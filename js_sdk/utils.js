import config from './config'

/**
 * @param {Object} path 文件本地路径
 * @param {Object} name 文件名
 * @param {Object} callback 回调函数
 */
function uploadFile(path, name, callback) {
	let tmpKey = getApp().tmpKey;
	const currentDate = new Date();
	if (tmpKey.ExpiredTime >= currentDate.getTime() / 1000) {
		login()
	}
	const expirationDate = new Date(currentDate.getTime() + expires * 1000);
	const keyTime = `${Math.floor(currentDate.getTime() / 1000)};${Math.floor(expirationDate.getTime() / 1000)}`;
	const policy = JSON.stringify({
		expiration: expirationDate.toISOString(),
		conditions: [{
			'q-sign-algorithm': 'sha1'
		}, {
			'q-ak': secretId
		}, {
			'q-sign-time': keyTime
		}]
	});
	const signKey = crypto.createHmac('sha1', secretKey).update(keyTime).digest('hex');
	const stringToSign = crypto.createHash('sha1').update(policy).digest('hex');
	const signature = crypto.createHmac('sha1', signKey).update(stringToSign).digest('hex');
	console.log({
		host: `https://${config.bucket}.cos.${config.region}.myqcloud.com`,
		signAlgorithm: 'sha1',
		ak: secretId,
		keyTime,
		signature,
		policy: Buffer.from(policy).toString('base64')
	});
	//callback;

}

/**
 * 更新临时密钥
 * @param {Object} openid
 */
function updateTmpKey() {
	let openid = uni.getStorageSync("openid");
	let session = uni.getStorageSync("session");
	uni.request({
		url: 'http://192.168.3.210:8080/user/getTmpKey',
		method: 'POST',
		data: {
			session: session,
			openid: openid,
		},
		success: function(result) {
			getApp().tmpKey = result.data;
			console.log(getApp().tmpKey);
		}
	})
}

/**
 * 登录
 */
function login() {
	return new Promise((resolve, reject) => {
		let openid = uni.getStorageSync('openid');
		if (openid != "") return openid;
		// #ifdef MP-WEIXIN
		wx.login({
			success(res) {
				if (res.code) {
					//发起网络请求
					wx.request({
						url: 'http://192.168.3.210:8080/user/login',
						method: 'POST',
						data: {
							code: res.code
						},
						success(res2) {
							if (res2.data.code != 0) {
								console.log('服务器登录失败' + res2.data.msg);
							} else {
								console.log(res2.data);
								let openid = res2.data.openid;
								let session = res2.data.session;
								uni.setStorage({
									key: "session",
									data: session,
									success() {
										console.log('登录完成，session: ' + session);
									}
								});
								uni.setStorage({
									key: "openid",
									data: openid,
									success() {
										console.log('登录完成，openid: ' + openid);
									}
								});
								resolve({
									openid: uni.getStorageSync('openid'),
									session: uni.getStorageSync('session')
								})
							}
						}
					})
				} else {
					console.log('登录失败！' + res.errMsg)
				}
			}
		})
		// #endif
	})
}
export default {
	login,
	updateTmpKey,
	uploadFile,
}
