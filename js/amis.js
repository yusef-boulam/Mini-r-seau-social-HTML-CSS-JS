// Liste d'amis codée en dur
const friends = [
    { id: 1, name: "John Doe", messageLink: "conversation.html?friend=John%20Doe" },
    { id: 2, name: "Jane Doe", messageLink: "conversation.html?friend=Jane%20Doe" },
    { id: 3, name: "Alice", messageLink: "conversation.html?friend=Alice" },
    { id: 4, name: "Bob", messageLink: "conversation.html?friend=Bob" }
];

// Afficher la liste d'amis
const friendListContainer = document.querySelector('.friend-list');
const searchInput = document.getElementById('friend-search'); // Le champ de recherche

function displayFriends(friendList) {
    friendListContainer.innerHTML = ''; // Effacer la liste avant de la remplir

    // Parcourir les amis et les ajouter à la page
    friendList.forEach(friend => {
        const friendElement = document.createElement('div');
        friendElement.classList.add('friend');
        friendElement.setAttribute('draggable', 'true'); // Rendre chaque ami "draggable"

        // HTML de l'ami avec lien vers la messagerie
        friendElement.innerHTML = `
        <p>${friend.name}</p>
        <a href="${friend.messageLink}">Envoyer un message</a>
      `;

        // Ajouter l'élément à la liste
        friendListContainer.appendChild(friendElement);
    });
}

// Afficher tous les amis au chargement
displayFriends(friends);

// Ajouter un événement de recherche pour filtrer les amis
searchInput.addEventListener('input', () => {
    const searchValue = searchInput.value.toLowerCase(); // Convertir la recherche en minuscules

    // Filtrer les amis en fonction de la recherche
    const filteredFriends = friends.filter(friend =>
        friend.name.toLowerCase().includes(searchValue)
    );

    // Afficher la liste filtrée
    displayFriends(filteredFriends);
});
