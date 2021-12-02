using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace SafeAirProj.Models
{
    public partial class Buildings
    {
        public Buildings()
        {
            Floors = new HashSet<Floors>();
        }

        public int BuildingId { get; set; }
        public string OwnerId { get; set; }
        public string BuildingName { get; set; }
        public string BuildingAddres { get; set; }

        public virtual ApplicationUser Owner { get; set; }
        public virtual ICollection<Floors> Floors { get; set; }
    }
}
