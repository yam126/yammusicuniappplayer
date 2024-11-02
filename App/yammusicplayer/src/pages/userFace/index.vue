<template>
  <view class="content">
    <view
      class="userFaceContent"
      :style="{height:mainPanelHeight+'px'}"
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
        <view class="songNameTitle">
          头像列表
        </view>
      </view>
      <!--/appBar-->
      <scroll-view
        v-if="isLoading==false"
        class="userFaceList"
        scroll-y="true"
        :style="{height:userFaceListHeight+'px'}"
      >
        <image
          class="userFaceItem"
          v-for="(item,index) in userFaceData"
          :key="index"
          :src="item"
          @click="UpdateUserFace(item)"
        ></image>
      </scroll-view>
      <view
        v-if="isLoading"
        class="loadContainer"
        :style="{height:userFaceListHeight+'px'}"
      >
        <uni-load-more
          iconType="circle"
          :status="'loading'"
        ></uni-load-more>
      </view>
    </view>
  </view>
</template>

<script>
import { GetUserFaces, ChangeUserFace } from '../../api'
import store from '../../store'
export default {
  data() {
    return {
      windowHeight: 0,
      windowWidth: 0,
      mainPanelHeight: 0,
      userFaceListHeight: 0,
      isLoading: true,
      userFaceData: [],
      userId: ''
    }
  },
  onLoad(options) {
    this.GetLoginUser();
  },
  onReady() {
    this.resizeModel();
    this.getData();
    this.GetLoginUser();
  },
  onResize(res) {
    this.resizeModel();
    this.GetLoginUser();
  },
  mounted: function () {
    this.resizeModel();
    this.getData();
  },
  methods: {
    GetLoginUser() {
      let that = this;
      let currentLoginUser = that.$store.state.user;
      //console.log('userSetting GetLoginUser that.currentLoginUser', that.currentLoginUser);
      if (currentLoginUser != null) {
        console.log('userSetting GetLoginUser currentLoginUser', currentLoginUser);
        that.userId = currentLoginUser.userId;
      }
    },
    UpdateUserFace(userFaceUrl) {
      let that = this;
      let args = {
        userId: that.userId,
        userFaceUrl: userFaceUrl,
      };
      ChangeUserFace({
        parm: args,
        beforeCallBack: () => {
          uni.showLoading({
            title: '修改中',
            mask: true
          });
        },
        responseCallBack: res => {
          const { result, status, msg } = res;
          if (res != null && typeof (res) != 'undefined') {
            if (status == 0) {
              store.commit('updateUserFace', userFaceUrl);
              that.gotoBack();
            } else {
              uni.showToast({
                title: `修改头像失败,原因[${msg}]`,
                position: 'center',
                icon: 'fail',
                duration: 2000
              });
            }
          }
        },
        errorCallback: error => {
          console.log('refresh error', error);
          uni.showToast({
            title: `头像加载出错,原因[${error}]`,
            position: 'center',
            icon: 'fail',
            duration: 2000
          });
        }
      });
    },
    getData() {
      let that = this;
      GetUserFaces({
        parm: null,
        beforeCallBack: () => {
          that.isLoading = true;
        },
        responseCallBack: res => {
          that.isLoading = false;
          if (res != null && typeof (res) != 'undefined' && res.status == 200) {
            if (res.data != null && typeof (res.data) != 'undefined') {
              console.log('GetUserFaces', res);
              const { result, status, msg } = res.data;
              if (status == 0) {
                that.userFaceData = result;
              } else {
                uni.showToast({
                  title: `头像加载出错,原因[${msg}]`,
                  position: 'center',
                  icon: 'fail',
                  duration: 2000
                });
              }
            }
          }
        },
        errorCallback: error => {
          console.log('refresh error', error);
          uni.showToast({
            title: `头像加载出错,原因[${error}]`,
            position: 'center',
            icon: 'fail',
            duration: 2000
          });
        }
      })
    },
    gotoBack() {
      uni.switchTab({
        url: `/pages/userSetting/index`
      });
    },
    resizeModel() {
      let that = this;
      uni.getSystemInfo({
        success: res => {
          that.windowHeight = res.windowHeight;
          that.windowWidth = res.windowWidth;
          that.mainPanelHeight = res.windowHeight;
          console.log('运行平台 platform ', res.platform);
          console.log('屏幕宽度 getSystemInfo that.windowWidth', that.windowWidth);
          console.log('屏幕高度 getSystemInfo that.windowHeight', that.windowHeight);
          const query = uni.createSelectorQuery().in(that);
          let appBar = query.select('.appBar');
          appBar.boundingClientRect(data => {
            if (data) {
              const appBarHeight = data.height;
              that.userFaceListHeight = that.windowHeight - appBarHeight;
              console.log('userFaceListHeight', that.userFaceListHeight);
            }
          }).exec();
        }
      })
    }
  }
}
</script>

<style scoped>
.loadContainer {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.userFaceList {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}
.userFaceList .userFaceItem {
  width: 235upx;
  height: 235upx;
  cursor: pointer;
  margin-top: 2%;
  margin-left: 1%;
}
.userFaceContent {
  background: linear-gradient(to top, #ffffff, #12fff7);
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background-color: #f2f2f2;
}
.mainScroll {
  width: 100%;
  border: 0px solid red;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to top, #ffffff, #12fff7);
}
.songNameTitle {
  width: 88%;
  height: 47upx;
  line-height: 47upx;
  margin-top: 3upx;
  margin-left: 15upx;
  border-radius: 10upx;
  text-align: center;
  font-family: "Microsoft YaHei", "微软雅黑", sans-serif;
  font-size: 21upx;
  color: #000000;
  text-align: center;
}
.songListContainer {
  width: 100%;
  min-height: 56upx;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.songItemContainer {
  width: 96%;
  height: 216upx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-bottom: 2px dashed #fff;
}
.songItemContainer .centerNormal {
  width: 96%;
  height: 86%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  color: #000000;
  border: 0px solid red;
}
.songItemContainer .centerActive {
  width: 96%;
  height: 86%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  color: #f80303;
  background-color: #ffffff51;
  border: 1px solid rgb(208 204 204 / 49%);
  border-radius: 15upx;
  box-shadow: 2px 4px 1px 1px #8c838359;
}
.coverImage {
  width: 135upx;
  height: 135upx;
  margin-left: 3%;
  border-radius: 15upx;
}
.songItemInfoContainer {
  width: 71%;
  height: 135upx;
  margin-left: 3%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border: 0px solid red;
}
.songItemInfoContainer .songItemName {
  width: 96%;
  height: 33upx;
  line-height: 33upx;
  text-align: left;
  text-indent: 1%;
  font-size: 2vh;
  font-weight: 700;
  border: 0px solid red;
  margin-top: 2%;
}
.songItemInfoContainer .songItemLine {
  width: 96%;
  height: 17upx;
  line-height: 17upx;
  text-align: left;
  text-indent: 1%;
  font-size: 1.3vh;
  border: 0px solid red;
  margin-top: 2%;
}
</style>