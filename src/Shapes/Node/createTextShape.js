/**
 * create text shape
 *
 * @public
 * 
 * @param  {(string|boolean|number)} text
 * @return {VNode}
 */
function createTextShape (text) {
	return {
		Type: 3,
		type: '#text',
		props: objEmpty,
		children: text,
		DOMNode: null,
		instance: null,
		index: 0,
		nodeName: null,
		key: void 0
	};
}

