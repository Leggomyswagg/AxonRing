import { createCommerceService } from '../server/commerce.js';
import { checkCheckoutRequest, publicError, reply } from '../server/http.js';

const service = createCommerceService();
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return reply(res, 405, { error: 'Method not allowed.' });
  }
  try {
    const { body, buyerIp } = checkCheckoutRequest(req);
    reply(res, 200, await service.checkout(body, buyerIp));
  } catch (error) { publicError(res, error); }
}
