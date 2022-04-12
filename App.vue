<script>
import utils from './js_sdk/utils.js'
export default {
	onLaunch: function() {
		let openid = uni.getStorageSync('openid');
		if (!openid) openid = utils.updateOpenId();
		utils.updateTmpKey();
	},
	onShow: function() {
		
	},
	onHide: function() {
	}
}
</script>

<style>
/*每个页面公共css */
</style>
