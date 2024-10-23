// Charger les conversations à partir du JSON
fetch('data/messages.json')
    .then(response => response.json())
    .then(conversations => {
        const conversationsContainer = document.querySelector('.conversations');

        // Parcourir les conversations et les afficher
        conversations.forEach(conversation => {
            const conversationElement = document.createElement('div');
            conversationElement.classList.add('conversation');

            // Afficher les participants et le dernier message
            conversationElement.innerHTML = `
        <h2>${conversation.participants.join(', ')}</h2>
        <p>Dernier message: ${conversation.last_message}</p>
        <a href="conversation.html?id=${conversation.conversation_id}">Voir la conversation</a>
      `;

            conversationsContainer.appendChild(conversationElement);
        });
    })
    .catch(error => console.error('Erreur lors du chargement des conversations:', error));
