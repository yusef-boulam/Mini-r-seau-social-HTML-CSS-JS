// Liste d'amis codée en dur avec photos de profil chargées localement et liens vers la messagerie
const friends = [
    { id: 1, name: "John", profilePicture: "./images/profils/john.webp", messageLink: "conversation.html?friend=John" },
    { id: 2, name: "Jane", profilePicture: "./images/profils/jane.webp", messageLink: "conversation.html?friend=Jane" },
    { id: 3, name: "Alice", profilePicture: "./images/profils/alice.webp", messageLink: "conversation.html?friend=Alice" },
    { id: 4, name: "Bob", profilePicture: "./images/profils/bob.webp", messageLink: "conversation.html?friend=Bob" }
];

// Afficher la liste d'amis
const friendListContainer = document.querySelector('.friend-list');
const friendSearchInput = document.getElementById('friend-search');

// Fonction pour afficher les amis (avec un filtre optionnel)
function displayFriends(filter = '') {
    friendListContainer.innerHTML = ''; // Réinitialiser la liste des amis

    // Parcourir les amis et les ajouter à la page
    friends
        .filter(friend => friend.name.toLowerCase().includes(filter.toLowerCase())) // Filtrer les amis
        .forEach(friend => {
            const friendElement = document.createElement('div');
            friendElement.classList.add('friend');
            friendElement.setAttribute('draggable', 'true'); // Rendre chaque ami "draggable"
            friendElement.dataset.id = friend.id; // Ajouter un identifiant pour chaque ami

            // HTML de l'ami avec la photo de profil à côté du nom et le lien vers la messagerie
            friendElement.innerHTML = `
                <div class="friend-info">
                    <img src="${friend.profilePicture}" alt="Photo de ${friend.name}" class="friend-profile-pic">
                    <p>${friend.name}</p>
                </div>
                <a href="${friend.messageLink}" class="btn">Envoyer un message</a>
            `;

            // Ajouter l'élément à la liste
            friendListContainer.appendChild(friendElement);

            // Ajouter les événements de drag and drop
            addDragAndDropEvents(friendElement);
        });
}

// Fonction de filtrage
friendSearchInput.addEventListener('input', (event) => {
    const searchValue = event.target.value;
    displayFriends(searchValue); // Filtrer les amis en fonction du texte saisi
});

let draggedFriend = null; // Garde la référence de l'ami en train d'être déplacé

// Fonction pour ajouter les événements de drag and drop à chaque ami
function addDragAndDropEvents(friendElement) {

    // Début du drag
    friendElement.addEventListener('dragstart', (event) => {
        draggedFriend = event.target; // Sauvegarder l'élément en cours de drag
        event.target.style.opacity = 0.5; // Appliquer un effet visuel au démarrage du drag
    });

    // Fin du drag
    friendElement.addEventListener('dragend', (event) => {
        event.target.style.opacity = ''; // Réinitialiser l'opacité
        draggedFriend = null; // Réinitialiser l'ami déplacé
    });

    // Permettre le drop sur d'autres éléments
    friendElement.addEventListener('dragover', (event) => {
        event.preventDefault(); // Permettre le drop
        event.target.classList.add('drag-over'); // Style visuel pour montrer la cible du drop
    });

    // Quand l'utilisateur quitte l'élément sans déposer
    friendElement.addEventListener('dragleave', (event) => {
        event.target.classList.remove('drag-over'); // Retirer le style quand le drag quitte l'élément
    });

    // Gestion du drop
    friendElement.addEventListener('drop', (event) => {
        event.preventDefault();
        event.target.classList.remove('drag-over'); // Retirer le style de drag-over
        if (draggedFriend !== friendElement) {
            // Réorganiser les amis
            const allFriends = Array.from(friendListContainer.querySelectorAll('.friend'));
            const draggedIndex = allFriends.indexOf(draggedFriend);
            const targetIndex = allFriends.indexOf(friendElement);

            // Insertion logique du drag par rapport à l'ami ciblé
            if (targetIndex > draggedIndex) {
                friendListContainer.insertBefore(draggedFriend, friendElement.nextSibling);
            } else {
                friendListContainer.insertBefore(draggedFriend, friendElement);
            }
        }
    });
}

// Afficher la liste des amis au chargement de la page
displayFriends();
