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

        public IEnumerable<Movie> GetMovies()
        {
            return _session.Query<Movie>().ToList();
        }

        public void PostMovie(Movie movie)
        {
            _session.Store(movie);
            _session.SaveChanges();
        }
    }
}