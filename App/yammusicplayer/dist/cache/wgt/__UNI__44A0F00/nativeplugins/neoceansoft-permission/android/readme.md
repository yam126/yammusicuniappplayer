## Permission
***
主动获取权限，安卓原生插件



### 引入插件
***
```
const permission=uni.requireNativePlugin('neoceansoft-permission')
```
### 具体使用
```
step1.设置全局监听
permission.setResultListener(function(data) {
				switch (data.code) {
					case 0: //是否具有某项权限
						if (!data.status) {
							if (data.permission == 'android.permission.CAMERA') {
								//获取摄像头权限
								permission.getPermission("android.permission.CAMERA")
							} else if (data.permission ==
								'android.permission.RECORD_AUDIO') {
								//获取录音权限
								permission.getPermission("android.permission.RECORD_AUDIO")
							}
						}

						break
					case 2: //用户永久拒绝权限
					permission.gotoSettingPermissions()
						break
				}
			})
step2.检查是否具有某项权限
getPermissions() {
				// 是否具有摄像头权限
				permission.isHasPermission("android.permission.CAMERA")
				//录音权限
				permission.isHasPermission("android.permission.RECORD_AUDIO")
			}
step3.申请某项权限
permission.getPermission("android.permission.CAMERA")
permission.getPermission("android.permission.RECORD_AUDIO")

```
### 方法说明


|方法名|说明|
|:-:|:-:|
|isHasPermission|检查是否具有某项权限|
|getPermission|主动申请某项权限|
|gotoSettingPermissions|跳转系统设置页，针对用户永久拒绝某项权限情况|
|setResultListener|全局回调监听|

#### isHasPermission
检查是否具有某项权限

|参数名|类型|说明|
|:-:|:-:|:-:|
|permissions|String|具体要申请的权限名|


#### getPermission
主动申请某项权限

|参数名|类型|说明|
|:-:|:-:|:-:|
|permissions|String|具体要申请的权限名|

### gotoSettingPermissions
跳转系统权限设置页


#### data 返回值说明
|参数名|说明|其他|
|:-:|:-:|:-:|
|code|状态码|0检查是否具有某项权限回调；1用户通过权限；2用户永久拒绝权限；-1用户拒绝权限|
|permission|此次操作权限名|--|
|status|权限状态|true具有某项权限，false不具有某项权限|
|desc|描述|--|

### 常用权限说明

|权限名|说明|
|:-|:-|
|android.permission.READ_CALENDAR|读取日程提醒|
|android.permission.WRITE_CALENDAR|写入日程提醒|
|android.permission.CAMERA|摄像头|
|android.permission.READ_CONTACTS|读取联系人|
|android.permission.WRITE_CONTACTS|写入联系人|
|android.permission.ACCESS_FINE_LOCATION|获取精确位置|
|android.permission.ACCESS_COARSE_LOCATION|获取粗略位置|
|android.permission.RECORD_AUDIO|录音权限|
|android.permission.READ_CALL_LOG|读取通话记录|
|android.permission.WRITE_CALL_LOG|写入通话记录|
|android.permission.BODY_SENSORS|传感器|
|android.permission.SEND_SMS|发送短信|
|android.permission.READ_SMS|读取短信|
|android.permission.RECEIVE_SMS|接收短信|
|android.permission.READ_EXTERNAL_STORAGE|读取外部存储|
|android.permission.WRITE_EXTERNAL_STORAGE|写入外部存储|


### 联系方式

<image width="200" height="200" src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-76bc01f3-459d-45af-a737-3774c14b75ba/6a8f9c93-9869-4dd7-a6b7-ee9a2c00fb00.jpg"/>
