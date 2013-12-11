require.config({
  paths: {
    jquery: 'lib/jquery/jquery',,
    jasmine: 'lib/jasmine/lib/jasmine-core/jasmine',
    'jasmine-html': 'lib/jasmine/lib/jasmine-core/jasmine-html',
    'jasmine-jquery': 'lib/jasmine-jquery/lib/jasmine-jquery',
    'event-emitter': 'lib/event-emitter/src/event-emitter',
    inherits: 'lib/inherits/inherits',
    'blanket-jasmine': 'lib/blanket/dist/jasmine/blanket_jasmine'
  },
  packages: [{
    name: 'view', location: 'src'
  }],
  shim: {
    jquery: {
        exports: '$'
    },
    jasmine: {
        exports: 'jasmine'
    },
    'jasmine-html': {
        deps: ['jasmine'],
        exports: 'jasmine'
    },
    'blanket-jasmine': {
        exports: 'blanket',
        deps: ['jasmine']
    },
    'jasmine-jquery': {
        deps: ['jquery']
    }
  }
});
