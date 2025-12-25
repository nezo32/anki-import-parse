# Anki PDF Parser

A Node.js application that automatically converts PDF documents ([listed here](https://jvocab.com/#pdf)) into Anki flashcard decks. Perfect for creating study materials from PDFs, with AI-powered card refinement using DeepSeek.

## Features

- 📄 **PDF Parsing**: Extracts text from PDF files automatically
- 🤖 **AI Refinement**: Uses DeepSeek API to improve card formatting and content quality
- 🎴 **Anki Integration**: Directly creates flashcard decks in Anki via AnkiConnect
- 📊 **Progress Tracking**: Real-time progress bars during processing
- 🔀 **Card Shuffling**: Randomizes card order to prevent learning bias
- ✨ **Automatic Sync**: Seamlessly synchronizes cards with Anki

## Prerequisites

- **Node.js**: v18+ (for ES modules support)
- **Anki**: with AnkiConnect add-on installed
  - AnkiConnect: https://ankiweb.net/shared/info/2055492159
- **DeepSeek API Key**: API key from https://platform.deepseek.com/
  - Alternative: Can be modified to use other OpenAI-compatible APIs

## Installation

1. Clone the repository:

```bash
git clone https://github.com/nezo32/anki-pdf-import-parse.git
cd anki-pdf-import-parse
```

2. Install dependencies:

```bash
pnpm install
# or npm install / yarn install
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

## Using the Compiled Executable

Pre-compiled executables are available for Windows, macOS, and Linux. Download the appropriate executable for your platform from the [Releases](https://github.com/nezo32/anki-pdf-import-parse/releases) page.

### Setup

Before running the executable, create a `.env` file in the same directory as the executable:

```env
DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

### Running on Windows

```cmd
anki-pfd-parser-win.exe "path\to\your\file.pdf"
```

Example:

```cmd
anki-pfd-parser-win.exe "C:\Users\YourName\Documents\Vocab_N2.pdf"
```

### Running on macOS

```bash
chmod +x anki-pfd-parser-macos
./anki-pfd-parser-macos "/path/to/your/file.pdf"
```

For Apple Silicon (M1/M2/M3) Macs:

```bash
chmod +x anki-pfd-parser-macos-arm64
./anki-pfd-parser-macos-arm64 "/path/to/your/file.pdf"
```

### Running on Linux

```bash
chmod +x anki-pfd-parser-linux
./anki-pfd-parser-linux "/path/to/your/file.pdf"
```

**Requirements for executable usage:**

- **Anki**: Must be running with AnkiConnect add-on installed
- **DeepSeek API Key**: Required in the `.env` file
- **PDF File**: Valid path to the PDF file to parse

## Usage (Development)

Using the npm development environment:

1. **Start Anki** with AnkiConnect running (it runs automatically when Anki is open)

2. **Ensure your `.env` file is set up** in the project root with your DeepSeek API key

3. **Run the parser** with a PDF file:

```bash
npm run start <path-to-pdf>
```

Example:

```bash
npm run start ./Vocab_N2.pdf
```

4. The application will:
   - Parse the PDF and extract text
   - Create or use an existing Anki deck (named from PDF title)
   - Process text through DeepSeek AI for formatting
   - Create flashcards with front/back content
   - Shuffle cards randomly
   - Add cards to your Anki deck
   - Sync with Anki automatically

## Project Structure

```
src/
├── index.ts              # Main entry point
├── utils.ts              # Utility functions
└── stages/
    ├── page.ts           # Single page parsing
    ├── pages.ts          # Batch page processing with progress
    ├── ai.ts             # DeepSeek AI card refinement
    ├── deck.ts           # Anki deck creation/retrieval
    ├── notes.ts          # Add notes to Anki deck
    ├── shuffle.ts        # Randomize card order
    └── sync.ts           # Synchronize with Anki
```

## Available Scripts

```bash
npm run build              # Compile TypeScript to JavaScript
npm run dev               # Run in development mode with watch
npm run start             # Run the compiled application
npm run build:start       # Build and run in one command
npm run lint              # Lint TypeScript files
npm run prepublish        # Prepare for publishing
```

## Development

For development with auto-reload:

```bash
npm run dev path/to/your/file.pdf
```

## Technologies Used

- **TypeScript**: Type-safe JavaScript
- **pdf2json**: PDF parsing library
- **OpenAI SDK**: For DeepSeek API integration
- **yanki-connect**: Anki connectivity via AnkiConnect
- **cli-progress**: Progress bar visualization
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

- Make sure to pass the PDF file path as an argument: `npm run start ./file.pdf`

### "Please set the DEEPSEEK_API_KEY environment variable"

- Create a `.env` file with your DeepSeek API key
- Ensure the file is in the project root directory

### "The file does not exist"

- Verify the PDF file path is correct
- Use absolute paths if relative paths don't work

### AnkiConnect not found

- Make sure Anki is running
- Verify AnkiConnect add-on is installed in Anki
- Default AnkiConnect runs on `http://localhost:8765`

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
