describe("Core — Default Root Attribute", function () {
    var MAXOUT = 5000
    ,   basicConfig = {
            editors:    [{ name: "Robin Berjon" }]
        };
    it("should apply en and ltr defaults", function () {
        var doc;
        runs(function () {
            makeRSDoc({ config: basicConfig }, function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        runs(function () {
            expect($("html", doc).attr("lang")).toEqual("en");
            expect($("html", doc).attr("dir")).toEqual("ltr");
            flushIframes();
        });
    });
    it("should not override existing dir", function () {
        var doc;
        runs(function () {
            makeRSDoc({ config: basicConfig, htmlAttrs: { dir: "rtl" } }, function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        runs(function () {
            expect($("html", doc).attr("lang")).toEqual("en");
            expect($("html", doc).attr("dir")).toEqual("rtl");
            flushIframes();
        });
    });
    it("should not override existing lang and not set dir", function () {
        var doc;
        runs(function () {
            makeRSDoc({ config: basicConfig, htmlAttrs: { lang: "fr" } }, function (rsdoc) { doc = rsdoc; });
        });
        waitsFor(function () { return doc; }, MAXOUT);
        runs(function () {
            expect($("html", doc).attr("lang")).toEqual("fr");
            expect($("html", doc).attr("dir")).toBeUndefined();
            flushIframes();
        });
    });
  // var player;
  // var song;
  // 
  // beforeEach(function() {
  //   player = new Player();
  //   song = new Song();
  // });
  // 
  // it("should be able to play a Song", function() {
  //   player.play(song);
  //   expect(player.currentlyPlayingSong).toEqual(song);
  // 
  //   //demonstrates use of custom matcher
  //   expect(player).toBePlaying(song);
  // });
  // 
  // describe("when song has been paused", function() {
  //   beforeEach(function() {
  //     player.play(song);
  //     player.pause();
  //   });
  // 
  //   it("should indicate that the song is currently paused", function() {
  //     expect(player.isPlaying).toBeFalsy();
  // 
  //     // demonstrates use of 'not' with a custom matcher
  //     expect(player).not.toBePlaying(song);
  //   });
  // 
  //   it("should be possible to resume", function() {
  //     player.resume();
  //     expect(player.isPlaying).toBeTruthy();
  //     expect(player.currentlyPlayingSong).toEqual(song);
  //   });
  // });
  // 
  // // demonstrates use of spies to intercept and test method calls
  // it("tells the current song if the user has made it a favorite", function() {
  //   spyOn(song, 'persistFavoriteStatus');
  // 
  //   player.play(song);
  //   player.makeFavorite();
  // 
  //   expect(song.persistFavoriteStatus).toHaveBeenCalledWith(true);
  // });
  // 
  // //demonstrates use of expected exceptions
  // describe("#resume", function() {
  //   it("should throw an exception if song is already playing", function() {
  //     player.play(song);
  // 
  //     expect(function() {
  //       player.resume();
  //     }).toThrow("song is already playing");
  //   });
  // });
});