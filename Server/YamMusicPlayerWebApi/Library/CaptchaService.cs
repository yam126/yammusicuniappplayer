using Microsoft.Extensions.Caching.Memory;

namespace YamMusicPlayerWebApi.Library
{
    public class CaptchaService
    {
        private readonly IMemoryCache _cache;
        private static readonly SemaphoreSlim _semaphore = new SemaphoreSlim(1);

        public CaptchaService(IMemoryCache cache)
        {
            _cache = cache;
        }

        public async Task<string> GetCaptchaAsync(string key)
        {
            // 使用SemaphoreSlim确保只有一个线程可以生成验证码
            await _semaphore.WaitAsync();
            try
            {
                var captcha = _cache.Get<string>(key);
                if (captcha == null)
                {
                    // 生成新的验证码
                    captcha = GenerateNewCaptcha();
                    // 设置缓存过期时间
                    var options = new MemoryCacheEntryOptions()
                        .SetSlidingExpiration(TimeSpan.FromMinutes(5));
                    _cache.Set(key, captcha, options);
                }
                return captcha;
            }
            finally
            {
                // 释放信号量
                _semaphore.Release();
            }
        }

        private string GenerateNewCaptcha()
        {
            // 这里模拟生成验证码的逻辑
            return "captcha_" + Guid.NewGuid().ToString("N");
        }
    }
}
