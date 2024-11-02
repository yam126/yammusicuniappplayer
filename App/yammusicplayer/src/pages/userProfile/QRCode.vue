<template>
  <view
    class="QRContainer"
    :style="{height:SelfHeight,width:SelfWidth}"
  >
    <image
      class="qrImage"
      :src="qrCodeSrc"
    ></image>
  </view>
</template>

<script>
import QRCode from 'qrcode';
import { host } from '../../api';
export default {
  name: 'QRCode',
  props: {
    SelfWidth: {
      type: String,
      default: ''
    },
    SelfHeight: {
      type: String,
      default: ''
    },
    UserId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      qrCodeSrc: '', // 存储二维码图片的路径
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
    loadData() {
      let that = this;
      let QRCodeObject = {
        Action: 'AddFriend',
        Value: that.UserId,
      };
      let codeValue = JSON.stringify(QRCodeObject);
      uni.getSystemInfo({
        success: res => {
          switch (res.platform) {
            case 'windows':
              that.createQRCode(codeValue);
              break;
            default:
              that.qrCodeSrc = `${host}api/QRCode/UserQRCode?userId=${that.UserId}`
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
.QRContainer {
  border-radius: 12upx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #cccccc67;
}
.QRContainer .qrImage {
  width: 56%;
  height: 56%;
}
</style>