<template>
  <view :style="{width:Width,height:Height}">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      :width="Width"
      :height="Height"
      :fill="FillColor"
      class="bi bi-play-circle-fill"
      viewBox="0 0 16 16"
    >
      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z" />
    </svg>
  </view>
</template>

<script>
export default {
  name: 'play-circle-fill',
  props: {
    FillColor: {
      type: String,
      default: 'black'
    },
    Width: {
      type: String,
      default: '16'
    },
    Height: {
      type: String,
      default: '16'
    }
  }
}
</script>