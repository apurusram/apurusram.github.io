document.addEventListener('DOMContentLoaded', function () {
    let leaderboardData = JSON.parse(localStorage.getItem('leaderboard')) || [];

    // ✅ Render leaderboard only if the element exists (for index.html)
    if (document.getElementById('leaderboardBody')) {
        renderLeaderboard();
    }

    // ✅ Load names only if the element exists (for update.html)
    if (document.getElementById('chooseName')) {
        loadNames();
    }

    // ✅ Export Leaderboard as CSV
    const exportButton = document.getElementById('exportLeaderboard');
    if (exportButton) {
        exportButton.addEventListener('click', function () {
            if (leaderboardData.length === 0) {
                alert('No data available to export!');
                return;
            }

            let csvContent = "data:text/csv;charset=utf-8,Name,Total Marks\n"; // ✅ Only Name and Total
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

    // ✅ Reset Leaderboard
    const resetButton = document.getElementById('resetLeaderboard');
    if (resetButton) {
        resetButton.addEventListener('click', function () {
            if (confirm("Are you sure you want to reset the leaderboard?")) {
                localStorage.removeItem('leaderboard');
                leaderboardData = [];
                renderLeaderboard();
            }
        });
    }

    // ✅ Update Leaderboard (Append Marks Instead of Overwriting)
    const updateButton = document.getElementById('updateBtn');
    if (updateButton) {
        updateButton.addEventListener('click', function () {
            const name = document.getElementById('chooseName').value;
            const q1 = parseInt(document.getElementById('q1').value) || 0;
            const q2 = parseInt(document.getElementById('q2').value) || 0;
            const q3 = parseInt(document.getElementById('q3').value) || 0;
            const newTotal = q1 + q2 + q3;

            if (!name) {
                alert('Please select a name.');
                return;
            }

            let existingEntry = leaderboardData.find(entry => entry.name === name);
            if (existingEntry) {
                existingEntry.total += newTotal; // ✅ Add to existing total
            } else {
                leaderboardData.push({ name, total: newTotal });
            }

            localStorage.setItem('leaderboard', JSON.stringify(leaderboardData));
            alert('Leaderboard updated!');
            window.location.href = 'index.html'; // ✅ Redirect to leaderboard page
        });
    }

    // ✅ Render Leaderboard (Sort by Total Marks in Descending Order)
    function renderLeaderboard() {
        leaderboardData.sort((a, b) => b.total - a.total);
        const leaderboardBody = document.getElementById('leaderboardBody');
        leaderboardBody.innerHTML = '';

        leaderboardData.forEach((entry, index) => {
            let medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
            const row = document.createElement('tr');
            row.innerHTML = `<td>${entry.name}</td><td>${entry.total}</td><td>${medal || index + 1}</td>`;
            leaderboardBody.appendChild(row);
        });
    }

    // ✅ Load Names from `names.json` and Sort Alphabetically
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
});
