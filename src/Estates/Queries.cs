using Estates.indexs;
using Estates.models;
using Raven.Client;
using Raven.Client.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Estates
{
    public static class Queries
    {
        public static IRavenQueryable<Estate> QueryEstatesInProximity(this IDocumentSession session, double latitude, double longitude, double radius)
        {
            return session.Query<Estate, Estate_SpatialIndex>()
                        .Customize(x => x.WithinRadiusOf(fieldName: "Coordinates", radius: radius, latitude: latitude, longitude: longitude));
        }
    }
}