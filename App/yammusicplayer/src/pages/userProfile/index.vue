<template>
  <view
    class="container"
    :style="{marginTop:statusBarHeight+'px',height:windowHeight+'px',background:`url(${backgroundImage})`}"
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
        {{ userId }}
      </view>
      <!--<font-awesome-icon
        id="barMenu"
        class="forwardicon"
        icon="bars"
        @click="chooseMenu"
      />-->
      <view
        @click="chooseMenu"
        class="forwardiconContainer"
      >
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
    <view
      class="mainContainer"
      :style="{height:mainContainerHeight+'px'}"
    >
      <view class="center">
        <!--头像层-->
        <image
          class="userFaceImg"
          :src="userFace"
          mode="scaleToFill"
        />
        <!--/头像层-->
        <!--数据层-->
        <view class="dataPanel">
          <!--用户信息-->
          <view class="userPanel">
            <view class="line">{{ userName }}</view>
            <view class="line registerTime">注册时间:{{ registrationTime }}</view>
          </view>
          <!--/用户信息-->
          <!--标签层-->
          <view class="tabContainer">
            <view
              @click="changeTabIndex(0)"
              :class="tabCurrentIndex==0?'tabActive':'tabItem'"
            >签名</view>
            <view
              @click="changeTabIndex(1)"
              :class="tabCurrentIndex==1?'tabActive':'tabItem'"
            >常听歌曲</view>
            <view
              @click="changeTabIndex(2)"
              :class="tabCurrentIndex==2?'tabActive':'tabItem'"
            >常听歌单</view>
          </view>
          <!--/标签层-->
          <!--标签内容层-->
          <view class="tabContent">
            <textarea
              v-if="tabCurrentIndex==0"
              v-model="signature"
              disabled="true"
              class="signature"
              placeholder="该用户没有签名"
              maxlength="500"
            />
            <recently-listened-page
              v-if="tabCurrentIndex==1"
              :SelfWidth="'98%'"
              :SelfHeight="'97%'"
              :UserId="userId"
            ></recently-listened-page>
            <recently-listened-album-page
              v-if="tabCurrentIndex==2"
              :SelfWidth="'98%'"
              :SelfHeight="'97%'"
              :UserId="userId"
            ></recently-listened-album-page>
            <qr-code
              v-if="tabCurrentIndex==3"
              :SelfWidth="'98%'"
              :SelfHeight="'97%'"
              :UserId="userId"
            ></qr-code>
          </view>
          <!--/标签内容层-->
        </view>
        <!--/数据层-->
      </view>
    </view>
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
import ShowActionSheet from '../../components/ShowActionSheet';
import RecentlyListenedPage from './RecentlyListenedPage';
import RecentlyListenedAlbumPage from './RecentlyListenedAlbumPage.vue';
import QRCode from './QRCode.vue';
import backgroundImage from '../../static/UserPanelBG.png'
import { GetUserInfoById } from '../../api.js'
export default {
  components: {
    'show-action-sheet': ShowActionSheet,
    'recently-listened-page': RecentlyListenedPage,
    'recently-listened-album-page': RecentlyListenedAlbumPage,
    'qr-code': QRCode
  },
  data() {
    return {
      backgroundImage: backgroundImage,
      windowHeight: 0,
      windowWidth: 0,
      mainContainerHeight: 0,
      statusBarHeight: 0,
      userId: '',
      userName: '',
      userFace: '/static/userfaces/useface01.png',
      userFaceLeft: 0,
      userInfo: null,
      registrationTime: '',
      signature: '',
      tabCurrentIndex: 0,
      showActionSheet: {
        show: false,
        maskClosable: true,
        tips: "快捷菜单",
        itemList: [
          {
            text: "用户二维码",
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
  onLoad(query) {
    let that = this;
    console.log('传递的参数', query);
    if (query.userInfo != null && typeof (query.userInfo) != 'undefined') {
      that.userInfo = JSON.parse(decodeURIComponent(query.userInfo));
      that.userId = that.userInfo.friendUserId;
      that.userFace = that.userInfo.friendUserFace;
      that.registrationTime = that.userInfo.friendRegistrationTime;
      that.signature = that.userInfo.friendSignature;
      that.userName = that.userInfo.friendUserName;
    }
    if (query.userId != null && typeof (query.userId) != 'undefined') {
      that.userId = query.userId;
      that.loadData();
    }
    console.log('that.userInfo', that.userInfo)
    this.resizeModel();
  },
  onReady() {
    this.resizeModel();
  },
  onShow() {
    this.resizeModel();
  },
  onResize(res) {
    this.resizeModel();
  },
  mounted: function () {
    this.resizeModel();
  },
  methods: {
    loadData() {
      let that = this;
      GetUserInfoById({
        parm: {
          UserId: that.userId
        },
        beforeCallBack: () => {
          uni.showLoading({
            title: '加载中'
          });
        },
        responseCallBack: resp => {
          uni.hideLoading();
          console.log('GetUserInfoById resp'.resp);
          if (resp != null && typeof (resp) != 'undefined') {
            const { result, status, msg } = resp;
            if (status == 0) {
              that.userInfo = result;
              that.userFace = result.userface;
              that.userName = result.username;
              that.registrationTime = result.createdatetime;
              that.signature = result.signature;
            } else {
              uni.showToast({
                title: `读取用户数据失败,原因[${msg}]`,
                position: 'center',
                icon: 'fail',
                duration: 2000
              });
            }
          }
        },
        errorCallback: error => {
          console.log('GetUserInfoById error', error)
          uni.showToast({
            title: `读取用户数据失败,原因[${error}]`,
            position: 'center',
            icon: 'fail',
            duration: 2000
          });
        }
      });
    },
    changeTabIndex(TabIndex) {
      let that = this;
      that.tabCurrentIndex = TabIndex;
    },
    choseMenuClickItem(menuIndex) {
      let that = this;
      switch (menuIndex) {
        case 0:
          that.tabCurrentIndex = 3;
          break;
      }
      that.chooseCancel();
    },
    // 点击弹窗
    chooseMenu() {
      console.log('chooseMenu', this.showActionSheet.show)
      this.showActionSheet.show = true;
    },
    // 弹窗关闭
    chooseCancel() {
      this.showActionSheet.show = false;
    },
    gotoBack() {
      uni.navigateBack({ delta: 1 });
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
    }
  }
}
</script>

<style scoped>
.forwardiconContainer {
  width: 55upx;
  height: 55upx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.signature {
  width: 98%;
  height: 97%;
  margin-top: 1%;
  line-height: 53upx;
  color: #ccc;
  font-weight: 700;
  text-indent: 3%;
  background-color: #cccccc4e;
  border-radius: 10upx;
}
.mainContainer {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 0px solid red;
}
.mainContainer .center {
  width: 89%;
  height: 87%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #ffffffe5;
  border-radius: 15upx;
  box-shadow: -1px 0px 10px 15px #00d7ff;
}
.mainContainer .center .userFaceImg {
  width: 185upx;
  height: 185upx;
  position: absolute;
  top: -37.5upx;
  /*left居中方法*/
  left: 50%;
  transform: translateX(-50%);
  /*left居中方法*/
  border-radius: 50%;
}
.mainContainer .center .dataPanel {
  width: 89%;
  height: 76%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin-top: 127.5upx;
  border: 0px solid red;
}
.mainContainer .center .dataPanel .tabContent {
  width: 100%;
  height: 65%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 0px solid red;
}
.mainContainer .center .dataPanel .tabContainer {
  width: 100%;
  height: 13%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  border: 0px solid red;
}
.mainContainer .center .dataPanel .tabContainer .tabItem {
  width: 33%;
  height: 100%;
  display: flex;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  font-size: 2.5vh;
  color: #ccc;
  font-weight: 700;
  text-align: center;
}
.mainContainer .center .dataPanel .tabContainer .tabItem:hover {
  color: rgba(28, 159, 174, 0.727);
}
.mainContainer .center .dataPanel .tabContainer .tabActive {
  width: 33%;
  height: 100%;
  display: flex;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  font-size: 2.5vh;
  color: blue;
  font-weight: 700;
  border-bottom: 3px solid blue;
}
.mainContainer .center .dataPanel .userPanel {
  width: 100%;
  height: 22%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border: 0px solid red;
}
.mainContainer .center .dataPanel .userPanel .line {
  width: 100%;
  height: 52upx;
  line-height: 52upx;
  font-size: 3.2vh;
  color: #282222be;
  text-align: center;
  font-weight: 700;
  margin-top: 1%;
  border: 0px solid red;
}
.mainContainer .center .dataPanel .userPanel .registerTime {
  color: #bca5a5c4 !important;
  font-size: 2.2vh !important;
}
.container {
  width: 100%;
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
</style>
