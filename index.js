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
  submitButton.addEventListener("click", (e) => {
    e.preventDefault();
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
}//footer information
const footerdetails = document.getElementById("footerDetails");
const footerParagraph = document.createElement("p")
footerParagraph.textContent = "The World Is the Place to be";
const worldImage = document.createElement("img")
worldImage.src =
  "data:image/jpeg;base64,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";
worldImage.alt = "world icon"
//appending to their div
footerdetails.appendChild(footerParagraph)
footerdetails.appendChild(worldImage)
//adding personal details
const webdetails = document.getElementById("webdetails");
const readdetails = `
   <p>website for navigating around countries</p>
   <p>helps in creating basic knowledge on countries in the world</p>
   <p>view how many countries are landlocked and languages countries use</p>
   <p>you can view your knowledge on countries by answering the quiz<p>
`
webdetails.innerHTML = readdetails


