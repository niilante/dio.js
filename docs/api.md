## API

### Components

You can create a component in any of the following ways.

```javascript
class Hello extends dio.Component {
	render () {
		
	}
}

var Hello = dio.createClass({
	render () {

	}
});

function Hello () {
	return {
		render () {
		
		}
	}
}

var Hello = h => ({
	render () {
	
	}
});

var Hello = h => props => ();

var Hello = props => ();
```

All the examples above act the same, it should however be noted that createClass does not auto-bind methods though it does behave like a class in that you can use a constructor method, for example the following component definitions are identical.

```javascript
class Hello extends dio.Component {
	constructor (props) { this.state = {id: 100}; }
	render () {
		
	}
}

const Hello = dio.createClass({
	constructor (props) { this.state = {id: 100}; }
	render () {}
});

function Hello {
	return {
		constructor (props) { this.state = {id: 100}; }
		render () {}
	}
}

const Hello = h => ({
	constructor (props) { this.state = {id: 100}; }
	render () { }
})

const Hello = () => ({
	state: {id: 100},
	render () { }
})
```

#### render

The render method tells dio what the component will render. This method recieves `props`, `state` & `context` as its arguments and can return a VNode `h(...)`, an array of VNodes `[h()...]` or nothing(null/undefined) and more. This is the only required method to render a component.

```javascript
class Hello extends dio.Component {
	render () {
		return h('div', 'Text') || [h('div'), h('div')]
	}
}
```

The render method support a wide variety of return types

- elements

```javascript
class Hello extends dio.Component {
	render () {
		return h('div', 'Element')
	}
}
```


- strings

```javascript
class Hello extends dio.Component {
	render () {
		return 'String'
	}
}
```

- number

```javascript
class Hello extends dio.Component {
	render () {
		return 911
	}
}
```

- arrays

```javascript
class Hello extends dio.Component {
	render () {
		return [h('div', 'Call '), 911]
	}
}
```

- functions

```javascript
class Hello extends dio.Component {
	render () {
		return h => props => h('h1', 'Call the police');
	}
}
```

- coroutines

```javascript
class Hello extends dio.Component {
	*render () {
		yield h('h1', 'Going once...');
		yield h('h1', 'Going twice..');
		yield h('h1', 'Sold!')	
	}
}
```

- promises

```javascript
class Hello extends dio.Component {
	render () {
		return h('div', 'A knight in shining armor')
	}
}
```

- components

```javascript
class Hello extends dio.Component {
	render () {
		return class extends Component {
			render () {
				return h('h1', 'Inception!')
			}
		}
	}
}
```

- component descriptors(any object that implements a render method)


```javascript
class Hello extends dio.Component {
	render () {
		return {
			render () {
				return h('h1', 'Inception!')
			}
		}
	}
}
```

or even

```javascript
class Hello extends dio.Component {
	render () {
		return h => ({
			render () {
				return h('h1', 'Dio, dah')
			}
		})
	}
}
```

#### stylesheet

The stylesheet method tells dio how the component appearance will look like(its style/css). This method receives no arguments but returns a string of css. This css will get namespaced to the component and prefixed where required.

```javascript
class Hello extends dio.Component {
	stylesheet () {
		return `
			color: red;
			
			> h1 { font-size: 20px; }
		`
	}
}
```

#### componentWillUpdate

componentWillUpdate is a method called before the component updates and receives as arguments the new props and new state.

```javascript
class Hello extends dio.Component {
	componentWillUpdate (newProps, newState) {
		// do something before an update
	}
}
```

#### componentDidUpdate

similar to componentWillUpdate, componentDidUpdate is called after the component updates and receives as arguments the new props and new state. 

```javascript
class Hello extends dio.Component {
	componentDidUpdate (newProps, newState) {
		// do something after an update
	}
}
```

#### componentWillMount

componentWillMount is a method called before the component is mounted to the document and recieves as an argument the element being added to the document.

```javascript
class Hello extends dio.Component {
	componentWillMount (element) {
		// do something before mounting
	}
}
```

#### componentDidMount

similar to componentWillMount, componentDidMount is called after the component is mounted to the document and recieves as an argument the element that was added to the document.

```javascript
class Hello extends dio.Component {
	componentDidMount (element) {
		// do something after mounting
	}
}
```

#### componentWillUnmount

similar to componentWillMount, componentWillUnmount is called before the component is un-mounted from the document and receives as an argument the element that is about to be removed.

```javascript
class Hello extends dio.Component {
	componentWillUnmount (element) {
		// do something before un-mounting
	}
}
```

#### componentWillReceiveProps

componentWillRecieveProps is called before the component recieves new props.

```javascript
class Hello extends dio.Component {
	componentWillReceiveProps () {
		// do something before new props are recieved
	}
}
```

#### shouldComponentUpdate

shouldComponentUpdate is a method that is called before the component is updated and determines if the component should update.

```javascript
class Hello extends dio.Component {
	shouldComponentUpdate () {
		// determine if the component should update
		return false;
	}
}
```

#### setState

setState is used when a component requires a state update. setState accepts two arguments the last of which is an optional callback that will get called within the context of the component if passed after the state update. The first argument is an `{Object}` representing the update to the components state. Alternatively you can update the state directly `this.state.id = 1` and call `this.forceUpdate` manually. It should however be noted that setState is synchronous.

```javascript
class Hello extends dio.Component {
	handleClick () {
		this.setState({id: 1})
	}
	render () {
		return h('div', {onClick: this.handleClick})
	}
}
```

#### forceUpdate

forceUpdate is a method you can call when the component requires a render update, this method unlike setState
by passes `shouldComponentUpdate` if defined.

```javascript
class Hello extends dio.Component {
	handleClick () {
		this.forceUpdate();
	}
	render () {
		return h('div', {onClick: this.handleClick})
	}
}
```

#### getDefaultProps

getDefaultProps is a method used to assign the default props of a component when the component does not receive props. This method receives no arguments and returns an `{Object}`. This method is supported by components created with createClass functions and classes. Alternatively you could also specify `defaultProps` for function and class components.

```javascript
class Foo extends Component {
	getDefaultProps () {
		return {
			id: 100
		}
	}
	render () {

	}
}

// or
class Foo extends Component {
	render () {

	}
}

Foo.defaultProps = {id: 100};
```

#### getInitialProps

similar to getDefaultProps, getInitialProps is a method used to assign the initial props of the component. This method receives the props passed to the component if any and returns an `{Object}` or sets the props manually via `this.props = {}`.

```javascript
class Foo extends Component {
	getInitialProps () {
		return {
			id: 100
		}
	}
	render () {

	}
}
```

If this method returns a promise/promise-like object(i.e a dio stream) the component will go into async rendering mode.

```javascript
class Foo extends Component {
	async getInitialProps () {
		return {
			id: 100
		}
	}
	render ({id}) {
		return h('h1', 'Id Number:' + id)
	}
}
```

#### getInitialState

similar to getDefaultProps, getInitialState is a method used to assign the initial state of the component. This method receives no arguments and returns an `{Object}` or sets the state manually via `this.state = {}`.

```javascript
class Foo extends Component {
	getInitialState () {
		return {
			id: 100
		}
	}
	render () {

	}
}

// or

class Foo extends Component {
	constructor () {
		this.state = {id: 100};
	}
	render () {

	}
}
```

#### state

describes the current state of the component, you can declare the initial state of a component in 3 ways using any of the conventions of creating a component.

```javascript
class Hello extends dio.Component {
	getInitialState () {
		return {id: 1234}
	}
}

function Hello {
	return {
		constructor () {
			this.state = {id: 1234}
		}
	}
}

function Hello {
	return {
		state: {id: 1234}
	}
}
```

#### props

props are the values passed down to a component, the convention is that they should be treated as immutable objects(read-only), that is you shouldn't mutate them - `this.props.value = 1`, though nothing will break if you do and nothing stops you from doing that.

#### events

events are props prefixed with `on` and case insensitive. The value of an event prop can either be a function or an object.

```javascript
class Hello extends dio.Component {
	handleClick (e) {

	}
	render () {
		return h('div', {
			onClick: this.handleClick
		})
	}
}
```

Object values are used to specifiy bindings and additional options, this allows for either creating a two-way binding system between a property of the component and a property of the element or binding a method to a specific context or data.

For example if we wanted to bind the `handler` function to the components instance. 

```javascript
const handler = component => component.state.id = 1;

class Hello extends dio.Component {
	render () {
		return h('div', {
			onClick: {
				bind: handler,
				with: this
			}
		})
	}
}
```

The `handler` function will receive two props, the value of `this` and a second argument that is the event object, if `handler` was not an arrow function the `this` context would also be the components `this` context.

If we wanted to bind a specific property of the component to a property of the element we could do it as follows, where the `this` property is the object you want to bind.

```javascript
class Hello extends dio.Component {
	render (props, state) {
		return h('div', {
			onClick: {
				bind: {
					this: state,
					property: 'foo'
				},
				with: 'value'
			}
		})
	}
}
```

By default two-way data binding will envoke `e.preventDefault` unless specified otherwise by assigning `false` to a property `preventDefault` on the object passed. Optionally if the property of the element and component you are binding to use the same name then creating an object for the bind property can be ommited.

```javascript
class Hello extends dio.Component {
	render (props, state) {
		return h('div', {
			onClick: {
				bind: state,
				with: 'value'
			}
		})
	}
}
```

In a similar fashion you can register a passive event listeners

```javascript
class Hello extends dio.Component {
	render (props, state) {
		return h('div', {
			onClick: {
				bind: function () {},
				options: {passive: true}
			}
		})
	}
}
```

In both cases the property `bind` is interchangable with `handler` and `with` is interchangable with `data`.

```javascript
class Hello extends dio.Component {
	render (props, state) {
		return h('div', {
			onClick: {
				handler: function () {},
				data: {id: 1},
				options: {passive: true}
			}
		})
	}
}
```

## Error Boundries

All components created with dio are sandboxed by error boundries which allow for components to go down gracefully when they fail/throw as opposed to taking down a the application.

If an error is triggered from render a second retry will always happen asynchronously prior to going into a errored state, this allows for common error that can naturally get resolved in the next event loop cycle to get resolved, if that doesn't solve it the component then goes into an errored state. In an errored state by default dio will log a detailed error to the console and render nothing in the place of the component.

To control component errored states you can use the lifecycle method `componentDidThrow` that is executed when an error is thrown from anywhere within the component. 

Error boundries cover all parts of the component including invalid render types - when render returns an invalid element or object that is not render-able. Render-able types include `numbers/strings/functions/components/arrays/promises` and `elements` that are valid DOM elements, this is to say that if it fails when dio internally calls `document.createElement` it will get caught by the error boundry and sent to componentDidThrow with the `location: "element"`

#### componentDidThrow

This method receives one argument with the following shape 

```javascript
{
	location, // location that the error was thrown
	stack,    // stack trace
	silence,  // assign to true to silence console logging
	from      // name of component the error was thrown from
}
```
The return value of this method if a valid render type will be used to render the error state of the component.

```javascript
class Foo extends dio.Component {	
	componentDidThrow({location}) {
		switch (location) {
			case 'render': 
				return h('h1', `
					You thought it would throw but instead you found me... DIO! haha.
				`)
		}
	}
	render() {
		throw 'Pawned! Hahaha!'
	}
}
```

## Elements

Elements are of three types, `component`, `element`, `text` and `svg`. The `h` (read as hyperscript) and `createElement` functions hide away these low-level types that you can access if the need arises. In a browser enviroment `h` is also exposed to the global scope.

```javascript

class Hello extends Component {
	render () {
		return h('div');
	}
}

// component passing {id: 1} as props to the component
// and textNodes 1 and 2 as children
var component = h(Hello, {id: 1}, 1, 2)

// element passing textNodes 'Hello' and 'World' as children
var element = h('div', 'Hello', 'World')

// fragment passing textNodes 'Hello' and 'World' as children
var fragment = h(['Hello', 'World'])

// portal passing textNodes 'Hello' and 'World' as children
var portal = h(document.createElement('div'), ['Hello', document.createTextNode('World')])

// svg passing a svg path element as a child
var h('svg', h('path'))

// element passing a component as a child
var element = h('div', Hello);
```

## Refs

refs are escape hatches used to extract the DOMNode the a Virtual Element represents

```javascript
h('div', {ref: (el) => el instanceof Element});
```

The only argument passed to a function ref is the DOMNode the Element represents. The ref function will be called within the this context of its root component if it has any.

```javascript
class Hello extends Component {
	render () {
		return h('div', {
			ref: function () {
				this instanceof Hello;
			}
		});
	}
}
```

Strings can also represent refs.

```javascript
class Hello extends Component {
	onClick () {
		this.refs.div.nodeName === 'DIV';
	},
	render () {
		return h('div', {ref: 'div', onClick: this.onClick.bind(this)});
	}
}
```

## createFactory

createFactory creates a new element constructor/factory. This method receives two arguments the second of which is an optional props and the first the type of the element.

```javascript
var h1 = dio.createFactory('h1', {class: 'headings'});

var welcome = h1('Welcome');
var goodby = h1('GoodBye');
```

## DOM

DOM is similar to createFactory except it receieves one argument that is an array of strings used to create multiple factories at one.

```javascript
var {h1, p, div} = dio.DOM(['h1', 'p', 'div']);

var heading = h1({class: 'h1'}, 'Heading');
var paragraph = p({class: 'p'}, 'Call Me');
```

## isValidElement

isValidElement checks if the passed argument is an virtual element.

```javascript
dio.isValidElement(h('h1')); // => true
```

## cloneElement

cloneElement accpets 3 arguments, `(element, newProps, newChildren)` the last two of which are optional, when newProps are passed it shallow clones newProps and replaces the elements children with newChildren if passed as part of the arguments. 


## render

Not to be confused with the Component method render `dio.render` is used to mount a Component/Element to the document and create render factories. As you will recall in the getting started section we did something like this.

```javascript
function Hello () {
	return {
		render () {
			return h('h1' 'Hello ' + this.props.name);
		}
	}
}

dio.render(Hello)({name: 'World'});
```

The render method however also accepts a second argument, a mount element/mount selector defaulting to `document.body` if omitted.

```javascript
dio.render(Hello)({name: 'World'}, '.container');

// equivalent to
dio.render(Hello, document.body)({name: 'World'}, '.container');
```

The return value is a render instance that can be used to re-render as needed.

```javascript
var hello = dio.render(Hello)({name: 'World'}, '.container');

hello({name: 'Mars'});
```

Will mount Hello then update it with `{name: 'World'}` then update it again with the props `{name: 'Mars'}` the result will go from `// nothing` to `<h1>Hello World</h1>` to `<h1>Hello Mars</h1>`.

The render method also accepts `Object` that you may pass to `createClass`

```javascript
dio.render({
	state: {name: 'World'},
	render: (props, state) => h('h1', 'Hello' + state.name)
})
```

The render method is non-destructive, that is it will not destroy the contents of the element you wish to mount to. If you wanted to retrieve the root node that is mounted you can pass a function as a third argument that will recieve a single argument that is the root node after the Element/Component has mounted. The callback function will execute with the this refering to the component instance if a component was passed to render.

```javascript
dio.render(Hello)({name: 'World'}, document.body, function (el) { this instanceof Hello; } );
```

The last argument the render method accepts is a `{boolean}` that signals whether to hydrate the DOM `true` or active a destructive render `false`. This is usefull in the context of Server Side Rendering when coupled with `renderToString` or `renderToStream`.

## shallow

This method accepts an element or a Component and returns a shallow rendered virtual node.

## stylesheet

The css preprocessor that namespaces css defined in a `stylesheet` method is exposed as `dio.stylesheet`. You can use this to use the preprocessor directly or add plugins to the preprocessor allowing you to extend css.

```javascript
dio.stylesheet(
    selector: {string},     // selector - i.e `.class` or `#id` or `[attr=id]`
    styles: {string},       // css string
    animations: {boolean=}  // false to prevent prefixing animations, true by default
    compact: {boolean=}     // enable additional features (mixins, variables)
    middleware: {function=}
);

dio.stylesheet.use(
    key/middleware: {(string|RegExp|function|array|object)}
    plugin: {function=}
)
```

## renderToString

similar to render but renders the output to a string. This is usefull in a server-side enviroment.

```javascript
function Hello () {
	return {
		render () {
			return h('h1' 'Hello ' + this.props.name);
		}
	}
}

dio.renderToString(Hello, template)
```

This method accepts two arugments the second of which is an optional `template` string/function that is used to determine where to render the output. for example you could use it in the following ways

```javascript
// default
var output = dio.renderToString(Hello);

// template string, 
// where @body is replaced with the output
var output = dio.renderToString(Hello, `
	<html>
		<title>Hello</title>
		<body>@body</body>
	</html>
`);

// where ${stylesheet} is a string of all the stylesheets generated from
// the Hello Component including its children.
var output = dio.renderToString(Hello, function (body, stylesheet) {
	return `
		<html>
			<title>Hello</title>
			
			${stylesheet}
			
			<body>${body}</body>
		</html>
	`
})
```

## renderToStream

similar to renderToString except this method renders the output to a stream. This is usefull in a server-side enviroment as well and has the advantage over renderToString in that it is non-blocking and delivers chunks of bytes to the client for great "time to first bytes" and overall constant CPU load.

```javascript
dio.renderToStream(Hello, template)
```

This method like renderToString accepts 2 arguments the second of which differs from renderToString in that it expects the optional `template` to be a string if passed where as renderToString also accepts functions.

## renderToCache

like shouldComponentUpdate but for server-side rendering, renderToCache caches a render of the specified component such that whenever renderToString/renderToStream comes across the component the cache is used saving on computing the html output of the component.

```javascript
class Head extends dio.Component {
	render () {
		return h('head', h('title', 'Example Page'))
	}
}
class Page extends dio.Component {
	render ({msg}) {
		return h('html', [Head, h('body', h('h1', msg))])
	}
}

dio.renderToCache(Head);

app.use(context => {
	context.body = dio.renderToString(h(Page, {msg: 'Hello World'}));
});
```

In the above example the `Head` component is only every computed.

## createStore

```javascript
dio.createStore(
	// single or multiple reducers
	// if an object of reducers, combineReducers is called to combine them
	reducer: {(function|Object)}, 
	// initialState/middleware
	initalState: {Any}          
	// middleware, applyMiddleware is called 
	// on the enhancer function internally if passed
	enhancer: {Function}        
)
```

This method creates a store similar to redux createStore
with the different of `.connect` that accepts a component & mount/callback
with which to update everytime the store is updated.

Which is short hand for creating a listerner with `.subscribe`
that updates your component on state changes.

```javascript
var store = dio.createStore(reducer: {Function})
// or

// auto .combineReducers
var store = dio.createStore(object of reducers: {Object})

// dispatch an action
store.dispatch({type: '' ...})

// returns the current state
store.getState()

// called everytime the state is updated with the current
// state as the only argument passed to it... as in
// function (state) {  }
store.subscribe(listener: {Function})

// if the callback is a component, a render will get auto created
// if element is passed the callback will be treated as a component
// and it follows that a render will get auto created
store.connect(callback: {function})
store.connect(callback: {(function|Object)}, element: {(string|Node)})
```

## applyMiddleware

although you can archive the same effect with the third argument of `createStore()` applyMiddleware is exposed as a public api to allow manual handling of the above proxy detailed in createStore, applyMiddleware accepts a variable number of function arguments that are composed into middlewares.

```javascript
dio.applyMiddleware(fn, fn, fn...);
```

## combineReducers

This method allows you manually handle combinding multiple reducers into one. It accepts one `{Object<string, function>}` argument.

```javascript
var reducer = dio.combindReducers({
	add: () => {},
	subtract: () => {}
})
```


## request

request is a method that provides a http layer to help make ajax calls to api end points. For example if i wanted to make a get request to `google.com` i could do it in one of the following ways

```javascript
dio.request('google.com');
dio.request.get('google.com');
dio.request.post('google.com');
dio.request({url: 'google.com'})
```
Below is a full run down of all the arguments the request method accepts, all of which are optional with the exception of the `url`.

```javascript
// returns a stream
dio.request(
	url:             {string}, 
	payload?:        {Object},

	// 'file' | 'json' | 'text',
	// default: 'application/x-www-form-urlencoded'
	enctype:         {string=}, 
	
	// defaults to determine responseType based on response
	responseType:    {string='(html|document)'|'json'|'text'}

	// true/false
	// indicates whether CORS requests should be made 
	// using credentials such as cookies, 
	// authorization headers or TLS client certificates.
	withCredentials: {boolean=},

	// initial value of the returned stream 
	// before the request completes
	initial:         {any=},

	// request headers to assign 
	headers:          {Object=},

	// exposes xhr object for low level access 
	// before the request is sent
	config:          {function=},

	// username & password for HTTP authorization
	username:        {string=}, 
	password:        {string=}
)
```
examples creating `POST` and `GET` requests. 

```javascript
// options as arguments
dio.request.post('/url', {id: 1234}, 'json')
	.then((res)=>{return res})
	.then((res)=>{'do something'})
	.catch((err)=>{throw err});

// options as object
dio.request({
	method: 'GET',
	url: '/url',
	payload: {id: 1234},
	enctype: 'json',
	withCredentials: false,
	config: function (xhr) {
		xhr.setRequestHeader('x-auth-token',"xxxx");
	}
}).then((res)=>{return res})
  .catch((err)=>{throw err});
```

The catch handler will get called in 3 cases, 1 - when an error is thrown in a `then` function, 2 - json parsing error and 3 - a response returns a status of `0` or `>= 400`.

## router

This methods accepts two arguments the last of which is optional. In the below example `/user/dio` is the initial route to navigate to and `/catagory` represents the root address of the app. The arguments passed to the middleware if specified are ``component/function`, `data` and `element`, where data is an `{url: '' ...}` representing the data attached to the route. If a route is not matched the `404` method will get called if defined.

```javascript
var router = dio.router({
	'/': function (data) {
		dio.render(h(home, data))
	},
	'/user/:id': function (data) {
		dio.render(H(user, data));
	}
}, {
	initial: '/catagory', 
	directory: '/user/dio',
	middleware: function (fn, data, el) {},
		'404': function (data) {
	}
})
```

The above example handles mounting manually alternatively you can also create a router using a mount element and Components in the following fashion.

```javascript
var router = dio.router({
	'/': Bar,
	'/user/:id': Foo
}, {
	mount: document.body
});
```

In both cases `:id` variables are passed to Foo and Bar as props when the route is activated or to the function specified such that in the case where the url `/user/1234` is matched the object passed will be represented as `{url: '/user/1234', id: 1234}`. 

When called this method will return an object with `resolve`, `routes`, `back`, `forward`, `link`, `resume`, `pause`, `destroy`, `set` and `location` properties. The location property can be used to navigate between views `router.location = '/user'` or link it to an action with `router.link` in the following way.

```javascript
// attached to the value of an elements property
h('h1', {onClick: router.link('href'), href: '/'}, 'Home')

// or as an explicit url
h('h1', {onClick: router.link('/')}, 'Home')

// or as a function
h('h1', {onClick: router.link(el => { 
	return el.getAttribute('href')
}), href: '/'}, 'Home') 
```

The `pause` method pauses listerning to route changes, `resume` does the opposite and can be used after `destroy` to start things up a fresh. The methods `back` and `forward` are proxies to `history.back` & `history.forward` and the destroy method stops the router and clears all registered routes. The set method is used interally to regsiter a route, it can be used at any point to assign/re-assign/add routes as needed. If you wanted to access the registered routes you can access the `routes` property, it is immutable so you cannot change the already registered routes without using `set` or `destroy`. The `resolve` method exists for cases where you might want to resolve a route without relying on `window.location` or changing location manually with `location`.


```javascript
// resolves but does not update the url
router.resolve('/user/1234');

// resolves and updates the url
router.location = '/user/1234';

// pause listening for url changes
routes.pause();

// changes url but does not resolve/dispatch
routes.location = '/en/';

// resume listening for url changes
routes.resume();

// assign/re-assign/add route
routes.set('/:user/:name', (data) => data);
```


## stream

streams in dio are convinient getters/setters that also act like promises. For example `var foo = dio.stream(10)`. The variable foo now holds a function that when called without any arguments returns 10 `foo()` and updates the value that foo holds when called with an argument `foo(20)`.

The second argument in `dio.stream` is a optional argument representing a mapper, this allows use to extend streams in different ways.

Before we go into extending stream it's important to know that like promises streams have `.then`, `.done` and `.catch` methods that can be used to listen for the resolution and/or rejection of a stream.

```javascript
var foo = dio.stream(10).then(foo => console.log(foo))
foo(20); // => 20

// or
var foo = dio.stream(function (resolve, reject) {
	setTimeout(resolve, 0, 20);
}).then(foo => console.log(foo)).catch(msg => console.log(msg))
```

Which allows the above piece of code to log the value of foo everytime the value successfully resolves and log the error message anytime it rejects.

If you wanted to insure that the value returned by the stream is always of a certain type you can pass a second function to `stream` that will be used to resolve the value through before retrieving the value of the stream.

```javascript
var string = dio.stream(100, String);
string()     // => '100'
string(1)(2) // => '2'
```

You could also pass a `{boolean}` as the second argument if you wanted to pass a function as a stream that should return the returned value when retreiving the value of the stream, this can come in handy in some cases one of which includes extending streams.

Similar to `.then` streams also have a `.map` method which allows you to create a stream that is dependent on another streams value such that when the value of one stream changes so does the other.

```javascript
var foo = dio.stream(10);
var bar = foo.map(function (foo) {
	return foo * 2;
});

bar()  // => 20
foo(2)
bar()  // => 4 
```
Since streams a similar to promises creating a stream in a resolved/rejected state applies to streams as well though creating streams in a resolved state is identical to creating streams, for example the following to are the same.

```javascript
var foo = dio.stream.resolve(10);
var foo = dio.stream(10);
```
the following is a stream created in a rejected state

```javascript
var foo = dio.stream.reject('reason');
```

The above stream api allow us to extend streams as needed. To showcase this i will try to extend the streams with a `.scan` method that creates streams that accumulates everytime it is called such that calling `foo(1)(1)(2)` will result in a stream `bar` holding the value `4`.

```javascript
dio.stream.scan = function (reducer, accumulated, stream) {
	return Stream(function (resolve) {
		stream.then(function (value) {
			accumulated = reducer(accumulated, value);
			resolve(accumulated);
		});
	});
};

// @example 
var foo = dio.stream();
var bar = dio.stream.scan((sum, n) => { 
	sum + n
}, 0, foo);

foo(1)(1)(2)
bar() // => 4 
```

