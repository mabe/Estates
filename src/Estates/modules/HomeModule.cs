using Nancy;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Estates.modules
{
    public class HomeModule : NancyModule
    {
        public HomeModule()
        {
            Get["/"] = _ => new HomeModel();
        }
    }

    public class HomeModel
    {

    }
}