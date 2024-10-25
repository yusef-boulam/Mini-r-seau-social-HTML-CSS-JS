// Fonction pour créer des particules autour du bouton cliqué
function createParticles(button, emoji) {
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('span');
        particle.textContent = emoji;
        particle.style.position = 'absolute';

        const buttonRect = button.getBoundingClientRect();
        const x = buttonRect.left + window.scrollX + (buttonRect.width / 2) - 10;
        const y = buttonRect.top + window.scrollY;

        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.opacity = 1;
        particle.style.transition = `transform 1s ease-out, opacity 1s ease-out`;

        const angle = Math.random() * Math.PI * 2;
        const distance = 50 + Math.random() * 50;

        particle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * -distance}px)`;

        document.body.appendChild(particle);

        setTimeout(() => {
            particle.style.opacity = 0;
            particle.remove();
        }, 1000);
    }
}

// Charger les posts à partir du JSON
fetch('data/posts.json')
    .then(response => response.json())
    .then(posts => {
        const postsContainer = document.querySelector('.posts');

        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('post');

            postElement.innerHTML = `
            <div class="post-header">
              <img src="./images/profils/${post.profilePicture}" alt="Profile Picture" class="profile-pic">
              <h2>${post.author}</h2>
            </div>
            <p>${post.text}</p>
            ${post.image ? `<img src="./images/posts/${post.image}" alt="Image du post" class="post-image">` : ''}
            <div class="reactions">
              <button class="reaction-btn love-btn">❤️ ${post.loves}</button>
              <button class="reaction-btn like-btn">👍 ${post.likes}</button>
              <button class="reaction-btn dislike-btn">👎 ${post.dislikes}</button>
            </div>
            <div class="comments">
              <h3>Commentaires</h3>
              <ul class="comment-list">
                ${post.comments.map(comment => `
                  <li>
                    <img src="./images/profils/${comment.profilePicture}" alt="Profile Picture" class="profile-pic-comment">
                    <strong>${comment.author}:</strong> ${comment.text}
                  </li>`).join('')}
              </ul>
              <input type="text" class="comment-input" placeholder="Ajouter un commentaire">
              <button class="comment-btn">Commenter</button>
            </div>
          `;

            postsContainer.appendChild(postElement);

            let currentReaction = null;

            // Sélectionner les boutons de réaction
            const loveBtn = postElement.querySelector('.love-btn');
            const likeBtn = postElement.querySelector('.like-btn');
            const dislikeBtn = postElement.querySelector('.dislike-btn');

            // Ajouter les événements de clics pour gérer la sélection et désélection
            loveBtn.addEventListener('click', () => handleReaction(loveBtn, post, 'love', '❤️'));
            likeBtn.addEventListener('click', () => handleReaction(likeBtn, post, 'like', '👍'));
            dislikeBtn.addEventListener('click', () => handleReaction(dislikeBtn, post, 'dislike', '👎'));

            function handleReaction(button, post, reactionType, emoji) {
                const isAlreadySelected = button.classList.contains('selected');

                // Réinitialiser les autres boutons de réaction
                resetButtons(loveBtn, likeBtn, dislikeBtn);

                if (isAlreadySelected) {
                    // Si le bouton est déjà sélectionné, le désélectionner
                    currentReaction = null;
                    updateReactionCount(reactionType, post, -1);
                    button.classList.remove('selected');
                } else {
                    // Si une autre réaction était sélectionnée, décrémente-la
                    if (currentReaction) {
                        updateReactionCount(currentReaction, post, -1);
                        const previousButton = postElement.querySelector(`.${currentReaction}-btn`);
                        previousButton.innerHTML = `${previousButton.textContent.split(" ")[0]} ${post[currentReaction + 's']}`;
                    }

                    // Appliquer la nouvelle réaction
                    currentReaction = reactionType;
                    updateReactionCount(reactionType, post, 1);
                    button.classList.add('selected');
                    createParticles(button, emoji);
                }

                // Mettre à jour le bouton avec le nouveau compteur
                button.innerHTML = `${emoji} ${post[reactionType + 's']}`;
            }

            // Gestion des commentaires
            const commentInput = postElement.querySelector('.comment-input');
            const commentBtn = postElement.querySelector('.comment-btn');
            const commentList = postElement.querySelector('.comment-list');

            commentBtn.addEventListener('click', () => {
                const commentText = commentInput.value.trim();
                if (commentText !== "") {
                    const newComment = document.createElement('li');
                    newComment.innerHTML = `
                      <img src="./images/profils/Vous.webp" alt="Profile Picture" class="profile-pic-comment">
                      <strong>Vous:</strong> ${commentText}`;
                    commentList.appendChild(newComment);
                    commentInput.value = "";
                    post.comments.push({ author: "Vous", profilePicture: "Vous.webp", text: commentText });
                }
            });
        });
    })
    .catch(error => console.error('Erreur lors du chargement des posts:', error));

// Fonction pour désactiver les autres boutons
function disableOtherReactions(...buttons) {
    buttons.forEach(button => {
        button.disabled = true;
        button.style.opacity = 0.5;
    });
}

// Fonction pour réactiver les boutons si la réaction est annulée
function resetButtons(...buttons) {
    buttons.forEach(button => {
        button.classList.remove('selected'); // Retirer la classe "selected" des autres boutons
        button.disabled = false;
        button.style.opacity = 1;
    });
}

// Fonction pour mettre à jour les compteurs de réactions
function updateReactionCount(reaction, post, value) {
    if (reaction === 'like') post.likes += value;
    if (reaction === 'dislike') post.dislikes += value;
    if (reaction === 'love') post.loves += value;
}
