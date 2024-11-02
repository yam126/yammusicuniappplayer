import { AddFriend, AddSharingHistory, AddShareAlbum } from './api.js'
export const ScanCodeResultProcessing = (CodeResult, LoginUser) => {
  console.log('ScanCodeResultProcessing CodeResult', CodeResult)
  if (
    (CodeResult.Action == null || typeof CodeResult.Action == 'undefined') &&
    (CodeResult.Value == null || typeof CodeResult.Value == 'undefined')
  ) {
    uni.showModal({
      title: '扫码结果',
      content: CodeResult,
      showCancel: false,
    })
    return false
  }
  if (LoginUser == null || typeof LoginUser == 'undefiend') {
    uni.showModal({
      title: '添加好友前请先登录',
      content: CodeResult,
      showCancel: false,
    })
    return false
  }
  switch (CodeResult.Action) {
    case 'AddFriend':
      AddFriend({
        parm: {
          userId: LoginUser.userId,
          friendId: CodeResult.Value,
        },
        beforeCallBack: () => {
          uni.showLoading({
            title: '添加好友中',
          })
        },
        responseCallBack: (res) => {
          uni.hideLoading()
          if (res != null && typeof res != 'undefined') {
            console.log('AddFriend resData', res)
            const { status, msg } = res
            if (status !== 0) {
              uni.showToast({
                title: `添加好友出错,原因[${msg}]`,
                position: 'center',
                icon: 'fail',
                duration: 2000,
              })
            } else {
              uni.showToast({
                title: `添加好友成功`,
                position: 'center',
                icon: 'success',
                duration: 2000,
              })
            }
          }
        },
        errorCallback: (error) => {
          uni.showToast({
            title: `添加好友出错,原因[${error}]`,
            position: 'center',
            icon: 'fail',
            duration: 2000,
          })
        },
      })
      break
    case 'ShareMusic':
      let songId = CodeResult.Value.split('-')[0]
      let shareUser = CodeResult.Value.split('-')[1]
      let shareTarget = LoginUser.userId
      AddSharingHistory({
        parm: {
          songId: songId,
          shareTarget: shareTarget,
          shareUser: shareUser,
        },
        beforeCallBack: () => {
          uni.showLoading({
            title: '读取分享歌曲数据',
          })
        },
        responseCallBack: (res) => {
          uni.hideLoading()
          if (res != null && typeof res != 'undefined') {
            console.log('AddSharingHistory resData', res)
            const { status, msg } = res
            if (status !== 0) {
              uni.showToast({
                title: `读取分享歌曲出错,原因[${msg}]`,
                position: 'center',
                icon: 'fail',
                duration: 2000,
              })
            } else {
              console.log('AddSharingHistory songId', songId)
              uni.setStorageSync('playPageParms', { songId: songId })
              uni.switchTab({
                url: `/pages/playerPage/index?songId=${songId}`,
              })
            }
          }
        },
      })
      break
    case 'ShareAlbum':
      AddShareAlbum({
        parm: {
          albumId: CodeResult.Value,
        },
        beforeCallBack: () => {
          uni.showLoading({
            title: '读取分享专辑数据',
          })
        },
        responseCallBack: (res) => {
          uni.hideLoading()
          if (res != null && typeof res != 'undefined') {
            console.log('AddShareAlbum resData', res)
            const { status, msg } = res
            if (status !== 0) {
              uni.showToast({
                title: `读取分享专辑出错,原因[${msg}]`,
                position: 'center',
                icon: 'fail',
                duration: 2000,
              })
            } else {
              uni.setStorageSync('albumInfoId', {
                albumId: CodeResult.Value,
              })
              uni.navigateTo({
                url: '/pages/albums/albumInfo?albumId=' + CodeResult.Value,
              })
            }
          }
        },
      })
      break
  }
}
