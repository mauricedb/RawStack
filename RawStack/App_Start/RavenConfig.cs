using System.Reflection;
using Raven.Client;
using Raven.Client.Embedded;
using Raven.Client.Indexes;

namespace RawStack
{
    public class RavenConfig
    {
        public static IDocumentStore Store { get; private set; }

        public static void Register()
        {
            Store = new EmbeddableDocumentStore
            {
                ConnectionStringName = "RavenDB"
            };
            Store.Initialize();

            IndexCreation.CreateIndexes(Assembly.GetCallingAssembly(), Store);
        }
    }
}