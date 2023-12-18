import * as Tone from 'tone';
import { getAllNotes, selectChordByValue, getRandomNote, selectNoteByValue } from './helper';

import { Location } from '../App';

export const setUpPinano = (locationRef: React.MutableRefObject<Location>) => {
  const piano = new Tone.PolySynth(Tone.Synth).toDestination();
  // const pianoLoop = new Tone.Loop((time) => {
  //   piano.triggerAttackRelease(getRandomChord(), '8n', time + 0.2);
  //   piano.triggerAttackRelease(getRandomNote(3, 5), '8n');
  // }, '8n');
  const pianoSequence = new Tone.Sequence((time, note) => {
    // Print ball location
    console.log(locationRef.current.x);
    const selectedNote = selectNoteByValue(locationRef.current.x, getAllNotes(2, 6))
    const selectedChord = selectChordByValue(locationRef.current.y, getAllNotes(2, 6))
    piano.triggerAttackRelease(selectedNote, '6n', time);
    piano.triggerAttackRelease(selectedChord, '4n', time + 0.2);
    piano.volume.value = -10;
  }, ['C4', ['A4', 'E4'], 'G4', 'B4'], '4n');
  pianoSequence.start();
  pianoSequence.humanize = true;
  pianoSequence.start(0);
}

export const setUpKick = () => {
  const kick = new Tone.MembraneSynth({
    envelope: {sustain: 0, attack: 0.02, decay: 0.8},
    octaves: 10, pitchDecay: 0.01
  }).toDestination();
  kick.triggerAttackRelease(getRandomNote(2, 4), '8n');
}

export const setUpSnare = () => {
  const snare = new Tone.NoiseSynth({
    envelope: {attack: 0.0001, decay: 0.2, sustain: 0}
  }).toDestination();
  snare.triggerAttack();
}



