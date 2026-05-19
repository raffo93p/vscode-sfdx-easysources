# Release Notes - SF EasySources VS Code Extension

All notable changes to the "SF EasySources" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.4] - 2026-05-19

### Added
- Initial release of SF EasySources VS Code Extension
- Complete graphical user interface for sfdx-easy-sources plugin
- Support for all metadata types:
  - Profiles
  - Permission Sets
  - Record Types
  - Custom Labels
  - Global Value Sets
  - Global Value Set Translations
  - Applications
  - Object Translations
  - Translations
- Support for all available actions:
  - Split: Convert XML to CSV format
  - Merge: Convert CSV back to XML
  - Upsert: Add/update entries in existing CSV files
  - Custom Upsert: Insert/update specific entries using JSON
  - Delete: Remove specific permissions or references
  - Minify: Clean up unnecessary entries
  - Clear Empty: Remove empty CSV files and folders
  - Are Aligned: Validate XML/CSV synchronization
  - Update Key: Refresh the `_tagid` column
- Interactive form with smart field validation
- Real-time command preview showing the exact CLI command
- Execution results display with detailed output
- Debug mode for developers:
  - View internal state
  - Inspect API calls
  - Debug form state
- Action-specific features:
  - Delete action: Type-safe field selection for different permission types
  - Custom Upsert action: JSON content editor with validation
  - Are Aligned action: Choice between string and logic validation modes
- Selective execution capabilities:
  - Choose specific profiles, permission sets, or other metadata items
  - Filter by object for record types
  - Select individual record types
- Contextual help text for each action
- Built-in integration with sfdx-easy-sources v0.9.3
- Material-UI based interface with VS Code theme support (dark/light mode)

### Technical Features
- React-based webview panel
- TypeScript extension backend
- Message-based communication between extension and webview
- Context-based state management
- Automatic settings loading from easysources-settings.json
- Dynamic metadata item discovery from workspace

---

## Legend

- **Added** - New features
- **Changed** - Changes in existing functionality
- **Deprecated** - Soon-to-be removed features
- **Removed** - Removed features
- **Fixed** - Bug fixes
- **Security** - Security improvements

---

[0.0.4]: https://github.com/raffo93p/vscode-sfdx-easysources/releases/tag/v0.0.4
