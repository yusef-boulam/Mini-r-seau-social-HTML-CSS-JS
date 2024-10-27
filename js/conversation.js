// Récupérer le nom de l'ami depuis l'URL
const urlParams = new URLSearchParams(window.location.search);
const friendName = urlParams.get('friend'); // Nom de l'ami pour charger la conversation spécifique

// Charger les messages de la conversation avec cet ami depuis le fichier JSON
fetch('data/messages.json')
    .then(response => response.json())
    .then(conversations => {
        // Trouve la conversation avec l'ami spécifié et assure que c'est bien une conversation à deux participants
        let conversation = conversations.find(conv => conv.participants.includes(friendName) && conv.participants.length === 2);

        // Si la conversation n'existe pas, en créer une nouvelle vide avec "Vous" et "friendName" comme participants
        if (!conversation) {
            conversation = {
                conversation_id: Date.now(), // Génère un ID unique basé sur l'heure actuelle
                participants: ["Vous", friendName],
                messages: [] // Initialise une liste vide de messages
            };
        }

        // Sélectionne le conteneur pour afficher les messages
        const messagesContainer = document.querySelector('.messages');

        // Ajoute un titre de conversation dynamique basé sur le nom de l'ami
        const conversationTitle = document.createElement('h2');
        conversationTitle.textContent = `Conversation avec ${friendName}`;
        document.querySelector('main').insertBefore(conversationTitle, messagesContainer);

        // Parcourt les messages de la conversation et les affiche dans le conteneur
        conversation.messages.forEach(message => {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');
            // Ajoute une classe spécifique si le message est envoyé par "Vous"
            if (message.sender === "Vous") {
                messageElement.classList.add('user-message');
            }
            // Structure HTML de chaque message avec photo de profil, contenu et horodatage
            messageElement.innerHTML = `
                <img src="./images/profils/${message.profilePicture}" alt="${message.sender}" class="profile-pic">
                <div class="message-content">
                  <p><strong>${message.sender}:</strong> ${message.content}</p>
                  <small>${message.timestamp}</small>
                </div>
            `;
            messagesContainer.appendChild(messageElement); // Ajoute le message au conteneur
        });

        // Bouton et champ de saisie pour envoyer un nouveau message
        const sendMessageBtn = document.getElementById('send-message');
        const newMessageInput = document.getElementById('new-message');

        // Fonction pour envoyer un message
        function sendMessage() {
            const newMessageContent = newMessageInput.value.trim();
            if (newMessageContent === "") {
                return; // Ne rien faire si le message est vide
            }

            // Crée un élément pour le nouveau message envoyé par "Vous"
            const newMessageElement = document.createElement('div');
            newMessageElement.classList.add('message', 'user-message');
            newMessageElement.innerHTML = `
                <img src="./images/profils/Vous.webp" alt="Vous" class="profile-pic">
                <div class="message-content">
                    <p><strong>Vous:</strong> ${newMessageContent.replace(/\n/g, '<br>')}</p>
                    <small>${new Date().toLocaleString()}</small>
                </div>
            `;
            messagesContainer.appendChild(newMessageElement); // Ajoute le nouveau message au conteneur
            newMessageInput.value = ""; // Vide le champ de saisie après l'envoi

            // Fait défiler vers le bas pour voir le dernier message
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            // Ajoute le message à la conversation dans les données locales
            conversation.messages.push({
                sender: "Vous",
                content: newMessageContent,
                timestamp: new Date().toLocaleString(),
                profilePicture: "Vous.webp" // Photo de profil par défaut pour "Vous"
            });
        }

        // Événement de clic pour envoyer le message en cliquant sur le bouton "Envoyer"
        sendMessageBtn.addEventListener('click', () => {
            sendMessage();
        });

    })
    // Gère les erreurs si le fichier JSON ne se charge pas correctement
    .catch(error => console.error('Erreur lors du chargement de la conversation:', error));
