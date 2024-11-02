<template>
  <view
    class="content"
    :style="{marginTop:statusBarHeight+'px',height:windowHeight+'px'}"
  >
    <uni-load-more
      iconType="circle"
      v-if="IsLoading"
      :status="PageLoadingStatus"
    ></uni-load-more>
    <scroll-view
      scroll-y="true"
      class="mainScroll"
      :style="{
        height:scrollHeight+'px'
      }"
      @scroll="handleScroll"
    >
      <!--appBar-->
      <view
        ref="appBar"
        class="appBar"
      >
        <view class="forwardiconContainer">
          <!--<font-awesome-icon
            class="forwardicon"
            icon="angle-left"
          />-->
          <image
            src="../../static/angle-left.svg"
            class="forwardicon"
            mode="scaleToFill"
          />
        </view>
        <view class="songNameTitle">
          {{songName}}
        </view>
        <view
          @click="chooseMenu"
          class="forwardiconContainer"
        >
          <!--<font-awesome-icon
            class="appBarRightIcon"
            icon="ellipsis-v"
          />-->
          <image
            id="barMenu"
            class="forwardicon"
            src="/static/list.svg"
            mode="scaleToFill"
          />
        </view>
      </view>
      <!--/appBar-->
      <!--cover封面-->
      <view class="coverContainer">
        <view
          class="coverBackground"
          :style="{backgroundImage:`url(${diskBackGround})`}"
        >
          <image
            v-if="PlayState"
            class="cover discAnimationPlay"
            :src="cover"
            mode="scaleToFill"
          />
          <image
            v-else
            class="cover discAnimationPause"
            :src="cover"
            mode="scaleToFill"
          />
        </view>
      </view>
      <!--/cover封面-->
      <!--slider-->
      <view class="sliderContainer">
        <view class="timeLabel">
          {{currentPlayDurationObj.hour}}:{{currentPlayDurationObj.minute}}:{{currentPlayDurationObj.second}}
        </view>
        <view class="sliderPanel">
          <slider
            activeColor="#FF5050"
            block-color="#FF5050"
            block-size="18"
            backgroundColor="#CCCCCC"
            @change="sliderChange"
            :min="0"
            :max="maxDuration"
            :value="currentDurationValue"
          ></slider>
        </view>
        <view class="timeLabel">
          {{currentDurationObj.hour}}:{{currentDurationObj.minute}}:{{currentDurationObj.second}}
        </view>
      </view>
      <!--/slider-->
      <!--playcontrol-->
      <view class="playControl">
        <!--
          random-play.png --随机播放
          repeat-play.png --循环播放
          repeat-one-play.png --单曲循环播放
          order-play.png --循序播放
        -->
        <image
          @click="changePlaySequence"
          :src="PlaySequenceImage"
          class="normalIcon"
          mode="scaleToFill"
        />
        <!--<font-awesome-icon
          @click="gotoFirstSong"
          class="normalIcon"
          icon="step-backward"
        />-->
        <image
          @click="gotoFirstSong"
          src="../../static/skip-start-fill.svg"
          class="normalIcon"
          mode="scaleToFill"
        />
        <!--<font-awesome-icon
          @click="changePreviousSong"
          class="normalIcon"
          icon="backward"
        />-->
        <image
          @click="changePreviousSong"
          src="../../static/rewind-fill.svg"
          class="normalIcon"
          mode="scaleToFill"
        />
        <!--
          play-state.png --播放
          pause-state.png --暂停
        -->
        <image
          @click="changePlayState"
          class="play-pause-button"
          :src="!PlayState?PauseImage:PlayImage"
          mode="scaleToFill"
        />
        <!--<font-awesome-icon
          @click="changeNextSong"
          class="normalIcon"
          icon="forward"
        />-->
        <image
          @click="changeNextSong"
          src="../../static/fast-forward-fill.svg"
          class="normalIcon"
          mode="scaleToFill"
        />
        <!--<font-awesome-icon
          @click="gotoLastSong"
          class="normalIcon"
          icon="step-forward"
        />-->
        <image
          @click="gotoLastSong"
          src="../../static/skip-end-fill.svg"
          class="normalIcon"
          mode="scaleToFill"
        />
        <image
          @click="GotoPlayerList"
          src="../../static/play-list.png"
          class="normalIcon"
          mode="scaleToFill"
        />
      </view>
      <!--/playcontrol-->
      <!--tabContainer-->
      <view
        ref="tabContainer"
        class="tabContainer"
        :class="isFixed?'navigation-fixed':''"
      >
        <view
          @click="changeTabActive(0)"
          :class="tabActiveIndex===0?'tabActive':'tabNormal'"
        >
          歌曲信息
        </view>
        <view
          @click="changeTabActive(1)"
          :class="tabActiveIndex===1?'tabActive':'tabNormal'"
        >
          评论信息
        </view>
      </view>
      <!--/tabContainer-->
      <!--歌曲信息-->
      <view
        v-if="tabActiveIndex===0"
        class="songInfoContainer"
      >
        <!--歌曲信息-->
        <view class="songInfoItem">
          <font-awesome-icon
            class="Icon"
            icon="file-alt"
          />
          <view class="Text">
            歌曲名称:{{songName}}
          </view>
        </view>
        <!--/歌曲信息-->
        <!--歌手信息-->
        <view class="songInfoItem">
          <font-awesome-icon
            class="Icon"
            icon="file-alt"
          />
          <view class="Text">
            歌手:{{ artist }}
          </view>
        </view>
        <!--/歌手信息-->
        <!--专辑信息-->
        <view class="songInfoItem">
          <font-awesome-icon
            class="Icon"
            icon="file-alt"
          />
          <view class="Text">
            专辑:{{albumName}}
          </view>
        </view>
        <!--/专辑信息-->
        <!--时长信息-->
        <view class="songInfoItem">
          <font-awesome-icon
            class="Icon"
            icon="file-alt"
          />
          <view class="Text">
            时长:{{currentDurationObj.hour}}时{{currentDurationObj.minute}}分{{currentDurationObj.second}}秒
          </view>
        </view>
        <!--/时长信息-->
        <!--创建时间-->
        <view class="songInfoItem">
          <font-awesome-icon
            class="Icon"
            icon="file-alt"
          />
          <view class="Text">
            创建时间:{{ createdatetime }}
          </view>
        </view>
        <!--/创建时间-->
      </view>
      <!--/歌曲信息-->
      <!--评论信息-->
      <view
        v-if="tabActiveIndex===1"
        class="commentContainer"
      >
        <!--评论区文本框-->
        <view
          :class="isFixed?IsFlodComment?'comment-fixed-flod':'comment-fixed':''"
          class="commentTextArea"
        >
          <view :class="'textAreaContainer '+TextAreaFlodAnimationClass">
            <view class="titleContainer">
              <view class="titlePanel">
                <image
                  class="Icon"
                  src="../../static/PublishComment.png"
                  mode="scaleToFill"
                />
                <view class="title">发表评论</view>
              </view>
              <image
                @click="FlodComment"
                class="flod"
                :src="FlodIconPath"
                mode="scaleToFill"
              />
            </view>
            <view :class="'commentInputContainer '+CommentFlodAnimation">
              <textarea
                v-model="SongComment"
                class="txtCommentContent"
                placeholder="请输入评论"
              />
              <button
                @click="btnSubmitCommentClick"
                class="btnSubmitComment"
              >
                提交评论
              </button>
            </view>
          </view>
        </view>
        <!--/评论区文本框-->
        <uni-load-more
          v-if="commentIsLoad"
          status="loading"
        />
        <!--评论列表-->
        <scroll-view
          v-if="commentPage.PageData.length>0"
          class="commentScrollList"
          scroll-y="true"
          @scrolltoupper="refresh()"
          @scrolltolower="onEndReached()"
        >
          <!--单条评论-->
          <view
            v-for="(item,index) in commentPage.PageData"
            :key="index"
            class="commentItemContainer"
          >
            <view class="userInfoContainer">
              <!--头像-->
              <image
                v-if="item.userface==''||typeof(item.userface)=='undefined'"
                class="userFace"
                src="../../static/userfaces/useface01.png"
                mode="scaleToFill"
              />
              <image
                v-else
                class="userFace"
                :src="item.userface"
                mode="scaleToFill"
              />
              <!--/头像-->
              <view class="userName">{{ item.username }}</view>
            </view>
            <!--箭头-->
            <view class="arrow"></view>
            <!--/箭头-->
            <!--评论内容-->
            <view class="bubble">
              <view class="commentItemInfo">{{index+1}}#发表时间:{{item.createddatetime}}</view>
              <view class="commentItemContent">
                {{ item.content }}
              </view>
            </view>
            <!--/评论内容-->
          </view>
          <!--/单条评论-->
          <uni-load-more
            @click="onEndReached"
            iconType="circle"
            v-if="commentIsMoreLoad"
            :status="commentMoreLoadStatus"
          ></uni-load-more>
        </scroll-view>
        <!--/评论列表-->
        <view
          v-else
          class="commentScrollList"
        >
          <view
            @click="refresh"
            class="NoMore"
          >
            没有评论数据,点击刷新
          </view>
        </view>
      </view>
      <!--/评论信息-->
    </scroll-view>
    <tabbar
      ref="tabbar"
      current="2"
    ></tabbar>
    <show-action-sheet
      :tips="showActionSheet.tips"
      :itemList="showActionSheet.itemList"
      :show="showActionSheet.show"
      :maskClosable="showActionSheet.maskClosable"
      :isCancel="showActionSheet.isCancel"
      @chooseCancel="chooseCancel"
      @click="choseMenuClickItem"
    >
    </show-action-sheet>
  </view>
</template>

<script>
import ShowActionSheet from '../../components/ShowActionSheet.vue'
import tabbar from '../../components/tabbar.vue'
import { GetPlayerData, GetSongCommentPageApi, PublisherSongComment, formatDuration } from '../../api'
import diskBackGround from '@/static/disc.png'
export default {
  components: {
    'tabbar': tabbar,
    'show-action-sheet': ShowActionSheet
  },
  data() {
    return {
      diskBackGround: diskBackGround,
      windowHeight: 0,
      windowWidth: 0,
      scrollHeight: 0,
      tabActiveIndex: 0,
      statusBarHeight: 0,
      isFixed: false,
      navigationTop: 0,
      IsLoading: false,
      PageLoadingStatus: 'loading',
      PlayState: false,
      PlayImage: '../../static/pause-state.png',
      PauseImage: '../../static/play-state.png',
      albumId: '',
      songId: '',//当前播放歌曲ID
      userId: '',
      songinfo: null,
      albuminfo: null,
      cover: '../../static/NoCover.png',
      songName: '',
      artist: '',
      albumName: '',
      createdatetime: '',
      maxDuration: 0,
      currentUrl: '',
      SongComment: '',
      currentDurationValue: 0,
      audioContext: null,
      albumSongList: [],//播放列表
      currentSongListIndex: 0,//当前播放的是播放列表里第几首
      PlaySequence: 'SequenceOne',
      PlaySequenceImage: '../../static/order-play.png',
      PlaySequenceIndex: 0,
      CommentFlodAnimation: '',
      TextAreaFlodAnimationClass: '',
      IsFlodComment: false,
      FlodIconPath: '../../static/flod.png',
      PlaySequenceAry: [
        'SequenceOne',
        'SequenceCyclic',
        'RandomPlay',
        'SingleLoop',
      ],
      currentPlayDurationObj: {
        hour: '00',
        minute: '00',
        second: '00'
      },
      currentDurationObj: {
        hour: 0,
        minute: 0,
        second: 0
      },
      commentIsLoad: false,
      commentIsMoreLoad: false,
      commentMoreLoadStatus: 'more',
      commentPage: {
        PageSize: 10,
        CurPage: 1,
        PageCount: 0,
        RecordCount: 0,
        SortField: 'createddatetime',
        SortMethod: 'ASC',
        PageData: []
      },
      currentLoginUser: null,
      userId: '',
      showActionSheet: {
        show: false,
        maskClosable: true,
        tips: "快捷菜单",
        itemList: [
          {
            text: "分享歌曲",
            color: "#333",
            url: ''
          }
        ],
        color: "#9a9a9a",
        size: 26,
        isCancel: true
      }
    };
  },
  onLoad(options) {
    this.resizeModel();
    this.loadData();
  },
  onReady() {
    this.resizeModel();
    this.initTabNavigationTop();
    this.loadData();
  },
  onShow() {
    this.loadData();
  },
  onResize(res) {
    this.resizeModel();
  },
  onHide() {
    let that = this;
    if (that.audioContext != null && typeof (that.audioContext) != 'undefined') {
      that.audioContext.pause();
      that.PlayState = false;
    }
  },
  onUnload() {
    let that = this;
    if (that.audioContext != null && typeof (that.audioContext) != 'undefined') {
      that.audioContext.pause();
      that.audioContext.destroy();
    }
  },
  mounted: function () {
    this.resizeModel();
  },
  computed: {},
  methods: {
    choseMenuClickItem(menuIndex) {
      let that = this;
      switch (menuIndex) {
        case 0:
          uni.navigateTo({
            url: `/pages/share/ShareMusic?songId=${that.songId}` // 跳转到对应路径的页面
          });
          break;
      }
    },
    // 弹窗关闭
    chooseCancel() {
      this.showActionSheet.show = false;
    },
    // 点击弹窗
    chooseMenu() {
      console.log('chooseMenu', this.showActionSheet.show)
      this.showActionSheet.show = true;
    },
    GetLoginUser() {
      let that = this;
      that.currentLoginUser = that.$store.state.user;
      if (that.currentLoginUser == null) {
        uni.showToast({
          title: `没有登录不能添加专辑`,
          position: 'center',
          icon: 'fail',
          duration: 2000
        });
        return false;
      } else {
        that.userId = that.currentLoginUser.userId;
      }
      return true;
    },
    btnSubmitCommentClick() {
      let that = this;
      if (that.SongComment == '') {
        that.showErrorToast('评论不能为空');
        return false;
      }
      if (!that.GetLoginUser()) {
        that.showErrorToast('没有登录无法评论');
        return false;
      }
      PublisherSongComment({
        parm: {
          songId: that.songId,
          userId: that.userId,
          content: that.SongComment
        },
        beforeCallBack: () => {
          uni.showLoading({
            title: '加载中'
          });
        },
        responseCallBack: resData => {
          uni.hideLoading();
          if (resData != null && typeof (resData) != 'undefined') {
            const { status, msg } = resData;
            if (status != 0) {
              that.showErrorToast(`提交评论出错,原因[${msg}]`)
            } else {
              that.showToast('提交评论成功');
              that.GetSongCommentPage(that.songId)
            }
          }
        }
      })
    },
    FlodComment() {
      let that = this;
      if (!that.IsFlodComment) {
        that.CommentFlodAnimation = 'flodAnimation';
        that.TextAreaFlodAnimationClass = 'textAreaFlodAnimation';
        that.FlodIconPath = '../../static/launch.png';
        that.IsFlodComment = true
      }
      else {
        that.CommentFlodAnimation = 'launchAnimation';
        that.TextAreaFlodAnimationClass = 'textAreaLLaunchAnimation';
        that.FlodIconPath = '../../static/flod.png';
        that.IsFlodComment = false
      }
    },
    GotoPlayerList() {
      let that = this;
      let albumSongListJson = encodeURIComponent(JSON.stringify(that.albumSongList));
      uni.navigateTo({
        url: `/pages/playerList/index?songId=${that.songId}&albumName=${that.albumName}&albumSongList=${albumSongListJson}`
      });
    },
    /**
     * 执行播放顺序
     * @param {歌曲列表} albumSongList
     * @param {歌曲编号} songId
     * @param {播放顺序} PlaySequence
     * @returns
     */
    ExecutePlaySequence() {
      let that = this;
      that.currentSongListIndex = that.getCurrentPlayIndex(that.albumSongList, that.songId);

      //#region 判断当前歌曲列表是否为空
      if (
        (that.albumSongList === null && typeof that.albumSongList === 'undefined') ||
        that.albumSongList.length <= 0
      ) {
        return;
      }
      if (that.albumSongList.length === 1) {
        return;
      }
      //#endregion

      //#region 执行播放顺序
      switch (that.PlaySequence) {
        //#region 顺序循环播放
        case 'SequenceCyclic':
          that.currentSongListIndex += 1;
          if (that.currentSongListIndex > that.albumSongList.length - 1) {
            that.currentSongListIndex = 0;
          }
          that.songId = that.albumSongList[that.currentSongListIndex].songId;
          console.log('顺序循环播放 currentSongListIndex', that.currentSongListIndex);
          uni.setStorageSync('playPageParms', { songId: that.songId });
          that.loadData();
          break;
        //#endregion

        //#region 顺序只播放一次
        case 'SequenceOne':
          that.currentSongListIndex += 1;
          console.log(
            '顺序只播放一次 currentSongListIndex',
            that.currentSongListIndex,
          );
          if (that.currentSongListIndex > that.albumSongList.length - 1) {
            that.currentSongListIndex = that.albumSongList.length - 1;
            that.songinfo = that.albumSongList[that.currentSongListIndex];
            that.PlayState = false;
            that.changePlayState();
          } else {
            that.songId = that.albumSongList[that.currentSongListIndex].songId;
            uni.setStorageSync('playPageParms', { songId: that.songId });
            that.loadData();
          }
          break;
        //#endregion

        //#region 随机播放
        case 'RandomPlay':
          that.currentSongListIndex = getRandomInt(0, that.albumSongList.length - 1);
          console.log('随机播放 currentSongListIndex', that.currentSongListIndex);
          that.songId = that.albumSongList[that.currentSongListIndex].songId;
          uni.setStorageSync('playPageParms', { songId: that.songId });
          that.loadData();
          break;
        //#endregion

        //#region 单曲循环
        case 'SingleLoop':
          console.log('单曲循环 currentSongListIndex', that.currentSongListIndex);
          that.songId = that.albumSongList[that.currentSongListIndex].songId;
          uni.setStorageSync('playPageParms', { songId: that.songId });
          that.loadData();
          break;
        //#endregion
      }
      //#endregion
    },
    changePlaySequence() {
      let that = this;
      if (that.PlaySequenceIndex < that.PlaySequenceAry.length) {
        that.PlaySequence = that.PlaySequenceAry[that.PlaySequenceIndex];
      }
      switch (that.PlaySequence) {
        //order-play.png --顺序循序播放
        case 'SequenceOne':
          that.PlaySequenceImage = '../../static/order-play.png';
          that.showToast('顺序循序播放');
          break;
        //repeat-play.png --循环播放
        case 'SequenceCyclic':
          that.PlaySequenceImage = '../../static/repeat-play.png';
          that.showToast('循序播放');
          break;
        //random-play.png --随机播放
        case 'RandomPlay':
          that.PlaySequenceImage = '../../static/random-play.png';
          that.showToast('随机播放');
          break;
        //repeat-one-play.png --单曲循环播放
        case 'SingleLoop':
          that.PlaySequenceImage = '../../static/repeat-one-play.png';
          that.showToast('单曲循环');
          break;
      }
      that.PlaySequenceIndex += 1;
      if (that.PlaySequenceIndex >= that.PlaySequenceAry.length) {
        that.PlaySequenceIndex = 0;
      }
    },
    /**
     * 获得当前歌曲在专辑中的序号
     * @param {歌曲列表} songList
     * @param {歌曲编号} songId
     * @returns
     */
    getCurrentPlayIndex(songList, songId) {
      var result = 0;
      for (var i = 0; i < songList.length; i++) {
        if (songList[i].songId === songId) {
          result = i;
        }
      }
      return result;
    },
    /**
     * 上一首歌
     */
    changePreviousSong() {
      let that = this;
      that.currentSongListIndex = that.getCurrentPlayIndex(that.albumSongList, that.songId);
      that.currentSongListIndex -= 1;
      if (that.currentSongListIndex < 0) {
        that.currentSongListIndex = 0;
        that.showToast('已经是第一首歌了');
      }
      that.songId = that.albumSongList[that.currentSongListIndex].songId;
      uni.setStorageSync('playPageParms', { songId: that.songId });
      that.loadData();
    },

    /**
     * 下一首歌
     */
    changeNextSong() {
      let that = this;
      that.currentSongListIndex = that.getCurrentPlayIndex(that.albumSongList, that.songId);
      that.currentSongListIndex += 1;
      if (that.currentSongListIndex > that.albumSongList.length - 1) {
        that.currentSongListIndex = that.albumSongList.length - 1;
        that.showToast('已经是最后一首歌了');
      }
      that.songId = that.albumSongList[that.currentSongListIndex].songId;
      uni.setStorageSync('playPageParms', { songId: that.songId });
      that.loadData();
    },
    gotoLastSong() {
      let that = this;
      that.currentSongListIndex = that.albumSongList.length - 1;
      that.songId = that.albumSongList[that.currentSongListIndex].songId;
      uni.setStorageSync('playPageParms', { songId: that.songId });
      that.loadData();
    },
    gotoFirstSong() {
      let that = this;
      that.currentSongListIndex = 0;
      that.songId = that.albumSongList[that.currentSongListIndex].songId;
      uni.setStorageSync('playPageParms', { songId: that.songId });
      that.loadData();
    },
    sliderChange(e) {
      let that = this;
      console.log('value 发生变化：' + e.detail.value)
      that.PlayState = true;
      that.changePlayState();
      try {
        that.audioContext.seek(e.detail.value);
        that.PlayState = false;
        that.changePlayState();
        that.currentDurationValue = e.detail.value;
      }
      catch (e) {
        that.showErrorToast(e);
      }
    },
    changePlayState() {
      let that = this;
      const query = uni.createSelectorQuery().in(that);
      let discAnimation = query.select('.discAnimation');
      console.log('discAnimation', discAnimation);
      console.log('that.audioContext.buffered', that.audioContext.buffered)
      console.log('that.currentDurationValue', that.currentDurationValue)
      if (that.audioContext.buffered < that.currentDurationValue) {
        uni.showLoading({
          title: '歌曲缓冲中'
        })
        that.PlayState = false;
        that.changeAudioContextState();
        return false;
      }
      else {
        uni.hideLoading()
      }
      if (that.PlayState) {
        that.PlayState = false;
        that.changeAudioContextState();
      }
      else {
        that.PlayState = true;
        that.changeAudioContextState();
      }

    },
    changeAudioContextState() {
      let that = this;
      try {
        if (that.audioContext != null) {
          if (that.PlayState && that.audioContext.paused) {
            that.audioContext.play();
          } else {
            that.audioContext.pause();
          }
        }
      } catch (e) {
        that.showErrorToast(e);
      }
    },
    getGotoPageParms(parmValue) {
      var result = '';
      if (parmValue === '' || typeof parmValue === 'undefined')
        result = 'null';
      else
        result = parmValue;
      return result;
    },
    refresh() {
      this.commentPage.CurPage = 1;
      this.commentPage.PageData = [];
      this.GetSongCommentPage(this.songId);
    },
    //上拉加载事件
    onEndReached() {
      let that = this;
      console.log('_onEndReached');
      let CurPage = that.commentPage.CurPage;
      let PageCount = that.commentPage.PageCount;
      let nomore = that.commentIsMoreLoad;
      CurPage += 1;
      console.log('_onEndReached CurPage', CurPage);
      console.log('_onEndReached PageCount', PageCount);
      if (CurPage >= PageCount) {
        that.commentPage.CurPage = PageCount;
        that.commentPage.lowLoading = true;
        that.commentMoreLoadStatus = 'noMore'
      } else {
        that.commentPage.CurPage = CurPage;
        that.GetSongCommentPage(that.songId);
      }
    },
    GetSongCommentPage(songId) {
      let that = this;
      let PageData = that.commentPage.PageData;
      let CurPage = that.commentPage.CurPage;
      let PageSize = that.commentPage.PageSize;
      that.commentIsLoad = true;
      GetSongCommentPageApi({
        parm: {
          SongId: songId,
          SortField: that.commentPage.SortField,
          SortMethod: that.commentPage.SortMethod,
          PageSize: that.commentPage.PageSize,
          CurPage: that.commentPage.CurPage,
        },
        beforeCallBack: () => { },
        responseCallBack: res => {
          console.log('GetSongCommentPage res', res);
          that.commentIsLoad = false;
          if (res != null && typeof (res) != 'undefined') {
            const { result, status, pageCount, recordCount, msg } = res;
            if (status == 0) {
              that.commentPage.PageCount = pageCount;
              that.commentPage.RecordCount = recordCount;
              that.commentPage.SortField = 'createddatetime';
              that.commentPage.SortMethod = 'ASC';
              if (recordCount > 0) {
                if (result !== null && typeof result !== 'undefined') {
                  if (that.CurPage === 1) {
                    PageData = result;
                  }
                  else if (
                    CurPage <= pageCount &&
                    PageData.length <= PageSize * CurPage
                  ) {
                    for (var i = 0; i < result.length; i++) {
                      PageData.push(result[i]);
                    }
                    that.commentIsMoreLoad = true;
                    that.commentMoreLoadStatus = 'more';
                  } else {
                    that.commentIsMoreLoad = true;
                    that.commentMoreLoadStatus = 'noMore';
                  }
                  that.commentPage.PageData = PageData;
                }
              }
            } else {
              that.showToast(msg);
            }
          }
        }
      });
    },
    loadData() {
      let that = this;
      // 获取存储的参数
      const playPageParms = uni.getStorageSync('playPageParms');
      console.log('参数：', playPageParms);
      let params = playPageParms;
      that.albumId = that.getGotoPageParms(playPageParms.albumId);
      that.songId = that.getGotoPageParms(playPageParms.songId);
      that.userId = that.getGotoPageParms(playPageParms.userId);;
      console.log('loadData params', params);
      that.GetSongCommentPage(that.songId);
      GetPlayerData({
        parm: {
          albumId: that.albumId,
          songId: that.songId,
          userId: that.userId,
        },
        beforeCallBack: () => {
          uni.showLoading({
            title: '加载中'
          });
        },
        responseCallBack: res => {
          uni.hideLoading();
          console.log('GetPlayerData res', res);
          if (res != null && typeof (res) != 'undefined') {
            const { result, status, msg } = res;
            if (status == 0) {
              that.songinfo = result.songinfo;
              that.albuminfo = result.albuminfo;
              that.albumSongList = result.albumSongList;
              if (that.songinfo != null && typeof (that.songinfo) != 'undefined') {
                that.cover = that.songinfo.cover;
                that.songName = that.songinfo.title;
                that.artist = that.songinfo.artist;
                that.createdatetime = that.songinfo.createdatetime;
                that.maxDuration = that.songinfo.duration;
                that.currentDurationObj = formatDuration(parseInt(that.songinfo.duration));
                that.initAudioContext(that.songinfo.fileName);
              }
              if (that.albuminfo != null && typeof (that.albuminfo) != 'undefined') {
                that.albumName = that.albuminfo.albumName;
              }
              if (that.albumSongList != null && typeof (that.albumSongList) != 'undefined' && that.albumSongList.length > 0) {
                that.currentSongListIndex = that.getCurrentPlayIndex(that.albumSongList, that.songId);
              }
            } else {
              that.showErrorToast(`读取歌曲数据出错,原因[${msg}]`)
            }
          }
        }
      })
    },
    initAudioContext(url) {
      let that = this;
      that.currentUrl = url;
      try {
        if (that.audioContext != null && typeof (that.audioContext) != 'undefined') {
          that.audioContext.stop();
          that.audioContext.destroy();
          that.audioContext = null;
        }
        if (that.audioContext == null || typeof (that.audioContext) == 'undefined') {
          that.audioContext = uni.createInnerAudioContext();
        }
        that.audioContext.src = url;
        that.audioContext.sessionCategory = 'soloAmbient';
        //that.audioContext.autoplay = true;
        //uni.showLoading({
        //  title: '加载歌曲中'
        //});
        that.audioContext.onCanplay(() => {
          uni.hideLoading();
          console.log('开始播放');
          let playDuration = that.audioContext.duration;
          that.PlayState = false;
          that.changePlayState();
          console.log('playDuration', playDuration);
          if (playDuration != null && typeof (playDuration) != 'undefined') {
            that.currentDurationObj = formatDuration(that.audioContext.duration);
          }
        });
        that.audioContext.onError((res) => {
          //uni.hideLoading();
          console.log('that.audioContext.onError', res);
          if (res != null && typeof (res) != 'undefined') {
            console.log(res.errMsg);
            console.log(res.errCode);
            let errorMessage = `歌曲播放错误,错误码[${res.errCode}],出错原因[${res.errMsg}]`;
            that.showErrorToast(errorMessage);
          }
        });
        that.audioContext.onWaiting(result => {
          console.log('onWaiting result', result);
          uni.showLoading({
            title: '歌曲缓冲中'
          })
          that.PlayState = false;
          that.changePlayState();
        })
        that.audioContext.onTimeUpdate((res) => {
          //console.log('currentTime', that.audioContext.currentTime);
          that.updateCurrentPlayTime();
        });
        that.audioContext.onEnded(() => {
          that.ExecutePlaySequence();
        });
      } catch (e) {
        that.showErrorToast(e);
      }
    },
    updateCurrentPlayTime() {
      let that = this;
      if (that.audioContext != null && typeof (that.audioContext) != 'undefined') {
        that.currentDurationValue = that.audioContext.currentTime;
        that.currentPlayDurationObj = formatDuration(that.audioContext.currentTime);
      }
    },
    showErrorToast(message) {
      uni.showToast({
        title: message,
        icon: 'error',
        duration: 2000,
        position: 'center'
      });
    },
    showToast(message) {
      uni.showToast({
        title: message,
        duration: 2000,
        position: 'center'
      });
    },
    handleScroll(event) {
      // 获取滚动条位置
      const scrollTop = event.detail.scrollTop;
      // 判断导航栏是否需要固定
      if (scrollTop > this.navigationTop) {
        this.isFixed = true;
      } else {
        this.isFixed = false;
      }
    },
    initTabNavigationTop() {
      let that = this;
      const query = uni.createSelectorQuery().in(that);
      let tabContainer = query.select('.tabContainer');
      query.select('.tabContainer').boundingClientRect(data => {
        console.log('data', data);
        that.navigationTop = data.top;
      }).exec();
    },
    changeTabActive(tabIndex) {
      this.tabActiveIndex = tabIndex
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
                let tabbarHeight = data.height;
                if (tabbarHeight !== null && typeof (tabbarHeight) !== 'undefined') {
                  console.log('boundingClientRect tabbarHeight', tabbarHeight);
                  console.log('boundingClientRect tabbarHeight', tabbarHeight);
                  that.scrollHeight = that.windowHeight - tabbarHeight;
                  console.log('boundingClientRect scrollHeight', that.scrollHeight);
                }
              }
            }).exec();
          } catch (e) {
            console.log('resizeModel exception', e)
          }
        }
      });
    }
  },
  watch: {}
};
</script>

<style scoped>
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
.titlePanel {
  width: 167upx;
  height: 37upx;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  border: 0px solid red;
}
.flod {
  width: 35upx;
  height: 35upx;
  cursor: pointer;
  margin-right: 10upx;
}
.launchAnimation {
  animation-name: launchAnimation;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
  animation-iteration-count: 1;
}
@keyframes launchAnimation {
  from {
    height: 0;
  }
  to {
    height: 65%;
  }
}
.flodAnimation {
  animation-name: flodAnimation;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
  animation-iteration-count: 1;
}
@keyframes flodAnimation {
  from {
    height: 37upx;
  }
  to {
    height: 0;
  }
}
.textAreaLaunchAnimation {
  animation-name: textAreaLaunchAnimation;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
  animation-iteration-count: 1;
}
@keyframes textAreaLaunchAnimation {
  form {
    height: 55upx;
  }
  to {
    height: 330upx;
  }
}
.textAreaFlodAnimation {
  animation-name: textAreaFlodAnimation;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
  animation-iteration-count: 1;
}
@keyframes textAreaFlodAnimation {
  form {
    height: 330upx;
  }
  to {
    height: 55upx;
  }
}
.discAnimationPlay {
  animation-name: discAnimation;
  animation-duration: 50s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
}
.discAnimationPause {
  animation-name: discAnimation;
  animation-duration: 50s;
  animation-fill-mode: forwards;
  animation-play-state: paused;
}
@keyframes discAnimation {
  from {
    transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
  }
}
.bubble {
  background-color: #1bedde;
  border-radius: 10upx;
  width: 81%;
  min-height: 231upx;
  height: auto;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  filter: drop-shadow(2px 2px 10px #736666);
}
.bubble .commentItemInfo {
  width: 95%;
  height: 35upx;
  line-height: 35upx;
  text-align: left;
  text-indent: 2%;
  font-size: 2vh;
  color: #000;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  margin-top: 3%;
  border-bottom: 1px solid #000;
}
.bubble .commentItemContent {
  width: 95%;
  min-height: 175upx;
  height: auto;
  font-size: 2.1vh;
  color: #000;
  text-align: left;
  text-indent: 2%;
  overflow: hidden;
  margin-top: 3%;
  margin-bottom: 3%;
  border: 0px solid red;
}
.arrow {
  width: 0;
  height: 0;
  margin-top: 3%;
  border-left: 15upx solid transparent;
  border-right: 15upx solid #1bedde;
  border-top: 15upx solid transparent;
  border-bottom: 15upx solid transparent;
  filter: drop-shadow(2px 2px 10px #736666);
}
.songInfoContainer {
  width: 100%;
  height: 1252upx;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: #ffffffaa;
}
.commentContainer .commentScrollList .commentItemContainer {
  width: 100%;
  flex: 1;
  margin-top: 5%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  border: 0px solid red;
}
.commentContainer .commentScrollList .commentItemContainer .userInfoContainer {
  width: 99upx;
  min-height: 271upx;
  height: auto;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border: 0px solid red;
}
.commentContainer
  .commentScrollList
  .commentItemContainer
  .userInfoContainer
  .userFace {
  width: 87upx;
  height: 87upx;
  border-radius: 55upx;
  margin-top: 5%;
  border-bottom: 0px solid blue;
}
.commentContainer
  .commentScrollList
  .commentItemContainer
  .userInfoContainer
  .userName {
  width: 99%;
  height: 25upx;
  line-height: 25upx;
  font-size: 1.2vh;
  color: #000;
  text-align: center;
  margin-top: 3%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  border: 0px solid red;
}
.commentContainer {
  width: 100%;
  height: 1252upx;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  background-color: #ffffffaa;
}
.commentContainer .commentScrollList {
  width: 100%;
  height: 1870upx;
  background-color: #ddeee512;
  border: 0px solid red;
}
.commentContainer .commentScrollList .NoMore {
  width: 100%;
  height: 100%;
  display: flex;
  color: #736666;
  font-size: 3vh;
  cursor: pointer;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.commentContainer .commentTextArea {
  width: 100%;
  height: 385upx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-bottom: 0px solid #ccc;
}
.commentInputContainer {
  width: 98%;
  height: 75%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border: 0px solid red;
}
.commentContainer .commentTextArea .textAreaContainer {
  width: 95%;
  height: 330upx;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin-top: 1%;
  border-radius: 15upx;
  border: 1px solid #ccc;
  background: linear-gradient(to top, #ffffff, #12fff7);
  box-shadow: 2px 4px 1px 1px #8c838359;
}
.commentContainer .commentTextArea .textAreaContainer .titleContainer {
  width: 95%;
  height: 55upx;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #ccc;
}
.commentContainer .commentTextArea .textAreaContainer .titleContainer .Icon {
  width: 35upx;
  height: 35upx;
  margin-left: 3%;
}
.commentContainer .commentTextArea .textAreaContainer .titleContainer .title {
  min-width: 125upx;
  width: auto;
  height: 54upx;
  overflow: hidden;
  line-height: 54upx;
  font-size: 2.3vh;
  color: #060606;
  text-align: left;
  text-indent: 5%;
  margin-left: 1%;
  border: 0px solid red;
}
.commentContainer .commentTextArea .textAreaContainer .txtCommentContent {
  width: 95%;
  height: 156upx;
  line-height: 35upx;
  font-size: 2vh;
  text-indent: 3%;
  color: #000;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: #ffffff9c;
  margin-top: 2%;
  border-radius: 15upx;
  border: 1px solid #ccc;
}
.commentContainer .commentTextArea .textAreaContainer .btnSubmitComment {
  width: 210upx;
  height: 55upx;
  line-height: 55upx;
  text-align: center;
  font-size: 2.1vh;
  color: #ccc;
  font-weight: bold;
  margin-top: 2%;
  border-radius: 15upx;
  background: linear-gradient(60deg, #b3ffab, #12fff7, #b3ffab);
  border: 1px solid #ccc;
}
.songInfoContainer .songInfoItem {
  width: 98%;
  height: 55upx;
  margin-top: 6%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  border: 0px solid red;
}
.songInfoContainer .songInfoItem .Icon {
  width: 37upx;
  height: 37upx;
  margin-left: 3%;
}
.songInfoContainer .songInfoItem .Text {
  width: 93%;
  height: 55upx;
  line-height: 55upx;
  text-align: left;
  text-indent: 3%;
  font-size: 2.3vh;
  color: #ccc;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border: 0px solid red;
}
.navigation-fixed {
  /* 吸顶固定样式 */
  position: fixed;
  /*top: 35upx;*/
  top: 0;
  left: 0;
  right: 0;
  z-index: 99;
}
.comment-fixed {
  position: fixed;
  /*top: 35upx;*/
  top: 85upx;
  left: 0;
  right: 0;
  z-index: 99;
}
.comment-fixed-flod {
  position: fixed;
  /*top: 35upx;*/
  top: -65upx;
  left: 0;
  right: 0;
  z-index: 99;
}
.tabContainer {
  width: 100%;
  height: 86upx;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  background-color: #ffffffaa;
  border: 0px solid red;
}
.tabContainer .tabActive {
  width: 37%;
  height: 86upx;
  line-height: 86upx;
  font-size: 2.2vh;
  color: #000000;
  font-weight: bolder;
  text-align: center;
  margin-left: 7%;
  cursor: pointer;
  border-bottom: 3px solid #cf129d;
}
.tabContainer .tabNormal {
  width: 37%;
  height: 86upx;
  line-height: 86upx;
  font-size: 2.2vh;
  color: #ccc;
  text-align: center;
  cursor: pointer;
  margin-left: 7%;
}
.sliderContainer {
  width: 100%;
  height: 55upx;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  border: 0px solid red;
}
.sliderContainer .timeLabel {
  width: 19%;
  height: 55upx;
  line-height: 55upx;
  font-size: 2.1vh;
  color: #ccc;
  text-align: center;
  border: 0px solid rgb(45, 17, 203);
}
.sliderContainer .sliderPanel {
  width: 62%;
  height: 55upx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 0px solid #348b0e;
}
.sliderContainer .sliderPanel slider {
  width: 95%;
}
.playControl {
  width: 100%;
  height: 126upx;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  border: 0px solid red;
}
.playControl .normalIcon {
  width: 31upx;
  height: 31upx;
  cursor: pointer;
  margin-left: 8%;
}
.playControl .play-pause-button {
  width: 85upx;
  height: 85upx;
  cursor: pointer;
  margin-left: 8%;
}
.coverContainer {
  width: 100%;
  height: 590upx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 0px solid red;
}
.coverContainer .coverBackground {
  width: 70%;
  height: 490upx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-image: url("../../static/disc.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: 98% 98%;
}
.coverContainer .coverBackground .cover {
  width: 81%;
  height: 420upx;
  border-radius: 215upx;
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
.forwardicon {
  margin-top: 2%;
  cursor: pointer;
}
@media (max-width: 370px) {
  .songNameTitle {
    width: 88%;
    height: 52upx;
    line-height: 52upx;
    margin-top: 3upx;
    margin-left: 15upx;
    border-radius: 10upx;
    text-align: center;
    font-family: "Microsoft YaHei", "微软雅黑", sans-serif;
    font-size: 23upx;
    font-weight: 700;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    color: #000000;
    text-align: center;
  }
  .titlePanel {
    width: 237upx;
    height: 37upx;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    border: 0px solid red;
  }
  .commentContainer .commentTextArea .textAreaContainer .titleContainer .title {
    min-width: 175upx;
    width: auto;
    height: 54upx;
    overflow: hidden;
    line-height: 54upx;
    font-size: 2.3vh;
    color: #060606;
    text-align: left;
    text-indent: 5%;
    margin-left: 1%;
    border: 0px solid red;
  }
}
.uni-scroll-view-content {
  width: 100% !important;
}
.appBarRightIcon {
  margin-left: 2upx;
}
</style>