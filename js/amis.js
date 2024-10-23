// Liste d'amis codée en dur
const friends = [
    { id: 1, name: "John Doe", messageLink: "conversation.html?friend=John%20Doe" },
    { id: 2, name: "Jane Doe", messageLink: "conversation.html?friend=Jane%20Doe" },
    { id: 3, name: "Alice", messageLink: "conversation.html?friend=Alice" },
    { id: 4, name: "Bob", messageLink: "conversation.html?friend=Bob" }
];

// Afficher la liste d'amis
const friendListContainer = document.querySelector('.friend-list');

function displayFriends() {
    friendListContainer.innerHTML = '';

    // Parcourir les amis et les ajouter à la page
    friends.forEach(friend => {
        const friendElement = document.createElement('div');
        friendElement.classList.add('friend');

        // HTML de l'ami avec lien vers une conversation avec cet ami
        friendElement.innerHTML = `
        <p>${friend.name}</p>
        <a href="${friend.messageLink}">Envoyer un message</a>
      `;

        friendListContainer.appendChild(friendElement);
    });
}

// Afficher la liste au chargement de la page
displayFriends();
