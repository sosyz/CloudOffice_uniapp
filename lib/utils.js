const config = {
	url: 'https://printer.sonui.cn:8080/',
};
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
		/*
		let key = {
			TmpSecretId: res.data.Credentials.TmpSecretId,
			TmpSecretKey: res.data.Credentials.TmpSecretKey,
			XCosSecurityToken: res.data.Credentials.Token,
			StartTime: res.data.StartTime,
			ExpiredTime: res.data.ExpiredTime,
			ScopeLimit: true, //传到多个文件的话，必须要的参数，如果不加，你会发现，第一次传的可能会成功，第二次就不会，因为你创建的实例只有第一次使用到了，加了这个它会根据使用的密钥不同，而进行创建实例
		}
		*/
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
