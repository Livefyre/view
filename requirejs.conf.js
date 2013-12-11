require.config({
  paths: {
    jquery: 'lib/jquery/jquery',
    'event-emitter': 'lib/event-emitter/src/event-emitter',
    inherits: 'lib/inherits/inherits',
    mocha: 'lib/mocha/mocha',
    chai: 'lib/chai/chai',
    view: 'src/view'
  },
  shim: {
    jquery: {
        exports: '$'
    }
  }
});
