<template>
	<view style="display: flex; flex-direction: column;">
		<view class="btn">
			<view style="btn-upload" @click="chooseFile">上传文件</view>
			<view style="btn-print" @click="printFile(chooseFileList)">打印</view>
		</view>
		<view class="fileList">
			<uni-card style="width: 75vw; margin: 30rpx auto;" v-for="(item, index) in chooseFileList">
				<view class="fileInfo">
					<image src="../../static/logo.png"></image>
					<view class="body">
						<text class="name">{{ item.name }}</text>
						<text class="size">文件大小: {{ sizeToView(item.size) }}</text>
					</view>
				</view>
			</uni-card>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			chooseFileList: [
				{
					name: 'c++API.chm',
					path: 'http://tmp/MuI4fkN0NAUb9277923d4de619c05e72e0eefa9479f4.chm',
					size: 124881,
					time: 1378684550,
					type: 'file'
				},
				{
					name: '经济法总结.docx',
					path: 'http://tmp/MuI4fkN0NAUb9277923d4de619c05e72e0eefa9479f4.chm',
					size: 124881,
					time: 1378684550,
					type: 'file'
				}
			]
		};
	},
	methods: {
		sizeToView(size) {
			let res = '';
			if (size >= 1048576) {
				res = (size / 1048576).toFixed(2) + 'MB';
			} else if (size >= 1024) {
				res = (size / 1024).toFixed(2) + 'KB';
			} else {
				res = size + 'Byte';
			}
			return res;
		},
		fileUpload(res) {
			console.log('willup');
			console.log(res);
			console.log(this.chooseFileList);
			this.chooseFileList = this.chooseFileList.concat(res.tempFiles);
			console.log(this.chooseFileList);
		},
		printFile(opt) {
			for (let i in opt) console.log(opt[i].name);
		},
		chooseFile() {
			// #ifdef H5
			uni.chooseFile({
				count: 9, //默认100
				extension: [],
				success: this.fileUpload
			});
			// #endif

			// #ifdef MP-WEIXIN
			wx.chooseMessageFile({
				count: 9,
				type: 'all',
				success: this.fileUpload
			});
			// #endif
		}
	}
};
</script>

<style>
.fileInfo {
	width: 50vw;
	display: flex;
}

.fileInfo .body {
	display: flex;
	flex-direction: column;
}

.fileInfo image {
	width: 72rpx;
	height: 72rpx;
	margin: 5rpx 10rpx 5rpx 0rpx;
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
</style>
