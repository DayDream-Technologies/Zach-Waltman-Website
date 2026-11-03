import { cpSync, mkdirSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const out = join(root, '.amplify-hosting');
const compute = join(out, 'compute', 'default');

rmSync(out, { recursive: true, force: true });
mkdirSync(compute, { recursive: true });
cpSync(join(root, 'dist'), join(out, 'static'), { recursive: true });
cpSync(join(root, 'dist', 'index.html'), join(compute, 'index.html'));
cpSync(join(root, 'server', 'amplify-host.mjs'), join(compute, 'index.mjs'));
cpSync(join(root, 'server', 'form-mail.mjs'), join(compute, 'form-mail.mjs'));
writeFileSync(join(compute, 'package.json'), JSON.stringify({ type: 'module' }));

const key = (process.env.RESEND_API_KEY || '').trim();
if (key && !/[\r\n]/.test(key)) {
  const lines = [`RESEND_API_KEY=${key}`];
  if (process.env.FORM_FROM) lines.push(`FORM_FROM=${process.env.FORM_FROM}`);
  if (process.env.FORM_TO) lines.push(`FORM_TO=${process.env.FORM_TO}`);
  writeFileSync(join(compute, 'form.env'), `${lines.join('\n')}\n`);
}

writeFileSync(
  join(out, 'deploy-manifest.json'),
  JSON.stringify(
    {
      version: 1,
      framework: { name: 'express', version: '4.18.2' },
      routes: [
        {
          path: '/api/forms',
          target: { kind: 'Compute', src: 'default' },
        },
        {
          path: '/assets/*',
          target: {
            kind: 'Static',
            cacheControl: 'public, max-age=31536000, immutable',
          },
        },
        {
          path: '/*.*',
          target: {
            kind: 'Static',
            cacheControl: 'public, max-age=3600',
          },
          fallback: { kind: 'Compute', src: 'default' },
        },
        {
          path: '/*',
          target: { kind: 'Compute', src: 'default' },
        },
      ],
      computeResources: [
        {
          name: 'default',
          runtime: 'nodejs22.x',
          entrypoint: 'index.mjs',
        },
      ],
    },
    null,
    2,
  ),
);

if (!existsSync(join(out, 'static', 'index.html'))) {
  throw new Error('dist/index.html is missing. Run vite build first.');
}
