<template>
  <view
    class="container"
    :style="{height:windowHeight+'px',background:`url(${backGroundImage})`,marginTop:statusBarHeight+'px'}"
  >
    <!--appBar-->
    <view
      ref="appBar"
      class="appBar"
    >
      <view
        @click="gotoBack"
        class="forwardiconContainer"
      >
        <image
          src="../../static/angle-left.svg"
          class="forwardicon"
          style="transform: translateX(-1000upx);filter: drop-shadow(#ffffff 1000upx 0)"
          mode="scaleToFill"
        />
      </view>
      <view class="appBarTitle">
        {{ title }}
      </view>
    </view>
    <!--/appBar-->
    <view
      class="mainContainer"
      :style="{height:mainContainerHeight+'px'}"
    >
      <view class="mainPanel">
        <!--加载组件-->
        <view
          v-if="isLoading"
          class="loadContainer"
        >
          <uni-load-more
            :status="loadStatus"
            :iconSize="iconSize"
            iconType="circle"
            :showText="false"
          ></uni-load-more>
        </view>
        <!--/加载组件-->
        <!--数据项-->
        <view
          v-else
          class="dataContainer"
          :style="{backgroundImage:`url(${cover})`}"
        >
          <view
            id="DataPanel"
            ref="DataPanel"
            class="DataPanel"
          >
            <!--专辑信息-->
            <view
              id="songInfo"
              ref="songInfo"
              class="songInfo"
            >
              <view
                v-if="songId!=''"
                class="songName"
              >{{songName}}</view>
              <view
                v-if="songId!=''"
                class="artist"
              >歌手:{{ artist }}</view>
              <view
                v-if="songId!=''"
                class="artist"
              >时长:{{ maxDuration }}</view>
              <view
                v-if="songId!=''"
                class="artist"
              >文件大小:{{ fileSize }}</view>
              <view
                v-if="songId!=''"
                class="artist"
              >专辑名称:{{ albumName }}</view>
              <view
                v-if="albumId!=''"
                class="songName"
              >{{albumName}}</view>
              <view
                v-if="albumId!=''"
                class="artist"
              >专辑名称:{{ albumName }}</view>
              <view
                v-if="albumId!=''"
                class="artist"
              >专辑作者:{{ albumAuthor }}</view>
              <view
                v-if="albumId!=''"
                class="artist"
              >歌曲数量:{{ songLength }}</view>
              <view
                v-if="albumId!=''"
                class="artist"
              >专辑简介{{ albumIntro }}</view>
            </view>
            <!--/专辑信息-->
            <!--其他信息-->
            <view
              class="scrollViewPanel"
              :style="{height:scrollViewHeight+'px'}"
            >
              <scroll-view
                class="scrollView"
                scroll-y="true"
              >
                <!--用户信息-->
                <view class="userInfo">
                  <image
                    :src="createrUserFace"
                    class="userFace"
                    mode="scaleToFill"
                  />
                  <view class="info">
                    <view
                      class="line"
                      style="font-weight: 800"
                    >{{createrUserName}}</view>
                    <view class="line">注册时间:{{ createrRegistedTime }}</view>
                    <view class="line">{{createrSignature}}</view>
                  </view>
                </view>
                <!--/用户信息-->
                <!--二维码-->
                <image
                  class="QRCode"
                  :src="QRCodeSrc"
                  mode="scaleToFill"
                />
                <!--/二维码-->
              </scroll-view>
            </view>
            <!--/其他信息-->
          </view>
        </view>
        <!--/数据项-->
      </view>
    </view>
  </view>
</template>

<script>
import backGroundImage from '@/static/ShareBG.png'
import {
  removeTrailingZeros,
  convertBytes
} from '../../utils.js';
import {
  GetPlayerData,
  GetAlbumInfo,
  formatDuration,
  host
} from '../../api.js';
import QRCode from 'qrcode';
export default {
  data() {
    return {
      loadStatus: 'loading',
      iconSize: 35,
      isLoading: false,
      apiHost: host,
      QRCodeSrc: '',
      title: '分享歌曲',
      backGroundImage: backGroundImage,
      windowHeight: 0,
      windowWidth: 0,
      statusBarHeight: 0,
      mainContainerHeight: 0,
      scrollViewHeight: 0,
      songId: '',
      albumId: '',
      cover: '../../static/NoCover.png',
      createrUserFace: '../../static/userfaces/useface01.png',
      albumName: '',
      albumAuthor: '',
      songinfo: null,
      albuminfo: null,
      albumSongList: null,
      createrUser: null,
      createrUserID: '',
      createrUserName: '',
      createrRegistedTime: '',
      createrSignature: '',
      songName: '',
      artist: '',
      maxDuration: '',
      albumName: '',
      fileSize: ''
    }
  },
  onLoad(query) {
    let that = this;
    if (query.songId != null && typeof (query.songId) != 'undefined') {
      that.songId = removeTrailingZeros(query.songId);
      that.title = '分享歌曲';
    }
    else if (query.albumId != null && typeof (query.albumId) != 'undefined') {
      that.albumId = removeTrailingZeros(query.albumId);
      that.title = '分享专辑';
    }
    this.loadData();
    this.resizeModel();
  },
  onReady() {
    this.resizeModel();
  },
  onResize(res) {
    this.resizeModel();
  },
  mounted: function () {
    this.loadData();
    this.resizeModel();
  },
  methods: {
    gotoBack() {
      let that = this;
      if (that.songId != '') {
        uni.setStorageSync('playPageParms', {
          songId: that.songId
        });
        uni.switchTab({
          url: `/pages/playerPage/index?songId=${that.songId}`
        });
      } else if (that.albumId != '') {
        uni.setStorageSync('albumInfoId', {
          albumId: that.albumId
        });
        uni.navigateTo({
          url: '/pages/albums/albumInfo?albumId=' + that.albumId
        });
      }
    },
    resizeModel() {
      let that = this;
      uni.getSystemInfo({
        success: res => {
          that.windowHeight = res.windowHeight - res.statusBarHeight;
          that.windowWidth = res.windowWidth;
          that.statusBarHeight = res.statusBarHeight;
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
    },
    resizeDataPanel() {
      let that = this;
      let DataPanelHeight = 0;
      const query = uni.createSelectorQuery().in(that);
      query.select("#DataPanel").boundingClientRect(data => {
        console.log('DataPanel data', data)
        if (data) {
          DataPanelHeight = data.height;
          console.log('DataPanelHeight', DataPanelHeight)
        }
      }).exec();
      query.select("#songInfo").boundingClientRect(data => {
        if (data) {
          that.scrollViewHeight = DataPanelHeight - data.height - 35;
          console.log('that.scrollViewHeight', that.scrollViewHeight)
        }
      }).exec();
    },
    loadData() {
      let that = this;
      if (that.songId != '') {
        that.loadSongData();
      }
      else if (that.albumId != '') {
        that.loadAlbumData();
      }
    },
    loadAlbumData() {
      let that = this;
      GetAlbumInfo({
        parm: {
          albumId: that.albumId
        },
        beforeCallBack: () => {
          that.isLoading = true;
        },
        responseCallBack: res => {
          that.isLoading = false;
          that.$nextTick(() => {
            that.resizeDataPanel();
          });
          if (res != null && typeof (res) != 'undefined') {
            const {
              result,
              status,
              msg
            } = res;
            if (status == 0) {
              that.albumName = result.albumName;
              that.cover = result.albumCover;
              that.songLength = result.songLength;
              that.albumIntro = result.albumIntro;
              that.createrUserID = removeTrailingZeros(result.userid);
              that.createrUserFace = result.userFace;
              that.createrUserName = result.userName;
              that.createrRegistedTime = result.RegistedTime;
              that.createrSignature = result.Signature;
              that.$nextTick(() => {
                that.QRCodeSrc =
                  `${host}api/QRCode/AlbumQRCode?albumId=${that.albumId}`;
                console.log('that.QRCodeSrc', that.QRCodeSrc);
              })
            } else {
              uni.showToast({
                title: `读取数据出错,原因[${msg}]`,
                icon: 'fail',
                duration: 2000
              });
            }
          }
        }
      })
    },
    loadSongData() {
      let that = this;
      that.isLoading = true;
      GetPlayerData({
        parm: {
          albumId: 'null',
          songId: that.songId,
          userId: 'null',
        },
        beforeCallBack: () => {
          that.isLoading = true;
        },
        responseCallBack: res => {
          that.isLoading = false;
          that.$nextTick(() => {
            that.resizeDataPanel();
          });
          if (res != null && typeof (res) != 'undefined') {
            const {
              result,
              status,
              msg
            } = res;
            if (status == 0) {
              that.songinfo = result.songinfo;
              that.albuminfo = result.albuminfo;
              that.albumSongList = result.albumSongList;
              that.createrUser = result.creater;
              if (that.songinfo != null && typeof (that.songinfo) != 'undefined') {
                that.cover = that.songinfo.cover;
                that.songName = that.songinfo.title;
                that.artist = that.songinfo.artist;
                let duration = formatDuration(that.songinfo.duration);
                that.maxDuration =
                  `${duration.hour}时${duration.minute}分${duration.second}秒`
                that.fileSize = convertBytes(that.songinfo.fileSize)
              }
              if (that.albuminfo != null && typeof (that.albuminfo) != 'undefined') {
                that.albumName = that.albuminfo.albumName;
              }
              if (that.createrUser != null && typeof (that.createrUser) != 'undefined') {
                that.createrUserID = that.createrUser.userid;
                that.createrUserFace = that.createrUser.userface;
                that.createrUserName = that.createrUser.username;
                that.createrRegistedTime = that.createrUser.createdatetime;
                that.createrSignature = that.createrUser.signature;
              }
              that.$nextTick(() => {
                that.QRCodeSrc =
                  `${host}api/QRCode/MusicQRCode?songId=${that.songId}&userId=${that.createrUserID}`;
                console.log('that.QRCodeSrc', that.QRCodeSrc);
              })
            } else {
              uni.showToast({
                title: `读取数据出错,原因[${msg}]`,
                icon: 'fail',
                duration: 2000
              });
            }
          }
        },
        errorCallback: error => {
          that.isLoading = false;
          that.$nextTick(() => {
            that.resizeDataPanel();
          });
          uni.showToast({
            title: `读取数据出错,原因[${error}]`,
            icon: 'fail',
            duration: 2000
          });
        }
      })
    }
  }
}
</script>

<style scoped>
.mainContainer {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.mainContainer .mainPanel {
  width: 98%;
  height: 96%;
  border-radius: 15upx;
  margin-top: 2%;
  background-color: rgba(255, 255, 255, 0.2);
  /* 半透明背景 */
  backdrop-filter: blur(10px);
  /* 背景模糊 */
  -webkit-backdrop-filter: blur(10px);
  /* 兼容老版本 Safari */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.mainContainer .mainPanel .loadContainer {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.mainContainer .mainPanel .dataContainer {
  width: 100%;
  height: 100%;
  display: flex;
  background-repeat: no-repeat;
  /* 背景图片不重复 */
  background-position: 50% 0%;
  /* 背景图片居中 */
  background-size: 100% 35%;
  /* 背景图片覆盖整个元素 */
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.mainContainer .mainPanel .dataContainer .DataPanel {
  width: 100%;
  height: 75%;
  margin-top: 50%;
  border-top-left-radius: 19upx;
  border-top-right-radius: 19upx;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: rgba(217, 225, 228, 0.553);
  /* 半透明背景 */
  /*backdrop-filter: blur(10px);*/
  /* 背景模糊 */
  /*-webkit-backdrop-filter: blur(10px);*/
  /* 兼容老版本 Safari */
}

.mainContainer .mainPanel .dataContainer .DataPanel .songInfo {
  width: 97%;
  min-height: 195upx;
  height: auto;
  border-radius: 19upx;
  margin-top: 15upx;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: rgb(18, 134, 177);
  box-shadow: 2px 4px 1px 1px #8c838359;
}

.mainContainer .mainPanel .dataContainer .DataPanel .songInfo .songName {
  width: 98%;
  min-height: 55upx;
  height: auto;
  margin-top: 2%;
  overflow: hidden;
  font-size: 35upx;
  color: #000;
  text-align: left;
  text-indent: 1%;
  font-weight: 800;
  border: 0px solid red;
}

.mainContainer .mainPanel .dataContainer .DataPanel .songInfo .artist {
  width: 98%;
  min-height: 37upx;
  height: auto;
  margin-top: 1%;
  margin-bottom: 1%;
  overflow: hidden;
  font-size: 27upx;
  color: #000;
  text-align: left;
  text-indent: 1%;
  border: 0px solid red;
}

.mainContainer .mainPanel .dataContainer .DataPanel .scrollViewPanel {
  width: 98%;
  margin-top: 15upx;
  border: 0px solid red;
}

.mainContainer
  .mainPanel
  .dataContainer
  .DataPanel
  .scrollViewPanel
  .scrollView {
  width: 100%;
  height: 100%;
  border: 0px solid blue;
}

.mainContainer
  .mainPanel
  .dataContainer
  .DataPanel
  .scrollViewPanel
  .scrollView
  .QRCode {
  width: 95%;
  height: 85%;
  margin-top: 3%;
  margin-left: 2.5%;
}

.mainContainer
  .mainPanel
  .dataContainer
  .DataPanel
  .scrollViewPanel
  .scrollView
  .userInfo {
  width: 96%;
  min-height: 159upx;
  height: auto;
  overflow: hidden;
  margin-left: 2%;
  margin-top: 2%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  border-bottom: 2upx dashed #6d6565;
}

.mainContainer
  .mainPanel
  .dataContainer
  .DataPanel
  .scrollViewPanel
  .scrollView
  .userInfo
  .userFace {
  width: 139upx;
  height: 139upx;
  margin-top: 10upx;
  margin-left: 2%;
  border-radius: 50%;
}

.mainContainer
  .mainPanel
  .dataContainer
  .DataPanel
  .scrollViewPanel
  .scrollView
  .userInfo
  .info {
  width: 75%;
  min-height: 139upx;
  height: auto;
  overflow: hidden;
  margin-top: 10upx;
  margin-bottom: 10upx;
  margin-left: 2%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 0px solid red;
}

.mainContainer
  .mainPanel
  .dataContainer
  .DataPanel
  .scrollViewPanel
  .scrollView
  .userInfo
  .info
  .line {
  width: 98%;
  min-height: 30upx;
  height: auto;
  font-size: 21upx;
  color: #000;
  margin-top: 2%;
  margin-bottom: 2%;
  border: 0px solid red;
}

.forwardiconContainer {
  width: 55upx;
  height: 55upx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.container {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-size: 100%;
  background-repeat: repeat-x;
  background-position: center center;
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