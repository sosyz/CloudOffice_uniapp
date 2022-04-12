const Bucket = "cloudprinter-1251472184"; //存储桶的名称，命名规则为 BucketName-APPID，此处填写的存储桶名称必须为此格式
const Region = "ap-beijing"; //存储桶所在地域
import COS from './cos-wx-sdk-v5.js'
//创建一个 COS SDK 实例

//上传图片到腾讯云
function uploadFileToTencentClound(filename, filePath) {
	let cos = new COS({
		getAuthorization: function(options, callback) {
			let openid = uni.getStorageSync('openid');
			wx.request({
				url: 'http://192.168.3.210:8080/user/' + openid + '/getkey',
				success: function(result) {
					var data = result.data;
					var credentials = data && data.credentials;
					if (!data || !credentials) return console.error('credentials invalid');
					callback({
						TmpSecretId: credentials.tmpSecretId,
						TmpSecretKey: credentials.tmpSecretKey,
						XCosSecurityToken: credentials.sessionToken,
						StartTime: data.startTime, // 时间戳，单位秒，如：1580000000
						ExpiredTime: data.expiredTime // 时间戳，单位秒，如：1580000900
					});
				}
			});
		}
	});
	return new Promise((resolve, reject) => {
		cos.postObject({
				Bucket: Bucket,
				Region: Region,
				Key: 'wxFile/' + filename,
		 	FilePath: filePath,
				onProgress: function(info) {
					console.log("[cos.postObject-seccess]", JSON.stringify(info));
				}
			},
			function(err, data) {
				console.log("[cos.postObject-err]", err || data);
				resolve(data.headers.location)
			})
	})
}
export default {
	uploadFileToTencentClound
}
