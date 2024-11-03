using DataAccess.BLL;
using DataAccess.Model;
using Microsoft.AspNetCore.Mvc;
using YamMusicPlayerWebApi.Model;
using System.IO;
using PublicLibrary;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Formats;
using System.ComponentModel.Design;
using System.Web;
using YamMusicPlayerWebApi.Library;

namespace YamMusicPlayerWebApi.Controllers
{
    [Route("api/QRCode")]
    public class QRCodeController : Controller
    {
        /// <summary>
        /// 获取网站路径
        /// </summary>
        private readonly IWebHostEnvironment m_webHostEnvironment;

        /// <summary>
        /// 重载构造函数
        /// </summary>
        /// <param name="webHostEnvironment">网站路径</param>
        public QRCodeController(IWebHostEnvironment webHostEnvironment)
        {
            m_webHostEnvironment = webHostEnvironment;
        }

        /// <summary>
        /// 生成用户二维码
        /// </summary>
        /// <param name="userId">用户编号</param>
        /// <param name="width">宽度</param>
        /// <param name="height">高度</param>
        /// <returns>二维码图片</returns>
        [Route("UserQRCode")]
        [HttpGet]
        [HttpPost]
        public IActionResult GenerateUserQRCode(
            string userId, 
            int width = 300,
            int height = 300)
        {
            #region 声明变量

            //WebApi返回值
            IActionResult result = null;

            //错误消息
            string message = string.Empty;

            //二维码文本内容
            string QRCodeText = string.Empty;

            //用户头像路径
            string UserFaceImagePath = string.Empty;

            //用户信息
            List<userinfo> userinfoList = new List<userinfo>();

            //用户业务类
            userinfo_BLL bll= new userinfo_BLL();

            //二维码的内容
            QRCodeContnent codeContnent = new QRCodeContnent();
            #endregion

            #region 读取用户信息
            if (string.IsNullOrEmpty(userId)) 
            {
                message = "用户编号不能为空";
            }
            else 
            {
                userinfoList = bll.Query($" userid='{userId}' ", out message);
                if(userinfoList==null||userinfoList.Count<=0) 
                {
                    if (!string.IsNullOrEmpty(message))
                        message = $"读取用户数据出错,原因[{message}]";
                    else
                        message = "读取用户数据出错,原因[没有找到用户信息]";
                }
            }
            #endregion

            #region 读取用户头像
            if (userinfoList != null && userinfoList.Count > 0) 
            {
                if (!string.IsNullOrEmpty(userinfoList[0].userface))
                {
                    UserFaceImagePath = userinfoList[0].userface;
                    UserFaceImagePath=m_webHostEnvironment.WebRootPath + UserFaceImagePath;
                    if (!System.IO.File.Exists(UserFaceImagePath))
                        UserFaceImagePath = string.Empty;
                }
            }
            #endregion

            #region 二维码文本赋值
            if (string.IsNullOrEmpty(message))
            {
                codeContnent = new QRCodeContnent()
                {
                    Action = "AddFriend",
                    Value = userinfoList[0].userid.ToString()
                };
                QRCodeText = JSONHelper.ObjectToJSON(codeContnent);
            }
            else 
            {
                QRCodeText = message;
            }
            #endregion

            #region 生成二维码图片
            try
            {
                Response.ContentType = "image/jpeg";
                var bitmap = QRCodeHelper.GenerateQRCode(QRCodeText, UserFaceImagePath, width, height);
                MemoryStream ms = new MemoryStream();
                IImageEncoder imageEncoder = new JpegEncoder();
                bitmap.Save(ms, imageEncoder);
                result = File(ms.ToArray(), "image/jpeg");
            }
            catch (Exception exp)
            {
                Response.ContentType = "text/html";
                result = Content($"[\"errorMsg\":\"{exp.Message}\",\"trace\":\"{exp.StackTrace}\"");
            }
            #endregion

            return result;
        }

        /// <summary>
        /// 生成分享二维码
        /// </summary>
        /// <param name="songId">歌曲编号</param>
        /// <param name="userId">用户编号</param>
        /// <param name="width">宽度</param>
        /// <param name="height">高度</param>
        /// <returns>二维码图片</returns>
        [Route("MusicQRCode")]
        [HttpGet]
        [HttpPost]
        public IActionResult GenerateShareMusicQRCode(
            string songId,
            string userId, 
            int width = 300,
            int height = 300) 
        {
            #region 声明变量

            //WebApi返回值
            IActionResult result = null;

            //错误消息
            string message = string.Empty;

            //验证消息
            string checkMessage = string.Empty;

            //二维码文本内容
            string QRCodeText = string.Empty;

            //用户信息
            List<userinfo> userinfoList = new List<userinfo>();

            //用户业务类
            userinfo_BLL userinfobll = new userinfo_BLL();

            //歌曲信息
            List<songinfo> songinfos = new List<songinfo>();

            //歌曲信息业务类
            songinfo_BLL songInfobll =new songinfo_BLL();

            //二维码的内容
            QRCodeContnent codeContnent = new QRCodeContnent();
            #endregion

            #region 非空验证
            if (string.IsNullOrEmpty(songId))
                checkMessage += "歌曲编号、";
            if (string.IsNullOrEmpty(userId))
                checkMessage += "用户编号、";
            if (!string.IsNullOrEmpty(checkMessage)) 
            {
                message = $"参数非空验证出错,原因[{checkMessage}]不能为空";
            }
            #endregion

            #region 验证用户信息
            if(string.IsNullOrEmpty(message)) 
            {
                userinfoList = userinfobll.Query($" userid='{userId}' ", out message);
                if(userinfoList==null||userinfoList.Count<=0) {
                    if (string.IsNullOrEmpty(message))
                        message = $"没有读取到用户编号为[{userId}]的数据";
                    else
                        message = $"读取用户编号为[{userId}]的数据出错,原因[{message}]";
                }
            }
            #endregion

            #region 验证歌曲信息
            if (string.IsNullOrEmpty(message))
            {
                songinfos = songInfobll.Query($" songId='{songId}' ", out message);
                if (userinfoList == null || userinfoList.Count <= 0)
                {
                    if (string.IsNullOrEmpty(message))
                        message = $"没有读取到歌曲编号为[{songId}]的数据";
                    else
                        message = $"读取歌曲编号为[{songId}]的数据出错,原因[{message}]";
                }
            }
            #endregion


            #region 二维码文本赋值
            if (string.IsNullOrEmpty(message))
            {
                codeContnent = new QRCodeContnent()
                {
                    Action = "ShareMusic",
                    Value = $"{songId}-{userId}"
                };
                QRCodeText = JSONHelper.ObjectToJSON(codeContnent);
            }
            else
            {
                QRCodeText = message;
            }
            #endregion

            #region 生成二维码图片
            try
            {
                Response.ContentType = "image/jpeg";
                var bitmap = QRCodeHelper.GenerateQRCode(QRCodeText, string.Empty, width, height);
                MemoryStream ms = new MemoryStream();
                IImageEncoder imageEncoder = new JpegEncoder();
                bitmap.Save(ms, imageEncoder);
                result = File(ms.ToArray(), "image/jpeg");
            }
            catch (Exception exp)
            {
                Response.ContentType = "text/html";
                result = Content($"[\"errorMsg\":\"{exp.Message}\",\"trace\":\"{exp.StackTrace}\"");
            }
            #endregion

            return result;
        }


        /// <summary>
        /// 生成专辑分享二维码
        /// </summary>
        /// <param name="albumId">专辑编号</param>
        /// <param name="width">宽度</param>
        /// <param name="height">高度</param>
        /// <returns>二维码图片</returns>
        [Route("AlbumQRCode")]
        [HttpGet]
        [HttpPost]
        public IActionResult GenerateShareAlbumQRCode(
            string albumId,
            int width = 300,
            int height = 300) 
        {
            #region 声明变量

            //WebApi返回值
            IActionResult result = null;

            //错误消息
            string message = string.Empty;

            //验证消息
            string checkMessage = string.Empty;

            //二维码文本内容
            string QRCodeText = string.Empty;

            //专辑信息
            List<albuminfo> albuminfos = new List<albuminfo>();

            //专辑信息业务类
            albuminfo_BLL albuminfoBll = new albuminfo_BLL();

            //二维码的内容
            QRCodeContnent codeContnent = new QRCodeContnent();
            #endregion

            #region 非空验证
            if (string.IsNullOrEmpty(albumId))
                checkMessage += "专辑编号、";;
            if (!string.IsNullOrEmpty(checkMessage))
            {
                message = $"参数非空验证出错,原因[{checkMessage}]不能为空";
            }
            #endregion

            #region 验证歌曲信息
            if (string.IsNullOrEmpty(message))
            {
                albuminfos = albuminfoBll.Query($" albumId='{albumId}' ", out message);
                if (albuminfos == null || albuminfos.Count <= 0)
                {
                    if (string.IsNullOrEmpty(message))
                        message = $"没有读取到专辑编号为[{albumId}]的数据";
                    else
                        message = $"读取专辑编号为[{albumId}]的数据出错,原因[{message}]";
                }
            }
            #endregion


            #region 二维码文本赋值
            if (string.IsNullOrEmpty(message))
            {
                codeContnent = new QRCodeContnent()
                {
                    Action = "ShareAlbum",
                    Value = albumId
                };
                QRCodeText = JSONHelper.ObjectToJSON(codeContnent);
            }
            else
            {
                QRCodeText = message;
            }
            #endregion

            #region 生成二维码图片
            try
            {
                Response.ContentType = "image/jpeg";
                var bitmap = QRCodeHelper.GenerateQRCode(QRCodeText, string.Empty, width, height);
                MemoryStream ms = new MemoryStream();
                IImageEncoder imageEncoder = new JpegEncoder();
                bitmap.Save(ms, imageEncoder);
                result = File(ms.ToArray(), "image/jpeg");
            }
            catch (Exception exp)
            {
                Response.ContentType = "text/html";
                result = Content($"[\"errorMsg\":\"{exp.Message}\",\"trace\":\"{exp.StackTrace}\"");
            }
            #endregion

            return result;
        }
    }
}
