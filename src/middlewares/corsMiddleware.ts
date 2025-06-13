import cors from 'cors';
import { HttpStatusCode } from 'axios';
import config from 'config';

const corsOptions = {
  origin: config.get<Array<string>>('cors.origins'),
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: HttpStatusCode.NoContent,
};

export default cors(corsOptions);
