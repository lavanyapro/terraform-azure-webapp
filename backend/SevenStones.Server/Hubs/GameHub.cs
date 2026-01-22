using Microsoft.AspNetCore.SignalR;
using SevenStones.Server.Models;
using SevenStones.Server.Game;

namespace SevenStones.Server.Hubs;

public class GameHub : Hub
{
    private static readonly RoomManager Rooms = new();

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        Rooms.LeaveAll(Context.ConnectionId);
        await base.OnDisconnectedAsync(exception);
    }

    public async Task JoinRoom(JoinRequest req)
    {
        var room = Rooms.Join(req.RoomCode, Context.ConnectionId, req.Name, req.Avatar, req.Gender);

        await Groups.AddToGroupAsync(Context.ConnectionId, room.Code);

        // Send current state to the new player
        await Clients.Caller.SendAsync("RoomJoined", room.GetSnapshot());

        // Notify others
        await Clients.Group(room.Code).SendAsync("PlayerList", room.GetPlayersSnapshot());
    }

    public async Task Input(string roomCode, PlayerInput input)
    {
        var room = Rooms.Get(roomCode);
        if (room == null) return;

        // Authoritative step
        room.ApplyInput(Context.ConnectionId, input);

        // Broadcast authoritative snapshot to everyone
        await Clients.Group(room.Code).SendAsync("State", room.GetSnapshot());
    }

    public async Task ThrowBall(string roomCode)
    {
        var room = Rooms.Get(roomCode);
        if (room == null) return;

        var ok = room.TryThrow(Context.ConnectionId);
        if (!ok) return;

        await Clients.Group(room.Code).SendAsync("State", room.GetSnapshot());
    }

    public async Task StackStone(string roomCode)
    {
        var room = Rooms.Get(roomCode);
        if (room == null) return;

        var ok = room.TryStack(Context.ConnectionId);
        if (!ok) return;

        await Clients.Group(room.Code).SendAsync("State", room.GetSnapshot());
    }
}
