var expect = require('expect.js');
var JDS = require('../build/JDS');

describe('JDS.Queue', function() {

  describe('#size()', function() {
    it('should return the number of elements in the queue', function() {
      var list = [1, 2, 3, 4, 5];
      var queue = new JDS.Queue(list);
      expect(queue.size()).to.be(list.length);
    });
  });

  describe('#clean()', function() {
    it('should empty the queue', function() {
      var queue = new JDS.Queue([1, 2, 3, 4, 5]);
      queue.clean();
      
      expect(queue.size()).to.be(0);
    });
  });

  describe('#enqueue(element)', function() {
    it('should increase the size', function() {
      var queue = new JDS.Queue();
      var size = Math.round(Math.random()*100);

      for (var i = 0; i < size; i++) {
       queue.enqueue(i);
      }
        
      expect(queue.size()).to.be(size);
    });

    it('should return an instance to itself for chaining', function() {
      var queue = new JDS.Queue();
      expect(queue.enqueue(1)).to.be(queue);
    });
  });

  describe('#dequeue()', function() {
    it('should decrease the size', function() {
      var queue = new JDS.Queue([1]);
      expect(queue.size()).to.be(1);
      
      queue.dequeue();
      expect(queue.size()).to.be(0);
    });

    it('should return the Peek', function() {
      var queue = new JDS.Queue([1, 2, 3, 4]);
      var Peek = queue.getPeek();

      expect(queue.dequeue()).to.be(Peek);
    });
  });

  describe('#get(ith)', function() {
    it('should return the ith element', function() {
      var queue = new JDS.Queue();
      var size = Math.round(Math.random()*1000);
      var i;

      for (i = 0; i < size; i++) {
        queue.enqueue(i);
      }

      for (i = 0; i < queue.size(); i++) {
        expect(queue.get(i)).to.be(i*2);
        queue.dequeue();
      }

    });
  });

  describe('#isEmpty()', function() {
    it('should return `true` when the queue is empty', function() {
      var queue = new JDS.Queue([1, 2, 3, 4]);
      queue.clean();
      expect(queue.isEmpty()).to.be(true);
    });

    it('should return `false` when the queue is not empty', function() {
      var queue = new JDS.Queue([1, 2, 3, 4]);
      expect(queue.isEmpty()).to.not.be(true);
    });
  });
});