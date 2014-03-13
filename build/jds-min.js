/*! jds 2014-03-12 */

(function(){var a=this,b=function(){return this instanceof b?void this.init.apply(this,arguments):new b},c=b.prototype,d=function(a){for(var b=Array.prototype.slice.call(arguments,1),c=0,d=b.length;d>c;c++)for(var e in b[c])a[e]=b[c][e]};b.version="0.0.1",b.breaker={},c.init=function(){},c.each=function(){},c.toJSON=function(){},b.extend=function(a){var b=this,c=function(){return b.apply(this,arguments)};d(c,b);var e=function(){this.constructor=c};return e.prototype=b.prototype,c.prototype=new e,d(c.prototype,a),c.__super__=b.prototype,c},"undefined"!=typeof exports?"undefined"!=typeof module&&module.exports&&(exports=module.exports=b):a.JDS=b;var e=(b.Queue=b.extend({init:function(a){return this.queue=a&&a.constructor==Array?a.slice(0):[],this.offset=0,this},enqueue:function(a){return this.queue.push(a),this},dequeue:function(){if(!this.isEmpty()){var a=this.getPeak();return this.offset++,2*this.offset>=this.queue.length&&this._slice(),a}},get:function(a){return this.queue[this.offset+a]},getPeak:function(){return this.get(0)},set:function(a,b){return this.queue[this.offset+a]=b,this},isEmpty:function(){return 0===this.size()},size:function(){return this.queue.length-this.offset},clean:function(){return this.queue=[],this.offset=0,this},each:function(a,c,d,e){var f,g=b.breaker,h=this.queue,i=h.length,j=this.offset;if(c="1"in arguments?j+c:j,d="2"in arguments?j+d:i,e=e||this,d>=c)for(f=c;d>f&&a.call(e,h[f],f-j)!==g;f++);else for(f=c;f>=d&&a.call(e,h[f],f-j)!==g;f--);return this},toJSON:function(){return 0!==this.offset&&this._slice(),JSON.stringify(this.queue)},_slice:function(){this.queue=this.queue.slice(this.offset),this.offset=0}}),b.PriorityQueue=b.Queue.extend({init:function(){return e.__super__.init.apply(this,arguments),this._buildMaxHeap(),this},getPriority:function(a){return a},enqueue:function(){e.__super__.enqueue.apply(this,arguments);for(var a=this.queue.length-1,b=this.queue[a];a>this.offset;){var c,d=Math.floor(a/2);if(!(d>=this.offset&&(c=this.queue[d])))break;if(!(this.getPriority(c)<this.getPriority(b)))break;this.queue[d]=b,this.queue[a]=c,a=d,c=this.queue[d]}return this},dequeue:function(){var a=e.__super__.dequeue.apply(this,arguments);return this.isEmpty()||this._preservePriority(this.queue[this.offset],this.offset),a},_buildMaxHeap:function(){this.each(this._preservePriority,Math.floor(this.size()/2),0,this)},_preservePriority:function(a,b){var c=this.getPriority(a),d=c,e=b,f=2*b+1,g=f+1,h=this.queue.length;if(h>f){var i=this.queue[f],j=this.getPriority(i);j>d&&(d=j,e=f)}if(h>g){var k=this.queue[g],l=this.getPriority(k);l>d&&(d=l,e=g)}if(e!=b){var m=this.queue[e];this.queue[e]=a,this.queue[b]=m,this._preservePriority(a,e)}}}))}).call(this);
//# sourceMappingURL=build/jds-min.map