// Charger les conversations à partir du fichier JSON
fetch('data/messages.json')
    .then(response => response.json())
    .then(conversations => {
        const conversationsContainer = document.querySelector('.conversations');

        // Parcourir les conversations et les afficher
        conversations.forEach(conversation => {
            // Récupérer l'ami (autre que "Vous")
            const friendName = conversation.participants.find(participant => participant !== "Vous");

            // Récupérer le dernier message de la conversation
            const lastMessage = conversation.messages[conversation.messages.length - 1];

            // Créer un élément pour la conversation
            const conversationElement = document.createElement('div');
            conversationElement.classList.add('conversation');

            // Afficher les participants et le dernier message
            conversationElement.innerHTML = `
        <h2>${friendName}</h2>
        <p>Dernier message : <strong>${lastMessage.sender}:</strong> ${lastMessage.content}</p>
        <a href="conversation.html?friend=${encodeURIComponent(friendName)}">Voir la conversation</a>
      `;

            conversationsContainer.appendChild(conversationElement);
        });
    })
    .catch(error => console.error('Erreur lors du chargement des conversations:', error));
