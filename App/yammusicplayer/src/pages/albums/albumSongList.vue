<template>
  <view
    class="container"
    :style="{height:height}"
  >
    <view
      v-if="ShowContainer=='loading'"
      class="loadContainer"
    >
      <uni-load-more
        iconType="circle"
        :status="'loading'"
        :showText="false"
      />
    </view>
    <view
      v-if="ShowContainer=='error'"
      class="errorContainer"
      :style="{height:height}"
      @click="loadData"
    >
      {{ errorMsg }}点击刷新
    </view>
    <scroll-view
      v-if="ShowContainer=='list'"
      class="scrollContainer"
      :style="{height:height}"
      scroll-x="true"
    >
      <view
        v-for="(item,index) in SongData"
        :key="index"
        @click="gotoPlayPage(item.songId)"
        class="itemContainer"
      >
        <view class="container">
          <image
            class="cover"
            :src="item.cover"
            mode="scaleToFill"
          />
          <view class="songName">
            {{item.title}}
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { queryAlbumSongData } from '../../api'
export default {
  name: 'albumSongList',
  props: {
    albumId: String,
    height: String
  },
  data() {
    return {
      isLoading: true,
      isError: false,
      ShowContainer: 'loading',
      errorMsg: '',
      SongData: []
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
  computed: {},
  methods: {
    gotoPlayPage(songId) {
      console.log('gotoPlayPage songId', songId)
      // 在当前页面的某个方法或事件中
      uni.setStorageSync('playPageParms', { songId: songId });
      uni.switchTab({
        url: `/pages/playerPage/index?songId=${songId}`
      });
    },
    changeShowContainer() {
      let that = this;
      if (that.isLoading && !that.isError) {
        that.ShowContainer = 'loading';
      } else if (!that.isLoading && !that.isError) {
        that.ShowContainer = 'list';
      } else if (!that.isLoading && that.isError) {
        that.ShowContainer = 'error';
      }
    },
    loadData() {
      let that = this;
      console.log('that.props.albumId albumId', that.albumId);
      that.isLoading = true;
      that.changeShowContainer();
      queryAlbumSongData({
        parm: {
          albumId: that.albumId,
          limit: 10,
        },
        beforeCallBack: () => {
          that.isLoading = true;
          that.changeShowContainer();
        },
        responseCallBack: res => {
          that.isLoading = false;
          console.log('queryAlbumSongData res', res);
          if (res != null && typeof (res) != 'undefined') {
            const { result, status, msg } = res;
            if (status == 0) {
              that.isError = false;
              that.SongData = result;
            } else {
              that.isError = true;
              that.errorMsg = msg;
            }
          }
          that.changeShowContainer();
        }
      })
    },
  },
}
</script>

<style scoped>
.container {
  width: 98%;
  height: 155upx;
  margin-top: 1%;
  border: 0px solid red;
}
.errorContainer {
  width: 100%;
  height: 100%;
  display: flex;
  text-align: center;
  font-size: 31upx;
  white-space: pre-wrap;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border: 0px solid gray;
}
.scrollContainer {
  width: 100%;
  height: 155upx;
  border: 0px solid gray;
}
.scrollContainer {
  width: 100%;
  height: 100%;
  white-space: nowrap;
  overflow: auto;
  display: flex;
}
.scrollContainer .itemContainer {
  width: 155upx;
  height: 96%;
  margin-left: 1%;
  cursor: pointer;
  display: inline-block;
  border: 0px solid red;
}
.scrollContainer .itemContainer:hover {
  width: 155upx;
  height: 96%;
  margin-left: 1%;
  cursor: pointer;
  display: inline-block;
  border-radius: 10%;
  background: linear-gradient(160deg, #6186e3, #78e2ff);
  border: 1px solid rgb(0, 140, 255);
}
.scrollContainer .itemContainer .container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.scrollContainer .itemContainer .container .cover {
  width: 65%;
  height: 65%;
  border-radius: 10%;
  margin-top: 3%;
}
.scrollContainer .itemContainer .container .songName {
  width: 98%;
  height: 35upx;
  line-height: 35upx;
  font-size: 21upx;
  text-align: center;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-top: 1%;
  overflow: hidden;
  border: 0px solid red;
}
.scrollContainer .itemContainer:hover .container .songName {
  color: #ffffff;
}
.loadContainer {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 0px solid blue;
}
</style>