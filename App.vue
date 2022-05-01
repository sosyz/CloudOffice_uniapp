<script>
import utils from '/lib/utils.js';
export default {
	globalData: {},
	onLaunch: async () => {
		this.globalData = {
			resultCode: 'WAITING',
			msg: '等待支付',
			paySuccess: false
		};
		await utils.login();
		await utils.updateTmpKey();
	},
	onShow: function(options) {
		// #ifdef MP-WEIXIN
		if (options.scene === 1038 && options.referrerInfo && options.referrerInfo.appId === 'wx959c8c1fb2d877b5') {
			// 还应判断请求路径
			let extraData = options.referrerInfo.extraData;
			this.globalData.paySuccess = extraData.success;
			this.globalData.resultCode = extraData.resultCode;
			this.globalData.msg = extraData.msg;
			this.globalData.payjsOrderId = extraData.payjsOrderId;
		}
		// #endif
	},
	onHide: function() {}
};
</script>

<style>
/*每个页面公共css */
</style>
