using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net;
using System.Net.Http;
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

        public class MoviesRequest
        {
            public int Page { get; set; }
            public string[] Genres { get; set; }
            public string Director { get; set; }
        }

        public IEnumerable<Movie> GetMovies([FromUri]MoviesRequest request)
        {
            const int pageSize = 32;

            var query = _session.Advanced.LuceneQuery<Movie>();
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

            var movies = query
                .OrderBy(m => m.Title)
                .Skip(request.Page * pageSize)
                .Take(pageSize)
                .ToList();

            return movies;
        }

        public Movie GetMovie(int id)
        {
            var movie = _session.Load<Movie>(id);

            return movie;
        }

        public HttpResponseMessage PostMovie(Movie movie)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    _session.Store(movie);
                    _session.SaveChanges();

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

        public HttpResponseMessage PutMovie(int id, Movie movie)
        {
            try
            {
                if (movie.Id != id)
                {
                    throw new ValidationException("Invalid movie ID.");
                }
                if (ModelState.IsValid)
                {
                    _session.Store(movie);
                    _session.SaveChanges();
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

        public HttpResponseMessage DeleteMovie(int id)
        {
            try
            {
                var movie = _session.Load<Movie>(id);
                if (movie != null)
                {
                    _session.Delete(movie);
                    _session.SaveChanges();
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