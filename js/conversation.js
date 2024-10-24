// Récupérer le nom de l'ami depuis l'URL
const urlParams = new URLSearchParams(window.location.search);
const friendName = urlParams.get('friend');

// Charger les messages de la conversation avec cet ami
fetch('data/messages.json')
    .then(response => response.json())
    .then(conversations => {
        // Rechercher une conversation existante avec cet ami
        let conversation = conversations.find(conv => conv.participants.includes(friendName) && conv.participants.length === 2);

        // Si aucune conversation n'existe, en créer une nouvelle
        if (!conversation) {
            conversation = {
                conversation_id: Date.now(),
                participants: ["Vous", friendName],
                messages: []
            };
        }

        const messagesContainer = document.querySelector('.messages');

        // Ajouter le nom de l'ami en tant que titre de la conversation
        const conversationTitle = document.createElement('h2');
        conversationTitle.textContent = `Conversation avec ${friendName}`;
        document.querySelector('main').insertBefore(conversationTitle, messagesContainer);

        // Afficher chaque message de la conversation
        conversation.messages.forEach(message => {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');

            // Si c'est un message de l'utilisateur "Vous", ajouter une classe spécifique
            if (message.sender === "Vous") {
                messageElement.classList.add('user-message');
            }

            // Ajouter l'image de profil, le contenu du message et l'horodatage
            messageElement.innerHTML = `
                <img src="./images/profils/${message.profilePicture}" alt="${message.sender}" class="profile-pic">
                <div class="message-content">
                  <p><strong>${message.sender}:</strong> ${message.content}</p>
                  <small>${message.timestamp}</small>
                </div>
            `;

            messagesContainer.appendChild(messageElement);
        });

        // Gestion de l'envoi de nouveaux messages
        const sendMessageBtn = document.getElementById('send-message');
        const newMessageInput = document.getElementById('new-message');

        // Fonction d'envoi de message
        function sendMessage() {
            const newMessageContent = newMessageInput.value.trim();
            if (newMessageContent === "") {
                alert("Le message ne peut pas être vide !");
                return;
            }

            const newMessageElement = document.createElement('div');
            newMessageElement.classList.add('message', 'user-message');

            // Ajout de l'image de profil avec le message
            newMessageElement.innerHTML = `
        <img src="./images/profils/Vous.webp" alt="Vous" class="profile-pic">
        <div class="message-content">
            <p><strong>Vous:</strong> ${newMessageContent.replace(/\n/g, '<br>')}</p>
            <small>${new Date().toLocaleString()}</small>
        </div>
    `;

            messagesContainer.appendChild(newMessageElement);
            newMessageInput.value = ""; // Effacer le champ après l'envoi

            // Défilement automatique vers le bas pour voir le nouveau message
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            // Ajouter le nouveau message à la conversation (en mémoire pour cette session)
            conversation.messages.push({
                sender: "Vous",
                content: newMessageContent,
                timestamp: new Date().toLocaleString(),
                profilePicture: "Vous.webp"
            });
        }

        // Envoi du message avec le bouton "Envoyer"
        sendMessageBtn.addEventListener('click', () => {
            sendMessage();
        });

        // Laisser "Entrée" ajouter une nouvelle ligne
        newMessageInput.addEventListener('keypress', (event) => {
            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault(); // Empêcher l'envoi avec "Entrée"
                sendMessage(); // Envoyer le message
            }
        });
    })
    .catch(error => console.error('Erreur lors du chargement de la conversation:', error));
