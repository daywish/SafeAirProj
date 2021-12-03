using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SafeAirProj.Data;
using SafeAirProj.Models;
using SafeAirProj.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SafeAirProj.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ConditionersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<ConditionersController> _logger;

        public ConditionersController(ILogger<ConditionersController> logger, UserManager<ApplicationUser> userManager, ApplicationDbContext context)
        {
            _context = context;
            _userManager = userManager;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IEnumerable<Conditioners>> Get()
        {
            IEnumerable<Conditioners> conditioners = await _context.Conditioners.ToArrayAsync();
            return conditioners;
        }

        public class InputModel
        {
            public string ConditionerName { get; set; }
            public decimal ConditionerCost { get; set; }
            public TimeSpan ServiceTime { get; set; }
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] InputModel input)
        {
            if(input!=null)
            {
                Conditioners newConditioner = new Conditioners()
                {
                    ConditionerName = input.ConditionerName,
                    ConditionerCost = input.ConditionerCost,
                    ServiceTime = input.ServiceTime
                };
                _context.Conditioners.Add(newConditioner);
                await _context.SaveChangesAsync();
                return Ok(input);
            }
            return BadRequest();
        }

        [HttpDelete("{Id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var conditionerId = id;
            if (conditionerId != null)
            {
                Conditioners conditioner = _context.Conditioners.Where(i => i.ConditionerId == conditionerId).FirstOrDefault();
                if (conditioner != null)
                {
                    _context.Conditioners.Remove(conditioner);
                    await _context.SaveChangesAsync();
                    return Ok(id);
                }
                return NotFound();
            }
            return NotFound();
        }
    }
}
