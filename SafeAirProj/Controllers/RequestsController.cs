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
    public class RequestsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<RequestsController> _logger;

        public RequestsController(ILogger<RequestsController> logger, ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _logger = logger;
            _context = context;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<IEnumerable<Requests>> Get()
        {
            IEnumerable<Requests> requests = await _context.Requests.ToArrayAsync();
            foreach (var request in requests)
            {
                request.Emploee = await _context.Emploees.FirstOrDefaultAsync(i => i.EmploeeId == request.EmploeeId);
                request.Room = await _context.Rooms.FirstOrDefaultAsync(i => i.RoomId == request.RoomId);
                request.Room.Floor = await _context.Floors.FirstOrDefaultAsync(i => i.FloorId == request.Room.FloorId);
                request.Room.Floor.Building = await _context.Buildings.FirstOrDefaultAsync(i => i.BuildingId == request.Room.Floor.BuildingId);
            }
            return requests;
        }

        public class InputModel
        {
            public int RoomId;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] InputModel input)
        {
            Rooms room = await _context.Rooms.FirstOrDefaultAsync(i => i.RoomId == input.RoomId);
            if(room!=null)
            {
                List<Emploees> emploees = await _context.Emploees.ToListAsync();
                foreach(var emploee in emploees)
                {
                    _context.Requests.Add(new Requests() { 
                    Accepted = false,
                    Finished = false,
                    RoomId = room.RoomId,
                    EmploeeId = emploee.EmploeeId
                    });
                }
                await _context.SaveChangesAsync();
                return Ok(input);
            }
            return BadRequest();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var requestId = id;
            if(requestId!=null)
            {
                Requests request = await _context.Requests.FirstOrDefaultAsync(i => i.RequestId == id);
                if(request!=null)
                {
                    _context.Requests.Remove(request);
                    await _context.SaveChangesAsync();
                    return Ok(id);
                }
                return NotFound();
            }
            return NotFound();
        }
    }
}
