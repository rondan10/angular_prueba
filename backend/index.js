const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Data 
const booksPath = path.join(__dirname, 'data', 'books.json');
const authorsPath = path.join(__dirname, 'data', 'authors.json');

// validar que existarn los archivos de libros y autores
async function initializeDataFiles() {
    try {
        await fs.mkdir(path.join(__dirname, 'data'), { recursive: true });
        
        // Inicializar el archivo books.json si no existe
        try {
            await fs.access(booksPath);
        } catch {
            await fs.writeFile(booksPath, '[]');
        }
        
        // Inicializar el archivo authors.json si no existe
        try {
            await fs.access(authorsPath);
        } catch {
            await fs.writeFile(authorsPath, '[]');
        }
    } catch (error) {
        console.error('Error initializing data files:', error);
    }
}

// enpoints para el crud de libros y autores
app.get('/api/books', async (req, res) => {
    try {
        const books = await fs.readFile(booksPath, 'utf8');
        res.json(JSON.parse(books));
    } catch (error) {
        res.status(500).json({ error: 'Error reading books' });
    }
});

app.post('/api/books', async (req, res) => {
    try {
        const books = JSON.parse(await fs.readFile(booksPath, 'utf8'));
        const newBook = {
            id: Date.now().toString(),
            ...req.body,
            fechaRegistro: new Date().toISOString()
        };
        books.push(newBook);
        await fs.writeFile(booksPath, JSON.stringify(books, null, 2));
        res.status(201).json(newBook);
    } catch (error) {
        res.status(500).json({ error: 'Error creating book' });
    }
});

app.put('/api/books/:id', async (req, res) => {
    try {
        const books = JSON.parse(await fs.readFile(booksPath, 'utf8'));
        const index = books.findIndex(book => book.id === req.params.id);
        if (index === -1) {
            return res.status(404).json({ error: 'Book not found' });
        }
        books[index] = { ...books[index], ...req.body };
        await fs.writeFile(booksPath, JSON.stringify(books, null, 2));
        res.json(books[index]);
    } catch (error) {
        res.status(500).json({ error: 'Error updating book' });
    }
});

app.delete('/api/books/:id', async (req, res) => {
    try {
        const books = JSON.parse(await fs.readFile(booksPath, 'utf8'));
        const filteredBooks = books.filter(book => book.id !== req.params.id);
        await fs.writeFile(booksPath, JSON.stringify(filteredBooks, null, 2));
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error deleting book' });
    }
});

// Authors CRUD endpoints
app.get('/api/authors', async (req, res) => {
    try {
        const authors = await fs.readFile(authorsPath, 'utf8');
        res.json(JSON.parse(authors));
    } catch (error) {
        res.status(500).json({ error: 'Error reading authors' });
    }
});

app.post('/api/authors', async (req, res) => {
    try {
        const authors = JSON.parse(await fs.readFile(authorsPath, 'utf8'));
        const newAuthor = {
            id: Date.now().toString(),
            ...req.body
        };
        authors.push(newAuthor);
        await fs.writeFile(authorsPath, JSON.stringify(authors, null, 2));
        res.status(201).json(newAuthor);
    } catch (error) {
        res.status(500).json({ error: 'Error creating author' });
    }
});

app.put('/api/authors/:id', async (req, res) => {
    try {
        const authors = JSON.parse(await fs.readFile(authorsPath, 'utf8'));
        const index = authors.findIndex(author => author.id === req.params.id);
        if (index === -1) {
            return res.status(404).json({ error: 'Author not found' });
        }
        authors[index] = { ...authors[index], ...req.body };
        await fs.writeFile(authorsPath, JSON.stringify(authors, null, 2));
        res.json(authors[index]);
    } catch (error) {
        res.status(500).json({ error: 'Error updating author' });
    }
});

app.delete('/api/authors/:id', async (req, res) => {
    try {
        const authors = JSON.parse(await fs.readFile(authorsPath, 'utf8'));
        const filteredAuthors = authors.filter(author => author.id !== req.params.id);
        await fs.writeFile(authorsPath, JSON.stringify(filteredAuthors, null, 2));
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error deleting author' });
    }
});

// Arranque del servidor y inicialización de archivos
initializeDataFiles().then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});