<template>
	<view style="display: flex; flex-direction: column;">
		<view class="btn">
			<view style="btn-upload" @click="chooseFile">选择文件</view>
			<view style="btn-print" @click="printFile(chooseFileList)">上传打印</view>
		</view>
		<view class="fileList">
			<uni-card style="width: 75vw; margin: 30rpx auto;" v-for="(item, index) in chooseFileList">
				<view class="fileInfo">
					<image src="../../static/logo.png"></image>
					<view class="body">
						<text class="name">{{ item.name }}</text>
						<text class="size">文件大小: {{ sizeToView(item.size) }}</text>
					</view>
					<view class="status">
						<text>{{ item.status }}</text>
					</view>
				</view>
			</uni-card>
		</view>
	</view>
</template>

<script>
import utils from '/lib/utils.js';
import uploadcos from '/lib/cos.js';
import config from '/lib/config.js'

const to = promise => {
	return promise.then(res => [null, res]).catch(error => [error]);
};
export default {
	data() {
		return {
			chooseFileList: [],
			uploadStatus: false
		};
	},
	methods: {
		onload: () => {
			console.log(getApp())
		},
		async getOrderID(option) {
			let error, res;
			[error, res] = await to(uni.request({
				url: config.url + 'order/merge',
				method: 'POST',
				header: {
					'content-type': 'application/x-www-form-urlencoded',
				},
				data: {
					openid: getApp().globalData.openid,
					session: getApp().globalData.session,
					option: JSON.stringify(option)
				}
			}));
			if (error != null) {
				uni.showModal({
					title:"获取订单数据失败",
					content: error,
					showCancel: false
				})
				console.log("获取订单数据失败", error);
			} else if (res.data.code === 0) {
				res = res.data;
				return res.orderID;
			}else{
				uni.showModal({
					title:"获取订单数据失败",
					content: res.message,
					showCancel: false
				})
				console.log("获取订单数据失败", res);
			}
		},
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
			let info;
			for (let i in res.tempFiles) {
				info = res.tempFiles[i];
				info.status = '待上传';
				this.chooseFileList.push(info);
			}
		},
		async printFile(opt) {
			if (this.uploadStatus) return;
			this.uploadStatus = true;
			let openid = uni.getStorageSync('openid');
			let filePath;
			let res;
			console.log(opt.length)
			if (opt.length > 0){
				let list = [];
				for (let i in opt) {
					this.chooseFileList[i].status = '开始上传';
					this.chooseFileList[i].fid = await utils.UploadStart(this.chooseFileList[i].name, this.chooseFileList[i].path);
					console.log(uploadcos)
					uploadcos.uploadFile(this.chooseFileList[i].path, this.chooseFileList[i].name, async (status)=>{
						this.chooseFileList[i].status = status;
						if (status == "完成" || status == "失败"){
							if (status == "完成"){
								this.chooseFileList[i].pageNum = await utils.UploadComplete(this.chooseFileList[i].fid);//需要等待云端页数获取完成
							}
							let cnt = 0;
							for (i in this.chooseFileList){
								// 将道理这个方法多少有点蠢 找时间改下
								if (this.chooseFileList[i].status == "完成" || this.chooseFileList[i].status == "失败"){
									cnt++;
								}
							}
							if (cnt == this.chooseFileList.length){
								console.log('全部上传完成', status);
								this.goPay();
							}else{
								console.log('尚有未完成', status);
							}
						}
					});
				}
			}
			this.uploadStatus = false;
		},
		async goPay() {
			let fids = [];
			console.log(this.chooseFileList[0])
			for (let i in this.chooseFileList){
				fids.push(this.chooseFileList[i].fid);
			}
			console.log(fids)
			const that = this;
			let orderID = await this.getOrderID(fids);
			uni.navigateTo({
				url: '../order/pay?orderID=' + orderID,
				events: {
					payStatus: function(data){
						console.log(data);
					}
				},
				success: function(res){
					let printList = [];
					for (let i in that.chooseFileList){
						printList.push({
							name: that.chooseFileList[i].name,
							pages: that.chooseFileList[i].pageNum,
							num: 1
						})
					}
					res.eventChannel.emit('fileList', {
						data: printList
					})
				}
			});
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
		},
	}
};
</script>
<style>
.fileInfo {
	display: flex;
}

.fileInfo .body {
	display: flex;
	flex-grow: 1;
	flex-direction: column;
}

.fileInfo .status {
	display: flex;
	flex-grow: 1;
	flex-direction: row-reverse;
	align-items: center;
	text-align: center;
	font-size: 12px;
}

.fileInfo .status text {
	width: 96rpx;
	display: inline-block;
	padding: 4rpx;
	background-color: #007aff;
	color: #ffffff;
	border-radius: 6rpx;
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
