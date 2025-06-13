
import { ZodType } from 'zod';
import request from 'supertest'; 
import { validatorMiddleware } from '../../src/middlewares/validatorMiddleware';
import { NextFunction, Response } from 'express';
import express from 'express';
import router from '../../src/serviceType/routes/serviceTypeRoutes'; 

jest.mock('../controllers/serviceTypeController'); // Mock the controller
jest.mock('../middleware/validatorMiddleware');
// Cast the mocked middleware
const mockedValidatorMiddleware = validatorMiddleware as unknown as jest.MockedFunction<
  (schema: ZodType<any, any, any>) => (req: Request, res: Response, next: NextFunction) => void
>;

it('should return a 400 for invalid request body', async () => {
    // Mock the validatorMiddleware to reject invalid input
    mockedValidatorMiddleware.mockImplementation((schema: any) => (req: Request, res: Response, next: NextFunction) => {
      res.status(400).json({ message: 'Invalid request body' });
    });

   let app: express.Express;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use(router); // Register your router
  });

  it('should return a 200 status and the expected response for valid input', async () => {
  const mockResponse = {
    serviceTypeListShort: [
      { id: 1, name: 'Test Service 1', description: 'Description 1' },
      { id: 2, name: 'Test Service 2', description: 'Description 2' },
    ],
    totalAmount: 2,
  };

  const validRequestBody = { searchText: 'Test' };
  const response = await request(app).post('/list/short').send(validRequestBody);
  expect(response.status).toBe(200);
  expect(response.body).toEqual(mockResponse);
});

  it('should return 400 for invalid request body', async () => {
    const invalidRequestBody = {}; // Invalid input
    const response = await request(app) 
      .post('/list/short')
      .send(invalidRequestBody);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Invalid request body' });
  });
  });