using Microsoft.AspNetCore.Mvc;

namespace IOT_UI.Controllers
{
    public class AdminController : Controller
    {
        public IActionResult Dashboard()
        {
            return View();
        }
    }
}
