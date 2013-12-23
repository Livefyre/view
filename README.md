# View

A View is an Object that facades an HTMLElement, and provides helpful methods for automatically creating appropriate Elements on construction, rendering templates as their innerHTML, and delegating and undelegating event listeners.

There are many examples of Views in action in  [streamhub-sdk](https://github.com/Livefyre/streamhub-sdk):
* [ListView](https://github.com/Livefyre/streamhub-sdk/blob/master/src/views/list-view.js) - renders a list of other views, optionally sorting with a custom comparator, and providing for 'show more' functionality reading from data source [stream](https://github.com/livefyre/stream)s
* [ContentView](https://github.com/Livefyre/streamhub-sdk/blob/master/src/content/views/content-view.js) - renders social content like comments, tweets, and Facebook posts
* [OembedView](https://github.com/Livefyre/streamhub-sdk/blob/master/src/content/views/oembed-view.js) - render oEmbed objects like photos, videos, or other rich embeds
* [ModalView](https://github.com/Livefyre/streamhub-sdk/blob/master/src/modal/main.js) - A base class for modal-based views. It takes care of hiding other modals when another instance is shown.

View is very much inspired by [Backbone.View](http://backbonejs.org/#View). Notable differences include not being tied to a Model or Collection framework, not depending on Underscore, more intentional support for subclassing views and their event maps.

## API

### `new View(opts)`

Construct a view. Pass an HTMLElement as `opts.el` to have the View use it, otherwise one will be created based on `.elTag`, which defaults to `'div'`.

### `View#setElement(el)`

Set the element that a View owns. The provided Element will then be available as
* .el - The Element
* .$el - The Element, wrapped in jQuery

The provided Element will have the string in `.elClass` added to its `class` attribute.

`.setElement` also calls `.undelegateEvents()` for any previous `.el`, and calls `.delegateEvents()` for the new `.el`.

### `View#events`

`.events` is an instance of `view/event-map`, whose ownProperty names should be of the form `'<event> <elSelectors>'`. Values should be either strings corresponding to methods on the view instance, or callback function expressions to be executed when the right events fire. Callback functions will be executed with `this` set to the View instance (not the event target).

#### `View#events.extended(moreEvents)`

Return a new EventMap instance contains all the events on the parent EventMap, plus all events specifified in the `moreEvents` object. This makes it easier to define subclasses of other Views that inherit their delegated events. For example:

    ChildView.prototype.events = ParentView.prototype.events.extended({
        'click .child-event-thing': '_handleClick'
    });

### `View#render()`

Renders the view template and sets it as the `innerHTML` of `.el`.

`View#template`, if defined, should be a function that returns a string of valid HTML. This means you can use any templating system you prefer. The template function will be passed the result of `View#getTemplateContext()`, which defaults to returning the View instance itself.

### `View#$(selector)`

Query for children of the View's element

### `View#destroy()`

Tell the View that it should self-destruct, and will never need to be used again. This will remove `.el` from the DOM, undelegate all events to clean up memory, and set `this.template` to null so that it may be garbage collected.
