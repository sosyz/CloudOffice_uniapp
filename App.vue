<script>
import utils from './lib/utils.js'
export default {
	onLaunch: async () => {
		await utils.login();
		await utils.updateTmpKey();
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
