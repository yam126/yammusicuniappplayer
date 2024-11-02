<template>
  <view
    class="ControlContainer"
    :style="{height:Height}"
  >
    <view
      class="progressContainer"
      :style="{height:ControlHeight,width:ControlHeight}"
    >
      <view class="Text">
        {{ProgressNum}}%
      </view>
      <view
        :style="{top:Percentage+'%'}"
        class="waterProgress waterProgressAnimation"
      ></view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'WaterRippleProgress',
  props: {
    ProgressNum: Number,
    Height: String,
    ControlHeight: String,
    required: true
  },
  watch: {
    ProgressNum(newVal, oldVal) {
      this.UpdateProgress();
    }
  },
  data() {
    return {
      Percentage: 0,
    }
  },
  onLoad(options) {
    this.UpdateProgress();
  },
  onReady() {
    this.UpdateProgress();
  },
  onResize(res) {
    this.UpdateProgress();
  },
  mounted: function () {
    this.UpdateProgress();
  },
  methods: {
    UpdateProgress() {
      this.Percentage = 100 - this.ProgressNum
    }
  }
}
</script>


<style scoped>
.ControlContainer {
  width: 100%;
  display: flex;
  background-color: transparent;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 0px solid red;
}
.progressContainer {
  border-radius: 50%;
  background-color: #f9f9f9;
  overflow: hidden;
  position: relative;
  box-shadow: 0px 2px 13px 11px #254e8b70;
}
.progressContainer .Text {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0%;
  left: 0%;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 78upx;
  color: #3aa6a0;
}
.waterRipple {
  width: 65%;
  height: 65%;
}
.progressContainer .waterProgress {
  width: 175%;
  height: 175%;
  top: 98%;
  left: -35%;
  z-index: 0;
  position: absolute;
  background-color: #add8e6;
  border-radius: 35%;
  transform: rotate(45deg);
}
.waterProgressAnimation {
  animation: waterProgressAnimation 5s linear infinite;
}
@keyframes waterProgressAnimation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
