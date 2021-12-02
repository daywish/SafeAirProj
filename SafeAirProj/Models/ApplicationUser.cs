using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SafeAirProj.Models
{
    public class ApplicationUser : IdentityUser
    {
        public virtual IEnumerable<Buildings> Buildings { get; set; }
    }
}
