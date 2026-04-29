const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const locationSelect = document.getElementById("locationSelect");
const errorMessage = document.getElementById("errorMessage");

searchBtn.addEventListener("click", function () {
  const selectedLocation = locationSelect.value;

  if (selectedLocation === "") {
    showError("Please select a location first.");
    return;
  }

  const coordinates = selectedLocation.split(",");
  const latitude = coordinates[0];
  const longitude = coordinates[1];

  getSunData(latitude, longitude);
});

locationBtn.addEventListener("click", function () {
  if (!navigator.geolocation) {
    showError("Geolocation is not supported by your browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    function (position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      getSunData(latitude, longitude);
    },
    function () {
      showError("Unable to get your current location.");
    }
  );
});

async function getSunData(latitude, longitude) {
  clearError();

  try {
    const todayURL = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&date=today`;
    const tomorrowURL = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&date=tomorrow`;

    const todayResponse = await fetch(todayURL);
    const tomorrowResponse = await fetch(tomorrowURL);

    if (!todayResponse.ok || !tomorrowResponse.ok) {
      throw new Error("There was a problem getting data from the API.");
    }

    const todayData = await todayResponse.json();
    const tomorrowData = await tomorrowResponse.json();

    if (todayData.status !== "OK" || tomorrowData.status !== "OK") {
      throw new Error("The API returned an error. Please try again.");
    }

    updateDashboard(todayData.results, tomorrowData.results);
  } catch (error) {
    showError(error.message);
  }
}

function updateDashboard(today, tomorrow) {
  document.getElementById("todayDate").textContent = today.date;
  document.getElementById("todaySunrise").textContent = today.sunrise;
  document.getElementById("todaySunset").textContent = today.sunset;
  document.getElementById("todayDawn").textContent = today.dawn;
  document.getElementById("todayDusk").textContent = today.dusk;
  document.getElementById("todayNoon").textContent = today.solar_noon;
  document.getElementById("todayLength").textContent = today.day_length;
  document.getElementById("todayTimezone").textContent = today.timezone;

  document.getElementById("tomorrowDate").textContent = tomorrow.date;
  document.getElementById("tomorrowSunrise").textContent = tomorrow.sunrise;
  document.getElementById("tomorrowSunset").textContent = tomorrow.sunset;
  document.getElementById("tomorrowDawn").textContent = tomorrow.dawn;
  document.getElementById("tomorrowDusk").textContent = tomorrow.dusk;
  document.getElementById("tomorrowNoon").textContent = tomorrow.solar_noon;
  document.getElementById("tomorrowLength").textContent = tomorrow.day_length;
  document.getElementById("tomorrowTimezone").textContent = tomorrow.timezone;
}

function showError(message) {
  errorMessage.textContent = message;
}

function clearError() {
  errorMessage.textContent = "";
}
