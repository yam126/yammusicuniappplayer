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
      <!--<font-awesome-icon
        class="forwardicon"
        icon="bars"
        @click="showDrawer()"
      />-->
      <image
        class="MenuIcon"
        @click="showDrawer()"
        src="/static/menuIcon.png"
        mode="scaleToFill"
      />
      <view class="searchContainer">
        <input
          class="searchTextBox"
          placeholder="请输入专辑名"
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
        class="albumItemContainer"
        @click="gotoAlbumInfo(item.albumId)"
      >
        <!--专辑信息-->
        <view class="albumInfo">
          <image
            class="albumCover"
            :src="item.albumCover===''?nocover:item.albumCover"
          />
          <view class="briefInfo">
            <view class="title">专辑名称:{{item.albumName}}</view>
            <view class="line">数量:{{item.songLength}}</view>
            <view class="line">作者:{{item.albumAuthor}}</view>
          </view>
        </view>
        <!--/专辑信息-->
        <album-song-list :albumId="item.albumId" />
      </view>
    </scroll-view>
    <uni-load-more
      iconType="circle"
      v-if="lowLoading"
      :status="lowloadingStatus"
    ></uni-load-more>
    <tabbar current="3"></tabbar>
  </view>
</template>

<script>
import albumSongList from '../albums/albumSongList.vue'
import DrawerMenu from '../../components/DrawerMenu.vue';
import tabbar from '../../components/tabbar.vue'
import { ScanCodeResultProcessing } from '../../ScanCode.js'
import {
  queryAlbumPage
} from '../../api'
export default {
  components: {
    'drawer-menu': DrawerMenu,
    'tabbar': tabbar,
    'album-song-list': albumSongList
  },
  data() {
    return {
      PageData: [],
      PageSize: 10,
      CurPage: 1,
      SqlWhere: '',
      DataCount: 0,
      PageCount: 0,
      nocover: '../../static/NoCover.png',
      SortField: 'createdatetime',
      SortMethod: 'DESC',
      ErrorMsg: '',
      currentRoute: '',
      musicScrollHeight: 0,
      windowHeight: 0,
      windowWidth: 0,
      statusBarHeight: 0,
      upLoading: true, // 上拉正在加载
      lowLoading: false, // 下拉正在加载
      hasMore: true, // 是否有更多数据
      uploadingStatus: 'loading',
      lowloadingStatus: 'loading',
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
    gotoAlbumInfo(albumId) {
      uni.setStorageSync('albumInfoId', {
        albumId: albumId
      });
      uni.navigateTo({
        url: '/pages/albums/albumInfo?albumId=' + albumId
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
    },
    loadData() {
      let that = this;
      //if (that.CurPage == 1) {
      //  uni.showLoading({
      //    title: '加载中'
      //  });
      //}
      queryAlbumPage({
        parm: {
          SqlWhere: that.SqlWhere,
          SortField: that.SortField,
          PageSize: that.PageSize,
          CurPage: that.CurPage,
        },
        beforeCallBack: () => { },
        responseCallBack: res => {
          that.upLoading = false;
          //if (that.CurPage == 1) {
          //  uni.hideLoading();
          //}
          if (res != null && typeof (res) != 'undefined') {
            const {
              result,
              status,
              pageCount,
              recordCount,
              msg
            } = res;
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
                    //that.hasMore = true;
                    //that.lowloadingStatus = 'more';
                  } else {
                    //that.hasMore = false;
                    //that.lowLoading = true;
                    //that.lowloadingStatus = 'noMore';
                  }
                }
              }
            } else {
              uni.showToast({
                title: `数据加载出错,原因[${msg}]`,
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

.albumItemContainer {
  width: 100%;
  height: 325upx;
  margin-top: 5%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: #fff;
  border-top: 1px solid #585252;
  border-bottom: 1px solid #585252;
}

.albumItemContainer .albumInfo {
  width: 96%;
  height: 155upx;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  border-bottom: 1px solid #ccc;
}

.albumItemContainer .albumInfo .albumCover {
  width: 125upx;
  height: 125upx;
  margin-left: 3%;
  border-radius: 15%;
}

.albumItemContainer .albumInfo .albumCover {
  width: 125upx;
  height: 125upx;
  margin-left: 3%;
  border-radius: 15%;
}

.albumItemContainer .albumInfo .briefInfo {
  width: 75%;
  height: 125upx;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border: 0px solid red;
  margin-left: 3%;
}

.albumItemContainer .albumInfo .briefInfo .title {
  width: 98%;
  height: 33upx;
  line-height: 33upx;
  margin-top: 1%;
  font-size: 25upx;
  color: #000;
  font-weight: 700;
  text-align: left;
  text-indent: 1%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border: 0px solid red;
}

.albumItemContainer .albumInfo .briefInfo .line {
  width: 98%;
  height: 26upx;
  line-height: 26upx;
  margin-top: 2%;
  font-size: 21upx;
  color: #000;
  text-align: left;
  text-indent: 1%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  background-color: #f2f2f2;
}
</style>