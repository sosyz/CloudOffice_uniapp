<template>
	<view class="container">
		<uni-card title="文件列表" style="margin: 30rpx auto;">
			<view class="orderFile" v-for="(item, index) in orderInfoDemo.list">
				<view>{{ item.name }}</view>
				<view>{{ item.pages }}张 * {{ item.num }}份</view>
			</view>
		</uni-card>
		<view class="row">
			<view>订单号: {{ orderInfoDemo.out_trade_no }}</view>
		</view>
		<view class="row">
			<view>
				支付金额:
				<text style="font-size: 1.5em; color: crimson;">{{ orderInfoDemo.total_fee / 100  }}</text>
				元
			</view>
		</view>

		<view class="btn"><view style="btn-print" @tap="GoPay()">支付</view></view>
	</view>
</template>

<script>
const config = getApp().globalData.config;

export default {
	data() {
		return {
			orderInfoDemo: {
				mchid: 123,
				total_fee: 121,
				out_trade_no: 'TEST-123123',
				nonceStr: 'pqikjd91kfewifj192dk',
				sign: '123123123123',
				list: [{ name: '文件1', pages: 3, num: 1 }, { name: '文件2', pages: 1, num: 1 }, { name: '文件3', pages: 13, num: 2 }]
			},
			orderResults: {}, // 支付结果
			preparePay: false, // 用户点击了支付按钮（订单信息交由 payjs 组件）
			paying: false, // 标记用户是否已经点击了「支付」并成功跳转到 PAYJS 小程序，该参数由 payjs 组件维护，用户可监听以在 onShow 生命周期函数中判断
			needRefreshOrderParams: false, // 需要刷新订单信息，在此示例中，为了测试方便，允许支付一个订单号再进行一次新的支付行为；在生产环境下判断支付成功后直接跳转到订单页面即可
			orderParams: getApp().globalData.orderParams, // 支付发起参数
			preparePay: false, // 控制 payjs 组件的创建与销毁
			paying: false // 可选：如需知晓用户是否「已经跳转到了 PAYJS 小程序还未返回」的状态则可通过事件处理函数监听事件内的 paying 数据
		};
	},
	onLoad: (option) => {
		this.orderInfoDemo = option;
		console.log(this.orderInfoDemo);
		//getApp().globalData.payjsOrderId = '114514';
	},
	methods: {
		//跳转到Payjs小程序支付
		GoPay: () => {
			this.orderParams = getApp().globalData.orderParams;
			uni.navigateToMiniProgram({
				appId: 'wx959c8c1fb2d877b5',
				path: 'pages/pay',
				extraData: this.orderParams,
				envVersion: 'release',
				success: res => {
					console.log('[PAYJS] 跳转到 PAYJS 小程序成功', res);
					// 成功跳转：标记支付中状态
					this.paying = true;
				},
				fail: error => {
					//TODO: 弹出提示组件引导用户跳转
					// 跳转失败：弹出提示组件引导用户跳转
					console.log('[PAYJS] 跳转到 PAYJS 小程序失败 - 准备弹窗提醒跳转', error);
					this.showPayModal = true;
				}
			});
		}
		//TODO：订单状态验证
	},
	onShow: function(options) {
		if (this.orderParams == null) {
		}
		//console.log('1a', this.paying);
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

<style>
.container {
	margin: 10rpx auto;
	width: 85vw;
}

.btn {
	width: 75vw;
	margin: 48rpx auto;
	text-align: center;
	font-size: 16px;
}

.btn view {
	padding: 12rpx;
	margin-top: 20rpx;
	border-width: 1px;
	border-style: solid;
	border-radius: 6rpx;
	border-color: #808080;
}

.row {
	padding: 10rpx 30rpx 0 30rpx;
	font-size: 0.9em;
	display: flex;
	flex-direction: row-reverse;
	align-items: center;
}

.hr {
	height: 0;
	border-top: solid 1px #d9d9d9;
	margin: 20rpx 0;
}

.orderFile {
	margin-top: 10rpx;
}
.orderFile view:nth-child(1){
	font-size: 1.2em;
	color: #000000;
}

.orderFile view:nth-child(2){
	font-size: 0.9em;
}
</style>
