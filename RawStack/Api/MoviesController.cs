using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using RawStack.Models;

namespace RawStack.Api
{
    public class MoviesController : ApiController
    {
        public IEnumerable<Movie> GetMovies()
        {
            using (var session = RavenConfig.Store.OpenSession())
            {
                return session.Query<Movie>().ToList();
            }
        }

        public void PostMovie(Movie movie)
        {
            using (var session = RavenConfig.Store.OpenSession())
            {
                session.Store(movie);
                session.SaveChanges();
            }
        }
    }
}
