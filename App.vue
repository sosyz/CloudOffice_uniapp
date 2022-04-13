<script>
import utils from './js_sdk/utils.js'
export default {
	onLaunch: function() {
		// #ifdef MP-WEIXIN
		wx.checkSession({
		  success () {
		    //session_key 未过期，并且在本生命周期一直有效	
			utils.updateTmpKey();
		  },
		  fail () {
		    // session_key 已经失效，需要重新执行登录流程
		    utils.login();
			utils.updateTmpKey();
		  }
		})
		// #endif
		
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
