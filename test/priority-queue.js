var expect = require('expect.js');
var JDS = require('../build/jds');

describe('JDS.PriorityQueue', function() {

  it('should extend `JDS.Queue`', function() {
    var pqueue = new JDS.PriorityQueue();
    expect(pqueue instanceof JDS.Queue).to.be(true);
  });

   it('should accept a initial list', function() {
    var list = [1, 2, 3, 4, 5];
    var pqueue = new JDS.PriorityQueue(list);
    expect(pqueue.getPeek()).to.be(list[list.length-1]);
  });


  describe('#Peek()', function() {
    it('should return the element with the maximum priority', function() {
      var size = 10000;
      var maxPriority = 0;
      var pqueue = new JDS.PriorityQueue();

      var  t = (new Date()).getTime();
      for (var i = 0; i < size; i++) {
        value = Math.random() * 100;
        if (value > maxPriority) {
          maxPriority = value;
        }
        pqueue.enqueue(value);
      }
      expect(pqueue.getPeek()).to.be(maxPriority);
    });
  });

  describe('#getPriority()', function() {
    it('should return the priority of the element', function() {
      var size = 10000;
      var maxPriority = 0;
      var CustomizedPriorityQueue = JDS.PriorityQueue.extend({
        getPriority: function(element) {
          return element.x*element.x + element.y*element.y;
        }
      });
      var pqueue = new CustomizedPriorityQueue();

      for (var i = 0; i < size; i++) {
        var point2d = {x: Math.random()*100, y: Math.random()*100};
        var priority = pqueue.getPriority(point2d);

        pqueue.enqueue(point2d);

        if (priority > maxPriority) {
          maxPriority = priority;
        }
      }

      expect(pqueue.getPriority(pqueue.getPeek())).to.be(maxPriority);
    });
  });

  describe('#dequeue()', function() {
    it('should preserve the priority', function() {

      var list = [1, 2, 3, 4, 5];
      var pqueue = new JDS.PriorityQueue(list);

      while (!pqueue.isEmpty()) {
        expect(pqueue.getPeek()).to.be(list.pop());
        pqueue.dequeue();
      }

    });
  });

  describe('#enqueue()', function() {
    it('should preserve the priority', function() {
      var list = [1, 2, 3, 4, 5],
          max = 0,
          pqueue = new JDS.PriorityQueue(list);

      while ((val = list.pop())) {
        pqueue.enqueue(val);
        if (val > max) {
          max = val;
        }
      }

      expect(pqueue.getPeek()).to.be(max);
    });

  });
});