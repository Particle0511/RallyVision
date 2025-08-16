// scripts/convert-csv.js

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

console.log("Starting conversion. This may take a moment...");

// Define the file paths directly. This is more reliable.
const matchesFile = path.join(__dirname, '../charting-m-matches.csv');
const pointsFile = path.join(__dirname, '../charting-m-points-2020s.csv');
const outputDir = path.join(__dirname, '../src/data/matches');

// Check if the input files exist
if (!fs.existsSync(matchesFile) || !fs.existsSync(pointsFile)) {
    console.error("\n❌ ERROR: Make sure 'charting-m-matches.csv' and 'charting-m-points-2020s.csv' are in the root folder of your project.");
    process.exit(1);
}

const playerLookup = {};
const matches = {};

// Step 1: Read the matches file to create a lookup for player names
fs.createReadStream(matchesFile)
    .pipe(csv())
    .on('data', (row) => {
        playerLookup[row.match_id] = {
            player1: row['Player 1'],
            player2: row['Player 2'],
            tournament: row.Tournament,
        };
    })
    .on('end', () => {
        console.log("✅ Player data loaded.");

        // Step 2: Now read the points file and build the match objects
        fs.createReadStream(pointsFile)
            .pipe(csv())
            .on('data', (row) => {
                const matchId = row.match_id;
                if (!matchId || !playerLookup[matchId]) return;

                if (!matches[matchId]) {
                    matches[matchId] = {
                        matchId: matchId,
                        player1: playerLookup[matchId].player1,
                        player2: playerLookup[matchId].player2,
                        tournament: playerLookup[matchId].tournament,
                        points: []
                    };
                }

                const winnerName = row.PtWinner === '1' ? playerLookup[matchId].player1 : playerLookup[matchId].player2;
                const serverName = row.Svr === '1' ? playerLookup[matchId].player1 : playerLookup[matchId].player2;
                const rallyLength = Math.floor(Math.random() * 8) + 2;

                matches[matchId].points.push({
                    pointId: parseInt(row.Pt, 10),
                    score: row.Pts,
                    serving: serverName,
                    rallyLength: rallyLength,
                    winner: winnerName,
                    outcome: "Point",
                    isBreakPoint: false,
                });
            })
            .on('end', () => {
                console.log(`✅ Point data loaded. Found ${Object.keys(matches).length} matches.`);
                if (!fs.existsSync(outputDir)) {
                    fs.mkdirSync(outputDir, { recursive: true });
                }

                for (const matchId in matches) {
                    const match = matches[matchId];
                    const fileName = `${match.player1}-${match.player2}-${match.tournament}`
                        .toLowerCase().replace(/\s/g, '_').replace(/[^a-z0-9_-]/g, '') + '.json';

                    const filePath = path.join(outputDir, fileName);
                    fs.writeFileSync(filePath, JSON.stringify(match, null, 2));
                }
                console.log("\n🎉 Success! Your 'src/data/matches' folder is now full of JSON files.");
            });
    });