"use client";

import { useState } from "react";
import type { Visibility } from "@/generated/prisma/client";

type Props = {
  username: string;
  displayName: string | null;
  email: string | null;
  profileVisibility: Visibility;
  progressVisibility: Visibility;
};

export default function SettingsClient(props: Props) {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-gray-100">Settings</h1>
      <ProfilePanel
        username={props.username}
        displayName={props.displayName}
        email={props.email}
      />
      <PasswordPanel />
      <PrivacyPanel
        progressVisibility={props.progressVisibility}
      />
      <DataBackupPanel />
    </div>
  );
}

/* ─── Profile ─────────────────────────────────────────────────────────────── */

function ProfilePanel({
  username,
  displayName: initialDisplayName,
  email: initialEmail,
}: {
  username: string;
  displayName: string | null;
  email: string | null;
}) {
  const [displayName, setDisplayName] = useState(initialDisplayName ?? "");
  const [email, setEmail] = useState(initialEmail ?? "");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  async function save() {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch("/api/settings/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      setStatus({ ok: true, msg: "Saved!" });
    } catch (e) {
      setStatus({ ok: false, msg: e instanceof Error ? e.message : "Something went wrong" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Panel title="Profile">
      <Field label="Username">
        <div className="px-3 py-2 rounded border border-gray-800 bg-gray-950 text-gray-500 text-sm">
          {username}
          <span className="ml-2 text-xs text-gray-700">(cannot be changed)</span>
        </div>
      </Field>

      <Field label="Display name">
        <input
          className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-gray-100 text-sm focus:outline-none focus:border-amber-600"
          placeholder="Leave blank to use your username"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          maxLength={40}
        />
        <p className="text-xs text-gray-600 mt-1">Shown on your profile and in friend lists. Max 40 characters.</p>
      </Field>

      <Field label="Email">
        <input
          type="email"
          className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-gray-100 text-sm focus:outline-none focus:border-amber-600"
          placeholder="Optional"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <p className="text-xs text-gray-600 mt-1">
          Optional, not shown publicly. Password reset is not built yet but your email will be used for it when it is.
        </p>
      </Field>

      <SaveRow saving={saving} status={status} onSave={save} />
    </Panel>
  );
}

/* ─── Password ────────────────────────────────────────────────────────────── */

function PasswordPanel() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  async function save() {
    setStatus(null);
    if (next !== confirm) {
      setStatus({ ok: false, msg: "New passwords don't match" });
      return;
    }
    if (next.length < 8) {
      setStatus({ ok: false, msg: "New password must be at least 8 characters" });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/settings/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      setStatus({ ok: true, msg: "Password updated!" });
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch (e) {
      setStatus({ ok: false, msg: e instanceof Error ? e.message : "Something went wrong" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Panel title="Change password">
      <Field label="Current password">
        <input
          type="password"
          className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-gray-100 text-sm focus:outline-none focus:border-amber-600"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          autoComplete="current-password"
        />
      </Field>

      <Field label="New password">
        <input
          type="password"
          className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-gray-100 text-sm focus:outline-none focus:border-amber-600"
          value={next}
          onChange={(e) => setNext(e.target.value)}
          autoComplete="new-password"
        />
      </Field>

      <Field label="Confirm new password">
        <input
          type="password"
          className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-gray-100 text-sm focus:outline-none focus:border-amber-600"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          autoComplete="new-password"
        />
      </Field>

      <SaveRow saving={saving} status={status} onSave={save} saveLabel="Update password" />
    </Panel>
  );
}

/* ─── Privacy ─────────────────────────────────────────────────────────────── */

function PrivacyPanel({
  progressVisibility: initialProgress,
}: {
  progressVisibility: Visibility;
}) {
  const clamp = (v: Visibility): Visibility => (v === "PUBLIC" ? "FRIENDS" : v);
  const [progressVis, setProgressVis] = useState<Visibility>(clamp(initialProgress));
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  async function save() {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch("/api/settings/privacy", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progressVisibility: progressVis }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      setStatus({ ok: true, msg: "Saved!" });
    } catch (e) {
      setStatus({ ok: false, msg: e instanceof Error ? e.message : "Something went wrong" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Panel title="Privacy">
      <Field label="Progress visibility">
        <select
          className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-gray-100 text-sm focus:outline-none focus:border-amber-600"
          value={progressVis}
          onChange={(e) => setProgressVis(e.target.value as Visibility)}
        >
          <option value="FRIENDS">Friends only - only accepted friends can see it</option>
          <option value="PRIVATE">Private - only you can see it</option>
        </select>
        <p className="text-xs text-gray-600 mt-1">
          Controls who can see your story, legend, and medal progress. Profile access always requires being friends first anyway.
        </p>
      </Field>

      <SaveRow saving={saving} status={status} onSave={save} />
    </Panel>
  );
}

/* ─── Data Backup ─────────────────────────────────────────────────────────── */

function DataBackupPanel() {
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [confirmImport, setConfirmImport] = useState<{ file: File; summary: string } | null>(null);

  async function handleExport() {
    setExporting(true);
    setStatus(null);
    try {
      const res = await fetch("/api/export");
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const disposition = res.headers.get("Content-Disposition") ?? "";
      const match = disposition.match(/filename="(.+?)"/);
      const filename = match?.[1] ?? "battlecats-progress.json";
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      setStatus({ ok: true, msg: "Export downloaded!" });
    } catch (e) {
      setStatus({ ok: false, msg: e instanceof Error ? e.message : "Export failed" });
    } finally {
      setExporting(false);
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus(null);

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        if (data.version !== 1) {
          setStatus({ ok: false, msg: "Unsupported file format." });
          return;
        }
        const counts = [
          data.story?.length && `${data.story.length} story chapters`,
          data.legend?.length && `${data.legend.length} legend stages`,
          data.units?.length && `${data.units.length} units`,
          data.medals?.length && `${data.medals.length} medals`,
          data.milestones?.length && `${data.milestones.length} milestones`,
          data.catclaw && "catclaw progress",
        ].filter(Boolean).join(", ");
        setConfirmImport({ file, summary: counts || "No progress data found" });
      } catch {
        setStatus({ ok: false, msg: "Invalid JSON file." });
      }
    };
    reader.readAsText(file);
    // Reset the input so the same file can be re-selected
    e.target.value = "";
  }

  async function executeImport() {
    if (!confirmImport) return;
    setImporting(true);
    setStatus(null);
    setConfirmImport(null);
    try {
      const text = await confirmImport.file.text();
      const res = await fetch("/api/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: text,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Import failed");
      const msg = data.warnings?.length
        ? `Imported! (${data.warnings.length} warnings — some items may have been skipped)`
        : "All progress imported successfully!";
      setStatus({ ok: true, msg });
    } catch (e) {
      setStatus({ ok: false, msg: e instanceof Error ? e.message : "Import failed" });
    } finally {
      setImporting(false);
    }
  }

  return (
    <Panel title="Data Backup">
      <p className="text-sm text-gray-400">
        Export your progress as a JSON file for backup, or import a previously exported file to restore your data.
      </p>

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="button"
          onClick={handleExport}
          disabled={exporting}
          className="px-4 py-2 rounded border border-amber-700 bg-transparent hover:bg-amber-900 text-amber-300 text-sm disabled:opacity-50 transition-colors"
        >
          {exporting ? "Exporting..." : "Export Progress"}
        </button>

        <label className="px-4 py-2 rounded border border-gray-600 bg-transparent hover:bg-gray-900 text-gray-300 text-sm cursor-pointer transition-colors">
          {importing ? "Importing..." : "Import Progress"}
          <input
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            className="hidden"
            disabled={importing}
          />
        </label>
      </div>

      {/* Confirmation dialog */}
      {confirmImport && (
        <div className="border border-amber-800 rounded-lg p-4 bg-amber-950/30 space-y-3">
          <p className="text-sm text-amber-200">
            This will overwrite your current progress with the imported data:
          </p>
          <p className="text-xs text-gray-400">{confirmImport.summary}</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={executeImport}
              className="px-3 py-1.5 rounded border border-amber-600 bg-amber-900/50 hover:bg-amber-800 text-amber-200 text-sm transition-colors"
            >
              Confirm Import
            </button>
            <button
              type="button"
              onClick={() => setConfirmImport(null)}
              className="px-3 py-1.5 rounded border border-gray-700 text-gray-400 text-sm hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {status && (
        <p className={`text-sm ${status.ok ? "text-amber-400" : "text-red-400"}`}>
          {status.msg}
        </p>
      )}
    </Panel>
  );
}

/* ─── Shared helpers ──────────────────────────────────────────────────────── */

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-gray-700 rounded-lg p-6 bg-black space-y-5">
      <h2 className="text-base font-semibold text-gray-100 border-b border-gray-800 pb-3">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm text-gray-400">{label}</label>
      {children}
    </div>
  );
}

function SaveRow({
  saving,
  status,
  onSave,
  saveLabel = "Save",
}: {
  saving: boolean;
  status: { ok: boolean; msg: string } | null;
  onSave: () => void;
  saveLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between pt-2">
      {status ? (
        <span className={`text-sm ${status.ok ? "text-amber-400" : "text-red-400"}`}>
          {status.msg}
        </span>
      ) : (
        <span />
      )}
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="px-4 py-2 rounded border border-amber-700 bg-transparent hover:bg-amber-900 text-amber-300 text-sm disabled:opacity-50 transition-colors"
      >
        {saving ? "Saving..." : saveLabel}
      </button>
    </div>
  );
}
