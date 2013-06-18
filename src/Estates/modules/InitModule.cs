using Estates.models;
using Nancy;
using Raven.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Estates.modules
{
    public class InitModule : NancyModule
    {
        public InitModule(IDocumentSession session) : base("init")
        {
            Get["/"] = _ =>
            {
                session.Store(new Estate() { Address = "Ringvägen 101", City = "Varberg", Zip = "43243", Lat = 57.10130m, Long = 12.25567m });

                return "Ok";
            };
        }
    }
}