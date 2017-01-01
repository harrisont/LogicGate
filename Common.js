// @param subClass (function)
// @param baseClass (function)
function subclass(subClass, baseClass) {
	function surrogateConstructor() {}
	surrogateConstructor.prototype = baseClass.prototype;

	subClass.prototype = new surrogateConstructor();
	
	subClass.prototype.constructor = subClass;
	subClass.baseConstructor = baseClass;
	subClass.superClass = baseClass.prototype;
}

// @param nodeType (String)
// @param id (String)
// @param class (String)
// @return (DOM node)
function createDomNode(nodeType, id, className) {
	var node;
	try {
		// First try the IE way; if this fails then use the standard way
		node = document.createElement('<' + nodeType + (id.length > 0 ? ' id="' + id + '"' : '') + (className.length > 0 ? ' class="' + className + '"' : '') + '>');
	} catch (e) {
		// Probably failed because we’re not running on IE
		node = document.createElement('div');
		node.setAttribute('id', id);
		node.setAttribute('class', className);
	}
	return node;
}