# InsightFlow

InsightFlow is an AI-powered data insights platform built with Next.js. Upload your data files (CSV, JSON, TXT, XLSX), ask questions, and generate actionable insights using advanced AI models.

## Features

- **Data Upload:** Easily upload and process CSV, JSON, TXT, or XLSX files.
- **AI-Powered Insights:** Generate insights and answer questions using RAG and Langchain.
- **Interactive Interface:** User-friendly UI for uploading data, querying, and viewing results.
- **Insight Display:** Clear, concise reports and visualizations.
- **Modern Design:** Clean layout, intuitive icons, and subtle animations.

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

```sh
git clone https://github.com/yourusername/insightflow.git
cd insightflow
npm install
```

### Running Locally

```sh
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to use the app.

### Building for Production

```sh
npm run build
npm start
```

## Project Structure

- `src/app/` – Next.js app directory (main pages, layout)
- `src/components/` – UI and feature components
- `src/hooks/` – Custom React hooks
- `src/lib/` – Utility libraries
- `src/ai/` – AI integration logic
- `docs/` – Documentation and blueprints

## Configuration

- Environment variables are managed in `.env`.
- Tailwind CSS is configured via `tailwind.config.ts`.

## Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License

Nikhil Kumar

---