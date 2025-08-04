// ESM обёртка для configure
const configureModule = await import('./configure.cjs');

export const ToConfigure = configureModule.ToConfigure;
