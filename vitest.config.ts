import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        include: ['test/**/*.spec.{ts,js}'],
    },
    resolve: {
        alias: {
            // Bare `adminizer` imports inside the adapter under test resolve
            // to a lightweight stub so we don't need to load the full runtime.
            adminizer: resolve(here, 'test/_stubs/adminizer.ts'),
        },
    },
    esbuild: {
        target: 'es2022',
    },
});
