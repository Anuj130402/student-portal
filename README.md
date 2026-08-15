# Student Portal — Crux

Crux is a document summarizer built into the Student Portal. Paste one or more PDFs or website URLs and get a clean summary in the mode that fits how you want to study: Short, Analytical, Data-Specific and Easy-to-Remember.

This repository began as a legacy C++ baseline and is being overhauled, commit by commit, into a web-based study tool.

## Features

- Summarize from multiple sources: upload PDF files or paste website URLs.
- Three summary modes:
  - **Short** — a tight, few-line gist.
  - **Analytical** — argument structure, claims, and reasoning.
  - **Data-Specific Easy-to-Remember** — pulls out figures, dates, and quantitative facts.
- Save past summaries to your profile for later review.

## Tech Stack

- **Frontend:** HTML, CSS, and vanilla JavaScript.
- **Auth & Database:** Firebase Authentication and Cloud Firestore.
- **Backend:** Firebase Cloud Functions (v2, Node 22) - the Gemini API key lives here, never in the browser.
- **AI:** Google Gemini (Flash) for summarization.
- **Hosting:** Netlify for the static frontend, Firebase for functions.

## Prerequisites

- Node.js 22 and npm
- Firebase CLI (`npm install -g firebase-tools`)
- A Firebase project with Authentication and Firestore enabled
- A free Google Gemini API key from Google AI Studio