using System.Reflection;
using Raven.Client;
using Raven.Client.Embedded;
using Raven.Client.Indexes;

namespace RawStack
{
    public class RavenConfig
    {
        public static IDocumentStore Store;

        public static void Register()
        {
            Store = new EmbeddableDocumentStore
            {
                ConnectionStringName = "RavenDB",
                //UseEmbeddedHttpServer = true
            };
            Store.Initialize();

            IndexCreation.CreateIndexes(Assembly.GetCallingAssembly(), Store);
        }
    }
}