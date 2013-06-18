using Nancy;
using Nancy.Bootstrappers.StructureMap;
using Nancy.Conventions;
using Nancy.Elmah;
using Raven.Client;
using Raven.Client.Document;
using Raven.Client.Embedded;
using Raven.Client.Indexes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;

namespace Estates
{
    public class Bootstrapper : StructureMapNancyBootstrapper
    {
        protected override void ConfigureConventions(Nancy.Conventions.NancyConventions nancyConventions)
        {
            nancyConventions.StaticContentsConventions.Add(StaticContentConventionBuilder.AddDirectory("scripts", @"scripts"));
        }

        protected override void ApplicationStartup(StructureMap.IContainer container, Nancy.Bootstrapper.IPipelines pipelines)
        {
            Elmahlogging.Enable(pipelines, "elmah");

            var store = new EmbeddableDocumentStore() { ConnectionStringName = "RavenDB" };
            store.Initialize();

            IndexCreation.CreateIndexes(Assembly.GetCallingAssembly(), store);

            container.Configure(x => { 
                x.For<IDocumentStore>().Singleton().Use(store);
                x.For<IDocumentSession>().HttpContextScoped().Use(ctx => ctx.GetInstance<IDocumentStore>().OpenSession());
            });
        }

        protected override void RequestStartup(StructureMap.IContainer container, Nancy.Bootstrapper.IPipelines pipelines, Nancy.NancyContext context)
        {
            pipelines.AfterRequest.AddItemToEndOfPipeline(ctx => {
                var session = container.GetInstance<IDocumentSession>();

                if (session == null) {
                    return;
                }

                if (ctx.Response.StatusCode != HttpStatusCode.InternalServerError) {
                    session.SaveChanges();
                }

                session.Dispose();
            });
        }
    }
}