// Charger les conversations à partir du fichier JSON
fetch('data/messages.json')
    .then(response => response.json())
    .then(conversations => {
        const conversationsContainer = document.querySelector('.conversations');

        // Parcourir les conversations et les afficher
        conversations.forEach(conversation => {
            // Récupérer l'ami (autre que "Vous")
            const friendName = conversation.participants.find(participant => participant !== "Vous");

            // Récupérer la photo de profil de l'ami à partir du dernier message envoyé par lui
            const friendProfilePic = conversation.messages.find(msg => msg.sender === friendName).profilePicture;

            // Récupérer le dernier message de la conversation
            const lastMessage = conversation.messages[conversation.messages.length - 1];

            // Créer un élément pour la conversation
            const conversationElement = document.createElement('div');
            conversationElement.classList.add('conversation');

            // Afficher les participants avec la photo de profil et le dernier message
            conversationElement.innerHTML = `
                <div class="conversation-header">
                    <img src="./images/profils/${friendProfilePic}" alt="${friendName} Profile Picture" class="profile-pic">
                    <div>
                        <h2>${friendName}</h2>
                        <div class="last-message">
                        <p>Dernier message :</p> 
                        <p> <strong>${lastMessage.sender}: </strong> ${lastMessage.content}</p>
                         </div>
                    </div>
                </div>
                <a href="conversation.html?friend=${encodeURIComponent(friendName)}">Voir la conversation</a>
            `;

            conversationsContainer.appendChild(conversationElement);
        });
    })
    .catch(error => console.error('Erreur lors du chargement des conversations:', error));
