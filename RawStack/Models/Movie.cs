using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Web.UI.WebControls.WebParts;

namespace RawStack.Models
{
    public class Movie
    {
        public int Id { get; set; }
        [Required]
        public string Title { get; set; }
        public int? Year { get; set; }
        public string MpaaRating { get; set; }
        public Rating Ratings { get; set; }
        [DisplayName("Critics Consensus"), UIHint("TextArea")]
        public string CriticsConsensus { get; set; }
        [UIHint("TextArea")]
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