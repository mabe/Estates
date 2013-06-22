using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;

namespace Estates
{
    public static class Parse
    {
        public static double AsDouble(object @object) {
            return double.Parse(@object.ToString(), CultureInfo.InvariantCulture);
        }
    }
}