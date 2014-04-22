using System.Collections.Generic;

namespace RawStack.Models
{
    public class Movie
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public int? Year { get; set; }
        public string MpaaRating { get; set; }
        public Rating Ratings { get; set; }
        public string CriticsConsensus { get; set; }
        public string Synopsis { get; set; }
        public IEnumerable<string> Genres { get; set; }
        public Posters Posters { get; set; }
        public IEnumerable<CastActor> AbridgedCast { get; set; }
        public IEnumerable<string> AbridgedDirectors { get; set; }
    }

    public class Rating
    {
        public int CriticsScore { get; set; }
        public int AudienceScore { get; set; }
    }
}