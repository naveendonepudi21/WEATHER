const WEATHER_API_KEY = "f19d6e315954bfb123e794ab55aa28c4";

const state = {
	location: {
		//setting default location of paris
		latitude: 48.8566969,
		longitude: 2.3514616
	}
};

///////////////////////////////////////
// Geolocation api function
const options = {
	enableHighAccuracy: true,
	timeout: 5000,
	maximumAge: 0
};

// Getting location using geolocation API
const getPosition = async function () {
	try {
		const { coords } = await new Promise(function (resolve, reject) {
			navigator.geolocation.getCurrentPosition(resolve, reject, options);
		});
		return coords;
	} catch (err) {
		console.log(err);
		return state.location;
	}
};

//////////////////////////////////////////////
// Helper function to fetch data from api
const TIMEOUT_SEC = 5;

const timeout = function (s) {
	return new Promise(function (_, reject) {
		setTimeout(function () {
			reject(new Error(`Request took too long! Timeout after ${s} second`));
		}, s * 1000);
	});
};

//get json data from api
export const AJAX = async function (url, method = undefined) {
	try {
		const fetchPro = method
			? fetch(url, {
					method: "get"
			  })
			: fetch(url);

		const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
		const data = await res.json();

		if (!res.ok) throw new Error(`${data.message} (${res.status})`);
		return data;
	} catch (err) {
		throw err;
	}
};

//////////////////////////////
// Executing functions and fetching data

const loadData = async function () {
	try {
		const { latitude, longitude } = await getPosition();
		const weatherData = await AJAX(
			`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&&units=metric&appid=${WEATHER_API_KEY}`
		);
		console.log(weatherData);
	} catch (err) {
		console.error("Error occured!!", err);
	}
};

window.addEventListener("load", loadData);
