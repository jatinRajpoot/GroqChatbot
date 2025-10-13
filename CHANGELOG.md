# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2025-10-13

### Added
- **SQLite Database Integration**
  - Persistent chat history storage
  - `database.py` module with comprehensive CRUD operations
  - Support for multiple chat sessions
  - Database statistics endpoint
  - Session management (create, delete, list)
  
- **Enhanced Markdown Formatting**
  - Full support for headers (H1, H2, H3)
  - Bold text with `**text**` or `__text__`
  - Italic text with `*text*` or `_text_`
  - Unordered lists with `*` or `-`
  - Ordered lists with numbers
  - Blockquotes with `>`
  - Horizontal rules with `---` or `***`
  - Improved code block formatting
  - Better line break handling
  - Styled list items and headers in CSS

- **New API Endpoints**
  - `GET /api/sessions` - List all chat sessions
  - `DELETE /api/sessions/<id>` - Delete specific session
  - `GET /api/stats` - Get database statistics

- **Documentation**
  - `DATABASE.md` - Complete database schema documentation
  - Updated README with new features
  - Added changelog

### Changed
- Replaced in-memory chat storage with SQLite database
- Improved message formatting with better CSS styles
- Enhanced JavaScript markdown parser
- Updated `.gitignore` to exclude database files

### Fixed
- Markdown rendering now properly handles:
  - Multiple line breaks
  - Nested formatting
  - Code blocks within messages
  - Special characters in text
- Dependencies updated to fix httpx compatibility issue
  - groq: 0.9.0 → 0.11.0
  - Added: httpx==0.27.0

### Technical Details
- Database: SQLite 3
- Tables: `chat_sessions`, `messages`
- Indexes added for performance
- CASCADE delete for data integrity
- Timestamps for all records

## [1.0.0] - 2025-10-13

### Initial Release
- Flask web application
- Groq API integration
- ChatGPT-inspired UI
- Model selection
- Basic chat functionality
- Session management
- In-memory chat history
- Responsive design
- Example prompts
