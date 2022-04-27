import config from '/lib/config.js'
const to = promise => {
	return promise.then(res => [null, res]).catch(error => [error]);
};

/**
 * 更新临时密钥
 * @param {Object} openid
 */
async function updateTmpKey() {
	let openid = uni.getStorageSync("openid");
	let session = uni.getStorageSync("session");
	let error, res;
	[error, res] = await to(uni.request({
		url: config.url + 'user/getTmpKey',
		method: 'POST',
		data: {
			session: session,
			openid: openid,
		}
	}));
	if (error != null) {
		console.log("登录失败", error);
	} else if (res.data.code === 0) {
		res = res.data;
		getApp().tmpKey = res.data;
	}else{
		console.log("登录失败", res.msg);
	}
}

/**
 * 登录
 */
async function login() {
	let openid = uni.getStorageSync('openid');
	if (openid != "") return openid;
	let error, res;
	// #ifdef MP-WEIXIN
	[error, res] = await to(wx.login());
	// #endif
	if (error != null) {
		console.log('登录失败！' + error);
		return;
	}

	//发起登录请求
	[error, res] = await to(uni.request({
		url: config.url + 'user/login',
		method: 'POST',
		data: {
			code: res.code
		}
	}));
	if (error != null) {
		console.log('登录失败！' + error);
		return;
	}
	if (res.data.code != 0) {
		console.log('服务器登录失败' + res.data.msg);
	} else {
		console.log(res.data);
		let openid = res.data.openid;
		let session = res.data.session;
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
	}
}
export default {
	login,
	updateTmpKey,
}
