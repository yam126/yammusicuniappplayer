namespace YamMusicPlayerWebApi.Model
{
    /// <summary>
    /// 二维码内容
    /// </summary>
    [Serializable]
    public class QRCodeContnent
    {
        /// <summary>
        /// 二维码动作字符串
        /// </summary>
        public string? Action { get; set; }

        /// <summary>
        /// 二维码的值
        /// </summary>
        public string? Value { get; set; }
    }
}
