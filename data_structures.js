//Array-based queue
function Queue(size) {
	this.data = [];
	this.reserved = 0;
	var count = (Number.isInteger(size) && size > 16 && size) || 32;
	this.reserve(count);
	//keep track of where we'll 
	this.head = 0;
	this.tail = 0;
	
}

//dir enum
Dir = {
	NONE:0,
	LEFT:1,
	RIGHT:2,
};
if(Object.freeze)
	Object.freeze(Dir);



Queue.prototype = {
	reserve: function(count){
		if(count < this.reserved)
			return;
		var nData = new Array(count);

		var i;
		for(i = 0; i < (this.tail-this.head)%this.reserved; ++i)
			nData[i] = this.data[(this.head+i)%this.reserved];
		this.head = 0;
		this.tail = (this.tail-this.head)%this.reserved;
		this.reserved = count;
	},
	enqueue: function(val){
		//make sure the queue doesn't get completely full, or we can't tell if it's full or empty.
		if( (this.tail - this.head) % this.reserved == this.reserved - 1)
			this.reserve(this.reserved*2);

		this.data[this.tail] = val;
		this.tail = (this.tail + 1) % this.reserved;
	},
	dequeue: function() {
		if(this.head == this.tail)
			throw "Can't dequeue when empty!";
		var val = this.data[this.head];
		this.head = (this.head+1)%this.reserved;
		return val;
	},
	isEmpty: function() {
		return this.head == this.tail;
	}
};

//Binary Tree with removeFirst
function BinaryTree(size, lessThan, equiv) {
	this.reserved = 0;
	this.data = [];
	this.left = [];
	this.right = [];
	//keep track of empty spaces we can use, so data is roughly contiguous in memory.
	this.free = [];
	var count = (Number.isInteger(size) && size > 31 && size) || 256;
	this.reserve(count);

	this.root = -1;
	// to determine rank	
	this.less = lessThan || function(a,b) { return a < b; };
	// to determine if data should be replaced
	this.eq = equiv || function(a,b) {return a == b; };
	this.tail = 0;
}

BinaryTree.prototype = {
	isEmpty: function() {
		return this.root < 0;
	},
	nextFree: function(){
		if(this.free.isEmpty())
			return this.tail++;
		else
			return this.free.dequeue();
	},
	getDir: function(i,val) {
		return this.less(val,this.data[i])?Dir.LEFT:Dir.RIGHT;
	},
	getChild: function(i,dir){
		if(dir == Dir.LEFT)
			return this.left[i];
		else if(dir == Dir.RIGHT)
			return this.right[i];
		else throw "invalid direction, no child to get";
	},
	setChild: function(i,dir,child){
		if(dir == Dir.LEFT)
			this.left[i] = child;
		else if(dir == Dir.RIGHT)
			this.right[i] = child;
		else throw "invalid direction, no child set";
			
	},
	store: function(val){
		var index = this.nextFree();
		this.data[index] = val;
		this.left[index] = -1;
		this.right[index] = -1;
		return index;
	},
	insert: function(val){
		if(tail == this.reserved){
			this.reserve(this.reserved*2);
		}
		
		if(root < 0) {
			this.root = this.store(val);
		}
		else {
			insertAt(this.root,val);
		}
		
	},
	insertAt: function(i,val) {
		if(this.equiv(val,this.data[i])){
			this.data[i] = val;
			return false;
		}
		var dir = this.getDir(i,val);
		var child = this.getChild(i,dir);
		
		if(child == -1){
			this.setChild(i,dir,this.store(val));
			return true;
		}
		else {
			return this.insertAt(child,val) && balanceAt(i);
		}
	},
	balanceAt: function(i){
		//TODO
		return true;
	},
	rotate: function(i,dir){
		//TODO
	},
	reserve: function(count){
		if(count < this.reserved)
			return;
		
		//chrome (and presumably other browsers) can optimize arrays
		//	as long as their size is static, so we create new arrays
		//	instead of growing existing ones.
		var nData = new Array(count);
		var nLeft = new Array(count);
		var nRight = new Array(count);
		var nFree = new Array(count);

		var i;
		for(i = 0; i < this.reserved; ++i){
			nData[i] = this.data[i];
			nLeft = this.left[i];
			nRight = this.right[i];
			nFree = this.free[i];
		}
		for(i = this.reserved; i < count; ++i){
			nData[i] = null;
			nLeft[i] = -1;
			nRight[i] = -1;
			nFree[i] = -1;
		}
		this.data = nData;
		this.left = nLeft;
		this.right = nRight;
		this.free = nFree;
		this.reserved = count;
	}
};
