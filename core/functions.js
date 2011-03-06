Array.prototype.last = function(t) {
	if (t !== undefined) {
		this[this.length - 1] = t;
	} else {
		return this[this.length - 1];
	}
}

Array.prototype.fromEnd = function(idx, t) {
	if (t !== undefined) {
		this[this.length - (idx + 1)] = t;
	} else {
		return this[this.length - (idx + 1)];
	}
}

function html5_storage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}
