define(function() {
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

  JDS.version = '%version%';

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
    exports.JDS = JDS;
  } else {
    root.JDS = JDS;
  }

  return JDS;
});