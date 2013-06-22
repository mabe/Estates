using Estates.models;
using Raven.Client.Indexes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Estates.indexs
{
    public class Estate_SpatialIndex : AbstractIndexCreationTask<Estate>
    {
        public Estate_SpatialIndex()
        {
            this.Map = estates => from e in estates
                                  select new { 
                                      Name = e.Address,
                                      __ = SpatialGenerate("Coordinates", e.Lat, e.Long)
                                  };
        }
    }
}