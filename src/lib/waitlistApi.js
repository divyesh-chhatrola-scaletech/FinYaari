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

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Free-tier hosts like Render spin down the API after inactivity, so the first
 * request after a while can 502/timeout as it wakes up. Firing this as soon as
 * the modal opens gives it a head start before the user actually hits Submit.
 * Failures are ignored on purpose — this is best-effort only.
 */
export function warmUpWaitlistApi() {
  if (!WAITLIST_API_URL) return;
  fetch(WAITLIST_API_URL, { method: 'OPTIONS' }).catch(() => {});
}

async function postWaitlist(mobileNumber) {
  return fetch(WAITLIST_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobile_number: mobileNumber }),
  });
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
    response = await postWaitlist(mobileNumber);
  } catch {
    // Likely a cold-start connection drop on a sleeping free-tier host — retry once.
    try {
      await sleep(2500);
      response = await postWaitlist(mobileNumber);
    } catch (err) {
      console.error('Waitlist submission failed:', err);
      throw new WaitlistApiError('Something went wrong. Please try again.');
    }
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
