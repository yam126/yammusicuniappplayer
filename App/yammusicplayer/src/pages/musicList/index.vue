<template>
  <view
    class="content"
    :style="{marginTop:statusBarHeight+'px',height:windowHeight+'px'}"
  >
    <drawer-menu
      ref="drawerMenu"
      :currentRoute="currentRoute"
    />
    <!--appBar-->
    <view
      ref="appBar"
      class="appBar"
    >
      <image
        class="MenuIcon"
        @click="showDrawer()"
        src="/static/menuIcon.png"
        mode="scaleToFill"
      />
      <view class="searchContainer">
        <input
          class="searchTextBox"
          placeholder="请输入歌曲名"
          v-model="SqlWhere"
        />
        <!--<font-awesome-icon
          @click="refresh()"
          class="searchButtonIcon"
          icon="search"
        />-->
        <image
          @click="refresh()"
          class="searchButtonIcon"
          src='/static/search.svg'
          mode="scaleToFill"
        />
      </view>
      <image
        @click="ScanCode()"
        class="appBarRightIcon"
        src="/static/scanMini.png"
        mode="scaleToFill"
      />
    </view>
    <!--/appBar-->
    <uni-load-more
      iconType="circle"
      v-if="upLoading"
      :status="uploadingStatus"
    ></uni-load-more>
    <scroll-view
      v-if="ErrorMsg==''"
      class="scrollViewContainer"
      scroll-y="true"
      @scrolltoupper="refresh()"
      @scrolltolower="onEndReached()"
      :style="{height:musicScrollHeight+'px'}"
    >
      <view
        v-for="(item,index) in PageData"
        :key="index"
        class="itemContainer"
        @click="gotoPlayPage(item.songId)"
      >
        <image
          class="cover"
          :src="item.cover"
          mode="scaleToFill"
        />
        <view class="info">
          <view class="title">{{ item.title }}</view>
          <view class="artist">{{ item.artist }}</view>
        </view>
        <image
          class="playIcon"
          src="../../static/play.png"
          mode="scaleToFill"
        />
      </view>
      <uni-load-more
        iconType="circle"
        v-if="lowLoading"
        :status="lowloadingStatus"
      ></uni-load-more>
    </scroll-view>
    <view
      @click="refresh()"
      v-if="ErrorMsg!==''"
      class="errorMsgContainer"
    >
      {{ErrorMsg}}点击刷新
    </view>
    <tabbar current="1"></tabbar>
  </view>
</template>

<script>
import DrawerMenu from '../../components/DrawerMenu.vue';
import tabbar from '../../components/tabbar.vue';
import { querySongInfoPage } from '../../api'
import { ScanCodeResultProcessing } from '../../ScanCode.js'
export default {
  components: {
    'drawer-menu': DrawerMenu,
    'tabbar': tabbar
  },
  data() {
    return {
      PageData: [],
      windowHeight: 0,
      windowWidth: 0,
      musicScrollHeight: 0,
      statusBarHeight: 0,
      PageSize: 20,
      CurPage: 1,
      SqlWhere: '',
      DataCount: 0,
      PageCount: 0,
      SortField: 'createdatetime',
      SortMethod: 'DESC',
      ErrorMsg: '',
      currentRoute: '',
      upLoading: true, // 上拉正在加载
      lowLoading: false, // 下拉正在加载
      hasMore: true, // 是否有更多数据
      uploadingStatus: 'loading',
      lowloadingStatus: 'loading',
      loadingHandleTimer: null,
      currentLoginUser: null,
      userId: ''
    }
  },
  onLoad(options) {
    this.resizeModel();
    this.getCurrentRoute();
  },
  onReady() {
    this.resizeModel();
    this.refresh();
    this.getCurrentRoute();
  },
  onResize(res) {
    this.resizeModel();
  },
  mounted: function () {
    this.resizeModel();
  },
  computed: {},
  methods: {
    GetLoginUser() {
      let that = this;
      that.currentLoginUser = that.$store.state.user;
      if (that.currentLoginUser == null) {
        uni.showToast({
          title: `没有登录不能扫码`,
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
    //扫码
    ScanCode() {
      let that = this;
      if (!that.GetLoginUser()) {
        uni.showToast({
          title: '没有登录不能扫码',
          icon: 'none'
        });
        return false;
      }
      uni.scanCode({
        success: (res) => {
          console.log('扫码结果：' + res.result);
          /*uni.showModal({
            title: '扫码结果',
            content: res.result,
            showCancel: false
          });*/
          ScanCodeResultProcessing(JSON.parse(res.result), that.currentLoginUser)
        },
        fail: (err) => {
          console.error('扫码失败：' + err);
          uni.showToast({
            title: '扫码失败',
            icon: 'none'
          });
        }
      });
    },
    getCurrentRoute() {
      let pages = getCurrentPages();
      let currentPage = pages[pages.length - 1];
      this.currentRoute = currentPage.route;
      console.log('getCurrentRoute', this.currentRoute);
    },
    gotoPlayPage(songId) {
      // 在当前页面的某个方法或事件中
      uni.setStorageSync('playPageParms', { songId: songId });
      uni.switchTab({
        url: `/pages/playerPage/index?songId=${songId}`
      });
    },
    //上拉加载事件
    onEndReached() {
      console.log('_onEndReached');
      let CurPage = this.CurPage;
      let PageCount = this.PageCount;
      let nomore = this.hasMore;
      let that = this;
      CurPage += 1;
      console.log('_onEndReached CurPage', CurPage);
      console.log('_onEndReached PageCount', PageCount);
      if (CurPage >= PageCount) {
        that.CurPage = PageCount;
        that.lowLoading = true;
        that.lowloadingStatus = 'noMore'
      } else {
        that.CurPage = CurPage;
        that.loadData();
      }
    },
    updateLoadingStatus(isLoading) {
      let that = this;
      if (isLoading) {
        if (that.upLoading == true && that.lowLoading == false) {
          that.uploadingStatus = 'loading';
          that.upLoading = true;
          that.lowLoading = false;
        } else if (that.upLoading == false && that.lowLoading == true) {
          that.upLoading = false;
          that.lowLoading = true;
          that.lowloadingStatus = 'loading';
        }
      } else {
        that.upLoading = false;
        that.lowLoading = false;
      }
    },
    loadData() {
      let that = this;
      that.upLoading = true;
      that.updateLoadingStatus(true);
      that.loadingHandleTimer = setTimeout(() => {
        clearTimeout(that.loadingHandleTimer);
        querySongInfoPage({
          parm: {
            SqlWhere: that.SqlWhere,
            SortField: that.SortField,
            SortMethod: that.SortMethod,
            PageSize: that.PageSize,
            CurPage: that.CurPage,
          },
          beforeCallBack: () => {
            that.updateLoadingStatus(true);
          },
          responseCallBack: res => {
            console.log('refresh res', res);
            that.lowloadingStatus = 'more';
            that.updateLoadingStatus(false);
            /*if (res != null && typeof (res) != 'undefined' && res.status == 200) {
              if (res.data != null && typeof (res.data) != 'undefined') {
                const { result, status, pageCount, recordCount, msg } = res.data;
                if (status == 0) {
                  that.PageCount = pageCount;
                  that.DataCount = recordCount;
                  if (recordCount > 0) {
                    if (result !== null && typeof result !== 'undefined') {
                      if (that.CurPage === 1) {
                        that.PageData = result;
                      } else if (
                        that.CurPage <= pageCount &&
                        that.PageData.length <= that.PageSize * that.CurPage
                      ) {
                        for (var i = 0; i < result.length; i++) {
                          that.PageData.push(result[i]);
                        }
                        that.hasMore = true;
                        that.lowloadingStatus = 'more';
                      } else {
                        that.hasMore = false;
                        that.lowLoading = true;
                        that.lowloadingStatus = 'noMore';
                      }
                    }
                  }
                } else {
                  that.ErrorMsg = `数据加载出错,原因[${msg}]`;
                }
              } else {
                that.ErrorMsg = '数据为空,点击刷新';
              }
            }
            else {
              that.ErrorMsg = res.statusText;
            }*/
            if (res != null && typeof (res) != 'undefined') {
              const { result, status, pageCount, recordCount, msg } = res;
              if (status == 0) {
                that.PageCount = pageCount;
                that.DataCount = recordCount;
                if (recordCount > 0) {
                  if (result !== null && typeof result !== 'undefined') {
                    if (that.CurPage === 1) {
                      that.PageData = result;
                    } else if (
                      that.CurPage <= pageCount &&
                      that.PageData.length <= that.PageSize * that.CurPage
                    ) {
                      for (var i = 0; i < result.length; i++) {
                        that.PageData.push(result[i]);
                      }
                      that.hasMore = true;
                      that.lowloadingStatus = 'more';
                    } else {
                      that.hasMore = false;
                      that.lowLoading = true;
                      that.lowloadingStatus = 'noMore';
                    }
                  }
                }
              } else {
                that.ErrorMsg = `数据加载出错,原因[${msg}]`;
              }
            } else {
              that.ErrorMsg = '数据为空,点击刷新';
            }
          },
          errorCallback: error => {
            console.log('refresh error', error);
          }
        });
      }, 1000);
    },
    refresh() {
      this.CurPage = 1;
      this.PageData = [];
      this.loadData();
    },
    showDrawer() {
      console.log('showDrawer');
      this.$refs.drawerMenu.showDrawer();
    },
    resizeModel() {
      let that = this;
      uni.getSystemInfo({
        success: res => {
          that.windowHeight = res.windowHeight - res.statusBarHeight;
          that.windowWidth = res.windowWidth;
          that.statusBarHeight = res.statusBarHeight;
          try {
            const query = uni.createSelectorQuery().in(that);
            let appBar = query.select('.appBar');
            appBar.boundingClientRect(data => {
              if (data) {
                const appBarHeight = data.height;
                that.musicScrollHeight = that.windowHeight - appBarHeight;
                //that.resizeTabBar();
              }
            }).exec();
          } catch (e) {
            console.log('resizeModel exception', e)
          }
        }
      });
    },
    resizeTabBar() {
      let that = this;
      const query = uni.createSelectorQuery().in(that);
      let tabbar = query.select('.tabbar');
      tabbar.boundingClientRect(data => {
        if (data) {
          that.musicScrollHeight -= data.height;
        }
      }).exec();
    }
  },
  watch: {}
}
</script>

<style scoped>
.MenuIcon {
  width: 23upx;
  height: 23upx;
  margin-top: 12upx;
  margin-left: 15upx;
  cursor: pointer;
}
@media (max-width: 370px) {
  .MenuIcon {
    width: 35upx;
    height: 35upx;
    margin-top: 13upx;
    margin-left: 15upx;
    cursor: pointer;
    border: 0px solid red;
  }
  .appBar .searchContainer {
    width: 82%;
    height: 45upx;
    margin-top: 7upx;
    margin-left: 15upx;
    border-radius: 10upx;
    background-color: #fff;
    border: 1px solid #ccc;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  .appBar .searchTextBox {
    width: 88%;
    height: 37upx;
    margin-left: 2%;
    border: 0px solid red;
  }
  .appBar .appBarRightIcon {
    width: 35upx;
    height: 35upx;
    margin-top: 13upx;
    margin-left: 15upx;
    cursor: pointer;
  }
}
.forwardiconContainer {
  width: 55upx;
  height: 55upx;
  cursor: pointer;
  border: 0px solid red;
}
.searchContainer {
  width: 88%;
  height: 41upx;
  margin-top: 3upx;
  margin-left: 15upx;
  border-radius: 10upx;
  background-color: #fff;
  border: 1px solid #ccc;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.searchTextBox {
  width: 91%;
  height: 37upx;
  margin-left: 2%;
  border: 0px solid red;
}
.searchButtonIcon {
  width: 15px;
  height: 15px;
  margin-left: 1%;
  cursor: pointer;
}
.scrollViewContainer {
  width: 100%;
  border: 0px solid red;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  overflow: auto;
}
.errorMsgContainer {
  width: 100%;
  display: flex;
  font-size: 3vh;
  color: black;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 0px solid red;
}
.itemContainer {
  width: 96%;
  margin-left: 2%;
  height: 115upx;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
  border-bottom: 1px solid #ccc;
}
.itemContainer .cover {
  width: 75upx;
  height: 75upx;
  margin-left: 3%;
  border-radius: 10upx;
}
.itemContainer .info {
  width: 78%;
  height: 84upx;
  margin-left: 1%;
  border: 0px solid red;
}
.itemContainer .info .title {
  width: 100%;
  height: 23upx;
  font-size: 2.2vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  font-weight: bold;
  color: black;
  text-indent: 1%;
  border: 0px solid red;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  height: 35upx;
}
.itemContainer .info .artist {
  width: 100%;
  height: 23upx;
  font-size: 2vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  font-weight: bold;
  color: #9f9797;
  text-indent: 1%;
  border: 0px solid red;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  height: 35upx;
}
.itemContainer .playIcon {
  width: 35upx;
  height: 35upx;
  margin-left: 1%;
}
.uni-scroll-view,
.uni-scroll-view-content {
  width: 100%;
  height: 100%;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  flex-direction: column !important;
}
</style>