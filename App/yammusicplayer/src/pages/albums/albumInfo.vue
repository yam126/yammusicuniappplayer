<template>
  <view
    class="container"
    :style="{marginTop:statusBarHeight+'px',height:windowHeight+'px',background:`url(${indexBackgroundImage})`}"
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
          style="transform: translateX(-1000upx);filter: drop-shadow(#ffffff 1000upx 0)"
          mode="scaleToFill"
        />
      </view>
      <view class="appBarTitle">
        专辑信息
      </view>
      <view
        @click="chooseMenu"
        class="forwardiconContainer"
      >
        <!--<font-awesome-icon
        class="appBarRightIcon"
        icon="ellipsis-v"
      />-->
        <image
          id="barMenu"
          class="forwardicon"
          src="/static/list.svg"
          style="transform: translateX(-1000upx);filter: drop-shadow(#ffffff 1000upx 0)"
          mode="scaleToFill"
        />
      </view>
    </view>
    <!--/appBar-->
    <!--加载页-->
    <view
      v-if="isLoading"
      class="loadContainer"
      :style="{height:mainContainerHeight+'px'}"
    >
      <uni-load-more
        :iconSize="56"
        iconType="circle"
        :status="'loading'"
        :color="'#fff'"
        :showText="false"
      ></uni-load-more>
    </view>
    <!--/加载页-->
    <!--内容页-->
    <view
      v-if="isLoading==false"
      class="contentContainer"
      :style="{height:mainContainerHeight+'px'}"
    >
      <!--专辑信息-->
      <view class="albumInfoContainer albumInfoAnimation">
        <!--专辑详细信息-->
        <view class="albumInfoCover">
          <image
            class="albumCover"
            :src="albumCover"
          ></image>
          <!--专辑信息-->
          <view class="albumInfo">
            <view class="lineContent albumName">{{albumName}}</view>
            <view class="lineContent albumAuthor">{{albumAuthor}}</view>
            <view class="lineContent albumAuthor">{{createdatetime}}</view>
          </view>
          <!--/专辑信息-->
        </view>
        <!--/专辑详细信息-->
        <view class="albumInfoStatistics">
          <swiper
            class="swiper"
            :indicator-dots="indicatorDots"
            :autoplay="autoplay"
            :circular="circular"
          >
            <swiper-item class="swiper-item">
              <view class="StatisticsItem">
                分享次数:{{shareCount}}
              </view>
            </swiper-item>
            <swiper-item class="swiper-item">
              <view class="StatisticsItem">
                歌曲数量:{{songLength}}
              </view>
            </swiper-item>
            <swiper-item class="swiper-item">
              <view class="StatisticsItem">
                浏览次数:{{viewCount}}
              </view>
            </swiper-item>
          </swiper>
        </view>
      </view>
      <!--/专辑信息-->
      <!--内容信息-->
      <view
        class="mainPanelContainer mainPanelAnimation"
        :style="{height:contentHeight+'px'}"
      >
        <view class="centerPanel">
          <!--控制层-->
          <view class="ControlPanel">
            <!--播放按钮-->
            <view
              @click="PlayAlbum"
              class="btnPlayAll"
            >
              <!--<font-awesome-icon
                class="forwardicon Icon"
                icon="fas fa-play-circle"
              />-->
              <image
                src="../../static/play-circle-fill.svg"
                class="forwardicon Icon"
                style="transform: translateX(-1000upx);filter: drop-shadow(#ffffff 1000upx 0)"
              />
              <view class="Text">播放专辑</view>
            </view>
            <!--/播放按钮-->
            <image
              @click="ChangeMusicSortMethod"
              class="btnOrder"
              :src="MusicSortMethodImageUrl"
              mode="scaleToFill"
            />
          </view>
          <!--/控制层-->
          <!--音乐列表-->
          <view class="MusicListContainer">
            <view
              @click="ExpandOptionPanel"
              :class="[QuickMenuClassNameDefaule,QuickMenuAnimation]"
            >
              ▼点击展开功能列表▼</view>
            <view :class="[QuickPanelClassNameDefaule,QuickPanelAnimation]">
              <view
                class="OptionPanel"
                :style="{'opacity':IsExpandOptionPanel?'1':'0'}"
              >
                <scroll-view
                  class="ScrollView"
                  scroll-y="true"
                >
                  <view class="CenterView">
                    <view
                      style="background-color: blue;"
                      class="ButtonItem"
                      @click="gotoAlbumEdit('Add','')"
                    >
                      <!--<uni-icons
                        class="Icon"
                        color="white"
                        type="plus-filled"
                        size="60"
                      ></uni-icons>-->
                      <image
                        src="../../static/plus-circle-fill.svg"
                        class="Icon"
                        style="transform: translateX(-1000upx);filter: drop-shadow(#ffffff 1000upx 0)"
                      />
                      <view class="Text">
                        添加专辑
                      </view>
                    </view>
                    <view
                      style="background-color:green;"
                      class="ButtonItem"
                      @click="gotoAlbumEdit('Edit',albumId)"
                    >
                      <!--<uni-icons
                        class="Icon"
                        color="white"
                        type="compose"
                        size="60"
                      ></uni-icons>-->
                      <image
                        src="../../static/pencil-square.svg"
                        class="Icon"
                        style="transform: translateX(-1000upx);filter: drop-shadow(#ffffff 1000upx 0)"
                      />
                      <view class="Text">
                        修改专辑
                      </view>
                    </view>
                    <view
                      style="background-color:aqua;"
                      class="ButtonItem"
                      @click="btnImportMusicClick"
                    >
                      <!--<uni-icons
                        class="Icon"
                        color="white"
                        type="download-filled"
                        size="60"
                      ></uni-icons>-->
                      <image
                        src="../../static/cloud-arrow-down-fill.svg"
                        class="Icon"
                        style="transform: translateX(-1000upx);filter: drop-shadow(#ffffff 1000upx 0)"
                      />
                      <view class="Text">
                        导入歌曲
                      </view>
                    </view>
                    <view
                      style="background-color:red;"
                      class="ButtonItem"
                      @click="btnDeleteAlbumClick"
                    >
                      <!--<uni-icons
                        class="Icon"
                        color="white"
                        type="trash-filled"
                        size="60"
                      ></uni-icons>-->
                      <image
                        src="../../static/trash3-fill.svg"
                        class="Icon"
                        style="transform: translateX(-1000upx);filter: drop-shadow(#ffffff 1000upx 0)"
                      />
                      <view class="Text">
                        删除专辑
                      </view>
                    </view>
                  </view>
                </scroll-view>
              </view>
              <view
                @click="ShrinkOptionPanel"
                class="ShrinkButton"
              >▲点击收缩功能列表▲</view>
            </view>
            <album-music-list
              ref="MusicList"
              :albumId="albumId"
              :height="'155upx'"
            ></album-music-list>
          </view>
          <!--/音乐列表-->
        </view>
      </view>
      <!--/内容信息-->
    </view>
    <!--/内容页-->
    <show-action-sheet
      :tips="showActionSheet.tips"
      :itemList="showActionSheet.itemList"
      :show="showActionSheet.show"
      :maskClosable="showActionSheet.maskClosable"
      :isCancel="showActionSheet.isCancel"
      @chooseCancel="chooseCancel"
      @click="choseMenuClickItem"
    >
    </show-action-sheet>
  </view>
</template>


<script>
import {
  GetAlbumInfo,
  AlbumDeleteUniapp,
  AddViewCount
} from '../../api'
import {
  removeTrailingZeros
} from '../../utils'
import AlbumMusicList from "../../components/AlbumMusicList";
import indexBackgroundImage from "@/static/PlayListBG.png";
import ShowActionSheet from '../../components/ShowActionSheet.vue'
export default {
  components: {
    'album-music-list': AlbumMusicList,
    'show-action-sheet': ShowActionSheet
  },
  data() {
    return {
      indexBackgroundImage: indexBackgroundImage,
      windowHeight: 0,
      windowWidth: 0,
      mainContainerHeight: 0,
      contentHeight: 0,
      statusBarHeight: 0,
      isLoading: false,
      albumCover: '../../static/NoCover.png',
      albumName: '',
      albumAuthor: '',
      albumUserId: '',
      createdatetime: '',
      albumInfo: null,
      autoplay: true,
      circular: true,
      indicatorDots: false,
      shareCount: 0,
      songLength: 0,
      viewCount: 0,
      albumId: '',
      MusicSortMethod: 'ASC',
      MusicSortMethodImageUrl: '../../static/OrderAscMini.png',
      IsExpandOptionPanel: false,
      QuickMenuClassNameDefaule: 'QuickMenu',
      QuickMenuAnimation: '',
      QuickPanelClassNameDefaule: 'QuickOptionPanel',
      QuickPanelAnimation: '',
      currentLoginUser: null,
      userId: '',
      showActionSheet: {
        show: false,
        maskClosable: true,
        tips: "快捷菜单",
        itemList: [
          {
            text: "分享专辑",
            color: "#333",
            url: ''
          }
        ],
        color: "#9a9a9a",
        size: 26,
        isCancel: true
      }
    }
  },
  onLoad(options) {
    this.RecordViewCount();
  },
  onReady() {
    this.resizeModel();
    this.LoadData();
    this.RecordViewCount();
  },
  onResize(res) {
    this.resizeModel();
  },
  mounted: function () {
    this.resizeModel();
    this.RecordViewCount();
  },
  methods: {
    chooseMenu() {
      console.log('chooseMenu', this.showActionSheet.show)
      this.showActionSheet.show = true;
    },
    // 弹窗关闭
    chooseCancel() {
      this.showActionSheet.show = false;
    },
    choseMenuClickItem(menuIndex) {
      let that = this;
      switch (menuIndex) {
        case 0:
          uni.navigateTo({
            url: `/pages/share/ShareMusic?albumId=${that.albumId}` // 跳转到对应路径的页面
          });
          break;
      }
    },
    RecordViewCount() {
      let that = this;
      const albumInfoId = uni.getStorageSync('albumInfoId');
      AddViewCount({
        parm: {
          albumId: albumInfoId.albumId
        },
        beforeCallBack: () => { },
        responseCallBack: res => {
          console.log('RecordViewCount res', res)
          if (res != null && typeof (res) != 'undefined') {
            const { status, msg, result } = res;
            if (status != 0) {
              console.log(`记录浏览次数失败,原因[${msg}]`)
            } else {
              that.viewCount = result;
            }
          }
        },
        errorCallback: error => {
          console.log(`记录浏览次数失败,原因[${error}]`)
        }
      })
    },
    PlayAlbum() {
      this.$refs.MusicList.PlayAll();
    },
    //删除专辑
    btnDeleteAlbumClick() {
      let that = this;
      if (that.GetLoginUser()) {
        if (that.albumUserId != that.userId) {
          uni.showToast({
            title: `不是自己添加的专辑不能删除`,
            position: 'center',
            icon: 'fail',
            duration: 2000
          });
          return false;
        } else {
          uni.showModal({
            title: '是否删除',
            content: '确定要删除当前专辑吗[注意:专辑内的歌曲也会被删除]？',
            showCancel: true,
            success: ({
              confirm,
              cancel
            }) => {
              if (confirm) {
                uni.showLoading({
                  title: '删除中'
                });
                AlbumDeleteUniapp({
                  parm: {
                    albumId: that.albumId,
                  },
                  beforeCallBack: () => { },
                  responseCallBack: res => {
                    const {
                      status,
                      msg
                    } = res;
                    uni.hideLoading();
                    console.log('btnDeleteAlbumClick res', res);
                    if (status != 0) {
                      uni.showToast({
                        title: `删除专辑出错,原因[${msg}]`,
                        position: 'center',
                        icon: 'fail',
                        duration: 2000
                      });
                    } else {
                      uni.showToast({
                        title: `删除成功`,
                        position: 'center',
                        icon: 'success',
                        duration: 2000
                      });
                      that.gotoBack();
                    }
                  }
                })
              }
            }
          })
        }
      }
    },
    //导入歌曲
    btnImportMusicClick() {
      let that = this;
      if (that.GetLoginUser()) {
        if (that.albumUserId != that.userId) {
          uni.showToast({
            title: `不是自己添加的专辑不能导入歌曲`,
            position: 'center',
            icon: 'fail',
            duration: 2000
          });
          return false;
        }
        uni.getSystemInfo({
          success: function (info) {
            console.log(info.platform)
            switch (info.platform) {
              case 'windows':
                let gotoUrl =
                  `/pages/ImportSong/ImportSongH5?AlbumId=${that.albumId}&CallBack=albumInfo`;
                console.log('btnImportMusicClick that.albumId', that.albumId);
                uni.navigateTo({
                  url: gotoUrl
                });
                break;
              case 'android':
                gotoUrl = `/pages/ImportSong/ImportAndroid?AlbumId=${that.albumId}&CallBack=albumInfo`;
                console.log('btnImportMusicClick that.AlbumId', that.albumId);
                console.log('btnImportMusicClick gotoUrl', gotoUrl);
                uni.navigateTo({
                  url: gotoUrl
                });
                break;
            }
          }
        });
      }
    },
    GetLoginUser() {
      let that = this;
      that.currentLoginUser = that.$store.state.user;
      if (that.currentLoginUser == null) {
        uni.showToast({
          title: `没有登录不能执行操作`,
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
    gotoAlbumEdit(Action, id) {
      let that = this;
      let gotoUrl = '/pages/albums/albumEdit';
      if (Action == null || typeof (Action) == 'undefined' || Action == '') {
        Action = 'Add';
      }
      if (id == null || typeof (id) == 'undefined' || id == '') {
        id = '';
      }
      gotoUrl += '?Action=' + Action + '&AlbumId=' + removeTrailingZeros(id);
      if (Action == 'Edit') {
        if (that.GetLoginUser()) {
          if (that.albumUserId != that.userId) {
            uni.showToast({
              title: `当前专辑不是您添加的不可编辑`,
              position: 'center',
              icon: 'fail',
              duration: 2000
            });
            return false;
          }
        } else {
          return false;
        }
      }
      uni.navigateTo({
        url: gotoUrl
      });
    },
    ExpandOptionPanel() {
      this.IsExpandOptionPanel = true;
      this.QuickMenuAnimation = 'OptionExpandQuickMenuAnimation';
      this.QuickPanelAnimation = 'OptionExpandQuickOptionPanelAnimation';
    },
    ShrinkOptionPanel() {
      this.IsExpandOptionPanel = false;
      this.QuickMenuAnimation = 'OptionShrinkQuickMenuAnimation';
      this.QuickPanelAnimation = 'OptionShrinkQuickOptionPanelAnimation';
    },
    ChangeMusicSortMethod() {
      let that = this;
      if (that.MusicSortMethod == 'ASC') {
        that.MusicSortMethod = 'DESC';
        that.MusicSortMethodImageUrl = '../../static/OrderDescMini.png';
        that.$refs.MusicList.changeSortMethod(that.MusicSortMethod)
      } else {
        that.MusicSortMethod = 'ASC';
        that.MusicSortMethodImageUrl = '../../static/OrderAscMini.png';
        that.$refs.MusicList.changeSortMethod(that.MusicSortMethod)
      }
    },
    LoadData() {
      let that = this;
      const albumInfoId = uni.getStorageSync('albumInfoId');
      console.log('参数：', albumInfoId);
      that.isLoading = true;
      GetAlbumInfo({
        parm: {
          albumId: albumInfoId.albumId
        },
        beforeCallBack: () => {
          that.isLoading = true;
        },
        responseCallBack: res => {
          console.log('GetAlbumInfo', res);
          if (res != null && typeof (res) != 'undefined') {
            const {
              result,
              status,
              msg
            } = res;
            if (status == 0) {
              that.isLoading = false;
              that.albumId = removeTrailingZeros(result.albumId);
              that.albumCover = result.albumCover;
              that.albumName = result.albumName;
              that.albumAuthor = result.albumAuthor;
              that.createdatetime = result.createdatetime;
              that.shareCount = result.shareCount;
              that.songLength = result.songLength;
              that.viewCount = result.viewCount;
              that.albumUserId = result.userid;
            } else {
              uni.showToast({
                title: `读取专辑数据失败,原因[${msg}]`,
                position: 'center',
                icon: 'fail',
                duration: 2000
              });
            }
          }
        }
      });
    },
    gotoBack() {
      // 假设当前在一个非tab页面，需要返回到上一个页面
      uni.switchTab({
        url: '/pages/albums/index'
      })
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
                that.contentHeight = that.windowHeight - (appBarHeight +
                  marginTop + data.height + 25);
              }).exec();
            }
          }).exec();
        }
      });
    }
  }
}
</script>

<style scoped>
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

.mainPanelContainer .centerPanel .MusicListContainer {
  width: 100%;
  height: 96%;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 0px solid rgb(48, 20, 158);
}

.mainPanelContainer .centerPanel .MusicListContainer .QuickOptionPanel {
  width: 100%;
  height: 9%;
  position: absolute;
  z-index: 969;
  top: 0upx;
  left: 0upx;
  opacity: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;
  border-bottom-left-radius: 15upx;
  border-bottom-right-radius: 15upx;
  background-color: #ffffffe3;
}

.mainPanelContainer
  .centerPanel
  .MusicListContainer
  .QuickOptionPanel
  .OptionPanel {
  width: 96%;
  height: 86%;
  margin-top: 1%;
  margin-bottom: 1%;
  border: 0px solid red;
}

.mainPanelContainer
  .centerPanel
  .MusicListContainer
  .QuickOptionPanel
  .OptionPanel
  .ScrollView {
  width: 100%;
  height: 100%;
}

.mainPanelContainer
  .centerPanel
  .MusicListContainer
  .QuickOptionPanel
  .OptionPanel
  .ScrollView
  .CenterView {
  width: 100%;
  min-height: 150upx;
  height: auto;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.mainPanelContainer
  .centerPanel
  .MusicListContainer
  .QuickOptionPanel
  .OptionPanel
  .ScrollView
  .CenterView
  .ButtonItem {
  width: 287upx;
  height: 287upx;
  margin-left: 5%;
  margin-top: 5%;
  display: flex;
  cursor: pointer;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border-radius: 15upx;
  border: 0px solid red;
}

.mainPanelContainer
  .centerPanel
  .MusicListContainer
  .QuickOptionPanel
  .OptionPanel
  .ScrollView
  .CenterView
  .ButtonItem
  .Icon {
  margin-top: 15%;
}

.mainPanelContainer
  .centerPanel
  .MusicListContainer
  .QuickOptionPanel
  .OptionPanel
  .ScrollView
  .CenterView
  .ButtonItem
  .Text {
  width: 96%;
  height: 65upx;
  line-height: 65upx;
  text-align: center;
  color: #fff;
  font-weight: 700;
  font-size: 2.7vh;
  margin-top: 10%;
  border: 0px solid red;
}

.mainPanelContainer
  .centerPanel
  .MusicListContainer
  .QuickOptionPanel
  .ShrinkButton {
  width: 100%;
  height: 10%;
  line-height: 167%;
  text-align: center;
  color: #000;
  font-size: 2.2vh;
  cursor: pointer;
  border: 0px solid red;
}

.mainPanelContainer
  .centerPanel
  .MusicListContainer
  .QuickOptionPanel
  .ShrinkButton:hover {
  background: linear-gradient(to right, #f12711, #f5af19);
  color: #fff;
}

.OptionExpandQuickOptionPanelAnimation {
  animation-name: OptionExpandQuickOptionPanelAnimation;
  animation-duration: 1s;
  animation-fill-mode: forwards;
}

.OptionShrinkQuickOptionPanelAnimation {
  animation-name: OptionShrinkdQuickMenuAnimation;
  animation-duration: 2s;
  animation-fill-mode: forwards;
}

@keyframes OptionExpandQuickOptionPanelAnimation {
  from {
    opacity: 0;
    height: 9%;
  }

  to {
    opacity: 1;
    height: 96%;
  }
}

@keyframes OptionShrinkQuickOptionPanelAnimation {
  from {
    opacity: 1;
    height: 96%;
  }

  to {
    opacity: 1;
    height: 6%;
  }
}

.OptionExpandQuickMenuAnimation {
  animation-name: OptionExpandQuickMenuAnimation;
  animation-duration: 1s;
  animation-fill-mode: forwards;
}

.OptionShrinkdQuickMenuAnimation {
  animation-name: OptionShrinkdQuickMenuAnimation;
  animation-duration: 1s;
  animation-fill-mode: forwards;
}

@keyframes OptionExpandQuickMenuAnimation {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}

@keyframes OptionShrinkdQuickMenuAnimation {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.mainPanelContainer .centerPanel .MusicListContainer .QuickMenu {
  width: 100%;
  height: 9%;
  line-height: 167%;
  position: absolute;
  z-index: 999;
  top: 0upx;
  left: 0upx;
  text-align: center;
  color: #000;
  font-size: 2.2vh;
  cursor: pointer;
  border-bottom-left-radius: 15upx;
  border-bottom-right-radius: 15upx;
  background-color: #ffffffe3;
}

.mainPanelContainer .centerPanel .MusicListContainer .QuickMenu:hover {
  background: linear-gradient(to right, #f12711, #f5af19);
  color: #fff;
}

.mainPanelContainer .centerPanel .ControlPanel {
  width: 100%;
  height: 65upx;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-content: center;
  border: 0px solid red;
}

.mainPanelContainer .centerPanel .ControlPanel .btnPlayAll .Icon {
  margin-top: 0.3% !important;
}

.mainPanelContainer .centerPanel .ControlPanel .btnOrder {
  width: 33upx;
  height: 33upx;
  cursor: pointer;
  margin-top: 3%;
  margin-right: 1%;
}

.mainPanelContainer .centerPanel .ControlPanel .btnPlayAll {
  min-width: 195upx;
  width: auto;
  height: 51upx;
  margin-top: 0.7%;
  margin-left: 1%;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  background: linear-gradient(to top, #97e7a2, #d8ff7e);
  border: 1px solid #d8ff7e;
  border-radius: 17upx;
}

.mainPanelContainer .centerPanel .ControlPanel .btnPlayAll .Text {
  min-width: 110upx;
  width: auto;
  height: 35upx;
  line-height: 35upx;
  font-size: 2vh;
  color: #fff;
  text-align: center;
  margin-top: 0.5%;
  margin-left: 5%;
  border: 0px solid red;
}

.contentContainer {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.loadContainer {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.albumInfoContainer {
  width: 96%;
  height: 315upx;
  margin-top: 15upx;
  background-color: #35f2ee4d;
  border: 1px solid #fff;
  border-radius: 10upx;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.albumInfoContainer .albumInfoCover {
  width: 96%;
  height: 128upx;
  margin-top: 2%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  border: 0px solid red;
}

.albumInfoContainer .albumInfoStatistics {
  width: 96%;
  height: 67upx;
  margin-top: 1%;
  margin-bottom: 2%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  border: 0px solid red;
}

.albumInfoContainer .albumInfoStatistics .swiper {
  width: 100%;
  height: 67upx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 0px solid blue;
}

.albumInfoContainer .albumInfoStatistics .swiper .swiper-item {
  width: 100%;
  height: 67upx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 0px solid blue;
}

.albumInfoContainer .albumInfoStatistics .swiper .swiper-item .StatisticsItem {
  width: 98%;
  height: 65upx;
  line-height: 65upx;
  text-align: center;
  font-size: 2.1vh;
  color: #000;
  border-radius: 10upx;
  background-color: #5fa7a22e;
  border: 1px solid #1dbc9461;
}

.albumInfoContainer .albumInfoCover .albumCover {
  width: 97upx;
  height: 97upx;
  border-radius: 9%;
  margin-top: 0.5%;
  margin-left: 3%;
}

.albumInfoContainer .albumInfoCover .albumInfo {
  width: 78%;
  height: 116upx;
  margin-left: 2%;
  margin-top: 0.3%;
  border: 0px solid red;
}

.albumName {
  font-size: 3.2vh;
  color: #000;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  font-weight: 700;
}

.albumAuthor {
  font-size: 2.2vh;
  color: #000;
}

.albumInfoContainer .albumInfoCover .albumInfo .lineContent {
  width: 100%;
  min-height: 25upx;
  height: auto;
  text-align: left;
  text-indent: 2%;
  overflow: hidden;
  border: 0px solid red;
}

.albumInfoAnimation {
  animation-name: albumInfoAnimation;
  animation-duration: 1s;
  animation-fill-mode: forwards;
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
  color: #ffffff;
  font-size: 3.3vh;
  font-weight: 700;
  margin-left: 1%;
  border: 0px solid red;
}

.forwardicon {
  width: 33upx;
  height: 33upx;
  margin-left: 15upx;
  color: #ffffff;
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

@media (max-width: 370px) {
  .albumInfoContainer {
    width: 96%;
    height: 765upx;
    margin-top: 15upx;
    background-color: #35f2ee4d;
    border: 1px solid #fff;
    border-radius: 10upx;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }

  .albumName {
    font-size: 2.2vh;
    color: #000;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-weight: 700;
  }

  .albumAuthor {
    font-size: 1.2vh;
    color: #000;
  }
}
@media (max-width: 367px) {
  .albumInfoContainer {
    height: 331upx;
  }
}
</style>