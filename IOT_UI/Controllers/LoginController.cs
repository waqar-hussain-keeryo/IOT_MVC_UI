using IOT_UI.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Reflection;
using System.Text;

namespace IOT_UI.Controllers
{
    public class LoginController : Controller
    {
        private readonly IConfiguration _configuration;

        public LoginController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Index(LoginRequest model)
        {
            if (ModelState.IsValid)
            {
                using (var client = new HttpClient())
                {
                    var loginData = new StringContent(JsonConvert.SerializeObject(model), Encoding.UTF8, "application/json");
                    var response = await client.PostAsync($"{_configuration["https://localhost:7290"]}/api/User/Login", loginData);

                    if (response.IsSuccessStatusCode)
                    {
                        var result = await response.Content.ReadAsStringAsync();
                        var tokenModel = JsonConvert.DeserializeObject<TokenResponse>(result);

                        // Store JWT token in session
                        HttpContext.Session.SetString("JWTToken", tokenModel.Token);

                        // Redirect to the Dashboard after successful login
                        return RedirectToAction("Index", "Dashboard", new { area = "Admin" });
                    }

                    ModelState.AddModelError("", "Invalid login attempt.");
                }
            }

            // Return the same view with error message
            return View(model);
        }

        public IActionResult Register()
        {
            return View();
        }
    }
}
