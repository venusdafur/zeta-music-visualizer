let midiFileUrl = "";

document.getElementById("computeForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let numZeros = document.getElementById("numZeros").value;

    document.getElementById("progressMessage").style.display = "block";
    document.getElementById("audioPlayerSection").style.display = "none";

    fetch(`/compute_zeros?num=${numZeros}`)
        .then(response => response.json())  // Get the file path from the server
        .then(data => {
            midiFileUrl = data.midi_file;
            console.log("MIDI file URL:", midiFileUrl);

            document.getElementById("audioPlayerSection").style.display = "block";
            document.getElementById("progressMessage").style.display = "none";
        })
        .catch(error => {
            console.error('Error:', error);
            alert("An error occurred while generating the music.");
        });
});

// Function to play MIDI music using Tone.js and @tonejs/midi for parsing
function playMIDI() {
    console.log("Attempting to load and play MIDI...");

    // Ensure Tone.js and @tonejs/midi are loaded
    const toneScript = document.createElement("script");
    toneScript.src = "https://cdn.jsdelivr.net/npm/tone@14.8.13/build/Tone.min.js";
    document.body.appendChild(toneScript);

    const midiScript = document.createElement("script");
    midiScript.src = "https://cdn.jsdelivr.net/npm/@tonejs/midi";
    document.body.appendChild(midiScript);

    midiScript.onload = () => {
        console.log("Tone.js and @tonejs/midi loaded successfully.");

        // Fetch the MIDI file
        fetch(midiFileUrl)
            .then(response => response.arrayBuffer())
            .then(midiData => {
                console.log("MIDI file fetched successfully.");

                // Parse the MIDI data using @tonejs/midi
                const midi = new Midi(midiData);  // Parse MIDI data into a usable format

                // Create a Tone.js Part to play the parsed MIDI data
                const midiPlayer = new Tone.Part((time, note) => {
                    // Use a synth to play each note
                    const synth = new Tone.Synth().toDestination();
                    synth.triggerAttackRelease(note.name, note.duration, time);
                }, midi.tracks[0].notes);  // Use the first track of the MIDI file

                // Start playing the MIDI data
                midiPlayer.start(0);  // Starts from the beginning
                Tone.Transport.start();  // Start the Tone.js transport to play the track
                console.log("MIDI playback started.");
            })
            .catch(err => {
                console.error('Error loading MIDI file:', err);
                alert('Failed to load MIDI file.');
            });
    };
}
