!function(c){function e(e){for(var t,n,i=e[0],r=e[1],o=e[2],s=0,a=[];s<i.length;s++)n=i[s],l[n]&&a.push(l[n][0]),l[n]=0;for(t in r)Object.prototype.hasOwnProperty.call(r,t)&&(c[t]=r[t]);for(p&&p(e);a.length;)a.shift()();return f.push.apply(f,o||[]),u()}function u(){for(var e,t=0;t<f.length;t++){for(var n=f[t],i=!0,r=1;r<n.length;r++){var o=n[r];0!==l[o]&&(i=!1)}i&&(f.splice(t--,1),e=s(s.s=n[0]))}return e}var n={},l={0:0},f=[];function s(e){if(n[e])return n[e].exports;var t=n[e]={i:e,l:!1,exports:{}};return c[e].call(t.exports,t,t.exports,s),t.l=!0,t.exports}s.m=c,s.c=n,s.d=function(e,t,n){s.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},s.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.t=function(t,e){if(1&e&&(t=s(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(s.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)s.d(n,i,function(e){return t[e]}.bind(null,i));return n},s.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="";var t=window.webpackJsonp=window.webpackJsonp||[],i=t.push.bind(t);t.push=e,t=t.slice();for(var r=0;r<t.length;r++)e(t[r]);var p=i;f.push([1383,1]),u()}({1383:function(e,t,n){"use strict";n.r(t);var i=n(67),o=n.n(i);function r(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}var u=function(){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),this.keys=e.input.keyboard.addKeys("W,A,S,D,up,left,down,right,space")}var e,n,i;return e=t,(n=[{key:"isUp",get:function(){return this.keys.up.isDown||this.keys.W.isDown}},{key:"isDown",get:function(){return this.keys.down.isDown||this.keys.S.isDown}},{key:"isLeft",get:function(){return this.keys.left.isDown||this.keys.A.isDown}},{key:"isRight",get:function(){return this.keys.right.isDown||this.keys.D.isDown}},{key:"isJump",get:function(){return this.keys.up.isDown||this.keys.W.isDown||this.keys.space.isDown}}])&&r(e.prototype,n),i&&r(e,i),t}(),l=0,f=1,p=2,y=3,h=4;function b(e){return(b="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function s(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}function d(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function a(e,t,n){return(a="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(e,t,n){var i=function(e,t){for(;!Object.prototype.hasOwnProperty.call(e,t)&&null!==(e=m(e)););return e}(e,t);if(i){var r=Object.getOwnPropertyDescriptor(i,t);return r.get?r.get.call(n):r.value}})(e,t,n||e)}function m(e){return(m=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function g(e,t){return(g=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var c=function(e){function c(e,t,n,i,r){var o,s,a;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,c),s=this,a=m(c).call(this,e,t,n,i,r),(o=!a||"object"!==b(a)&&"function"!=typeof a?d(s):a).inputs=new u(o.scene),o.scene.add.existing(d(o)),o.scene.physics.world.enable(d(o)),o.body.setSize(16,24),o.body.setOffset(0,8),o.body.setCollideWorldBounds(!0),o.setData("flipX",!1),o.setData("jumpVelocity",-256),o.setData("walkVelocity",128),o.scene.anims.create({key:"stand",frameRate:0,frames:o.scene.anims.generateFrameNumbers("player",{start:0})}),o.scene.anims.create({key:"walk",frameRate:12,frames:o.scene.anims.generateFrameNumbers("player",{start:0,end:2}),repeat:-1}),o.scene.anims.create({key:"jump",frameRate:0,frames:o.scene.anims.generateFrameNumbers("player",{start:2})}),o.scene.anims.create({key:"crouch",frameRate:0,frames:o.scene.anims.generateFrameNumbers("player",{start:3})}),o.actions={jump:function(){o.setState(y),o.play("jump"),o.body.velocity.y=o.getData("jumpVelocity"),o.jumpTimer=o.scene.time.delayedCall(500,function(){o.actions.fall()})},walk:function(){o.setState(h),o.play("walk")},crouch:function(){o.setState(p),o.play("crouch")},fall:function(){o.setState(f),o.play("jump")},stand:function(){o.setState(l),o.play("stand"),o.jumpTimer&&o.jumpTimer.destroy()}},o.check={isWalking:function(){return o.body.onFloor()&&(o.inputs.isLeft||o.inputs.isRight)},isJumping:function(){return o.body.onFloor()&&o.inputs.isJump},isCrouching:function(){return o.body.onFloor()&&o.inputs.isDown},isFalling:function(){return!o.body.onFloor()},isStanding:function(){return o.body.onFloor()}},o}var t,n,i;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&g(e,t)}(c,o.a.GameObjects.Sprite),t=c,(n=[{key:"preUpdate",value:function(e,t){a(m(c.prototype),"preUpdate",this).call(this,e,t);var n=(this.inputs.isRight?1:this.inputs.isLeft?-1:0)*this.getData("walkVelocity");switch(this.setFlipX(!!this.inputs.isLeft||!this.inputs.isRight&&this.flipX),this.state){case l:this.body.setVelocity(0,0),this.check.isJumping()?this.actions.jump():this.check.isWalking()?this.actions.walk():this.check.isCrouching()?this.actions.crouch():this.check.isFalling()&&this.actions.fall();break;case h:this.body.setVelocityY(0),this.body.setVelocityX(n),this.check.isJumping()?this.actions.jump():this.check.isFalling()?this.actions.fall():this.check.isWalking()||this.actions.stand();break;case p:this.body.setVelocity(0,0),this.check.isCrouching()||this.actions.stand();break;case f:case y:this.body.setVelocityX(n),this.check.isStanding()&&this.actions.stand()}}}])&&s(t.prototype,n),i&&s(t,i),c}();function w(e){return(w="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function k(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}function v(e,t){return!t||"object"!==w(t)&&"function"!=typeof t?function(e){if(void 0!==e)return e;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(e):t}function j(e){return(j=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function O(e,t){return(O=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var S=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),v(this,j(t).apply(this,arguments))}var n,i,r;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&O(e,t)}(t,o.a.Scene),n=t,(i=[{key:"preload",value:function(){this.load.tilemapTiledJSON("World1","./assets/tilemaps/tilemap.json"),this.load.image("tiles","./assets/images/tiles.gif"),this.load.spritesheet("player","./assets/images/player.gif",{frameWidth:16,frameHeight:32})}},{key:"create",value:function(){var e=this.make.tilemap({key:"World1"});this.physics.world.setBounds(0,0,e.widthInPixels,e.heightInPixels);var t=e.addTilesetImage("tiles"),n=e.createDynamicLayer(0,t,0,0);n.setCollision(2),n.setCollision(6),this.mario=new c(this,32,192,"player"),this.physics.add.collider(this.mario,n);var i=this.cameras.main;i.setBounds(0,0,e.widthInPixels,e.heightInPixels),i.startFollow(this.mario)}}])&&k(n.prototype,i),r&&k(n,r),t}(),P={type:o.a.AUTO,width:256,height:224,zoom:2,pixelArt:!0,input:{queue:!0},physics:{default:"arcade",arcade:{debug:!1,gravity:{y:500}}},scene:S};new o.a.Game(P)}});