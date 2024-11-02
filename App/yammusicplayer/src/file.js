/*
  使用该类应开启以下权限（读取和写入）
  <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
  <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
 */
/**
 * 获取手机内置存储的根路径
 * @return {String}
 */
const root = function () {
  var main = plus.android.runtimeMainActivity() // 获取主Activity
  var externalStoragePath = ''
  var message = ''
  var state = 0
  try {
    externalStoragePath = plus.android.invoke(
      'android.os.Environment',
      'getExternalStorageDirectory'
    )
    externalStoragePath = plus.android.invoke(
      externalStoragePath,
      'getAbsolutePath'
    )
    console.log('externalStoragePath', externalStoragePath)
    var dir = plus.android.newObject('java.io.File', '/storage')
    console.log('dir.listFiles()', plus.android.invoke(dir, 'listFiles'))
  } catch (e) {
    message = e
    state = -1
  }
  //测试代码，正式注释
  //externalStoragePath='/storage/emulated/0/Honor/CloudClone/SDCardClone';
  return { state: state, message, result: externalStoragePath }
}
/**
 * 创建文件夹
 * @return {boolean} flase=失败（已存在、操作失败），true=成功
 */
const mkdirs = function (path = '') {
  plus.android.requestPermissions(
    [
      //必须用户授权，在mainifest中配置无效
      'android.permission.WRITE_EXTERNAL_STORAGE',
      'android.permission.READ_EXTERNAL_STORAGE',
      'android.permission.INTERNET',
      'android.permission.ACCESS_WIFI_STATE',
    ],
    (error) => {
      const File = plus.android.importClass('java.io.File')
      let file = new File(path)
      if (!file.exists()) {
        return file.mkdirs()
      }
      return false
    },
    (success) => {
      uni.showToast({
        title: '无法获取权限，文件下载将出错！',
        icon: 'none',
      })
    }
  )
}

/**
 * 写入文件内容
 * @param {String} path 文件路径
 * @param {String} content 内容
 * @param {boolean} append 内容写入类型，false=不追加（覆盖原有内容），true=追加（从内容尾部写入）
 * @param {String} charset 编码
 * @return {boolean} true=成功，false=失败
 */
const writeTxt = function (
  path = '',
  content = '',
  append = false,
  charset = 'utf-8'
) {
  const File = plus.android.importClass('java.io.File')
  const FileOutputStream = plus.android.importClass('java.io.FileOutputStream')
  const OutputStreamWriter = plus.android.importClass(
    'java.io.OutputStreamWriter'
  )

  let outputStreamWriter
  let file = new File(path)
  try {
    //不存在则创建新的文件
    if (!file.exists()) {
      file.createNewFile()
    }
    outputStreamWriter = new OutputStreamWriter(
      new FileOutputStream(path, append),
      charset
    )
    outputStreamWriter.write(content)
    outputStreamWriter.close()
  } catch (e) {
    if (null != outputStreamWriter) {
      outputStreamWriter.close()
    }
    return false
  }
  return true
}
export default {
  root,
  mkdirs,
  writeTxt,
}
