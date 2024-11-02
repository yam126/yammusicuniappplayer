import { drawer } from '@dcloudio/uni-ui';
<template>
  <view
    class="content_splash"
    :style="{height:windowHeight+'px',width:windowWidth+'px',background:`url(${indexBackgroundImage})`,marginTop:statusBarHeight+'px'}"
  >
    <image
      class="logo logoAnimation"
      src="../../static/logo.png"
      mode="scaleToFill"
    />
    <image
      class="titleImage titleAnimation"
      src="../../static/SplashTitle.png"
      mode="scaleToFill"
    />
    <view
      class="gotoPage"
      @click="CheckLogin()"
      :style="{left:gotoPageLeft+'px'}"
    >跳过{{gotoPageScound}}</view>
  </view>
</template>

<script>
import {
  CheckLogin as ApiCheckLogin
} from '../../api';
import store from '../../store';
import indexBackgroundImage from "@/static/SplashBackGround.jpg";
export default {
  data() {
    return {
      indexBackgroundImage: indexBackgroundImage,
      statusBarHeight: 0,
      windowHeight: 0,
      windowWidth: 0,
      gotoPageLeft: 0,
      gotoPageScound: 6,
      countDownHandle: null,
      currentLoginUser: null
    };
  },
  onLoad(options) {
    this.getScreenSize();
    this.countDown();
  },
  onReady() {
    this.getScreenSize();
    this.countDown();
  },
  onResize(res) {
    console.log('onResize res', res);
    this.getScreenSize();
  },
  mounted: function () {
    var _that = this;
    window.onresize = () => {
      return (() => {
        _that.getScreenSize();
      })()
    }
    this.countDown();
  },
  computed: {},
  methods: {
    GetStorageUserInfo() {
      let that = this;
      uni.getStorage({
        key: 'userInfo',
        success: function (res) {
          //console.log('姓名:', res.data.name);
          //console.log('年龄:', res.data.age);
          if (res != null && typeof (res) != 'undefined') {
            if (res.data != null && typeof (res.data) != 'undefined') {
              that.currentLoginUser = res.data;
              that.VerifyLogin();
            }
            else {
              that.gotoHome();
            }
          }
        },
        fail: function (res) {
          console.log('GetStorageUserInfo res', res)
          that.gotoHome();
        },
      });
    },
    CheckLogin() {
      let that = this;
      debugger;
      that.GetLoginUser();
      if (that.currentLoginUser != null) {
        that.VerifyLogin();
        return false;
      } else if (that.currentLoginUser == null) {
        that.GetStorageUserInfo();
        return false;
      } else {
        that.gotoHome();
      }
    },
    VerifyLogin() {
      let that = this;
      let curUser = that.currentLoginUser;
      ApiCheckLogin({
        userInfo: {
          userId: curUser.userId,
          userName: curUser.userName,
          token: curUser.token
        },
        beforeCallBack: () => {
          uni.showLoading({
            title: '加载中'
          });
        },
        responseCallBack: resData => {
          uni.hideLoading();
          console.log('response data', resData);
          if (resData != null && typeof (resData) != 'undefined') {
            const {
              result,
              status,
              msg
            } = resData;
            if (status !== 0) {
              uni.showToast({
                title: `验证用户登录信息失败,原因[${msg}]`,
                position: 'center',
                icon: 'fail',
                duration: 2000
              });
            } else if (status == 0) {
              store.commit('login', curUser);
            } else if (result == false) {
              store.commit('logout');
            }
          }
          that.gotoHome();
        }
      });
    },
    GetLoginUser() {
      let that = this;
      that.currentLoginUser = that.$store.state.user;
      console.log('splash GetLoginUser that.currentLoginUser', that.currentLoginUser);
      if (that.currentLoginUser != null) {
        console.log('splash GetLoginUser that.currentLoginUser', that.currentLoginUser);
        that.userName = that.currentLoginUser.userName;
        that.userFace = that.currentLoginUser.userFace;
        that.userId = that.currentLoginUser.userId;
      }
    },
    gotoHome() {
      uni.switchTab({
        url: '/pages/index/index'
      });
    },
    countDown() {
      let that = this;
      that.countDownHandle = setTimeout(() => {
        clearTimeout(that.countDownHandle);
        if (that.gotoPageScound <= 0) {
          that.CheckLogin()
        } else {
          that.gotoPageScound = that.gotoPageScound - 1;
          that.countDown();
        }
      }, 1000);
    },
    resizeModel() {
      let that = this;
      try {
        const query = uni.createSelectorQuery().in(that);
        let gotoPage = query.select('.gotoPage');
        gotoPage.boundingClientRect(data => {
          if (data) {
            let gotoPageWidth = data.width + 10;
            console.log('resizeModel gotoPageWidth', gotoPageWidth);
            that.gotoPageLeft = that.windowWidth - gotoPageWidth;
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
          that.resizeModel();
          console.log('运行平台 platform ', res.platform);
          console.log('屏幕宽度 getSystemInfo that.windowWidth', that.windowWidth);
          console.log('屏幕高度 getSystemInfo that.windowHeight', that.windowHeight);
        }
      })
    }
  }
};
</script>

<style scoped>
.content_splash {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background: url("../../static/SplashBackGround.jpg");
  background-size: 100%;
  background-repeat: repeat-x;
  background-position: center center;
}

.gotoPage {
  position: absolute;
  width: 135upx;
  height: 63upx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 2vh;
  text-align: center;
  color: #fff;
  top: 10upx;
  left: 575upx;
  cursor: pointer;
  background-color: #cccccc8f;
  border-radius: 10upx;
}

.titleImage {
  width: 435upx;
  height: 95upx;
  margin-top: 55upx;
}

.logo {
  width: 355upx;
  height: 355upx;
  margin-top: 37upx;
}

@keyframes logoAnimation {
  from {
    margin-top: 37upx;
    opacity: 0;
  }

  to {
    margin-top: 257upx;
    opacity: 1;
  }
}

@keyframes titleAnimation {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.logoAnimation {
  animation-name: logoAnimation;
  animation-duration: 1s;
  animation-fill-mode: forwards;
}
</style>