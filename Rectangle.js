// Rectangle object
// @param x (int)
// @param y (int)
// @param width (int)
// @param height (int)
function Rectangle(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
}
	
// @return (int) the coordinate of the right side of the rectangle
Rectangle.prototype.right = function() {
	return this.x + this.width;
}
	
// @return (int) the coordinate of the bottom side of the rectangle
Rectangle.prototype.bottom = function() {
	return this.y + this.height;
}

// @param other (Rectangle)
// @return (boolean) true if the rectangles overlap, false otherwise
Rectangle.prototype.overlaps = function (other) {
	var thisRight = this.right();
	var otherRight = other.right();
	var thisBottom = this.bottom();
	var otherBottom = other.bottom();
	if (((this.x > other.x && this.x < otherRight) || (thisRight > other.x && thisRight < otherRight)) &&
		((this.y > other.y && this.y < otherBottom) || (thisBottom > other.y && thisBottom < otherBottom)))
	{
		return true;
	}
}

// @return (Vector) the size of the rectangle
Rectangle.prototype.size = function() {
	return new Vector(this.width, this.height);
}

// @return (Vector) the center of the rectangle
Rectangle.prototype.center = function() {
	var centerX = this.x + this.width/2;
	var centerY = this.y + this.height/2;
	return new Vector(centerX, centerY);
}