/* eslint-disable prettier/prettier */
import request from 'supertest';

const BASE_URL = 'http://localhost:4000/api';

//! AUTH

describe('AuthController (e2e)', () => {

    describe('POST /auth/register', () => {
        it('should register a new user successfully', async () => {
            const newUser = {
                name: 'Test User',
                email: 'test@example.com',
                phone: '1234567890',
                password: 'Password#123',
                avatar: 'https://example.com/avatar.jpg',
                role: 'customer',
            };

            const response = await request(BASE_URL)
                .post('/auth/register')
                .send(newUser)
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body.email).toBe(newUser.email);
        });

        it('should return 400 for invalid data', async () => {
            const invalidUser = {
                email: 'invalidemail',
                password: 'short',
            };

            await request(BASE_URL)
                .post('/auth/register')
                .send(invalidUser)
                .expect(400);
        });
    });

    describe('POST /auth/login', () => {
        it('should login a user successfully', async () => {
            const loginData = {
                email: 'test@example.com',
                password: 'Password#123',
            };

            const response = await request(BASE_URL)
                .post('/auth/login')
                .send(loginData)
                .expect(201);

            expect(response.body).toHaveProperty('accessToken');
            expect(response.body).toHaveProperty('refreshToken');
        });

        it('should return 401 for invalid credentials', async () => {
            const loginData = {
                email: 'test@example.com',
                password: 'WrongPassword',
            };

            await request(BASE_URL)
                .post('/auth/login')
                .send(loginData)
                .expect(401);
        });
    });

    describe('GET /auth/verify/:verificationToken', () => {
        it('should verify user with a valid token', async () => {
            const token = 'valid-token'; // Замените на реальный токен
            await request(BASE_URL)
                .get(`/auth/verify/${token}`)
                .expect(200);
        });

        it('should return 404 for invalid token', async () => {
            const token = 'invalid-token';
            await request(BASE_URL)
                .get(`/auth/verify/${token}`)
                .expect(404);
        });
    });

    describe('GET /auth/google', () => {
        it('should redirect to Google authentication page', async () => {
            const response = await request(BASE_URL)
                .get('/auth/google')
                .expect(200);

            expect(response.text).toContain('Google');
        });
    });

    describe('GET /auth/google/redirect', () => {
        it('should handle Google authentication redirect', async () => {
            const response = await request(BASE_URL)
                .get('/auth/google/redirect')
                .expect(200);

            expect(response.text).toContain('Google');
        });
    });

    describe('POST /auth/send/verify', () => {
        it('should send verification code to the email', async () => {
            const payload = { email: 'test@example.com' };

            const response = await request(BASE_URL)
                .post('/auth/send/verify')
                .send(payload)
                .expect(201);

            expect(response.body).toHaveProperty('message');
        });

        it('should return 400 for invalid email', async () => {
            const payload = { email: 'invalidemail' };

            await request(BASE_URL)
                .post('/auth/send/verify')
                .send(payload)
                .expect(400);
        });
    });

    describe('POST /auth/verify', () => {
        it('should verify the code and authenticate user', async () => {
            const payload = {
                email: 'test@example.com',
                password: 'Password#123',
                code: 123456,
            };

            const response = await request(BASE_URL)
                .post('/auth/verify')
                .send(payload)
                .expect(201);

            expect(response.body).toHaveProperty('accessToken');
            expect(response.body).toHaveProperty('refreshToken');
        });

        it('should return 400 for invalid code', async () => {
            const payload = {
                email: 'test@example.com',
                password: 'Password#123',
                code: 999999,
            };

            await request(BASE_URL)
                .post('/auth/verify')
                .send(payload)
                .expect(400);
        });
    });

    describe('GET /auth/refresh/current', () => {
        it('should refresh access token', async () => {
            const response = await request(BASE_URL)
                .get('/auth/refresh/current')
                .set('Authorization', 'Bearer valid-refresh-token') // Укажите реальный токен
                .expect(200);

            expect(response.body).toHaveProperty('accessToken');
        });

        it('should return 401 for missing or invalid token', async () => {
            await request(BASE_URL)
                .get('/auth/refresh/current')
                .expect(401);
        });
    });

    describe('POST /auth/logout', () => {
        it('should logout the user', async () => {
            const response = await request(BASE_URL)
                .post('/auth/logout')
                .set('Authorization', 'Bearer valid-access-token') // Укажите реальный токен
                .expect(201);

            expect(response.body).toHaveProperty('message');
        });

        it('should return 401 for unauthorized request', async () => {
            await request(BASE_URL)
                .post('/auth/logout')
                .expect(401);
        });
    });
});

//! PROJECTS

describe('ProjectsController (e2e)', () => {
    describe('GET /projects', () => {
        it('should return a paginated list of projects', async () => {
            const page = 1;
            const limit = 10;

            const response = await request(BASE_URL)
                .get('/projects')
                .query({ page, limit })
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
        });

        it('should return 400 for missing query parameters', async () => {
            await request(BASE_URL)
                .get('/projects')
                .expect(400);
        });
    });

    describe('POST /projects', () => {
        it('should create a new project successfully', async () => {
            const newProject = {
                title: 'New Project',
                description: 'This is a new project',
            };

            const response = await request(BASE_URL)
                .post('/projects')
                .send(newProject)
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body.title).toBe(newProject.title);
        });

        it('should return 400 for invalid data', async () => {
            const invalidProject = { title: '' };

            await request(BASE_URL)
                .post('/projects')
                .send(invalidProject)
                .expect(400);
        });
    });

    describe('GET /projects/:projectId', () => {
        it('should return a project by ID', async () => {
            const projectId = 'valid-id'; // нужен реальный ID

            const response = await request(BASE_URL)
                .get(`/projects/${projectId}`)
                .expect(200);

            expect(response.body).toHaveProperty('id', projectId);
        });

        it('should return 404 for an invalid project ID', async () => {
            const projectId = 'invalid-id';

            await request(BASE_URL)
                .get(`/projects/${projectId}`)
                .expect(404);
        });
    });

    describe('PUT /projects/:projectId', () => {
        it('should update a project successfully', async () => {
            const projectId = 'valid-id'; // нужен реальный ID
            const updatedProject = {
                title: 'Updated Project Title',
                description: 'Updated project description',
            };

            const response = await request(BASE_URL)
                .put(`/projects/${projectId}`)
                .send(updatedProject)
                .expect(200);

            expect(response.body).toHaveProperty('title', updatedProject.title);
        });

        it('should return 404 for an invalid project ID', async () => {
            const projectId = 'invalid-id';
            const updatedProject = {
                title: 'Updated Project Title',
                description: 'Updated project description',
            };

            await request(BASE_URL)
                .put(`/projects/${projectId}`)
                .send(updatedProject)
                .expect(404);
        });

        it('should return 400 for invalid data', async () => {
            const projectId = 'valid-id'; // нужен реальный ID
            const invalidProject = { title: '' };

            await request(BASE_URL)
                .put(`/projects/${projectId}`)
                .send(invalidProject)
                .expect(400);
        });
    });

    describe('DELETE /projects/:projectId', () => {
        it('should delete a project successfully', async () => {
            const projectId = 'valid-id'; // нужен реальный ID

            await request(BASE_URL)
                .delete(`/projects/${projectId}`)
                .expect(200);
        });

        it('should return 404 for an invalid project ID', async () => {
            const projectId = 'invalid-id';

            await request(BASE_URL)
                .delete(`/projects/${projectId}`)
                .expect(404);
        });
    });
});

//! UNITS

describe('UnitsController (e2e)', () => {
    describe('GET /units', () => {
        it('should return a list of units', async () => {
            const response = await request(BASE_URL)
                .get('/units')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
        });
    });

    describe('POST /units', () => {
        it('should create a new unit successfully', async () => {
            const newUnit = {
                title: 'New Unit',
            };

            const response = await request(BASE_URL)
                .post('/units')
                .send(newUnit)
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body.title).toBe(newUnit.title);
        });

        it('should return 400 for invalid data', async () => {
            const invalidUnit = { title: '' };

            await request(BASE_URL)
                .post('/units')
                .send(invalidUnit)
                .expect(400);
        });
    });

    describe('DELETE /units/:unitId', () => {
        it('should delete a unit successfully', async () => {
            const unitId = 'valid-id'; // нужен реальный ID

            await request(BASE_URL)
                .delete(`/units/${unitId}`)
                .expect(200);
        });

        it('should return 404 for an invalid unit ID', async () => {
            const unitId = 'invalid-id';

            await request(BASE_URL)
                .delete(`/units/${unitId}`)
                .expect(404);
        });
    });
});

//! PRICES

describe('PricesController (e2e)', () => {

    describe('GET /prices', () => {
        it('should return a list of prices', async () => {
            const response = await request(BASE_URL)
                .get('/prices')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
        });
    });

    describe('POST /prices', () => {
        it('should create a new price successfully', async () => {
            const newPrice = {
                title: "test price",
                price: 10,
                updateAllow: true
            };

            const response = await request(BASE_URL)
                .post('/prices')
                .send(newPrice)
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body.title).toBe(newPrice.title);
        });

        it('should return 400 for invalid data', async () => {
            const invalidPrice = { title: '' };

            await request(BASE_URL)
                .post('/prices')
                .send(invalidPrice)
                .expect(400);
        });
    });

    describe('PUT /prices/:priceId', () => {
        it('should update a price successfully', async () => {
            const priceId = 'valid-id'; // нужен реальный ID
            const updatedPrice = {
                title: 'Updated Price Title',
                price: 20,
                updateAllow: true
            };

            const response = await request(BASE_URL)
                .put(`/prices/${priceId}`)
                .send(updatedPrice)
                .expect(200);

            expect(response.body).toHaveProperty('title', updatedPrice.title);
        });

        it('should return 404 for an invalid price ID', async () => {
            const priceId = 'invalid-id';
            const updatedPrice = {
                title: 'Updated Price Title',
                price: 20,
                updateAllow: true
            };

            await request(BASE_URL)
                .put(`/prices/${priceId}`)
                .send(updatedPrice)
                .expect(404);
        });

        it('should return 400 for invalid data', async () => {
            const priceId = 'valid-id'; // нужен реальный ID
            const invalidPrice = { title: '' };

            await request(BASE_URL)
                .put(`/prices/${priceId}`)
                .send(invalidPrice)
                .expect(400);
        });
    });

    describe('DELETE /prices/:priceId', () => {
        it('should delete a price successfully', async () => {
            const priceId = 'valid-id'; // нужен реальный ID

            await request(BASE_URL)
                .delete(`/prices/${priceId}`)
                .expect(200);
        });

        it('should return 404 for an invalid price ID', async () => {
            const priceId = 'invalid-id';

            await request(BASE_URL)
                .delete(`/prices/${priceId}`)
                .expect(404);
        });
    });

});