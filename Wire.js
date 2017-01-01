var wireThickness = 8;
var wireColor = "#666666";
var wireNodeSize = 32;

var wireIdSuffix = 0;

// Wire object
// @param gates (LogicGate collection)
function Wire(gates) {
	this.id = 'wire' + wireIdSuffix;
	wireIdSuffix++;

	this.gates = gates;

	this.value = false;
	
	this.node1 = new WireNode(this);
	this.node2 = new WireNode(this);
	
	this.output = null;
}

// @return (String)
Wire.prototype.toString = function() {
	return this.id;
}

// @return (DOM node)
Wire.prototype.createDomNode = function() {
	var canvasNode = document.createElement('div');
	this.canvasNode = canvasNode;
	canvasNode.setAttribute('id', this.id);
	canvasNode.setAttribute('class', 'canvas');

	var div = createDomNode('div', '', 'wire');
	div.appendChild(this.node1.createDomNode());
	div.appendChild(this.node2.createDomNode());
	
	var outerDiv = document.createElement('div');
	outerDiv.appendChild(canvasNode);
	outerDiv.appendChild(div);
	
	this.domNode = outerDiv;
	return outerDiv;
}

Wire.prototype.updateView = function() {
	// Ensure that the wire is on top
	try {
		var z1 = dd.elements[this.node1.id].z;
		var z2 = dd.elements[this.node2.id].z;
		var maxZ = (z1 > z2 ? z1 : z2);
		this.canvasNode.style.zIndex = maxZ;
		dd.elements[this.node1.id].maximizeZ();
		dd.elements[this.node2.id].maximizeZ();
	} catch (e) {
		// IE bug
	}
	
	this.canvas.clear();
	
	var offset = wireNodeSize / 2 - wireThickness / 2;
	this.canvas.drawLine(this.node1.x() + offset, this.node1.y() + offset,
						 this.node2.x() + offset, this.node2.y() + offset);
	
	this.canvas.paint();
}

Wire.prototype.valueChanged = function() {
	var value = false;
	
	try {
		if (this.node1.input != null) {
			value = this.node1.input.getValue();
		} else if (this.node2.input != null) {
			value = this.node2.input.getValue();
		}
	} catch(e) {
		// There is a problem evaluating the gate, but this is probably just
		// because no input has been connected yet.
		return;
	}
	
	if (value == null) {
		value = false;
	}
	
	this.value = value;

	var newClass = 'wireNode wireNode' + value;
	this.node1.domNode.setAttribute('class', newClass);
	this.node2.domNode.setAttribute('class', newClass);
	
	if (this.output != null) {
		this.output.valueChanged();
	}
}