define(['core', './queue'], function(JDS) {

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

});