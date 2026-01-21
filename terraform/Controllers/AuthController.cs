[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    [HttpPost("login")]
    public IActionResult Login(UserLogin request)
    {
        if (request.Username.Length > 3)
        {
            return Ok(new { token = "dummy-jwt-token" });
        }
        return Unauthorized();
    }
}
