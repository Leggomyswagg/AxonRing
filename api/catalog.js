import { createCommerceService } from '../server/commerce.js';
import { publicError, reply } from '../server/http.js';

const service = createCommerceService();
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return reply(res, 405, { error: 'Method not allowed.' });
  }
  try { reply(res, 200, await service.catalog()); }
  catch (error) { publicError(res, error); }
}
