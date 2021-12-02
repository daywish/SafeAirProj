using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace SafeAirProj.Models
{
    public partial class Requests
    {
        public int RequestId { get; set; }
        public bool Accepted { get; set; }
        public bool Finished { get; set; }
        public int? RoomId { get; set; }
        public int? EmploeeId { get; set; }

        public virtual Emploees Emploee { get; set; }
        public virtual Rooms Room { get; set; }
    }
}
