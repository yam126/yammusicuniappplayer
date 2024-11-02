<template>
  <view
    class="container"
    :style="{marginTop:statusBarHeight+'px',height:windowHeight+'px',background:`url(${backGroundImage})`}"
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
          src="../../static/angle-left.svg"
          class="forwardicon"
          style="transform: translateX(-1000upx);filter: drop-shadow(#9f9898 1000upx 0)"
          mode="scaleToFill"
        />
      </view>
      <view class="appBarTitle">
        编辑专辑
      </view>
      <view
        @click="SaveData"
        class="forwardiconContainer"
      >
        <!--<font-awesome-icon
        class="forwardicon"
        icon="save"
        @click="SaveData()"
      />-->
        <image
          class="forwardicon"
          src="../../static/saveIcon.svg"
          style="transform: translateX(-1000upx);filter: drop-shadow(#9f9898 1000upx 0)"
        />
      </view>
    </view>
    <!--/appBar-->
    <!--专辑信息-->
    <view class="albumInfoContainer albumInfoAnimation">
      <!--专辑封面-->
      <view
        v-if="albumCover==''"
        @click="changeAlbumCover"
        class="albumCover"
      >
        <!--<uni-icons
          type="cloud-upload-filled"
          class="Icon"
          size="50"
          color="white"
        ></uni-icons>-->
        <image
          src="../../static/cloud-arrow-up-fill.svg"
          class="Icon"
          style="transform: translateX(-1000upx);filter: drop-shadow(#ffffff 1000upx 0)"
          mode="scaleToFill"
        />
      </view>
      <image
        @click="changeAlbumCover"
        v-if="albumCover!=''"
        class="albumCover"
        :src="albumCover"
        mode="scaleToFill"
      />
      <!--/专辑封面-->
      <view class="albumTipsContainer">
        <span class="tipsLarge">专辑封面</span><br />
        <span class="tipsNormal">点击图片修改专辑封面</span>
      </view>
    </view>
    <!--/专辑信息-->
    <!--主面板-->
    <view
      class="mainPanelContainer mainPanelAnimation"
      :style="{height:contentHeight+'px'}"
    >
      <view class="centerPanel">
        <!--标签层-->
        <view class="TabPanel">
          <!--专辑信息-->
          <view
            @click="changeTab('Left')"
            :class="tabActive=='Left'?'TabActive':'TabNormal'"
          >
            <view class="CenterPanel">
              <!--<uni-icons
                class="Icon"
                :color="tabLeftIconColor"
                type="compose"
                size="30"
              ></uni-icons>-->
              <image
                class="Icon"
                src="../../static/cassette-fill.svg"
                :style="{transform:'translateX(-1000upx)',filter:tabActive=='Left'?'drop-shadow(blue 1000upx 0)':'drop-shadow(gray 1000upx 0)'}"
              />
              <view class="Text">
                专辑信息
              </view>
            </view>
          </view>
          <!--/专辑信息-->
          <!--歌曲列表-->
          <view
            @click="changeTab('Right')"
            :class="tabActive=='Right'?'TabActive':'TabNormal'"
          >
            <view class="CenterPanel">
              <!--<uni-icons
                class="Icon"
                :color="tabRightIconColor"
                type="list"
                size="30"
              />-->
              <image
                class="Icon"
                src="../../static/music-note-list.svg"
                :style="{transform:'translateX(-1000upx)',filter:tabActive=='Right'?'drop-shadow(blue 1000upx 0)':'drop-shadow(gray 1000upx 0)'}"
              />
              <view class="Text">
                歌曲列表
              </view>
            </view>
          </view>
          <!--/专辑信息-->
        </view>
        <!--/标签层-->
        <view
          v-if="tabActive=='Left'"
          class="albumInfoEditContainer"
        >
          <!--专辑名称-->
          <view class="inputNormal">
            <easy-input
              class="inputNormalCenter"
              v-model="albumName"
              :styles="inputNormalStyle"
              placeholder="请输入专辑名称"
            ></easy-input>
          </view>
          <!--/专辑名称-->
          <!--专辑作者-->
          <view class="inputNormal">
            <easy-input
              class="inputNormalCenter"
              v-model="albumAuthor"
              :styles="inputNormalStyle"
              placeholder="请输入专辑作者"
            ></easy-input>
          </view>
          <!--/专辑作者-->
          <!--专辑简介-->
          <view class="albumBrief">
            <easy-input
              type="textarea"
              class="albumBriefCenter"
              v-model="albumBrief"
              :styles="inputNormalStyle"
              placeholder="请输入专辑简介"
            ></easy-input>
          </view>
          <!--/专辑简介-->
        </view>
        <!--TODO:歌曲列表-->
        <view
          v-if="tabActive=='Right'"
          class="albumInfoMusicList"
        >
          <view class="ControlPanel">
            <!--导入歌曲按钮-->
            <view
              @click="btnImportMusicClick"
              class="btnImportMusic"
            >
              <!--<uni-icons
                color="white"
                type="download-filled"
                size="18"
              ></uni-icons>-->
              <image
                class="Icon"
                src="../../static/save2-fill.svg"
                style="transform: translateX(-1000upx);filter: drop-shadow(#ffffff 1000upx 0)"
                mode="scaleToFill"
              />
              <view class="Text">导入歌曲</view>
            </view>
            <!--/导入歌曲按钮-->
            <!--<uni-icons
              color="grey"
              type="trash-filled"
              class="Icon"
              size="28"
            ></uni-icons>-->
            <image
              src="../../static/trash3-fill.svg"
              class="Icon"
              style="transform: translateX(-1000upx);filter: drop-shadow(gray 1000upx 0)"
            />
          </view>
          <album-music-list
            ref="MusicList"
            :albumId="AlbumId"
            :height="'15upx'"
          ></album-music-list>
        </view>
        <!--/TODO:歌曲列表-->
      </view>
    </view>
    <!--/主面板-->
  </view>
</template>

<script>
import { editAlbumApiUniApp, GetAlbumInfo } from '../../api'
import { removeTrailingZeros } from '../../utils'
import AlbumMusicList from "../../components/AlbumMusicList";
import backGroundImage from '@/static/PlayListBG.png'
import easyInput from '../../components/easyInput.vue'
export default {
  components: {
    'album-music-list': AlbumMusicList,
    'easy-input': easyInput
  },
  data() {
    return {
      backGroundImage: backGroundImage,
      AlbumId: '',
      Action: 'Add',
      windowHeight: 0,
      windowWidth: 0,
      contentHeight: 0,
      statusBarHeight: 0,
      tabLeftIconColor: 'blue',
      tabRightIconColor: 'gray',
      tabActive: 'Left',
      userId: '',
      albumCover: '',
      albumName: '',
      albumAuthor: '',
      albumBrief: '',
      currentLoginUser: null,
      CallBack: '',
      inputNormalStyle: {
        backGroundColor: '#ccc',
        color: '#755e5e'
      }
    }
  },
  onLoad(query) {
    let that = this;
    console.log('传递的参数', query);
    if (query.Action != null && typeof (query.Action) != 'undefined')
      that.Action = query.Action;
    if (query.AlbumId != null && typeof (query.AlbumId) != 'undefined')
      that.AlbumId = removeTrailingZeros(query.AlbumId);
    this.resizeModel();
    this.LoadData();
  },
  onReady() {
    this.resizeModel();
    this.LoadData();
  },
  onShow() {
    this.resizeModel();
    this.LoadData();
  },
  onResize(res) {
    this.resizeModel();
  },
  mounted: function () {
    this.resizeModel();
  },
  methods: {
    btnImportMusicClick() {
      let that = this;
      let gotoUrl = '';
      if (that.AlbumId == '') {
        uni.showToast({
          title: `没有添加专辑不能导入歌曲`,
          position: 'center',
          icon: 'fail',
          duration: 2000
        });
        return false;
      }
      uni.getSystemInfo({
        success: function (info) {
          switch (info.platform) {
            case 'windows':
              gotoUrl = `/pages/ImportSong/ImportSongH5?AlbumId=${that.AlbumId}&CallBack=albumEdit`;
              console.log('btnImportMusicClick that.AlbumId', that.AlbumId);
              console.log('btnImportMusicClick gotoUrl', gotoUrl);
              uni.navigateTo({
                url: gotoUrl
              });
              break;
            case "android":
              gotoUrl = `/pages/ImportSong/ImportAndroid?AlbumId=${that.AlbumId}&CallBack=albumEdit`;
              console.log('btnImportMusicClick that.AlbumId', that.AlbumId);
              console.log('btnImportMusicClick gotoUrl', gotoUrl);
              uni.navigateTo({
                url: gotoUrl
              });
              break;
          }
        }
      });
    },
    GetPrevRoute() {
      // 在当前页面的方法中获取上一页路径
      let pages = getCurrentPages();  // 获取当前页面栈
      let prevPage = pages[pages.length - 2];  // 获取上一页实例
      let prevRoute = prevPage.route;  // 获取上一页路径
      console.log(prevRoute);  // 打印上一页路径
    },
    LoadData() {
      let that = this;
      if (that.Action == 'Edit') {
        uni.showLoading({
          title: '加载中'
        });
        console.log('LoadData AlbumId', removeTrailingZeros(that.AlbumId));
        GetAlbumInfo({
          parm: {
            albumId: removeTrailingZeros(that.AlbumId)
          },
          beforeCallBack: () => {
            uni.showLoading({
              title: '加载中'
            });
          },
          responseCallBack: res => {
            uni.hideLoading();
            console.log('LoadData res', res);
            if (res != null && typeof (res) != 'undefined') {
              const { result, status, msg } = res;
              if (status == 0) {
                that.albumName = result.albumName;
                that.albumAuthor = result.albumAuthor;
                that.albumCover = result.albumCover;
                that.albumBrief = result.albumIntro;
              } else {
                uni.showToast({
                  title: `读取专辑信息出错[${msg}]`,
                  position: 'center',
                  icon: 'fail',
                  duration: 2000
                });
              }
            }
          }
        })
      }
    },
    changeAlbumCover() {
      let that = this;
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: function (chooseImageRes) {
          const tempFilePaths = chooseImageRes.tempFilePaths;
          console.log('changeAlbumCover tempFilePaths', tempFilePaths);
          that.albumCover = tempFilePaths[0];
        }
      });
    },
    changeTab(ActiveStr) {
      let that = this;
      switch (ActiveStr) {
        case 'Left':
          that.tabActive = 'Left';
          that.tabLeftIconColor = 'blue';
          that.tabRightIconColor = 'gray';
          break;
        case 'Right':
          that.tabActive = 'Right';
          that.tabLeftIconColor = 'gray';
          that.tabRightIconColor = 'blue';
          break;
      }
    },
    gotoBack() {
      let that = this;
      if (that.Action == 'Add' && that.AlbumId == '') {
        uni.switchTab({ url: '/pages/index/index' });
      }
      else if (that.Action == 'Edit' && that.AlbumId != '') {
        that.gotoAlbumInfo(that.AlbumId);
      }
      else if (that.Action == 'Add' && that.AlbumId != '') {
        that.gotoAlbumInfo(that.AlbumId);
      }
      else {
        // 假设当前在一个非tab页面，需要返回到上一个页面
        uni.navigateBack({
          delta: 1 // 返回的页面数，如果 delta 大于现有页面数，则返回到首页。
        });
      }
    },
    gotoAlbumInfo(albumId) {
      uni.setStorageSync('albumInfoId', { albumId: albumId });
      uni.navigateTo({
        url: '/pages/albums/albumInfo?albumId=' + albumId
      });
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
          let albumInfo = query.select('.albumInfoContainer');
          appBar.boundingClientRect(data => {
            if (data) {
              const appBarHeight = data.height;
              that.mainContainerHeight = that.windowHeight - appBarHeight;
              albumInfo.boundingClientRect(data => {
                let marginTop = data.top - data.bottom;
                that.contentHeight = that.windowHeight - (appBarHeight + marginTop + data.height + 25);
              }).exec();
            }
          }).exec();
        }
      });
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
    SaveData() {
      debugger;
      let that = this;
      let checkEmpty = '';
      let action = that.Action;
      console.log("SaveData Action", that.Action);
      if (that.albumName === '') {
        checkEmpty += '专辑名称、';
      }
      if (that.albumAuthor === '') {
        checkEmpty += '专辑作者、';
      }
      if (that.albumBrief === '') {
        checkEmpty += '专辑简介、';
      }
      if (checkEmpty != '') {
        uni.showToast({
          title: `添加专辑失败,原因[${checkEmpty}不能为空]`,
          position: 'center',
          icon: 'fail',
          duration: 2000
        });
        return false;
      }
      console.log("SaveData GetLoginUser", that.GetLoginUser());
      if (that.GetLoginUser()) {
        /*uni.getSystemInfo({
          success: info => {
            if (info.platform == 'android') {
              that.albumCover = that.albumCover.replace('file:///', 'file://');
              console.log('that.albumCover', that.albumCover)
            }
          }
        });*/
        editAlbumApiUniApp({
          parm: {
            action: action,
            userId: that.userId,
            albumId: that.AlbumId,
            albumName: that.albumName,
            albumAuthor: that.albumAuthor,
            albumIntro: that.albumBrief
          },
          filePath: that.albumCover,
          beforeCallBack: () => {
            uni.showLoading({
              title: '保存数据'
            });
          },
          responseCallBack: res => {
            uni.hideLoading();
            console.log('SaveData res', res);
            debugger;
            if (res != null && typeof (res) != 'undefined') {
              const { result, status, msg } = JSON.parse(res);
              if (status !== 0) {
                uni.showToast({
                  title: `保存专辑失败,原因[${msg}]`,
                  position: 'center',
                  icon: 'fail',
                  duration: 2000
                });
              }
              else {
                uni.showToast({
                  title: `保存成功`,
                  position: 'center',
                  icon: 'success',
                  duration: 2000
                });
                that.AlbumId = result.albumId;
                console.log('editAlbumApiUniApp that.AlbumId', that.AlbumId);
              }
            }
          },
          errorCallback: res => {
            console.log('editAlbumApiUniApp res', res);
            uni.showToast({
              title: `保存专辑失败,原因[${res}]`,
              position: 'center',
              icon: 'fail',
              duration: 2000
            });
          }
        })
      } else {
        uni.showToast({
          title: `没有登录不能添加专辑`,
          position: 'center',
          icon: 'fail',
          duration: 2000
        });
      }
    }
  }
}
</script>

<style scoped>
.container {
  width: 100%;
  background: url("../../static/PlayListBG.png");
  background-size: 100%;
  background-repeat: repeat-x;
  background-position: center center;
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
  color: #9f9898;
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
  color: #9f9898;
  cursor: pointer;
}
.forwardiconContainer {
  width: 55upx;
  height: 55upx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border: 0px solid red;
}
.albumInfoContainer {
  width: 96%;
  height: 315upx;
  margin-top: 15upx;
  background-color: #35f2ee4d;
  border: 1px solid #fff;
  border-radius: 10upx;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
@media (max-width: 370px) {
  .container .albumInfoContainer {
    width: 96%;
    height: 835upx;
    margin-top: 15upx;
    background-color: #35f2ee4d;
    border: 1px solid #fff;
    border-radius: 10upx;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  .container .albumInfoContainer .albumTipsContainer {
    width: 67%;
    height: 175upx;
    line-height: 73upx;
    text-align: center;
    margin-top: 2%;
    margin-left: 2%;
    margin-bottom: 2%;
    border: 0px solid red;
  }
  .container .albumInfoContainer .albumTipsContainer .tipsLarge {
    font-size: 52upx;
    font-weight: 700;
    color: #afa6a6;
  }
}
@media (max-width: 367px) {
  .container .albumInfoContainer {
    height: 331upx;
  }
}
.albumInfoContainer .albumCover .Icon {
  width: 85upx;
  height: 85upx;
  color: #fff;
}
.albumInfoContainer .albumCover {
  width: 175upx;
  height: 175upx;
  margin-left: 3%;
  border-radius: 15upx;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #cccccc63;
}
.albumInfoContainer .albumTipsContainer {
  width: 67%;
  height: 175upx;
  line-height: 73upx;
  text-align: center;
  margin-left: 2%;
  border: 0px solid red;
}
.albumInfoContainer .albumTipsContainer .tipsLarge {
  font-size: 5.3vh;
  font-weight: 700;
  color: #afa6a6;
}
.albumInfoContainer .albumTipsContainer .tipsNormal {
  font-size: 2.3vh;
  color: #a8a2a2;
}
.albumInfoAnimation {
  animation-name: albumInfoAnimation;
  animation-duration: 1s;
  animation-fill-mode: forwards;
}
@keyframes albumInfoAnimation {
  from {
    margin-top: -30upx;
    opacity: 0;
  }
  to {
    margin-top: 15upx;
    opacity: 1;
  }
}
.mainPanelContainer {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 25upx;
  border-top-right-radius: 6%;
  border-top-left-radius: 6%;
  border-top: 2px solid #fff;
  background-color: #ffffffb3;
}
.mainPanelContainer .centerPanel {
  width: 96%;
  height: 87%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border: 0px solid red;
}
.mainPanelAnimation {
  animation-name: mainPanelAnimation;
  animation-duration: 1s;
  animation-fill-mode: forwards;
}
@keyframes mainPanelAnimation {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.mainPanelContainer .centerPanel .TabPanel {
  width: 100%;
  height: 75upx;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-content: center;
  border: 0px solid red;
}
.mainPanelContainer .centerPanel .TabPanel .TabActive {
  width: 50%;
  height: 75upx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
  cursor: pointer;
  border-bottom: 5px solid blue;
}
.mainPanelContainer .centerPanel .TabPanel .TabActive .CenterPanel {
  width: 71%;
  height: 55upx;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  border: 0px solid red;
}
.mainPanelContainer .centerPanel .TabPanel .TabActive .CenterPanel .Icon {
  width: 50upx;
  height: 50upx;
  margin-left: 3%;
}
.mainPanelContainer .centerPanel .TabPanel .TabActive .CenterPanel .Text {
  width: 65%;
  height: 43upx;
  line-height: 43upx;
  text-align: center;
  color: blue;
  font-size: 35upx;
  font-weight: 700;
  margin-left: 1%;
  border: 0px solid red;
}
.mainPanelContainer .centerPanel .TabPanel .TabNormal {
  width: 50%;
  height: 75upx;
  display: flex;
  cursor: pointer;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
}
.mainPanelContainer .centerPanel .TabPanel .TabNormal .CenterPanel {
  width: 71%;
  height: 55upx;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  border: 0px solid red;
}
.mainPanelContainer .centerPanel .TabPanel .TabNormal .CenterPanel .Icon {
  width: 50upx;
  height: 50upx;
  margin-left: 3%;
}
.mainPanelContainer .centerPanel .TabPanel .TabNormal .CenterPanel .Text {
  width: 65%;
  height: 43upx;
  line-height: 43upx;
  text-align: center;
  color: gray;
  font-size: 35upx;
  font-weight: 700;
  margin-left: 1%;
  border: 0px solid red;
}
.mainPanelContainer .centerPanel .albumInfoEditContainer {
  width: 100%;
  height: 96%;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border: 0px solid rgb(48, 20, 158);
}
.mainPanelContainer .centerPanel .albumInfoEditContainer .albumBrief {
  width: 96%;
  height: 15vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 3%;
}
.mainPanelContainer
  .centerPanel
  .albumInfoEditContainer
  .albumBrief
  .albumBriefCenter {
  width: 100%;
  background-color: #a8a2a270;
  border-radius: 10upx;
  height: 100%;
}
.mainPanelContainer .centerPanel .albumInfoEditContainer .inputNormal {
  width: 96%;
  height: 5.5vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 3%;
}
.mainPanelContainer
  .centerPanel
  .albumInfoEditContainer
  .inputNormal
  .inputNormalCenter {
  width: 100%;
  background-color: #a8a2a270;
  border-radius: 10upx;
  height: 100%;
}
.mainPanelContainer .centerPanel .albumInfoMusicList {
  width: 100%;
  height: 96%;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border: 0px solid red;
}
.mainPanelContainer .centerPanel .albumInfoMusicList .ControlPanel {
  width: 100%;
  height: 127upx;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
}
.mainPanelContainer
  .centerPanel
  .albumInfoMusicList
  .ControlPanel
  .btnImportMusic {
  width: 195upx;
  height: 42upx;
  margin-left: 2%;
  margin-top: 5%;
  margin-bottom: 3%;
  border: 1px solid #02aab0;
  border-radius: 10upx;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  background: linear-gradient(157deg, #02aab0, #00cdac, #02aab0);
}
@media (max-width: 370px) {
  .mainPanelContainer
    .centerPanel
    .albumInfoMusicList
    .ControlPanel
    .btnImportMusic {
    width: 167upx;
  }
  .mainPanelContainer
    .centerPanel
    .albumInfoMusicList
    .ControlPanel
    .btnImportMusic
    .Text {
    width: 53%;
    height: 39upx;
    line-height: 39upx;
    text-align: center;
    color: #fff;
    font-weight: 700;
    font-size: 25upx;
    margin-left: 2%;
    border: 1px solid red;
  }
}
.mainPanelContainer
  .centerPanel
  .albumInfoMusicList
  .ControlPanel
  .btnImportMusic
  .Icon {
  width: 20upx;
  height: 20upx;
  margin-left: 6%;
}
.mainPanelContainer
  .centerPanel
  .albumInfoMusicList
  .ControlPanel
  .btnImportMusic
  .Text {
  width: 127upx;
  height: 39upx;
  line-height: 39upx;
  text-align: center;
  color: #fff;
  font-weight: 700;
  font-size: 25upx;
  margin-left: 2%;
  border: 0px solid red;
}
.mainPanelContainer .centerPanel .albumInfoMusicList .ControlPanel .Icon {
  width: 35upx;
  height: 35upx;
  margin-right: 2%;
  cursor: pointer;
}
.uni-easyinput__content-input {
  background-color: transparent !important;
}
</style>