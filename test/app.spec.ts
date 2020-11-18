import request from 'supertest';
import { expect } from 'chai';
import appWithSwagger from '../examples/routes';
import appWithoutSwagger from '../examples/routes-without-swagger';

/**
 * DISCLAIMER: No animals were harmed in the making of these test
 */
describe('API route test', () => {
  const apps = [{ instance: appWithSwagger, suffix: 'withSwagger' }, { instance: appWithoutSwagger, suffix: 'withoutSwagger' }];
  const prefix = '/api/v1';

  for (const app of apps) {
    const appInstance = request(app.instance);

    it(`Get dogs that man owns - ${app.suffix}`, async () => {
      const manName = 'dave';
      const response = await appInstance.get(`${prefix}/animal/${manName}/dog`);
      expect(response.body).deep.equal({ man: manName });
    });

    it(`Put mouse in man's house - ${app.suffix}`, async () => {
      const mouse = 'jerry';
      const body = { state: 'fluffy' };
      const response = await appInstance.post(`${prefix}/mouse/${mouse}/man`).send(body);
      expect(response.body).deep.equal({ id: mouse, body });
    });

    it(`Get mouse under weird cat called tom - ${app.suffix}`, async () => {
      const mouse = 'jerry';
      const response = await appInstance.get(`${prefix}/${mouse}/cat`);
      expect(response.text).deep.equal(mouse);
    });

    it(`Get all men - ${app.suffix}`, async () => {
      const response = await appInstance.get(`${prefix}/man`);
      expect(response.body).deep.equal([{ name: 'His name is Dave' }]);
    });

    it(`Get all animals - ${app.suffix}`, async () => {
      const response = await appInstance.get(`${prefix}/animal`);
      expect(response.body).deep.equal([{ name: 'cat' }, { name: 'mouse' }, { name: 'dog' }]);
    });
  }
});
