using System.Collections.Generic;
using System.Linq;
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
        private IDocumentSession _session;

        [TestInitialize]
        public void TestInitialize()
        {
            // Arrange
            _documentStore = new EmbeddableDocumentStore
            {
                ConnectionStringName = "RavenDB"
            };
            _documentStore.Initialize();
            _session = _documentStore.OpenSession();
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
        public void GetMoviesShouldZeroLoadMovies()
        {
            // Act
            IEnumerable<Movie> movies = _controller.GetMovies();

            // Assert
            Assert.AreEqual(0, movies.Count());
        }

        [TestMethod]
        public void GetMoviesShouldOneLoadMovies()
        {
            // Arrange
            _session.Store(new Movie());
            _session.SaveChanges();

            // Act
            IEnumerable<Movie> movies = _controller.GetMovies();

            // Assert
            Assert.AreEqual(1, movies.Count());
        }

        [TestMethod]
        public void GetMoviesShouldTwoLoadMovies()
        {
            // Arrange
            _session.Store(new Movie());
            _session.Store(new Movie());
            _session.SaveChanges();

            // Act
            IEnumerable<Movie> movies = _controller.GetMovies();

            // Assert
            Assert.AreEqual(2, movies.Count());
        }
    }
}