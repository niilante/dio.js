/**
 * clone virtual node
 * 
 * @param  {VNode} subject
 * @return {VNode}
 */
function cloneNode (subject) {
	return createNodeShape(
		subject.nodeType,
		subject.type,
		subject.props,
		subject.children,
		subject.DOMNode,
		null,
		null,
		null,
		null
	);
}

