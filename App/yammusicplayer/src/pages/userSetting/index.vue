<template>
  <view
    class="mainContainer"
    :style="{marginTop:statusBarHeight+'px',height:windowHeight+'px',width:windowWidth+'px',background:`url(${backGroundImage})`}"
  >
    <!--用户信息面板-->
    <view class="userPanel userPanelAnimation">
      <image
        @click="showChooseUserFace"
        class="userFace"
        :src="userFace"
        mode="scaleToFill"
      />
      <view class="userInfo">
        <view class="userName">{{ userName }}</view>
        <view class="tipsText">
          点击头像修改头像
        </view>
      </view>
    </view>
    <!--/用户信息面板-->
    <!--主要面板-->
    <view class="mainPanel mainPanelAnimation">
      <!--功能切换-->
      <scroll-view
        class="tabPanel tabPanelAnimation"
        scroll-x="true"
      >
        <view class="tabContainer">
          <view
            v-for="(item,index) in menuTab"
            :key="index"
            :class="menuTabIndex==index?'tabActiveItem':'tabItem'"
            @click="tabItemClick(index)"
          >
            <image
              class="Icon"
              :src="item.icon"
              mode="scaleToFill"
            />
            <view class="Text">{{item.name}}</view>
          </view>
        </view>
      </scroll-view>
      <!--/功能切换-->
      <view
        class="tabContent"
        :style="{height:tabContentHeight+'px'}"
      >
        <listen-history
          v-if="menuTabIndex==0"
          :userId="userId"
        ></listen-history>
        <share-history
          v-if="menuTabIndex==1"
          :userId="userId"
        ></share-history>
        <album-list
          v-if="menuTabIndex==2"
          :userId="userId"
        ></album-list>
        <friend-list
          v-if="menuTabIndex==3"
          :userId="userId"
        ></friend-list>
        <signature
          v-if="menuTabIndex==4"
          :userId="userId"
        ></signature>
        <editpassword
          v-if="menuTabIndex==5"
          :userId="userId"
        >
        </editpassword>
        <qrcode
          v-if="menuTabIndex==6"
          :userId="userId"
        ></qrcode>
      </view>
    </view>
    <!--/主要面板-->
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
    <tabbar
      ref="tabbar"
      current="4"
    ></tabbar>
  </view>
</template>

<script>
import AlbumList from '../userSetting/AlbumList.vue'
import ShareHistory from '../userSetting/ShareHistory.vue'
import ListenHistory from '../userSetting/ListenHistory.vue'
import FriendList from '../userSetting/FriendList.vue'
import Signature from '../userSetting/Signature.vue'
import EditPassword from '../userSetting/EditPassword.vue'
import QRCode from '../userSetting/QRCode.vue'
import tabbar from '../../components/tabbar.vue';
import ShowActionSheet from '../../components/ShowActionSheet.vue'
import { host, UploadUserFaceUniapp } from '../../api';
import backGroundImage from '@/static/UserPanelBG.png';
import store from '../../store'
//import backGroundImage from '@/static/LRBG.png';

export default {
  components: {
    'tabbar': tabbar,
    'listen-history': ListenHistory,
    'share-history': ShareHistory,
    'album-list': AlbumList,
    'friend-list': FriendList,
    'signature': Signature,
    'editpassword': EditPassword,
    'qrcode': QRCode,
    'show-action-sheet': ShowActionSheet
  },
  data() {
    return {
      backGroundImage: backGroundImage,
      windowHeight: 0,
      windowWidth: 0,
      statusBarHeight: 0,
      userFace: '/static/userfaces/useface01.png',
      defaultUserFace: '/static/userfaces/useface01.png',
      userName: '点击登录或注册',
      defaultUserName: '点击登录或注册',
      userId: '',
      currentLoginUser: null,
      menuTabIndex: 0,
      mainPanelHeight: 0,
      tabContentHeight: 0,
      tabBarHeight: 0,
      menuTab: [{
        icon: '../../static/ListenHistoryIcon.png',
        name: '最近在听'
      },
      {
        icon: '../../static/ShareHistory.png',
        name: '分享历史'
      },
      {
        icon: '../../static/AlbumIcon.png',
        name: '我的专辑'
      },
      {
        icon: '../../static/FriendsIcon.png',
        name: '好友列表'
      },
      {
        icon: '../../static/DigitalSignature.png',
        name: '我的签名'
      },
      {
        icon: '../../static/EditPassword.png',
        name: '修改密码'
      },
      {
        icon: '../../static/ScanQRCode.png',
        name: '二维码'
      }
      ],
      showActionSheet: {
        show: false,
        maskClosable: true,
        tips: "选择更换头像的方式",
        itemList: [
          {
            text: "拍摄",
            color: "#333",
            url: ''
          },
          {
            text: "相册选择",
            color: "#333",
            url: ''
          },
          {
            text: "选择头像",
            color: "#333",
            url: '/pages/userFace/index',
          }
        ],
        color: "#9a9a9a",
        size: 26,
        isCancel: true
      }
    }
  },
  onShow() {
    this.getScreenSize();
    this.GetLoginUser();
  },
  onLoad(options) {
    this.getScreenSize();
    this.GetLoginUser();
  },
  onReady() {
    this.tabBarHeight = this.$refs.tabbar.GetTabBarHeight();
    this.getScreenSize();
    this.GetLoginUser();
  },
  onResize(res) {
    console.log('onResize res', res);
    this.getScreenSize();
  },
  mounted: function () {
    let _that = this;
    _that.tabBarHeight = _that.$refs.tabbar.GetTabBarHeight();
    window.onresize = () => {
      return (() => {
        _that.getScreenSize();
      })()
    }
    _that.GetLoginUser();
  },
  computed: {},
  methods: {
    // 点击弹窗
    chooseMenu() {
      this.showActionSheet.show = true;
    },
    // 弹窗关闭
    chooseCancel() {
      this.showActionSheet.show = false;
    },
    GotoCamera() {
      let that = this;
      let gotoUrl = '';
      uni.getSystemInfo({
        success: res => {
          switch (res.platform) {
            case 'windows':
              if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                gotoUrl = '/pages/userSetting/CameraH5'
                uni.navigateTo({ url: gotoUrl });
              }
              else {
                that.chosePhotos(['camera']);
              }
              break;
            default:
              that.chosePhotos(['camera']);
              break;
          }
        }
      });
    },
    async requestAndroidPermission(permisionID) {
      var result = await permision.requestAndroidPermission(permisionID)
      if (result == -1) {
        //被永久拒绝权限"
        let msg = '您还没有开启摄像头权限，无法拍照,是否去开启？'
        uni.showModal({
          title: '温馨提示',
          content: msg,
          confirmText: "去开启",
          success: function (res) {
            if (res.confirm) {
              uni.openAppAuthorizeSetting()
            }
          }
        })
      }
    },
    //相册选择
    chosePhotos(sourceType) {
      let that = this;
      that.GetLoginUser();
      if (that.userId == '' || typeof (that.userId) == 'undefined') {
        uni.showToast({
          title: `没有登录,请先登录`,
          position: 'center',
          icon: 'fail',
          duration: 2000
        });
      } else {
        uni.chooseImage({
          count: 1,
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          //sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
          sourceType: sourceType,
          extension: ['.jpg', '.jpeg', '.png'],
          success: function (res) {
            const userFacePath = res.tempFilePaths[0];
            uni.showLoading({
              title: '保存中'
            });
            UploadUserFaceUniapp({
              parm: {
                UserId: that.userId,
                filePath: userFacePath
              },
              beforeCallBack: () => {
                uni.showLoading({
                  title: '保存中'
                });
              },
              responseCallBack: resData => {
                uni.hideLoading();
                if (resData != null && typeof (resData) != 'undefined') {
                  const { result, status, msg } = JSON.parse(resData);
                  if (status != 0) {
                    uni.showToast({
                      title: `上传头像出错,原因[${msg}]`,
                      position: 'center',
                      icon: 'fail',
                      duration: 2000
                    });
                  } else {
                    let userFaceUrl = `${host}${result}`;
                    store.commit('updateUserFace', userFaceUrl);
                    that.userFace = userFaceUrl;
                    console.log('chosePhotos that.userFace', that.userFace);
                  }
                }
              }
            })
          },
          fail: (err) => {
            // 处理错误情况
            console.log('chooseImage fail', err);
            if (err.code == 11) {
              //查询摄像头权限
              requestAndroidPermission("android.permission.CAMERA")
            } else {
              uni.showToast({
                title: `选择图片出错`,
                position: 'center',
                icon: 'fail',
                duration: 2000
              });
            }
          }
        })
      }
    },
    choseMenuClickItem(menuIndex) {
      let that = this;
      let clickMenuIndex = menuIndex;
      this.chooseCancel();
      console.log('点击了第几项菜单', clickMenuIndex);
      switch (clickMenuIndex) {
        case 0:
          that.GotoCamera();
          break;
        case 1:
          that.chosePhotos(['album']);
          break;
        case 2:
          console.log('选择头像')
          uni.navigateTo({
            url: '/pages/userFace/index' // 跳转到对应路径的页面
          });
          break;
      }
    },
    tabItemClick(index) {
      let that = this;
      that.GetLoginUser();
      that.menuTabIndex = index;
    },
    GetLoginUser() {
      let that = this;
      that.currentLoginUser = that.$store.state.user;
      console.log('userSetting GetLoginUser that.currentLoginUser', that.currentLoginUser);
      if (that.currentLoginUser != null) {
        console.log('userSetting GetLoginUser that.currentLoginUser', that.currentLoginUser);
        that.userName = that.currentLoginUser.userName;
        that.userFace = that.currentLoginUser.userFace;
        that.userId = that.currentLoginUser.userId;
      }
      else {
        that.$nextTick(() => {
          that.userId = 'null';
          that.userFace = that.defaultUserFace;
          that.userName = that.defaultUserName;
        });
      }
    },
    gotoLoginPage() {
      uni.navigateTo({
        url: '/pages/NoAuth/Login/index' // 跳转到对应路径的页面
      });
    },
    showChooseUserFace() {
      var that = this;
      if (that.currentLoginUser != null) {
        that.chooseMenu();
      } else {
        /*uni.showToast({
          title: `没有登录,请先登录`,
          position: 'center',
          icon: 'fail',
          duration: 2000
        });*/
        that.gotoLoginPage();
      }
    },
    resizeModel() {
      let that = this;
      try {
        const query = uni.createSelectorQuery().in(that);
        let mainPanel = query.select('.mainPanel');
        mainPanel.boundingClientRect(data => {
          if (data) {
            that.mainPanelHeight = data.height + 180;
          }
        }).exec();
      } catch (e) {

      }
    },
    getScreenSize() {
      let that = this;
      uni.getSystemInfo({
        success: res => {
          that.windowHeight = res.windowHeight - res.statusBarHeight;
          that.windowWidth = res.windowWidth;
          that.statusBarHeight = res.statusBarHeight;
          let userPanelHeight = 0;
          let tabPanelHeight = 0;
          const query = uni.createSelectorQuery().in(that);
          let userPanel = query.select('.userPanel');
          let tabPanel = query.select('.tabPanel');
          tabPanel.boundingClientRect(data => {
            if (data) {
              tabPanelHeight = data.height;
            }
          }).exec();
          userPanel.boundingClientRect(data => {
            if (data) {
              userPanelHeight = data.height;
            }
          }).exec();
          console.log('getScreenSize tabBarHeight', that.tabBarHeight);
          that.tabContentHeight = that.windowHeight - (tabPanelHeight + userPanelHeight);
          that.tabContentHeight = that.tabContentHeight - that.tabBarHeight - 75;
          console.log('运行平台 platform ', res.platform);
          console.log('屏幕宽度 getSystemInfo that.windowWidth', that.windowWidth);
          console.log('屏幕高度 getSystemInfo that.windowHeight', that.windowHeight);
        }
      })
    }
  },
  watch: {}
}
</script>

<style scoped>
.mainContainer {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background: url("../../static/UserPanelBG.png");
  background-size: 100%;
  background-repeat: repeat-x;
  background-position: center center;
}

.userPanelAnimation {
  animation-name: userPanelAnimation;
  animation-duration: 1s;
  animation-fill-mode: forwards;
}

@keyframes userPanelAnimation {
  from {
    margin-top: 3%;
    opacity: 0;
  }

  to {
    margin-top: 7%;
    opacity: 1;
  }
}

@keyframes mainPanelAnimation {
  from {
    height: 5vh;
    margin-top: 72%;
    opacity: 0;
  }

  to {
    height: 150vh;
    margin-top: 3%;
    opacity: 1;
  }
}

.mainPanelAnimation {
  animation-name: mainPanelAnimation;
  animation-duration: 1s;
  animation-fill-mode: forwards;
}

.mainContainer .mainPanel {
  width: 100%;
  /*height: 65%;*/
  /*margin-top: 3%;*/
  height: 5%;
  margin-top: 72%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border-top-left-radius: 25upx;
  border-top-right-radius: 25upx;
  background-color: #ffffffec;
}

.mainContainer .mainPanel .tabPanel {
  width: 96%;
  height: 105upx;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-top: 5%;
  border-bottom: 1px solid #ccc;
}

.mainContainer .mainPanel .tabPanel .tabContainer {
  width: 100%;
  height: 100%;
  white-space: nowrap;
  overflow: auto;
  display: flex;
}

.mainContainer .mainPanel .tabPanel .tabContainer .tabItem {
  min-width: 235upx;
  /*max-width: 235upx;*/
  width: auto;
  height: 75upx;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-left: 3%;
  background-color: #cccccc53;
  border-radius: 25upx;
}

.mainContainer .mainPanel .tabPanel .tabContainer .tabItem .Icon {
  width: 55upx;
  height: 55upx;
  margin-left: 5%;
}

.mainContainer .mainPanel .tabPanel .tabContainer .tabItem .Text {
  min-width: 155upx;
  width: auto;
  height: 55upx;
  line-height: 55upx;
  color: red;
  text-align: center;
  font-size: 3.2vh;
  margin-left: 2%;
  border: 0px solid red;
}

.mainContainer .mainPanel .tabPanel .tabContainer .tabActiveItem {
  min-width: 235upx;
  /*max-width: 235upx;*/
  width: auto;
  height: 75upx;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-left: 3%;
  background: linear-gradient(135deg, #36d1dc, #5b86e5);
  border-radius: 25upx;
}

.mainContainer .mainPanel .tabPanel .tabContainer .tabActiveItem .Icon {
  width: 55upx;
  height: 55upx;
  margin-left: 5%;
}

.mainContainer .mainPanel .tabPanel .tabContainer .tabActiveItem .Text {
  min-width: 155upx;
  width: auto;
  height: 55upx;
  line-height: 55upx;
  font-size: 3.2vh;
  color: #fff;
  text-align: center;
  margin-left: 2%;
  border: 0px solid red;
}

.tabPanelAnimation {
  animation-name: tabPanelAnimation;
  animation-duration: 3s;
  animation-fill-mode: forwards;
}

@media (max-width: 370px) {
  .mainContainer .mainPanel .tabPanel .tabContainer .tabItem .Icon {
    width: 35upx;
    height: 35upx;
    margin-left: 5%;
  }

  .mainContainer .mainPanel .tabPanel .tabContainer .tabItem .Text {
    min-width: 155upx;
    width: auto;
    height: 55upx;
    line-height: 55upx;
    color: red;
    text-align: center;
    font-size: 25upx;
    margin-left: 2%;
    border: 0px solid red;
  }

  .mainContainer .mainPanel .tabPanel .tabContainer .tabActiveItem .Icon {
    width: 35upx;
    height: 35upx;
    margin-left: 5%;
  }

  .mainContainer .mainPanel .tabPanel .tabContainer .tabActiveItem .Text {
    min-width: 155upx;
    width: auto;
    height: 55upx;
    line-height: 55upx;
    font-size: 25upx;
    color: #fff;
    text-align: center;
    margin-left: 2%;
    border: 0px solid red;
  }
}

@keyframes tabPanelAnimation {
  from {
    width: 6%;
    margin-left: 75%;
    opacity: 0;
  }

  to {
    width: 96%;
    margin-left: 0%;
    opacity: 1;
  }
}

.mainContainer .userPanel {
  width: 98%;
  height: 135upx;
  margin-top: 2%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  border-radius: 15upx;
  background-color: #ffffff63;
  border: 0px solid red;
}

.mainContainer .userPanel .userFace {
  width: 98upx;
  height: 98upx;
  margin-left: 2%;
  cursor: pointer;
  border-radius: 10%;
}

.mainContainer .userPanel .userInfo {
  width: 82%;
  height: 135upx;
  margin-left: 2%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border: 0px solid red;
}

.mainContainer .userPanel .userInfo .userName {
  width: 100%;
  height: 45upx;
  line-height: 45upx;
  font-size: 2.3vh;
  color: rgb(215 233 224);
  text-align: left;
  text-indent: 2%;
  margin-top: 2%;
  font-weight: bold;
  cursor: pointer;
  text-shadow: 2px 3px 3px #353535;
  border: 0px solid red;
}

.mainContainer .userPanel .userInfo .tipsText {
  width: 100%;
  height: 35upx;
  line-height: 35upx;
  font-size: 2.3vh;
  color: rgb(215 233 224);
  text-align: left;
  text-indent: 2%;
  margin-top: 3%;
  font-weight: bold;
  text-shadow: 2px 3px 3px #353535;
  border: 0px solid red;
}

.mainContainer .mainPanel .tabContent {
  width: 96%;
  height: 43vh;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-top: 5%;
  border: 0px solid red;
}
</style>
