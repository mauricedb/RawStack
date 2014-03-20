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

        public IEnumerable<Movie> GetMovies(int page, [FromUri]string[] genres)
        {
            const int pageSize = 128;

            var query = _session.Advanced.LuceneQuery<Movie>();
            if (genres.Length > 0 && genres[0] != null)
            {
                var filter = "Genres:(\"" + string.Join("\" AND \"", genres) + "\")";
                query = query.Where(filter);
            }

            var movies = query
                .OrderBy(m=> m.Title)
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