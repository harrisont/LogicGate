// WireNode object
WireNode.idSuffix = 0;
function WireNode(parentWire) {	
	this.parentWire = parentWire;
	
	this.input = null;
	this.output = null;

	this.id = 'wireNode' + WireNode.idSuffix;
	WireNode.idSuffix++;
}

// @return (String)
WireNode.prototype.toString = function() {
	return this.id;
}

// @param input (LogicGate)
WireNode.prototype.setInput = function(input) {
	// Remove the listener on the old input.
	if (this.input)
		this.input.removeValueChangedListener(this);
	
	this.input = input;
	
	if (this.input)
		this.input.addValueChangedListener(this);
		
	this.parentWire.valueChanged();
}

// @param ouput (LogicGate)
WireNode.prototype.setOutput = function(output) {
	var oldOutput = this.output;
	this.output = output;
	
	if (this.parentWire.output != null) {
		if (oldOutput != null) {
			this.parentWire.output.removeInput(this.parentWire);
		}
		
		if (oldOutput != null || output != null) {
			this.parentWire.output = output;
		}
	} else {
		this.parentWire.output = output;
	}
	
	if (output != null) {
		output.addInput(this.parentWire);
	}
	
	if (this.parentWire.output != null) {
		this.parentWire.output.valueChanged();
	}
}

// @return (int) the x coordinate
WireNode.prototype.x = function() {
	return dd.elements[this.id].x;
}

// @return (int) the y coordinate
WireNode.prototype.y = function() {
	return dd.elements[this.id].y;
}

// @return (int) the width
WireNode.prototype.width = function() {
	return dd.elements[this.id].w;
}

// @return (int) the height
WireNode.prototype.height = function() {
	return dd.elements[this.id].w;
}

// @return (Rectangle) the bounding box
WireNode.prototype.box = function() {
	return new Rectangle(this.x(), this.y(), this.width(), this.height());
}

// @return (DOM node)
WireNode.prototype.createDomNode = function() {	
	var div = createDomNode('div', this.id, 'wireNode');
	this.domNode = div;
	return div;
}


WireNode.prototype.valueChanged = function() {
	this.parentWire.valueChanged();
}

WireNode.prototype.moved = function() {
	this.updateView();
}

WireNode.prototype.dragEnded = function() {
	this.checkForConnections();
}

WireNode.prototype.updateView = function() {
	this.parentWire.updateView();
}

WireNode.prototype.checkForConnections = function() {
	for (var gateKey in this.parentWire.gates) {
		var gate = this.parentWire.gates[gateKey];
		
		if (this.box().overlaps(gate.getOutputBox())) {	// Check connection to an output
			this.setInput(gate);
			this.setOutput(null);
			dd.elements[gate.id].addChild(dd.elements[this.id]);
			return;
		} else if (this.box().overlaps(gate.getInputBox())) {	// Check connection to an intput
			this.setOutput(gate);
			this.setInput(null);
			dd.elements[gate.id].addChild(dd.elements[this.id]);
			return;
		}
	}
	
	// Isn't connected to a gate.
	
	dd.elements['dummy'].addChild(dd.elements[this.id]);
	
	this.setInput(null);
	this.setOutput(null);
}