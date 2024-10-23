// Récupérer l'ID de la conversation depuis l'URL
const urlParams = new URLSearchParams(window.location.search);
const conversationId = urlParams.get('id');

// Charger les messages de la conversation
fetch('data/messages.json')
    .then(response => response.json())
    .then(conversations => {
        const conversation = conversations.find(conv => conv.conversation_id == conversationId);
        const messagesContainer = document.querySelector('.messages');

        // Afficher chaque message de la conversation
        conversation.messages.forEach(message => {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');

            messageElement.innerHTML = `
        <p><strong>${message.sender}:</strong> ${message.content}</p>
        <small>${message.timestamp}</small>
      `;

            messagesContainer.appendChild(messageElement);
        });

        // Gestion de l'envoi de nouveaux messages
        const sendMessageBtn = document.getElementById('send-message');
        const newMessageInput = document.getElementById('new-message');

        sendMessageBtn.addEventListener('click', () => {
            const newMessageContent = newMessageInput.value.trim();
            if (newMessageContent !== "") {
                const newMessageElement = document.createElement('div');
                newMessageElement.classList.add('message');
                newMessageElement.innerHTML = `
          <p><strong>Vous:</strong> ${newMessageContent}</p>
          <small>${new Date().toLocaleString()}</small>
        `;
                messagesContainer.appendChild(newMessageElement);
                newMessageInput.value = ""; // Effacer le champ
            }
        });
    })
    .catch(error => console.error('Erreur lors du chargement de la conversation:', error));
