//import axios from 'axios';
//import request from './request';
import axiosApi from 'axios'
//import axios from './js_sdk/zxiaofoo-uniapp-axios-adapter'
import axiosAdapterUniapp from 'axios-adapter-uniapp'
//debug的api地址
//export const host = 'http://192.168.3.82:5242/'
//export const host = 'https://192.168.3.82:7056/'

//部署api地址
export const host = 'http://yam.natapp1.cc/'

// 创建一个头部对象
const headers = {
  'Content-Type': 'application/json',
}

// 创建axios实例
const axios = axiosApi.create({
  // 设置基础URL
  //baseURL: host,
  headers: headers,
  // 设置超时时间
  timeout: 5000,
  // 允许跨域请求
  withCredentials: true, // 如果服务器需要cookie等认证信息，设置为true
  crossDomain: true,
  adapter: axiosAdapterUniapp,
})

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

/**
 * 将对象转换为GET查询参数
 * @param {要转换的对象} parmObj
 * @returns GET参数字符串
 */
const getQueryParm = (parmObj) => {
  let result = ''
  if (parmObj === null || typeof parmObj === 'undefined') {
    return result
  }
  for (var p in parmObj) {
    if (typeof parmObj[p] !== 'function') {
      if (
        parmObj[p] !== '' &&
        parmObj[p] != null &&
        typeof parmObj[p] !== 'undefined'
      ) {
        result += `${p}=${parmObj[p]}&`
      }
    }
  }
  if (result !== '') {
    result = result.substring(0, result.length - 1)
  }
  return result
}

/**
 * 获得返回参数
 * @param {原始参数} parmObj
 */
const getParam = (parmObj) => {
  if (parmObj === null || typeof parmObj === 'undefined') {
    return ''
  } else {
    return parmObj
  }
}

/**
 * 新方法能获取上传进度
 * @param {方法参数} param0
 * @returns
 */
export const UploadAxiosSongFile = async ({
  parm,
  filePath,
  progressCallBack,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  const formData = new FormData()
  if (filePath === '' || typeof filePath === 'undefined') {
    return false
  }
  let file = {
    uri: 'file://' + filePath,
    type: 'multipart/form-data',
    name: filePath || 'file',
  }
  formData.append('file', file)
  let response = null
  let url = `${host}api/SongInfo/Upload/Song`
  let querystr = ''
  console.log(' UploadAxiosSongFile filePath ', filePath)
  console.log(' UploadAxiosSongFile formData ', formData)
  querystr = getQueryParm(parm)
  if (querystr !== '') {
    url = url + '?' + querystr
  }
  console.log('UploadAxiosSongFile url', url)
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack()
  }
  try {
    response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: function (progressEvent) {
        let percentProgress = (progressEvent.loaded * 100) / progressEvent.total
        console.log(`Upload Progress: ${Math.round(percentProgress)}%`)
        // 可以在这里更新用户界面以显示上传进度
        if (
          progressCallBack !== null &&
          typeof progressCallBack !== 'undefined'
        ) {
          progressCallBack(percentProgress.toFixed(2))
        }
      },
    })
    console.log('UploadAxiosSongFile response', response)
    if (responseCallBack !== null && typeof responseCallBack !== 'undefined') {
      responseCallBack(response)
    }
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error)
    }
  }
}

export const ChangeUserFaceBase = async ({
  base64Image,
  UserId,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  const formData = new FormData()
  let response = null
  let url = `${host}api/User/Change/UserFace/Base64?UserId=${UserId}`
  console.log('api ChangeUserFaceBase url', url)
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack()
  }
  try {
    if (base64Image !== null && typeof base64Image !== 'undefined')
      formData.append('base64Image', base64Image)
    console.log('ChangeUserFaceBase base64Image', base64Image)
    //response = await axios.post(url, formData)
    uni.uploadFile({
      url: url,
      filePath: '123', // 随便填，不为空即可
      name: '123', // 随便填，不为空即可
      // header: header, // 可以加access_token等
      formData: formData, // 接口参数，json格式，底层自动转为FormData的格式数据
      complete: (response) => {
        if (
          responseCallBack !== null &&
          typeof responseCallBack !== 'undefined'
        ) {
          responseCallBack(response.data)
        }
      },
    })
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error)
    }
  }
}

//编辑专辑数据
export const editAlbumApiSource = async ({
  parm,
  filePath,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  const formData = new FormData()
  console.log('editAlbumApi filePath', filePath)
  if (filePath !== '' && typeof filePath !== 'undefined') {
    if (filePath.toLowerCase().indexOf('http') === -1) {
      let file = {
        uri: filePath,
        type: 'multipart/form-data',
        name: filePath || 'file',
      }
      formData.append('file', file)
    } else if (filePath.toLowerCase().indexOf('http') !== -1) {
      formData.append('albumCover', filePath)
    }
  }
  if (parm !== null && typeof parm !== 'undefined') {
    console.log('editAlbumApi parm', parm)
    formData.append('action', getParam(parm.action))
    formData.append('albumId', getParam(parm.albumId))
    formData.append('albumName', getParam(parm.albumName))
    formData.append('albumAuthor', getParam(parm.albumAuthor))
    formData.append('albumIntro', getParam(parm.albumIntro))
    formData.append('userId', getParam(parm.userId))
  }
  let response = null
  let url = `${host}api/Album/EditAsync`
  let querystr = ''
  console.log(' ediitAlbumApi filePath ', filePath)
  console.log(' ediitAlbumApi formData ', formData)
  //querystr = getQueryParm(parm)
  //if (querystr !== '') {
  //url = url + '?' + querystr
  //}
  console.log('ediitAlbumApi filePath', filePath)
  console.log('ediitAlbumApi url', url)
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack()
  }
  try {
    console.log('ediitAlbumApi url 111', url)
    response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    console.log('fetch response', response)
    if (responseCallBack !== null && typeof responseCallBack !== 'undefined') {
      responseCallBack(response.json())
    }
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error)
    }
  }
}

export const editAlbumApiUniApp = ({
  parm,
  filePath,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let response = null
  let url = `${host}api/Album/EditAsync`
  console.log('editAlbumApiUniApp url', url)
  if (parm !== null && typeof parm !== 'undefined') {
    if (filePath !== '' && typeof filePath !== 'undefined') {
      console.log('editAlbumApiUniApp filePath', filePath)
      if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
        beforeCallBack()
      }
      uni.uploadFile({
        url,
        name: 'file',
        filePath: filePath,
        formData: {
          action: parm.action,
          albumId: parm.albumId,
          albumName: parm.albumName,
          albumAuthor: parm.albumAuthor,
          albumIntro: parm.albumIntro,
          userId: parm.userId,
        },
        success: (uploadFileRes) => {
          console.log(uploadFileRes.data)
          response = uploadFileRes.data
          if (
            responseCallBack !== null &&
            typeof responseCallBack !== 'undefined'
          ) {
            responseCallBack(response)
          }
        },
        fail: (uploadFailRes) => {
          if (errorCallback !== null && typeof errorCallback !== 'undefined') {
            errorCallback(uploadFailRes)
          }
        },
      })
    } else {
      editAlbumApiSource({
        parm,
        filePath,
        beforeCallBack,
        responseCallBack,
        errorCallback,
      })
    }
  }
}

//上传用户头像
export const UploadUserFace = async ({
  parm,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  const formData = new FormData()
  const { UserId, filePath } = parm
  if (filePath !== '' && typeof filePath !== 'undefined') {
    let file = {
      uri: filePath,
      type: 'multipart/form-data',
      name: filePath || 'file',
    }
    formData.append('file', file)
  }
  formData.append('UserId', UserId)
  let response = null
  let url = `${host}api/User/Upload/UserFace`
  console.log('UploadUserFace filePath', filePath)
  console.log('UploadUserFace url', url)
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack()
  }
  try {
    console.log('UploadUserFace url 111', url)
    response = await fetch(url, {
      method: 'POST',
      body: formData,
    })
    console.log('fetch response', response)
    if (responseCallBack !== null && typeof responseCallBack !== 'undefined') {
      responseCallBack(response.json())
    }
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error)
    }
  }
}

export const UploadUserFaceUniapp = async ({
  parm,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let response = null
  let url = `${host}api/User/Upload/UserFace`
  const { UserId, filePath } = parm
  url += `?UserId=${UserId}`
  console.log('UploadUserFaceUniapp filePath', filePath)
  console.log('UploadUserFaceUniapp url', url)
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack()
  }
  try {
    uni.uploadFile({
      url,
      filePath,
      name: 'file',
      formData: {
        UserId: UserId,
      },
      success: (uploadFileRes) => {
        console.log(uploadFileRes.data)
        response = uploadFileRes.data
        if (
          responseCallBack !== null &&
          typeof responseCallBack !== 'undefined'
        ) {
          responseCallBack(response)
        }
      },
      fail: (error) => {
        console.error(error.errMsg)
        if (errorCallback !== null && typeof errorCallback !== 'undefined') {
          if (error !== null && typeof errMsg !== 'undefined')
            errorCallback(error.errMsg)
        }
      },
    })
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error)
    }
  }
}

/**
 * 旧上传文件方法无法获取进度
 * @param {参数集合} param0
 * @returns
 */
export const UploadSongFile = async ({
  parm,
  filePath,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  const formData = new FormData()
  if (filePath === '' || typeof filePath === 'undefined') {
    return false
  }
  let file = {
    uri: 'file://' + filePath,
    type: 'multipart/form-data',
    name: filePath || 'file',
  }
  formData.append('file', file)
  let response = null
  let url = `${host}api/SongInfo/Upload/Song`
  let querystr = ''
  console.log(' UploadSongFile filePath ', filePath)
  console.log(' UploadSongFile formData ', formData)
  querystr = getQueryParm(parm)
  if (querystr !== '') {
    url = url + '?' + querystr
  }
  console.log('UploadSongFile url', url)
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack()
  }
  try {
    console.log('UploadSongFile url 111', url)
    response = await fetch(url, {
      method: 'POST',
      body: formData,
      onprogress: (event) => {
        console.log('onprogress event', event)
        if (event.lengthComputable) {
          const progressPercentage = Math.round(
            (event.loaded / event.total) * 100
          )
          console.log(`上传进度: ${progressPercentage}%`)
        }
      },
    })
    console.log('fetch response', response)
    if (responseCallBack !== null && typeof responseCallBack !== 'undefined') {
      responseCallBack(response.json())
    }
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error)
    }
  }
}

export const UploadSongFileUniap = ({
  parm,
  filePath,
  beforeCallBack,
  responseCallBack,
  errorCallback,
  progressUpdate,
}) => {
  if (filePath === '' || typeof filePath === 'undefined') {
    return false
  }
  let response = null
  let url = `${host}api/SongInfo/Upload/Song`
  let querystr = ''
  console.log(' UploadSongFile filePath ', filePath)
  querystr = getQueryParm(parm)
  if (querystr !== '') {
    url = url + '?' + querystr
  }
  console.log('UploadSongFile url', url)
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack()
  }
  try {
    const uploadTask = uni.uploadFile({
      url,
      filePath,
      name: 'file',
      success: (uploadFileRes) => {
        console.log(uploadFileRes.data)
        response = uploadFileRes.data
        if (
          responseCallBack !== null &&
          typeof responseCallBack !== 'undefined'
        ) {
          responseCallBack(response)
        }
      },
      fail: (error) => {
        console.error(error.errMsg)
        if (errorCallback !== null && typeof errorCallback !== 'undefined') {
          if (error !== null && typeof errMsg !== 'undefined')
            errorCallback(error.errMsg)
        }
      },
    })
    uploadTask.onProgressUpdate((progressEvent) => {
      console.log(
        'UploadSongFileUniap onProgressUpdate progressEvent',
        progressEvent
      )
      if (progressUpdate !== null && typeof progressUpdate !== 'undefined') {
        progressUpdate(progressEvent.progress)
      }
    })
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error)
    }
  }
}

//查询专辑歌曲信息
export const queryAlbumSongData = async ({
  parm,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let url = `${host}api/SongInfo/Album/SongInfos`
  let querystr = ''
  querystr = getQueryParm(parm)
  if (querystr !== '') {
    url = url + '?' + querystr
  }
  console.log('queryAlbumSongData url', url)
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack()
  }
  try {
    console.log('queryAlbumSongData url 111', url)
    //let response = await axios.get(url)
    uni.request({
      url: url,
      method: 'GET',
      success: (response) => {
        // 请求成功的回调函数
        console.log(response.data)
        if (
          responseCallBack !== null &&
          typeof responseCallBack !== 'undefined'
        ) {
          console.log('queryAlbumSongData response', response)
          responseCallBack(response.data)
        }
      },
      fail: (error) => {
        // 请求失败的回调函数
        console.error(error)
        if (errorCallback !== null && typeof errorCallback !== 'undefined') {
          errorCallback(error)
        }
      },
    })
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error)
    }
  }
}

//专辑分页
export const queryAlbumPage = async ({
  parm,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let url = `${host}api/Album/Page`
  let querystr = ''
  querystr = getQueryParm(parm)
  if (querystr !== '') {
    url = url + '?' + querystr
  }
  console.log('queryAlbumPage url', url)
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack()
  }
  try {
    console.log('queryAlbumPage url 111', url)
    //let response = await axios.get(url)
    uni.request({
      url: url,
      method: 'GET',
      success: (response) => {
        // 请求成功的回调函数
        console.log(response.data)
        if (
          responseCallBack !== null &&
          typeof responseCallBack !== 'undefined'
        ) {
          console.log('queryAlbumPage response', response)
          responseCallBack(response.data)
        }
      },
      fail: (error) => {
        // 请求失败的回调函数
        console.error(error)
        if (errorCallback !== null && typeof errorCallback !== 'undefined') {
          errorCallback(error)
        }
      },
    })
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error)
    }
  }
}

//歌曲信息分页
export const querySongInfoPage = async ({
  parm,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let url = `${host}api/SongInfo/Page`
  //let url = `/api/SongInfo/Page`
  let querystr = ''
  querystr = getQueryParm(parm)
  if (querystr !== '') {
    url = url + '?' + querystr
  }
  console.log('querySongInfoPage url', url)
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack()
  }
  try {
    console.log('querySongInfoPage url 111', url)
    //let response = await axios.get(url)
    uni.request({
      url: url,
      method: 'GET',
      success: (response) => {
        // 请求成功的回调函数
        console.log(response.data)
        if (
          responseCallBack !== null &&
          typeof responseCallBack !== 'undefined'
        ) {
          console.log('querySongInfoPage response', response)
          responseCallBack(response.data)
        }
      },
      fail: (error) => {
        // 请求失败的回调函数
        console.error(error)
        if (errorCallback !== null && typeof errorCallback !== 'undefined') {
          errorCallback(error)
        }
      },
    })
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error)
    }
  }
}

//常听专辑
export const recentlylistenedAlbum = async ({
  parm,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let response = null
  let url = `${host}api/Home/recentlylistenedAlbum`
  let querystr = ''
  console.log('recentlylistenedAlbum url', url)
  if (parm !== null && typeof parm !== 'undefined') {
    const { userId, limit } = parm
    if (userId !== '' && userId != null && typeof userId !== 'undefined') {
      querystr += `userId=${userId}&`
    }
    if (limit !== null && typeof limit !== 'undefined') {
      querystr += `limit=${limit}&`
    }
  }
  if (querystr !== '') {
    querystr = querystr.substring(0, querystr.length - 1)
    url = `${url}?${querystr}`
  }
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack()
  }
  try {
    console.log('recentlylistenedAlbum url 111', url)
    //let response = await axios.get(url)
    uni.request({
      url: url,
      method: 'GET',
      success: (response) => {
        // 请求成功的回调函数
        console.log(response.data)
        if (
          responseCallBack !== null &&
          typeof responseCallBack !== 'undefined'
        ) {
          console.log('recentlylistenedAlbum response', response)
          responseCallBack(response.data)
        }
      },
      fail: (error) => {
        // 请求失败的回调函数
        console.error(error)
        if (errorCallback !== null && typeof errorCallback !== 'undefined') {
          errorCallback(error)
        }
      },
    })
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error)
    }
  }
}

//常听歌曲
export const recentlylistened = async ({
  parm,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let response = null
  let url = `${host}api/Home/recentlylistened`
  let querystr = ''
  console.log('recentlylistened url', url)
  if (parm !== null && typeof parm !== 'undefined') {
    const { userId, limit } = parm
    if (userId !== '' && userId != null && typeof userId !== 'undefined') {
      querystr += `userId=${userId}&`
    }
    if (limit !== null && typeof limit !== 'undefined') {
      querystr += `limit=${limit}&`
    }
  }
  if (querystr !== '') {
    querystr = querystr.substring(0, querystr.length - 1)
    url = `${url}?${querystr}`
  }
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack()
  }
  try {
    console.log('recentlylistened url 111', url)
    //let response = await axios.get(url)
    uni.request({
      url: url,
      method: 'GET',
      success: (response) => {
        // 请求成功的回调函数
        console.log(response.data)
        if (
          responseCallBack !== null &&
          typeof responseCallBack !== 'undefined'
        ) {
          console.log('recentlylistened response', response)
          responseCallBack(response.data)
        }
      },
      fail: (error) => {
        // 请求失败的回调函数
        console.error(error)
        if (errorCallback !== null && typeof errorCallback !== 'undefined') {
          errorCallback(error)
        }
      },
    })
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error)
    }
  }
}

//焦点图
export const focusImage = async ({
  parm,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let response = null
  let url = `${host}api/Home/focusImage`
  let querystr = ''
  console.log('focusImage url', url)
  if (parm !== null && typeof parm !== 'undefined') {
    const { userId, limit } = parm
    if (userId !== '' && userId != null && typeof userId !== 'undefined') {
      querystr += `userId=${userId}&`
    }
    if (limit !== null && typeof limit !== 'undefined') {
      querystr += `limit=${limit}&`
    }
  }
  if (querystr !== '') {
    querystr = querystr.substring(0, querystr.length - 1)
    url = `${url}?${querystr}`
  }
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack()
  }
  try {
    console.log('focusImage url 111', url)
    //let response = await axios.get(url)
    uni.request({
      url: url,
      method: 'GET',
      success: (response) => {
        // 请求成功的回调函数
        console.log(response.data)
        if (
          responseCallBack !== null &&
          typeof responseCallBack !== 'undefined'
        ) {
          console.log('focusImage response', response)
          responseCallBack(response.data)
        }
      },
      fail: (error) => {
        // 请求失败的回调函数
        console.error(error)
        if (errorCallback !== null && typeof errorCallback !== 'undefined') {
          errorCallback(error)
        }
      },
    })
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error)
    }
  }
}

//登录
export const Login = async ({
  parm,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let response = null
  let url = `${host}api/NoAuth/Login`
  const { username, password, deviceId, deviceType } = parm
  url = `${url}?username=${username}&password=${password}&deviceId=${deviceId}&deviceType=${deviceType}`
  console.log('Login url', url)
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack()
  }
  try {
    console.log('Login url 111', url)
    //let response = await axios.get(url)
    uni.request({
      url: url,
      method: 'POST',
      success: (response) => {
        // 请求成功的回调函数
        console.log(response.data)
        if (
          responseCallBack !== null &&
          typeof responseCallBack !== 'undefined'
        ) {
          console.log('Login response', response)
          responseCallBack(response.data)
        }
      },
      fail: (error) => {
        // 请求失败的回调函数
        console.error(error)
        if (errorCallback !== null && typeof errorCallback !== 'undefined') {
          errorCallback(error)
        }
      },
    })
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error)
    }
  }
}

//注册方法
export const Register = async ({
  dataObj,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let response = null
  let url = `${host}api/NoAuth/Register`
  console.log('url', url)
  console.log('userInfo', dataObj)
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack()
  }
  /*try {
    response = await axios.put(url, dataObj)
    if (responseCallBack !== null && typeof responseCallBack !== 'undefined') {
      responseCallBack(response)
    }
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error)
    }
  }*/
  try {
    console.log('Register url 111', url)
    //let response = await axios.get(url)
    uni.request({
      url: url,
      method: 'PUT',
      data: dataObj,
      success: (response) => {
        // 请求成功的回调函数
        console.log(response.data)
        if (
          responseCallBack !== null &&
          typeof responseCallBack !== 'undefined'
        ) {
          console.log('Register response', response)
          responseCallBack(response.data)
        }
      },
      fail: (error) => {
        // 请求失败的回调函数
        console.error(error)
        if (errorCallback !== null && typeof errorCallback !== 'undefined') {
          errorCallback(error)
        }
      },
    })
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error)
    }
  }
}

/**
 * 歌曲更改专辑
 * @param {
 *  parm,参数
    songIdAry,歌曲编号
    beforeCallBack,请求前事件
    responseCallBack,返回值
    errorCallback,错误消息
  } param0
 */
export const SongChangeAlbum = async ({
  parm,
  songIdAry,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let response = null
  let url = `${host}api/SongInfo/Change/Album`
  let querystr = ''
  querystr = getQueryParm(parm)
  if (querystr !== '') {
    url = url + '?' + querystr
  }
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack()
  }
  try {
    response = (
      await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(songIdAry),
      })
    ).json()
    if (responseCallBack !== null && typeof responseCallBack !== 'undefined') {
      responseCallBack(response)
    }
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error)
    }
  }
}

//检查登录状态
export const CheckLogin = async ({
  userInfo,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let response = null
  let url = `${host}api/NoAuth/CheckLogin`
  console.log('url', url)
  console.log('api CheckLogin userInfo', userInfo)
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack()
  }
  /*try {
    console.log('Login url 111', url)
    response = await axios.post(url, {
      userId: userInfo.userId,
      userName: userInfo.userName,
      token: userInfo.token,
    })
    if (responseCallBack !== null && typeof responseCallBack !== 'undefined') {
      responseCallBack(response)
    }
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error)
    }
  }*/
  try {
    console.log('CheckLogin url 111', url)
    //let response = await axios.get(url)
    uni.request({
      url: url,
      method: 'POST',
      data: {
        userId: userInfo.userId,
        userName: userInfo.userName,
        token: userInfo.token,
      },
      success: (response) => {
        // 请求成功的回调函数
        console.log(response.data)
        if (
          responseCallBack !== null &&
          typeof responseCallBack !== 'undefined'
        ) {
          console.log('CheckLogin response', response)
          responseCallBack(response.data)
        }
      },
      fail: (error) => {
        // 请求失败的回调函数
        console.error(error)
        if (errorCallback !== null && typeof errorCallback !== 'undefined') {
          errorCallback(error)
        }
      },
    })
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error)
    }
  }
}

//删除歌曲
export const DeteleSong = async ({
  parm,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let response = null
  let url = `${host}api/SongInfo/Delete`
  let querystr = ''
  querystr = getQueryParm(parm)
  if (querystr !== '') {
    url = url + '?' + querystr
  }
  console.log(' DeteleSong url ', url)
  console.log(' api DeteleSong parm ', parm)
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack()
  }
  try {
    response = (
      await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    ).json()
    if (responseCallBack !== null && typeof responseCallBack !== 'undefined') {
      responseCallBack(response)
    }
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error)
    }
  }
}

//清空专辑内的歌曲
export const AlbumClearSong = async ({
  parm,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let response = null
  let url = `${host}api/Album/Clear/Song`
  let querystr = ''
  querystr = getQueryParm(parm)
  if (querystr !== '') {
    url = url + '?' + querystr
  }
  console.log(' AlbumClearSong url ', url)
  console.log(' api AlbumClearSong parm ', parm)
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack()
  }
  try {
    response = (
      await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    ).json()
    if (responseCallBack !== null && typeof responseCallBack !== 'undefined') {
      responseCallBack(response)
    }
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error)
    }
  }
}

//删除专辑
export const AlbumDelete = async ({
  parm,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let response = null
  let url = `${host}api/Album/Delete`
  let querystr = ''
  querystr = getQueryParm(parm)
  if (querystr !== '') {
    url = url + '?' + querystr
  }
  console.log(' AlbumDelete url ', url)
  console.log(' api AlbumDelete parm ', parm)
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack()
  }
  try {
    response = (
      await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    ).json()
    if (responseCallBack !== null && typeof responseCallBack !== 'undefined') {
      responseCallBack(response)
    }
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error)
    }
  }
}

export const AlbumDeleteUniapp = async ({
  parm,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let url = `${host}api/Album/Delete`
  let querystr = ''
  querystr = getQueryParm(parm)
  if (querystr !== '') {
    url = url + '?' + querystr
  }
  console.log(' AlbumDelete url ', url)
  console.log(' api AlbumDelete parm ', parm)
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack()
  }
  try {
    uni.request({
      url: url,
      data: {
        albumId: parm.albumId,
      },
      method: 'DELETE',
      success: ({ data, statusCode, header }) => {
        console.log('AlbumDeleteUniapp data', data)
        console.log('AlbumDeleteUniapp statusCode', statusCode)
        console.log('AlbumDeleteUniapp header', header)
        if (statusCode == 200) responseCallBack(data)
      },
      fail: (error) => {
        if (errorCallback !== null && typeof errorCallback !== 'undefined') {
          errorCallback(error)
        }
      },
    })
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error)
    }
  }
}

//获得播放页数据
export const GetPlayerData = async ({
  parm,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let response = null
  let url = `${host}api/PlayPage/Data`
  let querystr = ''
  querystr = getQueryParm(parm)
  if (querystr !== '') {
    url = url + '?' + querystr
  }
  console.log(' GetPlayerData url ', url)
  console.log(' api GetPlayerData parm ', parm)
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack()
  }
  try {
    console.log('GetPlayerData url 111', url)
    //let response = await axios.get(url)
    uni.request({
      url: url,
      method: 'GET',
      success: (response) => {
        // 请求成功的回调函数
        console.log(response.data)
        if (
          responseCallBack !== null &&
          typeof responseCallBack !== 'undefined'
        ) {
          console.log('GetPlayerData response', response)
          responseCallBack(response.data)
        }
      },
      fail: (error) => {
        // 请求失败的回调函数
        console.error(error)
        if (errorCallback !== null && typeof errorCallback !== 'undefined') {
          errorCallback(error)
        }
      },
    })
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error)
    }
  }
}

/**
 * 歌曲评论分页方法
 * @param {分页参数} param0
 */
export const GetSongCommentPageApi = async ({
  parm,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let url = `${host}api/SongComment/Page`
  let querystr = ''
  querystr = getQueryParm(parm)
  if (querystr !== '') {
    url = url + '?' + querystr
  }
  console.log(' GetSongCommentPageApi url ', url)
  console.log(' api GetSongCommentPageApi parm ', parm)
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack()
  }
  try {
    console.log('GetSongCommentPageApi url 111', url)
    //let response = await axios.get(url)
    uni.request({
      url: url,
      method: 'GET',
      success: (response) => {
        // 请求成功的回调函数
        console.log(response.data)
        if (
          responseCallBack !== null &&
          typeof responseCallBack !== 'undefined'
        ) {
          console.log('GetSongCommentPageApi response', response)
          responseCallBack(response.data)
        }
      },
      fail: (error) => {
        // 请求失败的回调函数
        console.error(error)
        if (errorCallback !== null && typeof errorCallback !== 'undefined') {
          errorCallback(error)
        }
      },
    })
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error)
    }
  }
}

/**
 * 发布歌曲评论
 * @param {发表参数} param0
 */
export const PublisherSongComment = async ({
  parm,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let response = null
  let url = `${host}api/SongComment/Add`
  console.log(' PublisherSongComment url ', url)
  console.log(' api PublisherSongComment parm ', parm)
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack()
  }
  /*try {
    response = (
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parm),
      })
    ).json()
    if (responseCallBack !== null && typeof responseCallBack !== 'undefined') {
      responseCallBack(response)
    }
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error)
    }
  }*/
  try {
    uni.request({
      url: url,
      method: 'POST',
      data: parm,
      success: (response) => {
        // 请求成功的回调函数
        console.log(response.data)
        if (
          responseCallBack !== null &&
          typeof responseCallBack !== 'undefined'
        ) {
          console.log('GetRecentlyListenedPage response', response)
          responseCallBack(response.data)
        }
      },
      fail: (error) => {
        // 请求失败的回调函数
        console.error(error)
        if (errorCallback !== null && typeof errorCallback !== 'undefined') {
          errorCallback(error)
        }
      },
    })
  } catch (error) {}
}

/**
 * 最近收听分页
 * @param {分页参数} param0
 */
export const GetRecentlyListenedPage = async ({
  parm,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let url = `${host}api/Recently/Listened/Page`
  let querystr = ''
  querystr = getQueryParm(parm)
  if (querystr !== '') {
    url = url + '?' + querystr
  }
  console.log(' GetRecentlyListenedPage url ', url)
  console.log(' api GetRecentlyListenedPage parm ', parm)
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack()
  }
  try {
    console.log('GetRecentlyListenedPage url 111', url)
    //let response = await axios.get(url)
    uni.request({
      url: url,
      method: 'GET',
      success: (response) => {
        // 请求成功的回调函数
        console.log(response.data)
        if (
          responseCallBack !== null &&
          typeof responseCallBack !== 'undefined'
        ) {
          console.log('GetRecentlyListenedPage response', response)
          responseCallBack(response.data)
        }
      },
      fail: (error) => {
        // 请求失败的回调函数
        console.error(error)
        if (errorCallback !== null && typeof errorCallback !== 'undefined') {
          errorCallback(error)
        }
      },
    })
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error)
    }
  }
}

/**
 * 获得收听历史分页
 * @param {分页参数} param0
 */
export const GetShareHistoryPage = async ({
  parm,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let response = null
  let url = `${host}api/Share/History/Page`
  let querystr = ''
  querystr = getQueryParm(parm)
  if (querystr !== '') {
    url = url + '?' + querystr
  }
  console.log(' GetShareHistoryPage url ', url)
  console.log(' api GetShareHistoryPage parm ', parm)
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack()
  }
  try {
    console.log('GetShareHistoryPage url 111', url)
    //let response = await axios.get(url)
    uni.request({
      url: url,
      method: 'GET',
      success: (response) => {
        // 请求成功的回调函数
        console.log(response.data)
        if (
          responseCallBack !== null &&
          typeof responseCallBack !== 'undefined'
        ) {
          console.log('GetShareHistoryPage response', response)
          responseCallBack(response.data)
        }
      },
      fail: (error) => {
        // 请求失败的回调函数
        console.error(error)
        if (errorCallback !== null && typeof errorCallback !== 'undefined') {
          errorCallback(error)
        }
      },
    })
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error)
    }
  }
}

/**
 * 好友分页
 * @param {分页参数} param0
 */
export const GetFriendsPage = async ({
  parm,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let url = `${host}api/Friends/Page`
  let querystr = ''
  querystr = getQueryParm(parm)
  if (querystr !== '') {
    url = url + '?' + querystr
  }
  console.log(' GetFriendsPage url ', url)
  console.log(' api GetFriendsPage parm ', parm)
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack()
  }
  try {
    console.log('GetFriendsPage url 111', url)
    //let response = await axios.get(url)
    uni.request({
      url: url,
      method: 'GET',
      success: (response) => {
        // 请求成功的回调函数
        console.log(response.data)
        if (
          responseCallBack !== null &&
          typeof responseCallBack !== 'undefined'
        ) {
          console.log('GetFriendsPage response', response)
          responseCallBack(response.data)
        }
      },
      fail: (error) => {
        // 请求失败的回调函数
        console.error(error)
        if (errorCallback !== null && typeof errorCallback !== 'undefined') {
          errorCallback(error)
        }
      },
    })
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error)
    }
  }
}

/**
 * 获取用户信息
 * @param {专辑编号} param0
 */
export const GetAlbumInfo = async ({
  parm,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let response = null
  let url = `${host}api/Album/GetAlbumInfo`
  let querystr = ''
  querystr = getQueryParm(parm)
  if (querystr !== '') {
    url = url + '?' + querystr
  }
  console.log(' GetAlbumInfo url ', url)
  console.log(' api GetAlbumInfo parm ', parm)
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack()
  }
  try {
    console.log('GetAlbumInfo url 111', url)
    //let response = await axios.get(url)
    uni.request({
      url: url,
      method: 'GET',
      success: (response) => {
        // 请求成功的回调函数
        console.log(response.data)
        if (
          responseCallBack !== null &&
          typeof responseCallBack !== 'undefined'
        ) {
          console.log('GetAlbumInfo response', response)
          responseCallBack(response.data)
        }
      },
      fail: (error) => {
        // 请求失败的回调函数
        console.error(error)
        if (errorCallback !== null && typeof errorCallback !== 'undefined') {
          errorCallback(error)
        }
      },
    })
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error)
    }
  }
}

/**
 * 获取用户信息
 * @param {用户编号} param0
 */
export const GetUserInfoById = async ({
  parm,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let response = null
  let url = `${host}api/User/ById`
  let querystr = ''
  querystr = getQueryParm(parm)
  if (querystr !== '') {
    url = url + '?' + querystr
  }
  console.log(' GetUserInfoById url ', url)
  console.log(' api GetUserInfoById parm ', parm)
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack()
  }
  try {
    console.log('GetUserInfoById url 111', url)
    //let response = await axios.get(url)
    uni.request({
      url: url,
      method: 'GET',
      success: (response) => {
        // 请求成功的回调函数
        console.log(response.data)
        if (
          responseCallBack !== null &&
          typeof responseCallBack !== 'undefined'
        ) {
          console.log('GetUserInfoById response', response)
          responseCallBack(response.data)
        }
      },
      fail: (error) => {
        // 请求失败的回调函数
        console.error(error)
        if (errorCallback !== null && typeof errorCallback !== 'undefined') {
          errorCallback(error)
        }
      },
    })
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error)
    }
  }
}

/**
 * 删除好友参数
 * @param {删除参数} param0
 */
export const DeleteFriend = async ({
  parm,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let response = null
  let url = `${host}api/Friends/Delete`
  let querystr = ''
  querystr = getQueryParm(parm)
  if (querystr !== '') {
    url = url + '?' + querystr
  }
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack()
  }
  /*try {
    response = (
		  await fetch(url, {
		    method: 'DELETE',
		    headers: {
		      'Content-Type': 'application/json',
		    },
		  })
		).json()
    response = await axios.delete(url)
    if (responseCallBack !== null && typeof responseCallBack !== 'undefined') {
      responseCallBack(response)
    }
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error)
    }
  }*/
  try {
    uni.request({
      url: url,
      method: 'DELETE',
      success: ({ data, statusCode, header }) => {
        console.log('AlbumDeleteUniapp data', data)
        console.log('AlbumDeleteUniapp statusCode', statusCode)
        console.log('AlbumDeleteUniapp header', header)
        if (statusCode == 200) {
          if (
            responseCallBack !== null &&
            typeof responseCallBack !== 'undefined'
          ) {
            responseCallBack(data)
          }
        }
      },
      fail: (error) => {
        if (errorCallback !== null && typeof errorCallback !== 'undefined') {
          errorCallback(error)
        }
      },
    })
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error)
    }
  }
}

/**
 * 常听专辑分页
 * @param {分页参数} param0
 */
export const QueryRecentlyListenedAlbumPage = async ({
  parm,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let response = null
  let url = `${host}api/Album/Recently/Listened/Page`
  let querystr = ''
  querystr = getQueryParm(parm)
  if (querystr !== '') {
    url = url + '?' + querystr
  }
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack()
  }
  try {
    console.log('QueryRecentlyListenedAlbumPage url 111', url)
    //let response = await axios.get(url)
    uni.request({
      url: url,
      method: 'GET',
      success: (response) => {
        // 请求成功的回调函数
        console.log(response.data)
        if (
          responseCallBack !== null &&
          typeof responseCallBack !== 'undefined'
        ) {
          console.log('QueryRecentlyListenedAlbumPage response', response)
          responseCallBack(response.data)
        }
      },
      fail: (error) => {
        // 请求失败的回调函数
        console.error(error)
        if (errorCallback !== null && typeof errorCallback !== 'undefined') {
          errorCallback(error)
        }
      },
    })
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error)
    }
  }
}

/**
 * 获取所有头像列表
 * @param {参数集合} param0
 */
export const GetUserFaces = async ({
  parm,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let response = null
  let url = `${host}api/File/UserFace`
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack()
  }
  try {
    console.log('GetUserFaces url 111', url)
    //let response = await axios.get(url)
    uni.request({
      url: url,
      method: 'GET',
      success: (response) => {
        // 请求成功的回调函数
        console.log(response.data)
        if (
          responseCallBack !== null &&
          typeof responseCallBack !== 'undefined'
        ) {
          console.log('GetUserFaces response', response)
          responseCallBack(response.data)
        }
      },
      fail: (error) => {
        // 请求失败的回调函数
        console.error(error)
        if (errorCallback !== null && typeof errorCallback !== 'undefined') {
          errorCallback(error)
        }
      },
    })
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error)
    }
  }
}

/**
 * 切换用户头像
 * @param {切换用户头像} param0
 */
export const ChangeUserFace = async ({
  parm,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let response = null
  let url = `${host}api/User/Change/UserFace`
  console.log('url', url)
  console.log('ChangeUserFace parm', parm)
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack()
  }
  /*try {
    response = await axios.put(url, parm)
    if (responseCallBack !== null && typeof responseCallBack !== 'undefined') {
      responseCallBack(response)
    }
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error)
    }
  }*/
  try {
    console.log('GetUserFaces url 111', url)
    //let response = await axios.get(url)
    uni.request({
      url: url,
      method: 'PUT',
      data: parm,
      success: (response) => {
        // 请求成功的回调函数
        console.log(response.data)
        if (
          responseCallBack !== null &&
          typeof responseCallBack !== 'undefined'
        ) {
          console.log('GetUserFaces response', response)
          responseCallBack(response.data)
        }
      },
      fail: (error) => {
        // 请求失败的回调函数
        console.error(error)
        if (errorCallback !== null && typeof errorCallback !== 'undefined') {
          errorCallback(error)
        }
      },
    })
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error)
    }
  }
}

/**
 * 添加好友
 * @param {参数} param0
 */
export const AddFriend = async ({
  parm,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let response = null
  let url = `${host}api/Friends/Add/Friend`
  console.log('url', url)
  console.log('AddFriend parm', parm)
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack()
  }
  /*try {
    response = (
		  await fetch(url, {
		    method: 'POST',
		    headers: {
		      'Content-Type': 'application/json',
		    },
		    body: JSON.stringify(parm),
		  })
		).json()
    response = await axios.post(url, parm, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (responseCallBack !== null && typeof responseCallBack !== 'undefined') {
      responseCallBack(response)
    }
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error)
    }
  }*/
  try {
    console.log('AddFriend url 111', url)
    //let response = await axios.get(url)
    uni.request({
      url: url,
      method: 'POST',
      data: parm,
      success: (response) => {
        // 请求成功的回调函数
        console.log(response.data)
        if (
          responseCallBack !== null &&
          typeof responseCallBack !== 'undefined'
        ) {
          console.log('AddFriend response', response)
          responseCallBack(response.data)
        }
      },
      fail: (error) => {
        // 请求失败的回调函数
        console.error(error)
        if (errorCallback !== null && typeof errorCallback !== 'undefined') {
          errorCallback(error)
        }
      },
    })
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error)
    }
  }
}

/**
 * 添加专辑分享
 * @param {*} param0
 */
export const AddShareAlbum = async ({
  parm,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let response = null
  let url = `${host}api/Share/History/Add/Album`;
  let querystr = ''
  querystr = getQueryParm(parm)
  if (querystr !== '') {
    url = url + '?' + querystr
  }
  console.log('url', url)
  console.log('AddShareAlbum parm', parm)
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack()
  }
  try {
    /*response = (
		  await fetch(url, {
		    method: 'POST',
		    headers: {
		      'Content-Type': 'application/json',
		    },
		    body: JSON.stringify(parm),
		  })
		).json()*/
    /*response = await axios.post(url, parm, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (responseCallBack !== null && typeof responseCallBack !== 'undefined') {
      responseCallBack(response)
    }*/
    uni.request({
      url: url,
      method: 'GET',
      success: (response) => {
        // 请求成功的回调函数
        console.log(response.data)
        if (
          responseCallBack !== null &&
          typeof responseCallBack !== 'undefined'
        ) {
          console.log('AddShareAlbum response', response)
          responseCallBack(response.data)
        }
      },
      fail: (error) => {
        // 请求失败的回调函数
        console.error(error)
        if (errorCallback !== null && typeof errorCallback !== 'undefined') {
          errorCallback(error)
        }
      },
    })
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error)
    }
  }
}

/**
 * 添加分享历史
 * @param {*} param0
 */
export const AddSharingHistory = async ({
  parm,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let response = null
  let url = `${host}api/Share/History/Add`
  console.log('url', url)
  console.log('AddSharingHistory parm', parm)
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack()
  }
  try {
    /*response = (
		  await fetch(url, {
		    method: 'POST',
		    headers: {
		      'Content-Type': 'application/json',
		    },
		    body: JSON.stringify(parm),
		  })
		).json()*/
    /*response = await axios.post(url, parm, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (responseCallBack !== null && typeof responseCallBack !== 'undefined') {
      responseCallBack(response)
    }*/
    uni.request({
      url: url,
      method: 'POST',
      data: parm,
      success: (response) => {
        // 请求成功的回调函数
        console.log(response.data)
        if (
          responseCallBack !== null &&
          typeof responseCallBack !== 'undefined'
        ) {
          console.log('AddSharingHistory response', response)
          responseCallBack(response.data)
        }
      },
      fail: (error) => {
        // 请求失败的回调函数
        console.error(error)
        if (errorCallback !== null && typeof errorCallback !== 'undefined') {
          errorCallback(error)
        }
      },
    })
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error)
    }
  }
}

/**
 * 增加专辑浏览次数
 * @param {参数} param0
 */
export const AddViewCount = async ({
  parm,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let response = null
  let url = `${host}api/Album/Add/ViewCount`
  let querystr = ''
  console.log('AddViewCount parm', parm)
  querystr = getQueryParm(parm)
  if (querystr !== '') {
    url = url + '?' + querystr
  }
  console.log('AddViewCount url', url)
  console.log('AddViewCount parm', parm)
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack()
  }
  try {
    /*response = (
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    ).json()
    if (responseCallBack !== null && typeof responseCallBack !== 'undefined') {
      responseCallBack(response)
    }*/
    uni.request({
      url: url,
      method: 'POST',
      success: (response) => {
        // 请求成功的回调函数
        console.log(response.data)
        if (
          responseCallBack !== null &&
          typeof responseCallBack !== 'undefined'
        ) {
          console.log('AddFriend response', response)
          responseCallBack(response.data)
        }
      },
      fail: (error) => {
        // 请求失败的回调函数
        console.error(error)
        if (errorCallback !== null && typeof errorCallback !== 'undefined') {
          errorCallback(error)
        }
      },
    })
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error)
    }
  }
}

/**
 * 修改密码
 * @param {参数} param0
 */
export const EditPasswordApi = async ({
  parm,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let response = null
  let url = `${host}api/User/Edit/Password`
  console.log('url', url)
  console.log('EditPassword parm', parm)
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack()
  }
  /*try {
    response = (
		  await fetch(url, {
		    method: 'PUT',
		    headers: {
		      'Content-Type': 'application/json',
		    },
		    body: JSON.stringify(parm),
		  })
		).json()
    response = await axios.put(url, parm)
    if (responseCallBack !== null && typeof responseCallBack !== 'undefined') {
      responseCallBack(response)
    }
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error)
    }
  }*/
  try {
    console.log('EditPasswordApi url 111', url)
    //let response = await axios.get(url)
    uni.request({
      url: url,
      method: 'PUT',
      data: parm,
      success: (response) => {
        // 请求成功的回调函数
        console.log(response.data)
        if (
          responseCallBack !== null &&
          typeof responseCallBack !== 'undefined'
        ) {
          console.log('EditPasswordApi response', response)
          responseCallBack(response.data)
        }
      },
      fail: (error) => {
        // 请求失败的回调函数
        console.error(error)
        if (errorCallback !== null && typeof errorCallback !== 'undefined') {
          errorCallback(error)
        }
      },
    })
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error)
    }
  }
}

/**
 * 编辑签名
 * @param {参数} param0
 */
export const editSignature = async ({
  parm,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let response = null
  let url = `${host}api/User/Edit/Signature`
  console.log('url', url)
  console.log('editSignature parm', parm)
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack()
  }
  /*try {
    response = (
		  await fetch(url, {
		    method: 'PUT',
		    headers: {
		      'Content-Type': 'application/json',
		    },
		    body: JSON.stringify(parm),
		  })
		).json()
    response = await axios.put(url, parm)
    if (responseCallBack !== null && typeof responseCallBack !== 'undefined') {
      responseCallBack(response)
    }
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error)
    }
  }*/
  try {
    console.log('editSignature url 111', url)
    //let response = await axios.get(url)
    uni.request({
      url: url,
      method: 'PUT',
      data: parm,
      success: (response) => {
        // 请求成功的回调函数
        console.log(response.data)
        if (
          responseCallBack !== null &&
          typeof responseCallBack !== 'undefined'
        ) {
          console.log('editSignature response', response)
          responseCallBack(response.data)
        }
      },
      fail: (error) => {
        // 请求失败的回调函数
        console.error(error)
        if (errorCallback !== null && typeof errorCallback !== 'undefined') {
          errorCallback(error)
        }
      },
    })
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error)
    }
  }
}

/**
 * 字符串左补位
 * @param {原始字符串} str
 * @param {补位长度} len
 * @param {补位的字符} charStr
 * @returns
 */
export const PadLeft = (str, len, charStr) => {
  var str = str + ''
  return new Array(len - str.length + 1).join(charStr || '') + str
}

/**
 * 转换后的时长
 * @param {原始时长} duration
 * @returns
 */
export const formatDuration = (duration) => {
  if (duration == null || typeof duration == 'undefined') {
    return {
      hour: '00',
      minute: '00',
      second: '00',
    }
  }
  var hour = parseInt(parseFloat(duration / 3600), 10)
  var minute = parseInt(parseFloat((duration % 3600) / 60), 10)
  var second = parseInt(parseFloat(duration % 60), 10)
  return {
    hour: PadLeft(hour.toString(), 2, '0'),
    minute: PadLeft(minute.toString(), 2, '0'),
    second: PadLeft(second.toString(), 2, '0'),
  }
}
