using Microsoft.AspNetCore.Mvc;

namespace IOT_UI.Controllers
{
    public class CustomerController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Sites()
        {
            return View();
        }

        public IActionResult Devices()
        {
            return View();
        }

        public IActionResult Services()
        {
            return View();
        }

        public IActionResult ProductType()
        {
            return View();
        }
    }
}
