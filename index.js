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
  lists.innerHTML = "";
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
document.addEventListener("DOMContentLoaded", function () {
  defaultDisplay();
});
//getting a list of landlocked countries
//first lets fetch all details from the api
async function fetchData() {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
//function to search and display all landlocked countries
async function searchLandlockedCountries() {
  const lists = document.getElementById("lists");
  lists.innerHTML = "";
  countryDetails.innerHTML = "";
  const data = await fetchData();
  //now we filter to get only the landlocked countries from the country data
  const landlockedCountries = data.filter((country) => {
    return country.landlocked === true;
  });
  // Displaying the list of landlocked countries if there is any
  if (landlockedCountries.length > 0) {
    //where we will append the list
    const orderedlistOfLandlocked = document.createElement("ol");
    landlockedCountries.forEach((country) => {
      //listing content
      const listOfLandlocked = document.createElement("li");
      listOfLandlocked.style.color = "#008080";
      listOfLandlocked.textContent = country.name.common;
      //appending to the unordered list
      orderedlistOfLandlocked.appendChild(listOfLandlocked);
    });
    lists.appendChild(orderedlistOfLandlocked);
  } else {
    lists.textContent = "No landlocked countries found";
  }
}
//telling the landlocked button what to execute once it is clicked
const landlockedButton = document.getElementById("searchLandlocked");
landlockedButton.addEventListener("click", () => {
  searchLandlockedCountries();
});
