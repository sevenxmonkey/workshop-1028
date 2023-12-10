import React, { useState } from 'react';
import './App.css';
import Display from './components/Display';
import Keybaord, { Note } from './components/Keyboard';

function App() {
  const [activeNote, setActiveNote] = useState<Note | undefined>();
  
  return (
    <div className="App">
      <Display activeNote={activeNote}/>
      <Keybaord updateActiveNote={(note: Note) => {
        setActiveNote(note);
      }} activeNote={activeNote} />
    </div>
  );
}

export default App;

