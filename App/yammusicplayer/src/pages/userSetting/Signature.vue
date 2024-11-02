<template>
  <view class="container">
    <view class="signText">
      <textarea
        v-model="signature"
        placeholder="请输入签名"
        class="multi-line-text"
        maxlength="500"
      />
    </view>
    <view
      @click="saveData"
      class="btnSubmit"
    >
      保存签名
    </view>
  </view>
</template>

<script>
import { editSignature, GetUserInfoById } from '../../api';
export default {
  name: 'Signature',
  props: {
    userId: String
  },
  data() {
    return {
      signature: '',
      isLoadComplete: false,
      userInfo: null,
    }
  },
  onLoad(options) {
    this.loadData();
  },
  onReady() {
    this.loadData();
  },
  onShow() {
    this.loadData();
  },
  onResize(res) {
  },
  mounted: function () {
    this.loadData();
  },
  methods: {
    loadData() {
      let that = this;
      let UserId = that.userId;
      if (that.userId == null || that.userId == '' || typeof (that.userId) == 'undefined') {
        return false;
      }
      GetUserInfoById({
        parm: {
          UserId: UserId,
        },
        beforeCallBack: () => {
          uni.showToast({
            title: '加载签名数据',
            duration: 1500,
            icon: 'loading',
            mask: true,
          });
        },
        responseCallBack: (res) => {
          uni.hideToast();
          console.log('GetUserInfoById res', res);
          if (res != null && typeof (res) != 'undefined') {
            const { result, status, msg } = res;
            if (status == 0) {
              that.signature = result.signature;
              that.userInfo = result;
            } else {
              uni.showToast({
                title: `数据加载出错,原因[${msg}]`,
                position: 'center',
                icon: 'fail',
                duration: 2000
              });
            }
          }
        },
        errorCallback: (err) => {
          uni.showToast({
            title: `数据加载出错,原因[${err}]`,
            position: 'center',
            icon: 'fail',
            duration: 2000
          });
        }
      });
    },
    GetLoginUser() {
      let that = this;
      that.userInfo = that.$store.state.user;
      console.log('GetLoginUser that.userInfo', that.userInfo);
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
      if (that.signature === '') {
        uni.showToast({
          title: `签名不能为空`,
          position: 'center',
          icon: 'fail',
          duration: 2000
        });
        return false;
      }
      editSignature({
        parm: {
          userId: that.userInfo.userId,
          password: that.userInfo.passWord,
          signature: that.signature,
        },
        beforeCallBack: () => {
          uni.showToast({
            title: '保存签名数据',
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
                title: `签名修改成功`,
                position: 'center',
                icon: 'success',
                duration: 2000
              });
              that.loadData();
            } else {
              uni.showToast({
                title: `数据加载出错,原因[${msg}]`,
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
.container .signText {
  width: 96%;
  height: 65%;
  margin-top: 3%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  border-radius: 10upx;
  box-shadow: 2px 4px 1px 1px #8c838359;
}
.container .signText .multi-line-text {
  display: -webkit-box;
  overflow: auto;
  line-height: 2.5vh; /* 行高，根据需要调整 */
  border: 0px solid red;
  height: 255upx;
  font-size: 2.2vh;
  text-indent: 1%;
  color: #ccc;
  width: 96%; /* 文本框的宽度 */
}
.container .btnSubmit {
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