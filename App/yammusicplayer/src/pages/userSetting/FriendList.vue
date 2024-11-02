<template>
  <view class="container">
    <view class="search-container">
      <!--搜索框-->
      <view class="text-container">
        <input
          placeholder="搜索好友"
          class="txtSearch"
          v-model="SqlWhere"
        />
        <!--<uni-icons
          class="btnSearch"
          type="search"
          size="25"
          @click="refresh"
        ></uni-icons>-->
        <image
          class="btnSearch"
          src="../../static/search.svg"
          mode="scaleToFill"
          @click="refresh"
        />
      </view>
      <!--/搜索框-->
    </view>
    <view class="datalist-container">
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
          class="itemContainer"
          v-for="(item,index) in PageData"
          :key="index"
          @click="gotoUserProfile(item)"
        >
          <image
            class="userFace"
            :src="item.friendUserFace"
            mode="scaleToFill"
          />
          <view class="userInfo">
            <view class="userName">
              {{item.friendUserName}}
            </view>
            <view class="itemListeningRecently">
              <!--<uni-icons
                class="Icon"
                type="headphones"
                size="15"
              ></uni-icons>-->
              <image
                src="../../static/headphones.svg"
                class="Icon"
                mode="scaleToFill"
              />
              <view class="SongName">最近在听{{item.title}}</view>
            </view>
          </view>
          <!--<uni-icons
            @click="deleteItem(index)"
            class="btnDelete"
            type="clear"
            size="30"
          ></uni-icons>-->
          <image
            src="../../static/x-circle-fill.svg"
            class="btnDelete"            
            @click="deleteItem(index)"
          />
        </view>
        <uni-load-more
          iconType="circle"
          v-if="lowLoading"
          :status="lowloadingStatus"
        ></uni-load-more>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import { GetFriendsPage, DeleteFriend } from '../../api'
export default {
  name: 'FriendList',
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
      SqlWhere: '',
      SortField: 'createddatetime',
      SortMethod: 'DESC',
      upLoading: true, // 上拉正在加载
      lowLoading: false, // 下拉正在加载
      hasMore: true, // 是否有更多数据
      uploadingStatus: 'loading',
      lowloadingStatus: 'loading',
      nocover: '../../static/NoCover.png',
      isLoading: false,
      upLoading: false,
      userInfo: null
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
    gotoUserProfile(item) {
      let jsonStr = encodeURIComponent(JSON.stringify(item))
      uni.navigateTo({ url: `/pages/userProfile/index?userInfo=${jsonStr}` })
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
    GetLoginUser() {
      let that = this;
      that.userInfo = that.$store.state.user;
      console.log('GetLoginUser that.userInfo', that.userInfo);
    },
    deleteItem(dataIndex) {
      let that = this;
      let deleteFriend = that.PageData[dataIndex];
      let userid = '';
      that.GetLoginUser();
      if (that.userInfo == null) {
        uni.showToast({
          title: `请先登录才可以修改`,
          position: 'center',
          icon: 'fail',
          duration: 2000
        });
        return false;
      }
      userid = that.userInfo.userId;
      console.log('deleteItem deleteFriend', deleteFriend);
      uni.showModal({
        title: '提示',
        content: `确定要删除好友[${deleteFriend.friendUserName}]?`,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定');
            DeleteFriend({
              parm: {
                UserId: userid,
                FriendId: deleteFriend.friendUserId,
              },
              beforeCallBack: () => {
                uni.showToast({
                  title: '删除中...',
                  duration: 1500,
                  icon: 'loading',
                  mask: true,
                });
              },
              responseCallBack: res => {
                uni.hideToast();
                if (res != null && typeof (res) != 'undefined') {
                  const { result, status, msg } = res;
                  if (status == 0) {
                    uni.showToast({
                      title: `删除成功`,
                      position: 'center',
                      icon: 'success',
                      duration: 2000
                    });
                    that.refresh();
                  } else {
                    uni.showToast({
                      title: `删除好友出错,原因[${msg}]`,
                      position: 'center',
                      icon: 'fail',
                      duration: 2000
                    });
                  }
                }
              }
            });
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      });
    },
    loadData() {
      let that = this;
      that.isLoading = true;
      let UserId = that.userId;
      GetFriendsPage({
        parm: {
          UserId: UserId,
          SqlWhere: that.SqlWhere,
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
          console.log('GetFriendsPage res', res);
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
  }
}
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border: 0px solid red;
  background-color: #f2f2f2;
}
.container .datalist-container {
  width: 100%;
  height: 75%;
  margin-top: 2%;
  border: 0px solid red;
}
.scrollViewContainer {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.scrollViewContainer .itemContainer {
  width: 100%;
  height: 165upx;
  margin-top: 2%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  background-color: #fff;
  border-top: 1px solid #ccc;
  border-bottom: 3px solid #ccc;
}
.scrollViewContainer .itemContainer:hover {
  cursor: pointer;
  background: linear-gradient(to right, #d3cce3, #e9e4f0);
}
.scrollViewContainer .itemContainer .userFace {
  width: 95upx;
  height: 95upx;
  margin-left: 2%;
}
.scrollViewContainer .itemContainer .userInfo {
  width: 75%;
  height: 100%;
  margin-left: 1%;
  border: 0px solid red;
}
.scrollViewContainer .itemContainer .userInfo .userName {
  width: 100%;
  height: 61upx;
  line-height: 61upx;
  font-size: 3vh;
  text-align: left;
  text-indent: 1%;
  font-weight: 700;
  color: #000;
  margin-top: 3%;
  border: 0px solid red;
}
.scrollViewContainer .itemContainer .userInfo .itemListeningRecently {
  width: 100%;
  height: 31upx;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-top: 5%;
  border: 0px solid red;
}
.scrollViewContainer .itemContainer .userInfo .itemListeningRecently .Icon {
  width: 25upx;
  height: 25upx;
  margin-left: 1%;
}
.scrollViewContainer .itemContainer .userInfo .itemListeningRecently .SongName {
  width: 92%;
  height: 31upx;
  line-height: 31upx;
  font-size: 1.7vh;
  text-align: left;
  text-indent: 2%;
  margin-left: 1%;
  color: #000;
  border: 0px solid red;
}
.scrollViewContainer .itemContainer .btnDelete {
  width: 37upx;
  height: 37upx;
  cursor: pointer;
  margin-left: 1%;
}
.container .search-container {
  width: 100%;
  height: 75upx;
  margin-top: 2%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  border-top: 1px solid #ccc;
  border-bottom: 2px solid #ccc;
}
.container .search-container .text-container {
  width: 96%;
  height: 50upx;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 25upx;
}
.container .search-container .text-container .txtSearch {
  width: 87%;
  height: 47upx;
  line-height: 47upx;
  font-size: 2vh;
  text-indent: 2%;
  color: black;
  margin-left: 3%;
  border: 0px solid red;
}
.container .search-container .text-container .btnSearch {
  width: 35upx;
  height: 35upx;
  margin-left: 1%;
  cursor: pointer;
}
</style>