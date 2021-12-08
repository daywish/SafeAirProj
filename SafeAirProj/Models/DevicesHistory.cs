using System;
using System.Collections.Generic;

// Code scaffolded by EF Core assumes nullable reference types (NRTs) are not used or disabled.
// If you have enabled NRTs for your project, then un-comment the following line:
// #nullable disable

namespace SafeAirProj.Models
{
    public partial class DevicesHistory
    {
        public int RecordingId { get; set; }
        public int DeviceId { get; set; }
        public DateTime RequestDate { get; set; }
        public double? TemperatureDate { get; set; }
        public double? WetnessData { get; set; }

        public virtual Devices Device { get; set; }
    }
}
