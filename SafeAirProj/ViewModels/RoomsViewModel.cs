using SafeAirProj.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SafeAirProj.ViewModels
{
    public class RoomsViewModel
    {
        public IEnumerable<Rooms> Rooms { get; set; }
        public Floors Floor { get; set; }
        public Buildings Building { get; set; }
    }
}
