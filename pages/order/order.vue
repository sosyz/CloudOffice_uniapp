<template>
	<view style="margin-bottom: 48rpx;">
		<uni-card class="order-box" v-for="(item, index) in Data" :title="'订单编号: ' + item.id" :key="item.id">
			<view class="order-body">
				<image src="../../static/logo.png"></image>
				<view class="info">
					<text class="name">{{ item.name }}</text>
					<text class="time">创建时间: {{ item.time }}</text>
				</view>
				<view class="tips">
					<text :class="Status[item.status].cl">{{ Status[item.status].msg }}</text>
				</view>
			</view>
		</uni-card>
	</view>
</template>
<script>
export default {
	data() {
		return {
			Status: {
				0: {
					msg: '待付款',
					cl: 'tips-waring'
				},
				1: {
					msg: '已付款',
					cl: 'tips-ok'
				},
				2: {
					msg: '待打印',
					cl: 'tips-running'
				},
				3: {
					msg: '打印中',
					cl: 'tips-running'
				},
				4: {
					msg: '待取货',
					cl: 'tips-waring'
				},
				5: {
					msg: '完成',
					cl: 'tips-ok'
				},
				6: {
					msg: '已关闭',
					cl: 'tips-error'
				}
			},
			Data: [
				{
					id: 202201001,
					name: '毛概总结.docx',
					time: 202201011832,
					status: 0
				},
				{
					id: 202201002,
					name: '经济法全集.pdf',
					time: 202201021111,
					status: 1
				},
				{
					id: 202201003,
					name: '经济法全集.pdf',
					time: 202201021111,
					status: 2
				},
				{
					id: 202201004,
					name: '经济法全集.pdf',
					time: 202201021111,
					status: 3
				},
				{
					id: 202201005,
					name: '经济法全集.pdf',
					time: 202201021111,
					status: 4
				},
				{
					id: 202201006,
					name: '经济法全集.pdf',
					time: 202201021111,
					status: 5
				},
				{
					id: 202201007,
					name: '经济法全集.pdf',
					time: 202201021111,
					status: 6
				}
			]
		};
	},
	onLoad() {},
	methods: {}
};
</script>
<style>
.order-box .order-body {
	width: auto;
	height: 96rpx;
	display: flex;
}
.order-box .order-body image {
	width: 72rpx;
	height: 72rpx;
	margin: 5rpx 10rpx 5rpx 0rpx;
}

.info {
	margin-left: 12rpx;
	width: 412rpx;
	display: flex;
	flex-direction: column;
}
.info .name {
	font-size: 14px;
}
.info .time {
	font-size: 12px;
	color: #8F939C;
}
.tips {
	margin: 12rpx;
	text-align: center;
	font-size: 12px;
}

.tips text {
	width: 96rpx;
	display: inline-block;
	padding: 4rpx;
	background-color: #cccccc;
	color: #ffffff;
	border-radius: 6rpx;
}

.tips .tips-waring {
	background-color: #f3a73f;
}

.tips .tips-ok {
	background-color: #18bc37;
}

.tips .tips-error {
	background-color: #e43d33;
}

.tips .tips-running {
	background-color: #007AFF;
}
</style>
