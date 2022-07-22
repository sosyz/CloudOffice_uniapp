import config from './config'
import tools from './tools'

const CloudAPI = {
	user: {
		login: function(code: string, from: string){
			return uni.request({
				url: config.url + 'user/login/default',
				method: 'GET',
				data: {
					code: code,
					from: from
				}
			})
		},
		getUserInfo: function(){
			return uni.request({
				url: config.url + 'user/info',
				header: {
					Cookie: tools.cookies()
				},
				method: 'GET'
			})
		},
		setUserInfo: function(name: string, phone: string, address: string) {
			return uni.request({
				url: config.url + "user/set",
				header: {
					Cookie: tools.cookies()
				}
			})
		},
		repeatRead: function(fid: string[], storeId: string){
			return uni.request({
				url: config.url + "user/repeat_read",
				method: 'POST',
				header: {
					Cookie: tools.cookies()
				},
				data: {
					fid: JSON.stringify(fid),
					storeId: storeId
				}
			})
		}

	},
	file: {
		upload: function(name: string, size: string, path: string, success: any) {
			return uni.uploadFile({
				url: config.url + "file/upload",
				name: 'file',
				header: {
					"Content-Type": "multipart/form-data",
					Cookie: tools.cookies()
				},
				filePath: path,
				name: name,
				formData: {
					size: size
				},
				success: success
			})
		},
		download: function(fid: string, OnlyHead: boolean) {
			return uni.request({
				url: config.url + "file/download",
				method: OnlyHead ? 'HEAD' : 'GET',
				header: {
					Cookie: tools.cookies()
				},
				data: {
					fid: fid
				}
			})
		}
	},
	order: {
		list: function(page: number, size: string) {
			return uni.request({
				url: config.url + "order/list",
				method: 'GET',
				header: {
					Cookie: tools.cookies()
				},
				data: {
					page: page,
					size: size
				}
			})
		},
		detail: function(oid: string) {
			return uni.request({
				url: config.url + "order/detail",
				method: 'GET',
				header: {
					Cookie: tools.cookies()
				},
				data: {
					oid: oid
				}
			})
		},
		merge: function(fid: string[]) {
			return uni.request({
				url: config.url + "order/merge",
				method: 'POST',
				header: {
					Cookie: tools.cookies()
				},
				data: {
					fids: JSON.stringify(fid)
				}
			})
		},
		cancel: function(oid: string) {
			return uni.request({
				url: config.url + "order/cancel",
				method: 'POST',
				header: {
					Cookie: tools.cookies()
				},
				data: {
					oid: oid
				}
			})
		}
	},
	pay: {
		info: function(oid: string) {
			return uni.request({
				url: config.url + "pay/info",
				method: 'GET',
				header: {
					Cookie: tools.cookies()
				},
				data: {
					oid: oid
				}
			})
		},
		status: function(oid: string) {
			return uni.request({
				url: config.url + "pay/status",
				method: 'GET',
				header: {
					Cookie: tools.cookies()
				},
				data: {
					oid: oid
				}
			})
		},
	}
}

export default CloudAPI