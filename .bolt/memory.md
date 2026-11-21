# Project memory

## Product intent & audience

- Web app with admin panel for managing registrations, agencies, mediators, agency staff, and homepage content (testimonials, video links, social links)
- Admin features include: approve/reject pending requests, ban/unban members, set account types, view agency detail with member lists, view mediator detail, edit homepage content

## Brand personality & voice

- User communicates in Arabic; UI text and admin labels likely Arabic-oriented
- Assistant explanations given in Arabic with technical terms in English

## Visual design & UX direction

- Mediator dashboard uses gradient styling (fixed a broken gradient from a color-code typo)
- Admin page structured around tabbed sections: pending registrations, mediators, agencies, homepage editor
- Component architecture: rich `AdminPage` component with sub-views (agency detail, mediator detail, homepage editor)

## Decisions, constraints & rationale

- **Framework**: vite-react
- **Backend**: Supabase — registrations and other entities loaded from Supabase
- **Shared code**: `types.ts` and `constants.ts` are the authoritative definitions; App.tsx must import from them rather than redefining (previous duplication caused missing fields like `gender`, `phone_code`, `phone_number`, `agency_id`, `app_id`, `account_type`, `is_banned` in `Registration`)
- **AdminPage wiring**: `src/components/AdminPage.tsx` is the real admin component; App.tsx must render it (not an inline shadow version) and supply all required state: `testimonials`, `videoLinks`, `socialLinks`, `mediators`, `agencyStaff`, `registrations`
- **Lint policy**: no unused imports or unused params; build, typecheck, and lint must all pass cleanly
- **`MediatorsAdmin`** does not receive a `registrations` prop directly; `MediatorDetail` obtains it from the parent

## Open questions & assumptions

- No `.bolt/prompt` is defined; no explicit global instructions exist yet
- Full deployment target and environment variables for Supabase not yet documented
- Non-admin user-facing pages and routes not fully mapped in this turn
- Accessibility and responsive design requirements not yet inferred