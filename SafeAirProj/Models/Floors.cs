using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace SafeAirProj.Models
{
    public partial class Floors
    {
        public Floors()
        {
            Rooms = new HashSet<Rooms>();
        }

        public int FloorId { get; set; }
        public int FloorNumber { get; set; }
        public int? BuildingId { get; set; }

        public virtual Buildings Building { get; set; }
        public virtual ICollection<Rooms> Rooms { get; set; }
    }
}
