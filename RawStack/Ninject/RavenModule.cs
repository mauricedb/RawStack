using System.Reflection;
using Ninject;
using Ninject.Activation;
using Ninject.Modules;
using Ninject.Web.Common;
using Raven.Client;
using Raven.Client.Embedded;
using Raven.Client.Indexes;

namespace RawStack.Ninject
{
    public class RavenModule : NinjectModule
    {
        public override void Load()
        {
            Bind<IDocumentStore>()
                .ToMethod(InitDocStore)
                .InSingletonScope();

            Bind<IDocumentSession>()
                .ToMethod(c => c.Kernel.Get<IDocumentStore>().OpenSession())
                .InRequestScope();

            Bind<IAsyncDocumentSession>()
                .ToMethod(c => c.Kernel.Get<IDocumentStore>().OpenAsyncSession())
                .InRequestScope();
        }

        private IDocumentStore InitDocStore(IContext context)
        {
            var documentStore = new EmbeddableDocumentStore
            {
                ConnectionStringName = "RavenDB"
            };
            documentStore.Initialize();

            IndexCreation.CreateIndexes(Assembly.GetCallingAssembly(), documentStore);

            return documentStore;
        }
    }
}