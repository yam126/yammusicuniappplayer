<template>
  <view
    class="content"
    :style="{height:windowHeight+'px',width:windowWidth+'px',background:`url(${backGroundImage})`,marginTop:statusBarHeight+'px'}"
  >
    <!--appBar-->
    <view
      ref="appBar"
      class="appBar"
    >
      <!--<font-awesome-icon
        @click="gotoBack"
        class="forwardicon"
        icon="angle-left"
      />-->
      <view
        @click="gotoBack"
        class="forwardiconContainer"
      >
        <image
          src="../../../static/angle-left.svg"
          class="forwardicon"
          style="transform: translateX(-1000upx);filter: drop-shadow(#ffffff 1000upx 0)"
          mode="scaleToFill"
        />
      </view>
      <view class="songNameTitle">
        登录页
      </view>
      <!--<font-awesome-icon
        class="appBarRightIcon"
        icon="ellipsis-v"
      />-->
    </view>
    <!--/appBar-->
    <!--Logo-->
    <image
      class="LogoHorizontal logoAnimation"
      src="../../../static/LogoHorizontal.png"
    />
    <!--/Logo-->
    <view class="mainContainer">
      <view class="tabContainer">
        <view
          @click="gotoLogin"
          class="tabActive"
        >登录账号</view>
        <view
          @click="gotoRegister"
          class="tabNormal"
        >注册账号</view>
      </view>
      <view class="controlContainer">
        <view class="userNameContainer">
          <easy-input
            prefixIcon="../../../static/person-fill.svg"
            v-model="userName"
            type="text"
            class="userName"
            placeholder="请输入用户名"
          />
        </view>
        <view class="passWordContainer">
          <easy-input
            prefixIcon="../../../static/lock-fill.svg"
            v-model="passWord"
            type="password"
            class="passWord"
            placeholder="请输入密码"
          ></easy-input>
        </view>
        <view
          @click="submitLoginClick"
          class="submitBtn"
        >登录账号</view>
      </view>
    </view>
  </view>
</template>

<script>
import Vue from 'vue';
import store from '../../../store';
import {
  host,
  Login as ApiLogin
} from '../../../api';
import {
  generateGUID
} from '../../../utils';
import backGroundImage from '@/static/LRBG.png'
import uniIcons from '../../../uni_modules/uni-icons/components/uni-icons/uni-icons.vue'
import easyInput from '../../../components/easyInput.vue';
export default Vue.extend({
  components: {
    'uni-icons': uniIcons,
    'easy-input': easyInput
  },
  data() {
    return {
      backGroundImage: backGroundImage,
      statusBarHeight: 0,
      windowHeight: 0,
      windowWidth: 0,
      deviceId: '',
      userName: '',
      passWord: ''
    }
  },
  // 页面周期函数--监听页面加载
  onLoad(options) {
    this.getScreenSize();
  },
  // 页面周期函数--监听页面初次渲染完成
  onReady() {
    this.getScreenSize();
  },
  // 页面周期函数--监听页面显示(not-nvue)
  onShow() {
    this.getScreenSize();
  },
  // 页面周期函数--监听页面隐藏
  onHide() { },
  // 页面周期函数--监听页面卸载
  onUnload() { },
  onResize(res) {
    console.log('onResize res', res);
    this.getScreenSize();
  },
  // 页面处理函数--监听用户下拉动作
  // onPullDownRefresh() { uni.stopPullDownRefresh(); },
  // 页面处理函数--监听用户上拉触底
  // onReachBottom() {},
  // 页面处理函数--监听页面滚动(not-nvue)
  // onPageScroll(event) {},
  // 页面处理函数--用户点击右上角分享
  // onShareAppMessage(options) {},
  mounted: function () {
    let _that = this;
    window.onresize = () => {
      return (() => {
        _that.getScreenSize();
      })()
    }
  },
  computed: {},
  methods: {
    checkInput() {
      let that = this;
      if (that.userName == '') {
        uni.showToast({
          title: `用户名不能为空`,
          position: 'center',
          icon: 'error',
          duration: 2000
        });
        return false;
      }
      if (that.passWord == '') {
        uni.showToast({
          title: `密码不能为空`,
          position: 'center',
          icon: 'error',
          duration: 2000
        });
        return false;
      }
      return true;
    },
    submitLoginClick() {
      let that = this;
      let guidStr = '';
      let guidAry = [];
      const systemInfo = uni.getSystemInfoSync();
      if (!that.checkInput())
        return false;
      const platform = systemInfo.platform;
      console.log('platform', platform);
      switch (platform) {
        case 'android':
          console.log('platform android');
          uni.getSystemInfo({
            success: function (info) {
              console.log('设备信息', info);
              that.deviceId = info.deviceId; // 这里获取的就是设备的deviceId
              console.log('设备deviceId：' + that.deviceId);
              that.submitLogin(that.deviceId);
            }
          });
          break;
        case 'ios':
          console.log('platform ios');
          uni.getSystemInfo({
            success: function (info) {
              console.log('设备信息', info);
              that.deviceId = info.deviceId; // 这里获取的就是设备的deviceId
              console.log('设备deviceId：' + that.deviceId);
              that.submitLogin(that.deviceId);
            }
          });
          break;
        case 'windows':
          guidStr = generateGUID();
          guidAry = guidStr.split('-');
          that.deviceId = guidAry[0];
          that.submitLogin(that.deviceId);
          break;
        default:
          guidStr = generateGUID();
          guidAry = guidStr.split('-');
          that.deviceId = guidAry[0];
          that.submitLogin(that.deviceId);
          break;
      }
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
    submitLogin(deviceId) {
      let that = this;
      ApiLogin({
        parm: {
          username: that.userName,
          password: that.passWord,
          deviceId: deviceId,
          deviceType: 3,
        },
        beforeCallBack: () => {
          uni.showLoading({
            title: '提交中'
          });
        },
        responseCallBack: resData => {
          uni.hideLoading();
          if (resData != null && typeof (resData) != 'undefined') {
            const {
              result,
              status,
              msg
            } = resData;
            if (status !== 0) {
              uni.showToast({
                title: `登录失败,原因[${msg}]`,
                position: 'center',
                icon: 'fail',
                duration: 2000
              });
            } else {
              uni.showModal({
                title: '提示',
                content: '登录成功',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定');
                    //TODO:登录成功后的
                    let localUserInfo = {
                      userId: result.userId,
                      userName: that.userName,
                      passWord: that.passWord,
                      token: result.token,
                      userFace: result.userFace,
                    };
                    that.SaveStorage(localUserInfo);
                    store.commit('login', localUserInfo);
                    that.gotoBack();
                  }
                }
              });
            }
          }
        },
        errorCallback: error => {
          console.log('error', error);
          uni.showToast({
            title: `登录失败,原因[${error}]`,
            position: 'center',
            icon: 'fail',
            duration: 2000
          });
        },
      });
    },
    gotoBack() {
      uni.switchTab({
        url: '/pages/index/index'
      })
    },
    gotoLogin() {
      uni.navigateTo({
        url: '/pages/NoAuth/Login/index'
      })
    },
    gotoRegister() {
      uni.navigateTo({
        url: '/pages/NoAuth/Register/index'
      })
    },
    getScreenSize() {
      let that = this;
      uni.getSystemInfo({
        success: res => {
          that.windowHeight = res.windowHeight - res.statusBarHeight;
          that.windowWidth = res.windowWidth;
          that.statusBarHeight = res.statusBarHeight;
          console.log('运行平台 platform ', res.platform);
          console.log('屏幕宽度 getSystemInfo that.windowWidth', that.windowWidth);
          console.log('屏幕高度 getSystemInfo that.windowHeight', that.windowHeight);
        }
      })
    }
  },
  watch: {}
})
</script>

<style scoped>
.submitBtn {
  width: 85%;
  height: 65upx;
  line-height: 65upx;
  font-size: 37upx;
  text-align: center;
  color: #fff;
  font-weight: 700;
  margin-top: 15%;
  border-radius: 10upx;
  cursor: pointer;
  background: linear-gradient(180deg, #08d4c4, #01ab9d);
}

.userNameContainer {
  width: 100%;
  height: 62upx;
  margin-top: 15%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 0px solid red;
}

.userName {
  width: 87%;
}

.passWordContainer {
  width: 100%;
  height: 62upx;
  margin-top: 15%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 0px solid red;
}

.passWord {
  width: 87%;
}

.LogoHorizontal {
  width: 76%;
  height: 135upx;
  filter: drop-shadow(4px 10px 8px rgba(69, 69, 72, 0.568));
}

.logoAnimation {
  animation-name: logoAnimation;
  animation-duration: 1s;
  animation-fill-mode: forwards;
}

@keyframes logoAnimation {
  from {
    margin-top: 25upx;
    opacity: 0;
  }

  to {
    margin-top: 0upx;
    opacity: 1;
  }
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background: url("../../../static/LRBG.png");
  background-size: 100%;
  background-repeat: repeat-x;
  background-position: center center;
}

.forwardicon {
  color: #fff;
  margin-top: 1%;
  cursor: pointer;
}

.forwardiconContainer {
  width: 55upx;
  height: 55upx;
  cursor: pointer;
  border: 0px solid red;
}

@media (max-width: 370px) {
  .appBarTitleContainer {
    width: 83%;
    height: 53upx;
    line-height: 53upx;
  }

  .appBar {
    height: 63upx;
  }

  .forwardicon {
    width: 35upx;
    height: 35upx;
    margin-top: 10upx;
    margin-left: 15upx;
    cursor: pointer;
  }

  .appBarRightIcon {
    width: 35upx;
    height: 35upx;
    margin-top: 10upx;
    margin-left: 15upx;
    cursor: pointer;
  }
}

.songNameTitle {
  border: 0px solid red;
  text-align: center;
  font-family: "Microsoft YaHei", "微软雅黑", sans-serif;
  font-size: 2.5vh;
  color: #fff;
  width: 88%;
  font-weight: 600;
}

.mainContainer {
  width: 87%;
  height: 735upx;
  border: 0px solid red;
  margin-top: 1%;
}

.mainContainer .tabContainer {
  width: 100%;
  height: 115upx;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-end;
  border: 0px solid red;
}

.mainContainer .tabContainer .tabActive {
  width: 50%;
  height: 115upx;
  line-height: 115upx;
  text-align: center;
  font-size: 35upx;
  color: #000;
  font-weight: 700;
  background-color: #fff;
  cursor: pointer;
  border-top-left-radius: 10upx;
  border-top-right-radius: 10upx;
}

.mainContainer .tabContainer .tabNormal {
  width: 50%;
  height: 95upx;
  line-height: 95upx;
  text-align: center;
  font-size: 35upx;
  color: #ccc;
  font-weight: 700;
  cursor: pointer;
  background-color: #f5f6f8;
  border-top-left-radius: 0upx;
  border-top-right-radius: 10upx;
}

.controlContainer {
  width: 100%;
  height: 620upx;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: #fff;
  border-bottom-left-radius: 10upx;
  border-bottom-right-radius: 10upx;
}

@font-face {
  font-family: uniiconsFont;
  src: url("/static/uniicons.ttf");
}

uni-text {
  font-family: uniiconsFont !important;
  text-decoration: none;
  text-align: center;
}
</style>