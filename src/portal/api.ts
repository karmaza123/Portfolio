import type { AdminOverview, ApiErrorCode, NewRequestInput, PortalMe, RequestStatus, UploadTicket } from "./types";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: ApiErrorCode,
  ) {
    super(message);
  }
}

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, {
      credentials: "same-origin",
      ...init,
      headers: { "Content-Type": "application/json", ...init.headers },
    });
  } catch {
    throw new ApiError("Can't reach the server. Check your connection and try again.", 0);
  }

  const data = (await res.json().catch(() => null)) as { error?: string; code?: ApiErrorCode } | null;
  if (!res.ok) throw new ApiError(data?.error ?? "Something went wrong. Try again.", res.status, data?.code);
  // A 200 that isn't JSON means the request hit the SPA fallback, i.e. the API isn't running
  // (plain `vite dev`). Surface that instead of handing `null` to the UI.
  if (data === null) throw new ApiError("The portal server isn't reachable. Run the site with `vercel dev`.", res.status);
  return data as T;
}

const post = <T>(path: string, body?: unknown) =>
  call<T>(path, { method: "POST", body: body === undefined ? undefined : JSON.stringify(body) });

export const adminApi = {
  login: (password: string) => post<{ ok: true }>("/api/admin/login", { password }),
  logout: () => post<{ ok: true }>("/api/admin/logout"),
  overview: () => call<AdminOverview>("/api/admin/overview"),
  setStatus: (id: string, status: RequestStatus) => post<{ request: unknown }>("/api/admin/request-status", { id, status }),
};

export const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;
export const ATTACHMENT_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif", "application/pdf"];

export const portalApi = {
  login: (domain: string, password: string) => post<{ ok: true }>("/api/portal/login", { domain, password }),
  logout: () => post<{ ok: true }>("/api/portal/logout"),
  me: () => call<PortalMe>("/api/portal/me"),
  openBilling: () => post<{ url: string }>("/api/portal/billing"),
  submitRequest: (input: NewRequestInput) => post<{ request: unknown }>("/api/portal/requests", input),

  /** Uploads straight to Supabase Storage with a one-shot signed URL; resolves to the storage path. */
  async uploadAttachment(file: File): Promise<string> {
    const ticket = await post<UploadTicket>("/api/portal/upload-url", {
      filename: file.name,
      contentType: file.type,
      size: file.size,
    });

    // Same multipart shape supabase-js uses for uploadToSignedUrl().
    const form = new FormData();
    form.append("cacheControl", "3600");
    form.append("", file);

    let res: Response;
    try {
      res = await fetch(ticket.signedUrl, { method: "PUT", body: form });
    } catch {
      throw new ApiError("The upload didn't go through. Try again.", 0);
    }
    if (!res.ok) throw new ApiError("The upload didn't go through. Try again.", res.status);
    return ticket.path;
  },
};
