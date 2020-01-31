import dataStore from 'nedb-promise';

export class NoteStore {
  constructor({ filename, autoload }) {
    this.store = dataStore({ filename, autoload });
  }
  
  async find(props) {
    return this.store.find(props);
  }
  
  async findOne(props) {
    return this.store.findOne(props);
  }
  
  async insert(note) {
    let noteTitle = note.title;
    if (!noteTitle) { // validation
      throw new Error('Missing title property')
    }

    let noteAuthor = note.author;
    if (!noteAuthor) { // validation
      throw new Error('Missing author property')
    }

    let noteGene = note.gene;
    if (!noteGene) { // validation
      throw new Error('Missing gene property')
    }

    return this.store.insert(note);
  };
  
  async update(props, note) {
    return this.store.update(props, note);
  }
  
  async remove(props) {
    return this.store.remove(props);
  }
}

export default new NoteStore({ filename: './db/books.json', autoload: true });
