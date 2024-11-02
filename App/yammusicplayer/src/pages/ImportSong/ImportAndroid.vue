<template>
  <view
    class="container"
    :style="{marginTop:statusBarHeight+'px',height:windowHeight+'px'}"
  >
    <!--appBar-->
    <view
      ref="appBar"
      class="appBar"
    >
      <view
        @click="gotoBack"
        class="forwardiconContainer"
      >
        <image
          src="../../static/angle-left.svg"
          class="forwardicon"
          style="transform: translateX(-1000upx);filter: drop-shadow(#ffffff 1000upx 0)"
          mode="scaleToFill"
        />
      </view>
      <view class="appBarTitle">
        导入歌曲
      </view>
      <view
        @click="chooseMenu"
        class="forwardiconContainer"
      >
        <image
          id="barMenu"
          class="forwardicon"
          src="/static/list.svg"
          style="transform: translateX(-1000upx);filter: drop-shadow(#ffffff 1000upx 0)"
          mode="scaleToFill"
        />
      </view>
    </view>
    <!--/appBar-->
    <view
      class="mainContainer"
      :style="{height:mainContainerHeight+'px'}"
    >
      <!--水波纹进度条-->
      <water-ripple-progress
        class="WaterRippleProgress"
        :Height="WaterRippleProgressSetting.Height"
        :ControlHeight="WaterRippleProgressSetting.ControlHeight"
        :ProgressNum="ProgressNum"
      ></water-ripple-progress>
      <!--/水波纹进度条-->
      <!--进度条-->
      <view class="ProgressContainer">
        <progress
          class="progress"
          :percent="ItemProgressNum"
          :border-radius="'5%'"
          show-info
          :stroke-width="7"
        />
      </view>
      <!--/进度条-->
      <!--主界面-->
      <view class="PanelContainer PanelContainerAnimation">
        <!--按钮层-->
        <view class="ControlContainer">
          <view class="ButtonContainer">
            <view
              v-if="IsReSearch==false&&IsStopSearch===true"
              @click="SearchFiles"
              class="btnItem"
            >
              <image
                class="Icon"
                src="../../static/play-circle-fill-white.svg"
                mode="scaleToFill"
              />
              <view class="Text">开始搜索</view>
            </view>
            <view
              v-if="IsReSearch==false&&IsStopSearch===false"
              @click="PauseSearch"
              class="btnItemPause"
            >
              <image
                class="Icon"
                src="../../static/pause-circle-fill-white.svg"
                mode="scaleToFill"
              />
              <view class="Text">暂停搜索</view>
            </view>
            <view
              v-if="IsReSearch==true&&IsStopSearch===true"
              @click="choseMenuClickItem(3)"
              class="btnItem"
            >
              <image
                class="Icon"
                src="../../static/repeat50.png"
                mode="scaleToFill"
              />
              <view class="Text">重新搜索</view>
            </view>
          </view>
          <view class="ButtonContainer">
            <view
              v-if="IsUploading==false"
              @click="StartUploadFile"
              class="btnItem"
            >
              <image
                class="Icon"
                src="../../static/play-circle-fill-white.svg"
                mode="scaleToFill"
              />
              <view class="Text">上传歌曲</view>
            </view>
            <view
              v-if="IsUploading==true"
              @click="PauseUpload"
              class="btnItemPause"
            >
              <image
                class="Icon"
                src="../../static/pause-circle-fill-white.svg"
                mode="scaleToFill"
              />
              <view class="Text">暂停上传</view>
            </view>
          </view>
        </view>
        <!--/按钮层-->
        <view class="ContentPanel">
          <!--找到的文件列表-->
          <scroll-view
            v-if="tabCurrentIndex==0"
            class="MusicList"
            scroll-y="true"
          >
            <checkbox-group @change="checkboxChange">
              <view
                v-for="(item,index) in SearchMusicList"
                :key="index"
                :class="CheckedValues.includes(item.fileId)?'ItemFileChecked':'ItemFile'"
              >
                <view class="checkBoxContainer">
                  <checkbox :value="item.fileId" />
                </view>
                <view :class="CheckedValues.includes(item.fileId)?'ItemCheckedInfo':'ItemInfo'">
                  <view class="fileName">{{item.fileName}}</view>
                  <view class="line">{{item.filePath}}</view>
                  <view class="line">{{item.fileSize}}</view>
                </view>
              </view>
            </checkbox-group>
          </scroll-view>
          <!--/找到的文件列表-->
          <!--错误消息-->
          <view
            v-if="tabCurrentIndex==1"
            class="MessagePanel"
          >
            <scroll-view
              class="MessageList"
              scroll-y="true"
            >
              <view
                v-for="(item,index) in MessageList"
                :key="index"
                class="MessageItem"
              >
                <view class="MessageTime">{{item.MessageTime}}</view>
                <view class="MessageContent">{{item.Message}}</view>
              </view>
            </scroll-view>
            <view
              @click="copyMessageToClipboard"
              class="btnCopyClipboard"
            >复制消息日志</view>
          </view>
          <!--/错误消息-->
        </view>
      </view>
      <!--/主界面-->
    </view>
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
import WaterRippleProgress from '../../components/WaterRippleProgress.vue';
import ShowActionSheet from '../../components/ShowActionSheet.vue';
import permision from '../../js_sdk/wa-permission/permission.js';
import File from '../../file.js';
import { UploadSongFileUniap } from '../../api.js';
import { formatDateTime, getFileExtension, removeTrailingZeros, generateGUID, convertBytes } from '../../utils.js';
export default {
  components: {
    'show-action-sheet': ShowActionSheet,
    'water-ripple-progress': WaterRippleProgress,
  },
  data() {
    return {
      windowHeight: 0,
      windowWidth: 0,
      statusBarHeight: 0,
      mainContainerHeight: 0,
      IsUploading: true,
      ItemProgressNum: 0,
      ProgressNum: 0,
      WaterRippleProgressSetting: {
        Height: '579upx',
        ControlHeight: '380upx'
      },
      CheckedMusic: [],
      CheckedValues: [],
      tabCurrentIndex: 0,
      MessageList: [
        /*{
          MessageTime: '2024-10-19 00:38:39',
          Message: '测试消息日志，测试消息日志，测试消息日志，测试消息日志,测试消息日志，测试消息日志，测试消息日志，测试消息日志,测试消息日志，测试消息日志，测试消息日志，测试消息日志'
        }*/
      ],
      SearchMusicList: [
        /*{
          fileId: '01',
          fileName: '测试文件1',
          filePath: 'etc/test/Music1',
          fileSize: '10mb'
        }*/
      ],
      showActionSheet: {
        show: false,
        maskClosable: true,
        tips: "快捷菜单",
        itemList: [{
          text: "扫描歌曲列表",
          color: "#333",
          url: ''
        },
        {
          text: "查看日志消息",
          color: "#333",
          url: ''
        },
        {
          text: "重新扫描歌曲",
          color: "#333",
          url: ''
        }
        ],
        color: "#9a9a9a",
        size: 26,
        isCancel: true
      },
      CallBack: '',
      IsAuthorized: false,
      IsStopSearch: true,
      IsReSearch: false,
      IsUploading: false,
      StartSearchPath: '',
      CurrentSearchPath: '',
      CurrentSearchPathList: [],
      CurrentSearchPathIndex: 0,
      CurrentUploadIndex: 0,
      SearchFileTimeHandle: null,
      SearchFileInterval: 500,
      userId: '',
      AlbumId: '',
      currentLoginUser: null,
      timeHandle: null
    }
  },
  onLoad(query) {
    if (query.AlbumId != null && typeof (query.AlbumId) != 'undefined')
      this.AlbumId = removeTrailingZeros(query.AlbumId);
    if (query.CallBack != null && typeof (query.CallBack) != 'undefined')
      this.CallBack = query.CallBack;
    this.resizeModel();
    this.UniGetSetting();
  },
  onReady() {
    this.resizeModel();
    this.UniGetSetting();
  },
  onResize(res) {
    this.resizeModel();
  },
  mounted: function () {
    this.resizeModel();
    this.UniGetSetting();
  },
  methods: {
    GetLoginUser() {
      let that = this;
      that.currentLoginUser = that.$store.state.user;
      if (that.currentLoginUser == null) {
        uni.showToast({
          title: `没有登录不能导入歌曲`,
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
    PauseSearch() {
      let that = this;
      clearTimeout(that.SearchFileTimeHandle);
      that.$nextTick(() => {
        that.IsStopSearch = true;
        console.log('PauseSearch that.IsStopSearch', that.IsStopSearch)
      });
    },
    PauseUpload() {
      let that = this;
      clearTimeout(that.timeHandle);
      //uni.hideLoading();
      that.ItemProgressNum = 0;
      that.IsUploading = false;
      console.log('PauseUpload that.IsUploading', that.IsUploading)
    },
    StartUploadFile() {
      let that = this;
      if (!that.GetLoginUser())
        return false;
      if (that.CheckedMusic.length <= 0) {
        uni.showToast({
          title: '没有选择要上传的文件无法上传文件',
          icon: 'fail',
          duration: 2000
        });
        return false;
      }
      that.IsUploading = true;
      that.BatchUploadFile()
    },
    BatchUploadFile() {
      let that = this;
      let itemFilePath = that.CheckedMusic[that.CurrentUploadIndex].filePath;
      let itemFile = that.CheckedMusic[that.CurrentUploadIndex];
      let timeStamp = '';
      if (!that.IsUploading) {
        clearTimeout(that.timeHandle);
        return false;
      }
      //that.showToast(message, 'loading');
      that.timeHandle = setTimeout(() => {
        clearTimeout(that.timeHandle);
        UploadSongFileUniap({
          parm: {
            userid: that.userId,
            albumId: removeTrailingZeros(that.AlbumId)
          },
          filePath: itemFilePath,
          beforeCallBack: () => { },
          responseCallBack: res => {
            console.log('BatchUploadFile res', res);
            if (res != null && typeof (res) != 'undefined') {
              const { status, msg } = JSON.parse(res);
              if (status !== 0) {
                timeStamp = formatDateTime(new Date(), "yyyy-MM-dd HH:mm:ss")
                let itemErrorMsg = `[${timeStamp}]上传文件[${itemFile.fileName}]报错,原因:${msg}`;
                that.showToast(itemErrorMsg, 'fail');
                //that.LogMessage.push(itemErrorMsg);
              } else {
                timeStamp = formatDateTime(new Date(), "yyyy-MM-dd HH:mm:ss")
                let itemErrorMsg = `[${timeStamp}]上传文件[${itemFile.fileName}]成功`;
                that.showToast(itemErrorMsg, 'success');
                //that.LogMessage.push(itemErrorMsg);
              }
            }
            that.ContinueBatchUpload();
          },
          errorCallback: error => {
            timeStamp = formatDateTime(new Date(), "yyyy-MM-dd HH:mm:ss")
            let itemErrorMsg = `[${timeStamp}]上传文件[${itemFile.fileName}]报错,原因:${error}`;
            //that.LogMessage.push(itemErrorMsg);
            that.showToast(itemErrorMsg, 'fail');
            that.ContinueBatchUpload();
          },
          progressUpdate: progressValue => {
            that.ShowUploadProgressToast();
            console.log('BatchUploadFile progressValue', progressValue);
            that.ItemProgressNum = progressValue;
          }
        })
      })
    },
    ContinueBatchUpload() {
      let that = this;
      if (!that.IsUploading) {
        clearTimeout(that.timeHandle);
        return false;
      }
      that.CurrentUploadIndex += 1;
      that.ProgressNum = Math.round(
        (that.CurrentUploadIndex / that.CheckedMusic.length) * 100
      );
      if (that.ProgressNum > 100)
        that.ProgressNum = 100
      if (that.CurrentUploadIndex < that.CheckedMusic.length && that.IsUploading)
        that.BatchUploadFile();
      else {
        that.CurrentUploadIndex = 0;
        that.IsUploading = false;
        that.RemoveCheckMusic();
        that.CheckedMusic = [];
        //uni.hideLoading();
        that.showToast(`全部上传完成`, 'success')
        clearTimeout(that.timeHandle);
      }
    },
    RemoveCheckMusic() {
      let that = this;
      let CheckedMusicID = '';
      that.CheckedMusic.forEach(itemFile => {
        CheckedMusicID += itemFile.fileId + ',';
      });
      that.SearchMusicList = that.SearchMusicList.filter(item => {
        return CheckedMusicID.indexOf(item.fileId) == -1;
      });
    },
    ShowUploadProgressToast() {
      let that = this;
      let message = `正在上传第[${that.CurrentUploadIndex + 1}]/[${that.CheckedMusic.length}]个文件`;
      //that.showToast(`正在上传第[${that.CurrentUploadIndex + 1}]/[${that.CheckedMusic.length}]个文件`, 'loading')
      uni.showToast({
        title: message,
        icon: 'loading',
        duration: 2000
      });
    },
    SearchFiles() {
      let that = this;
      let message = '';
      if (that.IsUploading) {
        uni.showToast({
          title: '文件上传中无法搜索文件',
          icon: 'fail',
          duration: 2000
        });
        return false;
      }
      //#region 初始化搜索
      if (that.CurrentSearchPathList.length <= 0) {
        if (!that.IsAuthorized) {
          uni.showToast({
            title: '没有授权无法搜索',
            icon: 'success',
            duration: 2000
          });
          return false;
        }
        let rootPath = File.root();
        if (rootPath.state != 0) {
          message = `获取手机存储目录路径出错,原因[${rootPath.message}]`;
          that.showToast(message, 'fail')
          return false;
        }
        that.StartSearchPath = rootPath.result;
        that.showToast('递归获取要搜索的目录', 'loading')
        uni.showLoading({
          title: '递归获取要搜索的目录'
        });
        console.log('rootPath', rootPath)
        that.RecursionSearchPath(that.StartSearchPath);
        uni.hideLoading();
        that.showToast('要搜索的目录获取完成', 'success')
      }
      //#endregion
      that.IsStopSearch = false;
      that.BatchSearchFile();
    },
    BatchSearchFile() {
      let that = this;
      if (that.IsStopSearch)
        return false;
      that.SearchFileTimeHandle = setTimeout(() => {
        clearTimeout(that.SearchFileTimeHandle)
        let index = that.CurrentSearchPathIndex;
        that.CurrentSearchPath = that.CurrentSearchPathList[index];
        that.showToast(`搜索文件夹[${index + 1}/${that.CurrentSearchPathList.length}][${that.CurrentSearchPath}]`, 'loading')
        try {
          let dir = plus.android.newObject('java.io.File', that.CurrentSearchPath);
          let dirElement = plus.android.invoke(dir, 'listFiles');
          if (!that.IsStopSearch) {
            if (dirElement != null && typeof (dirElement) != 'undefined') {
              if (dirElement.length != null && typeof (dirElement.length) != 'undefined' && dirElement.length > 0) {
                for (var i = 0; i < dirElement.length; i++) {
                  let elementItem = dirElement[i];
                  let isFile = plus.android.invoke(elementItem, 'isFile');
                  let elementItemPath = plus.android.invoke(elementItem, 'getAbsolutePath');
                  let elementItemName = plus.android.invoke(elementItem, 'getName');
                  let elementSize = plus.android.invoke(elementItem, 'length');
                  let FileExtension = getFileExtension(elementItemName);
                  //#region 添加扫描到的文件
                  if (isFile) {
                    if (FileExtension.toLocaleLowerCase().indexOf('mp3') != -1) {
                      that.SearchMusicList.push({
                        fileId: generateGUID(),
                        fileName: elementItemName,
                        filePath: elementItemPath,
                        fileSize: convertBytes(elementSize)
                      })
                    }
                  }
                  //#endregion
                }
              }
            }
          }
        } catch (e) {
          that.showToast(`搜索文件夹[${index}/${that.CurrentSearchPathList.length}][${that.CurrentSearchPath}],出错原因[${e}]`, 'fail')
        }
        that.CurrentSearchPathIndex += 1;
        index = that.CurrentSearchPathIndex;
        if (index <= that.CurrentSearchPathList.length - 1 && that.IsStopSearch == false) {
          that.ItemProgressNum = parseInt((index / that.CurrentSearchPathList.length) * 100)
          console.log('BatchSearchFile ItemProgressNum', that.ItemProgressNum)
          that.BatchSearchFile();
        }
        if (index == that.CurrentSearchPathList.length - 1) {
          that.ItemProgressNum = 100;
          that.IsReSearch = true;
          that.IsStopSearch = true;
        }
      }, that.SearchFileInterval);
    },
    RecursionSearchPath(SearchPath) {
      let that = this;
      let dir = plus.android.newObject('java.io.File', SearchPath);
      let dirElement = plus.android.invoke(dir, 'listFiles');
      let dirPath = [];
      //console.log('RecursionSearchPath dirElement', dirElement)
      if (dirElement != null && typeof (dirElement) != 'undefined') {
        if (dirElement.length != null && typeof (dirElement.length) != 'undefined' && dirElement.length > 0) {
          for (var i = 0; i < dirElement.length; i++) {
            var elementItem = dirElement[i];
            var isDirectory = plus.android.invoke(elementItem, 'isDirectory');
            var elementItemPath = plus.android.invoke(elementItem, 'getAbsolutePath');
            if (isDirectory) {
              console.log(`找到文件夹[${elementItemPath}]`)
              that.CurrentSearchPathList.push(elementItemPath)
              dirPath.push(elementItemPath);
            }
          }
        }
      }
      if (dirPath != null && typeof (dirPath) != 'undefined') {
        if (dirPath.length != null && typeof (dirPath.length) != 'undefined' && dirPath.length > 0) {
          dirPath.forEach(childPath => {
            let chidDir = plus.android.newObject('java.io.File', childPath);
            let childPathList = plus.android.invoke(chidDir, 'listFiles')
            if (childPathList != null && typeof (childPathList) != 'undefined' && childPathList.length != null && typeof (childPathList.length) != 'undefined' && childPathList.length > 0)
              that.RecursionSearchPath(childPath);
          });
        }
      }
    },
    //旧递归代码
    RecursionSearchFile(CurPath) {
      let that = this;
      that.BatchSearchFile(CurPath)
      that.SearchFileTimeHandle = setTimeout(() => {
        clearTimeout(that.SearchFileTimeHandle);
        if (that.IsStopSearch == false)
          that.RecursionSearchFile(CurPath)
      }, that.SearchFileInterval);
    },
    //旧搜索代码
    BatchSearchFileOld(CurPath) {
      let that = this;
      that.CurrentSearchPath = CurPath;
      that.showToast(`开始搜索文件夹[${CurPath}]`, 'loading')
      let dir = plus.android.newObject('java.io.File', that.CurrentSearchPath);
      let dirElement = plus.android.invoke(dir, 'listFiles');
      let dirPath = [];
      if (that.IsStopSearch) return false;
      if (dirElement != null && typeof (dirElement) != 'undefined') {
        if (dirElement.length != null && typeof (dirElement.length) != 'undefined' && dirElement.length > 0) {
          for (var i = 0; i < dirElement.length; i++) {
            var elementItem = dirElement[i];
            var isDirectory = plus.android.invoke(elementItem, 'isDirectory');
            var isFile = plus.android.invoke(elementItem, 'isFile');
            var elementItemPath = plus.android.invoke(elementItem, 'getAbsolutePath');
            var elementItemName = plus.android.invoke(elementItem, 'getName');
            var elementSize = plus.android.invoke(elementItem, 'length');
            var FileExtension = getFileExtension(elementItemName);
            if (isDirectory)
              dirPath.push(elementItemPath)
            //#region 添加扫描到的文件
            if (isFile) {
              if (FileExtension.toLocaleLowerCase().indexOf('mp3') != -1) {
                that.SearchMusicList.push({
                  fileId: generateGUID(),
                  fileName: elementItemName,
                  filePath: elementItemPath,
                  fileSize: convertBytes(elementSize)
                })
              }
            }
            //#endregion
          }
          if (dirPath != null && typeof (dirPath) != 'undefined') {
            if (dirPath.length != null && typeof (dirPath.length) != 'undefined' && dirPath.length > 0) {
              if (that.IsStopSearch == false) {
                dirPath.forEach(childPath => {
                  that.$nextTick(() => {
                    that.BatchSearchFile(childPath);
                  })
                });
              }
            }
          }
        }
      }
      //that.CurrentSearchPathList = dirPath;
    },
    showToast(message, icon) {
      let that = this;
      uni.showToast({
        title: message,
        position: 'center',
        icon: icon,
        duration: 2000
      });
      that.MessageList.push({
        MessageTime: formatDateTime(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        Message: message
      })
    },
    gotoAlbumEdit(Action, id) {
      let that = this;
      let gotoUrl = '/pages/albums/albumEdit';
      if (Action == null || typeof (Action) == 'undefined' || Action == '') {
        Action = 'Add';
      }
      if (id == null || typeof (id) == 'undefined' || id == '') {
        id = '';
      }
      id = removeTrailingZeros(id);
      gotoUrl += '?Action=' + Action + '&AlbumId=' + id;
      console.log('gotoAlbumEdit gotoUrl', gotoUrl);
      uni.navigateTo({
        url: gotoUrl
      });
    },
    gotoBack() {
      let that = this;
      that.initData();
      switch (that.CallBack) {
        case 'albumEdit':
          that.gotoAlbumEdit('Edit', that.AlbumId);
          break;
        case 'albumInfo':
          uni.navigateTo({
            url: '/pages/albums/albumInfo?albumId=' + that.AlbumId
          });
          break;
      }
    },
    //安卓申请权限代码(权限字符串)
    // vue的method里编写如下代码
    async requestAndroidPermission(permisionID) {
      let that = this;
      var result = await permision.requestAndroidPermission(permisionID)
      var strStatus
      if (result == 1) {
        strStatus = "已获得授权";
        that.IsAuthorized = true;
      } else if (result == 0) {
        strStatus = "未获得授权"
        that.IsAuthorized = false;
        uni.showModal({
          title: '提示',
          content: '搜索文件需要申请文件读写权限,是否跳转到系统权限设置页面?',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击了确认');
              permision.gotoAppPermissionSetting();
              // 用户点击了确认的相关操作
            } else if (res.cancel) {
              console.log('用户点击了取消');
              // 用户点击了取消的相关操作
              that.gotoBack();
            }
          }
        });
      } else {
        strStatus = "被永久拒绝权限";
        that.IsAuthorized = false;
        that.gotoBack();
      }
    },
    UniGetSetting() {
      this.requestAndroidPermission('android.permission.READ_EXTERNAL_STORAGE')
      this.requestAndroidPermission('android.permission.WRITE_EXTERNAL_STORAGE')
    },
    copyMessageToClipboard() {
      let that = this;
      let text = '';
      if (that.MessageList != null && typeof (that.MessageList) != 'undefined') {
        that.MessageList.forEach(MessageItem => {
          text += `[${MessageItem.MessageTime}]\t\r${MessageItem.Message}\r\n`;
        });
        that.copyTextToClipboard(text);
      }
    },
    // 复制文本到剪贴板
    copyTextToClipboard(text) {
      uni.setClipboardData({
        data: text,
        success: function () {
          console.log('复制成功');
          // 可以添加用户友好的提示，例如使用uni.showToast提示复制成功
          uni.showToast({
            title: '复制成功',
            icon: 'success',
            duration: 2000
          });
        },
        fail: function () {
          console.log('复制失败');
          // 可以添加错误处理或用户友好的提示
        }
      });
    },
    checkboxChange(e) {
      let that = this;
      that.CheckedValues = e.detail.value;
      let values = that.CheckedValues;
      that.CheckedMusic = [];
      for (var i = 0; i < that.SearchMusicList.length; i++) {
        const item = that.SearchMusicList[i]
        if (values.includes(item.fileId)) {
          that.CheckedMusic.push(item);
        }
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
    initData() {
      that.IsStopSearch = false;
      that.IsReSearch = false;
      that.IsUploading = false;
      that.SearchMusicList = [];
      that.MessageList = [];
      that.ItemProgressNum = 0;
      that.ProgressNum = 0;
      that.CurrentSearchPathList = [];
      that.CurrentSearchPathIndex = 0;
      that.CurrentUploadIndex = 0;
    },
    choseMenuClickItem(menuIndex) {
      let that = this;
      if (menuIndex != 3) {
        that.tabCurrentIndex = menuIndex;
      }
      else {
        if (that.IsUploading) {
          uni.showToast({
            title: '文件上传中无法重新搜索文件',
            icon: 'fail',
            duration: 2000
          });
        }
        else {
          that.$nextTick(() => {
            that.initData();
            that.SearchFiles();
          })
        }
      }
      that.chooseCancel();
    },
    gotoBack() {
      let that = this;
      that.IsUploading = false;
      that.IsStopSearch = true;
      uni.hideLoading();
      uni.navigateBack({
        delta: 1
      });
    },
    resizeModel() {
      let that = this;
      uni.getSystemInfo({
        success: res => {
          that.windowHeight = res.windowHeight - res.statusBarHeight;
          that.windowWidth = res.windowWidth;
          that.statusBarHeight = res.statusBarHeight;
          const query = uni.createSelectorQuery().in(that);
          let appBar = query.select('.appBar');
          appBar.boundingClientRect(data => {
            if (data) {
              const appBarHeight = data.height;
              that.mainContainerHeight = that.windowHeight - appBarHeight;
            }
          }).exec();
        }
      });
    }
  }
}
</script>

<style scoped>
/*background-image: linear-gradient(to right, #f78ca0 0%, #f9748f 19%, #fd868c 60%, #fe9a8b 100%);*/
.mainContainer {
  width: 100%;
}

.PanelContainer .ContentPanel .MessagePanel {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border: 0px solid red;
}

.PanelContainer
  .ContentPanel
  .MessagePanel
  .MessageList
  .MessageItem
  .MessageContent {
  width: 96%;
  min-height: 125upx;
  height: auto;
  overflow: hidden;
  text-align: left;
  text-indent: 1%;
  font-size: 37upx;
  color: #000;
  border: 0px solid red;
}

.PanelContainer
  .ContentPanel
  .MessagePanel
  .MessageList
  .MessageItem
  .MessageTime {
  width: 96%;
  height: 65upx;
  line-height: 65upx;
  text-align: left;
  text-indent: 2%;
  font-size: 37upx;
  color: #000;
  font-weight: 700;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  border-bottom: 1px dashed #ccc;
}

.PanelContainer .ContentPanel .MessagePanel .MessageList .MessageItem {
  width: 96;
  min-height: 189upx;
  height: auto;
  overflow: hidden;
  margin-top: 4%;
  margin-bottom: 3%;
  margin-left: 2%;
  border-radius: 15upx;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border: 1px solid #ccc;
}

.PanelContainer .ContentPanel .MessagePanel .MessageList {
  width: 100%;
  height: 85%;
  border: 0px solid blue;
}

.PanelContainer .ContentPanel .MessagePanel .btnCopyClipboard {
  width: 56%;
  height: 77upx;
  line-height: 77upx;
  text-align: center;
  color: #000;
  font-size: 35upx;
  margin-top: 2%;
  margin-bottom: 2%;
  border: 1px solid #ccc;
  border-radius: 10upx;
  background-image: linear-gradient(to top, #e6e9f0 0%, #eef1f5 100%);
}

.PanelContainer .ContentPanel .MusicList .ItemFileChecked {
  width: 92%;
  height: 178upx;
  border-radius: 15upx;
  margin-top: 4%;
  margin-bottom: 3%;
  margin-left: 4%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  background-image: linear-gradient(
    to right,
    #f78ca0 0%,
    #f9748f 19%,
    #fd868c 60%,
    #fe9a8b 100%
  );
  box-shadow: 2px 4px 1px 1px #8c838359;
}

.PanelContainer .ContentPanel .MusicList .ItemFileChecked .checkBoxContainer {
  width: 15%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 0px solid red;
}

.PanelContainer
  .ContentPanel
  .MusicList
  .ItemFileChecked
  .ItemCheckedInfo
  .line {
  width: 96%;
  height: 30upx;
  line-height: 30upx;
  font-size: 22upx;
  text-align: left;
  text-indent: 2%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  color: #fff;
  margin-top: 2%;
  border: 0px solid #fff;
}

.PanelContainer
  .ContentPanel
  .MusicList
  .ItemFileChecked
  .ItemCheckedInfo
  .fileName {
  width: 96%;
  height: 57upx;
  line-height: 57upx;
  font-size: 33upx;
  font-weight: 700;
  text-align: left;
  text-indent: 2%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  color: #fff;
  margin-top: 3%;
  border: 0px solid #fff;
}

.PanelContainer .ContentPanel .MusicList .ItemFileChecked .ItemCheckedInfo {
  width: 87%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border: 0px solid red;
}

.PanelContainer .ContentPanel .MusicList .ItemFile .ItemInfo .line {
  width: 96%;
  height: 30upx;
  line-height: 30upx;
  font-size: 22upx;
  text-align: left;
  text-indent: 2%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  color: #000;
  margin-top: 2%;
  border: 0px solid red;
}

.PanelContainer .ContentPanel .MusicList .ItemFile .ItemInfo .fileName {
  width: 96%;
  height: 57upx;
  line-height: 57upx;
  font-size: 33upx;
  font-weight: 700;
  text-align: left;
  text-indent: 2%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  color: #000;
  margin-top: 3%;
  border: 0px solid red;
}

.PanelContainer .ContentPanel .MusicList .ItemFile .ItemInfo {
  width: 87%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border: 0px solid red;
}

.PanelContainer .ContentPanel .MusicList .ItemFile .checkBoxContainer {
  width: 15%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 0px solid red;
}

.PanelContainer .ContentPanel .MusicList .ItemFile {
  width: 92%;
  height: 178upx;
  border-radius: 15upx;
  margin-top: 4%;
  margin-bottom: 3%;
  margin-left: 4%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  box-shadow: 2px 4px 1px 1px #8c838359;
}

.PanelContainer .ContentPanel .MusicList {
  width: 100%;
  height: 100%;
  border: 0px solid red;
}

.PanelContainer .ContentPanel {
  width: 96%;
  height: 85%;
  margin-top: 1%;
  border: 0px solid red;
}

.PanelContainer .ControlContainer .ButtonContainer .btnItem {
  width: 75%;
  height: 87upx;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  border-radius: 15upx;
  background: linear-gradient(180deg, #9cecfb, #65c7f7, #0052d4);
  border: 1px solid blue;
}

.PanelContainer .ControlContainer .ButtonContainer .btnItem .Icon {
  width: 56upx;
  height: 56upx;
  margin-left: 6%;
}

.PanelContainer .ControlContainer .ButtonContainer .btnItem .Text {
  width: 61%;
  height: 56upx;
  line-height: 56upx;
  text-align: center;
  color: #ffffff;
  font-size: 35upx;
  font-weight: 700;
  margin-left: 5%;
  border: 0px solid red;
}

.PanelContainer .ControlContainer .ButtonContainer .btnItemPause {
  width: 75%;
  height: 87upx;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  border-radius: 15upx;
  background: linear-gradient(180deg, #a8ff78, #78ffd6);
  border: 1px solid #78ffd6;
}

.PanelContainer .ControlContainer .ButtonContainer .btnItemPause .Icon {
  width: 56upx;
  height: 56upx;
  margin-left: 6%;
}

.PanelContainer .ControlContainer .ButtonContainer .btnItemPause .Text {
  width: 61%;
  height: 56upx;
  line-height: 56upx;
  text-align: center;
  color: #ffffff;
  font-size: 35upx;
  font-weight: 700;
  margin-left: 5%;
  border: 0px solid red;
}

.PanelContainer .ControlContainer .ButtonContainer {
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 0px solid red;
}

.PanelContainer .ControlContainer {
  width: 100%;
  height: 105upx;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  border: 0px solid red;
}

.PanelContainer {
  width: 100%;
  height: 56%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border-top-left-radius: 5%;
  border-top-right-radius: 5%;
  background-color: #ffffff80;
}

.PanelContainerAnimation {
  animation-name: PanelContainerAnimation;
  animation-duration: 0.8s;
  animation-fill-mode: forwards;
}

@keyframes PanelContainerAnimation {
  from {
    height: 0%;
    margin-top: 76%;
  }

  to {
    height: 56%;
    margin-top: 0%;
  }
}

.WaterRippleProgress {
  width: 100%;
  height: 35upx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.WaterRippleProgress .progress {
  width: 85%;
  /*margin-left: 12.5%;*/
  margin-bottom: 3%;
}

.ProgressContainer {
  width: 100%;
  height: 35upx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 3%;
}

.ProgressContainer .progress {
  width: 85%;
  /*margin-left: 12.5%;*/
  margin-bottom: 3%;
}

.forwardiconContainer {
  width: 55upx;
  height: 55upx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.container {
  width: 100%;
  background: linear-gradient(180deg, #18a4fd, #ffffff);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.appBar {
  width: 100%;
  height: 73upx;
  line-height: 73upx;
  background-color: #35f2ee4d;
  border-bottom: 2px solid #ffffff;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

.appBarTitle {
  width: 81%;
  height: 73upx;
  line-height: 73upx;
  text-align: center;
  color: #ffffff;
  font-size: 3.3vh;
  font-weight: 700;
  margin-left: 1%;
  border: 0px solid red;
}

.forwardicon {
  width: 43upx;
  height: 43upx;
  margin-left: 15upx;
  margin-bottom: 10upx;
  color: #ffffff;
  cursor: pointer;
}
</style>