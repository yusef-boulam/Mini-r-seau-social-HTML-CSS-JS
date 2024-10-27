// Effectue une requête pour charger les données de conversation depuis 'messages.json'
fetch('data/messages.json')
    .then(response => response.json())
    .then(conversations => {
        const conversationsContainer = document.querySelector('.conversations');

        // Parcourt chaque conversation pour extraire les informations et créer un affichage
        conversations.forEach(conversation => {
            // Identifie l'ami dans la conversation (celui qui n'est pas "Vous")
            const friendName = conversation.participants.find(participant => participant !== "Vous");

            // Récupère la photo de profil de l'ami basée sur son dernier message
            const friendProfilePic = conversation.messages.find(msg => msg.sender === friendName).profilePicture;

            // Récupère le dernier message de la conversation pour l'afficher dans le récapitulatif
            const lastMessage = conversation.messages[conversation.messages.length - 1];

            // Crée un conteneur pour chaque conversation avec la classe 'conversation'
            const conversationElement = document.createElement('div');
            conversationElement.classList.add('conversation');

            // Utilise les informations récupérées pour structurer l'affichage de chaque conversation
            conversationElement.innerHTML = `
                <div class="conversation-header">
                    <img src="./images/profils/${friendProfilePic}" alt="${friendName} Profile Picture" class="profile-pic">
                    <div>
                        <h2>${friendName}</h2>
                        <div class="last-message">
                            <p>Dernier message :</p> 
                            <p><strong>${lastMessage.sender}:</strong> ${lastMessage.content}</p>
                        </div>
                    </div>
                </div>
                <a href="conversation.html?friend=${encodeURIComponent(friendName)}" class="btn">Voir la conversation</a>
            `;

            // Ajoute chaque conversation au conteneur principal de la liste des conversations
            conversationsContainer.appendChild(conversationElement);
        });
    })
    // Affiche un message d'erreur en cas de problème lors du chargement des données JSON
    .catch(error => console.error('Erreur lors du chargement des conversations:', error));
