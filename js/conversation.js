// Récupérer le nom de l'ami depuis l'URL
const urlParams = new URLSearchParams(window.location.search);
const friendName = urlParams.get('friend');

// Charger les messages de la conversation avec cet ami
fetch('data/messages.json')
    .then(response => response.json())
    .then(conversations => {
        let conversation = conversations.find(conv => conv.participants.includes(friendName) && conv.participants.length === 2);
        if (!conversation) {
            conversation = {
                conversation_id: Date.now(),
                participants: ["Vous", friendName],
                messages: []
            };
        }

        const messagesContainer = document.querySelector('.messages');

        const conversationTitle = document.createElement('h2');
        conversationTitle.textContent = `Conversation avec ${friendName}`;
        document.querySelector('main').insertBefore(conversationTitle, messagesContainer);

        conversation.messages.forEach(message => {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');
            if (message.sender === "Vous") {
                messageElement.classList.add('user-message');
            }
            messageElement.innerHTML = `
                <img src="./images/profils/${message.profilePicture}" alt="${message.sender}" class="profile-pic">
                <div class="message-content">
                  <p><strong>${message.sender}:</strong> ${message.content}</p>
                  <small>${message.timestamp}</small>
                </div>
            `;
            messagesContainer.appendChild(messageElement);
        });

        const sendMessageBtn = document.getElementById('send-message');
        const newMessageInput = document.getElementById('new-message');

        function sendMessage() {
            const newMessageContent = newMessageInput.value.trim();
            if (newMessageContent === "") {
                return;
            }

            const newMessageElement = document.createElement('div');
            newMessageElement.classList.add('message', 'user-message');
            newMessageElement.innerHTML = `
                <img src="./images/profils/Vous.webp" alt="Vous" class="profile-pic">
                <div class="message-content">
                    <p><strong>Vous:</strong> ${newMessageContent.replace(/\n/g, '<br>')}</p>
                    <small>${new Date().toLocaleString()}</small>
                </div>
            `;
            messagesContainer.appendChild(newMessageElement);
            newMessageInput.value = "";

            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            conversation.messages.push({
                sender: "Vous",
                content: newMessageContent,
                timestamp: new Date().toLocaleString(),
                profilePicture: "Vous.webp"
            });
        }

        sendMessageBtn.addEventListener('click', () => {
            sendMessage();
        });

    })
    .catch(error => console.error('Erreur lors du chargement de la conversation:', error));
