SoundManager = {
  sounds : [{id: "shooting-sound-1", src: "/sound/shooting-sound-1.mp3"},
            {id: "shooting-sound-2", src: "/sound/shooting-sound-2.mp3"},
            {id: "banana-sound", src: "/sound/banana.wav"},
            {id: "frost-sound", src: "/sound/frost.mp3"},
            {id: "laser-sound", src: "/sound/laser.wav"},
            {id: "missile-sound", src: "/sound/missile.mp3"},
            {id: "plasma-sound", src: "/sound/plasma.mp3"},
            {id: "punch-sound", src: "/sound/punch.mp3"},
            {id: "bgm", src: "/sound/ROAM - Hold The Fort.mp3"}],
  play: function(id, opts) {
    opts = opts || {};
    createjs.Sound.play(id, opts);
  }
};


PubSub.subscribe('shuriken.shuriken.shoot', function(data) {
  SoundManager.play(Math.random() > 0.5 ? 'shooting-sound-1' : 'shooting-sound-2');
});

var banana_count = 0;

PubSub.subscribe('shuriken.banana.shoot', function(data) {
	if (banana_count % 3 == 0) {
  		SoundManager.play('banana-sound');
  	}
  	banana_count++;
});

PubSub.subscribe('shuriken.hulk_fist.shoot', function(data) {
  SoundManager.play('punch-sound');
});

PubSub.subscribe('shuriken.laser.shoot', function(data) {
  SoundManager.play('laser-sound');
});

PubSub.subscribe('shuriken.plasma.shoot', function(data) {
  SoundManager.play('plasma-sound');
});

PubSub.subscribe('shuriken.rocket.shoot', function(data) {
  SoundManager.play('missile-sound');
});

PubSub.subscribe('shuriken.snowflake.shoot', function(data) {
  SoundManager.play('frost-sound');
});
