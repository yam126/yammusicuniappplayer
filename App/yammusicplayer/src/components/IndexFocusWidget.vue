<template>
  <view class="swiper">
    <view
      v-if="isLoading"
      class="swiperContainer"
    >
      <uni-load-more
        :status="loadStatus"
        :iconSize="iconSize"
        iconType="circle"
        :showText="false"
      ></uni-load-more>
    </view>
    <view
      v-if="isError"
      class="errorContainer"
      @click="loadData"
    >
      加载焦点图出错,点击刷新
    </view>
    <swiper
      v-if="!isLoading&&!isError"
      class="swiper"
      :indicator-dots="indicatorDots"
      :autoplay="autoplay"
      :circular="circular"
    >
      <swiper-item
        v-for="(item,index) in focusImageData"
        :key="index"
        @click="gotoPlayPage(item.focusImageID)"
        class="swiper-item"
      >
        <image
          class="swiper-item-image"
          :src="item.focusImageURL"
          mode="scaleToFill"
        />
        <view class="swiper-item-title">{{ item.focusImageName }}</view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
import {
  focusImage
} from '../api'
export default {
  name: "IndexFocusWidget",
  data() {
    return {
      loadStatus: 'loading',
      iconSize: 35,
      focusImageData: [],
      isLoading: true,
      isError: false,
      autoplay: true,
      circular: true,
      indicatorDots: true
    }
  },
  onLoad() {
    this.loadData();
  },
  mounted: function () {
    let that = this;
    this.loadData();
    uni.$on('onReachTop', () => {
      console.log('触发顶部');
      that.loadData();
    });
  },
  methods: {
    gotoPlayPage(songId) {
      console.log('gotoPlayPage songId', songId)
      // 在当前页面的某个方法或事件中
      uni.setStorageSync('playPageParms', { songId: songId });
      uni.switchTab({
        url: `/pages/playerPage/index?songId=${songId}`
      });
    },
    loadData() {
      let that = this;
      focusImage({
        parm: null,
        beforeCallBack: () => {
          that.isLoading = true
        },
        responseCallBack: resData => {
          that.isLoading = false;
          console.log('focusImage resData', resData);
          if (resData != null && typeof (resData) != 'undefined') {
            const {
              result,
              status,
              msg
            } = resData;
            if (status !== 0) {
              that.isError = true;
              uni.showToast({
                title: `获取焦点图失败,原因[${msg}]`,
                position: 'center',
                icon: 'fail',
                duration: 2000
              });
              return false;
            }
            that.isError = false;
            that.focusImageData = result;
          }
        },
        errorCallback: error => {
          console.log('focusImage error', error)
          uni.showToast({
            title: `获取焦点图失败,原因[${error}]`,
            position: 'center',
            icon: 'fail',
            duration: 2000
          });
        }
      });
    }
  }
}
</script>

<style scoped>
.errorContainer {
  width: 100%;
  height: 100%;
  line-height: 15vh;
  font-size: 3vh;
  color: #ccc;
  cursor: pointer;
  text-align: center;
}

.swiperContainer {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.swiper {
  width: 100%;
  height: 230rpx;
  margin-top: 7rpx;
}

.swiper-item {
  width: 100%;
  height: 230rpx;
  position: relative;
  border: 0px solid red;
  overflow: hidden;
}

.swiper-item-title {
  width: 98%;
  height: 32rpx;
  line-height: 32rpx;
  position: absolute;
  top: 198rpx;
  left: 5rpx;
  z-index: 500;
  font-family: "Microsoft YaHei", "微软雅黑", sans-serif;
  font-size: 21rpx;
  color: #ffffff;
  text-align: left;
  text-indent: 3%;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-bottom-left-radius: 10rpx;
  border-bottom-right-radius: 10rpx;
  background-color: #afa8a885;
}

.swiper-item-image {
  width: 98%;
  height: 100%;
  margin-left: 1%;
  cursor: pointer;
  border-radius: 10rpx;
  border: 0px solid red;
}
</style>