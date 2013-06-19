using Estates.models;
using Nancy;
using Nancy.ModelBinding;
using Raven.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Estates.modules
{
    public class EstateModule : NancyModule
    {
        public EstateModule(IDocumentSession session) : base("estates")
        {
            Get["/"] = _ => new EstatesModel() { Estates = session.Query<Estate>().ToList() };
            Post["/"] = _ => {
                var estate = this.Bind<Estate>("Id");

                session.Store(estate);

                return estate;
            };
        }
    }

    public class EstatesModel
    {
        public IEnumerable<Estate> Estates { get; set; }
    }
}