# Anki PDF Parser & Kanji Import Tool

> A powerful command-line tool to automatically parse vocabulary PDFs and import kanji flashcards into [Anki](https://apps.ankiweb.net/), powered by AI.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://img.shields.io/npm/v/@anki-import-parser/main.svg)](https://www.npmjs.com/package/@anki-import-parser/main)

## Features

- 📄 **PDF Vocabulary Parsing**: Extract vocabulary from PDF documents automatically
- 🤖 **AI-Powered Enhancement**: Use OpenAI/DeepSeek API to refine and format flashcards
- 🔤 **Kanji Import**: Fetch and import kanji from ieben.net (Japanese education standards)
- 📚 **Anki Integration**: Seamlessly sync flashcards to your Anki desktop or AnkiWeb
- 🎯 **Multiple Grades**: Support for JLPT N1-N6 levels and Japanese school grades 1-6
- ⚡ **Progress Tracking**: Visual progress bars for long-running operations
- 🔀 **Smart Shuffling**: Randomize card order for better learning

## Requirements

Before you start, you'll need:

1. **Anki Desktop** - Download from [ankiweb.net](https://apps.ankiweb.net/)

   - The application must be running and AnkiConnect add-on installed
   - AnkiConnect add-on: `2055492159` (install via Anki → Tools → Add-ons → Get Add-ons)

2. **API Key** - Choose one:

   - OpenAI API key (https://platform.openai.com/api-keys)
   - DeepSeek API key (https://platform.deepseek.com/) - **Recommended** (cheaper)
   - Any OpenAI-compatible API

3. **Node.js & Bun** (if building from source)
   - Node.js 18+ or
   - Bun 1.0+ (https://bun.sh)

## Installation

### Option 1: Pre-built Executables (Recommended)

Download the latest release for your operating system from the [Releases](https://github.com/nezo32/anki-pdf-import-parse/releases) page:

- **Windows**: `anki-import-parser-win.exe`
- **macOS (Intel)**: `anki-import-parser-macos`
- **macOS (Apple Silicon)**: `anki-import-parser-macos-arm64`
- **Linux**: `anki-import-parser-linux`

No installation needed - just download and run!

### Option 2: Install from npm

```bash
npm install -g @anki-import-parser/main
```

### Option 3: Build from Source

```bash
# Clone the repository
git clone https://github.com/nezo32/anki-pdf-import-parse.git
cd anki-pdf-import-parse

# Install dependencies
npm install

# Build everything at once
npm run build:all
```

## Quick Start

### Setup

1. **Create a `.env.local` file** in your working directory:

```env
OPENAI_BASE_URL="https://api.deepseek.com"
OPENAI_API_KEY="your-api-key-here"

# For PDF parsing
ANIP_FILE_PATH="path/to/vocab.pdf"

# For Kanji import
ANIP_IEBEN_GRADE="1"
ANIP_DECK_NAME="! My Kanji Deck"
ANIP_KANJI_SELECTION=""
```

2. **Ensure Anki is running** with AnkiConnect add-on enabled

### Parse PDF Vocabulary

```bash
# Using downloaded executable
./anki-import-parser pdf -f path/to/vocab.pdf

# Using npm
anki-import-parser pdf -f path/to/vocab.pdf

# Or place PDF in current directory and run
anki-import-parser pdf
```

**What it does:**

1. Extracts vocabulary from the PDF
2. Uses AI to format and clean up the text
3. Creates a new deck named after the PDF
4. Adds flashcards to Anki automatically
5. Syncs changes to AnkiWeb

### Import Kanji by Grade

```bash
# Import grade 1 kanji
anki-import-parser kanji -g 1 -d "! Grade 1 Kanji"

# Import grade 3 kanji with specific characters
anki-import-parser kanji -g 3 -d "! Grade 3" 一 入 大

# Kanji grades: 1-6 (Japanese school standards)
```

**What it does:**

1. Fetches kanji list from ieben.net
2. Parses kanji data and stroke information
3. Creates/updates your specified Anki deck
4. Adds kanji flashcards with stroke counts and readings
5. Syncs to AnkiWeb

## Command Reference

### Global Options

```
-v, --version          Show version number
```

### PDF Command

```bash
anki-import-parser pdf [options]
```

| Option   | Short | Default                  | Description                 |
| -------- | ----- | ------------------------ | --------------------------- |
| `--file` | `-f`  | `ANIP_FILE_PATH` env var | Path to PDF vocabulary file |

**Environment Variables:**

- `ANIP_FILE_PATH`: Default PDF file path

### Kanji Command

```bash
anki-import-parser kanji [options] [kanjis...]
```

| Option    | Short | Default                    | Description           |
| --------- | ----- | -------------------------- | --------------------- |
| `--grade` | `-g`  | `ANIP_IEBEN_GRADE` env var | Kanji grade (1-6)     |
| `--deck`  | `-d`  | `ANIP_DECK_NAME` env var   | Target Anki deck name |

**Arguments:**

- `[kanjis...]`: Optional specific kanji characters to import (space-separated)

**Environment Variables:**

- `ANIP_IEBEN_GRADE`: Default kanji grade (1-6)
- `ANIP_DECK_NAME`: Default deck name
- `ANIP_KANJI_SELECTION`: Default kanji selection (space-separated)

**Example:**

```bash
# Import all grade 2 kanji
anki-import-parser kanji -g 2 -d "! Kanji N2"

# Import specific kanji
anki-import-parser kanji -g 1 一 入 大 木
```

## Environment Variables

The application loads configuration from `.env` and `.env.local` files. Create either file in your working directory:

```env
# Required for PDF and Kanji commands
OPENAI_API_KEY=your-api-key-here

# Optional: API endpoint (defaults to DeepSeek)
OPENAI_BASE_URL=https://api.deepseek.com

# Optional: PDF parsing defaults
ANIP_FILE_PATH=path/to/vocab.pdf

# Optional: Kanji import defaults
ANIP_IEBEN_GRADE=1
ANIP_DECK_NAME=! My Kanji Deck
ANIP_KANJI_SELECTION=
```

### .env vs .env.local

- **`.env`** - Default configuration file included in the repository (do not modify)
- **`.env.local`** - Local overrides for your environment (recommended, git-ignored)

**It is recommended to create `.env.local`** rather than modifying `.env`. Variables in `.env.local` will override those in `.env`, allowing you to safely customize your setup without accidentally committing sensitive data or personal settings to the repository.

Example `.env.local`:

```env
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxx
ANIP_FILE_PATH=/Users/yourname/Documents/vocab.pdf
ANIP_DECK_NAME=! My Japanese Deck
```

### Recommended API Providers

#### DeepSeek (Cheapest)

- Sign up: https://platform.deepseek.com/
- Cost: $0.14 per 1M input tokens, $0.28 per 1M output tokens
- Config:
  ```env
  OPENAI_BASE_URL=https://api.deepseek.com
  OPENAI_API_KEY=your-deepseek-key
  ```

#### OpenAI

- Sign up: https://platform.openai.com/
- Cost: Varies by model (gpt-3.5-turbo recommended)
- Config:
  ```env
  OPENAI_API_KEY=your-openai-key
  ```

## Workflow

### PDF Parsing Workflow

1. **PDF Input** → Extract text from vocabulary PDF
2. **Page Parsing** → Split into individual vocabulary entries (front/back)
3. **AI Enhancement** → Format with DeepSeek/OpenAI API
4. **Shuffling** → Randomize card order
5. **Anki Sync** → Create deck and add notes to Anki
6. **Cloud Sync** → Sync to AnkiWeb

### Kanji Import Workflow

1. **Fetch** → Download kanji list from ieben.net
2. **Parse** → Extract kanji, readings, and stroke data
3. **Create Deck** → Create Anki deck if needed
4. **Add Notes** → Create flashcards for each kanji
5. **Anki Sync** → Add notes to Anki
6. **Cloud Sync** → Sync to AnkiWeb

## Included PDFs

The project comes with sample vocabulary PDFs from [jvocab.com](https://jvocab.com/#pdf):

- `Vocab_N2.pdf` - JLPT N2 Level Vocabulary
- `Vocab_N3.pdf` - JLPT N3 Level Vocabulary
- `Vocab_N4.pdf` - JLPT N4 Level Vocabulary
- `Vocab_N5.pdf` - JLPT N5 Level Vocabulary (Beginner)

> **Note:** This parser is optimized for PDF vocabularies from [jvocab.com](https://jvocab.com/#pdf). Other PDF formats may require adjustments.

Try it out:

```bash
anki-import-parser pdf -f Vocab_N5.pdf
```

## Troubleshooting

### "AnkiConnect is not running"

**Solution:**

- Open Anki Desktop
- Go to Tools → Add-ons → AnkiConnect → Check if enabled
- Restart Anki
- Make sure Anki is running before executing the parser

### "Please set the OPENAI_API_KEY environment variable"

**Solution:**

- Create a `.env` file in your working directory
- Add: `OPENAI_API_KEY=your-key-here`
- Make sure the file is in the same directory as the executable

### "The file does not exist"

**Solution:**

- Provide absolute path to PDF: `anki-import-parser pdf -f C:\Users\YourName\Documents\vocab.pdf`
- Or place PDF in current directory and run `anki-import-parser pdf`

### API errors or timeouts

**Solution:**

- Check your API key is valid
- Verify internet connection
- Try with a different API provider (DeepSeek vs OpenAI)
- Check API account has credits remaining

### Deck or note creation fails

**Solution:**

- Ensure Anki Desktop is open
- Check deck name doesn't contain invalid characters
- Verify AnkiConnect add-on is installed and enabled
- Check `Tools → Add-ons → AnkiConnect → Config` shows port 8765

## Development

### Project Structure

```
src/
├── index.ts              # CLI entry point and argument parsing
├── types.ts              # TypeScript type definitions
├── utils.ts              # Utility functions
├── commands/
│   ├── pdf.ts            # PDF parsing command
│   └── kanji.ts          # Kanji import command
└── stages/
    ├── ai.ts             # AI text refinement
    ├── deck.ts           # Anki deck management
    ├── ieben_fetch.ts    # Fetch from ieben.net
    ├── ieben_parse.ts    # Parse kanji data
    ├── notes.ts          # Create Anki notes
    ├── page.ts           # Parse single PDF page
    ├── pages.ts          # Process all PDF pages
    ├── shuffle.ts        # Randomize cards
    └── sync.ts           # Sync to AnkiWeb
```

### Scripts

```bash
npm run dev              # Watch and develop with Bun
npm start               # Run with Bun
npm run build           # Compile TypeScript
npm run build:exe       # Build executable (current OS)
npm run build:all       # Build TypeScript + executable
npm run lint            # Run TypeScript linter
```

### Technology Stack

- **Language**: TypeScript
- **Runtime**: Bun / Node.js
- **PDF Parsing**: `pdf2json`
- **AI**: OpenAI SDK (compatible with DeepSeek, etc.)
- **Anki**: `yanki-connect` (AnkiConnect client)
- **CLI**: `argparse`
- **Progress**: `cli-progress`

## Dependencies

| Package            | Version | Purpose                       |
| ------------------ | ------- | ----------------------------- |
| `argparse`         | ^2.0.1  | Command-line argument parsing |
| `cli-progress`     | ^3.12.0 | Progress bar display          |
| `dotenv`           | ^17.2.3 | Environment variable loading  |
| `node-html-parser` | ^7.0.1  | HTML parsing for kanji data   |
| `openai`           | ^6.15.0 | API client for LLM providers  |
| `pdf2json`         | ^4.0.0  | PDF text extraction           |
| `typescript`       | ^5.9.3  | Type-safe development         |
| `yanki-connect`    | 3.2.2   | Anki integration              |

## License

MIT License © 2025 nezo

See [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Feel free to:

- Report bugs and issues
- Suggest new features
- Submit pull requests
- Improve documentation

## Support

- 📋 [GitHub Issues](https://github.com/nezo32/anki-pdf-import-parse/issues)
- 💬 [Discussions](https://github.com/nezo32/anki-pdf-import-parse/discussions)

## Related Projects

- **Anki**: https://apps.ankiweb.net/
- **AnkiConnect**: https://github.com/FooSoft/anki-connect
- **DeepSeek API**: https://platform.deepseek.com/
- **ieben.net**: https://ieben.net/ (Kanji education standards)

## Changelog

See [CHANGELOG.md](CHANGELOG.md) or [Releases](https://github.com/nezo32/anki-pdf-import-parse/releases)

---

**Made with ❤️ for Japanese language learners**
