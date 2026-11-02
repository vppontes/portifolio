
# GitHub Copilot Instructions — Portfolio CP3 FIAP

## 1. Project Context

This is a personal developer portfolio developed for the CP3 assignment at FIAP.

The application must present personal information, skills, GitHub projects, a contact form, and a protected administrative dashboard.

The project will also be presented in a technical interview video of up to 8 minutes.

The deadline is very short. Prioritize simplicity, functionality, maintainability, and completion of all mandatory requirements.

Do not create unnecessary features.

## 2. Technology Stack

Use the following technologies:

- React
- Vite
- TypeScript
- React Router DOM
- TanStack Query
- Supabase Auth
- Supabase PostgreSQL
- CSS
- Vitest
- React Testing Library
- ESLint
- Prettier
- Husky
- lint-staged
- Resend
- Supabase Edge Functions
- Vercel

Do not install additional dependencies without a clear reason.

Do not introduce Redux, Zustand, Next.js, Tailwind, Three.js, or unnecessary animation libraries.

## 3. Mandatory Requirements

### Routing
- Home page.
- Individual project pages.
- Login page.
- Protected dashboard.
- Custom 404 page.
- API error handling.
- Direct URL access must work.
- Refreshing a route must not break the application.

### GitHub Integration
- Fetch public repositories using the GitHub API.
- Display repository name, description, language, and last update date.
- Provide an individual page for each repository.
- Use TanStack Query for caching.
- Avoid unnecessary repeated requests.
- Handle loading, error, and empty states.

### Contact Form
- Name, email, and message fields.
- Individual field validation.
- Specific validation error messages.
- Disable submit button while sending.
- Save messages in Supabase.
- Send notification emails to the portfolio owner.
- Display success and error feedback.

### Admin Dashboard
- Supabase authentication.
- Protected dashboard routes.
- No public registration.
- List received messages.
- Mark messages as answered.
- Select featured projects.
- Enforce permissions through Supabase RLS.

### Theme
- Light and dark themes.
- Persist visitor preference using localStorage.

### Interface
- Responsive desktop and mobile layout.
- Reusable components.
- Consistent visual identity.

### Performance
- Lighthouse mobile performance score of at least 80.
- Optimize images.
- Lazy-load images when appropriate.
- Lazy-load the dashboard.
- Prevent layout shifts.
- Cache GitHub API requests.

### Testing
Mandatory automated tests:
- Contact form validation.
- Dashboard access restriction for unauthenticated users.

### Deployment
- Public deployment on Vercel.
- Automatic deployment when pushing to main.
- Direct routes must work in production.

## 4. Project Architecture

Preferred structure:

src/
  components/
  pages/
  services/
  hooks/
  context/
  tests/
  App.tsx
  main.tsx
  index.css

Responsibilities:

- components: reusable UI components.
- pages: application pages.
- services: external APIs and services.
- hooks: reusable React hooks.
- context: global application state.
- tests: automated tests.

Keep business logic, API calls, and presentation separate.

Avoid unnecessary abstractions.

## 5. Coding Standards

- Use TypeScript consistently.
- Prefer functional components.
- Components must use PascalCase.
- Functions and variables must use camelCase.
- Global constants must use UPPER_SNAKE_CASE.
- Keep components small and reusable.
- Avoid duplicated code.
- Avoid unnecessary use of any.
- Handle errors explicitly.
- Remove unused imports.
- Keep CSS organized.
- Preserve existing project conventions.

## 6. Security

- Never expose private credentials.
- Never expose Supabase service_role keys in frontend code.
- Use environment variables.
- Keep .env outside Git.
- Maintain .env.example.
- Use Supabase RLS policies.
- Restrict administrative data to authorized users.
- Never rely only on frontend route protection.

## 7. Git Conventions

Follow GitHub Flow.

- main is the production branch.
- Do not develop directly on main.
- Create feature branches.
- Integrate changes through Pull Requests.
- Follow Conventional Commits.

Examples:

feat: add github integration
fix: correct contact validation
chore: configure project structure
test: add dashboard tests
docs: update readme

Keep commits small and focused.

## 8. Quality Assurance

Before completing a feature:

- Check TypeScript errors.
- Run ESLint.
- Run relevant tests.
- Run production build.
- Check existing functionality.

Never claim that something was tested without actually running the verification.

## 9. AI Behavior Rules

1. Read existing files before modifying them.
2. Follow these instructions.
3. Do not rewrite entire files unnecessarily.
4. Do not modify unrelated files.
5. Do not install unnecessary dependencies.
6. Do not create unrequested features.
7. Never invent personal information or projects.
8. Never present mock data as real data.
9. Preserve existing working functionality.
10. Investigate errors before attempting fixes.
11. Prefer the simplest solution that satisfies requirements.
12. Explain important architectural decisions.
13. Report created and modified files.
14. Run relevant checks after changes.
15. Never claim success without verification.
16. Ask questions when essential information is missing.
17. Do not make major architectural changes without approval.
18. Ask before destructive operations or database changes.

## 10. Working Process

For every task:

1. Analyze the existing project.
2. Identify relevant files.
3. Explain the implementation plan briefly.
4. Implement only the requested scope.
5. Run relevant checks and tests.
6. Summarize modifications.
7. Report remaining issues.

Work in small steps.

Do not implement the entire application in one operation.

## 11. Priority

When choosing between complexity and delivery time, prioritize:

1. Mandatory assignment requirements.
2. Correct functionality.
3. Security.
4. Code organization.
5. Performance.
6. Optional visual improvements.

Do not implement 3D elements, complex animations, or unnecessary features.

The final application must be functional, understandable, secure, and easy to explain during the technical presentation.
