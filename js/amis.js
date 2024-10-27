// Liste des amis avec leurs prénoms, noms de famille, photos de profil et liens de message
const friends = [
    {
        id: 1,
        firstName: "John",
        lastName: "Smith",
        profilePicture: "./images/profils/john.webp",
        messageLink: "conversation.html?friend=John" 
    },
    {
        id: 2,
        firstName: "Jane",
        lastName: "",
        profilePicture: "./images/profils/jane.webp",
        messageLink: "conversation.html?friend=Jane" 
    },
    {
        id: 3,
        firstName: "Alice",
        lastName: "Dubois",
        profilePicture: "./images/profils/alice.webp",
        messageLink: "conversation.html?friend=Alice"
    },
    {
        id: 4,
        firstName: "Bob",
        lastName: "",
        profilePicture: "./images/profils/bob.webp",
        messageLink: "conversation.html?friend=Bob"
    }
];

// Sélection du conteneur où la liste d'amis sera affichée
const sortableList = document.querySelector(".sortable-list");

// Vérification que le conteneur existe
if (!sortableList) {
    console.error("Le conteneur .sortable-list n'existe pas.");
}

// Sélection du champ de recherche
const friendSearchInput = document.getElementById('friend-search');

// Variables pour le glisser-déposer
let draggedElement = null; // Élément actuellement glissé
let offsetY = 0; // Décalage Y pour aligner l'élément au point de contact

// Fonction pour extraire les initiales du prénom et du nom
function getInitials(firstName, lastName) {
    const firstNameInitial = firstName ? firstName.charAt(0).toLowerCase() : '';
    const lastNameInitial = lastName ? lastName.charAt(0).toLowerCase() : '';
    return { firstNameInitial, lastNameInitial };
}

// Fonction pour afficher la liste des amis avec possibilité de filtrage
function displayFriends(filter = '') {
    if (!sortableList) return; // Si le conteneur n'existe pas, on arrête la fonction

    sortableList.innerHTML = ''; // Vide le contenu actuel du conteneur

    friends.forEach(friend => {
        const { firstNameInitial, lastNameInitial } = getInitials(friend.firstName, friend.lastName);
        const filterLower = filter.toLowerCase();

        // Vérifie si le filtre correspond à la première lettre du prénom ou du nom
        if (filter === '' || firstNameInitial === filterLower || lastNameInitial === filterLower) {
            // Crée un élément de liste pour chaque ami
            const friendElement = document.createElement('div');
            friendElement.classList.add('friend', 'item'); // Ajoute des classes pour le style et le tri
            friendElement.dataset.id = friend.id; // Stocke l'ID de l'ami pour référence

            // Construit le nom complet
            const fullName = friend.firstName + (friend.lastName ? ' ' + friend.lastName : '');

            // Définit le contenu HTML de l'élément ami
            friendElement.innerHTML = `
                <div class="friend-info details">
                    <img src="${friend.profilePicture}" alt="Photo de ${fullName}" class="friend-profile-pic">
                    <p>${fullName}</p>
                </div>
                <a href="${friend.messageLink}" class="btn">Envoyer un message</a>
            `;

            // Ajoute l'élément ami au conteneur principal
            sortableList.appendChild(friendElement);

            // Ajoute les événements de glisser-déposer pour l'élément ami
            addUnifiedDragEvents(friendElement);
        }
    });
}

// Fonction pour ajouter les événements de glisser-déposer unifiés (souris et tactile)
function addUnifiedDragEvents(friendElement) {
    // Vérifie que l'élément existe avant d'ajouter les événements
    if (!friendElement) return;

    // Gestion du début du glissement avec la souris
    friendElement.addEventListener("mousedown", (e) => {
        // Si le clic est sur le bouton, ne pas initier le glissement
        if (e.target.closest('.btn')) {
            return;
        }
        e.preventDefault();
        startDrag(e.clientY, friendElement);
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    });

    // Gestion du début du glissement tactile (mobile)
    friendElement.addEventListener("touchstart", (e) => {
        // Si le toucher est sur le bouton, ne pas initier le glissement
        if (e.target.closest('.btn')) {
            return;
        }
        e.preventDefault();
        const touch = e.touches[0];
        startDrag(touch.clientY, friendElement);
        document.addEventListener("touchmove", onTouchMove, { passive: false });
        document.addEventListener("touchend", onTouchEnd);
    });

    // Fonction pour initialiser le glissement et conserver la taille de l'élément
    function startDrag(clientY, element) {
        draggedElement = element;
        draggedElement.classList.add("dragging"); // Ajoute une classe pour le style pendant le glissement

        // Calcule le décalage Y pour aligner l'élément avec le point de contact
        offsetY = clientY - element.getBoundingClientRect().top;
        draggedElement.style.width = `${element.offsetWidth}px`; // Conserve la largeur
        draggedElement.style.height = `${element.offsetHeight}px`; // Conserve la hauteur
    }

    // Gestion du mouvement de la souris pendant le glissement
    function onMouseMove(e) {
        e.preventDefault();
        onDrag(e.clientY);
    }

    // Gestion du mouvement tactile pendant le glissement
    function onTouchMove(e) {
        e.preventDefault();
        const touch = e.touches[0];
        onDrag(touch.clientY);
    }

    // Fonction pour gérer le déplacement de l'élément glissé
    function onDrag(clientY) {
        if (!draggedElement) return;

        const yPosition = clientY - offsetY;
        draggedElement.style.position = "absolute";
        draggedElement.style.zIndex = "1000";
        draggedElement.style.top = `${yPosition}px`;

        // Trouve l'élément après lequel insérer l'élément glissé
        const afterElement = getDragAfterElement(sortableList, clientY);
        if (afterElement) {
            sortableList.insertBefore(draggedElement, afterElement);
        } else {
            sortableList.appendChild(draggedElement);
        }
    }

    // Gestion de la fin du glissement avec la souris
    function onMouseUp() {
        endDrag();
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
    }

    // Gestion de la fin du glissement tactile
    function onTouchEnd() {
        endDrag();
        document.removeEventListener("touchmove", onTouchMove);
        document.removeEventListener("touchend", onTouchEnd);
    }

    // Fonction pour terminer le glissement et réinitialiser les styles
    function endDrag() {
        if (draggedElement) {
            draggedElement.style.position = "static";
            draggedElement.style.zIndex = "";
            draggedElement.style.top = "";
            draggedElement.style.width = ""; // Réinitialise la largeur
            draggedElement.style.height = ""; // Réinitialise la hauteur
            draggedElement.classList.remove("dragging");
            draggedElement = null;
        }
    }
}

// Fonction pour déterminer l'emplacement d'insertion pendant le glissement
function getDragAfterElement(container, clientY) {
    // Sélectionne tous les éléments qui ne sont pas en cours de glissement
    const elements = [...container.querySelectorAll(".item:not(.dragging)")];
    return elements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = clientY - box.top - box.height / 2;
        // Trouve l'élément le plus proche au point de contact
        return (offset < 0 && offset > closest.offset) ? { offset: offset, element: child } : closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Écouteur d'événement pour le champ de recherche des amis
friendSearchInput.addEventListener('input', (event) => {
    const searchValue = event.target.value.trim().toLowerCase();
    displayFriends(searchValue); // Met à jour l'affichage en fonction du filtre
});

// Affichage initial de la liste d'amis
displayFriends();
