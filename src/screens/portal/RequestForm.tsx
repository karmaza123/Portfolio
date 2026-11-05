import { useRef, useState, type FormEvent } from "react";
import { ApiError, ATTACHMENT_TYPES, MAX_ATTACHMENT_BYTES, portalApi } from "../../portal/api";
import { formLockReason } from "../../portal/quota";
import type { PortalClient } from "../../portal/types";

type RequestFormProps = {
  client: PortalClient;
  /** Called after a successful submit so the dashboard can reload quota and history. */
  onSubmitted: () => Promise<void>;
};

/** 3 of 4: send a change request — title, description, page URL, optional file. */
export function RequestForm({ client, onSubmitted }: RequestFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pageUrl, setPageUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const lock = formLockReason(client);

  function pickFile(next: File | null) {
    setError(null);
    if (next && !ATTACHMENT_TYPES.includes(next.type)) {
      setError("Attach a PNG, JPG, WebP, GIF or PDF.");
      if (fileInput.current) fileInput.current.value = "";
      return;
    }
    if (next && next.size > MAX_ATTACHMENT_BYTES) {
      setError("Files can be up to 10 MB.");
      if (fileInput.current) fileInput.current.value = "";
      return;
    }
    setFile(next);
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (busy || lock) return;
    setBusy(true);
    setError(null);
    setSent(false);
    try {
      const attachmentPath = file ? await portalApi.uploadAttachment(file) : null;
      await portalApi.submitRequest({ title, description, pageUrl, attachmentPath });
      setTitle("");
      setDescription("");
      setPageUrl("");
      setFile(null);
      if (fileInput.current) fileInput.current.value = "";
      setSent(true);
      await onSubmitted();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        window.location.assign("/portal/login");
        return;
      }
      setError(err instanceof ApiError ? err.message : "Couldn't send your request. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="pt-card" aria-labelledby="pt-request-title">
      <div className="pt-card-head">
        <h2 id="pt-request-title" className="pt-card-title">
          Request a change
        </h2>
      </div>

      {lock ? (
        <p id="pt-lock" className="pt-lock">
          {lock}
        </p>
      ) : null}

      <form className="pt-form" onSubmit={onSubmit} aria-describedby={lock ? "pt-lock" : undefined}>
        <fieldset className="pt-fieldset" disabled={Boolean(lock) || busy}>
          <label className="pt-field">
            <span>Title</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
              placeholder="Update opening hours"
              required
            />
          </label>

          <label className="pt-field">
            <span>What should change?</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={5000}
              rows={5}
              placeholder="Replace the text with… Swap the photo for… Add a button that…"
              required
            />
          </label>

          <label className="pt-field">
            <span>
              Page <em>(optional)</em>
            </span>
            <input
              type="text"
              value={pageUrl}
              onChange={(e) => setPageUrl(e.target.value)}
              maxLength={500}
              placeholder={`https://${client.domainName}/pricing`}
              inputMode="url"
              autoCapitalize="none"
              spellCheck={false}
            />
          </label>

          <label className="pt-field">
            <span>
              Image or file <em>(optional · up to 10 MB)</em>
            </span>
            <input
              ref={fileInput}
              type="file"
              accept={ATTACHMENT_TYPES.join(",")}
              onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
            />
          </label>
        </fieldset>

        <div role="alert" aria-live="polite" className="pt-error-slot">
          {error ? <p className="pt-error">{error}</p> : null}
          {sent && !error ? <p className="pt-success">Request sent — it's in your history below.</p> : null}
        </div>

        <button
          type="submit"
          className="pt-btn pt-btn--primary"
          disabled={Boolean(lock) || busy || !title.trim() || !description.trim()}
        >
          {busy ? (file ? "Uploading and sending…" : "Sending…") : "Send request"}
        </button>
      </form>
    </section>
  );
}
