<template>
  <view class="RecentlyPlayed">
    <view class="title">
      最近播放
    </view>
    <view
      v-if="isLoading"
      class="loadContainer"
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
      加载出错,点击刷新
    </view>
    <view
      v-if="!isLoading&&!isError"
      class="listContainer"
    >
      <scroll-view
        class="scrollView"
        scroll-x="true"
      >
        <view
          v-for="(item,index) in recentlyData"
          :key="index"
          @click="gotoPlayPage(item.songId)"
          class="scrollView-item"
        >
          <image
            class="cover"
            :src="item.cover"
            mode="scaleToFill"
          />
          <view class="songName">{{ item.title }}</view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import { recentlylistened } from '../api'
export default {
  name: 'RecentlyPlayed',
  data() {
    return {
      loadStatus: 'loading',
      iconSize: 35,
      isLoading: true,
      isError: false,
      autoplay: true,
      circular: true,
      indicatorDots: true,
      recentlyData: []
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
      that.isLoading = true;
      that.loadData();
    });
  },
  methods: {
    gotoPlayPage(songId) {
      // 在当前页面的某个方法或事件中
      uni.setStorageSync('playPageParms', { songId: songId });
      uni.switchTab({
        url: `/pages/playerPage/index?songId=${songId}`
      });
    },
    loadData() {
      let that = this;
      recentlylistened({
        parm: { limit: 10, userId: '' },
        beforeCallBack: () => { that.isLoading = true },
        responseCallBack: resData => {
          that.isLoading = false;
          console.log('focusImage resData', resData);
          if (resData != null && typeof (resData) != 'undefined') {
            const { result, status, msg } = resData;
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
            that.recentlyData = result;
          }
        },
        errorCallback: error => {
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
.RecentlyPlayed {
  width: 100%;
  height: 255rpx;
  margin-top: 15rpx;
  background-color: #fff;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 2px 4px 1px 1px #8c838359;
}

.RecentlyPlayed .title {
  width: 96%;
  height: 43rpx;
  line-height: 43rpx;
  text-align: left;
  font-size: 26rpx;
  font-family: "Microsoft YaHei", "微软雅黑", sans-serif;
  font-weight: bold;
  border-bottom: 1px solid #ccc;
}

.RecentlyPlayed .errorContainer {
  width: 98%;
  height: 212rpx;
  line-height: 212rpx;
  font-size: 3vh;
  text-align: center;
  color: #ccc;
  cursor: pointer;
  font-weight: 700;
}

.RecentlyPlayed .loadContainer {
  width: 98%;
  height: 212rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 0px solid red;
}

.RecentlyPlayed .listContainer {
  width: 98%;
  height: 212rpx;
  border: 0px solid red;
}

.RecentlyPlayed .listContainer .scrollView {
  width: 100%;
  height: 198rpx;
  border: 0px solid green;
  white-space: nowrap;
  overflow: auto;
}

.RecentlyPlayed .listContainer .scrollView .scrollView-item {
  width: 182rpx;
  height: 172rpx;
  margin-top: 5rpx;
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border: 0px solid blue;
}

.RecentlyPlayed .listContainer .scrollView .scrollView-item .cover {
  width: 105rpx;
  height: 105rpx;
  margin-top: 12rpx;
  border-radius: 10rpx;
}

.RecentlyPlayed .listContainer .scrollView .scrollView-item .songName {
  width: 100%;
  height: 37rpx;
  line-height: 37rpx;
  font-size: 17rpx;
  margin-top: 19rpx;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border: 0px solid red;
}
</style>