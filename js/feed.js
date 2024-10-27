// Fonction pour créer un effet de "battement de cœur" superposé au bouton cliqué
function createHeartBeat(button) {
    // Crée un élément "cœur" avec l'emoji ❤️
    const heart = document.createElement('span');
    heart.textContent = '❤️';
    heart.style.position = 'absolute'; // Positionne le cœur en absolu
    heart.style.fontSize = '24px'; // Taille initiale du cœur
    heart.style.opacity = 1; // Opacité initiale
    heart.style.transition = 'transform 0.3s ease, opacity 0.3s ease'; // Transition pour animation

    // Calculer la position pour centrer le cœur sur le bouton cliqué
    const buttonRect = button.getBoundingClientRect();
    const x = buttonRect.left + window.scrollX + (buttonRect.width / 2) - 22;
    const y = buttonRect.top + window.scrollY + (buttonRect.height / 2) - 20;

    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;

    document.body.appendChild(heart);

    // Fonction pour animer le battement du cœur
    function beat() {
        heart.style.transform = 'scale(1.5)'; // Grossir l'élément
        setTimeout(() => {
            heart.style.transform = 'scale(1)'; // Retour à la taille initiale
        }, 150); // Durée du battement
    }

    // Exécute le battement deux fois
    beat();
    setTimeout(beat, 300);

    // Effet de disparition après les battements
    setTimeout(() => {
        heart.style.opacity = 0;
        heart.remove();
    }, 1000);
}

// Fonction pour créer un effet de "pouce levé" avec animation
function createThumbsUp(button) {
    // Crée un élément "pouce levé" avec l'emoji 👍
    const thumb = document.createElement('span');
    thumb.textContent = '👍';
    thumb.style.position = 'absolute';
    thumb.style.fontSize = '24px';
    thumb.style.opacity = 1;
    thumb.style.transition = 'transform 0.3s ease, opacity 0.3s ease';

    // Calculer la position pour centrer le pouce sur le bouton
    const buttonRect = button.getBoundingClientRect();
    const x = buttonRect.left + window.scrollX + (buttonRect.width / 2) - 25;
    const y = buttonRect.top + window.scrollY + (buttonRect.height / 2) - 20;

    thumb.style.left = `${x}px`;
    thumb.style.top = `${y}px`;

    document.body.appendChild(thumb);

    // Début de l'animation de rotation et de grossissement
    thumb.style.transform = 'scale(1.5) rotate(360deg)';

    // Revenir à la taille normale après rotation
    setTimeout(() => {
        thumb.style.transform = 'scale(1) rotate(0deg)';
    }, 300);

    // Re-grossir pour donner un effet de pulsation
    setTimeout(() => {
        thumb.style.transform = 'scale(1.5)';
    }, 600);

    // Effet de disparition
    setTimeout(() => {
        thumb.style.opacity = 0;
        thumb.remove();
    }, 2000);
}

// Fonction pour créer un effet de "pouce baissé" avec animation
function createThumbsDown(button) {
    // Crée un élément "pouce baissé" avec l'emoji 👎
    const thumb = document.createElement('span');
    thumb.textContent = '👎';
    thumb.style.position = 'absolute';
    thumb.style.fontSize = '24px';
    thumb.style.opacity = 1;
    thumb.style.transition = 'transform 0.3s ease, opacity 0.3s ease';

    // Calculer la position pour centrer le pouce sur le bouton
    const buttonRect = button.getBoundingClientRect();
    const x = buttonRect.left + window.scrollX + (buttonRect.width / 2) - 25;
    const y = buttonRect.top + window.scrollY + (buttonRect.height / 2) - 15;

    thumb.style.left = `${x}px`;
    thumb.style.top = `${y}px`;

    document.body.appendChild(thumb);

    // Début de l'animation de rotation et de grossissement
    thumb.style.transform = 'scale(1.5) rotate(360deg)';

    // Revenir à la taille normale après rotation
    setTimeout(() => {
        thumb.style.transform = 'scale(1) rotate(0deg)';
    }, 300);

    // Re-grossir pour donner un effet de pulsation
    setTimeout(() => {
        thumb.style.transform = 'scale(1.5)';
    }, 600);

    // Effet de disparition
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

        // Parcourt chaque post pour les afficher
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('post');

            // Crée la structure HTML pour le post (photo de profil, texte, image et réactions)
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
              <textarea class="comment-input" placeholder="Ajouter un commentaire"></textarea>
              <button id="comment-btn" class="btn">Commenter</button>
            </div>
          `;

            postsContainer.appendChild(postElement);

            let currentReaction = null;

            // Sélectionne les boutons de réaction dans le post
            const loveBtn = postElement.querySelector('.love-btn');
            const likeBtn = postElement.querySelector('.like-btn');
            const dislikeBtn = postElement.querySelector('.dislike-btn');

            // Ajoute des événements de clics pour chaque bouton de réaction
            loveBtn.addEventListener('click', () => handleReaction(loveBtn, post, 'love', '❤️'));
            likeBtn.addEventListener('click', () => handleReaction(likeBtn, post, 'like', '👍'));
            dislikeBtn.addEventListener('click', () => handleReaction(dislikeBtn, post, 'dislike', '👎'));

            // Fonction pour gérer les réactions aux posts
            function handleReaction(button, post, reactionType, emoji) {
                const isAlreadySelected = button.classList.contains('selected');

                // Réinitialise les autres boutons de réaction
                resetButtons(loveBtn, likeBtn, dislikeBtn);

                if (isAlreadySelected) {
                    // Annule la réaction si elle est déjà sélectionnée
                    currentReaction = null;
                    updateReactionCount(reactionType, post, -1);
                    button.classList.remove('selected');
                } else {
                    // Ajoute une nouvelle réaction et met à jour le compteur
                    if (currentReaction) {
                        updateReactionCount(currentReaction, post, -1);
                        const previousButton = postElement.querySelector(`.${currentReaction}-btn`);
                        previousButton.innerHTML = `${previousButton.textContent.split(" ")[0]} ${post[currentReaction + 's']}`;
                    }
                    currentReaction = reactionType;
                    updateReactionCount(reactionType, post, 1);
                    button.classList.add('selected');

                    // Lance l'animation correspondante selon la réaction
                    if (reactionType === 'love') {
                        createHeartBeat(button);
                    } else if (reactionType === 'like') {
                        createThumbsUp(button);
                    } else if (reactionType === 'dislike') {
                        createThumbsDown(button);
                    }
                }
                // Met à jour le bouton avec le compteur mis à jour
                button.innerHTML = `${emoji} ${post[reactionType + 's']}`;
            }

            // Gestion des commentaires
            const commentInput = postElement.querySelector('.comment-input');
            const commentBtn = postElement.querySelector('#comment-btn');
            const commentList = postElement.querySelector('.comment-list');

            // Ajoute un nouveau commentaire lorsque le bouton est cliqué
            commentBtn.addEventListener('click', () => {
                const commentText = commentInput.value.trim();
                if (commentText !== "") {
                    // Crée un nouvel élément de commentaire
                    const newComment = document.createElement('li');
                    newComment.innerHTML = `
                      <img src="./images/profils/Vous.webp" alt="Profile Picture" class="profile-pic-comment">
                      <strong>Vous:</strong> ${commentText.replace(/\n/g, "<br>")}`;
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
        button.classList.remove('selected'); // Retire la classe "selected" des autres boutons
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
