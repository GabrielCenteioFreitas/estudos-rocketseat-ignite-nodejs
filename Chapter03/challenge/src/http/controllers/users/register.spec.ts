import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest"

describe('Register an User (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to register an user', async () => {
    const response = await request(app.server)
      .post('/users')
      .send({
        "name": "User",
        "email": "user@example.com",
        "password": "123456",
      })

    expect(response.statusCode).toEqual(201)
  })
})