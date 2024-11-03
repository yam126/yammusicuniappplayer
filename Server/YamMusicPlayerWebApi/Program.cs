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


            // �������ļ���ȡURL
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

                    // ����XMLע��·��
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
                    //��ȡ������Ҫʹ�õ�Microsoft.IdentityModel.Tokens.SecurityKey����ǩ����֤��
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.
                    GetBytes(token.Secret)),
                    //��ȡ������һ��System.String������ʾ��ʹ�õ���Ч�����߼����ҵķ����ߡ�
                    ValidIssuer = token.Issuer,
                    //��ȡ������һ���ַ��������ַ�����ʾ�����ڼ�����Ч���ڷ������ƵĹ��ڡ�
                    ValidAudience = token.Audience,
                    ValidateIssuer = false,
                    ValidateAudience = false,
                };
            });
            builder.Services.AddScoped<IAuthenticateService, TokenAuthenticationService>();
            builder.Services.AddScoped<IUserService, UserService>();

            #region ����Session
            builder.Services.AddDistributedMemoryCache();//�����ڴ滺��
            builder.Services.AddSession(options =>
            {
                options.IdleTimeout = TimeSpan.FromMinutes(30);//����session����ʱ��
                options.Cookie.IsEssential = true;
            });
            #endregion

            #region ����ȫ�ֿ���
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

            // ����HTTP��HTTPS
            var configuration = app.Configuration;
            var kestrelEndpoint = configuration["Kestrel:Endpoints:Http:Url"];
            var httpsEndpoint = configuration["Kestrel:Endpoints:Https:Url"];

            if (!string.IsNullOrEmpty(kestrelEndpoint))
            {
                var address = new Uri(kestrelEndpoint);
                var port = address.Port;
                // ����HTTP�˿�
                app.Urls.Add(address.AbsoluteUri);
            }

            if (!string.IsNullOrEmpty(httpsEndpoint))
            {
                var address = new Uri(httpsEndpoint);
                var port = address.Port;
                // ����HTTPS�˿�
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