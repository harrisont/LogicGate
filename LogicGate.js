// Logic gate object
// @param gateType (GateType)
LogicGate.idSuffix = 0;
function LogicGate(gateType) {
	this.gateType = gateType;
	
	this.id = 'gate' + LogicGate.idSuffix;
	LogicGate.idSuffix++;
	
	this.inputs = new Object();
	
	// Forward GateType methods to the gateType variable
	this.className = gateType.getClassName();
	this.name = gateType.name;
	this.minNumInputs = gateType.minNumInputs;
	
	this.valueChangedListeners = {};
}

// @return (String)
LogicGate.prototype.toString = function() {
	return this.id;
}

// @param listener (object that implements valueChanged() and toString())
LogicGate.prototype.addValueChangedListener = function(listener) {
	this.valueChangedListeners[listener] = listener;
};

// @param listener (object that implements valueChanged() and toString())
LogicGate.prototype.removeValueChangedListener = function(listener) {
	delete this.valueChangedListeners[listener];
};
	
// @return (string[]) the inputs
LogicGate.prototype.getInputList = function() {
	var inputList = new Array();
	for (key in this.inputs) {
		inputList[inputList.length] = this.inputs[key];
	}
	return inputList;
}

// @return (int) the x coordinate
LogicGate.prototype.x = function() {
	return dd.elements[this.id].x;
}

// @return (int) the y coordinate
LogicGate.prototype.y = function() {
	return dd.elements[this.id].y;
}

// @return (int) the width
LogicGate.prototype.width = function() {
	return dd.elements[this.id].w;
}

// @return (int) the height
LogicGate.prototype.height = function() {
	return dd.elements[this.id].w;
}

// @return (Rectangle) the bounding box
LogicGate.prototype.box = function() {
	return new Rectangle(this.x(), this.y(), this.width(), this.height());
}

// @return (Rectangle) the bounding box for the inputs
LogicGate.prototype.getInputBox = function() {
	if (this.minNumInputs == 0) {
		return new Rectangle(this.x(), this.y(), 0, this.height());
	} else {
		return new Rectangle(this.x(), this.y(), this.width() / 2, this.height());
	}
}

// @return (Rectangle) the bounding box for the outputs
LogicGate.prototype.getOutputBox = function() {
	if (this.minNumInputs == 0) {
		return this.box();
	} else {
		return new Rectangle(this.x() + this.width() / 2, this.y(), this.width() / 2, this.height());
	}
}

// @return (DOM node)
LogicGate.prototype.createDomNode = function() {
	// Create the outer layer
	var div = createDomNode('div', this.id, 'logicGate ' + this.className + 'gate');
	
	// Create the divider if there are inputs
	if (this.minNumInputs > 0) {
		// Divider
		div.appendChild(createDomNode('div', '', 'gateDivider'));
		
		// Output area
		div.appendChild(createDomNode('div', '', 'outputArea'));
	}

	// Create a text div with the text, all appended to div.
	var textDiv = createDomNode('div', '', 'gateText');
	textDiv.appendChild(document.createTextNode(this.name));
	div.appendChild(textDiv);
	
	this.domNode = div;
	return div;
}

// @param input (LogicGate)
LogicGate.prototype.addInput = function(input) {
	this.inputs[input.id] = input;
}

// @param input (LogicGate)
LogicGate.prototype.removeInput = function(input) {
	delete this.inputs[input.id];
	this.valueChanged();
}

LogicGate.prototype.valueChanged = function() {
	for (var valueChangedListenerKey in this.valueChangedListeners) {
		this.valueChangedListeners[valueChangedListenerKey].valueChanged();
	}
}

// @return (boolean)
LogicGate.prototype.getValue = function() {
	return this.gateType.getValue(this.getInputList());
}

// Only used for gates where the value is manually set (e.x. input gates).
// @param value (boolean)
LogicGate.prototype.setValue = function(value) {
	this.gateType.value = value;
	this.valueChanged();
}