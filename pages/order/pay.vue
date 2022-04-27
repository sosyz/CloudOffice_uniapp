<template>
	<view><button @tap="GoPay()">发起支付</button></view>
	<!-- 	<payjs
		wx:if="{{ preparePay }}"
		params="{{ orderParams }}"
		bindsuccess="bindPaySuccess"
		bindfail="bindPayFail"
		bindcomplete="bindPayComplete"
		bind:dataChange="bindDataChange"
	/> -->
</template>

<script>
const config = getApp().globalData.config;

export default {
	data() {
		return {
			orderResults: {}, // 支付结果
			preparePay: false, // 用户点击了支付按钮（订单信息交由 payjs 组件）
			paying: false, // 标记用户是否已经点击了「支付」并成功跳转到 PAYJS 小程序，该参数由 payjs 组件维护，用户可监听以在 onShow 生命周期函数中判断
			needRefreshOrderParams: false, // 需要刷新订单信息，在此示例中，为了测试方便，允许支付一个订单号再进行一次新的支付行为；在生产环境下判断支付成功后直接跳转到订单页面即可
			orderParams: getApp().globalData.orderParams, // 支付发起参数
			preparePay: false, // 控制 payjs 组件的创建与销毁
			paying: false // 可选：如需知晓用户是否「已经跳转到了 PAYJS 小程序还未返回」的状态则可通过事件处理函数监听事件内的 paying 数据
		};
	},
	onLoad: () => {
		getApp().globalData.payjsOrderId = '114514';
	},
	methods: {
		//跳转到Payjs小程序支付
		GoPay: () => {
			let orderParams = getApp().globalData.orderParams;
			uni.navigateToMiniProgram({
				appId: 'wx959c8c1fb2d877b5',
				path: 'pages/pay',
				extraData: orderParams,
				envVersion: 'release',
				success: (res) => {
					console.log('[PAYJS] 跳转到 PAYJS 小程序成功', res);
					// 成功跳转：标记支付中状态
					this.paying = true;
				},
				fail: (error) => {
					//TODO: 弹出提示组件引导用户跳转
					// 跳转失败：弹出提示组件引导用户跳转
					console.log('[PAYJS] 跳转到 PAYJS 小程序失败 - 准备弹窗提醒跳转', error);
					this.showPayModal = true;
				}
			});
		},
		//TODO：订单状态验证
	},
	onShow: function(options) {
		console.log('1a', this.paying);
		if (this.paying) {
			// 标记：已经点击过支付
			// 注意轮询判断或延时判断支付
			// 从跳转后状态取值
			console.log(getApp());
			let payjsOrderId = getApp().globalData.payjsOrderId;
			console.log(payjsOrderId);
			// 注意请求后端判断是否支付成功而非通过前端判断
			// wx.request({
			// 	method: 'POST',
			// 	url: '后端检测是否支付成功的 url',
			// 	data: {
			// 		payjsOrderId
			// 	},
			// 	success: response => {
			// 		if (response.data.paySuccess) {
			// 			// 后端返回支付成功
			// 			// 执行成功后逻辑
			// 		} else {
			// 			// 后端返回尚未支付
			// 			// 提醒用户重新支付或点击「我已支付」发起重检查
			// 		}
			// 	}
			// });
		}
	}
};
</script>

<style></style>
