// Fonction pour créer un effet de "battement de cœur" superposé au bouton cliqué
function createHeartBeat(button) {
    const heart = document.createElement('span');
    heart.textContent = '❤️';
    heart.style.position = 'absolute';
    heart.style.fontSize = '24px'; // Taille initiale du cœur
    heart.style.opacity = 1;
    heart.style.transition = 'transform 0.3s ease, opacity 0.3s ease';

    // Positionner le cœur pour qu'il se superpose exactement au bouton
    const buttonRect = button.getBoundingClientRect();
    const x = buttonRect.left + window.scrollX + (buttonRect.width / 2) - 22;
    const y = buttonRect.top + window.scrollY + (buttonRect.height / 2) - 20;

    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;

    document.body.appendChild(heart);

    // Ajouter l'animation de battement de cœur
    function beat() {
        heart.style.transform = 'scale(1.5)'; // Grossit
        setTimeout(() => {
            heart.style.transform = 'scale(1)'; // Reprend sa taille d'origine
        }, 150);
    }

    // Effectuer le battement deux fois avant de disparaître
    beat();
    setTimeout(beat, 300);

    // Disparition après les battements
    setTimeout(() => {
        heart.style.opacity = 0;
        heart.remove();
    }, 1000);
}

// Fonction pour créer un effet de "pouce levé" avec animation
function createThumbsUp(button) {
    const thumb = document.createElement('span');
    thumb.textContent = '👍';
    thumb.style.position = 'absolute';
    thumb.style.fontSize = '24px';
    thumb.style.opacity = 1;
    thumb.style.transition = 'transform 0.3s ease, opacity 0.3s ease';

    // Positionner le pouce pour qu'il se superpose exactement au bouton
    const buttonRect = button.getBoundingClientRect();
    const x = buttonRect.left + window.scrollX + (buttonRect.width / 2) - 25; // Décalage vers la gauche
    const y = buttonRect.top + window.scrollY + (buttonRect.height / 2) - 20;

    thumb.style.left = `${x}px`;
    thumb.style.top = `${y}px`;

    document.body.appendChild(thumb);

    // Animation de rotation et disparition
    thumb.style.transform = 'scale(1.5) rotate(360deg)';

    setTimeout(() => {
        thumb.style.transform = 'scale(1) rotate(0deg)';
    }, 300);

    setTimeout(() => {
        thumb.style.transform = 'scale(1.5)';
    }, 600);

    setTimeout(() => {
        thumb.style.opacity = 0;
        thumb.remove();
    }, 2000);
}

// Fonction pour créer un effet de "pouce baissé" avec animation
function createThumbsDown(button) {
    const thumb = document.createElement('span');
    thumb.textContent = '👎';
    thumb.style.position = 'absolute';
    thumb.style.fontSize = '24px';
    thumb.style.opacity = 1;
    thumb.style.transition = 'transform 0.3s ease, opacity 0.3s ease';

    // Positionner le pouce pour qu'il se superpose exactement au bouton
    const buttonRect = button.getBoundingClientRect();
    const x = buttonRect.left + window.scrollX + (buttonRect.width / 2) - 25; // Décalage vers la gauche
    const y = buttonRect.top + window.scrollY + (buttonRect.height / 2) - 15;

    thumb.style.left = `${x}px`;
    thumb.style.top = `${y}px`;

    document.body.appendChild(thumb);

    // Animation de rotation et disparition
    thumb.style.transform = 'scale(1.5) rotate(360deg)';

    setTimeout(() => {
        thumb.style.transform = 'scale(1) rotate(0deg)';
    }, 300);

    setTimeout(() => {
        thumb.style.transform = 'scale(1.5)';
    }, 600);

    setTimeout(() => {
        thumb.style.opacity = 0;
        thumb.remove();
    }, 2000);
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
              <button id="comment-btn" class="btn">Commenter</button>
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
                    currentReaction = null;
                    updateReactionCount(reactionType, post, -1);
                    button.classList.remove('selected');
                } else {
                    if (currentReaction) {
                        updateReactionCount(currentReaction, post, -1);
                        const previousButton = postElement.querySelector(`.${currentReaction}-btn`);
                        previousButton.innerHTML = `${previousButton.textContent.split(" ")[0]} ${post[currentReaction + 's']}`;
                    }
                    currentReaction = reactionType;
                    updateReactionCount(reactionType, post, 1);
                    button.classList.add('selected');
                    if (reactionType === 'love') {
                        createHeartBeat(button); // Animation spéciale pour le bouton "Love"
                    } else if (reactionType === 'like') {
                        createThumbsUp(button); // Animation spéciale pour le bouton "Like"
                    } else if (reactionType === 'dislike') {
                        createThumbsDown(button); // Animation spéciale pour le bouton "Dislike"
                    } else {
                        return;
                    }
                }
                button.innerHTML = `${emoji} ${post[reactionType + 's']}`;
            }

            // Gestion des commentaires
            const commentInput = postElement.querySelector('.comment-input');
            const commentBtn = postElement.querySelector('#comment-btn');
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
