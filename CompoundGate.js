// CompoundGate logic gate object
// @param gateArea (DOM object)
function ACompoundGate(gateArea) {
	this.gateArea = gateArea;
	this.gates = {};
	this.inputs = [];
	this.outputs = [];
}

// CompoundGate logic gate object
subclass(CompoundGate, ACompoundGate);
function CompoundGate(gateArea) {
	CompoundGate.baseConstructor.call(this, gateArea);
}

// @param gate (LogicGate)
CompoundGate.prototype.addGate = function(gate) {
	this.gates[gate.id] = gate;
	
	var newNode = gate.createDomNode();
	this.gateArea.appendChild(newNode);
	
	ADD_DHTML(gate.id + RESIZABLE + MINWIDTH+settings.minGateSize + MINHEIGHT+settings.minGateSize);
}

// @param gateType (GateType)
// @return (LogicGate) the gate added
CompoundGate.prototype.createAndAddGate = function(gateType) {
	var gate = new LogicGate(gateType);
	this.addGate(gate);
	return gate;
}

// @param wire (Wire)
CompoundGate.prototype.addWire = function(wire) {
	var node = wire.createDomNode();
	this.gateArea.appendChild(node);
	
	ADD_DHTML(wire.node1.id);
	ADD_DHTML(wire.node2.id);
	
	// Setup the canvas
	wire.canvas = new jsGraphics(wire.id);
	wire.canvas.setColor(wireColor);
	wire.canvas.setStroke(wireThickness);
	
	// Offset the second node so they don't overlap
	dd.elements[wire.node2.id].moveBy(64, 0);
	
	wire.updateView();
	wire.valueChanged();
	
	// Register the wire nodes for movement notification.
	dd.elements[wire.node1.id].addMoveListener(wire.node1);
	dd.elements[wire.node2.id].addMoveListener(wire.node2);
	
	// Register the wire nodes for drag-ended notification.
	dd.elements[wire.node1.id].addDragEndedListener(wire.node1);
	dd.elements[wire.node2.id].addDragEndedListener(wire.node2);
}

// @return (Wire) the wire added
CompoundGate.prototype.createAndAddWire = function() {
	var wire = new Wire(this.gates);
	this.addWire(wire);
	return wire;
}