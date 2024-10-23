// Charger les posts à partir du JSON
fetch('data/posts.json')
    .then(response => response.json())
    .then(posts => {
        const postsContainer = document.querySelector('.posts');

        // Parcourir les posts et les afficher
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('post');

            // Contenu du post
            postElement.innerHTML = `
        <h2>${post.author}</h2>
        <p>${post.text}</p>
        ${post.image ? `<img src="${post.image}" alt="Image du post" class="post-image">` : ''}
        <div class="reactions">
          <span>❤️ ${post.loves}</span>
          <span>👍 ${post.likes}</span>
          <span>👎 ${post.dislikes}</span>
        </div>
      `;

            // Ajouter à la page
            postsContainer.appendChild(postElement);
        });
    })
    .catch(error => console.error('Erreur lors du chargement des posts:', error));
