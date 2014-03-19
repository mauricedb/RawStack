using System.Collections.Generic;

namespace RawStack.Models
{
    public class CastActor
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public IEnumerable<string> Characters { get; set; }
    }
}