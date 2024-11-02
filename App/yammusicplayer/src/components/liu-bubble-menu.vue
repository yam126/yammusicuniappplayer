<template>
	<view class="select-main">
		<view @click.stop="showCard">
			<slot></slot>
		</view>
		<view class="card-main" v-show="show">
			<view class="card-item" :style="{top:top+'rpx'}">
				<view class="arrow"
					:style="{background:bgColor,left:(left>375 || isRight)?(width+left-50)+'rpx':(left+30)+'rpx',marginTop:'-10rpx',top: showTop && (arrowTop+12)+'rpx'}">
				</view>
				<view class="arrow-tip"
					:style="{width:width+'rpx',background:bgColor,left:left+'rpx',borderRadius:radius+'rpx',top: showTop && arrowTop+'rpx'}">
				</view>
				<view class="card"
					:style="'height:'+(dHeight?dHeight+'rpx':'auto')+';max-height:'+dMaxHeight+'rpx;background-color:'+bgColor+';border-radius:'+radius+'rpx;width:'+width+'rpx;left:'+left+'rpx;'">
					<!-- 此处气泡框样式可根据需求自行修改 -->
					<view class="card-list" v-for="(item,index) in dataList" :key="index" @click.stop="clickItem(item)">
						{{item}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			//所点击元素id
			elementId: {
				type: String,
				default: ''
			},
			//气泡框数据源
			dataList: {
				type: Array,
				default: () => {
					return []
				}
			},
			//当前页面是否含有navigationBar
			hasBar: {
				type: Boolean,
				default: true
			},
			//气泡框背景色
			bgColor: {
				type: String,
				default: '#FFFFFF'
			},
			//气泡框圆角(rpx)
			radius: {
				type: Number,
				default: 8
			},
			//气泡框宽度(rpx)，不传则默认取所点击元素的宽度
			dWidth: {
				type: Number,
				default: 0
			},
			//气泡框高度(rpx)，不传则默认由内容撑开
			dHeight: {
				type: Number,
				default: 0
			},
			//气泡框最大高度(rpx)，超出则内部滚动
			dMaxHeight: {
				type: Number,
				default: 400
			}
		},
		data() {
			return {
				show: false,
				width: 0,
				height: 0,
				left: 0,
				top: 0,
				bottom: 0,
				rectTop: 0,
				screenWidth: 0,
				showTop: false,
				arrowTop: 0,
				isRight: false
			}
		},
		mounted() {
			this.$nextTick(() => {
				if (!this.elementId) return
				// #ifdef APP-PLUS
				uni.createSelectorQuery().select('.select-main').boundingClientRect(res => {
					let difference = res.left
					uni.createSelectorQuery().select('#' + this.elementId).boundingClientRect(rect => {
						const systemInfo = uni.getSystemInfoSync()
						const windowHeight = systemInfo.windowHeight
						this.screenWidth = systemInfo.screenWidth
						if (!this.dWidth) {
							this.width = this.px2rpx(rect.width, this.screenWidth)
						} else {
							let screenW = this.px2rpx(this.screenWidth, this.screenWidth)
							this.width = this.dWidth > screenW ? screenW : this.dWidth
						}
						this.height = rect.height
						this.rectTop = rect.top
						this.bottom = windowHeight - rect.bottom
						let leftDifference = this.px2rpx((this.screenWidth - rect.left), this
							.screenWidth) - this.width
						if (this.width && leftDifference < 0) {
							this.isRight = true
							this.left = this.px2rpx(rect.right, this.screenWidth) - this.width
						} else {
							this.isRight = false
							this.left = this.px2rpx(rect.left - difference, this.screenWidth)
						}
					}).exec()
				}).exec()
				// #endif
				// #ifndef APP-PLUS
				this.createSelectorQuery().select('.select-main').boundingClientRect(res => {
					let difference = res.left
					uni.createSelectorQuery().select('#' + this.elementId).boundingClientRect(rect => {
						const systemInfo = uni.getSystemInfoSync()
						const windowHeight = systemInfo.windowHeight
						this.screenWidth = systemInfo.screenWidth
						if (!this.dWidth) {
							this.width = this.px2rpx(rect.width, this.screenWidth)
						} else {
							let screenW = this.px2rpx(this.screenWidth, this.screenWidth)
							this.width = this.dWidth > screenW ? screenW : this.dWidth
						}
						this.height = rect.height
						this.rectTop = rect.top
						this.bottom = windowHeight - rect.bottom
						let leftDifference = this.px2rpx((this.screenWidth - rect.left), this
							.screenWidth) - this.width
						if (this.width && leftDifference < 0) {
							this.isRight = true
							this.left = this.px2rpx(rect.right, this.screenWidth) - this.width
						} else {
							this.isRight = false
							this.left = this.px2rpx(rect.left - difference, this.screenWidth)
						}
					}).exec()
				}).exec()
				// #endif
			})
		},
		methods: {
			showCard() {
				if (!this.elementId) return
				else this.show = !this.show
				if (this.show) {
					this.$nextTick(res => {
						// #ifdef APP-PLUS
						let view = uni.createSelectorQuery().in(this).select(".card")
						view.boundingClientRect(res => {
							let arrHeight = res.height
							let height = this.bottom - arrHeight - 15
							if (height < 0) {
								this.showTop = true
								this.top = this.px2rpx((this.rectTop - arrHeight - 10), this
									.screenWidth)
								this.arrowTop = this.px2rpx(arrHeight - 5, this.screenWidth)
							} else {
								this.showTop = false
								this.top = this.px2rpx(this.rectTop + this.height + 10, this
									.screenWidth)
							}
						}).exec()
						// #endif
						// #ifndef APP-PLUS
						this.createSelectorQuery().select('.card').boundingClientRect(res => {
							let arrHeight = res.height
							let height = this.bottom - arrHeight - 15
							if (height < 0) {
								this.showTop = true
								if (this.hasBar) {
									// #ifdef H5
									this.top = this.px2rpx((this.rectTop - arrHeight + 35), this
										.screenWidth)
									// #endif
									// #ifndef H5
									this.top = this.px2rpx((this.rectTop - arrHeight - 10), this
										.screenWidth)
									// #endif
								} else {
									this.top = this.px2rpx((this.rectTop - arrHeight - 10), this
										.screenWidth)
								}
								this.arrowTop = this.px2rpx(arrHeight - 5, this.screenWidth)
							} else {
								this.showTop = false
								if (this.hasBar) {
									// #ifdef H5
									this.top = this.px2rpx(this.rectTop + this.height + 54, this
										.screenWidth)
									// #endif
									// #ifndef H5
									this.top = this.px2rpx(this.rectTop + this.height + 10, this
										.screenWidth)
									// #endif
								} else {
									this.top = this.px2rpx(this.rectTop + this.height + 10, this
										.screenWidth)
								}
							}
						}).exec()
						// #endif
					})
				}
			},
			px2rpx(px, screenWidth) {
				return px / (screenWidth / 750)
			},
			//点击选项
			clickItem(item) {
				this.show = false
				this.$emit('change', item)
			}
		}
	}
</script>

<style scoped>
	.select-main {
		position: relative;
		border: solid transparent 1px;
	}

	.card {
		position: absolute;
		box-sizing: border-box;
		z-index: 99999999 !important;
		overflow: auto;
		padding: 16rpx 20rpx;
		box-shadow: 0 2rpx 12rpx 0 rgba(0, 0, 0, 0.1);
	}

	.arrow {
		position: absolute;
		z-index: 999999999 !important;
		width: 20rpx;
		height: 20rpx;
		transform: rotate(135deg);
		box-shadow: -8rpx 6rpx 12rpx -4rpx rgba(0, 0, 0, 0.1);
	}

	.arrow-tip {
		position: absolute;
		z-index: 999999999 !important;
		height: 15rpx;
	}

	.card-item {
		position: fixed;
	}

	.card-list {
		line-height: 80rpx;
		color: #ccc;
	}
</style>