using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace SafeAirProj.Models
{
    public partial class Emploees
    {
        public Emploees()
        {
            Requests = new HashSet<Requests>();
        }

        public int EmploeeId { get; set; }
        public string EmploeeFirstName { get; set; }
        public string EmploeeLastName { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan FinishTime { get; set; }

        public virtual ICollection<Requests> Requests { get; set; }
    }
}
