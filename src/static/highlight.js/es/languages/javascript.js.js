function emitWarning() {
    if (!emitWarning.warned) {
      emitWarning.warned = true;
      console.log(
        'Deprecation (warning): Using file extension in specifier is deprecated, use "highlight.js/lib/languages/javascript" instead of "highlight.js/lib/languages/javascript.js"'
      );
    }
  }
  emitWarning();
    import lang from './javascript.js';
    export default lang;