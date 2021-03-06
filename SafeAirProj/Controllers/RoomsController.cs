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
    [Route("api/buildings/{buildingId:int}/floors/{floorId:int}/[controller]")]
    public class RoomsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<RoomsController> _logger;

        public RoomsController(ILogger<RoomsController> logger, ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _logger = logger;
            _context = context;
            _userManager = userManager;

        }

        [HttpGet]
        public async Task<RoomsViewModel> Get(int floorId)
        {
            Floors floor = await _context.Floors.Where(i => i.FloorId == floorId).FirstOrDefaultAsync();
            Buildings building = await _context.Buildings.Where(i => i.BuildingId == floor.BuildingId).FirstOrDefaultAsync();
            IEnumerable<Rooms> rooms = await _context.Rooms.Where(i => i.FloorId == floorId).ToArrayAsync();
            IEnumerable<Devices> devices = new List<Devices>();
            foreach(var room in rooms)
            {
                if(_context.Devices.Where(i=>i.RoomId==room.RoomId).Any()==false)
                {
                    Devices newDevice = new Devices()
                    {
                        RoomId = room.RoomId
                    };
                    _context.Devices.Add(newDevice);
                    await _context.SaveChangesAsync();
                }
            }
            foreach(var item in rooms)
            {
                item.Conditioner = await _context.Conditioners.FirstOrDefaultAsync(i => i.ConditionerId == item.ConditionerId);
                item.Devices = await _context.Devices.FirstOrDefaultAsync(i => i.RoomId == item.RoomId);
            }
            RoomsViewModel viewModel = new RoomsViewModel()
            {
                Rooms = rooms,
                Floor = floor,
                Building = building
            };
            return viewModel;
        }

        public class InputModel
        {
            public int RoomNumber { get; set; }
            public int ConditionerId { get; set; }
        }

        [HttpPost]
        public async Task<IActionResult> Post(int floorId, [FromBody] InputModel input)
        {
            if(input!=null)
            {
                Rooms newRoom = new Rooms()
                {
                    RoomNumber = input.RoomNumber,
                    RoomTemperature = 20,
                    RoomWetness = 50,
                    FloorId = floorId,
                    ConditionerId = input.ConditionerId
                };
                _context.Rooms.Add(newRoom);
                await _context.SaveChangesAsync();
                return Ok(input);
            }
            return BadRequest();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            Rooms room = await _context.Rooms.FirstOrDefaultAsync(i => i.RoomId == id);
            if(room!=null)
            {
                _context.Rooms.Remove(room);
                await _context.SaveChangesAsync();
                return Ok(id);
            }
            return BadRequest();
        }

        public class ChangeInputModel
        {
            public int RoomNumber { get; set; }
            public double RoomTemperature { get; set; }
            public double RoomWetness { get; set; }
        }

        [HttpPatch]
        public async Task<IActionResult> Patch(int floorId, [FromBody] ChangeInputModel input)
        {
            if(input!=null)
            {
                if (input.RoomNumber == 0)
                {
                    List<Rooms> rooms = await _context.Rooms.Where(i => i.FloorId == floorId).ToListAsync();
                    foreach (var room in rooms)
                    {
                        room.RoomTemperature = input.RoomTemperature;
                        room.RoomWetness = input.RoomWetness;
                    }
                    await _context.SaveChangesAsync();
                    return Ok(input);
                }
                else
                {
                    Rooms room = await _context.Rooms.FirstOrDefaultAsync(i => i.FloorId == floorId && i.RoomNumber == input.RoomNumber);
                    room.RoomTemperature = input.RoomTemperature;
                    room.RoomWetness = input.RoomWetness;
                    await _context.SaveChangesAsync();
                    return Ok(input);
                }

            }
            return BadRequest(input);
        }
    }
}
