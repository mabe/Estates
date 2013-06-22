using Estates.indexs;
using Estates.models;
using Nancy;
using Nancy.ModelBinding;
using Raven.Abstractions.Indexing;
using Raven.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Nancy.Responses;
using System.Globalization;

namespace Estates.modules
{
    public class EstateModule : NancyModule
    {
        public EstateModule(IDocumentSession session) : base("estates")
        {
            Get["/"] = _ => new EstatesModel() {
                Estates = session.QueryEstatesInProximity(latitude: Parse.AsDouble((object)Request.Query.Latitude), longitude: Parse.AsDouble((object)Request.Query.Longitude), radius: 1d).ToList() 
            };
            Post["/"] = _ => {
                var estate = this.Bind<Estate>("Id"); 
                 
                session.Store(estate);

                return estate;
            };
            Put["/{id}"] = _ => {
                return this.BindTo(session.Load<Estate>("estates/" + (string)_.id), "Id");
            };
        }
    }

    public class EstatesModel
    {
        public IEnumerable<Estate> Estates { get; set; }
    }
}