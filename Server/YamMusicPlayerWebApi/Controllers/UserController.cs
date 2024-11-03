using DataAccess.BLL;
using DataAccess.Model;
using Microsoft.AspNetCore.Mvc;
using PublicLibrary;
using Shell32;
using Snowflake.Net;
using YamMusicPlayerWebApi.Library;
using YamMusicPlayerWebApi.Model;

namespace YamMusicPlayerWebApi.Controllers
{
    [ApiController]
    [Route("api/User")]
    public class UserController : Controller
    {
        /// <summary>
        /// 根据用户编号查询用户信息
        /// </summary>
        /// <param name="UserId">用户编号</param>
        /// <returns></returns>
        [HttpGet]
        [Route("ById")]
        public EntityResult<userInfoResult> GetUserInfoById(string UserId)
        {
            #region 声明变量

            //错误消息
            string message = string.Empty;

            //用户信息
            var users = new List<userinfo>();

            //返回值
            var resultData = new userInfoResult();

            //返回值
            var result = new EntityResult<userInfoResult>();
            #endregion

            #region 非空验证
            if (string.IsNullOrEmpty(UserId))
            {
                result = new EntityResult<userInfoResult>()
                {
                    Status = -1,
                    Msg = "用户编号不能为空"
                };
                return result;
            }
            #endregion

            #region 读取用户数据
            users = new userinfo_BLL().Query($" userid='{UserId}' ", out message);
            if (users == null || users.Count <= 0)
            {
                if (!string.IsNullOrEmpty(message))
                    message = $"读取用户数据出错,原因[{message}]";
                else
                    message = $"读取用户数据出错,原因[用户数据为空]";
                result = new EntityResult<userInfoResult>()
                {
                    Status = -1,
                    Msg = message
                };
                return result;
            }
            #endregion

            resultData = PublicFunction.ConvertApi(users[0],Request);
            result = new EntityResult<userInfoResult>()
            {
                Status = 0,
                Msg = string.Empty,
                Result = resultData
            };
            return result;
        }

        /// <summary>
        /// 更换用户头像
        /// </summary>
        /// <param name="args">更换参数</param>
        /// <returns>是否成功</returns>
        [HttpPut]
        [Route("Change/UserFace")]
        public Result ChangeUserFace(ChangeUserFaceArgument args)
        {
            #region 声明变量

            //数据库状态返回值
            int resultDbState = -1;

            //错误消息
            string message = string.Empty;

            //验证消息
            string checkMessage = string.Empty;

            //Host地址
            string Host = string.Empty;

            //用户信息
            var user = new List<userinfo>();

            //返回值
            var result = new Result();
            #endregion

            #region 非空验证
            if (args == null)
            {
                result = new Result()
                {
                    Status = -1,
                    Msg = "参数不能为空"
                };
                return result;
            }
            if (string.IsNullOrEmpty(args.userId))
                checkMessage += "用户编号、";
            if (string.IsNullOrEmpty(args.userFaceUrl))
                checkMessage += "用户头像地址、";
            if (!string.IsNullOrEmpty(checkMessage))
            {
                checkMessage = checkMessage.Substring(0, checkMessage.Length - 1);
                result = new Result()
                {
                    Status = -1,
                    Msg = $"非空验证出错,原因[{checkMessage}]"
                };
                return result;
            }
            #endregion

            #region 获取用户信息
            user = new userinfo_BLL().Query($" userid='{args.userId}' ", out message);
            if (user == null || user.Count <= 0)
            {
                if (!string.IsNullOrEmpty(message))
                    message = $"读取用户编号为[{args.userId}]出错,原因[{message}]";
                else
                    message = $"读取用户编号为[{args.userId}]出错,原因[没有读取到用户信息]";
                result = new Result()
                {
                    Status = -1,
                    Msg = message
                };
                return result;
            }
            #endregion

            #region 更新头像数据
            Host = PublicFunction.GetRequestHost(Request);
            user[0].userface = args.userFaceUrl.Replace($"{Host}/","");
            user[0].modifieddatetime = DateTime.Now;
            resultDbState = new userinfo_BLL().Update(user[0], $" userid='{args.userId}' ", out message);
            if (resultDbState != 0)
            {
                result = new Result()
                {
                    Status = -1,
                    Msg = $"更新头像出错,原因[{message}]"
                };
                return result;
            }
            #endregion

            result = new Result()
            {
                Status = 0,
                Msg = string.Empty
            };
            return result;
        }

        /// <summary>
        /// 切换头像H5
        /// </summary>
        /// <param name="UserId">用户编号</param>
        /// <param name="base64Image">base64图片字符串</param>
        /// <returns></returns>
        [HttpPost]
        [Route("Change/UserFace/Base64")]
        public EntityResult<string> ChangeUserFaceBase(string UserId, [FromForm] string base64Image) 
        {
            #region 声明变量

            //雪花ID
            var snowId = new IdWorker(1, 1);

            //数据库状态返回值
            int resultDbState = -1;

            //错误消息
            string message = string.Empty;

            //验证消息
            string checkMessage = string.Empty;

            //上传用户头像路径配置
            string UploadUserFacePath = string.Empty;

            //Host地址
            string Host = string.Empty;

            //用户信息
            var user = new List<userinfo>();

            //所有文件类型
            List<contentTypeModel> contentTypeModels = null;

            //限制文件类型
            List<contentTypeModel> limitContentType = null;

            //文件类型
            contentTypeModel FileContentType = null;

            //文件类型限制
            string limitFileType = @"image";

            //文件最大容量限制
            long UploadFileMaxLength = 0;

            //返回值
            var result = new EntityResult<string>();
            #endregion

            #region 非空验证
            if (string.IsNullOrEmpty(UserId))
                checkMessage += "用户编号、";
            if (string.IsNullOrEmpty(base64Image))
                checkMessage += "图片数据、";
            if(!string.IsNullOrEmpty(checkMessage)) 
            {
                checkMessage = checkMessage.Substring(0, checkMessage.Length - 1);
                result = new EntityResult<string>()
                {
                    Status = -1,
                    Msg = $"非空验证出错,原因[{checkMessage}]"
                };
                return result;
            }
            #endregion

            #region 获取用户信息
            user = new userinfo_BLL().Query($" userid='{UserId}' ", out message);
            if (user == null || user.Count <= 0)
            {
                if (!string.IsNullOrEmpty(message))
                    message = $"读取用户编号为[{UserId}]出错,原因[{message}]";
                else
                    message = $"读取用户编号为[{UserId}]出错,原因[没有读取到用户信息]";
                result = new EntityResult<string>()
                {
                    Status = -1,
                    Msg = message
                };
                return result;
            }
            #endregion

            #region 获取文件类型和大小限制
            contentTypeModels = AppSetting.GetContentTypes(out message);
            if (contentTypeModels == null || contentTypeModels.Count <= 0)
            {
                if (!string.IsNullOrEmpty(message))
                {
                    message = $"读取文件类型信息失败，原因[{message}]";
                    result = new EntityResult<string>()
                    {
                        Status = -1,
                        Msg = message,
                        Result = null
                    };
                    return result;
                }
                else
                {
                    message = $"读取文件类型信息失败，原因[没有文件类型配置信息，请检查是否存在allContentType.xml配置文件]";
                    result = new EntityResult<string>()
                    {
                        Status = -1,
                        Msg = message,
                        Result = null
                    };
                    return result;
                }
            }
            if (!contentTypeModels.Any(q => q.contentType.ToLower().Contains(limitFileType.ToLower())))
            {
                message = $"读取限制的文件类型{limitFileType}失败，配置文件[allContentType.xml]没有配置指定的文件类型";
                result = new EntityResult<string>()
                {
                    Status = -1,
                    Msg = message,
                    Result = null
                };
                return result;
            }
            limitContentType = contentTypeModels.Where(q => q.contentType.ToLower().Contains(limitFileType.ToLower())).ToList();
            if (string.IsNullOrEmpty(AppSetting.GetAppSetting("UploadFileMaxLength")))
            {
                message = "读取上传文件最大容量限制出错,原因[没有配置最大容量限制，请检查配置文件]";
                result = new EntityResult<string>()
                {
                    Status = -1,
                    Msg = message,
                    Result = null
                };
                return result;
            }
            UploadFileMaxLength = Utils.StrToLong(AppSetting.GetAppSetting("UploadFileMaxLength"));
            #endregion

            #region 解析并保存base64
            try
            {
                #region 获取Base64字符串中的文件类型
                string fileExtension = "."+base64Image.Split(';')[0].Split('/')[1];
                byte[] imageBytes = Convert.FromBase64String(base64Image.Split(',')[1]);
                #endregion

                #region 验证文件类型和大小
                if (!limitContentType.Any(q => q.contentType.ToUpper() == fileExtension || q.type.ToUpper() == fileExtension.ToUpper()))
                    message += $"文件，不是指定的文件类型";
                else if (UploadFileMaxLength != 0 && imageBytes.Length > UploadFileMaxLength)
                    message += $"文件，大小超过限制,最大{Utils.ByteConversionGBMBKB(UploadFileMaxLength)}";               
                if (!string.IsNullOrEmpty(message))
                {
                    result = new EntityResult<string>()
                    {
                        Status = -1,
                        Msg = $"解析base64字符串出错,原因[${message}]"
                    };
                    return result;
                }
                FileContentType = limitContentType.FirstOrDefault(q => q.contentType.ToUpper() == fileExtension || q.type.ToUpper() == fileExtension.ToUpper());
                #endregion

                #region 读取上传路径配置
                UploadUserFacePath = AppSetting.GetAppSetting("UploadUserFacePath");
                if (string.IsNullOrEmpty(UploadUserFacePath))
                {
                    result = new EntityResult<string>()
                    {
                        Status = -1,
                        Msg = "没有读取到appsettings.json的用户上传路径UploadUserFacePath配置,请检查配置文件"
                    };
                    return result;
                }
                #endregion

                #region 将字节写入文件
                string fileName = $"{snowId.NextId().ToString()}{FileContentType.type}";
                string FileFullPath = $@"{CoreHttpContext.MapPath("")}\{UploadUserFacePath}";
                if (!Directory.Exists(FileFullPath))
                {
                    Directory.CreateDirectory(FileFullPath);
                }
                FileFullPath += $@"\{fileName}";
                using (FileStream fileStream = new FileStream(FileFullPath, FileMode.Create))
                {
                    fileStream.Write(imageBytes);
                }
                #endregion

                #region 更新头像数据
                Host = PublicFunction.GetRequestHost(Request);
                user[0].userface = $"{Host}/{UploadUserFacePath}/{fileName}";
                user[0].modifieddatetime = DateTime.Now;
                resultDbState = new userinfo_BLL().Update(user[0], $" userid='{UserId}' ", out message);
                if (resultDbState != 0)
                {
                    result = new EntityResult<string>()
                    {
                        Status = -1,
                        Msg = $"更新头像出错,原因[{message}]"
                    };
                    return result;
                }
                #endregion
            }
            catch (Exception exp) 
            {
                result = new EntityResult<string>()
                {
                    Status = -1,
                    Msg = $"解析base64字符串出错,原因[${exp.Message}]"
                };
                return result;
            }
            #endregion

            result = new EntityResult<string>()
            {
                Status = 0,
                Msg = string.Empty,
                Result = user[0].userface
            };
            return result;
        }

        /// <summary>
        /// 修改密码 
        /// </summary>
        /// <param name="args">密码修改参数</param>
        /// <returns>是否成功</returns>
        [HttpPut]
        [Route("Edit/Password")]
        public Result EditPassword(EditPasswordArgument args)
        {
            #region 声明变量

            //数据库更新状态
            int resultDbState = -1;

            //验证消息
            string checkMessage = string.Empty;

            //错误消息
            string message = string.Empty;

            //用户信息
            var users = new List<userinfo>();

            //返回值
            var result = new Result();
            #endregion

            #region 非空验证
            if (args == null)
            {
                result = new Result()
                {
                    Status = -1,
                    Msg = "参数不能为空"
                };
                return result;
            }
            if (string.IsNullOrEmpty(args.UserId))
                checkMessage += "用户编号、";
            if (string.IsNullOrEmpty(args.SourcePassword))
                checkMessage += "原密码、";
            if (string.IsNullOrEmpty(args.NewPassword))
                checkMessage += "新密码、";
            if (string.IsNullOrEmpty(args.RepartPassword))
                checkMessage += "重复密码、";
            if (!string.IsNullOrEmpty(checkMessage))
            {
                checkMessage = checkMessage.Substring(0, checkMessage.Length - 1);
                result = new Result()
                {
                    Status = -1,
                    Msg = $"非空验证出错,原因[{checkMessage}]"
                };
                return result;
            }
            #endregion

            #region 有效验证
            if (args.NewPassword != args.RepartPassword)
            {
                result = new Result()
                {
                    Status = -1,
                    Msg = "两次输入的密码不一致"
                };
                return result;
            }
            #endregion

            #region 验证用户信息
            args.SourcePassword = MD5Hash.Hash.GetMD5(args.SourcePassword);
            users = new userinfo_BLL().Query($" userid='{args.UserId}' and password='{args.SourcePassword}' ", out message);
            if (users == null || users.Count <= 0)
            {
                if (!string.IsNullOrEmpty(message))
                    message = $"读取用户信息出错,原因[{message}]";
                else
                    message = $"读取用户信息出错,原因[没有读取到用户信息]";
                result = new Result()
                {
                    Status = -1,
                    Msg = message
                };
                return result;
            }
            #endregion

            #region 修改密码
            users[0].password = MD5Hash.Hash.GetMD5(args.NewPassword);
            users[0].modifieddatetime = DateTime.Now;
            resultDbState = new userinfo_BLL().Update(users, $" userid='{args.UserId}' ", out message);
            if (resultDbState != 0) 
            {
                result = new Result()
                {
                    Status = -1,
                    Msg = $"修改密码出错,原因[{message}]"
                };
                return result;
            }
            #endregion

            result = new Result()
            {
                Status = 0,
                Msg = string.Empty
            };
            return result;
        }

        /// <summary>
        /// 编辑签名
        /// </summary>
        /// <param name="args">参数</param>
        /// <returns>是否成功返回值</returns>
        [HttpPut]
        [Route("Edit/Signature")]
        public Result EditSignature(EditSignatureArgument args) 
        {
            #region 声明变量

            //数据库更新状态
            int resultDbState = -1;

            //验证消息
            string checkMessage = string.Empty;

            //错误消息
            string message = string.Empty;

            //用户信息
            var users = new List<userinfo>();

            //返回值
            var result = new Result();
            #endregion

            #region 非空验证
            if (args == null)
            {
                result = new Result()
                {
                    Status = -1,
                    Msg = "参数不能为空"
                };
                return result;
            }
            if (string.IsNullOrEmpty(args.UserId))
                checkMessage += "用户编号、";
            if (string.IsNullOrEmpty(args.Password))
                checkMessage += "密码、";
            if (string.IsNullOrEmpty(args.Signature))
                checkMessage += "签名、";
            if (!string.IsNullOrEmpty(checkMessage))
            {
                checkMessage = checkMessage.Substring(0, checkMessage.Length - 1);
                result = new Result()
                {
                    Status = -1,
                    Msg = $"非空验证出错,原因[{checkMessage}]"
                };
                return result;
            }
            #endregion

            #region 验证用户信息
            args.Password = MD5Hash.Hash.GetMD5(args.Password);
            users = new userinfo_BLL().Query($" userid='{args.UserId}' and password='{args.Password}' ", out message);
            if (users == null || users.Count <= 0)
            {
                if (!string.IsNullOrEmpty(message))
                    message = $"读取用户信息出错,原因[{message}]";
                else
                    message = $"读取用户信息出错,原因[没有读取到用户信息]";
                result = new Result()
                {
                    Status = -1,
                    Msg = message
                };
                return result;
            }
            #endregion

            #region 修改签名
            users[0].signature = args.Signature;
            users[0].modifieddatetime = DateTime.Now;
            resultDbState = new userinfo_BLL().Update(users, $" userid='{args.UserId}' ", out message);
            if (resultDbState != 0)
            {
                result = new Result()
                {
                    Status = -1,
                    Msg = $"修改签名出错,原因[{message}]"
                };
                return result;
            }
            #endregion

            result = new Result()
            {
                Status = 0,
                Msg = string.Empty
            };
            return result;
        }

        /// <summary>
        /// 上传用户头像
        /// </summary>
        /// <param name="UserId">用户编号</param>
        /// <returns>返回值</returns>
        [HttpPost]
        [Route("Upload/UserFace")]
        public async Task<EntityResult<string>> UploadUserFace()
        {
            #region 声明变量

            //数据库更新状态
            int resultDbState = -1;

            //用户信息
            var user = new List<userinfo>();

            //上传的文件
            var formFile = Request.Form.Files;

            //用户编号
            string UserId = string.Empty;

            //上传文件集合
            var formFiles = new List<IFormFile>();

            //返回值
            string message = string.Empty;

            //验证字符串
            string checkMessage = string.Empty;

            //上传用户头像路径配置
            string UploadUserFacePath = string.Empty;

            //返回Url地址
            string resultUrl = string.Empty;

            //host返回值
            string host = string.Empty;

            //文件保存结果
            var resultSave = new ReturnDataMessage();

            //返回文件列表
            var resultFileList = new List<ResultFile>();

            //返回值
            var result = new EntityResult<string>();
            #endregion

            UserId = Request.Form["UserId"];

            #region 参数非空验证
            if (string.IsNullOrEmpty(UserId))
                checkMessage += "用户编号、";
            if (formFile == null || formFile.Count <= 0)
                checkMessage += "上传的用户头像、";
            if (!string.IsNullOrEmpty(checkMessage))
            {
                checkMessage = checkMessage.Substring(0, checkMessage.Length - 1);
                result = new EntityResult<string>()
                {
                    Status = -1,
                    Msg = $"非空验证出错,原因[{checkMessage}]"
                };
                return result;
            }
            #endregion

            #region 验证用户
            user = new userinfo_BLL().Query($" userid='{UserId}' ", out message);
            if (user == null || user.Count <= 0)
            {
                if (!string.IsNullOrEmpty(message))
                    message += $"读取用户编号为[{UserId}]的数据出错,原因[{message}]";
                else
                    message += $"读取用户编号为[{UserId}]的数据出错,原因[没有读取到用户信息]";
                result = new EntityResult<string>()
                {
                    Status = -1,
                    Msg = message
                };
                return result;
            }
            #endregion

            #region 读取上传路径配置
            UploadUserFacePath = AppSetting.GetAppSetting("UploadUserFacePath");
            if (string.IsNullOrEmpty(UploadUserFacePath))
            {
                result = new EntityResult<string>()
                {
                    Status = -1,
                    Msg = "没有读取到appsettings.json的用户上传路径UploadUserFacePath配置,请检查配置文件"
                };
                return result;
            }
            #endregion

            #region 保存文件
            for (var i = 0; i < formFile.Count; i++)
                formFiles.Add(formFile[i]);
            resultSave = await PublicFunction.SaveUploadFile(formFiles, UploadUserFacePath, @"image", UserId);
            if (resultSave.State != 0)
            {
                result = new EntityResult<string>()
                {
                    Status = -1,
                    Msg = $"保存文件失败,原因[{resultSave.Message}]"
                };
                return result;
            }
            resultFileList = (List<ResultFile>)resultSave.Data;
            #endregion

            #region 拼接返回URL
            host = PublicFunction.GetRequestHost(Request);
            resultUrl = $"/{UploadUserFacePath}/{resultFileList[0].NewFileName}";
            #endregion

            #region 更新头像数据
            user[0].userface = resultUrl;
            user[0].modifieddatetime = DateTime.Now;
            resultDbState = new userinfo_BLL().Update(user[0], $" userid='{UserId}' ", out message);
            if (resultDbState != 0)
            {
                result = new EntityResult<string>()
                {
                    Status = -1,
                    Msg = $"更新头像出错,原因[{message}]"
                };
                return result;
            }
            #endregion

            result = new EntityResult<string>()
            {
                Status = 0,
                Msg = string.Empty,
                Result = resultUrl
            };
            return result;
        }
    }
}
