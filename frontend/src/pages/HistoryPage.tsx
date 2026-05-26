import { useEffect, useMemo, useState } from "react";
import { Download, Search } from "lucide-react";

import { speakerApi } from "@/api/endpoints";
import { AppChrome } from "@/components/AppChrome";
import { PageShell } from "@/components/PageShell";
import { SectionTitle } from "@/components/SectionTitle";
import type { RecognitionRecord } from "@/types";

export function HistoryPage() {
  const [items, setItems] = useState<RecognitionRecord[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const pageSize = 10;

  useEffect(() => {
    speakerApi
      .history({ page, page_size: pageSize, search: search || undefined })
      .then((data) => {
        setItems(data.items);
        setTotal(data.total);
      });
  }, [page, search]);

  const exportCsv = () => {
    const rows = [["Timestamp", "File", "Predicted Speaker", "Confidence"]];
    items.forEach((item) =>
      rows.push([
        new Date(item.timestamp).toISOString(),
        item.uploaded_filename ?? item.uploaded_audio,
        item.predicted_speaker,
        String(item.confidence),
      ]),
    );
    const csv = rows
      .map((row) =>
        row.map((value) => `"${value.replaceAll('"', '""')}"`).join(","),
      )
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "recognition-history.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const pages = Math.max(1, Math.ceil(total / pageSize));
  const displayedRange = useMemo(
    () =>
      `${Math.min(total, (page - 1) * pageSize + 1)}-${Math.min(total, page * pageSize)}`,
    [page, total],
  );

  return (
    <PageShell>
      <div className="p-6">
        <AppChrome />
        <SectionTitle
          eyebrow="Audit trail"
          title="Recognition History"
          subtitle="Search prior attempts, paginate the archive, and export the current view to CSV."
        />
        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 md:max-w-md">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                value={search}
                onChange={(event) => {
                  setPage(1);
                  setSearch(event.target.value);
                }}
                placeholder="Search speaker or file"
                className="w-full bg-transparent outline-none"
              />
            </div>
            <button
              onClick={exportCsv}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
            >
              <Download className="h-4 w-4" /> Export CSV
            </button>
          </div>
          <div className="mt-5 overflow-hidden rounded-3xl border border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/60 text-slate-300">
                <tr>
                  <th className="px-4 py-3">Date/Time</th>
                  <th className="px-4 py-3">File</th>
                  <th className="px-4 py-3">Predicted Speaker</th>
                  <th className="px-4 py-3">Confidence</th>
                  <th className="px-4 py-3">Similarity</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-white/10 bg-white/5"
                  >
                    <td className="px-4 py-3 text-slate-300">
                      {new Date(item.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {item.uploaded_filename ?? item.uploaded_audio}
                    </td>
                    <td className="px-4 py-3 text-white">
                      {item.predicted_speaker}
                    </td>
                    <td className="px-4 py-3 text-cyan-200">
                      {(item.confidence * 100).toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {item.similarity_percentage?.toFixed?.(1) ?? "--"}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-slate-300">
            <div>
              Showing {displayedRange} of {total}
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 disabled:opacity-50"
              >
                Prev
              </button>
              <span>
                Page {page} / {pages}
              </span>
              <button
                disabled={page >= pages}
                onClick={() => setPage((current) => current + 1)}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
