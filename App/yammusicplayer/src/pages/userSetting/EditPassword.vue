<template>
  <view class="container">
    <view class="inputContainer">
      <easy-input
        prefixIcon="../../static/lock-fill.svg"
        v-model="OldPassWord"
        type="password"
        class="passWord"
        placeholder="请输入旧密码"
      ></easy-input>
    </view>
    <view class="inputContainer">
      <easy-input
        prefixIcon="../../static/lock-fill.svg"
        v-model="NewPassWord"
        type="password"
        class="passWord"
        placeholder="请输入新密码"
      ></easy-input>
    </view>
    <view class="inputContainer">
      <easy-input
        prefixIcon="../../static/lock-fill.svg"
        v-model="RepeatPassWord"
        type="password"
        class="passWord"
        placeholder="请重新输入新密码"
      ></easy-input>
    </view>
    <view
      @click="saveData"
      class="btnSubmit"
    >
      保存修改
    </view>
  </view>
</template>

<script>
import { EditPasswordApi } from '../../api'
import easyInput from '../../components/easyInput.vue';
export default {
  name: 'EditPassword',
  props: {
    userId: String
  },
  components: {
    'easy-input':easyInput
  },
  data() {
    return {
      OldPassWord: '',
      NewPassWord: '',
      RepeatPassWord: '',
      userInfo: null
    };
  },
  methods: {
    GetLoginUser() {
      let that = this;
      that.userInfo = that.$store.state.user;
      console.log('GetLoginUser that.userInfo', that.userInfo);
    },
    gotoLoginPage() {
      uni.navigateTo({
        url: '/pages/NoAuth/Login/index' // 跳转到对应路径的页面
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
              that.$refs['showLeft'].close();
            }
          }
        });
      }
    },
    saveData() {
      let that = this;
      that.GetLoginUser();
      if (that.userInfo == null) {
        uni.showToast({
          title: `请先登录再修改`,
          position: 'center',
          icon: 'fail',
          duration: 2000
        });
        return false;
      }
      if (that.OldPassWord == '') {
        uni.showToast({
          title: `旧密码不能为空`,
          position: 'center',
          icon: 'fail',
          duration: 2000
        });
        return false;
      }
      if (that.NewPassWord == '') {
        uni.showToast({
          title: `新密码不能为空`,
          position: 'center',
          icon: 'fail',
          duration: 2000
        });
        return false;
      }
      if (that.RepeatPassWord == '') {
        uni.showToast({
          title: `重复密码不能为空`,
          position: 'center',
          icon: 'fail',
          duration: 2000
        });
        return false;
      }
      if (that.RepeatPassWord != that.NewPassWord) {
        uni.showToast({
          title: `两次输入的密码不一致`,
          position: 'center',
          icon: 'fail',
          duration: 2000
        });
        return false;
      }
      EditPasswordApi({
        parm: {
          userId: that.userInfo.userId,
          sourcePassword: that.OldPassWord,
          newPassword: that.NewPassWord,
          repartPassword: that.RepeatPassWord,
        },
        beforeCallBack: () => {
          uni.showToast({
            title: '保存密码数据',
            duration: 1500,
            icon: 'loading',
            mask: true,
          });
        },
        responseCallBack: res => {
          uni.hideToast();
          if (res != null && typeof (res) != 'undefined') {
            const { result, status, msg } = res;
            if (status == 0) {
              uni.showToast({
                title: ``,
                position: 'center',
                icon: 'success',
                duration: 2000
              });
              uni.showModal({
                title: '提示',
                content: '密码修改成功,确定要重新登录吗?',
                success: function (res) {
                  if (res.confirm) {
                    that.Logout();
                    that.gotoLoginPage();
                  }
                }
              });
            } else {
              uni.showToast({
                title: `密码修改出错,原因[${msg}]`,
                position: 'center',
                icon: 'fail',
                duration: 2000
              });
            }
          }
        }
      });
    }
  }
}
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border: 0px solid red;
  background-color: #f2f2f2;
}

.container .inputContainer {
  width: 96%;
  height: 87upx;
  margin-top: 2%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 0px solid red;
}
.passWord {
  width: 100%;
  padding: 30upx;
}
.passWord .uni-easyinput__content {
  height: 100% !important;
}
.btnSubmit {
  width: 96%;
  height: 55upx;
  line-height: 55upx;
  font-size: 2.5vh;
  text-align: center;
  color: #fff;
  font-weight: 800;
  cursor: pointer;
  margin-top: 3%;
  background: linear-gradient(to top, #08d4c4, #01ab9d);
  border-radius: 10upx;
  box-shadow: 2px 4px 1px 1px #8c838359;
}
</style>
