var APIkey = "a7338f44f1fa98796fcd7fe219c82404";
var endPoint = "http://api.openweathermap.org/data/2.5/weather";
//request through a city name
//Use "weather" keyword and not "find"
/**
 * Example of API call
 * api.openweathermap.org/data/2.5/weather?q=London&units=metric&APPID=a7338f44f1fa98796fcd7fe219c82404
 * api.openweathermap.org/data/2.5/weather?q=London
 * api.openweathermap.org/data/2.5/weather?q=London,uk
 */

//Example of API response
var APIresponse= {
    "coord": {
        "lon": -122.08,
        "lat": 37.39
    },
    "weather": [
    {
        "id": 800,
        "main": "Clear",
        "description": "clear sky",
        "icon": "01d"
    }
    ],
    "base": "stations",
    "main": {
        "temp": 282.55,
        "feels_like": 281.86,
        "temp_min": 280.37,
        "temp_max": 284.26,
        "pressure": 1023,
        "humidity": 100
    },
    "visibility": 16093,
    "wind": {
        "speed": 1.5,
        "deg": 350
    },
    "clouds": {
        "all": 1
    },
    "dt": 1560350645,
    "sys": {
        "type": 1,
        "id": 5122,
        "message": 0.0139,
        "country": "US",
        "sunrise": 1560343627, //Sunrise time, unix, UTC
        "sunset": 1560396563    //Sunset time, unix, UTC
    },
    "timezone": -25200, //Shift in seconds from UTC
    "id": 420006353,
    "name": "Mountain View",
    "cod": 200
}

//api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=a7338f44f1fa98796fcd7fe219c82404
// var endPoint = "api.openweathermap.org/data/2.5/weather";


//Getting and displaying current date and day of the week
let today = new Date();

let daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
let day = daysOfWeek[today.getDay()];
let dayToShow = today.toLocaleDateString() + " " + day;

$(window).on("load", () => $('#weekday').text(`${dayToShow}`));

// By clicking Show weather button requesting and getting response from API and displaying it on our SPI

$("#show__city").click(getWeather);

// Funtion for getting and dispaying weather for the requested city
function getWeather(event){
    var city = $('#search').val();
    var endPointURL = endPoint + "?q=" + city + "&units=metric&appid=" + APIkey;
    $("#search").val("");
    // console.log(endPointURL);

    // var endPointURL = "api.openweathermap.org/data/2.5/find?q=Paris,fr&units=metric&appid=a7338f44f1fa98796fcd7fe219c82404";
    $.get(endPointURL, function(data){
        //Here we do something with the data obtained
        
    }).then(
    function success(data, statusText, jqXHR){
        console.log(data);
        console.log(statusText);
        console.log(jqXHR);

        // displaying the container with icons and weather info
        $('.visible').show();

        // adding city name
        $('#city__name').text(data.name);

        // adding degrees
        $('#weather__degrees').text(`${data.main.temp.toFixed(0)}°C`);

        //Depending on the temperature degrees
        temperatureColor(data.main.temp)

        let weatherIconSrc = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`
        $('#weather__icon').attr("src", weatherIconSrc);
        $('#weather__icon').show();

        //We display the wind direction icon depending on the degrees of the coming wind
        showWind(data.wind);
        
        //Depending on the kind od weather we show a different background
        changeBackground(data.weather[0].main);

        //To the summer central europe UTC time we add the timezone
        var sunrise = data.sys.sunrise + data.timezone;
        var sunset = data.sys.sunset + data.timezone;
        // var local_time = data.dt;
        $("#sunrise__time").text(convertTime(sunrise));
        $("#sunset__time").text(convertTime(sunset));
    },
    function failed(jqXHR, errorStatusText, errorMessage){
        console.log(jqXHR);
        console.log(errorStatusText);
        console.log(errorMessage);
        //If the city is not on the database, show an alarm window!
        alert("The city entered wasnt found in the database");
    });
}

function convertTime(time_UTC){
    var sec = time_UTC;
    var date = new Date(sec * 1000).toUTCString();
    console.log(date);
    //example of .toUTCString() output: "Tue, 26 May 2020 05:30:09 GMT"
    var output_time = date.slice(-12, -7);
    return output_time;
}

function showWind(wind){
    //Depending on the wind direction we will display a different image and legend
    var wind_degress = wind.deg;
    $("#wind__info_speed").text(wind.speed + "m/s");

    //If the wind comes from 0 +/- 22.5 degress, we will say it comes from direction N
    if(wind_degress<22.5||wind_degress>337.5){
        $("#wind__icon").attr("src","../src/img/Wind_N.jpg");
        //Another format of arrow:
        // $("#wind__icon").attr("src","../src/img/arrow-down.svg");
        $("#wind__info").text(wind_degress+ "º N");
    }
    //If the wind comes from 45 +/- 22.5 degress, we will say it comes from direction NE
    else if(wind_degress<67.5){
        $("#wind__icon").attr("src","src/img/Wind_NE.jpg");
        //Another format of arrow:
        // $("#wind__icon").attr("src","../src/img/arrow-down-left.svg");
        $("#wind__info").text(wind_degress+ "º NE");
    }
    //If the wind comes from 90 +/- 22.5 degress, we will say it comes from direction E
    else if(wind_degress<112.5){
        $("#wind__icon").attr("src","src/img/Wind_E.jpg");
        //Another format of arrow:
        // $("#wind__icon").attr("src","../src/img/arrow-left.svg");
        $("#wind__info").text(wind_degress+ "º E");
    }
    //If the wind comes from 135 +/- 22.5 degress, we will say it comes from direction SE
    else if(wind_degress<157.5){
        $("#wind__icon").attr("src","src/img/Wind_SE.jpg");
        //Another format of arrow:
        // $("#wind__icon").attr("src","../src/img/arrow-up-left.svg");
        $("#wind__info").text(wind_degress+ "º SE");
    }
    //If the wind comes from 180 +/- 22.5 degress, we will say it comes from direction S
    else if(wind_degress<202.5){
        $("#wind__icon").attr("src","src/img/Wind_S.jpg");
        //Another format of arrow:
        // $("#wind__icon").attr("src","../src/img/arrow-up.svg");
        $("#wind__info").text(wind_degress+ "º S");
    }
    //If the wind comes from 225 +/- 22.5 degress, we will say it comes from direction SW
    else if(wind_degress<247.5){
        $("#wind__icon").attr("src","src/img/Wind_SW.jpg");
        //Another format of arrow:
        // $("#wind__icon").attr("src","../src/img/arrow-up-right.svg");
        $("#wind__info").text(wind_degress+ "º SW");
    }
    //If the wind comes from 270 +/- 22.5 degress, we will say it comes from direction W
    else if(wind_degress<292.5){
        $("#wind__icon").attr("src","src/img/Wind_W.jpg");
        //Another format of arrow:
        // $("#wind__icon").attr("src","../src/img/arrow-right.svg");
        $("#wind__info").text(wind_degress+ "º W");
    }
    //If the wind comes from 315 +/- 22.5 degress, we will say it comes from direction NW
    else if(wind_degress<337.5){
        $("#wind__icon").attr("src","src/img/Wind_NW.jpg");
        //Another format of arrow:
        // $("#wind__icon").attr("src","../src/img/arrow-down-right.svg");
        $("#wind__info").text(wind_degress+ "º NW");
    }
}

function changeBackground(weather){
    //Depending on the "data.weather[0].main" element, where it gives us a name of the meteorological phenomenom we change the main background image
    switch(weather){
        case "Thunderstorm":
            //storm
            $("body").css("background-image", "url('https://scitechdaily.com/images/Stormquake-Illustration.jpg')");
            break;
        case "Rain":
        case "Drizzle":
        case "Squall":
            //rain
            $("body").css("background-image", "url('https://www.discoverycountrysuites.com/files/2018/07/5023-compressed-1024x683.jpg')");
            break;
        case "Snow":
            //snow
            $("body").css("background-image", "url('https://s3.amazonaws.com/image-products/70159/70159-1024.jpg')");
            break;
        case "Mist":
        case "Fog":
        case "Haze":
            //fog
            $("body").css("background-image", "url('https://learn.zoner.com/wp-content/uploads/2019/12/how_to_photograph_foggy_landscapes_focus_on_the_details.jpg')");
            break;
        case "Smoke":
        case "Dust":
        case "Sand":
        case "Ash":
            //environmental dust
            $("body").css("background-image", "url('https://www.pd.co.ke/wp-content/uploads/2019/10/cropped-EFzioAsXkAAWlPy.jpg')");
        case "Tornado":
            //tornado
            $("body").css("background-image", "url('https://i.ytimg.com/vi/JkA2hkE9BIQ/maxresdefault.jpg')");
        case "Clouds":
            //cloudy
            $("body").css("background-image", "url('https://cardinalwxservice.com/wp-content/uploads/2019/04/featured_image_cloudy_2.jpg.jpg')");
            break;
        case "Clear":
            //clear sky
        default:
            //Since we are optimistic the default background will have a clear sky weather appearance
            $("body").css("background-image", "url('https://images.assetsdelivery.com/compings_v2/coffmancmu/coffmancmu1410/coffmancmu141000170.jpg')");
    }
}

function temperatureColor (degrees) {
    //Depending on the temperature, we will change the color of the termometer from cold->blue to warm->red
    if (degrees < 10) {$('.fas').css("color", "blue")}
    else if (degrees < 20) {$('.fas').css("color", "green")}
    else if (degrees < 25) {$('.fas').css("color", "orange")}
    else if (degrees < 50) {$('.fas').css("color", "red")}
}