// Liste des amis avec leurs noms et photos de profil
const friends = [
    { id: 1, name: "John Smith", profilePicture: "./images/profils/john.webp" },
    { id: 2, name: "Jane Doe", profilePicture: "./images/profils/jane.webp" },
    { id: 3, name: "Alice Dubois", profilePicture: "./images/profils/alice.webp" },
    { id: 4, name: "Bob Johnson", profilePicture: "./images/profils/bob.webp" }
];

const sortableList = document.querySelector(".sortable-list");
let draggedElement = null;
let offsetY = 0; // Décalage Y pour alignement au point de contact

// Fonction pour afficher la liste des amis
function displayFriends() {
    sortableList.innerHTML = ''; // Vide la liste avant de l'afficher
    friends.forEach(friend => {
        // Crée un élément pour chaque ami
        const friendElement = document.createElement('div');
        friendElement.classList.add('friend', 'item'); // Ajoute la classe 'item' pour le tri
        friendElement.dataset.id = friend.id; // Stocke l'ID de l'ami

        friendElement.innerHTML = `
            <div class="friend-info details">
                <img src="${friend.profilePicture}" alt="Photo de ${friend.name}" class="friend-profile-pic">
                <p>${friend.name}</p>
            </div>
        `;

        sortableList.appendChild(friendElement);

        // Ajoute les événements de glisser-déposer unifiés pour PC et mobile
        addUnifiedDragEvents(friendElement);
    });
}

// Fonction pour ajouter les événements de glisser-déposer unifiés
function addUnifiedDragEvents(friendElement) {
    // Gestion du début du glissement (souris)
    friendElement.addEventListener("mousedown", (e) => {
        e.preventDefault();
        startDrag(e.clientY, friendElement);
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    });

    // Gestion du début du toucher (mobile)
    friendElement.addEventListener("touchstart", (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        startDrag(touch.clientY, friendElement);
        document.addEventListener("touchmove", onTouchMove);
        document.addEventListener("touchend", onTouchEnd);
    });

    // Fonction pour initialiser le glissement et maintenir la taille
    function startDrag(clientY, element) {
        draggedElement = element;
        draggedElement.classList.add("dragging");

        // Capture l'offset pour aligner au toucher et maintenir la taille
        offsetY = clientY - element.getBoundingClientRect().top;
        draggedElement.style.width = `${element.offsetWidth}px`; // Conserve la largeur
        draggedElement.style.height = `${element.offsetHeight}px`; // Conserve la hauteur
    }

    // Gestion du mouvement de la souris
    function onMouseMove(e) {
        e.preventDefault();
        onDrag(e.clientY);
    }

    // Gestion du mouvement tactile
    function onTouchMove(e) {
        e.preventDefault();
        const touch = e.touches[0];
        onDrag(touch.clientY);
    }

    // Fonction pour gérer le déplacement de l'élément
    function onDrag(clientY) {
        if (!draggedElement) return;

        const yPosition = clientY - offsetY;
        draggedElement.style.position = "absolute";
        draggedElement.style.zIndex = "1000";
        draggedElement.style.top = `${yPosition}px`;

        const afterElement = getDragAfterElement(sortableList, clientY);
        if (afterElement) {
            sortableList.insertBefore(draggedElement, afterElement);
        } else {
            sortableList.appendChild(draggedElement);
        }
    }

    // Gestion de la fin du glissement (souris)
    function onMouseUp() {
        endDrag();
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
    }

    // Gestion de la fin du toucher (mobile)
    function onTouchEnd() {
        endDrag();
        document.removeEventListener("touchmove", onTouchMove);
        document.removeEventListener("touchend", onTouchEnd);
    }

    // Fonction pour terminer le glissement et réinitialiser la taille
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

// Fonction pour trouver la position d'insertion de l'élément en déplacement
function getDragAfterElement(container, clientY) {
    const elements = [...container.querySelectorAll(".item:not(.dragging)")];
    return elements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = clientY - box.top - box.height / 2;
        return (offset < 0 && offset > closest.offset) ? { offset: offset, element: child } : closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Affichage initial de la liste d'amis
displayFriends();
