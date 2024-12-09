from flask import Flask, request, send_file, render_template, jsonify
import mpmath
from midiutil import MIDIFile
from io import BytesIO
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  # This allows all cross-origin requests (for local testing purposes)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/compute_zeros')
def compute_zeros():
    num = int(request.args.get('num', 1000))  # Fetch the `num` parameter from the URL
    mpmath.mp.dps = 30  # Set the precision for mpmath
    zeros = [mpmath.zetazero(i).imag for i in range(1, num + 1)]  # Compute zeros

    # Generate MIDI file
    midi = MIDIFile(1)
    midi.addTempo(0, 0, 120)  # Add tempo to the file
    for i, zero in enumerate(zeros):
        midi.addNote(0, 0, int((zero % 88) + 21), i * 0.25, 0.25, 100)  # Map zero to MIDI note

    # Save the MIDI file in the static folder
    static_folder = os.path.join(app.root_path, 'static')
    midi_filename = os.path.join(static_folder, "zeta_zeros.mid")

    with open(midi_filename, "wb") as midi_file:
        midi.writeFile(midi_file)  # Save the MIDI file to disk

    # Return the file path so the frontend can access it
    return jsonify({'midi_file': f"/static/zeta_zeros.mid"})

if __name__ == '__main__':
    app.run(debug=True)
