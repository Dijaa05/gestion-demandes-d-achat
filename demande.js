// Liste des machines par ligne
const machinesParLigne = {
  "KEL1": ["VITROSEP","CUTTING","WASHING MACHINE","PRINTING","DRYER","P2 FURNACE","PAIRING","POWDERING","LOADING FURNACE","FURNACE ALS","UNLOADING FURNACE","LOADING POST PROCESS","ASSEMBLY WASHING MACHINE","COOLING","ASSEMBLY LINE","STREACHING","DRUMS","DEARING","GLUING","AUTOCLAVE","BELT TRIMMING","FI WASHING MACHINE","FI VERTICAL CONVEYOR"],
  "KE31": ["CUTTING","WASHING MACHINE","PRINTING","DRYER","LOADING FURNACE","FURNACE KE31","BLEX CART","QUENCH CART","QUENCH MOTORS","COOLING","FINAL INSPECTION"],
  "KE72": ["CUTTING","WASHING MACHINE","PRINTING","DRYER","LOADING FURNACE","FURNACE KE72","BLEX CART","QUENCH CART","QUENCH MOTORS","COOLING","FINAL INSPECTION"],
  "KE73": ["CUTTING","WASHING MACHINE","PRINTING","DRYER","LOADING FURNACE","FURNACE KE73","BLEX CART","QUENCH CART","QUENCH MOTORS","COOLING","FINAL INSPECTION"],
  "AVO": ["WS P21","WS P24","WS HJB","WS A03","BL"],
  "ALL": []
};


// Charger demandes depuis localStorage
let demandes = JSON.parse(localStorage.getItem("demandes")) || [];
let currentDO = localStorage.getItem("currentDO") 
                ? parseInt(localStorage.getItem("currentDO")) 
                : 6489;

// Mise à jour automatique du numéro DO
function updateNumeroDO() {
  document.getElementById("numeroDO").value = currentDO;
}

// Date d'aujourd'hui
function setTodayDate() {
  document.getElementById("dateBesoin").value = new Date().toISOString().split('T')[0];
}

// Afficher les demandes
function afficherDemandes() {
  let tbody = document.querySelector("#tableDemandes tbody");
  tbody.innerHTML = "";
  demandes.forEach((d, demande) => {
    let row = tbody.insertRow();
    row.innerHTML = `
      <td>${d.numeroDO}</td>
      <td>${d.dateBesoin}</td>
      <td>${d.demandeur}</td>
      <td>${d.ligne}</td>
      <td>${d.machine}</td>
      <td>${d.description}</td>
      <td>${d.designation}</td>
      <td>${d.quantite}</td>
      <td>${d.criticite}</td>
      <td>${d.photo ? "<img src='" + d.photo + "' width='50'>" : ""}</td>
    `;

    // Colonne statut avec liste déroulante
    const statusCell = row.insertCell();
    const select = document.createElement("select");
    const statusOptions = [
      "Attente validation DA",
      "Attente livraison",
      "Attente création Purchase Order",
      "Demande Annulée",
      "Demande clôturée",
      "Attente validation manager"
    ];
    statusOptions.forEach(opt => {
      const option = document.createElement("option");
      option.value = opt;
      option.textContent = opt;
      if (d.statut === opt) option.selected = true;
      select.appendChild(option);
    });
    select.addEventListener("change", () => {
      demandes[index].statut = select.value;
      localStorage.setItem("demandes", JSON.stringify(demandes));
    });
    statusCell.appendChild(select);
  });
}

// Remplir machines selon ligne
document.getElementById("ligne").addEventListener("change", function () {
  let machineSelect = document.getElementById("machine");
  machineSelect.innerHTML = "";
  let ligne = this.value;
  if (machinesParLigne[ligne]) {
    machinesParLigne[ligne].forEach(m => {
      let opt = document.createElement("option");
      opt.value = m;
      opt.textContent = m;
      machineSelect.appendChild(opt);
    });
  }
});


// Soumission du formulaire
document.getElementById("demandeForm").addEventListener("submit", function (e) {
  e.preventDefault();

  let photoFile = document.getElementById("photo").files[0];
  let reader = new FileReader();

  reader.onload = function () {
    let demande = {
      numeroDO: currentDO,
      dateBesoin: document.getElementById("dateBesoin").value,
      demandeur: document.getElementById("demandeur").value,
      ligne: document.getElementById("ligne").value,
      machine: document.getElementById("machine").value,
      description: document.getElementById("description").value,
      designation: document.getElementById("designation").value,
      quantite: document.getElementById("quantite").value,
      criticite: document.getElementById("criticite").value,
      photo: reader.result || "",
      statut: "Attente validation DA"
    };

    demandes.push(demande);
    localStorage.setItem("demandes", JSON.stringify(demandes));

    currentDO++;
    localStorage.setItem("currentDO", currentDO);
    updateNumeroDO();

    afficherDemandes();
    document.getElementById("demandeForm").reset();
    setTodayDate();
  };

  if (photoFile) {
    reader.readAsDataURL(photoFile);
  } else {
    reader.onload(); // pas de photo
  }
});

// Export Excel
document.getElementById("exportExcel").addEventListener("click", function () {
  if (demandes.length === 0) {
    alert("Aucune donnée à exporter !");
    return;
  }
  let data = demandes.map(d => ({
    "Numéro DO": d.numeroDO,
    "Date besoin": d.dateBesoin,
    "Demandeur": d.demandeur,
    "Ligne": d.ligne,
    "Machine": d.machine,
    "Description": d.description,
    "Désignation": d.designation,
    "Quantité": d.quantite,
    "Criticité": d.criticite,
    "Statut": d.statut,
     "Photo": d.photoFileName || ""  // <-- Nom ou chemin du fichier photo
  }));
  let ws = XLSX.utils.json_to_sheet(data);
  let wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Demandes");
  XLSX.writeFile(wb, "demandes.xlsx");
});


// Soumission formulaire
document.getElementById("demandeForm").addEventListener("submit", function(e){
    e.preventDefault();

    let photoFile = document.getElementById("photo").files[0];
    let photoPath = photoFile ? photoFile.name : "";

    let demande = {
        numeroDO: document.getElementById("numeroDO").value,
        dateBesoin: document.getElementById("dateBesoin").value,
        demandeur: document.getElementById("demandeur").value,
        ligne: document.getElementById("ligne").value,
        machine: document.getElementById("machine").value,
        description: document.getElementById("description").value,
        designation: document.getElementById("designation").value,
        quantite: document.getElementById("quantite").value,
        criticite: document.getElementById("criticite").value,
        photo: photoPath // stocke le nom du fichier
    };

    demandes.push(demande);
    localStorage.setItem("demandes", JSON.stringify(demandes));
    lastDO++;
    updateNumeroDO();
    afficherDemandes();
    document.getElementById("demandeForm").reset();
    setTodayDate();
});



document.getElementById("demandeForm").addEventListener("submit", function(e) {
    e.preventDefault();
    
    let photoFile = document.getElementById("photo").files[0];

    if (photoFile) {
        // Créer une référence unique pour chaque image
        const photoRef = ref(storage, 'demandes/' + Date.now() + '_' + photoFile.name);
        
        uploadBytes(photoRef, photoFile).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
                ajouterDemande(url); // fonction pour ajouter la demande avec l'URL
            });
        });
    } else {
        ajouterDemande(""); // pas de photo
    }
});

function ajouterDemande(photoURL) {
    const demande = {
        numeroDO: document.getElementById("numeroDO").value,
        dateBesoin: document.getElementById("dateBesoin").value,
        demandeur: document.getElementById("demandeur").value,
        ligne: document.getElementById("ligne").value,
        machine: document.getElementById("machine").value,
        description: document.getElementById("description").value,
        designation: document.getElementById("designation").value,
        quantite: document.getElementById("quantite").value,
        criticite: document.getElementById("criticite").value,
        photo: photoURL
    };

    demandes.push(demande);
    localStorage.setItem("demandes", JSON.stringify(demandes));
    lastDO++;
    updateNumeroDO();
    afficherDemandes();
    document.getElementById("demandeForm").reset();
    setTodayDate();
}

//pour supprimer une demande mal fait 

/* Colonne Supprimer avec symbole
const deleteCell = row.insertCell();
const deleteBtn = document.createElement("span");
deleteBtn.textContent = "❌"; // symbole
deleteBtn.style.cursor = "pointer";
deleteBtn.style.color = "#DC3545";
deleteBtn.style.fontSize = "1.2rem";

deleteBtn.addEventListener("click", () => {
    if (confirm(`Voulez-vous vraiment supprimer la demande DO ${d.numeroDO} ?`)) {
        demandes.splice(index, 1); // supprime du tableau
        localStorage.setItem("demandes", JSON.stringify(demandes)); // met à jour le localStorage
        afficherDemandes(); // rafraîchit l'affichage
    }
});

deleteCell.appendChild(deleteBtn);*/



//<td>${d.photo ? `<img src="${d.photo}" width="80" height="60" style="object-fit:cover; border-radius:4px;">` : ""}</td>
// pour mettre une botton a afficher plus de details
/*
function afficherDemandes() {
    let tbody = document.querySelector("#tableDemandes tbody");
    tbody.innerHTML = "";

    demandes.forEach((d, index) => {
        let row = tbody.insertRow();

        // Ligne principale
        row.innerHTML = `
            <td>${d.numeroDO}</td>
            <td>${d.dateBesoin}</td>
            <td>${d.demandeur}</td>
            <td>${d.ligne}</td>
            <td>${d.machine}</td>
            <td>
                <button class="toggleDetails" data-index="${index}">Voir plus</button>
            </td>
        `;

        // Ligne des détails (initialement cachée)
        let detailRow = tbody.insertRow();
        detailRow.classList.add("detailRow");
        detailRow.style.display = "none"; // cachée par défaut
        detailRow.innerHTML = `
            <td colspan="6">
                <strong>Description:</strong> ${d.description} <br>
                <strong>Désignation:</strong> ${d.designation} <br>
                <strong>Quantité:</strong> ${d.quantite} <br>
                <strong>Criticité:</strong> ${d.criticite} <br>
                ${d.photo ? `<img src="${d.photo}" width="200" style="object-fit:cover; border-radius:4px;">` : ""}
            </td>
        `;

        // Bouton pour afficher/masquer détails
        row.querySelector(".toggleDetails").addEventListener("click", function() {
            if (detailRow.style.display === "none") {
                detailRow.style.display = "table-row";
                this.textContent = "Voir moins";
            } else {
                detailRow.style.display = "none";
                this.textContent = "Voir plus";
            }
        });
    });
}*/

function afficherDemandes() {
    let tbody = document.querySelector("#tableDemandes tbody");
    tbody.innerHTML = "";

    demandes.forEach((d, demande) => {
        // Ligne principale
        let row = tbody.insertRow();
        row.innerHTML = `
            <td>${d.numeroDO}</td>
            <td>${d.dateBesoin}</td>
            <td>${d.demandeur}</td>
            <td>${d.ligne}</td>
            <td>${d.machine}</td>
            <td>
                <button class="toggleDetails">Voir plus</button>
            </td>
        `;

        // Ligne des détails
        let detailRow = tbody.insertRow();
        detailRow.style.display = "none"; // cachée au départ
        detailRow.innerHTML = `
            <td colspan="6">
                <strong>Description:</strong> ${d.description}<br>
                <strong>Désignation:</strong> ${d.designation}<br>
                <strong>Quantité:</strong> ${d.quantite}<br>
                <strong>Criticité:</strong> ${d.criticite}<br>
                ${d.photo ? `<img src="${d.photo}" style="width:200px; object-fit:cover; border-radius:4px;">` : ""}
            </td>
        `;

        // Bouton pour afficher/masquer détails
        row.querySelector(".toggleDetails").addEventListener("click", function() {
            if (detailRow.style.display === "none") {
                detailRow.style.display = "table-row";
                this.textContent = "Voir moins";
            } else {
                detailRow.style.display = "none";
                this.textContent = "Voir plus";
            }
        });
    });
}





//la fin

function afficherDemandes() {
    let tbody = document.querySelector("#tableDemandes tbody");
    tbody.innerHTML = "";

    demandes.forEach((d, index) => {
        let row = tbody.insertRow();
        row.innerHTML = `
            <td>${d.numeroDO}</td>
            <td>${d.dateBesoin}</td>
            <td>${d.demandeur}</td>
            <td>${d.ligne}</td>
            <td>${d.machine}</td>
            <td>${d.description}</td>
            <td>${d.designation}</td>
            <td>${d.quantite}</td>
            <td>${d.criticite}</td>
            <td>${d.photo || ""}</td>
        `;

        // Colonne Statut avec liste déroulante
        const statusCell = row.insertCell();
        const select = document.createElement("select");
        const statusOptions = [
            "Attente validation DA",
            "Attente livraison",
            "Attente création Purchase Order",
            "Demande Annulée",
            "Demande clôturée",
            "Attente validation manager"
        ];
        statusOptions.forEach(opt => {
            const option = document.createElement("option");
            option.value = opt;
            option.textContent = opt;
            if (d.statut === opt) option.selected = true;
            select.appendChild(option);
        });
        select.addEventListener("change", () => {
            d.statut = select.value;
            localStorage.setItem("demandes", JSON.stringify(demandes));
        });
        statusCell.appendChild(select);

        // Colonne Supprimer avec symbole
        const deleteCell = row.insertCell();
        const deleteBtn = document.createElement("span");
        deleteBtn.textContent = "❌";
        deleteBtn.style.cursor = "pointer";
        deleteBtn.style.color = "#DC3545";
        deleteBtn.style.fontSize = "1.2rem";

        deleteBtn.addEventListener("click", () => {
            if (confirm(`Voulez-vous vraiment supprimer la demande DO ${d.numeroDO} ?`)) {
                demandes.splice(index, 1);
                localStorage.setItem("demandes", JSON.stringify(demandes));
                afficherDemandes();
            }
        });

        deleteCell.appendChild(deleteBtn);
    });
}




/* Cellule pour détails
const detailsCell = row.insertCell();
const btnDetails = document.createElement("button");
btnDetails.textContent = "Voir plus";
btnDetails.addEventListener("click", () => {
    alert("Photo: " + d.photo); // ou afficher dans un modal/image réduite
});
detailsCell.appendChild(btnDetails);

// Cellule pour supprimer
const deleteCell = row.insertCell();
const btnDelete = document.createElement("span");
btnDelete.textContent = "❌"; // symbole de suppression
btnDelete.style.cursor = "pointer";
btnDelete.addEventListener("click", () => {
    if (confirm("Voulez-vous vraiment supprimer cette demande ?")) {
        demandes = demandes.filter(item => item.numeroDO !== d.numeroDO);
        localStorage.setItem("demandes", JSON.stringify(demandes));
        afficherDemandes();
    }
});
deleteCell.appendChild(btnDelete);
*/




// Initialisation
updateNumeroDO();
setTodayDate();
afficherDemandes();
