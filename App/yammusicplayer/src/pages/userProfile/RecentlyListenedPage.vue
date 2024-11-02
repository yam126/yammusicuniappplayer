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
        @click="gotoPlayPage(item.songId)"
        class="musicItem"
      >
        <image
          class="cover"
          :src="item.cover"
          mode="scaleToFill"
        />
        <view class="musicInfo">
          <view
            :title="item.title"
            class="musicName"
          >{{ item.title }}</view>
          <view
            :title="item.artist"
            class="artist"
          >{{item.artist}}</view>
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
import { GetRecentlyListenedPage } from '../../api'
export default {
  name: 'RecentlyListenedPage',
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
      SortField: 'CreatedDataTime',
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
    gotoPlayPage(songId) {
      console.log('gotoPlayPage songId', songId)
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
    refresh() {
      this.CurPage = 1;
      this.PageData = [];
      this.loadData();
    },
    loadData() {
      let that = this;
      that.upLoading = true;
      GetRecentlyListenedPage({
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
          console.log('GetRecentlyListenedPage res', res)
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
          console.log('GetRecentlyListenedPage error', error);
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
.scrollViewContainer .musicItem {
  width: 96%;
  height: 135upx;
  margin-left: 2%;
  margin-top: 6%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  background-color: aliceblue;
  border-radius: 10upx;
  box-shadow: 3px 5px 0px 2px #5d5e6cb0;
}
.scrollViewContainer .musicItem .cover {
  width: 107upx;
  height: 107upx;
  margin-top: 1%;
  margin-left: 3%;
  border-radius: 10upx;
}
.scrollViewContainer .musicItem .musicInfo {
  width: 73%;
  height: 107upx;
  margin-top: 1%;
  margin-left: 1%;
  display: flex;
  cursor: pointer;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border: 0px solid red;
}
.scrollViewContainer .musicItem:hover {
  cursor: pointer;
  background: linear-gradient(157deg, #84fab0, #8fd3f4);
}
.scrollViewContainer .musicItem .musicInfo .musicName {
  width: 98%;
  height: 50upx;
  line-height: 50upx;
  text-indent: 1%;
  font-weight: 700;
  font-size: 2.5vh;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  color: #2d11119b;
  margin-top: 2%;
  border: 0px solid red;
}
.scrollViewContainer .musicItem:hover .musicInfo .musicName {
  color: #fff;
}
.scrollViewContainer .musicItem .musicInfo .artist {
  width: 98%;
  height: 30upx;
  line-height: 30upx;
  text-indent: 1%;
  font-size: 1.5vh;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  color: #4a4848d5;
  margin-top: 2%;
  border: 0px solid red;
}
.scrollViewContainer .musicItem:hover .musicInfo .artist {
  color: #fff;
}
</style>