<template>
  <view class="MusicContainer">
    <uni-load-more
      v-if="upLoading"
      iconType="circle"
      :status="uploadingStatus"
      :showText="false"
    ></uni-load-more>
    <scroll-view
      class="scrollViewContainer"
      scroll-y="true"
      @scrolltoupper="refresh()"
      @scrolltolower="onEndReached()"
    >
      <uni-load-more
        v-if="upLoading"
        iconType="circle"
        :status="uploadingStatus"
        :showText="false"
      ></uni-load-more>
      <view
        class="MusicItemContainer"
        v-for="(item,index) in PageData"
        :key="index"
        @click="gotoPlayPage(item.songId)"
      >
        <image
          class="MusicCover"
          :src="item.cover"
          mode="scaleToFill"
        />
        <view class="MusicInfo">
          <view class="Title">{{ item.title }}</view>
          <view class="Artist">{{ item.artist }}</view>
        </view>
      </view>
      <uni-load-more
        iconType="circle"
        v-if="lowLoading"
        :status="lowloadingStatus"
      ></uni-load-more>
    </scroll-view>
  </view>
</template>

<script>
import { querySongInfoPage } from '../api'
export default {
  name: 'AlbumMusicList',
  props: {
    albumId: String
  },
  data() {
    return {
      PageData: [],
      PageSize: 10,
      CurPage: 1,
      SqlWhere: '',
      DataCount: 0,
      PageCount: 0,
      iconSize: 39,
      SortField: 'createdatetime',
      SortMethod: 'ASC',
      ErrorMsg: '',
      firstLoading: true,
      upLoading: true, // 上拉正在加载
      lowLoading: false, // 下拉正在加载
      hasMore: true, // 是否有更多数据
      uploadingStatus: 'loading',
      lowloadingStatus: 'loading'
    }
  },
  onLoad() {
    this.loadData();
  },
  onReady() {
    this.loadData();
  },
  onResize(res) { },
  mounted: function () {
    this.loadData();
  },
  methods: {
    PlayAll() {
      let that = this;
      if (this.PageData != null && typeof (this.PageData) != 'undefined' && this.PageData.length > 0) {
        let songId = that.PageData[0].songId;
        that.gotoPlayPage(songId)
      }
    },
    gotoPlayPage(songId) {
      console.log('gotoPlayPage songId', songId)
      // 在当前页面的某个方法或事件中
      uni.setStorageSync('playPageParms', { songId: songId });
      uni.switchTab({
        url: `/pages/playerPage/index?songId=${songId}`
      });
    },
    changeSortMethod(sortMethod) {
      this.SortMethod = sortMethod;
      this.refresh();
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
    loadData() {
      let that = this;
      that.upLoading = true;
      that.SqlWhere = `albumId|${that.$props.albumId}`;
      console.log('loadData that.SqlWhere', that.SqlWhere);
      querySongInfoPage({
        parm: {
          SqlWhere: that.SqlWhere,
          SortField: that.SortField,
          SortMethod: that.SortMethod,
          PageSize: that.PageSize,
          CurPage: that.CurPage,
        },
        beforeCallBack: () => {
          that.upLoading = true;
        },
        responseCallBack: res => {
          that.upLoading = false;
          that.lowloadingStatus = 'more';
          console.log('querySongInfoPage res', res)
          /*if (res != null && typeof (res) != 'undefined' && res.status == 200) {

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
              /*uni.showToast({
                title: `数据加载出错,原因1[${msg}]`,
                position: 'center',
                icon: 'fail',
                duration: 2000
              });*/
            }
          }
        },
        errorCallback: error => {
          console.log('refresh error', error);
          uni.showToast({
            title: `数据加载出错,原因2[${error}]`,
            position: 'center',
            icon: 'fail',
            duration: 2000
          });
        }
      });
    }
  }
}
</script>


<style scoped>
.MusicContainer {
  width: 100%;
  height: 100%;
  background-color: transparent;
}
.MusicContainer .loadContainer {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: transparent;
}
.MusicContainer .scrollViewContainer {
  width: 100%;
  height: 50vh;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: transparent;
  border: 0px solid red;
}
.MusicContainer .scrollViewContainer .MusicItemContainer {
  width: 96%;
  height: 115upx;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-left: 2%;
  border-top: 1px solid #ccc;
}
.MusicContainer .scrollViewContainer .MusicItemContainer:hover {
  cursor: pointer;
  background: linear-gradient(160deg, #6186e3, #78e2ff);
}
.MusicContainer .scrollViewContainer .MusicItemContainer .MusicCover {
  width: 87upx;
  height: 87upx;
  border-radius: 10upx;
  margin-top: 0.3%;
  margin-left: 3%;
}
.MusicContainer .scrollViewContainer .MusicItemContainer .MusicInfo {
  width: 76%;
  height: 89upx;
  margin-top: 0.3%;
  margin-left: 1%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border: 0px solid red;
}
.MusicContainer .scrollViewContainer .MusicItemContainer .MusicInfo .Title {
  width: 96%;
  height: 41upx;
  line-height: 41upx;
  text-align: left;
  font-size: 1.8vh;
  color: #000;
  font-weight: 700;
  text-indent: 1%;
  margin-top: 1%;
  border: 0px solid red;
}
.MusicContainer
  .scrollViewContainer
  .MusicItemContainer:hover
  .MusicInfo
  .Title {
  color: #fff;
}
.MusicContainer .scrollViewContainer .MusicItemContainer .MusicInfo .Artist {
  width: 96%;
  height: 32upx;
  line-height: 32upx;
  text-align: left;
  font-size: 1.5vh;
  color: #000;
  text-indent: 1%;
  margin-top: 1%;
  border: 0px solid red;
}
.MusicContainer
  .scrollViewContainer
  .MusicItemContainer:hover
  .MusicInfo
  .Artist {
  color: #fff;
}
</style>