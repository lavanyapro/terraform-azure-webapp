using SevenStones.Server.Models;

namespace SevenStones.Server.Game;

public class GameRoom
{
    public string Code { get; }
    private readonly Dictionary<string, PlayerState> _players = new();

    public int StonesRemaining { get; private set; } = 7;
    public string TurnTeam { get; private set; } = "Blue"; // Blue/Red
    public string Phase { get; private set; } = "Attack";  // Attack/Defend/Stack
    public int BlueScore { get; private set; } = 0;
    public int RedScore { get; private set; } = 0;

    public GameRoom(string code) => Code = code;

    public void AddPlayer(string connId, string name, string avatar, string gender)
    {
        var team = _players.Count(p => p.Value.Team == "Blue") <= _players.Count(p => p.Value.Team == "Red")
            ? "Blue" : "Red";

        _players[connId] = new PlayerState
        {
            Id = connId,
            Name = name,
            Avatar = avatar,
            Gender = gender,
            Team = team,
            X = team == "Blue" ? 200 : 900,
            Y = team == "Blue" ? 450 : 450,
            Anim = "idle"
        };
    }

    public void RemovePlayer(string connId) => _players.Remove(connId);

    public object GetSnapshot() => new
    {
        code = Code,
        stonesRemaining = StonesRemaining,
        turnTeam = TurnTeam,
        phase = Phase,
        blueScore = BlueScore,
        redScore = RedScore,
        players = _players.Values.ToArray()
    };

    public object GetPlayersSnapshot() => _players.Values.Select(p => new
    {
        p.Id, p.Name, p.Team, p.Avatar, p.Gender
    });

    public void ApplyInput(string connId, PlayerInput input)
    {
        if (!_players.TryGetValue(connId, out var p)) return;

        // Basic authoritative movement
        var speed = 6f;
        p.X += input.Dx * speed;
        p.Y += input.Dy * speed;

        // clamp inside court bounds
        p.X = Math.Clamp(p.X, 80, 1120);
        p.Y = Math.Clamp(p.Y, 120, 620);

        // animation
        p.Anim = (Math.Abs(input.Dx) + Math.Abs(input.Dy)) > 0 ? "run" : "idle";
        if (input.FaceLeft) p.Facing = "left"; else p.Facing = "right";
    }

    public bool TryThrow(string connId)
    {
        if (!_players.TryGetValue(connId, out var p)) return false;
        if (p.Team != TurnTeam) return false;
        if (Phase != "Attack") return false;

        // throw action affects stones
        p.Anim = "throw";

        StonesRemaining--;
        if (StonesRemaining <= 0)
        {
            // Stones knocked down -> switch phase to Stack (defenders try to rebuild)
            Phase = "Stack";
            StonesRemaining = 0;
        }
        else
        {
            // next team turn
            TurnTeam = TurnTeam == "Blue" ? "Red" : "Blue";
        }

        return true;
    }

    public bool TryStack(string connId)
    {
        if (Phase != "Stack") return false;
        if (!_players.TryGetValue(connId, out var p)) return false;

        // Only defending team can stack: opposite of who attacked last
        // simplified rule: any team can stack here, but you can restrict easily
        p.Anim = "stack";

        StonesRemaining++;
        if (StonesRemaining >= 7)
        {
            // defenders rebuilt -> defenders get a point
            if (TurnTeam == "Blue") RedScore++; else BlueScore++;

            // reset for next round
            StonesRemaining = 7;
            Phase = "Attack";
            TurnTeam = TurnTeam == "Blue" ? "Red" : "Blue";
        }
        return true;
    }
}
