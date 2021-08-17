// Foursquare API Info
const clientId = '34UUSFD0MZLRSLRFSSHCF4D0K5QYIGYYQRN1Y0AMXPDOPBLJ';
const clientSecret = 'XI1LHWZZMEOVCCJVYRQPELVHA3MTTWXZOAWGPDQEXXICTYAG';
const url = 'https://api.foursquare.com/v2/venues/explore?near=';
const url2 = 'https://api.foursquare.com/v2/venues/';

// OpenWeather Info
const openWeatherKey = '3f7ff6c50748a60b4491e44faaa808ca';
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';

// Page Elements
const $input = $('#city');
const $submit = $('#button');
const $destination = $('#destination');
const $container = $('.container');
const $venueDivs = [$("#venue1"), $("#venue2"), $("#venue3"), $("#venue4")];
const $weatherDiv = $("#weather1");
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

//AJAX functions:
const getVenues = async () => {
  const city = $input.val();
  const urlToFetch = `${url}${city}&limit=10&client_id=${clientId}&client_secret=${clientSecret}&v=20200512`;
  try {
    const response = await fetch(urlToFetch);
    if (response.ok){
      const jsonResponse = await response.json();
      const venues = jsonResponse.response.groups[0].items.map(x => x.venue);
      console.log(venues);
      return venues;
    }
  }catch(error){
    console.log(error);
  }
}

//shuffles items in an array
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}


const getForecast = async () => {
  const urlToFetch = `${weatherUrl}?q=${$input.val()}&units=metric&APPID=${openWeatherKey}`;
  try {
  const response = await fetch(urlToFetch);
  if (response.ok) {
    const jsonResponse = await response.json();
    console.log(jsonResponse);
    return jsonResponse;
    }
  } catch(error){
    console.log(error);
    }
}

// Render functions
const renderForecast = (day) => {
	let weatherContent = createWeatherHTML(day);
  $weatherDiv.append(weatherContent);
}

const renderVenues = (venues) => {

  $venueDivs.forEach(($venue, index) => {
    const venue = venues[index];
      //const venueIcon = venue.categories[0].icon;

      const venueImgSrc = `${venue.bestPhoto.prefix}128x128${venue.bestPhoto.suffix}`;
      let venueContent = createVenueHTML(venue.name, venue.location, venueImgSrc);
    $venue.append(venueContent);
  });
  $destination.append(`<h2>${venues[0].location.city}<br><span style = "font-size: 14px">Latitude: ${roundNum(venues[0].location.lat)}&deg;</span></h2>`);
}

////////////////////////////////////////////////////////////////////////////////////////////////



const getVenueDetails = async id => {
    const urlToFetch = `${url2}${id}?client_id=${clientId}&client_secret=${clientSecret}&v=20200512`;
    try{
      const response = await fetch(urlToFetch);
      if(response.ok){
        const jsonResponse = await response.json();
        details = jsonResponse.response.venue;
        return details;
      }
    } catch(error){console.log(error);}
};


/*
  const renderVenues = (array) => {
    //console.log('Render');
    //console.log(details);
    array.forEach(item => console.log(`${item.bestPhoto.prefix}128x256${item.bestPhoto.suffix}`));
    debugger;

    $venueDivs.forEach(($venue, index) => {
      const venueIcon = array[index].categories[0].icon;
      const venueImgSrc = `${venueIcon.prefix}bg_64${venueIcon.suffix}`;//the photo i wanna use


      let venueContent = createVenueHTML(venue.name, venue.location, venueImgSrc);
      $venue.append(venueContent);
    });
    $destination.append(`<h2>${venues[0].location.city}<br><span style = "font-size: 14px">Latitude: ${roundNum(venues[0].location.lat)}&deg;</span></h2>`);
  };

*/
////////////////////////////////////////////////////////////////////////////////////////


const executeSearch = () => {
  $venueDivs.forEach(venue => venue.empty());
  $weatherDiv.empty();
  $destination.empty();
  $container.css("visibility", "visible");
  getVenues()
    .then(async venues => {
      let detailsArray = [];
      shuffle(venues);
      for(let i = 0; i < 3; i++){ //Can't use forEach
        detailsArray.push(await getVenueDetails(venues[i].id));
      }
      //console.log(detailsArray);

      return renderVenues(detailsArray);
    });
  //getVenues().then(venues => renderVenues(venues));
  getForecast().then(forecast => renderForecast(forecast));
  return false;
}

$submit.click(executeSearch)
