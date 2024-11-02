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
        导入歌曲
      </view>
    </view>
    <!--/appBar-->
    <view
      class="mainContainer"
      :style="{height:mainContainerHeight+'px'}"
    >
      <!--水波纹进度条-->
      <water-ripple-progress
        v-if="IsUploading==true"
        class="progress"
        :Height="WaterRippleProgressSetting.Height"
        :ControlHeight="WaterRippleProgressSetting.ControlHeight"
        :ProgressNum="ProgressNum"
      ></water-ripple-progress>
      <!--/水波纹进度条-->
      <!--上传按钮容器-->
      <view
        v-if="IsUploading==false"
        :style="{height:WaterRippleProgressSetting.Height}"
        class="UploadBtnContainer"
      >
        <view
          class="CenterContainer"
          :style="{height:WaterRippleProgressSetting.ControlHeight,width:WaterRippleProgressSetting.ControlHeight}"
          @mousemove="UploadBtnContainerMouseOver"
          @mouseover="UploadBtnContainerMouseOver"
          @mouseout="UploadBtnContainerMouseOut"
          @mouseleave="UploadBtnContainerMouseOut"
          @click="ChorseUploadFiles"
        >
          <uni-icons
            :color="IconColor"
            type="download-filled"
            :size="IconSize"
          ></uni-icons>
          <view class="Text">点击选择文件</view>
        </view>
      </view>
      <!--/上传按钮容器-->
      <view class="ProgressContainer">
        <progress
          class="progress"
          :percent="ItemProgressNum"
          :border-radius="'5%'"
          show-info
          :stroke-width="7"
        />
      </view>
      <view class="PanelContainer PanelContainerAnimation">
        <view class="Center">
          <scroll-view
            class="ScrollView"
            scroll-y="true"
          >
            <view
              v-for="(item,index) in LogMessage"
              :key="index"
              class="Line"
            >{{item}}</view>
          </scroll-view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import WaterRippleProgress from '../../components/WaterRippleProgress.vue';
import { UploadSongFileUniap } from '../../api';
import { formatDateTime, removeTrailingZeros } from '../../utils';
export default {
  components: {
    'water-ripple-progress': WaterRippleProgress
  },
  data() {
    return {
      windowHeight: 0,
      windowWidth: 0,
      mainContainerHeight: 0,
      PanelContainerHeight: 0,
      IsUploading: false,
      ProgressNum: 0,
      ItemProgressNum: 0,
      IconSize: 89,
      IconColor: '#3aa6a0',
      UploadFilePaths: [],
      UploadFiles: [],
      MaxFileSize: 20,//上传文件最大限制
      currentLoginUser: null,
      userId: '',
      timeHandle: null,
      curFileIndex: 0,
      AlbumId: '',
      LogMessage: [],
      CallBack: '',
      WaterRippleProgressSetting: {
        Height: '579upx',
        ControlHeight: '380upx'
      }
    }
  },
  onLoad(query) {
    let that = this;
    if (query.AlbumId != null && typeof (query.AlbumId) != 'undefined')
      that.AlbumId = removeTrailingZeros(query.AlbumId);
    if (query.CallBack != null && typeof (query.CallBack) != 'undefined')
      that.CallBack = query.CallBack;
    that.resizeModel();
  },
  onReady() {
    this.resizeModel();
  },
  onResize(res) {
    this.resizeModel();
  },
  mounted: function () {
    this.resizeModel();
  },
  methods: {
    GetLoginUser() {
      let that = this;
      that.currentLoginUser = that.$store.state.user;
      if (that.currentLoginUser == null) {
        uni.showToast({
          title: `没有登录不能导入歌曲`,
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
    ChorseUploadFiles() {
      let that = this;
      let checkMessage = '';
      if (!that.GetLoginUser())
        return false;
      uni.chooseFile({
        extension: ['.mp3', '.MP3'],
        success: function (res) {
          console.log('ChorseUploadFiles res', res)
          //#region 验证选择文件的大小
          for (var i = 0; i < res.tempFilePaths.length; i++) {
            let itemFile = res.tempFiles[i];
            if (itemFile.size / 1024 / 1024 > that.MaxFileSize) {
              checkMessage += `文件[${itemFile.name}]超过最大限制${MaxFileSize}MB\r\n`;
            }
          }
          //#endregion
          if (checkMessage != '') {
            uni.showToast({
              title: `验证文件大小出错,原因:${checkMessage}`,
              position: 'center',
              icon: 'fail',
              duration: 2000
            });
            return false;
          }
          that.UploadFilePaths = res.tempFilePaths;
          that.UploadFiles = res.tempFiles;
          that.InitUploadFile();
          that.BatchUploadFile();
        }
      });
    },
    InitUploadFile() {
      let that = this;
      that.curFileIndex = 0;
      that.IsUploading = true;
      that.ProgressNum = 0;
      that.ItemProgressNum = 0;
      that.LogMessage = [];
    },
    BatchUploadFile() {
      let that = this;
      let itemFilePath = that.UploadFilePaths[that.curFileIndex];
      let itemFile = that.UploadFiles[that.curFileIndex];
      let timeStamp = '';
      uni.showToast({
        title: `正在上传第[${that.curFileIndex}]/[${that.UploadFiles.length}]个文件`,
        position: 'center',
        icon: 'loading',
        duration: 2000
      });
      that.timeHandle = setTimeout(() => {
        clearTimeout(that.timeHandle);
        UploadSongFileUniap({
          parm: {
            userid: that.userId,
            albumId: removeTrailingZeros(that.AlbumId)
          },
          filePath: itemFilePath,
          beforeCallBack: () => { },
          responseCallBack: res => {
            console.log('BatchUploadFile res', res);
            if (res != null && typeof (res) != 'undefined') {
              const { status, msg } = JSON.parse(res);
              if (status !== 0) {
                timeStamp = formatDateTime(new Date(), "yyyy-MM-dd HH:mm:ss")
                let itemErrorMsg = `[${timeStamp}]上传文件[${itemFile.name}]报错,原因:${msg}`;
                that.LogMessage.push(itemErrorMsg);
              } else {
                timeStamp = formatDateTime(new Date(), "yyyy-MM-dd HH:mm:ss")
                let itemErrorMsg = `[${timeStamp}]上传文件[${itemFile.name}]成功`;
                that.LogMessage.push(itemErrorMsg);
              }
            }
            that.ContinueBatchUpload();
          },
          errorCallback: error => {
            timeStamp = formatDateTime(new Date(), "yyyy-MM-dd HH:mm:ss")
            let itemErrorMsg = `[${timeStamp}]上传文件[${itemFile.name}]报错,原因:${error}`;
            that.LogMessage.push(itemErrorMsg);
            that.ContinueBatchUpload();
          },
          progressUpdate: progressValue => {
            that.ShowUploadProgressToast();
            console.log('BatchUploadFile progressValue', progressValue);
            that.ItemProgressNum = progressValue;
          }
        })
      }, 200);
    },
    ShowUploadProgressToast() {
      let that = this;
      uni.showToast({
        title: `正在上传第[${that.curFileIndex}]/[${that.UploadFiles.length}]个文件`,
        position: 'center',
        icon: 'loading',
        duration: 2000
      });
    },
    ContinueBatchUpload() {
      let that = this;
      that.curFileIndex += 1;
      that.ProgressNum = Math.round(
        (that.curFileIndex / that.UploadFiles.length) * 100
      );
      if (that.ProgressNum > 100)
        that.ProgressNum = 100
      if (that.curFileIndex < that.UploadFiles.length)
        that.BatchUploadFile();
      else {
        that.IsUploading = false;
        that.LogMessage.push('全部上传完成');
        clearTimeout(that.timeHandle);
      }
    },
    UploadBtnContainerMouseOver() {
      this.IconColor = '#fff';
    },
    UploadBtnContainerMouseOut() {
      this.IconColor = '#3aa6a0';
    },
    gotoAlbumEdit(Action, id) {
      let that = this;
      let gotoUrl = '/pages/albums/albumEdit';
      if (Action == null || typeof (Action) == 'undefined' || Action == '') {
        Action = 'Add';
      }
      if (id == null || typeof (id) == 'undefined' || id == '') {
        id = '';
      }
      id = removeTrailingZeros(id);
      gotoUrl += '?Action=' + Action + '&AlbumId=' + id;
      console.log('gotoAlbumEdit gotoUrl', gotoUrl);
      uni.navigateTo({
        url: gotoUrl
      });
    },
    gotoBack() {
      let that = this;
      switch (that.CallBack) {
        case 'albumEdit':
          that.gotoAlbumEdit('Edit', that.AlbumId);
          break;
        case 'albumInfo':
          uni.navigateTo({
            url: '/pages/albums/albumInfo?albumId=' + that.AlbumId
          });
          break;
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
.mainContainer {
  width: 100%;
}
.ProgressContainer {
  width: 100%;
  height: 35upx;
  margin-bottom: 3%;
}
.ProgressContainer .progress {
  width: 75%;
  margin-left: 12.5%;
  margin-bottom: 3%;
}
.UploadBtnContainer {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.UploadBtnContainer .CenterContainer {
  border-radius: 50%;
  background-color: #f9f9f9;
  overflow: hidden;
  display: flex;
  cursor: pointer;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 2px 13px 11px #254e8b70;
}
.UploadBtnContainer .CenterContainer:hover {
  background: linear-gradient(to top, #00c9ff, #92fe9d);
}
.UploadBtnContainer .CenterContainer .Text {
  width: 100%;
  height: 8vh;
  line-height: 8vh;
  font-size: 3.7vh;
  text-align: center;
  font-weight: 700;
  color: #3aa6a0;
  border: 0px solid red;
}
.UploadBtnContainer .CenterContainer:hover .Text {
  color: #fff;
}
.PanelContainer {
  width: 100%;
  height: 56%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-top-left-radius: 5%;
  border-top-right-radius: 5%;
  background-color: #ffffff80;
}
.PanelContainer .Center {
  width: 97%;
  height: 85%;
  border: 0px solid red;
}
.PanelContainer .Center .ScrollView {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border: 0px solid red;
}
.PanelContainer .Center .ScrollView .Line {
  width: 96%;
  min-height: 37upx;
  height: auto;
  margin-left: 2%;
  margin-top: 1%;
  font-size: 2.5vh;
  color: #18a4fd;
  overflow: hidden;
  font-weight: 700;
  text-align: left;
  text-indent: 1%;
  border: 0px solid blue;
}
.PanelContainer .Center .ScrollView .uni-scroll-view-content {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.PanelContainerAnimation {
  animation-name: PanelContainerAnimation;
  animation-duration: 1s;
  animation-fill-mode: forwards;
}
@keyframes PanelContainerAnimation {
  from {
    height: 0%;
  }
  to {
    height: 56%;
  }
}
.container {
  width: 100%;
  background: linear-gradient(180deg, #18a4fd, #ffffff);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.appBar {
  width: 100%;
  height: 73upx;
  line-height: 73upx;
  background-color: #35f2ee4d;
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
</style>