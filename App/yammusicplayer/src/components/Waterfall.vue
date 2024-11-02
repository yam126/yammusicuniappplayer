<template>
  <view class="waterfall">
    <view
      v-if="isError"
      @click="loadData"
      class="waterfallErrorContainer"
    >
      加载出错,点击刷新
    </view>
    <view
      v-if="isLoading"
      class="waterfallLoadContainer"
    >
      <uni-load-more
        :status="loadStatus"
        :iconSize="iconSize"
        iconType="circle"
        :showText="false"
      ></uni-load-more>
    </view>
    <view
      v-if="!isError&&!isLoading"
      class="waterfallDataContainer"
    >
      <view
        v-for="(item,index) in PageData"
        :key="index"
        @click="gotoAlbumInfo(item.albumId)"
        class="waterfall-item"
        :style="{height:item.height+'upx'}"
      >
        <image
          :src="item.albumCover===''?nocover:item.albumCover"
          mode="scaleToFill"
        />
        <view class="title">{{ item.albumName }}</view>
      </view>
    </view>
    <uni-load-more
      iconType="circle"
      v-if="lowLoading"
      :status="lowloadingStatus"
    ></uni-load-more>
  </view>
</template>

<script>
import { recentlylistenedAlbum, queryAlbumPage } from '../api';
export default {
  name: 'Waterfall',
  data() {
    return {
      PageData: [],
      PageSize: 10,
      CurPage: 1,
      SqlWhere: '',
      DataCount: 0,
      PageCount: 0,
      SortField: 'createdatetime',
      SortMethod: 'DESC',
      loadStatus: 'loading',
      lowLoading: false, // 下拉正在加载
      hasMore: true, // 是否有更多数据
      uploadingStatus: 'loading',
      lowloadingStatus: 'loading',
      iconSize: 35,
      isLoading: true,
      isError: false,
      autoplay: true,
      circular: true,
      indicatorDots: true,
      recentlyData: [],
      nocover: '../static/NoCover.png',
      waterfallMinHeight: 335,
      waterfailMaxHeight: 537
    }
  },
  onLoad() {
    this.loadPageData();
  },
  mounted: function () {
    let that = this;
    this.loadPageData();
    uni.$on('onReachBottom', () => {
      console.log('触发触底');
      that.onEndReached();
    })
    uni.$on('onReachTop', () => {
      console.log('触发顶部');
      that.refresh();
    })
  },
  methods: {
    refresh() {
      this.CurPage = 1;
      this.PageData = [];
      this.loadPageData();
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
        that.lowLoading = true;
        that.CurPage = CurPage;
        that.loadPageData();
      }
    },
    loadPageData() {
      let that = this;
      queryAlbumPage({
        parm: {
          SqlWhere: that.SqlWhere,
          SortField: that.SortField,
          PageSize: that.PageSize,
          CurPage: that.CurPage,
        },
        beforeCallBack: () => {
          if (that.PageData.length <= 0) {
            that.isLoading = true
          }
        },
        responseCallBack: res => {
          that.isLoading = false;
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
                that.isError = false;
                that.recentlyData = result;
                that.initWaterFall();
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
    },
    loadData() {
      let that = this;
      recentlylistenedAlbum({
        parm: { limit: 10, userId: '' },
        beforeCallBack: () => { that.isLoading = true },
        responseCallBack: resData => {
          that.isLoading = false;
          console.log('recentlylistenedAlbum resData', resData);
          if (resData != null && typeof (resData) != 'undefined') {
            const { result, status, msg } = resData;
            if (status !== 0) {
              that.isError = true;
              uni.showToast({
                title: `获取常听专辑失败,原因[${msg}]`,
                position: 'center',
                icon: 'fail',
                duration: 2000
              });
              return false;
            }
            that.isError = false;
            that.recentlyData = result;
            that.initWaterFall();
          }
        },
        errorCallback: error => {
          uni.showToast({
            title: `获取常听专辑失败,原因[${error}]`,
            position: 'center',
            icon: 'fail',
            duration: 2000
          });
        }
      });
    },
    initWaterFall() {
      let that = this;
      let width = parseInt(100 / 2) - 5;
      for (var i = 0; i < that.recentlyData.length; i++) {
        let height = Math.floor(Math.random() * (that.waterfailMaxHeight - that.waterfallMinHeight + 1)) + that
          .waterfallMinHeight;
        that.recentlyData[i].width = width;
        that.recentlyData[i].height = height;
      }
    }
  }
}
</script>

<style scoped>
.waterfallErrorContainer {
  width: 100%;
  height: 325upx;
  line-height: 325upx;
  font-size: 3vh;
  color: #ccc;
  text-align: center;
  cursor: pointer;
  font-weight: 700;
}
.waterfallLoadContainer {
  width: 100%;
  height: 325upx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 0px solid red;
}

.waterfallDataContainer {
  width: 100%;
  height: auto;
  min-height: 125upx;
  column-count: 2;
  column-gap: 1em;
}

.waterfall {
  width: 98%;
  height: auto;
  min-height: 125upx;
  margin-top: 19upx;
  margin-left: 1%;
  border: 0px solid red;
}

.waterfall-item {
  break-inside: avoid;
  margin-bottom: 10upx;
  margin-top: 20upx;
  margin-right: 5upx;
  border: 1px solid #ccc;
  background-color: #fff;
  border-radius: 15upx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 2px 4px 1px 1px #8c838359;
}

.waterfall-item image {
  width: 93%;
  height: 85%;
  margin-top: 5upx;
  border-radius: 15upx;
}

.waterfall-item .title {
  width: 93%;
  height: 35upx;
  line-height: 35upx;
  margin-top: 7upx;
  font-size: 21upx;
  color: #000;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border: 0px solid red;
}

.waterfall-item-space {
  background-color: transparent;
}
</style>