# Deployment

Production is built by Cloudflare Pages directly from the public GitHub
repository.

- Repository: <https://github.com/Nonarkara/palette>
- Production branch: `main`
- Cloudflare Pages project: `palette`
- Canonical Cloudflare origin: <https://palette-8xw.pages.dev/>
- Public hostname: <https://colors.nonarkara.org/>
- Build command: none
- Output directory: repository root

Every push to `main` triggers a production deployment. Pull-request branches
receive preview deployments. GitHub Pages remains a public mirror and a second
deployment check; it is not the canonical public hostname.

## Release proof

Do not declare a release from the Cloudflare dashboard alone.

1. Run `npm run check` locally.
2. Push the commit to `main`.
3. Wait for the Cloudflare deployment for that exact commit to succeed.
4. Verify the `pages.dev` origin first with cache-busted requests.
5. Require three consecutive content hashes to match the local files.
6. Only then request the custom hostname with fresh probe keys.
7. Exercise navigation, search, the digest, and the guide download in a real
   browser on `colors.nonarkara.org`.

Never store a Cloudflare credential in this repository. Git source access is
owned by the Cloudflare account integration, not by a checked-in token.
