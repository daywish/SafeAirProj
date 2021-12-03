using SafeAirProj.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SafeAirProj.ViewModels
{
    public class FloorsViewModel
    {
        public IEnumerable<Floors> Floors { get; set; }
        public Buildings Building { get; set; }
    }
}
