using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Raven.Client;
using Raven.Client.Embedded;
using RawStack.Api;
using RawStack.Models;

namespace RawStack.Tests.Api
{
    [TestClass]
    public class MoviesControllerTests
    {
        private MoviesController _controller;
        private EmbeddableDocumentStore _documentStore;
        private IAsyncDocumentSession _session;

        [TestInitialize]
        public void TestInitialize()
        {
            // Arrange
            _documentStore = new EmbeddableDocumentStore
            {
                ConnectionStringName = "RavenDB"
            };
            _documentStore.Initialize();
            _session = _documentStore.OpenAsyncSession();
            _controller = new MoviesController(_session);
        }

        [TestCleanup]
        public void TestCleanup()
        {
            if (_session != null)
            {
                _session.Dispose();
                _session = null;
            }
            if (_documentStore != null)
            {
                _documentStore.Dispose();
                _documentStore = null;
            }
        }

        [TestMethod]
        public async Task GetMoviesShouldZeroLoadMovies()
        {
            // Act
            var request = new MoviesController.MoviesRequest();
            IEnumerable<Movie> movies = await _controller.GetMovies(request);

            // Assert
            Assert.AreEqual(0, movies.Count());
        }

        [TestMethod]
        public async Task GetMoviesShouldOneLoadMovies()
        {
            // Arrange
            await _session.StoreAsync(new Movie());
            await _session.SaveChangesAsync();

            // Act
            var request = new MoviesController.MoviesRequest();
            IEnumerable<Movie> movies = await _controller.GetMovies(request);

            // Assert
            Assert.AreEqual(1, movies.Count());
        }

        [TestMethod]
        public async Task GetMoviesShouldTwoLoadMovies()
        {
            // Arrange
            await _session.StoreAsync(new Movie());
            await _session.StoreAsync(new Movie());
            await _session.SaveChangesAsync();

            // Act
            var request = new MoviesController.MoviesRequest();
            IEnumerable<Movie> movies = await _controller.GetMovies(request);

            // Assert
            Assert.AreEqual(2, movies.Count());
        }

        [TestMethod]
        public async Task GetMoviesShouldZeroLoadMovieWithGenre()
        {
            // Arrange
            await _session.StoreAsync(new Movie { Genres = new[] { "g1" } });
            await _session.StoreAsync(new Movie());
            await _session.SaveChangesAsync();

            // Act
            var request = new MoviesController.MoviesRequest { Genres = new[] { "g2" } };
            IEnumerable<Movie> movies = await _controller.GetMovies(request);

            // Assert
            Assert.AreEqual(0, movies.Count());
        }

        [TestMethod]
        public async Task GetMoviesShouldOneLoadMovieWithGenre()
        {
            // Arrange
            await _session.StoreAsync(new Movie { Genres = new[] { "g1" } });
            await _session.StoreAsync(new Movie());
            await _session.SaveChangesAsync();

            // Act
            var request = new MoviesController.MoviesRequest { Genres = new[] { "g1" } };
            IEnumerable<Movie> movies = await _controller.GetMovies(request);

            // Assert
            Assert.AreEqual(1, movies.Count());
        }

        [TestMethod]
        public async Task GetMoviesShouldTwoLoadMovieWithGenre()
        {
            // Arrange
            await _session.StoreAsync(new Movie { Genres = new[] { "g1" } });
            await _session.StoreAsync(new Movie { Genres = new[] { "g1", "g2" } });
            await _session.StoreAsync(new Movie { Genres = new[] { "g1", "g2" } });
            await _session.StoreAsync(new Movie { Genres = new[] { "g2" } });
            await _session.StoreAsync(new Movie());
            await _session.SaveChangesAsync();

            // Act
            var request = new MoviesController.MoviesRequest { Genres = new[] { "g1", "g2" } };
            IEnumerable<Movie> movies = await _controller.GetMovies(request);

            // Assert
            Assert.AreEqual(2, movies.Count());
        }

        [TestMethod]
        public async Task GetMoviesWithSpacesShouldTwoLoadMovieWithGenre()
        {
            // Arrange
            await _session.StoreAsync(new Movie { Genres = new[] { "g 1" } });
            await _session.StoreAsync(new Movie { Genres = new[] { "g 1", "g 2" } });
            await _session.StoreAsync(new Movie { Genres = new[] { "g 1", "g 2" } });
            await _session.StoreAsync(new Movie { Genres = new[] { "g 2" } });
            await _session.StoreAsync(new Movie());
            await _session.SaveChangesAsync();

            // Act
            var request = new MoviesController.MoviesRequest { Genres = new[] { "g 1", "g 2" } };
            IEnumerable<Movie> movies = await _controller.GetMovies(request);

            // Assert
            Assert.AreEqual(2, movies.Count());
        }
    }
}