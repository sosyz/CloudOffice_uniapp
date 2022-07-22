<template>
	<view class="container">
		<uni-card title="文件列表" style="margin: 30rpx auto;">
			<view class="orderFile" v-for="(item, index) in fileList">
				<view>{{ item.name }}</view>
				<view>{{ item.pages }}张 * {{ item.num }}份</view>
			</view>
		</uni-card>
		<view class="row">
			<view>订单号: {{ orderInfo.out_trade_no }}</view>
		</view>
		<view class="row">
			<view>
				支付金额:
				<text style="font-size: 1.5em; color: crimson;">{{ orderInfo.total_fee / 100 }}</text>
				元
			</view>
		</view>

		<view class="btn"><view style="btn-print" @tap="GoPay()">支付</view></view>
	</view>
</template>

<script>
import utils from '@/utils/CloudAPI';

const to = promise => {
	return promise.then(res => [null, res]).catch(error => [error]);
};
export default {
	data() {
		return {
			orderInfo: {
				mchid: null,
				total_fee: null,
				out_trade_no: 'null',
				nonceStr: 'null',
				sign: 'null'
			},
			fileList: [{ name: 'null', pages: null, num: null }],
			orderResults: {}, // 支付结果
			preparePay: false, // 用户点击了支付按钮（订单信息交由 payjs 组件）
			paying: false, // 标记用户是否已经点击了「支付」并成功跳转到 PAYJS 小程序，该参数由 payjs 组件维护，用户可监听以在 onShow 生命周期函数中判断
			needRefreshOrderParams: false, // 需要刷新订单信息，在此示例中，为了测试方便，允许支付一个订单号再进行一次新的支付行为；在生产环境下判断支付成功后直接跳转到订单页面即可
			orderParams: getApp().globalData.orderParams, // 支付发起参数
			preparePay: false, // 控制 payjs 组件的创建与销毁
			paying: false // 可选：如需知晓用户是否「已经跳转到了 PAYJS 小程序还未返回」的状态则可通过事件处理函数监听事件内的 paying 数据
		};
	},
	onLoad(option) {
		// #ifdef APP-NVUE
		const eventChannel = this.$scope.eventChannel; // 兼容APP-NVUE
		// #endif
		// #ifndef APP-NVUE
		const eventChannel = this.getOpenerEventChannel();
		// #endif
		// 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
		const that = this;
		eventChannel.on('fileList', function(data) {
			console.log(data);
			that.fileList = data.data;
		});
		console.log(option.orderID);
		utils.getPayInfo(option.orderID, opt => {
			console.log('this.orderInfo', this.orderInfo);
			console.log('opt', opt);
			this.orderInfo = opt;
		});
		//getApp().globalData.payjsOrderId = '114514';
	},
	methods: {
		//跳转到Payjs小程序支付
		GoPay() {
			console.log(this.orderInfo)
			uni.navigateToMiniProgram({
				appId: 'wx959c8c1fb2d877b5',
				path: 'pages/pay',
				extraData: this.orderInfo,
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
.orderFile view:nth-child(1) {
	font-size: 1.2em;
	color: #000000;
}

.orderFile view:nth-child(2) {
	font-size: 0.9em;
}
</style>
