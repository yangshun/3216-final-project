SoundManager = {
  sounds : [{id: "shooting-sound-1", src: "/sound/shooting-sound-1.mp3"},
            {id: "shooting-sound-2", src: "/sound/shooting-sound-2.mp3"},
            {id: "bgm", src: "/sound/ROAM - Hold The Fort.mp3"}],
  play: function(id, opts) {
    opts = opts || {};
    createjs.Sound.play(id, opts);
  }
};


PubSub.subscribe('shuriken.shuriken.shoot', function(data) {
  SoundManager.play(Math.random() > 0.5 ? 'shooting-sound-1' : 'shooting-sound-2');
});
