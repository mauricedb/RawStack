using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using RawStack.Api;
using RawStack.Models;

namespace RawStack.Tests.Api
{
    [TestClass]
    public class MoviesControllerTests
    {
        private MoviesController _controller;

        [TestInitialize]
        public void TestInitialize()
        {
            // Arrange
            RavenConfig.Register();
            _controller = new MoviesController();
        }

        [TestMethod]
        public void GetMoviesShouldZeroLoadMovies()
        {
            // Act
            var movies = _controller.GetMovies();

            // Assert
            Assert.AreEqual(0, movies.Count());
        }

        [TestMethod]
        public void GetMoviesShouldOneLoadMovies()
        {
            // Arrange
            using (var session = RavenConfig.Store.OpenSession())
            {
                session.Store(new Movie());
                session.SaveChanges();
            }

            // Act
            var movies = _controller.GetMovies();

            // Assert
            Assert.AreEqual(1, movies.Count());
        }

        [TestMethod]
        public void GetMoviesShouldTwoLoadMovies()
        {
            // Arrange
            using (var session = RavenConfig.Store.OpenSession())
            {
                session.Store(new Movie());
                session.Store(new Movie());
                session.SaveChanges();
            }

            // Act
            var movies = _controller.GetMovies();

            // Assert
            Assert.AreEqual(2, movies.Count());
        }
    }
}