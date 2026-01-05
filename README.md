# Anki Import Parser

A powerful Bun CLI application that automatically converts PDF vocabulary documents and Japanese kanji from ieben.net into Anki flashcard decks. Perfect for creating study materials with AI-powered refinement using DeepSeek.

## Features

- 📄 **PDF Parsing**: Extracts text from PDF vocabulary files automatically
- 🔤 **Kanji Parsing**: Fetch and parse Japanese kanji from ieben.net with detailed information
- 🤖 **AI Refinement**: Uses DeepSeek API to improve card formatting and content quality (PDF mode)
- 🎴 **Anki Integration**: Directly creates flashcard decks in Anki via AnkiConnect
- 📊 **Progress Tracking**: Real-time progress bars during processing
- 🔀 **Card Shuffling**: Randomizes card order to prevent learning bias (PDF mode)
- ✨ **Automatic Sync**: Seamlessly synchronizes cards with Anki

## Prerequisites

- **Node.js**: v18+ (for ES modules support)
- **Bun**: Runtime environment (or Node.js with npm/pnpm)
- **Anki**: with AnkiConnect add-on installed
  - AnkiConnect: https://ankiweb.net/shared/info/2055492159
- **DeepSeek API Key**: API key from https://platform.deepseek.com/ (required for PDF mode)
  - Alternative: Can be modified to use other OpenAI-compatible APIs

## Installation

1. Clone the repository:

```bash
git clone https://github.com/nezo32/anki-import-parse.git
cd anki-import-parse
```

2. Install dependencies:

```bash
npm install
# or pnpm install / yarn install
```

3. Set up environment variables:
   Create a `.env` file in the project root:

```env
DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

4. Build the project:

```bash
npm run build
```

### Alternative: Download Pre-built Executable

You don't need to build the app yourself! You can download the latest pre-built Windows executable directly from the [GitHub Releases](https://github.com/nezo32/anki-import-parse/releases) page:

1. Go to [Releases](https://github.com/nezo32/anki-import-parse/releases)
2. Download the latest `anki-import-parser.exe` file
3. Create a `.env` file in the same directory with your DeepSeek API key (only needed for PDF mode):

```env
DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

4. Run the executable directly without any build steps!

This option is perfect if you don't have Node.js or Bun installed and just want to use the application.

## Usage

The application supports two modes: **PDF parsing** and **Kanji parsing**.

### Global Options

- `-v, --version`: Display the application version and exit

**Example:**

```bash
# Using npm
npm run start -v
npm run start --version

# Using executable
.\anki-pfd-parser.exe -v
.\anki-pfd-parser.exe --version
```

### PDF Mode

Parse vocabulary from PDF files and create Anki flashcards with AI refinement.

```bash
# Using npm
npm run start pdf -f path/to/your/file.pdf

# Using executable
.\anki-pfd-parser.exe pdf -f path/to/your/file.pdf
```

**Options:**

- `-f, --file`: Path to the PDF file to parse

**Example:**

```bash
# Using npm
npm run start pdf -f ./Vocab_N2.pdf

# Using executable
.\anki-pfd-parser.exe pdf -f ./Vocab_N2.pdf
```

The application will:

- Parse the PDF and extract text
- Create or use an existing Anki deck (named from PDF title)
- Process text through DeepSeek AI for formatting
- Create flashcards with front/back content
- Shuffle cards randomly
- Add cards to your Anki deck
- Sync with Anki automatically

**Requirements:**

- PDF file path must be provided
- `DEEPSEEK_API_KEY` environment variable must be set
- Anki must be running with AnkiConnect add-on

### Kanji Mode

Fetch and parse Japanese kanji from ieben.net and create Anki flashcards.

```bash
# Using npm
npm run start kanji -g <grade> -d "<deck-name>" [kanjis...]

# Using executable
.\anki-pfd-parser.exe kanji -g <grade> -d "<deck-name>" [kanjis...]
```

**Options:**

- `-g, --grade`: Grade level (1-6, default: 1)
- `-d, --deck`: Anki deck name (default: "Untitled Deck")
- `kanjis`: Specific kanji characters to add (optional; if not provided, all kanji for the grade will be added)

**Examples:**

```bash
# Parse all kanji from grade 2 into deck "N2 Kanji" (using npm)
npm run start kanji -g 2 -d "N2 Kanji"

# Parse all kanji from grade 2 into deck "N2 Kanji" (using executable)
.\anki-pfd-parser.exe kanji -g 2 -d "N2 Kanji"

# Parse specific kanji from grade 3 (using npm)
npm run start kanji -g 3 -d "N3 Kanji" 家 木 火

# Parse specific kanji from grade 3 (using executable)
.\anki-pfd-parser.exe kanji -g 3 -d "N3 Kanji" 家 木 火

# Parse all kanji from grade 1 (default deck, using executable)
.\anki-pfd-parser.exe kanji
```

The application will:

- Fetch kanji data from ieben.net
- Parse kanji details (meanings, readings, examples)
- Create flashcards in the specified Anki deck
- Sync with Anki automatically

**Requirements:**

- Anki must be running with AnkiConnect add-on
- Internet connection (to fetch from ieben.net)
- No API key required for this mode

## Project Structure

```
src/
├── index.ts              # Main entry point with CLI argument parsing
├── types.ts              # TypeScript type definitions
├── utils.ts              # Utility functions (PDF file detection, etc.)
├── commands/
│   ├── pdf.ts            # PDF parsing command orchestration
│   └── kanji.ts          # Kanji parsing command orchestration
└── stages/
    ├── page.ts           # Single page parsing
    ├── pages.ts          # Batch page processing with progress
    ├── ai.ts             # DeepSeek AI card refinement
    ├── deck.ts           # Anki deck creation/retrieval
    ├── notes.ts          # Add notes to Anki deck
    ├── ieben_fetch.ts    # Fetch kanji data from ieben.net
    ├── ieben_parse.ts    # Parse kanji information
    ├── shuffle.ts        # Randomize card order
    └── sync.ts           # Synchronize with Anki
```

## Available Scripts

```bash
npm run build             # Compile TypeScript to JavaScript
npm run dev               # Run in development mode with watch
npm run start             # Run the compiled application
npm run build:exe         # Build standalone Windows executable
npm run build:all         # Build both JS and executable
npm run lint              # Lint TypeScript files
npm run prepublish        # Prepare for publishing
```

## Development

For development with auto-reload:

```bash
npm run dev
```

This will watch for changes in the `src` directory and automatically recompile.

## Technologies Used

- **TypeScript**: Type-safe JavaScript
- **Bun**: Fast JavaScript runtime
- **pdf2json**: PDF parsing library
- **OpenAI SDK**: For DeepSeek API integration
- **node-html-parser**: HTML parsing for kanji data
- **yanki-connect**: Anki connectivity via AnkiConnect
- **cli-progress**: Progress bar visualization
- **argparse**: CLI argument parsing
- **dotenv**: Environment variable management

## Configuration

### API Configuration

The application uses DeepSeek API with the endpoint `https://api.deepseek.com`. You can modify the API configuration in `src/index.ts`:

```typescript
const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY,
});
```

### AI Prompt

The AI prompt can be customized in `src/stages/ai.ts` to control how cards are refined.

## Troubleshooting

### "Please provide a PDF file path"

- Make sure to pass the PDF file path as an argument: `npm run start pdf -f ./file.pdf`
- Or place a PDF file in the current directory and run without the `-f` flag

### "Please set the DEEPSEEK_API_KEY environment variable"

- Create a `.env` file with your DeepSeek API key
- Ensure the file is in the project root directory
- This is only required for PDF mode, not for Kanji mode

### "The file does not exist"

- Verify the PDF file path is correct
- Use absolute paths if relative paths don't work

### AnkiConnect not found

- Make sure Anki is running
- Verify AnkiConnect add-on is installed in Anki
- Default AnkiConnect runs on `http://localhost:8765`

### Kanji parsing fails

- Verify your internet connection
- Check that ieben.net is accessible
- Ensure the grade number is between 1-6

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Author

**nezo** - [GitHub](https://github.com/nezo32)

## Changelog

### v1.0.0

- Initial release
- PDF parsing with pdf2json
- AI refinement with DeepSeek
- Full Anki integration
- Progress tracking and shuffling
- Kanji parsing from ieben.net
- Dual-command architecture (PDF and Kanji modes)
