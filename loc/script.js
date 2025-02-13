document.addEventListener('DOMContentLoaded', function () {
    let leaderboardData = [];

    // Load names from names.json into the dropdown
    function loadNames() {
        fetch('names.json')
            .then(response => response.json())
            .then(data => {
                const dropdown = document.getElementById('chooseName');
                dropdown.innerHTML = '<option value="">Select a name</option>';

                data.names
                    .map(name => name.trim())
                    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
                    .forEach(name => {
                        dropdown.innerHTML += `<option value="${name}">${name}</option>`;
                    });
            })
            .catch(error => console.error("Error loading names:", error));
    }
    
    // Load data from Firestore
    // function loadLeaderboard() {
    //     db.collection("leaderboard").orderBy("total", "desc").get().then((querySnapshot) => {
    //         leaderboardData = [];
    //         querySnapshot.forEach((doc) => {
    //             leaderboardData.push(doc.data());
    //         });
    
    //         // Only render if leaderboardBody exists
    //         if (document.getElementById('leaderboardBody')) {
    //             renderLeaderboard();
    //         } else {
    //             console.warn("Leaderboard table not found on this page.");
    //         }
    //     }).catch(error => {
    //         console.error("Error loading leaderboard:", error);
    //     });
    // }

    function loadLeaderboard() {
        const spinner = document.getElementById('loadingSpinner');
        const leaderboardBody = document.getElementById('leaderboardBody');
    
        // Show spinner and hide leaderboard
        if (spinner) spinner.style.display = 'block';
        if (leaderboardBody) leaderboardBody.style.display = 'none';
    
        db.collection("leaderboard")
            .orderBy("total", "desc")
            .get()
            .then((querySnapshot) => {
                leaderboardData = [];
                querySnapshot.forEach((doc) => {
                    leaderboardData.push(doc.data());
                });
    
                // Hide spinner and show leaderboard
                if (spinner) spinner.style.display = 'none';
                if (leaderboardBody) leaderboardBody.style.display = 'table-row-group';
    
                renderLeaderboard();
            })
            .catch((error) => {
                console.error("Error loading leaderboard:", error);
                if (spinner) spinner.style.display = 'none';
            });
    }
    
    
    

    if (document.getElementById('leaderboardBody')) {
        loadLeaderboard();
    }

    if (document.getElementById('chooseName')) {
        loadNames(); // Load names into dropdown
    }

//     const updateButton = document.getElementById('updateBtn');
//     if (updateButton) {
//         updateButton.addEventListener('click', function () {
//         const name = document.getElementById('chooseName').value;
//         const q1 = parseInt(document.getElementById('q1').value) || 0;
//         const q2 = parseInt(document.getElementById('q2').value) || 0;
//         const q3 = parseInt(document.getElementById('q3').value) || 0;
//         const total = q1 + q2 + q3;
    
//         if (!name) {
//             alert('Please select a name.');
//             return;
//         }
    
//         db.collection("leaderboard").doc(name).get().then((doc) => {
//             if (doc.exists) {
//                 let existingTotal = doc.data().total;
//                 db.collection("leaderboard").doc(name).update({
//                     total: existingTotal + total
//                 }).then(() => {
//                     alert('Leaderboard updated!');
//                     loadLeaderboard(); // Reload leaderboard after update
//                 });
//             } else {
//                 db.collection("leaderboard").doc(name).set({ name, total }).then(() => {
//                     alert('Leaderboard updated!');
//                     loadLeaderboard(); // Reload leaderboard after inserting new entry
//                 });
//             }
//         });
//     });
// }

const updateButton = document.getElementById('updateBtn');
const updateSpinner = document.getElementById('updateSpinner');

if (updateButton) {
    updateButton.addEventListener('click', function () {
        const name = document.getElementById('chooseName').value;
        const q1 = parseInt(document.getElementById('q1').value) || 0;
        const q2 = parseInt(document.getElementById('q2').value) || 0;
        const q3 = parseInt(document.getElementById('q3').value) || 0;
        const total = q1 + q2 + q3;

        if (!name) {
            alert('Please select a name.');
            return;
        }

        // Show spinner and disable button
        if (updateSpinner) updateSpinner.style.display = 'block';
        updateButton.disabled = true;

        db.collection("leaderboard").doc(name).get().then((doc) => {
            if (doc.exists) {
                let existingTotal = doc.data().total;
                db.collection("leaderboard").doc(name).update({
                    total: existingTotal + total
                }).then(() => {
                    finishUpdate();
                });
            } else {
                db.collection("leaderboard").doc(name).set({
                    name,
                    total
                }).then(() => {
                    finishUpdate();
                });
            }
        }).catch((error) => {
            console.error("Error updating leaderboard:", error);
            finishUpdate();
        });
    });
}

function finishUpdate() {
    // Hide spinner and enable button
    if (updateSpinner) updateSpinner.style.display = 'none';
    if (updateButton) updateButton.disabled = false;

    alert('Leaderboard updated!');
    loadLeaderboard(); // Refresh leaderboard
}

    

function renderLeaderboard() {
    const leaderboardBody = document.getElementById('leaderboardBody');
    if (!leaderboardBody) return; // Prevent errors if element does not exist

    leaderboardBody.innerHTML = ''; // Clear existing leaderboard

    leaderboardData.forEach((entry, index) => {
        let medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
        const row = document.createElement('tr');
        row.innerHTML = `<td>${entry.name}</td><td>${entry.total}</td><td>${medal || index + 1}</td>`;
        leaderboardBody.appendChild(row);
    });
}

     // Export Leaderboard as CSV
     const exportButton = document.getElementById('exportLeaderboard');
     if (exportButton) {
         exportButton.addEventListener('click', function () {
             if (leaderboardData.length === 0) {
                 alert('No data available to export!');
                 return;
             }
 
             let csvContent = "data:text/csv;charset=utf-8,Name,Total Marks\n"; // Only Name and Total
             leaderboardData.forEach(entry => {
                 csvContent += `${entry.name},${entry.total}\n`;
             });
 
             const encodedUri = encodeURI(csvContent);
             const link = document.createElement('a');
             link.setAttribute('href', encodedUri);
             link.setAttribute('download', 'leaderboard.csv');
             document.body.appendChild(link);
             link.click();
             document.body.removeChild(link);
         });
     }
 
     // Reset Leaderboard
// Reset Leaderboard
const resetButton = document.getElementById('resetLeaderboard');
if (resetButton) {
    resetButton.addEventListener('click', function () {
        if (confirm("Are you sure you want to reset the leaderboard? This action cannot be undone.")) {
            db.collection("leaderboard").get().then((querySnapshot) => {
                const batch = db.batch(); // Use batch for efficient deletion
                
                querySnapshot.forEach((doc) => {
                    batch.delete(doc.ref);
                });

                batch.commit().then(() => {
                    alert("Leaderboard has been reset!");
                    loadLeaderboard(); // Reload the leaderboard
                }).catch(error => {
                    console.error("Error resetting leaderboard:", error);
                    alert("Failed to reset leaderboard. Please try again.");
                });
            });
        }
    });
}

});
