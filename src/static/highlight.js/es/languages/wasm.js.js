function emitWarning() {
    if (!emitWarning.warned) {
      emitWarning.warned = true;
      console.log(
        'Deprecation (warning): Using file extension in specifier is deprecated, use "highlight.js/lib/languages/wasm" instead of "highlight.js/lib/languages/wasm.js"'
      );
    }
  }
  emitWarning();
    import lang from './wasm.js';
    export default lang;