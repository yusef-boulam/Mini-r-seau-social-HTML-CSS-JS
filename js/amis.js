// Liste d'amis codée en dur avec photos de profil et liens vers la messagerie
const friends = [
    { id: 1, name: "John Smith", profilePicture: "./images/profils/john.webp", messageLink: "conversation.html?friend=John" },
    { id: 2, name: "Jane", profilePicture: "./images/profils/jane.webp", messageLink: "conversation.html?friend=Jane" },
    { id: 3, name: "Alice Dubois", profilePicture: "./images/profils/alice.webp", messageLink: "conversation.html?friend=Alice" },
    { id: 4, name: "Bob", profilePicture: "./images/profils/bob.webp", messageLink: "conversation.html?friend=Bob" }
];

const friendListContainer = document.querySelector('.friend-list');
const friendSearchInput = document.getElementById('friend-search');

// Initialiser le drag-and-drop
function displayFriends(filter = '') {
    friendListContainer.innerHTML = ''; // Réinitialise la liste des amis

    friends
        .filter(friend => friend.name.toLowerCase().includes(filter.toLowerCase()))
        .forEach(friend => {
            // Crée chaque élément ami
            const friendElement = document.createElement('div');
            friendElement.classList.add('friend');
            friendElement.setAttribute('draggable', 'true');
            friendElement.dataset.id = friend.id;

            friendElement.innerHTML = `
                <div class="friend-info">
                    <img src="${friend.profilePicture}" alt="Photo de ${friend.name}" class="friend-profile-pic">
                    <p>${friend.name}</p>
                </div>
                <a href="${friend.messageLink}" class="btn">Envoyer un message</a>
            `;

            friendListContainer.appendChild(friendElement);
            addDragEvents(friendElement);
        });
}

// Fonction pour ajouter des événements de drag-and-drop simples
function addDragEvents(friendElement) {
    friendElement.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text/plain', event.target.dataset.id);
        friendElement.classList.add('dragging');
    });

    friendElement.addEventListener('dragend', () => {
        friendElement.classList.remove('dragging');
    });

    friendListContainer.addEventListener('dragover', (event) => {
        event.preventDefault();
        const draggingElement = document.querySelector('.dragging');
        const afterElement = getDragAfterElement(friendListContainer, event.clientY);
        if (afterElement == null) {
            friendListContainer.appendChild(draggingElement);
        } else {
            friendListContainer.insertBefore(draggingElement, afterElement);
        }
    });
}

// Fonction pour obtenir la position après laquelle insérer l'élément en cours de drag
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.friend:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Filtrer les amis selon la recherche
friendSearchInput.addEventListener('input', (event) => {
    displayFriends(event.target.value);
});

// Affichage initial
displayFriends();
