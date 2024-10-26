// Liste d'amis codée en dur avec photos de profil chargées localement et liens vers la messagerie
const friends = [
    { id: 1, name: "John", profilePicture: "./images/profils/john.webp", messageLink: "conversation.html?friend=John" },
    { id: 2, name: "Jane", profilePicture: "./images/profils/jane.webp", messageLink: "conversation.html?friend=Jane" },
    { id: 3, name: "Alice", profilePicture: "./images/profils/alice.webp", messageLink: "conversation.html?friend=Alice" },
    { id: 4, name: "Bob", profilePicture: "./images/profils/bob.webp", messageLink: "conversation.html?friend=Bob" }
];

const friendListContainer = document.querySelector('.friend-list');
const friendSearchInput = document.getElementById('friend-search');

let draggedFriend = null; // Garde la référence de l'ami en train d'être déplacé

// Fonction pour afficher les amis et ajouter des espaces de drop entre eux
function displayFriends(filter = '') {
    friendListContainer.innerHTML = ''; // Réinitialiser la liste des amis

    friends
        .filter(friend => friend.name.toLowerCase().includes(filter.toLowerCase()))
        .forEach(friend => {
            // Créer un espace de drop avant chaque contact
            const dropZone = document.createElement('div');
            dropZone.classList.add('drop-zone');
            friendListContainer.appendChild(dropZone);
            addDropZoneEvents(dropZone);

            // Créer et ajouter le contact
            const friendElement = document.createElement('div');
            friendElement.classList.add('friend');
            friendElement.setAttribute('draggable', 'true'); // Rendre chaque ami "draggable"
            friendElement.dataset.id = friend.id; // Ajouter un identifiant pour chaque ami

            friendElement.innerHTML = `
                <div class="friend-info">
                    <img src="${friend.profilePicture}" alt="Photo de ${friend.name}" class="friend-profile-pic">
                    <p>${friend.name}</p>
                </div>
                <a href="${friend.messageLink}" class="btn">Envoyer un message</a>
            `;

            friendListContainer.appendChild(friendElement);
            addDragAndDropEvents(friendElement);
        });

    // Ajouter un dernier espace de drop à la fin
    const dropZone = document.createElement('div');
    dropZone.classList.add('drop-zone');
    friendListContainer.appendChild(dropZone);
    addDropZoneEvents(dropZone);
}

// Fonction pour ajouter des événements de drag and drop aux amis
function addDragAndDropEvents(friendElement) {
    friendElement.addEventListener('dragstart', (event) => {
        draggedFriend = event.target; // Sauvegarder l'élément en cours de drag
    });

    friendElement.addEventListener('dragend', () => {
        draggedFriend = null; // Réinitialiser l'élément en cours de drag
        resetDropZones(); // Réinitialiser les zones de dépôt après le drag
    });

    friendElement.addEventListener('dragover', (event) => {
        event.preventDefault();
        const bounding = event.target.getBoundingClientRect();
        const offset = event.clientY - bounding.top;

        resetDropZones(); // Réinitialiser les zones de dépôt avant d'ajuster

        // Vérifier si c'est le premier contact
        if (event.target === friendListContainer.firstChild.nextSibling) {
            // Si c'est le premier contact, on permet le drop uniquement en dessous
            event.target.nextSibling?.classList.add('drag-over');
        } else {
            // Sinon, on détermine la moitié supérieure ou inférieure pour ajuster la zone de dépôt
            if (offset < bounding.height / 2) {
                event.target.previousSibling?.classList.add('drag-over'); // Agrandit la zone de dépôt au-dessus
            } else {
                event.target.nextSibling?.classList.add('drag-over'); // Agrandit la zone de dépôt en dessous
            }
        }
    });
}

// Fonction pour ajouter les événements de drop aux zones de drop
function addDropZoneEvents(dropZone) {
    dropZone.addEventListener('dragover', (event) => {
        event.preventDefault(); // Permettre le drop
    });

    dropZone.addEventListener('drop', (event) => {
        event.preventDefault();
        if (draggedFriend) {
            friendListContainer.insertBefore(draggedFriend, dropZone.nextSibling);
            reorganizeDropZones(); // Réorganiser les zones de drop après chaque déplacement
        }
    });
}

// Fonction pour réinitialiser les zones de drop
function resetDropZones() {
    document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.classList.remove('drag-over');
    });
}

// Fonction pour réorganiser les zones de drop de manière uniforme
function reorganizeDropZones() {
    // Récupère tous les éléments amis dans friendListContainer
    const friends = Array.from(friendListContainer.querySelectorAll('.friend'));

    // Réinitialise friendListContainer
    friendListContainer.innerHTML = '';

    // Ajoute un espace de drop et un contact de manière alternée pour tout uniformiser
    friends.forEach(friend => {
        const dropZone = document.createElement('div');
        dropZone.classList.add('drop-zone');
        friendListContainer.appendChild(dropZone);
        addDropZoneEvents(dropZone);

        friendListContainer.appendChild(friend);
    });

    // Ajoute un dernier espace de drop à la fin
    const finalDropZone = document.createElement('div');
    finalDropZone.classList.add('drop-zone');
    friendListContainer.appendChild(finalDropZone);
    addDropZoneEvents(finalDropZone);
}

// Fonction de filtrage
friendSearchInput.addEventListener('input', (event) => {
    const searchValue = event.target.value;
    displayFriends(searchValue); // Filtrer les amis en fonction du texte saisi
});

// Afficher la liste des amis au chargement de la page
displayFriends();
