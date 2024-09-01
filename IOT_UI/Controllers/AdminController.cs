using Microsoft.AspNetCore.Mvc;

namespace IOT_UI.Controllers
{
    public class AdminController : Controller
    {
        public IActionResult Dashboard()
        {
            return View();
        }

        public IActionResult UserRole()
        {
            return View();
        }

        public IActionResult AdminAccount()
        {
            return View();
        }

        public IActionResult Customers()
        {
            return View();
        }

        public IActionResult Users()
        {
            return View();
        }
    }
}
