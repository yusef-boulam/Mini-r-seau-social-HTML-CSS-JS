// Fonction pour créer des particules autour du bouton cliqué
function createParticles(button, emoji) {
    const particle = document.createElement('span');
    particle.textContent = emoji;
    particle.style.position = 'absolute';

    // Calculer la position du bouton cliqué
    const buttonRect = button.getBoundingClientRect();
    const x = buttonRect.left + window.scrollX;  // Position horizontale
    const y = buttonRect.top + window.scrollY;   // Position verticale

    // Position initiale des particules près du bouton cliqué
    particle.style.left = `${x + (buttonRect.width / 2) - 10}px`; // Centrer autour du bouton
    particle.style.top = `${y}px`; // Position verticale au niveau du bouton
    particle.style.opacity = 1;
    particle.style.transition = 'transform 1s ease-out, opacity 1s ease-out';

    // Ajouter la particule au body
    document.body.appendChild(particle);

    // Animation : déplacement vers le haut et réduction d'opacité
    particle.style.transform = `translateY(-50px)`;

    // Supprimer la particule après l'animation
    setTimeout(() => {
        particle.style.opacity = 0;
        particle.remove();
    }, 1000);
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
              <button class="reaction-btn love-btn">❤️ Love (${post.loves})</button>
              <button class="reaction-btn like-btn">👍 Like (${post.likes})</button>
              <button class="reaction-btn dislike-btn">👎 Dislike (${post.dislikes})</button>
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

            // État des réactions pour ce post
            let currentReaction = null; // Peut être 'like', 'dislike' ou 'love'

            // Sélectionner les boutons de réaction
            const loveBtn = postElement.querySelector('.love-btn');
            const likeBtn = postElement.querySelector('.like-btn');
            const dislikeBtn = postElement.querySelector('.dislike-btn');

            // Ajouter les événements de clics
            loveBtn.addEventListener('click', () => {
                if (currentReaction === 'love') {
                    post.loves -= 1;
                    loveBtn.innerHTML = `❤️ Love (${post.loves})`;
                    currentReaction = null;
                    resetButtons(likeBtn, dislikeBtn);
                } else {
                    if (currentReaction) updateReactionCount(currentReaction, post, -1);
                    post.loves += 1;
                    loveBtn.innerHTML = `❤️ Love (${post.loves})`;
                    createParticles(loveBtn, '❤️');  // Appel avec le bouton cliqué
                    currentReaction = 'love';
                    disableOtherReactions(likeBtn, dislikeBtn);
                }
            });

            likeBtn.addEventListener('click', () => {
                if (currentReaction === 'like') {
                    post.likes -= 1;
                    likeBtn.innerHTML = `👍 Like (${post.likes})`;
                    currentReaction = null;
                    resetButtons(loveBtn, dislikeBtn);
                } else {
                    if (currentReaction) updateReactionCount(currentReaction, post, -1);
                    post.likes += 1;
                    likeBtn.innerHTML = `👍 Like (${post.likes})`;
                    createParticles(likeBtn, '👍');  // Appel avec le bouton cliqué
                    currentReaction = 'like';
                    disableOtherReactions(loveBtn, dislikeBtn);
                }
            });

            dislikeBtn.addEventListener('click', () => {
                if (currentReaction === 'dislike') {
                    post.dislikes -= 1;
                    dislikeBtn.innerHTML = `👎 Dislike (${post.dislikes})`;
                    currentReaction = null;
                    resetButtons(loveBtn, likeBtn);
                } else {
                    if (currentReaction) updateReactionCount(currentReaction, post, -1);
                    post.dislikes += 1;
                    dislikeBtn.innerHTML = `👎 Dislike (${post.dislikes})`;
                    createParticles(dislikeBtn, '👎');  // Appel avec le bouton cliqué
                    currentReaction = 'dislike';
                    disableOtherReactions(loveBtn, likeBtn);
                }
            });


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

// Fonction pour désactiver les autres réactions
function disableOtherReactions(...buttons) {
    buttons.forEach(button => {
        button.disabled = true; // Désactiver les autres boutons
        button.style.opacity = 0.5; // Ajouter une indication visuelle
    });
}

// Fonction pour réactiver les boutons si la réaction est annulée
function resetButtons(...buttons) {
    buttons.forEach(button => {
        button.disabled = false; // Réactiver les autres boutons
        button.style.opacity = 1; // Remettre l'opacité à normale
    });
}

// Fonction pour mettre à jour les compteurs de réactions
function updateReactionCount(reaction, post, value) {
    if (reaction === 'like') post.likes += value;
    if (reaction === 'dislike') post.dislikes += value;
    if (reaction === 'love') post.loves += value;
}
