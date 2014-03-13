define(['core'], function(JDS) {
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

});