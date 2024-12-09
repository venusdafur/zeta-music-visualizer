document.getElementById("computeForm").addEventListener("submit", function(event) {
    event.preventDefault();  // Prevent the default form submission behavior

    let numZeros = document.getElementById("numZeros").value;

    console.log("Form submitted with numZeros:", numZeros);

    fetch(`/compute_zeros?num=${numZeros}`)
        .then(response => response.text())  // Get the MIDI file URL from the backend
        .then(midiUrl => {
            console.log("MIDI file URL received:", midiUrl);
            
            const midiPlayer = document.getElementById("player");

            // Set the MIDI player's src to the generated MIDI file URL
            midiPlayer.src = midiUrl;

            // Show the player and start playing
            document.getElementById("midiPlayerSection").style.display = "block";
            midiPlayer.play();
        })
        .catch(error => {
            console.error("Error:", error);
            alert("An error occurred while generating the music.");
        });
});
