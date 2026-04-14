# Security Policy

## Supported versions

Security fixes are applied to the latest code on `main`.

## Reporting a vulnerability

Please do not open public issues for security vulnerabilities.

Instead:

1. Contact maintainers privately with details, impact, and reproduction steps.
2. Include any proof of concept and suggested mitigation if available.
3. Allow reasonable time for triage and remediation before public disclosure.

## Response targets

- Initial acknowledgement: within 3 business days
- Triage decision: within 7 business days
- Patch timeline: depends on severity and complexity

## Scope

This policy covers:

- API route security and input handling
- Dependency vulnerabilities
- Secrets exposure risks
- Authentication/authorization mistakes (if introduced)

## Optional client error telemetry

When `NEXT_PUBLIC_ENABLE_CLIENT_TELEMETRY=true`, the app may POST minimal error summaries to `/api/client-error` (path, message type, timestamp). This is off by default. Do not enable without a clear retention and privacy policy for your deployment.

## Optional Web Vitals telemetry

When `NEXT_PUBLIC_ENABLE_WEB_VITALS=true`, the app may POST performance metrics (for example LCP, CLS, INP metadata) to `/api/web-vitals`. This is also off by default and should follow your deployment's data-retention policy.
