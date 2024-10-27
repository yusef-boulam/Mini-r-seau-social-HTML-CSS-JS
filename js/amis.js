// Liste d'amis codée en dur avec photos de profil chargées localement et liens vers la messagerie
const friends = [
    { id: 1, name: "John Smith", profilePicture: "./images/profils/john.webp", messageLink: "conversation.html?friend=John" },
    { id: 2, name: "Jane", profilePicture: "./images/profils/jane.webp", messageLink: "conversation.html?friend=Jane" },
    { id: 3, name: "Alice Dubois", profilePicture: "./images/profils/alice.webp", messageLink: "conversation.html?friend=Alice" },
    { id: 4, name: "Bob", profilePicture: "./images/profils/bob.webp", messageLink: "conversation.html?friend=Bob" }
];

// Sélection des éléments HTML pour afficher la liste d'amis et pour la recherche d'amis
const friendListContainer = document.querySelector('.friend-list');
const friendSearchInput = document.getElementById('friend-search');

let draggedFriend = null; // Garde la référence de l'ami en train d'être déplacé

// Fonction pour afficher les amis et ajouter des espaces de drop entre eux
function displayFriends(filter = '') {
    friendListContainer.innerHTML = ''; // Réinitialise la liste des amis

    friends
        // Filtre les amis selon le texte de recherche
        .filter(friend => friend.name.toLowerCase().includes(filter.toLowerCase()))
        .forEach(friend => {
            // Créer un espace de drop avant chaque contact pour drag and drop
            const dropZone = document.createElement('div');
            dropZone.classList.add('drop-zone');
            friendListContainer.appendChild(dropZone);
            addDropZoneEvents(dropZone); // Ajoute les événements de drag and drop à chaque zone

            // Crée un élément pour chaque ami avec son image et un lien vers la messagerie
            const friendElement = document.createElement('div');
            friendElement.classList.add('friend');
            friendElement.setAttribute('draggable', 'true'); // Rendre chaque ami "draggable"
            friendElement.dataset.id = friend.id; // Ajoute un identifiant pour chaque ami

            friendElement.innerHTML = `
                <div class="friend-info">
                    <img src="${friend.profilePicture}" alt="Photo de ${friend.name}" class="friend-profile-pic">
                    <p>${friend.name}</p>
                </div>
                <a href="${friend.messageLink}" class="btn">Envoyer un message</a>
            `;

            friendListContainer.appendChild(friendElement);
            addDragAndDropEvents(friendElement); // Ajoute les événements de drag and drop aux amis
        });

    // Ajouter un dernier espace de drop à la fin pour permettre le déplacement d'un ami à la fin de la liste
    const dropZone = document.createElement('div');
    dropZone.classList.add('drop-zone');
    friendListContainer.appendChild(dropZone);
    addDropZoneEvents(dropZone);
}

// Fonction pour ajouter des événements de drag and drop aux amis
function addDragAndDropEvents(friendElement) {
    friendElement.addEventListener('dragstart', (event) => {
        draggedFriend = event.target; // Sauvegarde l'élément en cours de drag
    });

    friendElement.addEventListener('dragend', () => {
        draggedFriend = null; // Réinitialise l'élément en cours de drag
        resetDropZones(); // Réinitialise les zones de dépôt après le drag
    });

    friendElement.addEventListener('dragover', (event) => {
        event.preventDefault(); // Permet le drop
        const bounding = event.target.getBoundingClientRect(); // Récupère les dimensions de l'élément
        const offset = event.clientY - bounding.top;

        resetDropZones(); // Réinitialise les zones de dépôt avant d'ajuster

        // Vérifie si c'est le premier ami dans la liste
        if (event.target === friendListContainer.firstChild.nextSibling) {
            // Si c'est le premier ami, autorise le drop uniquement en dessous
            event.target.nextSibling?.classList.add('drag-over');
        } else {
            // Sinon, détermine la moitié supérieure ou inférieure pour ajuster la zone de dépôt
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
            // Insère l'ami déplacé avant la zone de dépôt
            friendListContainer.insertBefore(draggedFriend, dropZone.nextSibling);
            reorganizeDropZones(); // Réorganise les zones de drop après chaque déplacement
        }
    });
}

// Fonction pour réinitialiser les zones de drop
function resetDropZones() {
    // Retire la classe 'drag-over' de toutes les zones de dépôt pour un état propre
    document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.classList.remove('drag-over');
    });
}

// Fonction pour réorganiser les zones de drop de manière uniforme après un déplacement
function reorganizeDropZones() {
    // Récupère tous les éléments amis dans friendListContainer
    const friends = Array.from(friendListContainer.querySelectorAll('.friend'));

    // Réinitialise friendListContainer
    friendListContainer.innerHTML = '';

    // Ajoute un espace de drop et un ami de manière alternée pour uniformiser la liste
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

// Fonction de filtrage pour rechercher des amis dans la liste
friendSearchInput.addEventListener('input', (event) => {
    const searchValue = event.target.value;
    displayFriends(searchValue); // Filtrer les amis en fonction du texte saisi dans le champ de recherche
});

// Afficher la liste des amis au chargement de la page
displayFriends();
