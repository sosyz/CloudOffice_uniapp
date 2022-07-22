const tools = {
	cookies: function() {
		return "openid=" + uni.getStorageSync("openid") + "; session=" + uni.getStorageSync("session");
	}
}

export default tools;