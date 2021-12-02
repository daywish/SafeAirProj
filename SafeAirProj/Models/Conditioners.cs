using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace SafeAirProj.Models
{
    public partial class Conditioners
    {
        public Conditioners()
        {
            Rooms = new HashSet<Rooms>();
        }

        public int ConditionerId { get; set; }
        public string ConditionerName { get; set; }
        public decimal ConditionerCost { get; set; }
        public TimeSpan ServiceTime { get; set; }

        public virtual ICollection<Rooms> Rooms { get; set; }
    }
}
