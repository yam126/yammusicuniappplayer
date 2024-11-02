<template>
  <view
    class="content"
    :style="{marginTop:statusBarHeight+'px',height:windowHeight+'px'}"
  >
    <!--appBar-->
    <view
      ref="appBar"
      class="appBar"
    >
      <view class="forwardiconContainer">
        <!--<font-awesome-icon
          @click="gotoPlayPage"
          class="forwardicon"
          icon="angle-left"
        />-->
        <image
          @click="gotoPlayPage"
          src="../../static/angle-left.svg"
          class="forwardicon"
          mode="scaleToFill"
        />
      </view>
      <view class="songNameTitle">
        {{albumName}}
      </view>
      <!--<font-awesome-icon
        class="appBarRightIcon"
        icon="ellipsis-v"
      />-->
    </view>
    <!--/appBar-->
    <scroll-view
      scroll-y="true"
      class="mainScroll"
      :style="{
        height:scrollHeight+'px'
      }"
    >
      <view class="songListContainer">
        <view
          v-for="(item,index) in albumSongList"
          :key="index"
          class="songItemContainer"
          @click="gotoPlayPageList(item.songId)"
        >
          <view :class="songId==item.songId?'centerActive':'centerNormal'">
            <!--封面-->
            <image
              v-if="(item.cover==null&&typeof(item.cover)=='undefined'&&item.cover=='')"
              class="coverImage"
              :src="NoCover"
            />
            <image
              v-else
              class="coverImage"
              :src="item.cover"
            />
            <!--/封面-->
            <!--音乐信息-->
            <view class="songItemInfoContainer">
              <view class="songItemName">
                {{item.title}}
              </view>
              <view class="songItemLine">{{ item.artist }}</view>
              <view class="songItemLine">
                {{ formatDuration(item.duration).hour }}:
                {{ formatDuration(item.duration).minute }}:
                {{ formatDuration(item.duration).second }}
              </view>
              <view class="songItemLine">{{ item.createdatetime }}</view>
            </view>
            <!--/音乐信息-->
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import Vue from 'vue';
import { formatDuration } from '../../api'
export default Vue.extend({
  components: {},
  data() {
    return {
      albumName: '',
      windowHeight: 0,
      windowWidth: 0,
      scrollHeight: 0,
      statusBarHeight: 0,
      songId: '',
      NoCover: '../../static/NoCover.png',
      albumSongList: []
    }
  },
  // 页面周期函数--监听页面加载
  onLoad(res) {
    let that = this;
    console.log('playerList res', res);
    this.songId = res.songId;
    this.albumName = res.albumName;
    if (res.albumSongList != null && typeof (res.albumSongList) != 'undefined') {
      try {
        that.albumSongList = JSON.parse(decodeURIComponent(res.albumSongList));
        console.log('this.albumSongList', this.albumSongList);
      } catch (e) {
        that.showToast(`播放列表转换失败,原因[${e}]`);
      }
    }
    this.resizeModel();
  },
  // 页面周期函数--监听页面初次渲染完成
  onReady() {
    this.resizeModel();
  },
  onResize(res) {
    this.resizeModel();
  },
  // 页面周期函数--监听页面显示(not-nvue)
  onShow() {
  },
  // 页面周期函数--监听页面隐藏
  onHide() { },
  // 页面周期函数--监听页面卸载
  onUnload() { },
  // 页面处理函数--监听用户下拉动作
  // onPullDownRefresh() { uni.stopPullDownRefresh(); },
  // 页面处理函数--监听用户上拉触底
  // onReachBottom() {},
  // 页面处理函数--监听页面滚动(not-nvue)
  // onPageScroll(event) {},
  // 页面处理函数--用户点击右上角分享
  // onShareAppMessage(options) {},
  computed: {},
  mounted: function () {
    this.resizeModel();
  },
  methods: {
    showToast(message) {
      uni.showToast({
        title: message,
        duration: 2000,
        position: 'center'
      });
    },
    formatDuration(duration) {
      return formatDuration(duration);
    },
    gotoPlayPageList(songId) {
      uni.setStorageSync('playPageParms', { songId: songId });
      uni.switchTab({
        url: `/pages/playerPage/index?songId=${songId}`
      });
    },
    gotoPlayPage() {
      // 在当前页面的某个方法或事件中
      let songId = this.songId;
      uni.setStorageSync('playPageParms', { songId: songId });
      uni.switchTab({
        url: `/pages/playerPage/index?songId=${songId}`
      });
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
                that.scrollHeight = that.windowHeight - data.height;
              }
            }).exec();
          } catch (e) {
            console.log('error', e);
          }
        }
      });
    }
  },
  watch: {}
}) 
</script>

<style scoped>
.content {
  background: linear-gradient(to top, #ffffff, #12fff7);
}
.forwardiconContainer {
  width: 55upx;
  height: 55upx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border: 0px solid red;
}
.mainScroll {
  width: 100%;
  border: 0px solid red;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to top, #ffffff, #12fff7);
}
.songNameTitle {
  width: 88%;
  height: 47upx;
  line-height: 47upx;
  margin-top: 3upx;
  margin-left: 15upx;
  border-radius: 10upx;
  text-align: center;
  font-family: "Microsoft YaHei", "微软雅黑", sans-serif;
  font-size: 21upx;
  color: #000000;
  text-align: center;
}
.songListContainer {
  width: 100%;
  min-height: 56upx;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.songItemContainer {
  width: 96%;
  height: 216upx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-bottom: 2px dashed #fff;
}
.songItemContainer .centerNormal {
  width: 96%;
  height: 86%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  color: #000000;
  border: 0px solid red;
}
.songItemContainer .centerActive {
  width: 96%;
  height: 86%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  color: #f80303;
  background-color: #ffffff51;
  border: 1px solid rgb(208 204 204 / 49%);
  border-radius: 15upx;
  box-shadow: 2px 4px 1px 1px #8c838359;
}
.coverImage {
  width: 135upx;
  height: 135upx;
  margin-left: 3%;
  border-radius: 15upx;
}
.songItemInfoContainer {
  width: 71%;
  height: 135upx;
  margin-left: 3%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border: 0px solid red;
}
.songItemInfoContainer .songItemName {
  width: 96%;
  height: 33upx;
  line-height: 33upx;
  text-align: left;
  text-indent: 1%;
  font-size: 2vh;
  font-weight: 700;
  border: 0px solid red;
  margin-top: 2%;
}
.songItemInfoContainer .songItemLine {
  width: 96%;
  height: 17upx;
  line-height: 17upx;
  text-align: left;
  text-indent: 1%;
  font-size: 1.3vh;
  border: 0px solid red;
  margin-top: 2%;
}
</style>