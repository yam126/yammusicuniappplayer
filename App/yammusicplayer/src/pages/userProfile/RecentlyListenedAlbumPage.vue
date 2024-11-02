<template>
  <view :style="{height:SelfHeight,width:SelfWidth}">
    <scroll-view
      class="scrollViewContainer"
      scroll-y="true"
      @scrolltoupper="refresh()"
      @scrolltolower="onEndReached()"
    >
      <uni-load-more
        iconType="circle"
        v-if="upLoading"
        :status="uploadingStatus"
      ></uni-load-more>
      <view
        v-for="(item,index) in PageData"
        :key="index"
        class="albumItem"
      >
        <view
          @click="gotoAlbumInfo(item.albumId)"
          class="albumInfo"
        >
          <image
            class="cover"
            :src="item.albumCover"
            mode="scaleToFill"
          />
          <view class="info">
            <view
              :title="item.albumName"
              class="albumName"
            >{{ item.albumName }}</view>
            <view
              :title="item.albumAuthor"
              class="albumAuthor"
            >{{ item.albumAuthor }}</view>
            <view
              :title="item.createdatetime"
              class="albumAuthor"
            >创建时间:{{ item.createdatetime }}</view>
          </view>
        </view>
        <album-song-list :albumId="item.albumId" />
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
import albumSongList from '../albums/albumSongList.vue';
import { QueryRecentlyListenedAlbumPage } from '../../api';
export default {
  name: 'RecentlyListenedAlbumPage',
  components: {
    'album-song-list': albumSongList
  },
  props: {
    SelfWidth: {
      type: String,
      default: ''
    },
    SelfHeight: {
      type: String,
      default: ''
    },
    UserId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      upLoading: false, // 上拉正在加载
      uploadingStatus: 'loading',
      PageData: [],
      PageSize: 10,
      CurPage: 1,
      SqlWhere: '',
      DataCount: 0,
      PageCount: 0,
      SortField: 'createdatetime',
      SortMethod: 'DESC',
      lowLoading: false, // 下拉正在加载
      hasMore: true, // 是否有更多数据
      lowloadingStatus: 'loading'
    }
  },
  onLoad(query) {
    this.loadData();
  },
  onShow() {
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
      that.upLoading = true;
      QueryRecentlyListenedAlbumPage({
        parm: {
          UserId: that.UserId,
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
          console.log('QueryRecentlyListenedAlbumPage res', res)
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
              uni.showToast({
                title: `数据加载出错,原因1[${msg}]`,
                position: 'center',
                icon: 'fail',
                duration: 2000
              });
            }
          }
        },
        errorCallback: error => {
          console.log('QueryRecentlyListenedAlbumPage error', error);
          uni.showToast({
            title: `数据加载出错,原因[${error}]`,
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
.scrollViewContainer {
  width: 100%;
  height: 96%;
  border-radius: 12upx;
  background-color: #cccccc67;
}
.scrollViewContainer .albumItem {
  width: 96%;
  height: 275upx;
  margin-left: 2%;
  margin-top: 6%;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: aliceblue;
  border-radius: 10upx;
  box-shadow: 3px 5px 0px 2px #5d5e6cb0;
}
.scrollViewContainer .albumItem:hover {
  cursor: pointer;
  background: linear-gradient(157deg, #84fab0, #8fd3f4);
}
.scrollViewContainer .albumItem .albumInfo {
  width: 96%;
  height: 135upx;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  border-bottom: 2px solid #ccc;
}
.scrollViewContainer .albumItem .albumInfo .cover {
  width: 105upx;
  height: 105upx;
  margin-top: 2%;
  margin-left: 2%;
  border-radius: 13upx;
}
.scrollViewContainer .albumItem .albumInfo .info {
  width: 75%;
  height: 125upx;
  margin-top: 2%;
  margin-left: 1%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border: 0px solid red;
}
.scrollViewContainer .albumItem .albumInfo .info .albumName {
  width: 98%;
  height: 35upx;
  line-height: 35upx;
  font-size: 2.3vh;
  text-indent: 1%;
  font-weight: 700;
  margin-top: 1%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  color: #683a2eb2;
  border: 0px solid red;
}
.scrollViewContainer .albumItem:hover .albumInfo .info .albumName {
  color: #fff;
}
.scrollViewContainer .albumItem .albumInfo .info .albumAuthor {
  width: 98%;
  height: 35upx;
  line-height: 35upx;
  font-size: 1.7vh;
  text-indent: 1%;
  margin-top: 1%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  color: #4f4b9c;
  border: 0px solid red;
}
.scrollViewContainer .albumItem:hover .albumInfo .info .albumAuthor {
  color: #fff;
}
</style>