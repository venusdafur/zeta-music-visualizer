from flask import Flask, request, jsonify, send_from_directory, url_for
import mpmath
from midiutil import MIDIFile
import os

app = Flask(__name__)

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/compute_zeros')
def compute_zeros():
    num = int(request.args.get('num', 1000))  # Get the number of zeros
    mpmath.mp.dps = 30
    zeros = [mpmath.zetazero(i).imag for i in range(1, num + 1)]

    # Generate MIDI file
    midi = MIDIFile(1)
    midi.addTempo(0, 0, 120)
    for i, zero in enumerate(zeros):
        midi.addNote(0, 0, int((zero % 88) + 21), i * 0.25, 0.25, 100)

    # Save the MIDI file in the static folder
    static_folder = os.path.join(app.root_path, 'static')
    os.makedirs(static_folder, exist_ok=True)
    midi_filename = os.path.join(static_folder, "zeta_zeros.mid")

    with open(midi_filename, "wb") as midi_file:
        midi.writeFile(midi_file)

    # Generate the URL for the MIDI file
    midi_file_url = url_for('static', filename='zeta_zeros.mid', _external=True)

    # Return the URL as JSON for the frontend
    return jsonify({'midi_file': midi_file_url})

if __name__ == '__main__':
    app.run(debug=True)
