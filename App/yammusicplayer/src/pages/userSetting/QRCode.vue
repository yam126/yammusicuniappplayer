<template>
  <view class="container">
    <image
      class="qrImage"
      :src="qrCodeSrc"
      mode="scaleToFill"
    ></image>
  </view>
</template>

<script>
import QRCode from 'qrcode';
import { host } from '../../api';
export default {
  name: 'UserQRCode',
  props: {
    userId: String
  },
  data() {
    return {
      qrCodeSrc: '', // 存储二维码图片的路径
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
    // 生成二维码的方法
    async createQRCode(text) {
      try {
        // 生成二维码
        const img = await QRCode.toDataURL(text);
        // 二维码生成后的操作，例如显示在页面上
        this.qrCodeSrc = img;
      } catch (error) {
        console.error(error);
      }
    },
    GetLoginUser() {
      let that = this;
      that.userInfo = that.$store.state.user;
      console.log('GetLoginUser that.userInfo', that.userInfo);
      if (that.userInfo != null) {
        that.userId = that.userInfo.userId;
      }
    },
    loadData() {
      let that = this;
      let QRCodeObject = {
        Action: 'AddFriend',
        Value: that.userId,
      };
      let codeValue = JSON.stringify(QRCodeObject);
      uni.getSystemInfo({
        success: res => {
          switch (res.platform) {
            case 'windows':
              that.createQRCode(codeValue);
              break;
            default:
              that.qrCodeSrc = `${host}api/QRCode/UserQRCode?userId=${that.userId}`
              break;
          }
          console.log('that.qrCodeSrc', that.qrCodeSrc);
        }
      })
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
  justify-content: center;
  align-items: center;
  border: 0px solid red;
  background-color: #f2f2f2;
}
.container .qrImage {
  width: 356upx;
  height: 356upx;
}
</style>