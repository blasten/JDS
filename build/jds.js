/*
 * JDS ~ JavaScript Data Structures
 *
 * Copyright (c) 2014 Emmanuel Garcia, contributors
 * Licensed under the MIT license.
 */
(function() {
var root = this;

  var JDS = function() {
    if (!(this instanceof JDS)) {
      return new JDS();
    }
    this.init.apply(this, arguments);
  };

  var JDSProto = JDS.prototype;

  var extend = function(obj) {
    var args = Array.prototype.slice.call(arguments, 1);

    for (var i = 0, len = args.length; i < len; i++) {
      for (var prop in args[i]) {
        obj[prop] = args[i][prop];
      }
    }
  };

  JDS.version = '0.0.1';

  // Establish the object that gets returned to break out of a loop 
  // iteration.
  JDS.breaker = {};

  //
  JDSProto.init = function() {};
  
  //
  JDSProto.each = function(iterator, from, to, context) {};
  
  //
  JDSProto.toJSON = function() {};

  JDS.extend = function(protoProps) {
    var parent = this;
    var child = function(){ return parent.apply(this, arguments); };
    
    // Extend static properties to the constructor function
    extend(child, parent);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    var Dummy = function(){ this.constructor = child; };
    Dummy.prototype = parent.prototype;
    child.prototype = new Dummy();

    // Extend the child's prototype
    extend(child.prototype, protoProps);

    // Set a property to point to the parent's prototype
    child.__super__ = parent.prototype;

    return child;
  };

  // Export the JDS object for Node.js
  // If we are in the browser, add `JDS` as a global object via string identifier
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = JDS;
    }
  } else {
    root.JDS = JDS;
  }

// Queue
  // It is a first in first out data structure that allows to 
  // insert and remove elements in O(1)


  var Queue = JDS.Queue = JDS.extend({

    // Initialize the queue with a default list
    
    init: function(queue) {
      this.queue = (queue && queue.constructor == Array) ? queue.slice(0) : [];
      this.offset = 0;
      return this;
    },
    
    // Enqueue an element onto the queue
    
    enqueue: function(value) {
      this.queue.push(value);
      return this;
    },
    
    // Dequeue an element from the queue
    
    dequeue: function() {
      if (!this.isEmpty()) {
        var peek = this.getPeak();
        this.offset++;
        // Amortize O(n) cost of slicing by n/2
        if (this.offset*2 >= this.queue.length) {
          this._slice();
        }
        return peek;
      }
    },
    
    // Get the element at position `index`
    
    get: function(index) {
      return this.queue[this.offset + index];
    },
    
    // Get the peak element of the queue
    
    getPeak: function() {
      return this.get(0);
    },
    
    // Set the value for an element at position `index`
    
    set: function(index, value) {
      this.queue[this.offset + index] = value;
      return this;
    },
    
    // Return true if the queue is empty

    isEmpty: function() {
      return this.size() === 0;
    },

    // Return the size of the queue

    size: function () {
      return this.queue.length - this.offset;
    },

    // Clean the queue by removing all the values

    clean: function() {
      this.queue = [];
      this.offset = 0;
      return this;
    },

    // Loop through each element in the queue using a `iterator` function 
    // and a `context` in which that function is called.  If `context` is 
    // omited `iterator` will be bound to the Queue instance.
    // The loop may stop if `iterator` returns `JDS.breaker`

    each: function(iterator, from, to, context) {
      var i;
      var breaker = JDS.breaker;
      var queue = this.queue;
      var length = queue.length;
      var offset = this.offset;

      from = ('1' in arguments) ? offset+from : offset;
      to = ('2' in arguments) ? offset+to : length;
      context = context || this;

      if (to >= from) {
        for (i = from; i < to; i++) {
          if (iterator.call(context, queue[i], i-offset) === breaker) {
            break;
          }
        }
      } else {
         for (i = from; i >= to; i--) {
          if (iterator.call(context, queue[i], i-offset) === breaker) {
            break;
          }
        }
      }

      return this;
    },
    
    // Serialize the Queue, so it can be transferred over a network.
    // This method returns the JSON representation of the Queue.
    
    toJSON: function() {
      if (this.offset !== 0) {
        this._slice();
      }
      return JSON.stringify(this.queue);
    },
    
    // Slice the queue to remove wasted space in front of the array
    // This is a costly operation O(n), so it's avoided when possible
    _slice: function() {
      this.queue = this.queue.slice(this.offset);
      this.offset = 0;
    }
  });

// PriorityQueue 
  // It maintains elements in the queue sorted in descending order by their priorities
  // This implementation is based on Heaps (Trees) which offers a very efficient mechanism 
  // to preserve the order of the elements in the queue by their priorities.

  var PriorityQueue = JDS.PriorityQueue = JDS.Queue.extend({
    
    // Initialize the queue with a default list

    init: function(queue) {
      PriorityQueue.__super__.init.apply(this, arguments);
      
      // Preserve the priority

      this._buildMaxHeap();
      return this;
    },

    // Get the priority of an element of the queue
    // A subclass of this type could override this method to customize
    // the way to determinate the priority. For example, if you want to
    // associate the distance between a point and the origin on a plane
    // as the priority, you could extend this class and  redefine  this 
    // method:
    //
    // getPriority: function(element) {
    //    return element.x * element.y;
    // }

    getPriority: function(element) {
      return element;
    },

    // Insert an element in the queue

    enqueue: function(element) {
      PriorityQueue.__super__.enqueue.apply(this, arguments);
      var i = this.queue.length-1, currentEl = this.queue[i];

      // Maintain the property P[parent] >= P[leftChild] >= P[rightChild] in O(log n)
      // by comparing the priority of the recently enqueued element with its parent
      // if the parent has a smaller priority then swap the elements and repeat the check 
      // until it reaches the root or the condition holds

      while (i > this.offset) {
        var parentEl, parentIndex = Math.floor(i/2);

        if (parentIndex >= this.offset && (parentEl = this.queue[parentIndex])) {
          if (this.getPriority(parentEl) < this.getPriority(currentEl)) {
            this.queue[parentIndex] = currentEl;
            this.queue[i] = parentEl;
            i = parentIndex;
            parentEl = this.queue[parentIndex];
          } else {
            break;
          }
        } else {
          break;
        }
      }

      return this;
    },

    // Remove the first in element which priority is the highest and
    // return it

    dequeue: function() {
      var max = PriorityQueue.__super__.dequeue.apply(this, arguments);

      if (!this.isEmpty()) {
        this._preservePriority(this.queue[this.offset], this.offset);
      }

      return max;
    },

    // The other half of elements represent leaves, so it will be a waste
    // to heapify those nodes

    _buildMaxHeap: function() {
      this.each(this._preservePriority,
          Math.floor(this.size()/2), 0, this);
    },

    // Preserve the priority of the elements in the subtree of `element`
    // 
    // This method runs in O(log n) since in the worst case it will hit 
    // each level in the tree until it reaches the leaves.

    _preservePriority: function(element, index) {
      var elPriority = this.getPriority(element),
          maxPriority = elPriority,
          maxPriorityIndex = index,
          leftChildIndex = index*2 + 1,
          rightChildIndex = leftChildIndex+1,
          queueLength = this.queue.length;
  
      if (leftChildIndex < queueLength) {
        var leftChild = this.queue[leftChildIndex],
            leftChildPriority = this.getPriority(leftChild);
        
        // If the priority of the left child is greater than the parent's priority
        // it will keep track and swap them

        if (leftChildPriority > maxPriority) {
          maxPriority = leftChildPriority;
          maxPriorityIndex = leftChildIndex;
        }
      }

      if (rightChildIndex < queueLength) {
        var rightChild = this.queue[rightChildIndex],
            rightChildPriority = this.getPriority(rightChild);

        // If the priority of the right child is greater than the parent's priority
        // it will keep track and swap them

        if (rightChildPriority > maxPriority) {
          maxPriority = rightChildPriority;
          maxPriorityIndex = rightChildIndex;
        }
      }

      if (maxPriorityIndex != index) {
        // Swap queue[index] and queue[maxPriorityIndex]
        var tmp = this.queue[maxPriorityIndex];
        this.queue[maxPriorityIndex] = element;
        this.queue[index] = tmp;

        // Repeat the process for the child node that was swaped
        this._preservePriority(element, maxPriorityIndex);
      }
    }
  });


}).call(this);