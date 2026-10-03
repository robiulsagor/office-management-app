"use client";

import { useState } from "react";

type Person = {
  id: string;
  username: string;
  employeeId: string;
  employee: {
    name: string;
  };
};

type VersionItem = {
  id: string;
  version: number;
  action: string;
  data: unknown;
  createdAt: string;
  createdBy: Person;
};

type AuditItem = {
  id: string;
  action: string;
  changedFields: unknown;
  oldValues: unknown;
  newValues: unknown;
  actedAt: string;
  actedBy: Person;
};

type SnapshotItem = {
  id: string;
  label: string | null;
  data: unknown;
  createdAt: string;
  user: Person;
  version: {
    id: string;
    version: number;
    action: string;
  } | null;
};

type OrderHistoryProps = {
  versions: VersionItem[];
  auditLogs: AuditItem[];
  snapshots: SnapshotItem[];
};

type Tab = "versions" | "audit" | "snapshots";

function formatDate(date: string) {
  return new Date(date).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function displayUser(person: Person) {
  const result =
    person.employee?.name ||
    person.username ||
    person.employeeId ||
    "Unknown user";

  return result;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getChangedFieldNames(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((field): field is string => typeof field === "string");
  }

  if (isRecord(value)) {
    return Object.keys(value);
  }

  return [];
}

function formatFieldName(field: string) {
  return field
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/^./, (char) => char.toUpperCase());
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return JSON.stringify(value);
}

function JsonDetails({ label, value }: { label: string; value: unknown }) {
  return (
    <details className="mt-3 rounded-lg border bg-muted/20">
      <summary className="cursor-pointer px-3 py-2 text-sm font-medium">
        {label}
      </summary>

      <pre className="max-h-96 overflow-auto border-t p-3 text-xs leading-5 whitespace-pre-wrap wrap-break-words">
        {JSON.stringify(value ?? null, null, 2)}
      </pre>
    </details>
  );
}

function ChangeTable({ item }: { item: AuditItem }) {
  const fields = getChangedFieldNames(item.changedFields);
  const oldValues = isRecord(item.oldValues) ? item.oldValues : {};
  const newValues = isRecord(item.newValues) ? item.newValues : {};

  if (item.action === "CREATE") {
    return (
      <p className="mt-3 rounded-lg bg-muted/40 px-3 py-3 text-sm">
        Order created successfully.
      </p>
    );
  }

  if (fields.length === 0) {
    return (
      <p className="mt-3 text-sm text-muted-foreground">
        No changed fields were recorded for this action.
      </p>
    );
  }

  return (
    <div className="mt-4 overflow-x-auto rounded-lg border">
      <table className="w-full text-left text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-4 py-3 font-semibold">Field</th>
            <th className="px-4 py-3 font-semibold">Old Value</th>
            <th className="px-4 py-3 font-semibold">New Value</th>
          </tr>
        </thead>

        <tbody>
          {fields.map((field) => (
            <tr key={field} className="border-t">
              <td className="px-4 py-3 font-medium">
                {formatFieldName(field)}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {formatValue(oldValues[field])}
              </td>
              <td className="px-4 py-3">{formatValue(newValues[field])}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function OrderHistory({
  versions,
  auditLogs,
  snapshots,
}: OrderHistoryProps) {
  const [activeTab, setActiveTab] = useState<Tab>("versions");

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "versions", label: "Version History", count: versions.length },
    { id: "audit", label: "Audit Log", count: auditLogs.length },
    { id: "snapshots", label: "Snapshots", count: snapshots.length },
  ];

  return (
    <section className="space-y-5 rounded-xl border bg-white p-5 shadow-sm sm:p-6">
      <div>
        <h2 className="text-lg font-semibold">Order History</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Review who created or updated this order and what changed.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-b pb-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/70"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {activeTab === "versions" && (
        <div className="space-y-4">
          {versions.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No version history available yet.
            </p>
          ) : (
            versions.map((item) => (
              <article key={item.id} className="rounded-lg border p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">
                      Version {item.version} · {item.action}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.action === "CREATE" ? "Created by " : "Saved by "}
                      {displayUser(item.createdBy)}
                    </p>
                  </div>

                  <time className="text-sm text-muted-foreground">
                    {formatDate(item.createdAt)}
                  </time>
                </div>

                {item.action === "CREATE" && (
                  <p className="mt-3 text-sm">Order created successfully.</p>
                )}
              </article>
            ))
          )}
        </div>
      )}

      {activeTab === "audit" && (
        <div className="space-y-4">
          {auditLogs.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No audit logs available yet.
            </p>
          ) : (
            auditLogs.map((item) => (
              <article key={item.id} className="rounded-lg border p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">
                      {item.action === "CREATE"
                        ? "Order Created"
                        : item.action === "UPDATE"
                          ? "Order Updated"
                          : item.action}
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.action === "CREATE" ? "Created by " : "Updated by "}
                      {displayUser(item.actedBy)}
                    </p>
                  </div>

                  <time className="text-sm text-muted-foreground">
                    {formatDate(item.actedAt)}
                  </time>
                </div>

                <ChangeTable item={item} />
              </article>
            ))
          )}
        </div>
      )}

      {activeTab === "snapshots" && (
        <div className="space-y-4">
          {snapshots.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No snapshots available yet.
            </p>
          ) : (
            snapshots.map((item) => (
              <article key={item.id} className="rounded-lg border p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">
                      {item.label || "Order Snapshot"}
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Saved by {displayUser(item.user)}
                    </p>

                    {item.version && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        Linked to Version {item.version.version} (
                        {item.version.action})
                      </p>
                    )}
                  </div>

                  <time className="text-sm text-muted-foreground">
                    {formatDate(item.createdAt)}
                  </time>
                </div>

                <JsonDetails label="View snapshot data" value={item.data} />
              </article>
            ))
          )}
        </div>
      )}
    </section>
  );
}
