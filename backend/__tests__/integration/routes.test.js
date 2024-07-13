const { app } = require("../../server");
const request = require("supertest");

//create a user
let adminToken;
describe("User Routes", () => {
  let roomId;
  it("should register a new user", async () => {
    // Your implementation here
    const response = await request(app).post("/api/users/register").send({
      email: "john@example.com",
      name: "John Doe",
      password: "password123",
      phone: "0768472460",
      role: "admin",
    });

    console.log(response);
    expect(response.status).toBe(201);
  }, 10000);

  it("should login a user", async () => {
    // Your implementation here
    const response = await request(app).post("/api/users/login").send({
      email: "john@example.com",
      password: "password123",
    });

    //get the token
    adminToken = response.body.token;
    console.log(adminToken);

    expect(response.status).toBe(200);
  });

  it("should get a user", async () => {
    // Your implementation here

    const response = await request(app)
      .get("/api/users/getuser")
      .set("Authorization", adminToken);

    expect(response.status).toBe(200);
  });

  //Room create
  it("should create a room", async () => {
    // Your implementation here
    const response = await request(app)
      .post("/api/room")
      .set("Authorization", adminToken)
      .send({
        type: "Lecture Hall",
        location: "A503",
        capacity: 50,
      });

    roomId = response.body._id;

    console.log(response);
    expect(response.status).toBe(201);
  });

  //Room get
  it("should get all rooms", async () => {
    // Your implementation here
    const response = await request(app).get("/api/room");

    expect(response.status).toBe(200);
  });

  //Room get by id
  it("should get a room by id", async () => {
    // Your implementation here
    const response = await request(app).get(`/api/room/${roomId}`);

    expect(response.status).toBe(200);
  });

  //Room update
  it("should update a room", async () => {
    // Your implementation here
    const response = await request(app)
      .patch(`/api/room/${roomId}`)
      .set("Authorization", adminToken)
      .send({
        type: "Lecture Hall",
        location: "A503",
        capacity: 60,
      });

    console.log(response);
    expect(response.status).toBe(200);
  });

  //Room delete jerhjrjrkjwrhe hsdhsdghsjgdshj
  it("should delete a room", async () => {
    // Your implementation here
    const response = await request(app)
      .delete(`/api/room/${roomId}`)
      .set("Authorization", adminToken);

    console.log(response);
    expect(response.status).toBe(200);
  });
});
