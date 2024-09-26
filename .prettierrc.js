/**
 * Imports and re-exports the default Prettier configuration from the @clabnet/configs-prettier package.
 * This allows sharing the same Prettier rules across different projects.
 */

/*
 * Use this line when using type = module on package.json
 */
export { default } from '@clabnet/configs-prettier'

/* otherwise */

/*
 * Use this line when using type = commonjs on package.json
 */
// module.exports = require('@clabnet/configs-prettier')
