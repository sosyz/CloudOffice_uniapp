<template>
	<view style="width: 85vw; margin: 0 auto;">
		<view class="notice">
			<view class="card">
				<uni-swiper-dot :info="info" :current="current" field="content" :mode="mode">
					<swiper class="swiper-box" @change="change">
						<swiper-item v-for="(item, index) in info" :key="index">
							<view class="swiper-item">
								<text>{{ item.content }}</text>
							</view>
						</swiper-item>
					</swiper>
				</uni-swiper-dot>
			</view>
		</view>
		<view class="menu">
			<view class="print" style="order: 1;">
				<view class="card btn" style="background: linear-gradient(20deg, #f12711, #f5af19); display: flex; flex-direction: column;" @tap="goto('/pages/print/print')">
					<cover-image style="width: 128rpx; height: 128rpx;" src="../../static/res/img/printer.png"></cover-image>
					<text class="hm" style="color: white; font-size: 64rpx; margin-top: 36rpx;">打印</text>
				</view>
			</view>
			<view class="other">
				<view class="item">
					<view class="card" style="background: linear-gradient(20deg, #3f8fe1cc 0%, #44d7c9 100%);" @tap="goto('/pages/order/order')">
						<cover-image style="width: 84rpx; height: 84rpx;" src="../../static/res/img/order.png"></cover-image>
						<text class="hm" style="color: white; font-size: 64rpx;">订单</text>
					</view>
				</view>
				<view class="item">
					<view class="card btn" style="background: linear-gradient(20deg, #00b09b, #96c93d);" @tap="goto('/pages/user/user')">
						<cover-image style="width: 84rpx; height: 84rpx; " src="../../static/res/img/mine.png"></cover-image>
						<text class="hm" style="color: white; font-size: 64rpx;">个人</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
const url = 'https://cdn-1251472184.cos.ap-beijing.myqcloud.com/font/HarmonyOS_Sans.ttf';
export default {
	data() {
		return {
			title: 'Hello',
			info: [
				{
					content: '公告 A'
				}
			],
			current: 0,
			mode: 'round'
		};
	},
	onLoad() {},
	methods: {
		goto(url) {
			uni.navigateTo({
				url: url
			});
		},
		change(e) {
			this.current = e.detail.current;
		},
		loadFontFaceFromWeb() {
			uni.loadFontFace({
				global: true,
				family: 'HarmonyOS Sans',
				source: `url("${url}")`
			});
		}
	}
};
</script>

<style>
.hm {
	font-family: 'HarmonyOS Sans';
}
.btn:active {
	background-image: linear-gradient(rgba(33, 31, 31, 0.15), rgba(33, 31, 31, 0.15));
}
.card {
	align-items: center;
	justify-content: center;
	flex-grow: 1;
	border-radius: 20rpx;
	margin: 16rpx 16rpx 16rpx 16px;
	background-color: #55aaff;
}

.notice {
	margin: 32rpx 0;
	height: 43vw;
}

.menu {
	margin: 60rpx 0;
	display: flex;
	flex-direction: row;
}

.menu .print {
	display: flex;
	flex-grow: 1;
	height: 416rpx;
}

.menu .other {
	flex-grow: 1;
	display: flex;
	flex-direction: column;
}

.menu .other .item {
	display: flex;
	height: 208rpx;
	flex-grow: 1;
}

.item .card {
	display: flex;
}

.item .card text {
	margin-left: 16rpx;
}
</style>
