import React from 'react';
import * as Tone from 'tone';

export interface Note {
  note: string;
  numNote: number;
  clef: number;
}

function generateNotes(): Note[] {
  const noteNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const results = [];
  for (let clef = 3; clef <= 5; clef++) {
    for (let i = 0; i < noteNames.length; i++) {
      const noteObj: Note = {
        note: `${noteNames[i]}${clef}`,
        numNote: i + 1,
        clef: clef
      }
      results.push(noteObj);
    }
  }
  return results
}

function playNote(note: Note){
  const synth = new Tone.Synth().toDestination();
  synth.triggerAttackRelease(note.note, '8n');
}

function playMelody(){
  const synth = new Tone.Synth().toDestination();
  const chordSynth = new Tone.PolySynth(Tone.Synth).toDestination();
  const melodyNotes = ['C', 'E', 'G'];
  const now = Tone.now();

  for(let i = 0; i < 100; i++){
    const noteName = melodyNotes[Math.floor(Math.random() * melodyNotes.length)];
    const clef = Math.floor(Math.random() * 3 ) + 3;
    const note = `${noteName}${clef}`;
    synth.triggerAttackRelease(note, '8n', now + (i * 0.3));
    if(i % 4) {
      const chordName = melodyNotes[Math.floor(Math.random() * melodyNotes.length)];
      const chordNote = `${chordName}4`;
      chordSynth.triggerAttackRelease(chordNote, '2n', now + (i * 0.3));
    }
  }

}

const Keybaord = ({ 
  updateActiveNote,
  activeNote
}: {
  updateActiveNote: (note: Note) => void,
  activeNote: Note | undefined
}): JSX.Element => {
  const notelist = generateNotes();

  return (
    <div className='keyboard'>
      {notelist.map((noteObj) => {
        const activeClass = noteObj.note === activeNote?.note ? 'active': '';
        return (
          <div
            key={noteObj.note}
            className={`key-button ${activeClass}`}
            onClick={() => {
              updateActiveNote(noteObj);
              playNote(noteObj);
            }}
          >{noteObj.note}</div>
        )
      })}
      <div className='key-button' onClick={() => {
        playMelody();
      }}>M1</div>
    </div>
  )
}

export default Keybaord;