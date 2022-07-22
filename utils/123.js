import config from './config.js'

const to = promise => {
	return promise.then(res => [null, res]).catch(error => [error]);
};

/**
 * 通知开始上传文件，换取文件标识
 */
async function UploadStart(name, path) {
	let error, res;
	[error, res] = await to(uni.request({
		url: config.url + 'file/upload',
		method: 'POST',
		header: {
			'content-type': 'application/x-www-form-urlencoded',
		},
		data: {
			session: getApp().globalData.session,
			openid: getApp().globalData.openid,
			name: name,
			path: getApp().globalData.openid
		}
	}));
	if (error != null) {
		console.log("uploadStart请求失败", error);
	} else if (res.data.code === 0) {
		res = res.data;
		return res.fid;
	} else {
		console.log("uploadStart请求失败", res.message);
	}
}

/**
 * 通知文件上传完毕，云端进行数据转码
 * @param {string} fid 
 */
async function UploadComplete(fid) {
	let error, res;
	[error, res] = await to(uni.request({
		url: config.url + 'file/complete',
		method: 'POST',
		header: {
			'content-type': 'application/x-www-form-urlencoded',
		},
		data: {
			session: getApp().globalData.session,
			openid: getApp().globalData.openid,
			fid: fid
		}
	}));
	if (error != null) {
		console.log("UploadComplete请求失败", error);
	} else if (res.data.code === 0) {
		res = res.data;
		return res.pageNum;
	} else {
		console.log("UploadComplete请求失败", res.msg);
	}
}
/**
 * 更新临时密钥
 * @param {Object} openid
 */
async function updateTmpKey() {
	let error, res;
	[error, res] = await to(uni.request({
		url: config.url + 'user/tmpKey',
		method: 'POST',
		header: {
			'content-type': 'application/x-www-form-urlencoded',
		},
		data: {
			session: getApp().globalData.session,
			openid: getApp().globalData.openid,
		}
	}));
	if (error != null) {
		console.log("获取临时密钥失败", error);
	} else if (res.data.code === 0) {
		res = res.data;
		getApp().globalData.tmpKey = res.data;

	} else {
		console.log("获取临时密钥失败", res.msg);
	}
}


async function getPayInfo(orderID, callback) {
	let error, res;
	[error, res] = await to(uni.request({
		method: 'POST',
		url: config.url + 'order/payInfo',
		header: {
			'content-type': 'application/x-www-form-urlencoded',
		},
		data: {
			openid: getApp().globalData.openid,
			session: getApp().globalData.session,
			orderID: orderID
		}
	}));
	if (error != null) {
		uni.showModal({
			title: "获取支付数据失败",
			content: error,
			showCancel: false
		})
		console.log("获取支付数据失败", error);
	} else if (res.data.code === 0) {
		res = res.data;
		callback(res.payOpt);
	} else {
		uni.showModal({
			title: "获取支付数据失败",
			content: res.message,
			showCancel: false
		})
		console.log("获取支付数据失败", res);
	}
}

/**
 * 登录
 */
async function login() {
	console.log(getApp())
	let openid = uni.getStorageSync('openid');
	if (openid != "") {
		getApp().globalData.openid = uni.getStorageSync('openid');
		getApp().globalData.session = uni.getStorageSync('session');
		return;
	}
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
		header: {
			'content-type': 'application/x-www-form-urlencoded',
		},
		data: {
			from: "wx",
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
		getApp().globalData.openid = openid;
		getApp().globalData.session = session;
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
	getPayInfo,
	UploadStart,
	UploadComplete,
}
