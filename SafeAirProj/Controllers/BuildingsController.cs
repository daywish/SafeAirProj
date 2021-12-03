using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SafeAirProj.Data;
using SafeAirProj.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace SafeAirProj.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class BuildingsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<BuildingsController> _logger;

        public BuildingsController(ILogger<BuildingsController> logger, UserManager<ApplicationUser> userManager, ApplicationDbContext context)
        {
            _context = context;
            _userManager = userManager;
            _logger = logger;
        }

        [HttpGet("{BuildingId:int}")]
        public IActionResult GetBuilding(int BuildingId)
        {
            return Ok(BuildingId);
        }

        [HttpGet]
        public async Task<IEnumerable<Buildings>> Get()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            IEnumerable<Buildings> buildings = await _context.Buildings.Where(i => i.OwnerId == userId).ToArrayAsync();
            return buildings;
        }

        public class InputModel
        {
            public string BuildingName { get; set; }
            public string BuildingAddress { get; set; }
        }
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] InputModel input)
        {
            if(input!=null)
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if(userId==null)
                {
                    return NotFound($"Unable to find user with id: {userId}.");
                }
                Buildings newBuilding = new Buildings()
                {
                    OwnerId = userId,
                    BuildingName = input.BuildingName,
                    BuildingAddress = input.BuildingAddress
                };
                _context.Buildings.Add(newBuilding);
                await _context.SaveChangesAsync();
                return Ok(input);
            }
            return NotFound();
        }

        [HttpDelete("{Id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var buildingId = id;
            if(buildingId!=null)
            {
                Buildings building = _context.Buildings.Where(i => i.BuildingId == buildingId).FirstOrDefault();
                if(building!=null)
                {
                    _context.Buildings.Remove(building);
                    await _context.SaveChangesAsync();
                    return Ok(id);
                }
                return NotFound($"There is no object with id:{buildingId}");
            }
            return NotFound();
        }
    }
}
