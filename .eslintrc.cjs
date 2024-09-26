/**
 * Imports and re-exports the default eslint configuration from the @clabnet/configs-eslint-ts package.
 * This allows sharing the same rules across different projects.
 */

/*
 * Use this line when using type = module, on package.json
 */
// export { default } from '@clabnet/configs-eslint-ts'

/* otherwise */

/*
 * Use this line when using type = commonjs on package.json
 */
module.exports = require('@clabnet/configs-eslint-ts')
