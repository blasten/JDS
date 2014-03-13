# JDS

High performance data structures for JavaScript.

## How to use
### Node

Install it with NPM or add it to your package.json:

```
$ npm install jds
```

Then

```js
var JDS = require('jds');
```

### Browser

Copy ``build/jds.js`` in a public folder and then insert the HTML code:

```html
<script src="jds.js" type="text/javascript"></script>
```

## Development
### Build
```
$ grunt build
```

### Test
```
$ grunt test
```

## Data Structures
### Queue

First in first out.

```js
  var queue = new JDS.Queue([1]);
  
  // 1
  console.log(queue.dequeue());

  // true
  console.log(queue.empty());
  
  queue.enqueue(10)
    .enqueue(20)
    .enqueue(30);
  
  // 3
  console.log(queue.size());

  // 10, 20, 30
  queue.each(function(value, index) {
    console.log(value);
  });

  // [10, 20, 30]
  queue.toJSON();
```

### PriorityQueue

Maintains elements sorted in descending order by their priorities

```js
  var pqueue = new JDS.PriorityQueue([5, 4, 0, 9, 7, 3]);
  
  // 9
  console.log(queue.dequeue());
  
  // 7
  console.log(queue.dequeue());

  // 4
  console.log(queue.size());

  queue.clean();

  // 0
  console.log(queue.size());

  queue.enqueue(100);

  // 100
  console.log(queue.getPeek());
```

You can extend ``JDS.PriorityQueue`` to meet the requirements of your data

```js
  var DistanceQueue = new JDS.PriorityQueue.extend({
    getPriority: function(element) {
      return element.x*element.x + element.y*element.y;
    }
  });

  var dqueue = new DistanceQueue();

  queue.enqueue({x: 200, y: 200});
  queue.enqueue({x: 100, y: 100});

  // 200 200
  console.log(queue.getPeek().x, queue.getPeek().y);
```

## License

(The MIT License)

Copyright (c) 2014 Emmanuel Garcia &lt;blasten@gmail.com&gt;
