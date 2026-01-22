export const net = {
  connection: null,
  roomCode: null,
  state: null,
  onState: () => {},

  async connect() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl("/gamehub")
      .withAutomaticReconnect()
      .build();

    this.connection.on("RoomJoined", (snapshot) => {
      this.state = snapshot;
      this.onState(snapshot);
    });

    this.connection.on("State", (snapshot) => {
      this.state = snapshot;
      this.onState(snapshot);
    });

    await this.connection.start();
  },

  async joinRoom(req) {
    this.roomCode = req.roomCode;
    await this.connection.invoke("JoinRoom", req);
  },

  async sendInput(input) {
    if (!this.roomCode) return;
    await this.connection.invoke("Input", this.roomCode, input);
  },

  async throwBall() {
    if (!this.roomCode) return;
    await this.connection.invoke("ThrowBall", this.roomCode);
  },

  async stackStone() {
    if (!this.roomCode) return;
    await this.connection.invoke("StackStone", this.roomCode);
  }
};
