namespace SevenStones.Server.Game;

public class RoomManager
{
    private readonly Dictionary<string, GameRoom> _rooms = new();
    private readonly Dictionary<string, string> _playerRoom = new(); // connId -> room

    public GameRoom Join(string code, string connId, string name, string avatar, string gender)
    {
        code = (code ?? "PUBLIC").Trim().ToUpperInvariant();
        if (!_rooms.TryGetValue(code, out var room))
        {
            room = new GameRoom(code);
            _rooms[code] = room;
        }

        room.AddPlayer(connId, name, avatar, gender);
        _playerRoom[connId] = code;
        return room;
    }

    public GameRoom? Get(string code)
        => _rooms.TryGetValue((code ?? "").Trim().ToUpperInvariant(), out var r) ? r : null;

    public void LeaveAll(string connId)
    {
        if (!_playerRoom.TryGetValue(connId, out var code)) return;
        if (_rooms.TryGetValue(code, out var room))
        {
            room.RemovePlayer(connId);
        }
        _playerRoom.Remove(connId);
    }
}
