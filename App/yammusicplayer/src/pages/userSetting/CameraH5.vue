<template>
  <view
    class="container"
    :style="{height:windowHeight+'px'}"
  >
    <!--appBar-->
    <view
      ref="appBar"
      class="appBar"
    >
      <font-awesome-icon
        @click="gotoBack"
        class="forwardicon"
        icon="angle-left"
      />
      <view class="appBarTitle">
        拍照摄像
      </view>
    </view>
    <!--/appBar-->
    <view
      class="mainContainer"
      :style="{height:mainContainerHeight+'px'}"
    >
      <video
        id="myVideo"
        ref="videoCamera"
        width="100%"
        height="95%"
        autoplay
      ></video>
      <view class="controlPanel">
        <view
          class="btnTakePhotos"
          @mouseover="btnTakePhotosMouseOver"
          @mousemove="btnTakePhotosMouseOver"
          @mouseout="btnTakePhotosMouseOut"
          @mouseleave="btnTakePhotosMouseOut"
          @click="btnTakePhotosClick"
        >
          <uni-icons
            class="Icon"
            :color="btnTakePhotosIconColor"
            type="camera-filled"
            size="30"
          ></uni-icons>
        </view>
      </view>
      <canvas
        canvas-id="canvasDom"
        id="canvasDom"
        style="display: none;"
        ref="canvasDom"
      />
    </view>
  </view>
</template>

<script>
import { ChangeUserFaceBase } from '../../api'
import store from '../../store'
export default {
  data() {
    return {
      windowHeight: 0,
      windowWidth: 0,
      videoWidth: 640,
      videoHeight: 480,
      mainContainerHeight: 0,
      controlPanelHeight: 0,
      btnTakePhotosIconColor: '#000',
      videoElement: null,
      mediaStream: null,
      currentLoginUser: null,
      userId: '',
      base64Image: ''
    };
  },
  onLoad(query) {
    this.resizeModel();
    this.openCamera();
  },
  onReady() {
    this.resizeModel();
    this.openCamera();
  },
  onShow() {
    this.resizeModel();
    this.openCamera();
  },
  onResize(res) {
    this.resizeModel();
  },
  mounted: function () {
    this.resizeModel();
    this.openCamera();
  },
  methods: {
    gotoBack() {
      uni.switchTab({
        url: `/pages/userSetting/index`
      });
    },
    btnTakePhotosMouseOver() {
      this.btnTakePhotosIconColor = '#fff';
    },
    btnTakePhotosMouseOut() {
      this.btnTakePhotosIconColor = '#000';
    },
    openCamera() {
      let that = this;
      //that.videoElement = this.$refs.videoCamera;
      if (navigator.mediaDevices.getUserMedia) {
        if (window.stream) {
          window.stream.getTracks().forEach(track => {
            track.stop();
          });
        }
        const constraints = { video: true }; // 设置限制，只开启视频
        navigator.mediaDevices.getUserMedia(constraints)
          .then(function (mediaStream) {
            const video = document.querySelector('video'); // 获取 video 元素
            that.videoElement = video;
            video.srcObject = mediaStream; // 将媒体流添加到 video 元素中
            that.mediaStream = mediaStream;
            video.onloadedmetadata = function (e) {
              video.play(); // 播放视频
            };
          }).catch(function (err0r) {
            console.log("获取摄像头错误：" + err0r);
            uni.showToast({
              title: `获取摄像头错误[${err0r}]`,
              position: 'center',
              icon: 'fail',
              duration: 7000
            });
          });
      }
    },
    // 关闭摄像头
    stopCamera() {
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop())
        this.stream = null
        this.videoElement.srcObject = null
      }
    },
    btnTakePhotosClick() {
      this.captureImage()
      this.stopCamera()
    },
    GetLoginUser() {
      let that = this;
      that.currentLoginUser = that.$store.state.user;
      if (that.currentLoginUser == null) {
        uni.showToast({
          title: `没有登录不能添加专辑`,
          position: 'center',
          icon: 'fail',
          duration: 2000
        });
        return false;
      } else {
        that.userId = that.currentLoginUser.userId;
      }
      return true;
    },
    ChangeUserFace() {
      let that = this;
      if (that.GetLoginUser()) {
        uni.showLoading({
          title: '保存中'
        });
        ChangeUserFaceBase({
          base64Image: that.base64Image,
          UserId: that.userId,
          beforeCallBack: () => {
            uni.showLoading({
              title: '保存中'
            });
          },
          responseCallBack: resData => {
            uni.hideLoading();
            if (resData != null && typeof (resData) != 'undefined') {
              console.log('ChangeUserFace resData', resData)
              if (resData.status == 200) {
                if (resData.data != null && typeof (resData.data) != 'undefined') {
                  const { result, status, msg } = resData.data
                  if (status != 0) {
                    uni.showToast({
                      title: `保存数据出错,原因[${msg}]`,
                      position: 'center',
                      icon: 'fail',
                      duration: 2000
                    });
                  }
                  else {
                    store.commit('updateUserFace', result);
                    that.gotoBack();
                  }
                }
              }
            }
          }

        })
      }
    },
    captureImage() {
      debugger;
      let that = this;
      let canvas = document.getElementById('canvasDom').children[0];
      if (canvas) {
        canvas.width = that.videoElement.videoWidth
        canvas.height = that.videoElement.videoHeight
        let ctx = canvas.getContext('2d')
        //ctx.drawImage(that.videoElement, 0, 0, canvas.width, canvas.height)
        ctx.drawImage(that.videoElement, 0, 0)
        // 转化成base64的编码格式
        const dataUrl = canvas.toDataURL('image/jpeg')
        console.log('captureImage dataUrl', dataUrl);
        that.base64Image = dataUrl;
        that.ChangeUserFace();
      }
    },
    resizeModel() {
      let that = this;
      uni.getSystemInfo({
        success: res => {
          that.windowHeight = res.windowHeight;
          that.windowWidth = res.windowWidth;
          const query = uni.createSelectorQuery().in(that);
          let appBar = query.select('.appBar');
          appBar.boundingClientRect(data => {
            if (data) {
              const appBarHeight = data.height;
              that.mainContainerHeight = that.windowHeight - appBarHeight;
            }
          }).exec();
        }
      });
    }
  }
}
</script>

<style scoped>
.controlPanel {
  width: 100%;
  height: 15%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 0px solid blue;
}
.controlPanel .btnTakePhotos {
  width: 85upx;
  height: 85upx;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 3upx solid #fff;
  background-color: #fff;
  border-radius: 15upx;
}
.controlPanel .btnTakePhotos:hover {
  background-color: #000;
}
#myVideo {
  width: 100%;
  height: 95%;
  object-fit: fill;
  border: 0px solid red;
}
.container {
  width: 100%;
  /*background: linear-gradient(180deg, #18a4fd, #ffffff);*/
  background-color: #000;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.appBar {
  width: 100%;
  height: 73upx;
  line-height: 73upx;
  background-color: transparent;
  border-bottom: 2px solid #ffffff;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.appBarTitle {
  width: 81%;
  height: 73upx;
  line-height: 73upx;
  text-align: center;
  color: #ffffff;
  font-size: 3.3vh;
  font-weight: 700;
  margin-left: 1%;
  border: 0px solid red;
}
.forwardicon {
  width: 43upx;
  height: 43upx;
  margin-left: 15upx;
  margin-bottom: 10upx;
  color: #ffffff;
  cursor: pointer;
}
.mainContainer {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
</style>
