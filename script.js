// Fetch movies from the JSON server
fetch('http://localhost:3000/movies')
  .then(response => response.json())
  .then(movies => {
    const movieList = document.getElementById('movie-list');

    movies.forEach(movie => {
      const li = document.createElement('li');
      li.classList.add('movie-item');

      const title = document.createElement('h3');
      title.textContent = movie.title;
      li.appendChild(title);

      const director = document.createElement('p');
      director.textContent = `Director: ${movie.director}`;
      li.appendChild(director);

      const deleteButton = document.createElement('button');
      deleteButton.classList.add('delete-movie-button');
      deleteButton.textContent = 'Delete';
      deleteButton.setAttribute('data-id', movie.id);
      li.appendChild(deleteButton);

      const editButton = document.createElement('button');
      editButton.classList.add('edit-movie-button');
      editButton.textContent = 'Edit';
      editButton.setAttribute('data-id', movie.id);
      li.appendChild(editButton);

      movieList.appendChild(li);
    });
  });

// Add a new movie to the server
const addMovieForm = document.getElementById('add-movie-form');
addMovieForm.addEventListener('submit', event => {
  event.preventDefault();
  const title = document.getElementById('title').value;
  const director = document.getElementById('director').value;
  const rating = document.getElementById('rating').value;
  if (title.trim() === '' || director.trim() === '') {
    alert('Please enter a title and director for the movie.');
    return;
  }
  if (rating.trim() === '' || isNaN(rating) || rating < 1 || rating > 10) {
    alert('Please enter a valid rating for the movie.');
    return;
  }
  const newMovie = { title, director, rating };
  fetch('http://localhost:3000/movies', {
    method: 'POST',
    body: JSON.stringify(newMovie),
    headers: { 'Content-Type': 'application/json' }
  })
    .then(response => response.json())
    .then(movie => {
      const movieList = document.getElementById('movie-list');
      const li = document.createElement('li');
      li.dataset.id = movie.id;
      li.innerHTML = `
        <h3>${movie.title}</h3>
        <p>Director: ${movie.director}</p>
        <span>Rating: ${movie.rating}</span>
        <button class="delete-movie-button" data-id="${movie.id}">Delete</button>
        <button class="edit-movie-button" data-id="${movie.id}">Edit</button>
      `;
      movieList.appendChild(li);
      document.getElementById('title').value = '';
      document.getElementById('director').value = '';
      document.getElementById('rating').value = '';
    });
});

// Add an event listener to the movie list to handle delete button clicks
const movieList = document.getElementById('movie-list');
movieList.addEventListener('click', event => {
  if (event.target.classList.contains('delete-movie-button')) {
    const movieId = event.target.dataset.id;
    fetch(`http://localhost:3000/movies/${movieId}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (response.ok) {
          const movieItem = event.target.closest('li');
          movieItem.remove();
        } else {
          alert('Failed to delete the movie.');
        }
      });
  }
});

// Add an event listener to the movie list to handle edit button clicks
movieList.addEventListener('click', event => {
  if (event.target.classList.contains('edit-movie-button')) {
    const movieId = event.target.dataset.id;
    const movieItem = event.target.closest('li');
    const movieTitle = movieItem.querySelector('h3');
    const newTitle = prompt('Enter a new title for the movie:', movieTitle.textContent);
    if (newTitle && newTitle.trim() !== '') {
      const updatedMovie = { title: newTitle };
      fetch(`http://localhost:3000/movies/${movieId}`, {
        method: 'PUT',
        body: JSON.stringify(updatedMovie),
        headers: { 'Content-Type': 'application/json' }
      })
        .then(response => response.json())
        .then(movie => {
          movieTitle.textContent = movie.title;
        });
    }
  }
});
