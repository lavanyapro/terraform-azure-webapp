namespace SevenStones.Server.Models;

public class JoinRequest
{
    public string RoomCode { get; set; } = "PUBLIC";
    public string Name { get; set; } = "Player";
    public string Avatar { get; set; } = "male_blue";
    public string Gender { get; set; } = "any";
}

public class PlayerInput
{
    public float Dx { get; set; }
    public float Dy { get; set; }
    public bool FaceLeft { get; set; }
}

public class PlayerState
{
    public string Id { get; set; } = "";
    public string Name { get; set; } = "";
    public string Team { get; set; } = "Blue";
    public string Avatar { get; set; } = "male_blue";
    public string Gender { get; set; } = "any";

    public float X { get; set; }
    public float Y { get; set; }
    public string Anim { get; set; } = "idle";
    public string Facing { get; set; } = "right";
}
