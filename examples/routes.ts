import express, { Router, Request, Response } from 'express';

import swaggerUI from 'swagger-ui-express';
import { readFileSync } from 'fs';
import { getResponseExpress } from '..';
import options from './swagger-config';

const swaggerSpec = JSON.parse(readFileSync('./examples/swagger.json', { encoding: 'utf8' }));

const router = Router();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(getResponseExpress(app, options(__filename), './examples/swagger.json'));

/**
 * @swagger
 * /animal/{man}/dog:
 *   get:
 *     name: dog
 *     description: Endpoint for dog under a particular man
 *     tags:
 *       - Dog
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/dog'
 *       401:
 *         description: Token not provided
 *       500:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/dogError500'
 *     parameters:
 *     - name: man
 *       in: path
 *       defaultTemplate: $man[0].id
 *       required: true
 */
router.get(
  '/animal/:man/dog',
  (req: Request, res: Response) => res.json({ man: req.params.man }),
);

/**
 * @swagger
 * /{mouse}/cat:
 *   get:
 *     name: cat
 *     summary: Get mouse
 *     tags:
 *       - mouse
 *     responses:
 *       200:
 *         description: mouse retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/mouseResp'
 *       401:
 *         description: Token not provided
 *     parameters:
 *     - name: mouse
 *       in: path
 *       description: ID
 *       defaultTemplate: $mouse.id
 *       required: true
 */
router.get(
  '/:mouse/cat',
  (req: Request, res: Response) => res.send(req.params.mouse),
);

/**
 * @swagger
 * /mouse/{id}/man:
 *   post:
 *     name: mouse
 *     summary: Create mouse
 *     description: Creates a mouse under a man's house, rhymes with the times dudes
 *     tags:
 *       - mouse
 *     requestBody:
 *       description: Details to authenticate
 *       required: true
 *       content:
 *         "application/json":
 *            schema:
 *              $ref: "#/definitions/createmouse"
 *     parameters:
 *     - name: id
 *       in: path
 *       description: man ID
 *       required: true
 *       defaultTemplate: $man[0].id
 *       schema:
 *         $ref: "#/definitions/pathID"
 */
router.post(
  '/mouse/:id/man',
  (req: Request, res: Response) => res.json({ id: req.params.id, body: req.body }),
);

/**
 * @swagger
 * /man:
 *   get:
 *     name: man
 *     description: For all men shall find their path in life
 *     tags:
 *       - man
 *     produces: application/json
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/manResponds'
 *       401:
 *         description: Token not provided
 */
router.get('/man', (_req: Request, res: Response) => res.json([{ name: 'His name is Dave' }]));

/**
 * @swagger
 * /animal:
 *   get:
 *     name: animals
 *     summary: Get animals
 *     tags:
 *       - Animals
 *     responses:
 *       200:
 *         description: Animals retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/animalSpeaks'
 *       400:
 *         description: Missing parameter in request body
 *       401:
 *         description: Token not provided
 */
router.get('/animal', (_req: Request, res: Response) => res.json([{ name: 'cat' }, { name: 'mouse' }, { name: 'dog' }]));

app.use('/api/v1', router);

app.use(
  '/api/docs',
  swaggerUI.serve,
  swaggerUI.setup(swaggerSpec, {}, {}),
);

if (process.env.NODE_ENV !== 'testing') {
  app.listen(3200, () => {
    console.info(`Express server started on port: ${3200}`);
  });
}

export default app;
