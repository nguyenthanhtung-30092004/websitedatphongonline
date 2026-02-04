
using DatPhongOnline.Configurations;
using DatPhongOnline.Data;
using DatPhongOnline.Helpers;
using DatPhongOnline.Repository.Ametities;
using DatPhongOnline.Repository.Bookings;
using DatPhongOnline.Repository.ChatMessages;
using DatPhongOnline.Repository.DatCocs;
using DatPhongOnline.Repository.MenuNavs;

using DatPhongOnline.Repository.Rooms;
using DatPhongOnline.Repository.RoomTypes;
using DatPhongOnline.Repository.Users;
using DatPhongOnline.Services;
using DatPhongOnline.Services.AI;
using DatPhongOnline.Services.AmenityService;
using DatPhongOnline.Services.Auth;
using DatPhongOnline.Services.BookingService;
using DatPhongOnline.Services.ChatService;
using DatPhongOnline.Services.CloudinaryService;
using DatPhongOnline.Services.DatCocService;
using DatPhongOnline.Services.MenuNavService;

using DatPhongOnline.Services.RoomSerive;
using DatPhongOnline.Services.RoomType;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddHttpClient();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
            builder.Configuration.GetConnectionString("DefaultConnection")
     )
);
builder.Services.Configure<VnPaySettings>(
    builder.Configuration.GetSection("VNPay"));

builder.Services.AddScoped<IDatCocRepository, DatCocRepository>();
builder.Services.AddScoped<IDatCocService, DatCocService>();
builder.Services.AddScoped<AiInterpreterService>();

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IRoomTypeRepository, RoomTypeRepository>();
builder.Services.AddScoped<IRoomTypeService, RoomTypeService>();
builder.Services.AddScoped<IAmenityRepository, AmenityRepository>();
builder.Services.AddScoped<IAmenityService, AmenityService>();
builder.Services.AddScoped<IRoomRepository, RoomRepository>();
builder.Services.AddScoped<IRoomService, RoomService>();
builder.Services.AddScoped<IMenuNavRepository, MenuNavRepository>();
builder.Services.AddScoped<IMenuNavService, MenuNavService>();
builder.Services.AddScoped<ICloudinaryService, CloudinaryService>();
builder.Services.AddScoped<IBookingRepository, BookingRepository>();
builder.Services.AddScoped<IBookingService, BookingService>();
builder.Services.AddScoped<SendEmailService>();
builder.Services.AddScoped<IChatRepository, ChatRepository>();
builder.Services.AddScoped<IChatService, ChatService>();

builder.Services.AddScoped<JwtService>();


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173", "http://localhost:3001")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});     

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["JWT:Key"])
            ),
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["JWT:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["JWT:Audience"],
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero,
            RoleClaimType = ClaimTypes.Role
        };

        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                if (context.Request.Cookies.ContainsKey("jwt"))
                {
                    context.Token = context.Request.Cookies["jwt"];
                }
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddAuthorization();


var app = builder.Build();


app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapControllers();
app.Run();
