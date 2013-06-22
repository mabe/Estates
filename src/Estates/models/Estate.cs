﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Estates.models
{
    public class Estate
    {
        public string Id { get; set; }

        public string Address { get; set; }
        public string Zip { get; set; }
        public string City { get; set; }

        public double Lat { get; set; }
        public double Long { get; set; }
    }
}