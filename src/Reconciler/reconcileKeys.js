/**
 * reconcile keyed nodes
 *
 * @param {Object<string, any>}    newKeys
 * @param {Object<string, any>}    oldKeys
 * @param {Node}                   parentNode
 * @param {VNode}                  newNode
 * @param {VNode}                  oldNode
 * @param {number}                 newLength
 * @param {number}                 oldLength
 * @param {number}                 position
 * @param {number}                 length
 */
function reconcileKeys (newKeys, oldKeys, parentNode, newNode, oldNode, newLength, oldLength, position, length) {
	var reconciled = new Array(newLength);

	// children
	var newChildren = newNode.children;
	var oldChildren = oldNode.children;

	// child nodes
	var newChild;
	var oldChild;

	// DOM nodes
	var nextNode;
	var prevNode;

	// keys
	var key;

	// offsets
	var added = 0;
	var removed = 0;
	var i = 0;
	var index = 0;
	var offset = 0;
	var moved = 0;

	// reconcile leading nodes
	if (position !== 0) {
		for (; i < position; i++) {
			reconciled[i] = oldChildren[i];
		}
	}

	// reconcile trailing nodes
	for (i = 0; i < length; i++) {
		newChild = newChildren[index = (newLength-1)-i];
		oldChild = oldChildren[(oldLength-1)-i];

		if (newChild.key === oldChild.key) {
			reconciled[index] = oldChild;

			// trim trailing node
			length--;
		}
		else {
			break;
		}
	}

	// reconcile inverted nodes
	if (newLength === oldLength) {
		for (i = position; i < length; i++) {
			newChild = newChildren[index = (newLength-1)-i];
			oldChild = oldChildren[i];

			if (index !== i && newChild.key === oldChild.key) {		
				newChild = oldChildren[index];

				nextNode = oldChild.DOMNode;
				prevNode = newChild.DOMNode;

				// adjacent nodes
				if (index - i === 1) {
					parentNode.insertBefore(prevNode, nextNode);
				}
				else {
					// move first node to inverted postion
					parentNode.insertBefore(nextNode, prevNode);

					nextNode = prevNode;
					prevNode = oldChildren[i + 1].DOMNode;

					// move second node to inverted position
					parentNode.insertBefore(nextNode, prevNode);
				}

				// trim leading node
				position = i;

				// trim trailing node
				length--;

				// hydrate
				reconciled[i] = newChild;
				reconciled[index] = oldChild;
			}
			else {			
				break;
			}
		}

		// single remaining node
		if (length - i === 1) {
			reconciled[i] = oldChildren[i];
			oldNode.children = reconciled;

			return;
		}
	}

	// reconcile remaining node
	for (i = position; i < length; i++) {
		// old children
		if (i < oldLength) {
			oldChild = oldChildren[i];
			newChild = newKeys[oldChild.key];

			if (newChild === void 0) {
				removeNode(oldChild.Type, oldChild, parentNode);
				removed++;
			}
		}

		// new children
		if (i < newLength) {
			newChild = newChildren[i];
			oldChild = oldKeys[newChild.key];

			// new
			if (oldChild === void 0) {
				nextNode = createNode(newChild, null, null);

				// insert
				if (i < oldLength + added) {
					insertNode(
						newChild.Type, 
						newChild, 
						oldChildren[i - added].DOMNode, 
						parentNode, 
						nextNode
					);
				}
				// append
				else {
					appendNode(
						newChild.Type, 
						newChild, 
						parentNode, 
						nextNode
					);
				}

				reconciled[i] = newChild;
				added++;
			}
			// old
			else {
				index = oldChild.index;
				offset = index - removed;

				// moved
				if (offset !== i) {
					key = oldChildren[offset].key;

					// not moving to a removed index
					if (newKeys[key] !== void 0) {
						offset = i - added;

						// not identical keys
						if (newChild.key !== oldChildren[offset].key) {
							nextNode = oldChild.DOMNode;
							prevNode = oldChildren[offset - (moved++)].DOMNode;

							if (prevNode !== nextNode) {
								parentNode.insertBefore(nextNode, prevNode);
							}
						}
					}					
				}

				reconciled[i] = oldChild;
			}
		}
	}

	oldNode.children = reconciled;
}

