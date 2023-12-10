import React from 'react';
import { Note } from './Keyboard';

const Display = ({activeNote}: {activeNote: Note | undefined}):JSX.Element =>{
  return (
    <div className='display'>
      <div>{activeNote?.clef === 5 ? '.' : '\u00A0'}</div>
      <div>{activeNote?.numNote}</div>
      <div>{activeNote?.clef === 3 ? '.' : '\u00A0'}</div>
    </div>
  )
}

export default Display;