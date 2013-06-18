using Estates.models;
using Nancy;
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
        }
    }

    public class EstatesModel
    {
        public IEnumerable<Estate> Estates { get; set; }
    }
}