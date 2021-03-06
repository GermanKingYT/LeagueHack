// Generated by CoffeeScript 1.10.0
(function() {
  var API_KEY, Mastery, VALID_LOL_REGIONS, lol;

  lol = require('lol-js');

  VALID_LOL_REGIONS = ['br', 'eune', 'euw', 'kr', 'lan', 'las', 'na', 'oce', 'ru', 'tr'];

  API_KEY = 'ea19371b-19f6-40b0-8e4e-f423bf1bd606';

  Mastery = (function() {
    function Mastery() {}

    Mastery.prototype.error = function(response, reason, summonerName, region) {
      return response.json({
        status: 'error',
        summonerName: summonerName,
        reason: reason,
        masteries: []
      });
    };

    Mastery.prototype.handle = function(request, response) {
      var client, region, summonerName;
      region = request.params[0];
      summonerName = request.params[1];
      console.info("Request for summoner " + summonerName);
      if (!~VALID_LOL_REGIONS.indexOf(region)) {
        this.error(response, 'Invalid region', summonerName, region);
        console.error("Invalid region '" + region + "' for summoner '" + summonerName + "'");
      }
      client = lol.client({
        apiKey: API_KEY,
        defaultRegion: region
      });
      return client.getSummonersByNameAsync([summonerName]).then(function(summoners) {
        var summoner;
        summoner = summoners[summonerName];
        if (summoner === null) {
          this.error(response, 'Can\'t find summoner', summonerName, region);
          console.error("Failed to find summoner " + summonerNmae);
        }
        console.info("Summoner '" + summoner.name + "' has been assigned to summonerId '" + summoner.id + "'");
        return client.getSummonerMasteriesAsync([summoner.id]).then(function(masteries) {
          var i, len, mainMasteryPage, masteryPage, masteryPages;
          masteryPages = masteries[summoner.id].pages;
          mainMasteryPage = null;
          for (i = 0, len = masteryPages.length; i < len; i++) {
            masteryPage = masteryPages[i];
            if (masteryPage.current) {
              mainMasteryPage = masteryPage.masteries || [];
            }
          }
          console.info("Masteries for summoner '" + summoner.name + "' have been successfully parsed");
          return response.json({
            status: 'success',
            summoner: summoner,
            masteries: mainMasteryPage || []
          });
        });
      });
    };

    return Mastery;

  })();

  module.exports = Mastery;

}).call(this);
