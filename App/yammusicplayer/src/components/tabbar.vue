<template>
  <view class="tabbar">
    <view
      class="tabbar-item"
      v-for="(item,index) in list"
      :key="index"
      @click="changeTab(index)"
    >
      <view
        class="select"
        v-if="current == index"
      >
        <view class="i-t position">
          <image
            class="img imgactive"
            mode="widthFix"
            :src="item.selectedIconPath"
            v-if="current == index"
          ></image>
          <image
            class="img"
            mode="widthFix"
            :src="item.iconPath"
            v-else
          ></image>
          <view
            class="text active"
            v-if="current == index"
          >{{item.text}}</view>
          <view
            class="text"
            v-else
          >{{item.text}}</view>
        </view>
      </view>
      <view v-else>
        <image
          class="img"
          mode="widthFix"
          :src="item.selectedIconPath"
          v-if="current == index"
        ></image>
        <image
          class="img"
          mode="widthFix"
          :src="item.iconPath"
          v-else
        ></image>
        <view
          class="text active"
          v-if="current == index"
        >{{item.text}}</view>
        <view
          class="text"
          v-else
        >{{item.text}}</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "tabbar",
  props: ['current'],
  data() {
    return {
      tabbarHegiht: 0,
      list: [
        {
          pagePath: "pages/index/index",
          iconPath: "/static/home.png",
          selectedIconPath: "/static/home-red.png",
          text: "首页"
        },
        {
          pagePath: "pages/musicList/index",
          iconPath: "/static/musicList.png",
          selectedIconPath: "/static/musicList-red.png",
          text: "音乐列表"
        },
        {
          pagePath: "pages/playerPage/index",
          iconPath: "/static/play.png",
          selectedIconPath: "/static/play-red.png",
          text: "音乐播放"
        },
        {
          pagePath: "pages/albums/index",
          iconPath: "/static/Album.png",
          selectedIconPath: "/static/Album-red.png",
          text: "专辑分类"
        },
        {
          pagePath: "pages/userSetting/index",
          iconPath: "/static/userSetting.png",
          selectedIconPath: "/static/userSetting-red.png",
          text: "用户设置"
        }
      ]

    }
  },
  onShow() {

  },
  onLoad(options) {

  },
  onReady() {

  },
  created() {
    uni.hideTabBar()
  },
  mounted: function () {
    let that = this;
    that.GetHeight(data => {
      that.tabbarHegiht = data;
    })
  },
  methods: {
    changeTab(e) {
      uni.switchTab({
        url: '/' + this.list[e].pagePath,
      })
    },
    GetTabBarHeight() {
      return this.tabbarHegiht;
    },
    GetHeight(callback) {
      let result = 0;
      let that = this;
      try {
        const query = uni.createSelectorQuery();
        let tabbar = query.select('.tabbar');
        tabbar.boundingClientRect(data => {
          if (data) {
            result = data.height;
            console.log('boundingClientRect GetHeight scrollHeight', result);
            callback(parseInt(result));
          }
          else
            callback(0);
        }).exec();
      } catch (e) {
        console.log('resizeModel exception', e);
      }
    }
  }


}
</script>

<style scoped>
.tabbar {
  font-size: 1.5vh;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 99;
  width: 100%;
  height: 5vh;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: #fff;
  padding: 20rpx 0;
}
.tabbar-item {
  height: 100%;
  padding: 0 15upx;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.img {
  height: 27upx;
  width: 27upx;
  margin: 0 4vw;
}
.text {
  text-align: center;
  color: #cacaca;
}
.i-t {
  font-size: 1.5vh;
  padding: 3upx 5upx;
  position: absolute;
  bottom: 1vh;
}
.select {
  width: 110upx;
  height: 110upx;
  border-radius: 15upx;
  /*background-color: #086d5b;*/
  background: linear-gradient(157deg, #84fab0, #8fd3f4);
  margin-bottom: 7upx;
  position: relative;
  cursor: pointer;
}
.imgactive {
  height: 61upx;
  width: 61upx;
  margin: 0 2.2vw;
}
.text.active {
  color: #fff;
  text-shadow: 2px 3px 2px #994e4e;
}
</style>