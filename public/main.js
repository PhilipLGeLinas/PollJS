// Form Submit Event
const btns = document.getElementsByClassName("num");
for (let i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function (e) {
        e.preventDefault();
        document.getElementById("vote-form").style.display = "none";
        document.getElementById("thanks").style.display = "block";
        const choice = e.target.value;
        const data = {os: choice};

        fetch('https://zealous-hodgkin-0bc5bd.netlify.app/poll', {
            method: 'post',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).then(res => res.json()).then(data => console.log(data)).catch(err => console.log(err));
    })
}

const showResults = function() {
    fetch('https://zealous-hodgkin-0bc5bd.netlify.app/poll').then(res => res.json()).then(data => {
        const votes = data.votes;
        const totalVotes = votes.length;

        // Count vote points
        const voteCounts = votes.reduce((acc, vote) => ((acc[vote.os] = (acc[vote.os] || 0) + parseInt(vote.points)), acc), {});

        let dataPoints = [
            { label: '?', y: voteCounts.Question},
            { label: '1', y: voteCounts.One},
            { label: '2', y: voteCounts.Two},
            { label: '3', y: voteCounts.Three},
            { label: '5', y: voteCounts.Five},
            { label: '8', y: voteCounts.Eight},
            { label: '13', y: voteCounts.Thirteen},
            { label: '20', y: voteCounts.Twenty}
        ];

        const chartContainer = document.querySelector('#chartContainer');

        if (chartContainer) {
            const chart = new CanvasJS.Chart('chartContainer', {
                animationEnabled: true,
                theme: 'theme1',
                title: {
                    text: `Total Votes: ${totalVotes}`
                },
                data: [
                    {
                        type: 'column',
                        dataPoints: dataPoints
                    }
                ]
            });

            chart.render();

            // Enable pusher logging - don't include this in production
            Pusher.logToConsole = true;

            const pusher = new Pusher('cc8b92eec3afdf5e1089', {
                cluster: 'us2'
            });

            var channel = pusher.subscribe('os-poll');
            channel.bind('os-vote', function(data) {
                dataPoints = dataPoints.map(x => {
                    if (x.label == data.os) {
                        x.y += data.points;
                        return x;
                    } else {
                        return x;
                    }
                });

                chart.render();
            });
        }
    });
}

document.getElementById("Results").addEventListener("click", function(e) {
    e.preventDefault();
    let chartContainer = document.getElementById("chartContainer");
    let resultsBtn = document.getElementById("Results");
    let voteForm = document.getElementById("vote-form");

    if (resultsBtn.innerText.toLowerCase() === "show results") {
        chartContainer.style.display = "block";
        resultsBtn.innerText = "Reset";
        voteForm.style.display = "none";
        document.getElementById("thanks").style.display = "none";
        showResults();
    } else {
        chartContainer.style.display = "none";
        resultsBtn.innerText = "Show Results";
        voteForm.style.display = "block";
    }
});