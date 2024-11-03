using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using YamMusicPlayerWebApi.JWTModel;
using PublicLibrary;
using Microsoft.OpenApi.Models;
using System.Reflection;
using Microsoft.AspNetCore.Builder;

namespace YamMusicPlayerWebApi
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);


            // 从配置文件读取URL
            //var urlConfig = builder.Configuration.GetSection("Kestrel:Endpoints:Http:Url").Value;
            //builder.WebHost.UseUrls(urlConfig);
            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            if (builder.Environment.IsDevelopment())
            {
                builder.Services.AddSwaggerGen(c =>
                {
                    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Yam Music Player V1", Version = "v1" });

                    // 设置XML注释路径
                    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                    c.IncludeXmlComments(xmlPath);
                });
            }
            else
            {
                builder.Services.AddSwaggerGen();
            }
            IConfiguration Configuration = builder.Configuration;
            builder.Services.Configure<TokenManagement>(Configuration.GetSection("tokenConfig"));

            var token = Configuration.GetSection("tokenConfig").Get<TokenManagement>();

            builder.Services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(x =>
            {
                x.RequireHttpsMetadata = false;
                x.SaveToken = true;
                //Token Validation Parameters
                x.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    //获取或设置要使用的Microsoft.IdentityModel.Tokens.SecurityKey用于签名验证。
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.
                    GetBytes(token.Secret)),
                    //获取或设置一个System.String，它表示将使用的有效发行者检查代币的发行者。
                    ValidIssuer = token.Issuer,
                    //获取或设置一个字符串，该字符串表示将用于检查的有效受众反对令牌的观众。
                    ValidAudience = token.Audience,
                    ValidateIssuer = false,
                    ValidateAudience = false,
                };
            });
            builder.Services.AddScoped<IAuthenticateService, TokenAuthenticationService>();
            builder.Services.AddScoped<IUserService, UserService>();

            #region 启用Session
            builder.Services.AddDistributedMemoryCache();//启用内存缓存
            builder.Services.AddSession(options =>
            {
                options.IdleTimeout = TimeSpan.FromMinutes(30);//设置session过期时间
                options.Cookie.IsEssential = true;
            });
            #endregion

            #region 允许全局跨域
            builder.Services.AddCors(policy =>
            {
                policy.AddPolicy("CorsPolicy", opt => opt
                .WithOrigins("*")
                .AllowAnyOrigin()
                .AllowAnyHeader()
                .AllowAnyMethod()
                );
            });
            #endregion



            var app = builder.Build();

            // 配置HTTP和HTTPS
            var configuration = app.Configuration;
            var kestrelEndpoint = configuration["Kestrel:Endpoints:Http:Url"];
            var httpsEndpoint = configuration["Kestrel:Endpoints:Https:Url"];

            if (!string.IsNullOrEmpty(kestrelEndpoint))
            {
                var address = new Uri(kestrelEndpoint);
                var port = address.Port;
                // 配置HTTP端口
                app.Urls.Add(address.AbsoluteUri);
            }

            if (!string.IsNullOrEmpty(httpsEndpoint))
            {
                var address = new Uri(httpsEndpoint);
                var port = address.Port;
                // 配置HTTPS端口
                app.Urls.Add(address.AbsoluteUri);
            }

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Yam Music Player V1");
                });
            }
            else
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseStaticHostEnviroment();

            app.UseStaticFiles();

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.UseAuthorization();

            app.MapControllers();

            app.UseSession();

            app.UseCors("CorsPolicy");

            app.Run();
        }
    }
}