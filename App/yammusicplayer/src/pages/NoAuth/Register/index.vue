<template>
  <view
    class="content"
    :style="{height:windowHeight+'px',width:windowWidth+'px',marginTop:statusBarHeight+'px',background:`url(${backGroundImage})`}"
  >
    <!--appBar-->
    <view
      ref="appBar"
      class="appBar"
    >
      <image
        src="../../../static/angle-left.svg"
        class="forwardicon"
        @click="gotoBack"
        style="transform: translateX(-1000upx);filter: drop-shadow(#ffffff 1000upx 0)"
        mode="scaleToFill"
      />
      <view class="songNameTitle">
        注册账号
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
          class="tabNormal"
        >登录账号</view>
        <view
          @click="gotoRegister"
          class="tabActive"
        >注册账号</view>
      </view>
      <view class="controlContainer">
        <view class="inputContainer">
          <scroll-view
            class="scrollView"
            scroll-y="true"
            scroll-x="false"
          >
            <view class="userNameContainer">
              <!--<uni-easyinput
                prefixIcon="person-filled"
                type="text"
                class="userName"
                v-model="userName"
                errorMessage
                placeholder="请输入用户名"
                placeholderStyle="color:red"
              />-->
              <easy-input
                prefixIcon="../../../static/person-fill.svg"
                v-model="userName"
                type="text"
                class="userName"
                errorMessage
                placeholder="请输入用户名"
                placeholderStyle="color:red"
              />
            </view>
            <view class="passWordContainer">
              <!--<uni-easyinput
                prefixIcon="locked-filled"
                type="password"
                class="passWord"
                v-model="passWord"
                errorMessage
                placeholder="请输入密码"
                placeholderStyle="color:red"
              ></uni-easyinput>-->
              <easy-input
                prefixIcon="../../../static/lock-fill.svg"
                v-model="passWord"
                type="password"
                class="passWord"
                errorMessage
                placeholder="请输入密码"
                placeholderStyle="color:red"
              ></easy-input>
            </view>
            <view class="passWordContainer">
              <easy-input
                prefixIcon="../../../static/lock-fill.svg"
                v-model="rePassWord"
                type="password"
                class="passWord"
                errorMessage
                placeholder="请再次输入密码"
                placeholderStyle="color:red"
              ></easy-input>
            </view>
            <view class="userNameContainer">
              <easy-input
                prefixIcon="../../../static/envelope-fill.svg"
                type="text"
                class="userName"
                v-model="email"
                placeholder="请输入电子邮件"
              />
            </view>
            <view class="userNameContainer">
              <easy-input
                prefixIcon="../../../static/wechat.svg"
                type="text"
                class="userName"
                v-model="weChart"
                placeholder="请输微信号"
              />
            </view>
            <view class="userNameContainer">
              <easy-input
                prefixIcon="../../../static/bag-check-fill.svg"
                type="text"
                class="userName"
                v-model="checkCode"
                placeholder="请输入验证码"
              />
            </view>
            <view class="verifyContainerLine">
              <view class="verifyContainer">
                <view class="title">点击刷新验证码</view>
                <image
                  @click="GetCheckCodeImage"
                  class="checkImage"
                  :src="checkCodeImageUrl"
                  mode="scaleToFill"
                />
              </view>
            </view>
          </scroll-view>
        </view>
        <view
          @click="submitClick"
          class="submitBtn"
        >注册账号</view>
      </view>
    </view>
  </view>
</template>

<script>
import Vue from 'vue';
import {
  host,
  Register
} from '../../../api';
import backGroundImage from '@/static/LRBG.png';
import easyInput from '../../../components/easyInput.vue';
export default Vue.extend({
  components: {
    'easy-input': easyInput
  },
  data() {
    return {
      backGroundImage: backGroundImage,
      statusBarHeight: 0,
      windowHeight: 0,
      windowWidth: 0,
      checkCodeImageUrl: '',
      userName: '',
      passWord: '',
      rePassWord: '',
      email: '',
      weChart: '',
      checkCode: '',
      checkCodeArgs: {
        CodeLength: 5,
        refreshNum: 5,
        FontSize: '35'
      }
    }
  },
  // 页面周期函数--监听页面加载
  onLoad(options) {
    this.getScreenSize();
    this.GetCheckCodeImage();
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
    errorMessageAlert(message) {
      uni.showToast({
        title: message,
        position: 'center',
        icon: 'fail',
        duration: 2000
      });
    },
    checkInput() {
      let that = this;
      let emailRegex = /^[A-Za-z0-9._%-]+@([A-Za-z0-9-]+.)+[A-Za-z]{2,4}$/;
      let emailRegex1 = /^w+([-+.]w+)*@w+([-.]w+)*.w+([-.]w+)*$/;
      if (that.userName === '') {
        errorMessageAlert('请输入用户名')
        return false;
      }
      if (that.passWord === '') {
        errorMessageAlert('请输入密码')
        return false;
      }
      if (that.rePassWord === '') {
        errorMessageAlert('请再次输入密码')
        return false;
      }
      if (that.rePassWord !== that.passWord) {
        errorMessageAlert('两次输入的密码不一致')
        return false;
      }
      if (that.checkCode === '') {
        errorMessageAlert('请输入验证码')
        return false;
      }
      if (that.email !== '') {
        if (!emailRegex.test(that.email) && emailRegex1.test(that.email)) {
          errorMessageAlert('电子邮件地址格式不正确')
          return false;
        }
      }
      return true;
    },
    submitClick() {
      let that = this;
      if (!that.checkInput())
        return false;
      Register({
        dataObj: {
          userId: 0,
          userName: that.userName,
          passWord: that.passWord,
          rePassWord: that.rePassWord,
          email: that.email,
          weChart: that.weChart,
          checkCode: that.checkCode,
        },
        beforeCallBack: () => {
          uni.showLoading({
            title: '提交中'
          });
        },
        responseCallBack: resData => {
          uni.hideLoading();
          console.log('response data', resData);
          if (resData != null && typeof (resData) != 'undefined') {
            const {
              status,
              msg
            } = resData;
            if (status !== 0) {
              uni.showToast({
                title: `注册失败,原因[${msg}]`,
                position: 'center',
                icon: 'fail',
                duration: 2000
              });
            } else {
              uni.showModal({
                title: '提示',
                content: '注册成功',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定');
                    that.gotoLogin();
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
    GetCheckCodeImage() {
      let that = this;
      let result = `${host}api/NoAuth/VerifyCode`;
      let Width = 0;
      let Height = 0;
      let FontSize = that.checkCodeArgs.FontSize;
      try {
        const query = uni.createSelectorQuery().in(that);
        let checkImage = query.select('.checkImage');
        checkImage.boundingClientRect(data => {
          console.log('checkImage data', data);
          Width = parseInt(data.width, 10);
          Height = parseInt(data.height, 10);
          console.log('GetCheckCodeImage Width', Width);
          console.log('GetCheckCodeImage Height', Height);
          result += `?CodeLength=${that.checkCodeArgs.CodeLength}`;
          result +=
            `&refreshNum=${that.checkCodeArgs.refreshNum + new Date().getUTCMilliseconds().toString()}`;
          result += `&Width=${Width}`;
          result += `&Height=${Height}`;
          result += `&FontSize=${FontSize}`;
          that.checkCodeImageUrl = result;
          console.log('that.checkCodeImageUrl', that.checkCodeImageUrl);
        }).exec();

      } catch (e) {
        console.log('error', e);
      }
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
          console.log('状态栏高度 statusBarHeight', res.statusBarHeight)
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
.mustInput {
  color: red;
}

.submitBtn {
  width: 85%;
  height: 65upx;
  line-height: 65upx;
  font-size: 37upx;
  text-align: center;
  color: #fff;
  font-weight: 700;
  margin-top: 3%;
  border-radius: 10upx;
  cursor: pointer;
  background: linear-gradient(180deg, #08d4c4, #01ab9d);
}

.verifyContainerLine {
  width: 100%;
  height: 217upx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.verifyContainer {
  width: 85%;
  height: 172upx;
  margin-top: 3%;
  margin-bottom: 3%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border-top-left-radius: 15upx;
  border-top-right-radius: 15upx;
  border: 1px solid #ccc;
}

.verifyContainer .title {
  width: 91%;
  height: 35upx;
  line-height: 35upx;
  font-size: 21upx;
  font-weight: 700;
  color: #ccc;
  text-align: center;
  margin-top: 2%;
  border-bottom: 1px solid #ccc;
}

.verifyContainer .checkImage {
  width: 91%;
  height: 115upx;
  cursor: pointer;
  margin-top: 1%;
}

.userNameContainer {
  width: 100%;
  height: 62upx;
  margin-top: 7%;
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
  margin-top: 7%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 0px solid red;
  overflow: hidden;
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
  cursor: pointer;
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
  border-top-left-radius: 10upx;
  border-top-right-radius: 0upx;
}

.controlContainer {
  width: 100%;
  height: 620upx;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border-bottom-left-radius: 10upx;
  border-bottom-right-radius: 10upx;
}

.controlContainer .inputContainer {
  width: 87%;
  height: 437upx;
  margin-top: 2%;
  border: 0px solid red;
}

.controlContainer .inputContainer .scrollView {
  width: 100%;
  height: 100%;
}
</style>