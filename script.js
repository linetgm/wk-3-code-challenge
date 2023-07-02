/ this is the DOMcontentLoaded function
document.addEventListener("DOMContentLoaded", function()
 {
  // Retrieve the <li> elements representing the films
  const filmElements = document.querySelectorAll("li.film.item");

  // Function to update the film details on the page
  function updateFilmDetails(filmData) {
    // Retrieve the film details from the filmData object
    const { title, runtime, showtime, tickets_sold, description, poster } = filmData;

// Update the film details on the page
const filmTitleElement = document.getElementById("film-title");
const filmRuntimeElement = document.getElementById("film-runtime");
const filmShowtimeElement = document.getElementById("film-showtime");
const filmTicketsElement = document.getElementById("film-tickets");
const filmDescriptionElement = document.getElementById("film-description");
const filmPosterElement = document.getElementById("film-poster");

filmTitleElement.textContent = title;
filmRuntimeElement.textContent = runtime;
filmShowtimeElement.textContent = showtime;
filmTicketsElement.textContent = tickets_sold;
filmDescriptionElement.textContent = description;
filmPosterElement.setAttribute("src", poster);
  }

  // Function to update the available tickets on the page
  function updateAvailableTickets(filmData) {
    const { tickets_sold, capacity } = filmData;
    const availableTickets = capacity - tickets_sold;

const filmTicketsElement = document.getElementById("film-tickets");
filmTicketsElement.textContent = availableTickets;
  }

  // Function to handle the buy ticket button click
  function handleBuyTicket(event) {
    const filmElement = event.target.closest("li.film.item");
    const filmId = filmElement.getAttribute("data-id");

// Make a GET request to retrieve the film data
fetch(`/films/${filmId}`)
  .then(response => response.json())
  .then(filmData => {
    // Check if tickets are available
    if (filmData.tickets_sold < filmData.capacity) {
      // Update the number of tickets sold on the frontend
      filmData.tickets_sold++;
      updateAvailableTickets(filmData);

      // Update the number of tickets sold on the server
      fetch(`/films/${filmId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tickets_sold: filmData.tickets_sold
        })
      })
        .then(response => response.json())
        .then(updatedFilmData => {
          // Handle successful update on the server
          console.log("Tickets sold updated:", updatedFilmData);
        })
        .catch(error => {
          // Handle error while updating on the server
          console.error("Error updating tickets sold:", error);
        });
    } else {
      // Tickets are sold out
      console.log("Tickets sold out");
    }
  })
  .catch(error => {
    // Handle error while retrieving film data
    console.error("Error retrieving film data:", error);
  });
  }

  // Add event listener to the buy ticket button
  const buyTicketButton = document.getElementById("buy-ticket-button");
  buyTicketButton.addEventListener("click", handleBuyTicket);

  // Function to handle the search button click
  function handleSearch() {
    const filmNumber = prompt("Enter the film number:");
    if (filmNumber) {
      // Retrieve the film data for the specified film number
      fetch(/films/${filmNumber})
        .then(response => response.json())
        .then(filmData => {
          // Update the film details on the page
          updateFilmDetails(filmData);

      // Update the available tickets on the page
      updateAvailableTickets(filmData);
    })
    .catch(error => {
      // Handle error while retrieving film data
      console.error("Error retrieving film data:", error);
    });
}
  }

  // Add event listener to the search button
  const searchButton = document.getElementById("search-button");
  searchButton.addEventListener("click", handleSearch);

  // Retrieve the film data for the first film
  fetch("/films/1")
    .then(response => response.json())
    .then(filmData => {
      // Update the film details on the page
      updateFilmDetails(filmData);

  // Update the available tickets on the page
  updateAvailableTickets(filmData);
})
.catch(error => {
  // Handle error while retrieving film data
  console.error("Error retrieving film data:", error);
});
  // Retrieve the film data for all films
  fetch("/films")
    .then(response => response.json())
    .then(filmsData => {
      // Retrieve the films menu element
      const filmsMenuElement = document.getElementById("films-menu");

  // Remove the placeholder li element
  const placeholderElement = filmsMenuElement.querySelector("li");
  filmsMenuElement.removeChild(placeholderElement);

  // Iterate over each film data
  filmsData.forEach(filmData => {
    // Create a new li element for each film
    const filmElement = document.createElement("li");
    filmElement.classList.add("film", "item");
    filmElement.setAttribute("data-id", filmData.id);
    filmElement.textContent = filmData.title;

    // Add event listener to the film element to update film details
    filmElement.addEventListener("click", function() {
      updateFilmDetails(filmData);
    });

    // Append the film element to the films menu
    filmsMenuElement.appendChild(filmElement);
  });
})
.catch(error => {
  // Handle error while retrieving films data
  console.error("Error retrieving films data:", error);
});
});