import type { Cart, CartAdapter } from '../contracts';
import { ConflictError, NotFoundError, UnauthorizedError } from '../errors';

interface CartResponseDto {
  items: {
    productId: number;
    name: string;
    slug: string;
    imageUrl: string | null;
    unitPrice: number;
    quantity: number;
    availableStock: number;
    lineTotal: number;
  }[];
  itemCount: number;
  total: number;
}

/**
 * Every cart call returns the complete cart, so the frontend never has to merge state
 * itself - the server's answer replaces what was on screen.
 */
async function request(
  token: string,
  path: string,
  init: { method: string; body?: unknown } = { method: 'GET' },
): Promise<Response> {
  const res = await fetch(`/api/cart${path}`, {
    method: init.method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(init.body === undefined ? {} : { 'Content-Type': 'application/json' }),
    },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });

  if (res.status === 401) {
    throw new UnauthorizedError('Cart request rejected - token expired or missing');
  }
  // the backend answers 404 both for an unknown product and for a line that is not in the cart
  if (res.status === 404) {
    throw new NotFoundError('Product not available');
  }
  // 409: the product is sold out ("vergriffen")
  if (res.status === 409) {
    throw new ConflictError('Product is out of stock');
  }
  if (!res.ok) {
    throw new Error(`Cart request failed with status ${res.status}`);
  }

  return res;
}

async function cartFrom(res: Response): Promise<Cart> {
  const dto: CartResponseDto = await res.json();
  return {
    items: dto.items.map((line) => ({ ...line })),
    itemCount: dto.itemCount,
    total: dto.total,
  };
}

export const springCartAdapter: CartAdapter = {
  getCart: async (token) => cartFrom(await request(token, '')),

  addItem: async (token, productId, quantity) =>
    cartFrom(await request(token, '/items', { method: 'POST', body: { productId, quantity } })),

  setQuantity: async (token, productId, quantity) =>
    cartFrom(await request(token, `/items/${productId}`, { method: 'PUT', body: { quantity } })),

  removeItem: async (token, productId) =>
    cartFrom(await request(token, `/items/${productId}`, { method: 'DELETE' })),

  clear: async (token) => {
    await request(token, '', { method: 'DELETE' });
  },
};
