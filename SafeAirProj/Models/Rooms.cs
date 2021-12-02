using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace SafeAirProj.Models
{
    public partial class Rooms
    {
        public Rooms()
        {
            Requests = new HashSet<Requests>();
        }

        public int RoomId { get; set; }
        public int RoomNumber { get; set; }
        public double RoomTemperature { get; set; }
        public double RoomWetness { get; set; }
        public int? FloorId { get; set; }
        public int? ConditionerId { get; set; }

        public virtual Conditioners Conditioner { get; set; }
        public virtual Floors Floor { get; set; }
        public virtual ICollection<Requests> Requests { get; set; }
    }
}
