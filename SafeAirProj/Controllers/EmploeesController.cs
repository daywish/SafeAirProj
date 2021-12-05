using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SafeAirProj.Data;
using SafeAirProj.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SafeAirProj.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class EmploeesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<EmploeesController> _logger;

        public EmploeesController(ILogger<EmploeesController> logger, ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _logger = logger;
            _context = context;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<IEnumerable<Emploees>> Get()
        {
            IEnumerable<Emploees> emploees = await _context.Emploees.ToArrayAsync();
            return emploees;
        }

        public class InputModel
        {
            public string EmploeeFirstName { get; set; }
            public string EmploeeLastName { get; set; }
            public TimeSpan StartTime { get; set; }
            public TimeSpan FinishTime { get; set; }
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] InputModel input)
        {
            if (input != null)
            {
                Emploees newEmploee = new Emploees()
                {
                    EmploeeFirstName = input.EmploeeFirstName,
                    EmploeeLastName = input.EmploeeLastName,
                    StartTime = input.StartTime,
                    FinishTime = input.FinishTime
                };
                _context.Emploees.Add(newEmploee);
                await _context.SaveChangesAsync();
                return Ok(input);
            }
            return BadRequest();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var emploeeId = id;
            if (emploeeId != null)
            {
                Emploees emploee = _context.Emploees.Where(i => i.EmploeeId == emploeeId).FirstOrDefault();
                if (emploee != null)
                {
                    _context.Emploees.Remove(emploee);
                    await _context.SaveChangesAsync();
                    return Ok(id);
                }
                return NotFound();
            }
            return NotFound();
        }
    }
}
