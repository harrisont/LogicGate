var settings = {
	dragOpacity: 0.6,
	minGateSize: 50
	};

// @param gateArea (DOM object)
function Main(gateArea)
{
	this.gateArea = gateArea;

	this.compoundGates = {};
}

// @return (LogicGate[])
Main.prototype.getInputs = function() {
	return this.compoundGatePrimary.inputs;
}

// @return (LogicGate[])
Main.prototype.getOutputs = function() {
	return this.compoundGatePrimary.outputs;
}

// @return (CompoundGate) the compound gate added
Main.prototype.createAndAddCompoundGate = function() {
	var compoundGate = new CompoundGate(this.gateArea);
	this.compoundGates[compoundGate.id] = compoundGate;
	return compoundGate;
}

// @param gateType (GateType)
// @return (LogicGate) the gate added
Main.prototype.createAndAddGate = function(gateType) {
	return this.compoundGatePrimary.createAndAddGate(gateType);
}

// @return (LogicGate) the gate added
Main.prototype.createAndAddInputGate = function() {
	var gate = this.createAndAddGate(new INPUT());
	this.getInputs()[this.getInputs().length] = gate;
	return gate;
}

// @return (LogicGate) the gate added
Main.prototype.createAndAddOutputGate = function() {
	var gate = this.createAndAddGate(new OUTPUT());
	this.getOutputs()[this.getOutputs().length] = gate;
	return gate;
}

// @return (Wire) the wire added
Main.prototype.createAndAddWire = function() {
	return this.compoundGatePrimary.createAndAddWire();
}

Main.prototype.generateTruthTable = function() {
	var str = '<table><tr>'
		+ '<th colspan="' + this.getInputs().length + '">Inputs</td>'
		+ '<th class="firstTruthTableOutput" colspan="' + this.getOutputs().length + '">Outputs</td>'
		+ '</tr><tr>';
	for (var i = 0; i < this.getInputs().length; i++) {
		var input = this.getInputs()[i];
		str += '<th class="truthTableInput truthTableInputHeader">'
			+ input.gateType.shortName
			+ '</th>';
		input.gateType.value = false;
		input.valueChanged();
	}
	for (var i = 0; i < this.getOutputs().length; i++) {
		var output = this.getOutputs()[i];
		var classValue = 'truthTableOutput truthTableOuputHeader';
		if (i == 0)
			classValue += ' firstTruthTableOutput';
		str += '<th class="' + classValue + '">'
			+ output.gateType.shortName
			+ '</th>';
	}
	str += '</tr>';

	var running = true;
	while (running) {
		str += '<tr>';
		for (var i = 0; i < this.getInputs().length; i++) {
			var input = this.getInputs()[i];
			str += '<td class="truthTableInput">'
				+ (input.gateType.value == true ? 1 : 0)
				+ '</td>';
		}
		for (var i = 0; i < this.getOutputs().length; i++) {
			var output = this.getOutputs()[i];
			var classValue = 'truthTableOutput';
			if (i == 0)
				classValue += ' firstTruthTableOutput';
			str += '<td class="' + classValue + '">'
				+ (output.getValue() == true ? 1 : 0)
				+ '</td>';
		}
		str += '</tr>';
		
		for (var i = 0; i < this.getInputs().length; i++) {
			var input = this.getInputs()[i];
			
			// Flip the value
			input.setValue(!input.gateType.value);
			
			// Only change one gate to true for each row of the table.
			if (input.gateType.value == true) {
				break;
			} else if (i >= this.getInputs().length - 1) { // value is 0 and this is the last input
				running = false;
			}
		}
	}
	
	str += '</table>';
	
	document.getElementById('truthTable').innerHTML = str;
}

var main;
function onLoad() {
	var gateArea = document.getElementById('gateArea');
	main = new Main(gateArea);
	
	// Possibly have more than one compound gate in the future, but only 1 for now.
	main.compoundGatePrimary = main.createAndAddCompoundGate();
	
	// OUTPUT(AND(INPUT1,INPUT2)) circuit
	{
		var inputGate1 = main.createAndAddInputGate();
		dd.elements[inputGate1.id].moveTo(100, 150);
		
		var inputGate2 = main.createAndAddInputGate();
		dd.elements[inputGate2.id].moveTo(inputGate1.x(), inputGate1.box().bottom() + 20);
		
		var andGate = main.createAndAddGate(GateType.AND);
		dd.elements[andGate.id].moveTo(inputGate1.x() + 200, (inputGate1.y() + inputGate2.y()) / 2);
		
		var outputGate1 = main.createAndAddOutputGate();
		dd.elements[outputGate1.id].moveTo(andGate.x() + 200, andGate.y());
		
		// Wiring
		{
			var wireInput1ToAnd = main.createAndAddWire();
			attachWireNodeToGate(wireInput1ToAnd.node1, inputGate1, inputGate1.getOutputBox());
			attachWireNodeToGate(wireInput1ToAnd.node2, andGate, andGate.getInputBox());
			
			var wireInput2ToAnd = main.createAndAddWire();
			attachWireNodeToGate(wireInput2ToAnd.node1, inputGate2, inputGate2.getOutputBox());
			attachWireNodeToGate(wireInput2ToAnd.node2, andGate, andGate.getInputBox());
			dd.elements[wireInput2ToAnd.node2.id].moveBy(0, 33);
			
			var wireAndToOutput = main.createAndAddWire();
			attachWireNodeToGate(wireAndToOutput.node1, andGate, andGate.getOutputBox());
			attachWireNodeToGate(wireAndToOutput.node2, outputGate1, outputGate1.getInputBox());
		}
	}
	
	// NOT(OR(TRUE,FALSE)) circuit
	{
		var trueGate = main.createAndAddGate(GateType.TRUE);
		dd.elements[trueGate.id].moveTo(inputGate2.x(), inputGate2.box().bottom() + 20);
		
		var falseGate = main.createAndAddGate(GateType.FALSE);
		dd.elements[falseGate.id].moveTo(trueGate.x(), trueGate.box().bottom() + 20);
		
		var orGate = main.createAndAddGate(GateType.OR);
		dd.elements[orGate.id].moveTo(andGate.x(), (trueGate.y() + falseGate.y()) / 2);
		
		var notGate = main.createAndAddGate(GateType.NOT);
		dd.elements[notGate.id].moveTo(outputGate1.x(), orGate.y());
		
		var outputGate2 = main.createAndAddOutputGate();
		dd.elements[outputGate2.id].moveTo(notGate.x() + 200, orGate.y());
		
		// Wiring
		{
			var wireTrueToOr = main.createAndAddWire();
			attachWireNodeToGate(wireTrueToOr.node1, trueGate, trueGate.getOutputBox());
			attachWireNodeToGate(wireTrueToOr.node2, orGate, orGate.getInputBox());
			
			var wireFalseToOr = main.createAndAddWire();
			attachWireNodeToGate(wireFalseToOr.node1, falseGate, falseGate.getOutputBox());
			attachWireNodeToGate(wireFalseToOr.node2, orGate, orGate.getInputBox());
			dd.elements[wireFalseToOr.node2.id].moveBy(0, 33);
			
			var wireOrToNot = main.createAndAddWire();
			attachWireNodeToGate(wireOrToNot.node1, orGate, orGate.getOutputBox());
			attachWireNodeToGate(wireOrToNot.node2, notGate, notGate.getInputBox());
			
			var wireNotToOutput = main.createAndAddWire();
			attachWireNodeToGate(wireNotToOutput.node1, notGate, notGate.getOutputBox());
			attachWireNodeToGate(wireNotToOutput.node2, outputGate2, outputGate2.getInputBox());
		}
	}
}

// @param wireNode (WireNode)
// @param gate (LogicGate)
// @param rect (Rectangle): the rectangle to center the wire-node in.
function attachWireNodeToGate(wireNode, gate, rect) {
	var nodeCenter = rect.center().add(wireNode.box().size().scale(-0.5));
	dd.elements[wireNode.id].moveTo(nodeCenter.x, nodeCenter.y);
	wireNode.checkForConnections();
}