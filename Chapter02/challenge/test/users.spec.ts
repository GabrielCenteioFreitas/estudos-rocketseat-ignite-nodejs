import { beforeAll, afterAll, describe, it, beforeEach } from "vitest"
import request from "supertest"
import { app } from "../src/app"
import { execSync } from "node:child_process"

describe('Users routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex -- migrate:rollback --all')
    execSync('npm run knex -- migrate:latest')
  })

  it('should be able to create a user', async () => {
    await request(app.server)
      .post('/auth')
      .send({
        name: 'John Doe',
        email: 'johndoe@example.com',
      })
      .expect(201)
  })
})