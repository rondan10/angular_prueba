import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../services/book.service';
import { AuthorService } from '../../services/author.service';
import { Book } from '../../models/book';
import { Author } from '../../models/author';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css']
})
export class BookFormComponent implements OnInit {
  @Input() book: Book | null = null;
  @Output() closeModal = new EventEmitter<void>();

  isEditing = false;
  authors: Author[] = [];
  formBook: Book = {
    titulo: '',
    descripcion: '',
    anio: new Date().getFullYear(),
    idAutor: '',
    publicado: false
  };

  showAuthorModal = false;
  newAuthor: Author = {
    nombre: '',
    genero: ''
  };

  constructor(
    private bookService: BookService,
    private authorService: AuthorService
  ) {}

  ngOnInit() {
    this.loadAuthors();
    if (this.book) {
      this.isEditing = true;
      this.formBook = { ...this.book };
    }
  }

  loadAuthors(): void {
    this.authorService.getAuthors().subscribe({
      next: (authors) => {
        this.authors = authors;
      },
      error: (error) => {
        console.error('Error loading authors:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.isEditing && this.formBook.id) {
      this.bookService.updateBook(this.formBook.id, this.formBook).subscribe({
        next: () => this.closeModal.emit(),
        error: (error) => console.error('Error updating book:', error)
      });
    } else {
      this.bookService.createBook(this.formBook).subscribe({
        next: () => this.closeModal.emit(),
        error: (error) => console.error('Error creating book:', error)
      });
    }
  }

  openNewAuthorModal(): void {
    this.showAuthorModal = true;
    this.newAuthor = {
      nombre: '',
      genero: ''
    };
  }

  closeAuthorModal(): void {
    this.showAuthorModal = false;
  }

  onAuthorSubmit(): void {
    this.authorService.createAuthor(this.newAuthor).subscribe({
      next: (author) => {
        this.authors = [...this.authors, author];
        this.formBook.idAutor = author.id!;
        this.closeAuthorModal();
      },
      error: (error) => console.error('Error creating author:', error)
    });
  }
}
