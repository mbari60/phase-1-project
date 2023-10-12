//getting the elements from the html page
const countryNameInput = document.getElementById("countryName");
const searchButton = document.getElementById("searchButton");
const countryDetails = document.getElementById("countryDetails");
//fetching the countries from the api
function getCountries() {
  const countryName = countryNameInput.value.trim();
  if (countryName) {
    const apiUrl = `https://restcountries.com/v3/name/${countryName}`;
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        //first we clear the page then search is conducted
        clearCountryDetails();
        displayCountryDetails(data);
      })
      .catch((error) => {
        clearCountryDetails();
        countryDetails.innerHTML = "Error: Country not found.";
      });
  } else {
    countryDetails.innerHTML = "Please enter a country name.";
  }
}
// Function to clear the country details
function clearCountryDetails() {
  countryDetails.innerHTML = ""; // Clear the content
}
//creating a function to display the country that was searched
function displayCountryDetails(data) {
  const country = data[0];
  if (country) {
    const details = `
            <h2>${country.name.common}</h2>
            <p>Capital: ${country.capital}</p>
            <p>Population: ${country.population}</p>
            <p>Area: ${country.area} km²</p>
            <p>Region: ${country.region}</p>
            <p>Subregion: ${country.subregion}</p>
            <img src="${country.flags[1]}" alt="${country.name.common} Flag" />
        `;
    countryDetails.innerHTML = details;
  } else {
    countryDetails.innerHTML = "Country not found.";
  }
}


// Adding an event listener for the search button to get countries when the button is clicked
searchButton.addEventListener("click", function () {
  getCountries();
});
// Creating some countries to be displayed before the search is conducted
function defaultDisplay() {
  fetch("https://restcountries.com/v3/all")
    .then((res) => res.json())
    .then((data) => {
        //getting where we will append 
        const defaultcountries = document.getElementById("default-countries");
      // Getting the first 6 countries to display as default before the search is conducted
      const countriesData = data.slice(0, 6);
      countriesData.forEach((country) => {
        // Creating a div for its information
        const countryDiv = document.createElement("div");
        countryDiv.classList.add("defaultCountry");
        // Creating a heading that's a name
        const countryName = document.createElement("h2");
        countryName.textContent = country.name.common;
        // Creating a paragraph for the capital city of the country
        const capital = document.createElement("p");
        capital.textContent = "Capital: " + country.capital;
        // Creating a paragraph for the region the country is located in
        const region = document.createElement("p");
        region.textContent = "Region: " + country.region;
        // Createing a paragraph for the population of the country
        const population = document.createElement("p");
        population.textContent = "Population: " + country.population;
        // Creating a paragraph for the subregion the country is located in
        const subregion = document.createElement("p");
        subregion.textContent = "Subregion: " + country.subregion;
        // Creating an image tag for the flag
        const flag = document.createElement("img");
        flag.src = country.flags[1];
        flag.alt = country.name.common;

        // Appending the elements to the country div
        countryDiv.appendChild(countryName);
        countryDiv.appendChild(capital);
        countryDiv.appendChild(region);
        countryDiv.appendChild(population);
        countryDiv.appendChild(subregion);
        countryDiv.appendChild(flag);

        // Append the country div to the parent container (defaultcountries)
        defaultcountries.appendChild(countryDiv);
        //apending to the html
        countryDetails.appendChild(defaultcountries);
      });
    });
}
//loading the DOM
document.addEventListener("DOMContentLoaded",function(){
    defaultDisplay();
})
