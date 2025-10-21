# Cursor Rules for Next.js App Router Project

This directory contains Cursor rules that help maintain code quality and consistency across the project.

## Rules Structure

### Always Rules (`.cursor/rules/always/`)
Rules that are automatically applied to every chat and cmd/ctrl-k context:
- **global-coding-standards-always.mdc** - Core coding standards and best practices

### Auto-Attached Rules (`.cursor/rules/auto-attached/`)
Rules that are automatically applied based on file patterns:
- **nextjs-best-practices-auto.mdc** - Next.js App Router best practices (applies to `**/*.{ts,tsx}`)
- **react-best-practices-auto.mdc** - React 19 best practices (applies to `**/*.{ts,tsx,js,jsx}`)
- **typescript-best-practices-auto.mdc** - TypeScript coding standards (applies to `**/*.{ts,tsx}`)
- **tailwindcss-best-practices-auto.mdc** - TailwindCSS styling guidelines (applies to `**/*.{ts,tsx,css}`)
- **eslint-best-practices-auto.mdc** - ESLint configuration and usage (applies to `**/*.{ts,tsx,js,jsx}`)

### Agent-Requested Rules (`.cursor/rules/agent-requested/`)
Rules that developers can choose to load based on their needs:
- **radix-ui-best-practices-agent.mdc** - Radix UI component guidelines
- **class-variance-authority-best-practices-agent.mdc** - CVA styling patterns
- **clsx-best-practices-agent.mdc** - Conditional class management
- **lucide-react-best-practices-agent.mdc** - Icon usage guidelines

### Manual Rules (`.cursor/rules/manual/`)
Rules that need to be explicitly mentioned to be included:
- **testing-standards-manual.mdc** - Testing implementation guidelines

## Usage

- **Always rules** are automatically loaded in every context
- **Auto-attached rules** are loaded based on file patterns
- **Agent-requested rules** can be loaded by mentioning specific topics
- **Manual rules** must be explicitly requested

## Project Standards

This project follows:
- Next.js 15.4.6 App Router
- React 19 with modern patterns
- TypeScript 5.x with strict typing
- TailwindCSS 4.x for styling
- ESLint 9.x for code quality
- Radix UI for accessible components
- Modern testing practices with Jest and React Testing Library

## Contributing

When adding new rules:
1. Follow the established naming convention
2. Include proper frontmatter with all required fields
3. Provide clear examples of valid and invalid usage
4. Keep rules concise and actionable
5. Update this README when adding new rule categories
