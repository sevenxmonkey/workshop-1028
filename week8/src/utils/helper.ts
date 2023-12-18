export const getAllNotes = (min: number, max: number) => {
  const result = [];
  const noteNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  for(let clef = min; clef <= max; clef++){
    for(let i = 0; i < noteNames.length; i++){
      const note = `${noteNames[i]}${clef}`;
      result.push(note)
    }
  }
  return result;
}

export const getRandomNote = (min: number, max: number) => {
  const allNotes = getAllNotes(min, max);
  const len = allNotes.length;
  const randomIndex = Math.floor(Math.random() * len);
  return allNotes[randomIndex];
}

export const getRandomChord = () => {
  const cChord = ['C3', 'E3', 'G3', 'B3'];
  const dChord = ['D2', 'F2', 'A2'];
  const gChord = ['B3', 'D2', 'E3', 'A2'];
  const randomChord = Array(4).fill(null).map(() => getRandomNote(3, 5));
  const chords = [cChord, dChord, gChord, randomChord];

  return chords[Math.floor((chords.length * Math.random()))]
}

export function selectNoteByValue(input: number, noteArray: string[]): string {
  const weight = Math.max(Math.min( input, 600), 0) / 600;
  const indexRange = Math.ceil(weight * noteArray.length);
  const selectedIndex = Math.floor(Math.random() * indexRange);
  return noteArray[selectedIndex];
}

export function selectChordByValue(input: number, noteArray: string[]): string[]{
  const result = [];
  for(let i = 0; i < 4; i++){
    result.push(selectNoteByValue(input, noteArray));
  }
  return result;
}