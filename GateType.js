// AGateType gate base class
function AGateType() {
	this.name = 'Unnamed';
	this.value = false;
	this.minNumInputs = 0;
}

// @return (String)
LogicGate.prototype.toString = function() {
	return this.name;
}

// @return (string)
AGateType.prototype.getClassName = function() {
	return this.name;
}
	
// @param inputs (LogicGate[])
// @return (boolean)
AGateType.prototype.getValue = function(inputs) {
	return false;
}

// primitive true
subclass(TRUE, AGateType);
function TRUE() {
	TRUE.baseConstructor.call(this);
	
	this.name = 'TRUE';
	
	// @param inputs (LogicGate[])
	// @return (boolean)
	this.getValue = function(inputs) {
		return true;
	}
}

// primitive true
subclass(FALSE, AGateType);
function FALSE() {
	FALSE.baseConstructor.call(this);
	
	this.name = 'FALSE';
	
	// @param inputs (LogicGate[])
	// @return (boolean)
	this.getValue = function(inputs) {
		return false;
	}
}

// NOT logic gate object
subclass(NOT, AGateType);
function NOT() {
	NOT.baseConstructor.call(this);
	
	this.name = 'NOT';
	this.minNumInputs = 1;
	
	// @param inputs (LogicGate[])
	// @return (boolean)
	this.getValue = function(inputs) {
		if (inputs.length < this.minNumInputs) {
			return false;
		}
		
		return !inputs[0].value;
	}
}

// OR logic gate object
subclass(OR, AGateType);
function OR() {
	OR.baseConstructor.call(this);
	
	this.name = 'OR';
	this.minNumInputs = 1;
	
	// @param inputs (LogicGate[])
	// @return (boolean)
	this.getValue = function(inputs) {
		if (inputs.length < this.minNumInputs) {
			return false;
		}
		
		var result = false;
		for (var i = 0; i < inputs.length; i++) {
			if (inputs[i].value) {
				result = true;
				break;
			}
		}
		return result;
	}
}

// AND logic gate object
subclass(AND, AGateType);
function AND() {
	AND.baseConstructor.call(this);
	
	this.name = 'AND';
	this.minNumInputs = 1;
	
	// @param inputs (LogicGate[])
	// @return (boolean)
	this.getValue = function(inputs) {
		if (inputs.length < this.minNumInputs) {
			return false;
		}
		
		var result = true;
		for (var i = 0; i < inputs.length; i++) {
			if (!inputs[i].value) {
				result = false;
				break;
			}
		}
		return result;
	}
}

INPUT.nameSuffixCode = "A".charCodeAt(0);
// Input logic gate object
subclass(INPUT, AGateType);
function INPUT() {
	INPUT.baseConstructor.call(this);
	
	this.shortName = String.fromCharCode(INPUT.nameSuffixCode);
	INPUT.nameSuffixCode++;
	
	this.name = 'INPUT ' + this.shortName;
	
	// @param input (LogicGate[])
	// @return (boolean)
	this.getValue = function(inputs) {
		return this.value;
	}
}

// @return (string)
INPUT.prototype.getClassName = function() {
	return 'INPUT';
}

OUTPUT.nameSuffixCode = "N".charCodeAt(0);
// Input logic gate object
subclass(OUTPUT, AGateType);
function OUTPUT() {
	OUTPUT.baseConstructor.call(this);
	
	this.shortName = String.fromCharCode(OUTPUT.nameSuffixCode);
	OUTPUT.nameSuffixCode++;
	
	this.name = 'OUTPUT ' + this.shortName;	
	
	this.minNumInputs = 1;

	// @param input (LogicGate[])
	// @return (boolean)
	this.getValue = function(inputs) {
		if (inputs.length < this.minNumInputs) {
			return false;
		}
		
		return inputs[0].value;
	}
}

// @return (string)
OUTPUT.prototype.getClassName = function() {
	return 'OUTPUT';
}

// Enum for the different gate types
var GateType = { TRUE:new TRUE(), FALSE:new FALSE(), NOT:new NOT(), OR:new OR(), AND:new AND() };