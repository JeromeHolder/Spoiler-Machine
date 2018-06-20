const request = require("request");
const cheerio = require("cheerio");
const config = require('./config');
let movie;
let warningTime;


// Accept command line arguments in any order and assigning the variables accordingly
if(!isNaN(parseInt(process.argv[2]))) {  
    movie = process.argv[3];
    warningTime = parseInt(process.argv[2]);
}
else {
    movie = process.argv[2];
    warningTime = parseInt(process.argv[3]);
}
const url = "https://www.google.ca/search?q=" + movie + "movie" + "news" + " -imdb";
const tmdbURL = 'https://api.themoviedb.org/3/search/movie?include_adult=false&page=1&language=en-US&api_key=' + config.TMDB_API_KEY + '&query=' + movie;


// Testing number and value of command line arguments
if (warningTime < 0) {
  console.log('Error: Warning time cannot be negative');
}
else if (process.argv.length < 4) {
  console.log('Error: Not enough arguments.  Enter movie title (Surrounded by quotes if title is more than one word) and warning time.');
}
else if (process.argv.length > 4) {
  console.log('Error: Too many arguments.  Enter movie title (Surrounded by quotes if title is more than one word) and warning time.');
}
else {
  // Test if the movie exists, stores spoiler if it does
  request(tmdbURL, function (error, response, body) {
    let obj = JSON.parse(body);
    if (error) {
      console.log(error);
    }
    else if (obj.results.length === 0) {
      console.log("That movie doesn't exist");
      return;
    }
    else {
      let title = [];
      let headlines;
      let overview;
      // Scrapes to get headlines
      request(url, function(error, response, body) {
        if(error) {
            console.log("Couldn't news because of error: " + error);
            return;
        }
        var $ = cheerio.load(body), hline = $(".r a");
        hline.each(function (i, hline) {
            title.push($(hline).text()+"\n");
        })
        headlines = title.join("");
        overview = "\n" + obj.results[0].overview + "\n";
        // Spoiler warning appears
        console.log("\n**spoiler warning** about to spoil the movie " + movie + " in " + warningTime + " seconds\n");
        // Spoiler appears after warning time
        setTimeout(function(){
          console.log(overview);
        }, (warningTime * 1000));
        console.log(headlines); //headlines appear while waiting for timeout to finish
      })
    }
  })}