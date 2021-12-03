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
    [Route("api/buildings/{buildingId:int}/[controller]")]
    public class FloorsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<FloorsController> _logger;

        public FloorsController(ILogger<FloorsController> logger, ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _logger = logger;
            _context = context;
            _userManager = userManager;

        }

        [HttpGet]
        public async Task<FloorsViewModel> Get(int buildingId)
        {
            Buildings building = await _context.Buildings.Where(i => i.BuildingId == buildingId).FirstOrDefaultAsync();
            IEnumerable<Floors> floors = await _context.Floors.Where(i => i.BuildingId == buildingId).ToArrayAsync();
            FloorsViewModel viewModel = new FloorsViewModel()
            {
                Floors = floors,
                Building = building
            };
            return viewModel;
        }
        public class InputModel
        {
            public int FloorNumber { get; set; }
        }
        [HttpPost]
        public async Task<IActionResult> Post(int buildingId, [FromBody] InputModel input)
        {
            if(input!=null)
            {
                Floors newFloor = new Floors
                {
                    FloorNumber = input.FloorNumber,
                    BuildingId = buildingId
                };
                _context.Floors.Add(newFloor);
                await _context.SaveChangesAsync();
                return Ok(input);
            }
            return BadRequest();
        }
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int buildingId, int id)
        {
            Floors floor = _context.Floors.FirstOrDefault(i => i.FloorId == id);
            if(floor!=null)
            {
                _context.Floors.Remove(floor);
                await _context.SaveChangesAsync();
                return Ok(floor);
            }
            return NotFound();
        }
    }
}
