import config from './config'

function uploadFile(path, name, callback) {
	const currentDate = new Date();
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
}


/**
 * 更新临时密钥
 * @param {Object} openid
 */
function updateTmpKey(openid) {
	uni.request({
		url: 'http://192.168.3.210:8080/user/' + openid + '/getTmpKey',
		success: function(result) {
			getApp().tmpKey = result.data;
			console.log(getApp().tmpKey);
		}
	})
}
/**
 * 更新用户标识
 */
function updateOpenId() {
	let openid = uni.getStorageSync('openid');
	if (openid != "") return openid;
	// #ifdef MP-WEIXIN
	wx.login({
		success(res) {
			if (res.code) {
				//发起网络请求
				wx.request({
					url: 'http://192.168.3.210:8080/login',
					method: 'POST',
					data: {
						code: res.code
					},
					success(res2) {
						if (res2.data.code != 0) {
							console.log('服务器登录失败' + res2.data.msg);
						} else {
							openid = res2.data.openid;
							uni.setStorage({
								key: "openid",
								data: openid,
								success() {
									console.log('登录完成，存储值' + openid);
								}
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
	return uni.getStorageSync('openid');
}
export default {
	updateOpenId,
	updateTmpKey,
}
