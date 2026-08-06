/**
 * A resource the backend does not (or no longer) know: a 404. Own type, because the
 * product detail page has to tell "gone" apart from "backend is unreachable" - the first
 * renders the 404 page, the second an error notice.
 */
export class NotFoundError extends Error {
  constructor(message = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

/**
 * The request clashes with the current state: a 409. In the shop that means a product went
 * out of stock ("vergriffen") between the page load and the click.
 */
export class ConflictError extends Error {
  constructor(message = 'Request conflicts with the current state') {
    super(message);
    this.name = 'ConflictError';
  }
}

/**
 * The token was rejected: the session expired while the tab was open. Callers use this to
 * fall back to the login prompt instead of showing a generic failure.
 */
export class UnauthorizedError extends Error {
  constructor(message = 'Not authenticated') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

/**
 * Authenticated, but the account lacks the required role: a 403. Distinct from
 * {@link UnauthorizedError} - re-login would not fix this, the admin area needs its own
 * "kein Zugriff" message instead of bouncing to the login form.
 */
export class ForbiddenError extends Error {
  constructor(message = 'Insufficient permissions') {
    super(message);
    this.name = 'ForbiddenError';
  }
}
