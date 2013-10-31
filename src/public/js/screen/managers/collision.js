var CollisionManager = (function() {
    var collision = function(objA, objB) {
        objA.collide(objB);
        objB.collide(objA);
    }

    return {collision: collision};
    
})();