/**
 * Ambient declarations for non-code imports.
 *
 * Next ships types for `*.module.css` and `*.module.scss` (see
 * node_modules/next/types/global.d.ts) but not for a plain stylesheet, so
 * `import "./globals.css"` has no declaration to resolve to.
 *
 * The default `tsc` run tolerates that, because side-effect imports go
 * unchecked unless `noUncheckedSideEffectImports` is on. Editors frequently
 * enable it, which is why the error shows up in the IDE while the CLI and the
 * build stay green — a confusing split. Declaring it fixes both.
 *
 * `*.module.css` is a more specific pattern, so Next's typed declaration still
 * wins for CSS modules.
 */
declare module "*.css";
declare module "*.scss";
declare module "*.sass";
