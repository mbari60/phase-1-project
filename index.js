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
            <img src="${country.flags[1]}" alt="${country.name.common} Flag" style="max-width: 100%"/>
            <hr/>
            <button id="likeButton">Mark as Favorite</button>
        `;
    countryDetails.innerHTML = details;
    const like = document.getElementById("likeButton");
    like.addEventListener("click", () => {
      like.style.backgroundColor = "red";
    });
  } else {
    countryDetails.innerHTML = "Country not found.";
  }
}

// Adding an event listener for the search button to get countries when the button is clicked
searchButton.addEventListener("click", function () {
     getCountries()
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
        region.textContent = `region : ${country.region}`;
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
//adding a search button that will be by languages(search by language)
async function searchByLanguage() {
  const languageSelect = document.getElementById("language-select");
  const selectedLanguage = languageSelect.value;
  const lists = document.getElementById("lists");
  lists.innerHTML = ""; // Clear previous search results
  countryDetails.innerHTML = ""; //clear content of countrydetails
  //await fetch
  const data = await fetchData();

  // Filter countries that use the selected language
  const countriesByLanguage = data.filter((country) => {
    for (const languageCode in country.languages) {
      if (
        country.languages[languageCode].toLowerCase() ===
        selectedLanguage.toLowerCase()
      ) {
        //if language uses the language thenits true
        return true;
      }
    }
    return false;
  });
  // Display the list of countries that use the selected language
  if (countriesByLanguage.length > 0) {
    const ol = document.createElement("ol");
    countriesByLanguage.forEach((country) => {
      const li = document.createElement("li");
      li.textContent = country.name.common;
      li.style.color = "#008080";
      ol.appendChild(li);
    });
    lists.appendChild(ol);
  } else {
    lists.textContent = `No countries speak ${selectedLanguage}.`;
  }
}
//telling the language button wo display languages when clicked
const languageButton = document.getElementById("search-language-button");
languageButton.addEventListener("click", () => {
  searchByLanguage();
});
//quizess about the site
async function quizes() {
  countryDetails.innerHTML = "";
  lists.innerHTML = "";
  // Creating the questions
  const quiz1 = document.createElement("form");
  quiz1.classList.add("formQuestions");
  //the label represents the question and the inputs gives user a platform to enter the marks
  quiz1.innerHTML = `
    <label for="landlockedQuestion"id="landlockedLabel">How many countries are landlocked?</label>
    <input type="text" id="landlockedQuestion" placeholder="Enter your answer"><br>
    <hr/>
    <label for="swahiliQuestion"id="swahiliLabel">How many countries use Swahili as a language?</label>
    <input type="text" id="swahiliQuestion" placeholder="Enter your answer" ><br>
     <hr/>
    <label for="hindiQuestion" id="hindiLabel">How many countries use Hindi as their language?</label>
    <input type="text" id="hindiQuestion" placeholder="Enter your answer"><br>
     <hr/>
    <label for="spanishQuestion"id="spanishLabel">How many countries use Spanish as their language?</label>
    <input type="text" id="spanishQuestion" placeholder="Enter your answer"><br>
     <hr/>
    <label for="kenyaPopulationQuestion" id="kenyaLabel">What is the population of Kenya?</label>
    <input type="text" id="kenyaQuestion" placeholder="Enter your answer"><br>
     <hr/>
    <label for="capitalCity" id="usaCapital">What is the capital city of united states?</label>
    <input type="text" id="capitalUsa" placeholder="Enter your answer"><br>
     <hr/>
    <label for="germanSubregion" id="germanSubregion">What is the sub-region where german is located?</label>
    <input type="text" id="germanQuestion" placeholder="Enter your answer"><br>
     <hr/>
    <label for="madagascar" id="madagascarCapital">What is the capital city of Madagascar?</label>
    <input type="text" id="madagascarQuestion" placeholder="Enter your answer"><br>
     <hr/>
    <button id="quizSubmitButton" type="button">Submit</button>
  `;
  // Appending the questions to the qcountrydetails in html
  countryDetails.appendChild(quiz1);
  // Adding an event listener for the submit button
  const submitButton = document.getElementById("quizSubmitButton");
  submitButton.addEventListener("click", () => {
    checkAnswers();
  });
}
//ading an event listener to the quiz button to provide questions when it is clicked
const quiz = document.getElementById("quizz");
quiz.addEventListener("click", () => {
  quizes();
});
//creating fuction to check answers
function checkAnswers() {
  // cheking the answers the user had input
  // lets use the or operator || for those who used words and those who used numbers to be marked right
  let score = 0; //initializing the score to 0
  const quizlandlocked = document.getElementById("landlockedQuestion");
  const answerlandlocked = quizlandlocked.value; //getting the input of user and storing it to answer so that it may be checked using the if
  if (
    answerlandlocked === "45" ||
    answerlandlocked === 45 ||
    answerlandlocked.toLowerCase() === "fortyfive" //this are the expected answers
  ) {
    score += 5; //incrementing the score each and every time the user gets  correct answer
    quizlandlocked.style.backgroundColor = "green"; // here we are marking the question correct
  } else {
    quizlandlocked.style.backgroundColor = "red"; // here we are marking the question wrong
  }
  const quizSwahili = document.getElementById("swahiliQuestion");
  const answerSwahili = quizSwahili.value;
  if (
    answerSwahili === "4" ||
    answerSwahili === 4 ||
    answerSwahili === "four"
  ) {
    score += 5;
    quizSwahili.style.backgroundColor = "green";
  } else {
    quizSwahili.style.backgroundColor = "red";
  }

  const quizHindi = document.getElementById("hindiQuestion");
  const answerHindi = quizHindi.value;
  if (answerHindi === "1" || answerHindi === 1 || answerHindi === "one") {
    score += 5;
    quizHindi.style.backgroundColor = "green";
  } else {
    quizHindi.style.backgroundColor = "red";
  }

  const quizSpanish = document.getElementById("spanishQuestion");
  const answerSpanish = quizSpanish.value;
  if (
    answerSpanish === "24" ||
    answerSpanish === 24 ||
    answerSpanish === "twentyfour"
  ) {
    score += 5;
    quizSpanish.style.backgroundColor = "green";
  } else {
    quizSpanish.style.backgroundColor = "red";
  }
  const quizKenya = document.getElementById("kenyaQuestion");
  const answerKenya = quizKenya.value;
  if (answerKenya >= 53000000 && answerKenya <= 54000000) {
    score += 5;
    quizKenya.style.backgroundColor = "green";
  } else {
    quizKenya.style.backgroundColor = "red";
  }
  const capital = document.getElementById("capitalUsa");
  const answercapital = capital.value;
  if (
    answercapital === "Washington D.C" ||
    answercapital === `Washington, D.C.` ||
    answercapital === `washindton d.c`
  ) {
    score += 5;
    capital.style.backgroundColor = "green";
  } else {
    capital.style.backgroundColor = "red";
  }
  const germanQuestion = document.getElementById("germanQuestion");
  const answerGerman = germanQuestion.value;
  if (answerGerman === "Western Europe" || answerGerman === "western europe") {
    score += 5;
    germanQuestion.style.backgroundColor = "green";
  } else {
    germanQuestion.style.backgroundColor = "red";
  }
  const madagascarQuestion = document.getElementById("madagascarQuestion");
  const answerMadagascar = madagascarQuestion.value;
  if (
    answerMadagascar === "Antananarivo" ||
    answerMadagascar === "antananarivo"
  ) {
    score += 5;
    madagascarQuestion.style.backgroundColor = "green";
  } else {
    madagascarQuestion.style.backgroundColor = "red";
  }
  //congratulating those with 20 and above and telling the others to try better next time
  if (score >= 20) {
    alert(`congratulation your score is ${score}`);
  } else {
    alert(`your Score is : ${score} next time you will get a 20 and above`);
  }
}
