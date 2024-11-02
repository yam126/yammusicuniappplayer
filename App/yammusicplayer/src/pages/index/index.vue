import { drawer } from '@dcloudio/uni-ui';
<template>
  <view
    class="content"
    :style="{marginTop:statusBarHeight+'px',height:windowHeight+'px'}"
  >
    <drawer-menu
      ref="drawerMenu"
      :currentRoute="currentRoute"
    />
    <!--appBar-->
    <view
      ref="appBar"
      class="appBar"
    >
      <!--<font-awesome-icon
        class="forwardicon"
        icon="bars"
        @click="showDrawer()"
      />-->
      <image
        class="forwardicon"
        @click="showDrawer()"
        src="/static/menuIcon.png"
        mode="scaleToFill"
      />
      <view class="appBarTitleContainer">YamMusicPlayer</view>
      <image
        @click="ScanCode"
        class="appBarRightIcon"
        src="/static/scanMini.png"
        mode="scaleToFill"
      />
    </view>
    <!--/appBar-->
    <uni-load-more
      iconType="circle"
      v-if="upLoading"
      :status="uploadingStatus"
    ></uni-load-more>
    <scroll-view
      scroll-y="true"
      class="mainContent"
      :style="{height:mainContentHeight+'px'}"
      @scroll="handleScroll"
      @scrolltolower="MonitorScrollToBottom"
    >
      <!--焦点图-->
      <focusWidget />
      <!--/焦点图-->
      <!--用户层-->
      <view class="userContainer">
        <view class="center">
          <!--头像-->
          <image
            class="userFace"
            :src="userFace"
            mode="FHD"
          />
          <!--/头像-->
          <!--内容层-->
          <view class="content">
            <view class="userContent">
              {{dateWelcome}}{{ userName }},现在是{{dataStr}}
            </view>
            <view class="timeClockContainer">
              <image
                class="timeItem"
                :src="timeAry[0]"
                mode="scaleToFill"
              />
              <image
                class="timeItem"
                :src="timeAry[1]"
                mode="scaleToFill"
              />
              :
              <image
                class="timeItem"
                :src="timeAry[2]"
                mode="scaleToFill"
              />
              <image
                class="timeItem"
                :src="timeAry[3]"
                mode="scaleToFill"
              />
              :
              <image
                class="timeItem"
                :src="timeAry[4]"
                mode="scaleToFill"
              />
              <image
                class="timeItem"
                :src="timeAry[5]"
                mode="scaleToFill"
              />
            </view>
          </view>
          <!--/内容层-->
        </view>
      </view>
      <!--/用户层-->
      <!--最近播放-->
      <recentlyPlayed />
      <!--/最近播放-->
      <!--常听专辑-->
      <view
        ref="albumTitle"
        class="RecentlylistenedAlbumTitleContainer"
        :class="isFixed?'navigation-fixed':''"
        :style="{top:fixedTop+'px'}"
      >
        <view class="center">
          <image
            class="icon"
            src="/static/iconsharp.png"
            mode="scaleToFill"
          />
          <view class="title">
            全部专辑
          </view>
        </view>
      </view>
      <!--/常听专辑-->
      <!--常听专辑列表-->
      <waterfall />
      <!--/常听专辑列表-->
    </scroll-view>
    <tabbar current="0"></tabbar>
  </view>
</template>

<script>
import DrawerMenu from '../../components/DrawerMenu.vue'
import tabbar from '../../components/tabbar.vue'
import FocusWidget from '../../components/IndexFocusWidget.vue';
import RecentlyPlayed from '../../components/RecentlyPlayed.vue';
import Waterfall from '../../components/Waterfall.vue'
import { ScanCodeResultProcessing } from '../../ScanCode.js'
export default {
  data() {
    return {
      autoplay: true,
      circular: true,
      indicatorDots: true,
      isFixed: false,
      navigationTop: 0,
      mainContentHeight: 0,
      windowHeight: 0,
      windowWidth: 0,
      statusBarHeight: 0,
      fixedTop: 0,
      waterfallColumnNum: 2,
      waterfallMinHeight: 335,
      waterfailMaxHeight: 537,
      clockTimeHandle: null,
      currentLoginUser: null,
      userName: '',
      currentRoute: '',
      userFace: '/static/userfaces/useface01.png',
      defaultUserFace: '/static/userfaces/useface01.png',
      userId: '',
      upLoading: false,
      uploadingStatus: 'loading',
      timeAry: [
        '/static/0.png',
        '/static/0.png',
        '/static/0.png',
        '/static/0.png',
        '/static/0.png',
        '/static/0.png',
      ],
      dateWelcome: '',
      dataStr: this.getDateStr(),
      title: 'Hello',
      recentlyData: [{
        id: 0,
        title: '测试歌曲标题11111',
        cover: 'http://192.168.3.82:5242/Mp3Cover/1748007496380977152.jpeg',
      },
      {
        id: 1,
        title: '测试歌曲标题2',
        cover: 'http://192.168.3.82:5242/Mp3Cover/1748007497848983552.jpeg',
      },
      {
        id: 2,
        title: '测试歌曲标题3',
        cover: 'http://192.168.3.82:5242/Mp3Cover/1748007506757685248.jpeg',
      },
      {
        id: 3,
        title: '测试歌曲标题4',
        cover: 'http://192.168.3.82:5242/Mp3Cover/1748007508905168896.jpeg',
      },
      {
        id: 4,
        title: '测试歌曲标题5',
        cover: 'http://192.168.3.82:5242/Mp3Cover/1748007508397658112.jpeg',
      },
      {
        id: 5,
        title: '测试歌曲标题6',
        cover: 'http://192.168.3.82:5242/Mp3Cover/1748007509106495488.jpeg',
      },
      {
        id: 6,
        title: '测试歌曲标题7',
        cover: 'http://192.168.3.82:5242/Mp3Cover/1748007511019098112.jpeg',
      },
      ],
      numberImage: {
        0: '/static/0.png',
        1: '/static/1.png',
        2: '/static/2.png',
        3: '/static/3.png',
        4: '/static/4.png',
        5: '/static/5.png',
        6: '/static/6.png',
        7: '/static/7.png',
        8: '/static/8.png',
        9: '/static/9.png',
      }
    }
  },
  //页面下拉刷新事件
  onPullDownRefresh() {
    this.MonitorScrollToTop();
  },
  onLoad() {
    let that = this;
    this.getScreenSize();
    uni.onWindowResize(res => {
      console.log('onWindowResize res', res);
      that.windowHeight = res.size.windowHeight;
      that.windowWidth = res.size.windowWidth;
      that.getScreenSize();
      console.log('屏幕宽度 that.windowWidth', that.windowWidth);
      console.log('屏幕高度 that.windowHeight', that.windowHeight);
    });
    that.getCurrentRoute();
    that.clockTime();
    that.dateStr = that.getDateStr();
  },
  onReady() {
    let that = this;
    console.log('onReady');
    that.$nextTick(() => {
      // 获取导航栏的位置
      const query = uni.createSelectorQuery().in(that);
      let RecentlylistenedAlbumTitle = query.select('.RecentlylistenedAlbumTitleContainer');
      RecentlylistenedAlbumTitle.boundingClientRect(data => {
        console.log('RecentlylistenedAlbumTitleContainer data', data);
        that.navigationTop = that.upxToPx(data.top);
        console.log('RecentlylistenedAlbumTitleContainer that.navigationTop', that.navigationTop);
      }).exec();
    });
    that.initWaterFall();
    that.clockTime();
    that.getCurrentRoute();
    that.dateStr = that.getDateStr();
  },
  onResize(res) {
    this.getScreenSize();
  },
  onShow() {
    let that = this;
    that.GetLoginUser();
    if (that.currentLoginUser != null) {
      that.closeDrawer();
    }
  },
  computed: {
    getFixedTop() {
      let that = this;
      return {
        top: that.isFixed ? `${that.fixedTop}px` : '0px'
      };
    }
  },
  mounted: function () {
    let that = this;
    console.log('mounted');
    this.getScreenSize();
    this.clockTime();
    this.dateStr = this.getDateStr();
    uni.$on('onDrawerMenuRefresh', () => {
      that.MonitorScrollToTop();
    });
  },
  methods: {
    //监控滚动条是否到顶部
    MonitorScrollToTop() {
      console.log('已经到达顶部');
      this.upLoading = true;
      let toTopHandle = setTimeout(() => {
        clearTimeout(toTopHandle)
        uni.$emit('onReachTop');
        this.GetLoginUser();
        let that = this;
        that.upLoading = false;
      }, 1000);
    },
    //监控滚动条是否到底部
    MonitorScrollToBottom() {
      // 到达底部的操作
      console.log('已经到达底部');
      uni.$emit('onReachBottom');
    },
    //扫码
    ScanCode() {
      let that = this;
      if (!that.GetLoginUser()) {
        uni.showToast({
          title: '没有登录不能扫码',
          icon: 'none'
        });
        return false;
      }
      uni.scanCode({
        success: (res) => {
          console.log('扫码结果：' + res.result);
          /*uni.showModal({
            title: '扫码结果',
            content: res.result,
            showCancel: false
          });*/
          ScanCodeResultProcessing(JSON.parse(res.result), that.currentLoginUser)
        },
        fail: (err) => {
          console.error('扫码失败：' + err);
          uni.showToast({
            title: '扫码失败',
            icon: 'none'
          });
        }
      });
    },
    getCurrentRoute() {
      let pages = getCurrentPages();
      let currentPage = pages[pages.length - 1];
      this.currentRoute = currentPage.route;
      console.log('getCurrentRoute', this.currentRoute);
    },
    getFixedTop() {
      let that = this;
      return {
        top: that.isFixed ? `${that.fixedTop}px` : '0px'
      };
    },
    upxToPx(upx) {
      const windowWidth = uni.getSystemInfoSync().windowWidth; // 获取设备屏幕宽度
      return upx * (windowWidth / 750); // 转换公式
    },
    GetLoginUser() {
      let that = this;
      that.currentLoginUser = that.$store.state.user;
      console.log('that.currentLoginUser', that.currentLoginUser);
      if (that.currentLoginUser != null && typeof (that.currentLoginUser) != 'undefined') {
        that.userName = that.currentLoginUser.userName;
        that.userFace = that.currentLoginUser.userFace;
        that.userId = that.currentLoginUser.userId;
        return true;
      }
      else {
        that.userName = '';
        that.userFace = that.defaultUserFace;
        that.userId = '';
      }
      return false;
    },
    showDrawer() {
      console.log('showDrawer');
      this.$refs.drawerMenu.showDrawer();
    },
    closeDrawer() {
      console.log('showDrawer');
      this.$refs.drawerMenu.closeDrawer();
    },
    pushTimeAry(timeNum, timeAry) {
      ////console.log('timeNum', timeNum);
      if (timeNum.toString().length < 2) {
        timeAry.push(0);
        timeAry.push(timeNum);
      } else {
        timeAry.push(parseInt(Array.from(timeNum.toString())[0]));
        timeAry.push(parseInt(Array.from(timeNum.toString())[1]));
      }
      return timeAry;
    },
    getDateStr() {
      let nowDate = new Date();
      let dateStr = `${nowDate.getFullYear()}年${nowDate.getMonth() + 1
        }月${nowDate.getDate()}日`;
      console.log('dateStr', dateStr);
      return dateStr;
    },
    getTimeAry() {
      let nowDate = new Date();
      let hour = nowDate.getHours();
      let minutes = nowDate.getMinutes();
      let second = nowDate.getSeconds();
      let timeAry = [];
      let returnAry = [];
      let dateWelcome = '';
      let numberImage = this.numberImage;
      ////console.log('hour', hour);
      timeAry = this.pushTimeAry(hour, timeAry);
      timeAry = this.pushTimeAry(minutes, timeAry);
      timeAry = this.pushTimeAry(second, timeAry);
      ////console.log('timeAry', timeAry);
      dateWelcome = hour <= 12 ? '上午好' : '下午好';
      if (hour >= 20)
        dateWelcome = '晚上好';
      for (let i = 0; i < timeAry.length; i++) {
        let itime = timeAry[i];
        returnAry.push(numberImage[itime]);
      }
      this.timeAry = returnAry;
      this.dateWelcome = dateWelcome;
    },
    clockTime() {
      let that = this;
      that.getTimeAry();
      that.clockTimeHandle = setTimeout(() => {
        that.getTimeAry();
        that.clockTime();
      }, 1000);
    },
    initWaterFall() {
      let that = this;
      let width = parseInt(100 / 2) - 5;
      for (var i = 0; i < that.recentlyData.length; i++) {
        let height = Math.floor(Math.random() * (that.waterfailMaxHeight - that.waterfallMinHeight + 1)) + that
          .waterfallMinHeight;
        that.recentlyData[i].width = width;
        that.recentlyData[i].height = height;
      }
    },
    onTouchMove(event) {
      if (this.upLoading) return;
      //const touch = event.touches[0];
      const scrollTop = event.detail.scrollTop;
      console.log('onTouchMove scrollTop', scrollTop);
      if (scrollTop === 0) {
        //this.upLoading = true;
        // 延迟执行下拉刷新
        let uploadingHandle = setTimeout(() => {
          clearTimeout(uploadingHandle)
          if (this.upLoading) return;
          this.MonitorScrollToTop();
        }, 100);
      }
    },
    handleScroll(event) {
      let that = this;
      that.onTouchMove(event)
      // 获取滚动条位置
      const scrollTop = event.detail.scrollTop.toFixed(2);
      //console.log('handleScroll albumTitle', JSON.stringify(that.$refs.albumTitle))
      console.log('handleScroll event', event)
      console.log('handleScroll that.navigationTop', that.navigationTop)
      console.log('handleScroll scrollTop', scrollTop)
      const query = uni.createSelectorQuery().in(that);
      let appBar = query.select('.appBar');
      appBar.boundingClientRect(data => {
        if (data) {
          that.fixedTop = data.height + that.statusBarHeight;
          // 判断导航栏是否需要固定
          if (scrollTop > that.navigationTop) {
            that.isFixed = true;
          } else {
            that.isFixed = false;
          }
          console.log('handleScroll that.isFixed', that.isFixed)
        }
      }).exec();
      //that.MonitorScrollToBottom(event);
    },
    resizeMode(platform) {
      let that = this;
      let appBarHeight = 0;
      console.log('that', that);
      try {
        const query = uni.createSelectorQuery().in(that);
        let appBar = query.select('.appBar');
        console.log('appBar', appBar);
        appBar.boundingClientRect(data => {
          // 3. 获取尺寸信息
          if (data) {
            // data.height 就是元素的高度
            const height = data.height;
            console.log('元素的高度:', parseInt(Math.round(height)));
            appBarHeight = parseInt(Math.round(height));
            that.mainContentHeight = that.windowHeight - appBarHeight - 1;
          }
        }).exec();
      } catch (e) {
        console.log('error', e);
      }
    },
    getScreenSize() {
      let that = this;
      uni.getSystemInfo({
        success: res => {
          that.windowHeight = res.windowHeight - res.statusBarHeight;
          that.windowWidth = res.windowWidth;
          that.statusBarHeight = res.statusBarHeight;
          that.resizeMode(res.platform);
          console.log('状态栏高度 statusBarHeight', res.statusBarHeight)
          console.log('运行平台 platform ', res.platform);
          console.log('屏幕宽度 getSystemInfo that.windowWidth', that.windowWidth);
          console.log('屏幕高度 getSystemInfo that.windowHeight', that.windowHeight);
        }
      })
    }
  },
  components: {
    'drawer-menu': DrawerMenu,
    'tabbar': tabbar,
    'focusWidget': FocusWidget,
    'recentlyPlayed': RecentlyPlayed,
    'waterfall': Waterfall
  }
}
</script>

<style>
.logo {
  height: 200rpx;
  width: 200rpx;
  margin: 200rpx auto 50rpx auto;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 12rpx;
  color: #8f8f94;
}

.userContainer {
  width: 98%;
  height: 165rpx;
  margin-top: 15rpx;
  margin-left: 1%;
  border-radius: 10rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  border: 1px solid #ccc;
  box-shadow: 2px 4px 1px 1px #8c838359;
}

.userContainer .center {
  width: 698rpx;
  height: 152rpx;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  border: 0rpx solid red;
}

.userContainer .center .userFace {
  width: 115rpx;
  height: 115rpx;
  margin-top: 23rpx;
  margin-left: 17rpx;
  border-radius: 55rpx;
  border: 0rpx solid red;
}

.userContainer .center .content {
  width: 537rpx;
  height: 135rpx;
  margin-top: 7rpx;
  margin-left: 8rpx;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: #fff;
  border: 0rpx solid red;
}

.userContainer .center .content .userContent {
  width: 100%;
  height: 37rpx;
  line-height: 37rpx;
  font-family: "Microsoft YaHei", "微软雅黑", sans-serif;
  font-size: 17rpx;
  text-align: left;
  text-indent: 7rpx;
  text-shadow: 2px 2px 3px #9c8989;
  border: 0rpx solid red;
}

.userContainer .center .content .timeClockContainer {
  width: 100%;
  height: 92rpx;
  line-height: 92rpx;
  font-family: "Microsoft YaHei", "微软雅黑", sans-serif;
  font-size: 17rpx;
  text-align: left;
  text-indent: 7rpx;
  text-shadow: 2px 2px 3px #9c8989;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  font-size: 43rpx;
  font-weight: bold;
  color: #000;
  border: 0rpx solid red;
}

.userContainer .center .content .timeClockContainer .timeItem {
  width: 51rpx;
  height: 73rpx;
  margin-top: 8rpx;
  margin-left: 25rpx;
}

*::-webkit-scrollbar {
  width: 7px;
  height: 7rpx;
  background-color: transparent;
}

.RecentlylistenedAlbumTitleContainer {
  width: 100%;
  height: 43upx;
  position: static;
  margin-top: 18upx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 0px solid red;
}

.RecentlylistenedAlbumTitleContainer .center {
  width: 98%;
  height: 42upx;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 15upx;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  box-shadow: 2px 4px 1px 1px #8c838359;
}

.RecentlylistenedAlbumTitleContainer .center .icon {
  width: 35upx;
  height: 35upx;
  margin-top: 3upx;
  margin-left: 9upx;
}

.RecentlylistenedAlbumTitleContainer .center .title {
  width: 185upx;
  height: 38upx;
  line-height: 38upx;
  font-size: 21upx;
  color: #8f8f94;
  text-align: left;
  text-indent: 3upx;
  font-weight: bold;
  border: 0px solid red;
  margin-top: 3upx;
  margin-left: 3upx;
}

.navigation-fixed {
  /* 吸顶固定样式 */
  position: fixed;
  top: 35upx;
  left: 0;
  right: 0;
  z-index: 99;
}
</style>