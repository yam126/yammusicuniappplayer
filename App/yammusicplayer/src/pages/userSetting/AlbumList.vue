<template>
  <view class="listContainer">
    <uni-load-more
      iconType="circle"
      v-if="upLoading"
      :status="uploadingStatus"
    ></uni-load-more>
    <scroll-view
      class="scrollViewContainer"
      scroll-y="true"
      @scrolltoupper="refresh()"
      @scrolltolower="onEndReached()"
    >
      <view
        v-for="(item,index) in PageData"
        :key="index"
        class="itemContainer"
      >
        <view
          @click="gotoAlbumInfo(item.albumId)"
          class="userInfo"
        >
          <image
            class="userFace"
            :src="item.albumCover===''?nocover:item.albumCover"
            mode="scaleToFill"
          />
          <view class="userInfoData">
            <view class="userName">
              {{ item.albumName }}
            </view>
            <view class="tipsLabel">
              {{ item.albumAuthor }}
            </view>
            <view class="tipsLabel">
              {{ item.createdatetime }}
            </view>
          </view>
        </view>
        <album-song-list :albumId="item.albumId" />
      </view>
    </scroll-view>
    <uni-load-more
      iconType="circle"
      v-if="lowLoading"
      :status="lowloadingStatus"
    ></uni-load-more>
  </view>
</template>

<script>
import albumSongList from '../albums/albumSongList.vue'
import { queryAlbumPage } from '../../api';
export default {
  name: 'AlbumList',
  components: {
    'album-song-list': albumSongList
  },
  props: {
    userId: String
  },
  data() {
    return {
      PageSize: 10,
      CurPage: 1,
      PageData: null,
      DataCount: 0,
      PageCount: 0,
      SortField: 'createdatetime',
      SortMethod: 'DESC',
      upLoading: true, // 上拉正在加载
      lowLoading: false, // 下拉正在加载
      hasMore: true, // 是否有更多数据
      uploadingStatus: 'loading',
      lowloadingStatus: 'loading',
      nocover: '../../static/NoCover.png',
      isLoading: false,
      upLoading: false,
      userId: ''
    };
  },
  onLoad(options) {
    this.loadData();
  },
  onReady() {
    this.loadData();
  },
  onShow() {
    this.loadData();
  },
  onResize(res) {
  },
  mounted: function () {
    this.loadData();
  },
  methods: {
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
    loadData() {
      let that = this;
      that.isLoading = true;
      let UserId = that.userId;
      queryAlbumPage({
        parm: {
          SqlWhere: `userid|[${UserId}]`,
          SortField: that.SortField,
          SortMethod: that.SortMethod,
          PageSize: that.PageSize,
          CurPage: that.CurPage,
        },
        beforeCallBack: () => {
          that.isLoading = true;
        },
        responseCallBack: res => {
          that.upLoading = false;
          console.log('queryAlbumPage res', res);
          if (res != null && typeof (res) != 'undefined') {
            const { result, status, pageCount, recordCount, msg } = res;
            if (status == 0) {
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
        }
      })
    }
  }
}
  </script>
  
  <style scoped>
.listContainer {
  width: 100%;
  height: 100%;
  background-color: #f2f2f2;
}
.scrollViewContainer {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.uni-scroll-view-content {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.itemContainer {
  width: 96%;
  height: 325upx;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 15upx;
  margin-left: 2%;
  margin-top: 5%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  box-shadow: 2px 4px 1px 1px #8c838359;
}
.itemContainer:hover {
  cursor: pointer;
  background: linear-gradient(to right, #d3cce3, #e9e4f0);
}
.itemContainer .songInfo {
  width: 96%;
  height: 150upx;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  border: 0px solid red;
}
.itemContainer .songInfo .cover {
  width: 109upx;
  height: 109upx;
  border-radius: 5upx;
  margin-top: 1%;
  margin-left: 2%;
}
.itemContainer .songInfo .songInfoData {
  width: 75%;
  height: 109upx;
  margin-top: 1%;
  margin-left: 2%;
  border: 0px solid red;
}
.itemContainer .songInfo .songInfoData .songTitle {
  width: 100%;
  height: 51upx;
  line-height: 51upx;
  font-size: 2.5vh;
  text-align: left;
  text-indent: 1%;
  font-weight: 800;
  color: #000;
  text-overflow: ellipsis;
  overflow: hidden;
  border: 0px solid red;
}
.itemContainer .songInfo .songInfoData .songArtist {
  width: 100%;
  height: 47upx;
  line-height: 47upx;
  font-size: 1.9vh;
  text-align: left;
  text-indent: 1%;
  color: #000;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-top: 1%;
  border: 0px solid red;
}
.itemContainer .userInfo {
  width: 96%;
  height: 138upx;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  border-bottom: 2px solid #ccc;
}
.itemContainer .userInfo .userFace {
  width: 85upx;
  height: 85upx;
  margin-top: 2%;
  margin-left: 3%;
}
.itemContainer .userInfo .userInfoData {
  width: 82%;
  height: 95upx;
  margin-left: 1%;
  border: 0px solid red;
}
.itemContainer .userInfo .userInfoData .userName {
  width: 100%;
  height: 36upx;
  line-height: 36upx;
  text-align: left;
  text-indent: 2%;
  font-size: 1.5vh;
  font-weight: 700;
  text-overflow: ellipsis;
  color: #000;
  white-space: nowrap;
  overflow: hidden;
  border: 0px solid red;
}
.itemContainer .userInfo .userInfoData .tipsLabel {
  width: 100%;
  height: 37upx;
  line-height: 37upx;
  text-align: left;
  text-indent: 2%;
  font-size: 1.5vh;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  color: #000;
  border: 0px solid red;
}
</style>