using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using Raven.Client;
using RawStack.Models;

namespace RawStack.Api
{
    public class MoviesController : ApiController
    {
        private readonly IAsyncDocumentSession _session;

        public MoviesController(IAsyncDocumentSession session)
        {
            _session = session;
        }

        public class MoviesRequest
        {
            public int Page { get; set; }
            public string[] Genres { get; set; }
            public string Director { get; set; }
        }

        public async Task<IEnumerable<Movie>> GetMovies([FromUri] MoviesRequest request)
        {
            const int pageSize = 32;

            var query = _session.Advanced.AsyncLuceneQuery<Movie>();
            if (request.Genres != null && request.Genres.Length > 0 && request.Genres[0] != null)
            {
                var filter = "Genres:(\"" + string.Join("\" AND \"", request.Genres) + "\")";
                query = query.Where(filter);
            }

            if (request.Director != null)
            {
                var filter = "AbridgedDirectors:(\"" + request.Director + "\")";
                query = query.Where(filter);
            }

            var movies = await query
                .OrderBy(m => m.Title)
                .Skip(request.Page * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return movies;
        }

        public async Task<Movie> GetMovie(int id)
        {
            var movie = await _session.LoadAsync<Movie>(id);

            return movie;
        }

        public async Task<HttpResponseMessage> PostMovie(Movie movie)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    await _session.StoreAsync(movie);
                    await _session.SaveChangesAsync();

                    HttpResponseMessage result = Request.CreateResponse(HttpStatusCode.Created, movie);
                    result.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = movie.Id }));
                    return result;
                }

                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
            catch (ValidationException ex)
            {
                return Request.CreateResponse(HttpStatusCode.NotAcceptable, ex.Message);
            }
        }

        public async Task<HttpResponseMessage> PutMovie(int id, Movie movie)
        {
            try
            {
                if (movie.Id != id)
                {
                    throw new ValidationException("Invalid movie ID.");
                }
                if (ModelState.IsValid)
                {
                    await _session.StoreAsync(movie);
                    await _session.SaveChangesAsync();
                }
                else
                {
                    return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
                }
            }
            catch (ValidationException ex)
            {
                return Request.CreateResponse(HttpStatusCode.NotAcceptable, ex.Message);
            }

            return Request.CreateResponse(HttpStatusCode.OK);
        }

        public async Task<HttpResponseMessage> DeleteMovie(int id)
        {
            try
            {
                var movie = await _session.LoadAsync<Movie>(id);
                if (movie != null)
                {
                    _session.Delete(movie);
                    await _session.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.NotAcceptable, ex.Message);
            }

            return Request.CreateResponse(HttpStatusCode.NoContent);
        }
    }
}