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
        关于程序
      </view>
    </view>
    <!--/appBar-->
    <scroll-view
      scroll-y="true"
      class="mainContainer"
      :style="{height:mainContainerHeight+'px'}"
    >
      <image
        class="logo"
        src="../../static/LogoHorizontal.png"
        mode="scaleToFill"
      />
      <view class="title">
        一、开源声明
      </view>
      <view class="section">
        本软件旨在研究学习只用,软件图标,界面设计版权归作者所有。软件下载使用者禁止在未经作者同意用于商业用途。
      </view>
      <view class="section">
        软件下载使用者，可以在学习研究用途对本软件进行修改，重新编译，但是不得删除作者信息。
      </view>
      <view class="section">
        本软件包含第三方的开源组件或库，这些组件或库受其各自的许可限制，您也要遵守这些许可限制。
      </view>
      <view class="section">
        原作者不对本软件任何使用方式负任何责任，包括但不限于直接或间接的损失或损坏。
      </view>
      <view class="section">
        原作者保留随时修改本开源使用声明的权利，修改后的声明将在原作者的官方网站或代码仓库上公布。
      </view>
      <view class="title">
        一、Open source statement
      </view>
      <view class="section">
        This software is designed for research purposes only. The copyright of the software icon and interface design belongs to the author. Software download users are prohibited from using it for commercial purposes without the author's consent.
      </view>
      <view class="section">
        Software download users can modify and reinstall this software for learning and research purposes Compile,but do not delete author information.
      </view>
      <view class="section">
        This software contains third-party open-source components or libraries, which are licensed under their respective licenses May be restricted, and you must also comply with these license restrictions.
      </view>
      <view class="section">
        The original author is not responsible for any usage of this software, including but not limited to direct use Or indirect loss or damage.
      </view>
      <view class="section">
        The original author reserves the right to modify this open source usage statement at any time, and the modified statement will be published in the Published on the official website or code repository of the original author.
      </view>
      <view class="title">
        二、版权声明
      </view>
      <view class="section">
        本程序的音乐数据版权仅供学习研究只用,任何人因传播或者用于商业用途造成的版权问题和作者无关。
      </view>
      <view class="section">
        本程序使用的第三方图标和背景图均已购买，所以第三方图标和背景图片不存在任何版权问题。
      </view>
      <view class="title">
        二、 Copyright Notice
      </view>
      <view class="section">
        The music data copyright of this program is for learning and research purposes only, and no one may use it for dissemination or use Copyright issues caused by commercial use are not related to the author.
      </view>
      <view class="section">
        The third-party icons and background images used in this program have been purchased, so the third-party icons There is no copyright issue with the background image.
      </view>
      <view class="title">
        三、作者信息
      </view>
      <view class="section">姓名:杨明</view>
      <view class="section">QQ:760044511</view>
      <view class="section">Email:yms126@qq.com</view>
      <view class="section">WeChat:Ming_Yang_760444511</view>
      <view class="title">
        三、Contact Author
      </view>
      <view class="section">Name:Ming Yang</view>
      <view class="section">QQ:760044511</view>
      <view class="section">Email:yms126@qq.com</view>
      <view class="section">WeChat:Ming_Yang_760444511</view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      windowHeight: 0,
      windowWidth: 0,
      statusBarHeight: 0,
      mainContainerHeight: 0
    }
  },
  onLoad(query) {
    this.resizeModel();
  },
  onReady() {
    this.resizeModel();
  },
  onResize(res) {
    this.resizeModel();
  },
  mounted: function () {
    this.resizeModel();
  },
  methods: {
    gotoBack() {
      uni.switchTab({
        url: '/pages/index/index'
      })
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
.logo {
  width: 78%;
  height: 159upx;
  margin-left: 11%;
  margin-top: 5%;
}
.title {
  width: 100%;
  min-height: 96upx;
  height: auto;
  line-height: 96upx;
  overflow: hidden;
  font-size: 67upx;
  color: #000;
  font-weight: 800;
  text-align: left;
  text-indent: 2%;
  margin-top: 3%;
}
.section {
  width: 100%;
  min-height: 105upx;
  height: auto;
  line-height: 75upx;
  font-size: 53upx;
  text-align: left;
  text-indent: 8%;
  color: #000;
  overflow: hidden;
  word-break: break-all; /*只对英文起作用，以字母作为换行依据。*/
  word-wrap: break-word; /*只对英文起作用，以单词作为换行依据。*/
  white-space: pre-wrap; /*只对中文起作用，强制换行。*/
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
.mainContainer {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}
.container {
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background: linear-gradient(to top, #ffffff, #12fff7);
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