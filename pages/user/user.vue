<template>
	<view>
		<view class="card">
			<view class="header">
				<image src="../../static/logo.png"></image>
				<view style="display: flex;	flex-direction: column;">
					<view class="title">
						<text class="htitle">管理员</text>
						<text class="name">Sonui</text>
					</view>
					<view style="margin-top: 10rpx;"><text class="phone">185*******3</text></view>
				</view>
			</view>
			<view class="body">
				<view class="content border--right"><text>联系客服</text></view>
				<view class="content border--right"><text>消费数额</text></view>
				<view class="content"><text>关于</text></view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	methods: {}
};
</script>

<style>
.body .content {
	flex: 1;
	color: #ffffff;
	text-align: center;
	margin: 10rpx;
	height: 48rpx;
}
.border--right {
	flex: 1;
	border-right-color: #d8d8d8;
	border-right-style: solid;
	border-right-width: 1rpx;
}
.card {
	display: flex;
	border-radius: 20rpx;
	margin: 60rpx auto;
	width: 85vw;
	height: 256rpx;
	background-color: #c8c6c9;
	flex-direction: column;
}

.card .header {
	display: flex;
	margin: 25rpx;
}

.card .body {
	border-top-color: #d8d8d8;
	border-top-style: solid;
	border-top-width: 1rpx;
	margin: 0 10rpx 0rpx 10rpx;
	display: flex;
}
.header .title {
	margin-left: 15rpx;
	padding-top: 15rpx;
}

.header .phone {
	color: #ffffff;
	font-size: 10px;
	margin: 30rpx 0 0 15rpx;
}

.header .title .htitle {
	height: 38rpx;
	padding: 3rpx;
	margin-right: 8rpx;
	background-color: #f2bf25;
	color: #ffffff;
	border-radius: 4px;
	font-size: 14px;
	white-space: nowrap;
	vertical-align: middle;
	max-width: 50px;
	min-width: 3em;
}

.header .title .name {
	color: #ffffff;
	font-size: 16px;
}

.header image {
	border-radius: 6px;
	width: 128rpx;
	height: 128rpx;
}
</style>
