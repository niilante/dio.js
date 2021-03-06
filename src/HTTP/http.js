/**
 * create http request
 *
 * @param  {VRequest|Object<string, any>}
 * @return {function} {then, catch, done, ...}
 */
function http (options) {
	// extract properties from options
	var method = options.method;
	var url = options.url;
	var payload = options.payload; 
	var enctype = options.enctype;
	var responseType = options.responseType;
	var withCredentials = options.withCredentials;
	var headers = options.headers;
	var initial = options.initial;
	var config = options.config;
	var username = options.username;
	var password = options.password;

	// return a stream
	return stream(function (resolve, reject) {
		// if XMLHttpRequest constructor absent, exit early
		if (window.XMLHttpRequest == null) {
			return;
		}

		// create xhr object
		var xhr = new window.XMLHttpRequest();

		// retrieve browser location 
		var location = window.location;

		// create anchor element
		var anchor = document.createElement('a');
		
		// use to extract hostname, port, protocol properties
		anchor.href = url;

		// check if cross origin request
		var isCrossOriginRequest = !(
			anchor.hostname === location.hostname && 
			anchor.port === location.port &&
			anchor.protocol === location.protocol && 
			location.protocol !== 'file:'
		);

		// open request
		xhr.open(method, url, true, username, password);

		// on success resolve
		xhr.onload = function onload () { 
			response(this, responseType, resolve, reject);
		};
		// on error reject
		xhr.onerror = function onerror () { 
			reject(this.statusText); 
		};
		
		// cross origin request cookies
		isCrossOriginRequest && withCredentials && (xhr.withCredentials = true);

		// assign content type and payload
		if (method === 'POST') {
			xhr.setRequestHeader('Content-Type', enctype);

			if (enctype.indexOf('x-www-form-urlencoded') > -1) {
				payload = serialize(payload);
			} 
			else if (enctype.indexOf('json') > -1) {
				payload = JSON.stringify(payload);
			}
		}

		// headers property
		if (headers != null) {
			// assign headers
			for (var name in headers) {
				xhr.setRequestHeader(name, headers[name]);
			}
		}

		// if, assign inital value of stream
		initial != null && resolve(initial);

		// config, expose underlying XMLHttpRequest object
		// allows us to save a reference to it and call abort when required
		config != null && typeof config === 'function' && config(xhr);

		// send request
		payload != null ? xhr.send(payload) : xhr.send();
	});
}

