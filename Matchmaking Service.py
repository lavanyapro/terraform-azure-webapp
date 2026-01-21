players = []

def join_game(username, gender):
    players.append({"user": username, "gender": gender})
    if len(players) >= 6:
        return "Game Ready"
    return "Waiting for players"
