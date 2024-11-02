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
        @click="gotoPlayPage(item.songId)"
      >
        <image
          class="cover"
          :src="item.cover"
          mode="scaleToFill"
        />
        <view class="info">
          <view class="title">{{item.title}}</view>
          <view class="author">{{item.albumAuthor}}</view>
        </view>
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
import { GetRecentlyListenedPage } from '../../api';
export default {
  name: 'ListenHistory',
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
      SortField: 'CreatedDataTime',
      SortMethod: 'DESC',
      upLoading: true, // 上拉正在加载
      lowLoading: false, // 下拉正在加载
      hasMore: true, // 是否有更多数据
      uploadingStatus: 'loading',
      lowloadingStatus: 'loading',
    }
  },
  onLoad(options) {
    this.loadData();
  },
  onReady() {
    this.loadData();
  },
  onResize(res) {
  },
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
      that.isLoading = true;
      let UserId = that.userId;
      GetRecentlyListenedPage({
        parm: {
          UserId: UserId,
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
          console.log('GetRecentlyListenedPage res', res);
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
}
.scrollViewContainer {
  width: 100%;
  height: 100%;
}
.uni-scroll-view-content {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.scrollViewContainer .itemContainer {
  width: 98%;
  height: 123upx;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-left: 2%;
  cursor: pointer;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
}
.scrollViewContainer .itemContainer:hover {
  background: linear-gradient(to right, #d3cce3, #e9e4f0);
}
.scrollViewContainer .itemContainer .cover {
  width: 89upx;
  height: 89upx;
  margin-left: 1%;
}
.scrollViewContainer .itemContainer .info {
  width: 85%;
  height: 120upx;
  margin-left: 1%;
  border: 0px solid red;
}
.scrollViewContainer .itemContainer .info .title {
  width: 100%;
  height: 43upx;
  line-height: 43upx;
  text-align: left;
  text-indent: 1%;
  font-size: 2vh;
  font-weight: bold;
  color: #000;
  margin-top: 2%;
  border: 0px solid red;
}
.scrollViewContainer .itemContainer .info .author {
  width: 100%;
  height: 25upx;
  line-height: 25upx;
  text-align: left;
  text-indent: 1%;
  font-size: 1.3vh;
  color: #857c7cc7;
  margin-top: 2%;
  border: 0px solid red;
}
</style>