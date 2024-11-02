<script>
export default {
  onLaunch: function () {
    console.log('App Launch')
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  }
}
</script>

<style>
/*每个页面公共css */
.appBar {
  width: 100%;
  height: 51upx;
  line-height: 51upx;
  border-bottom: 1upx solid #ccc;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}
.forwardicon {
  width: 23upx;
  height: 23upx;
  margin-top: 12upx;
  margin-left: 15upx;
  cursor: pointer;
}
.appBarRightIcon {
  width: 26upx;
  height: 23upx;
  margin-top: 12upx;
  margin-left: 15upx;
  cursor: pointer;
}
.appBarTitleContainer {
  width: 88%;
  height: 47upx;
  line-height: 47upx;
  margin-top: 3upx;
  margin-left: 15upx;
  border-radius: 10upx;
  text-align: center;
  font-family: "Microsoft YaHei", "微软雅黑", sans-serif;
  font-size: 21upx;
  color: #ffffff;
  text-align: center;
  /* filter: drop-shadow(0 0 10rpx #525252); */
  text-shadow: 2px 3px 2px #994e4e;
  background: linear-gradient(157deg, #84fab0, #8fd3f4);
}
@media (max-width: 370px) {
  .appBarTitleContainer {
    width: 83%;
    height: 53upx;
    line-height: 53upx;
  }
  .appBar {
    height: 63upx;
  }
  .forwardicon {
    width: 35upx;
    height: 35upx;
    margin-top: 10upx;
    margin-left: 15upx;
    cursor: pointer;
  }
  .appBarRightIcon {
    width: 35upx;
    height: 35upx;
    margin-top: 10upx;
    margin-left: 15upx;
    cursor: pointer;
  }
}
.mainContent {
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 0upx solid red;
}
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content:flex-start;
  background-color: #f2f2f2;
}

*::-webkit-scrollbar {
  width: 7px;
  height: 7rpx;
  background-color: transparent;
}

/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
*::-webkit-scrollbar-track {
  background-color: transparent;
}

/*定义滚动条轨道 内阴影+圆角*/
*::-webkit-scrollbar-thumb {
  background-color: #7c7c7c8d;
  border-radius: 3rpx;
}
</style>
