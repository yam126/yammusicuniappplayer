<template>
  <uni-drawer
    ref="showLeft"
    mode="left"
    :mask="true"
    :maskClick="true"
    :width="210"
  >
    <!--菜单头部-->
    <view
      v-if="currentLoginUser===null"
      class="headerContainer"
    >
      <!--<image
        class="logo"
        src="../static/logo.png"
        mode="scaleToFill"
      />-->
      <view class="logo">
        <image
          model="scaleToFill"
          src="../static/logo.png"
        />
      </view>
      <image
        class="SplashTitle"
        src="../static/SplashTitle.png"
        mode="scaleToFill"
      />
      <view
        @click="gotoLoginPage"
        class="btnLogin"
      >
        登录或注册
      </view>
    </view>
    <view
      v-else
      class="headerContainer"
    >
      <view class="logo">
        <image
          :src="currentLoginUser.userFace"
          mode="scaleToFill"
        />
      </view>
      <view class="btnLogin">
        {{ currentLoginUser.userName }}
      </view>
    </view>
    <!--/菜单头部-->
    <scroll-view class="drawerMenuList">
      <!--菜单项-->
      <view
        @click="gotoHome"
        :class="menuClickIndex==0?'menuItemClick':'menuItem'"
      >
        <image
          v-if="menuClickIndex==0"
          src="../static/home.svg"
          class="icon"
          mode="scaleToFill"
          style="transform: translateX(-1000upx);filter: drop-shadow(#ffffff 1000upx 0);width: 31upx; height: 31upx; margin-left: 12upx;"
        />
        <image
          v-else
          src="../static/home.svg"
          class="icon"
          mode="scaleToFill"
          style="width: 31upx; height: 31upx; margin-left: 12upx;"
        />
        <view class="title">首页</view>
      </view>
      <!--/菜单项-->
      <!--菜单项-->
      <view
        @click="gotoMusicList"
        :class="menuClickIndex==1?'menuItemClick':'menuItem'"
      >
        <image
          v-if="menuClickIndex==1"
          src="../static/music-note-list.svg"
          class="icon"
          mode="scaleToFill"
          style="transform: translateX(-1000upx);filter: drop-shadow(#ffffff 1000upx 0);width: 31upx; height: 31upx; margin-left: 12upx;"
        />
        <image
          v-else
          src="../static/music-note-list.svg"
          class="icon"
          mode="scaleToFill"
          style="width: 31upx; height: 31upx; margin-left: 12upx;"
        />
        <view
          style="text-indent:3%;"
          class="title"
        >音乐列表</view>
      </view>
      <!--/菜单项-->
      <!--菜单项-->
      <view
        @click="gotoAlbumEdit"
        :class="menuClickIndex==2?'menuItemClick':'menuItem'"
      >
        <image
          v-if="menuClickIndex==2"
          src="../static/plus-circle-fill.svg"
          class="icon"
          mode="scaleToFill"
          style="transform: translateX(-1000upx);filter: drop-shadow(#ffffff 1000upx 0);width: 31upx; height: 31upx; margin-left: 12upx;"
        />
        <image
          v-else
          src="../static/plus-circle-fill.svg"
          class="icon"
          mode="scaleToFill"
          style="width: 31upx; height: 31upx; margin-left: 12upx;"
        />
        <view class="title">添加专辑</view>
      </view>
      <!--/菜单项-->
      <!--菜单项-->
      <view :class="menuClickIndex==3?'menuItemClick':'menuItem'">
        <image
          v-if="menuClickIndex==3"
          src="../static/albums.svg"
          class="icon"
          mode="scaleToFill"
          style="transform: translateX(-1000upx);filter: drop-shadow(#ffffff 1000upx 0);width: 51upx; height: 51upx; margin-left: 2upx;"
        />
        <image
          v-else
          src="../static/albums.svg"
          class="icon"
          mode="scaleToFill"
          style="width: 51upx; height: 51upx; margin-left: 2upx;"
        />
        <view
          style="text-indent:0%;"
          class="title"
        >专辑列表</view>
      </view>
      <!--/菜单项-->
      <!--菜单项-->
      <view
        @click="gotoAboutPage"
        :class="menuClickIndex==4?'menuItemClick':'menuItem'"
      >
        <image
          v-if="menuClickIndex==4"
          src="../static/exclamation-circle-fill.svg"
          class="icon"
          mode="scaleToFill"
          style="transform: translateX(-1000upx);filter: drop-shadow(#ffffff 1000upx 0);width: 31upx; height: 31upx; margin-left: 12upx;"
        />
        <image
          v-else
          src="../static/exclamation-circle-fill.svg"
          class="icon"
          mode="scaleToFill"
          style="width: 31upx; height: 31upx; margin-left: 12upx;"
        />
        <view class="title">关于程序</view>
      </view>
      <!--/菜单项-->
      <!--菜单项-->
      <view
        @click="Logout"
        class="menuItem"
      >
        <image
          src="../static/quit.svg"
          class="icon"
          mode="scaleToFill"
          style="width: 31upx; height: 31upx; margin-left: 12upx;"
        />
        <view
          style="text-indent:3%;"
          class="title"
        >退出登录</view>
      </view>
      <!--/菜单项-->
    </scroll-view>
  </uni-drawer>
</template>

<script>
import store from '../store';
import UniDrawer from '@dcloudio/uni-ui/lib/uni-drawer/uni-drawer.vue';
import UniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue'
import MusicListIcon from '../components/svg/musicList.vue';
export default {
  name: 'DrawerMenu',
  props: {
    currentRoute: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      windowHeight: 0,
      windowWidth: 0,
      listHeight: 0,
      menuClickIndex: 0,
      currentLoginUser: null
    }
  },
  onLoad() {
    let that = this;
    that.GetLoginUser();
    that.getCurrentRoute();
    that.changeMenuClickIndex();
    uni.getSystemInfo({
      success: res => {
        that.windowHeight = res.windowHeight;
        that.windowWidth = res.windowWidth;
        that.resizeMode();
      }
    });
  },
  onReady() {
    let that = this;
    that.GetLoginUser();
    that.changeMenuClickIndex();
    uni.getSystemInfo({
      success: res => {
        that.windowHeight = res.windowHeight;
        that.windowWidth = res.windowWidth;
        that.resizeMode();
      }
    });
  },
  onResize(res) {
    this.resizeMode();
  },
  methods: {
    gotoAboutPage() {
      uni.navigateTo({
        url: '/pages/about/index'
      });
    },
    changeMenuClickIndex() {
      let that = this;
      console.log('changeMenuClickIndex that.menuClickIndex', that.menuClickIndex);
      if (that.currentRoute.indexOf('pages/index/index') != -1)
        that.menuClickIndex = 0;
      else if (that.currentRoute.indexOf('pages/musicList/index') != -1)
        that.menuClickIndex = 1;
      else if (that.currentRoute.indexOf('pages/albums/index') != -1)
        that.menuClickIndex = 3;
    },
    gotoHome() {
      let gotoUrl = '/pages/index/index';
      uni.switchTab({ url: gotoUrl })
    },
    gotoMusicList() {
      let gotoUrl = '/pages/musicList/index';
      uni.switchTab({ url: gotoUrl })
    },
    gotoAlbumEdit() {
      let gotoUrl = '/pages/albums/albumEdit';
      gotoUrl += '?Action=Add';
      uni.navigateTo({
        url: gotoUrl
      });
    },
    SaveStorage(userInfo) {
      uni.setStorage({
        key: 'userInfo',
        data: userInfo,
        success: function () {
          console.log('数据保存成功！');
        }
      });
    },
    //退出登录
    Logout() {
      let that = this;
      that.GetLoginUser();
      if (that.currentLoginUser != null) {
        uni.showModal({
          title: '提示',
          content: '确定要退出登录吗?',
          showCancel: true,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定');
              store.commit('logout');
              that.SaveStorage(null);
              uni.$emit('onDrawerMenuRefresh');
              that.$refs['showLeft'].close();

            }
          }
        });
      }
    },
    //获取当前登录人信息
    GetLoginUser() {
      let that = this;
      that.currentLoginUser = that.$store.state.user;
      console.log('that.currentLoginUser', that.currentLoginUser);
    },
    // 关闭窗口
    closeDrawer() {
      this.$refs['showLeft'].close()
    },
    showDrawer() {
      this.$refs['showLeft'].open();
      this.GetLoginUser();
      this.changeMenuClickIndex();
    },
    resizeMode() {
      let that = this;
      const query = uni.createSelectorQuery().in(that);
      let headerContainer = query.select('.headerContainer');
      headerContainer.boundingClientRect(data => {
        if (data) {
          const height = data.height;
          let headerContainerHeight = parseInt(Math.round(height));
          console.log('headerContainerHeight', headerContainerHeight);
          that.listHeight = (that.windowHeight - headerContainerHeight) + 7;
          console.log('that.listHeight', that.listHeight);
        }
      }).exec();
    },
    gotoLoginPage() {
      uni.navigateTo({
        url: '/pages/NoAuth/Login/index' // 跳转到对应路径的页面
      });
    }
  },
  component: {
    'uni-drawer': UniDrawer,
    'music-list-icon': MusicListIcon,
    'uni-icons': UniIcons
  }
}
</script>

<style scoped>
.close {
  padding: 10px;
}
.drawerMenuList {
  width: 100%;
  height: 725upx;
  border: 0px solid red;
  margin-top: 7upx;
  overflow: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.drawerMenuList .menuItem {
  width: 98%;
  height: 67upx;
  margin-top: 5upx;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
  border: 0px solid red;
}
.drawerMenuList .menuItem .icon {
  width: 25upx;
  height: 25upx;
  margin-left: 12upx;
}
.drawerMenuList .menuItem .title {
  width: 75%;
  height: 51upx;
  line-height: 51upx;
  font-size: 28upx;
  font-weight: bold;
  color: #000;
  text-align: left;
  text-indent: 5%;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: 5upx;
  border: 0px solid red;
}
.drawerMenuList .menuItemClick {
  width: 98%;
  height: 67upx;
  margin-top: 5upx;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
  border: 0px solid red;
  border-radius: 10upx;
  background: linear-gradient(157deg, #ff9a9e, #fad0c4);
}
.drawerMenuList .menuItemClick .icon {
  width: 51upx;
  height: 51upx;
  fill: white;
  color: white;
  filter: drop-shadow(#ffffff 1000px 0);
  background-color: transparent;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: contain;
  mask-size: contain;
  margin-left: 12upx;
}
.drawerMenuList .menuItemClick .title {
  width: 75%;
  height: 51upx;
  line-height: 51upx;
  font-size: 28upx;
  font-weight: bold;
  color: #fff;
  text-align: left;
  text-indent: 5%;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: 5upx;
  border: 0px solid red;
}
.headerContainer {
  width: 100%;
  height: 325upx;
  border-bottom-left-radius: 17upx;
  border-bottom-right-radius: 17upx;
  background-color: #35f2ee;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.headerContainer .logo {
  width: 165upx;
  height: 165upx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.headerContainer .logo image {
  width: 95%;
  height: 95%;
}
.headerContainer .SplashTitle {
  width: 165upx;
  height: 35upx;
  margin-top: 7upx;
}
@media (max-width: 370px) {
  .headerContainer {
    justify-content: flex-start;
    height: 435upx;
  }
  .headerContainer .logo {
    width: 165upx;
    height: 165upx;
    margin-top: 21%;
    border: 0px solid red;
  }
  .headerContainer .SplashTitle {
    width: 165upx;
    height: 65upx;
    margin-top: -6%;
  }
}

.headerContainer .btnLogin {
  width: 185upx;
  height: 39upx;
  line-height: 39upx;
  margin-top: 12upx;
  background: linear-gradient(157deg, #89f7fe, #89f7fe);
  border: 1px solid #fff;
  border-radius: 15upx;
  font-size: 23upx;
  font-weight: bold;
  color: #fff;
  text-align: center;
  cursor: pointer;
}
</style>

