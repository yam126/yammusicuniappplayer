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
        <view class="userInfo">
          <image
            class="userFace"
            :src="item.shareUserFace"
            mode="scaleToFill"
          />
          <view
            @click="gotoUserProfile(item.shareTarget)"
            class="userInfoData"
          >
            <view class="userName">
              {{ item.shareTargetUserName }}
            </view>
            <view class="tipsLabel">
              分享了歌曲
            </view>
          </view>
          <view
            v-if="item.isFriend !== 'true'"
            class="addFriend"
            @click="JoinFriend(item.shareTarget )"
          >
            +&nbsp;加为好友
          </view>
        </view>
        <view
          @click="gotoPlayPage(item.songId)"
          class="songInfo"
        >
          <image
            class="cover"
            :src="item.cover"
            mode="scaleToFill"
          />
          <view class="songInfoData">
            <view class="songTitle">
              {{item.title}}
            </view>
            <view class="songArtist">
              {{item.artist}}
            </view>
          </view>
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
import { GetShareHistoryPage, AddFriend } from '../../api';
export default {
  name: 'ShareHistory',
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
    gotoPlayPage(songId) {
      console.log('gotoPlayPage songId', songId)
      // 在当前页面的某个方法或事件中
      uni.setStorageSync('playPageParms', { songId: songId });
      uni.switchTab({
        url: `/pages/playerPage/index?songId=${songId}`
      });
    },
    gotoUserProfile(userId) {
      uni.navigateTo({ url: `/pages/userProfile/index?userId=${userId}` })
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
      GetShareHistoryPage({
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
          console.log('GetShareHistoryPage res', res);
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
    },
    JoinFriend(friendId) {
      let that = this;
      let UserId = that.userId;
      AddFriend({
        parm: {
          userId: UserId,
          friendId: friendId,
        },
        beforeCallBack: () => {
          uni.showLoading({
            title: '添加好友中'
          });
        },
        responseCallBack: res => {
          uni.hideLoading();
          if (res != null && typeof (res) != 'undefined') {
            console.log('AddFriend resData', res);
            const { status, msg } = res;
            if (status !== 0) {
              uni.showToast({
                title: `添加好友出错,原因[${msg}]`,
                position: 'center',
                icon: 'fail',
                duration: 2000
              });
            } else {
              that.refresh();
            }
          }
        },
      });
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
  height: 275upx;
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
  height: 120upx;
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
.itemContainer .userInfo .addFriend {
  width: 32%;
  height: 65upx;
  line-height: 65upx;
  /*font-size: 3.6vh;*/
  font-size: 35upx;
  color: red;
  text-align: center;
  text-overflow: ellipsis;
  overflow: hidden;
  font-weight: 700;
  margin-left: 1%;
  border: 3px solid red;
  border-radius: 55upx;
}
.itemContainer .userInfo .addFriend:hover {
  color: #fff;
  background-color: red;
}
.itemContainer .userInfo .userInfoData {
  width: 52%;
  height: 95upx;
  margin-left: 1%;
  border: 0px solid red;
}
.itemContainer .userInfo .userInfoData .userName {
  width: 100%;
  height: 53upx;
  line-height: 53upx;
  text-align: left;
  text-indent: 2%;
  font-size: 2.5vh;
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
  font-size: 2.1vh;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  color: #000;
  border: 0px solid red;
}
</style>