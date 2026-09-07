const WAITLIST_API_URL = import.meta.env.VITE_WAITLIST_API_URL;

export class WaitlistApiError extends Error {
  constructor(message, { status, isDuplicate = false } = {}) {
    super(message);
    this.name = 'WaitlistApiError';
    this.status = status;
    this.isDuplicate = isDuplicate;
  }
}

function extractMessage(body) {
  if (!body || typeof body !== 'object') return null;
  if (body.errors && typeof body.errors === 'object') {
    const first = Object.values(body.errors)[0];
    if (Array.isArray(first) && first[0]) return first[0];
  }
  return body.message || body.error || body.detail || null;
}

function friendlyMessage(message) {
  if (!message) return 'Something went wrong. Please try again.';
  if (/required/i.test(message)) return 'WhatsApp number is required.';
  if (/invalid|format/i.test(message)) return 'Please enter a valid WhatsApp number.';
  return message;
}

/**
 * Submits a WhatsApp number (national significant number, e.g. "9876543210")
 * to the waitlist API. Throws WaitlistApiError with a user-friendly message on failure.
 */
export async function submitToWaitlist(mobileNumber) {
  if (!WAITLIST_API_URL) {
    throw new WaitlistApiError('Something went wrong. Please try again.');
  }

  let response;
  try {
    response = await fetch(WAITLIST_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile_number: mobileNumber }),
    });
  } catch {
    throw new WaitlistApiError('Something went wrong. Please try again.');
  }

  let body = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    const message = extractMessage(body);
    throw new WaitlistApiError(friendlyMessage(message), { status: response.status });
  }

  if (body?.status === 'already_added') {
    throw new WaitlistApiError('This WhatsApp number is already on the waitlist.', {
      status: response.status,
      isDuplicate: true,
    });
  }

  return body;
}
