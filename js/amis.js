// Liste d'amis codée en dur avec photos de profil
const friends = [
    { id: 1, name: "John", profilePicture: "https://randomuser.me/api/portraits/men/1.jpg" },
    { id: 2, name: "Jane", profilePicture: "https://randomuser.me/api/portraits/women/2.jpg" },
    { id: 3, name: "Alice", profilePicture: "https://randomuser.me/api/portraits/women/3.jpg" },
    { id: 4, name: "Bob", profilePicture: "https://randomuser.me/api/portraits/men/4.jpg" }
];

// Afficher la liste d'amis
const friendListContainer = document.querySelector('.friend-list');

function displayFriends() {
    friendListContainer.innerHTML = '';

    // Parcourir les amis et les ajouter à la page
    friends.forEach(friend => {
        const friendElement = document.createElement('div');
        friendElement.classList.add('friend');
        friendElement.setAttribute('draggable', 'true'); // Rendre chaque ami "draggable"
        friendElement.dataset.id = friend.id; // Ajouter un identifiant pour chaque ami

        // HTML de l'ami avec lien vers la messagerie
        friendElement.innerHTML = `
        <p>${friend.name}</p>
        <a href="${friend.messageLink}">Envoyer un message</a>
      `;

        // Ajouter l'élément à la liste
        friendListContainer.appendChild(friendElement);

        // Ajouter les événements de drag and drop
        addDragAndDropEvents(friendElement);
    });
}

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

// Afficher la liste au chargement de la page
displayFriends();
