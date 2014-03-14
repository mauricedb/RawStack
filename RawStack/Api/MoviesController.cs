using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Raven.Client;
using RawStack.Models;

namespace RawStack.Api
{
    public class MoviesController : ApiController
    {
        private readonly IDocumentSession _session;

        public MoviesController(IDocumentSession session)
        {
            _session = session;
        }

        public IEnumerable<Movie> GetMovies(int page)
        {
            const int pageSize = 128;

            var movies = _session.Query<Movie>()
                .OrderBy(m => m.Title)
                .Skip(page * pageSize)
                .Take(pageSize)
                .ToList();

            return movies;
        }

        public void PostMovie(Movie movie)
        {
            _session.Store(movie);
            _session.SaveChanges();
        }

        public void DeleteMovie(int id)
        {
            var movie = _session.Load<Movie>(id);
            _session.Delete(movie);
            _session.SaveChanges();
        }
    }
}