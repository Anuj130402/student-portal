// export.js — download the current summary as a .txt file.

function downloadSummary(summaryText, mode) {
  const stamp = new Date().toISOString().slice(0, 10);
  const filename = `crux-${mode}-${stamp}.txt`;
  const blob = new Blob([summaryText], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);   // release the temporary object URL
}