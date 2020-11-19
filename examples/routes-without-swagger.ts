import express, { Router, Request, Response } from 'express';

import swaggerUI from 'swagger-ui-express';
import { readFileSync } from 'fs';
import { getResponseExpress } from '..';
import options from './swagger-config';

const swaggerSpec = JSON.parse(readFileSync('./examples/swagger_from_scratch.json', { encoding: 'utf8' }));

const router = Router();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(getResponseExpress(app, options(__filename), './examples/swagger_from_scratch.json'));

router.get(
  '/animal/:man/dog',
  (req: Request, res: Response) => res.json({ man: req.params.man }),
);

router.get(
  '/:mouse/cat',
  (req: Request, res: Response) => res.send(req.params.mouse),
);

router.post(
  '/mouse/:id/man',
  (req: Request, res: Response) => res.json({ id: req.params.id, body: req.body }),
);

router.get('/man', (_req: Request, res: Response) => res.json([{ name: 'His name is Dave' }]));

router.get('/animal', (_req: Request, res: Response) => res.json([{ name: 'cat' }, { name: 'mouse' }, { name: 'dog' }]));

app.use('/api/v1', router);

app.use(
  '/api/docs',
  swaggerUI.serve,
  swaggerUI.setup(swaggerSpec, {}, {}),
);

if (process.env.NODE_ENV !== 'testing') {
  app.listen(3200, () => {
    // eslint-disable-next-line no-console
    console.info(`Express server started on port: ${3200}`);
  });
}

export default app;
