using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using RawStack.Models;

namespace RawStack.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Title = "Home Page";

            using (var session = RavenConfig.Store.OpenSession())
            {
                var movies = session.Query<Movie>().ToList();
                if (movies.Count == 0)
                {
                    session.Store(new Movie { Title = "Movie 1" });
                    session.Store(new Movie { Title = "Movie 2" });
                    session.SaveChanges();
                }
                ViewBag.Movies = movies;
            }
            return View();
        }
    }
}
