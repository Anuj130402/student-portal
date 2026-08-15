// prompts.js
// Builds the instruction sent to Gemini. Each mode asks for a different
// SHAPE of output, which is what makes the modes meaningfully distinct.

const MODES = {
  short: { label: "Short Summary" },
  analytical: { label: "Analytical" },
  recall: { label: "Data-Specific & Easy-to-Remember" },
};

const MODE_INSTRUCTIONS = {
  short:
    "Produce a SHORT summary: 3 to 5 paragraphs capturing only the central " +
    "point and the single most important takeaway. Plain prose, no headings, " +
    "no lists — something a busy reader absorbs in fifteen seconds.",
  analytical:
    "Produce an ANALYTICAL summary. Identify the main claim or thesis, the key " +
    "arguments and evidence supporting it, any assumptions or limitations, and " +
    "the author's stance or tone. Use short labeled points so the reasoning " +
    "structure is visible at a glance.",
  recall:
    "Produce a DATA-SPECIFIC, EASY-TO-REMEMBER summary. Extract the concrete " +
    "facts — numbers, dates, names, definitions, figures — and present them as " +
    "short bullet cues optimized for recall. Where helpful, add a tiny memory " +
    "hook or grouping. Never invent data that is not present in the source.",
};

function buildPrompt(mode, urlText, pdfCount) {
  const instruction = MODE_INSTRUCTIONS[mode];
  const sourceNote =
    pdfCount > 0
      ? `The user attached ${pdfCount} PDF file(s); summarize their contents ` +
        "together with any text below."
      : "Summarize the material below.";
  const body =
    urlText && urlText.trim().length > 0
      ? `\n\n--- SOURCE TEXT ---\n${urlText}`
      : "";
  return `You are a study assistant. ${instruction}\n\n${sourceNote}${body}`;
}

module.exports = { MODES, MODE_INSTRUCTIONS, buildPrompt };