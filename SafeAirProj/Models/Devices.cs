using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace SafeAirProj.Models
{
    public partial class Devices
    {
        public Devices()
        {
            DevicesHistory = new HashSet<DevicesHistory>();
        }

        public int DeviceId { get; set; }
        public int RoomId { get; set; }

        public virtual Rooms Room { get; set; }
        public virtual ICollection<DevicesHistory> DevicesHistory { get; set; }
    }
}
