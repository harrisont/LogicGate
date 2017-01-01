// Vector object
// @param x (int)
// @param y (int)
function Vector(x, y) {
	this.x = x;
	this.y = y;
}

// @param factor (float)
// @return (Vector) the scaled vector
Vector.prototype.scale = function(factor) {
	return new Vector(this.x * factor, this.y * factor);
}

// @param otherVector (Vector)
// @return (Vector) the sum of the vectors
Vector.prototype.add = function(otherVector) {
	return new Vector(this.x + otherVector.x, this.y + otherVector.y);
}