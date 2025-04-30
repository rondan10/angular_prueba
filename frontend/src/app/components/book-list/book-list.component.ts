import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../services/book.service';
import { AuthorService } from '../../services/author.service';
import { Book } from '../../models/book';
import { Author } from '../../models/author';
import { BookFormComponent } from '../book-form/book-form.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, FormsModule, BookFormComponent],
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit, OnDestroy {
  books: Book[] = [];
  filteredBooks: Book[] = [];
  authors: { [key: string]: Author } = {};
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  pages: number[] = [];
  showBookModal = false;
  selectedBook: Book | null = null;
  private subscriptions: Subscription[] = [];

  constructor(
    private bookService: BookService,
    private authorService: AuthorService
  ) {}

  ngOnInit(): void {
    this.loadBooks();
    this.loadAuthors();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadBooks(): void {
    const subscription = this.bookService.getBooks().subscribe({
      next: (books) => {
        this.books = books;
        this.filterBooks();
      },
      error: (error) => {
        console.error('Error loading books:', error);
      }
    });
    this.subscriptions.push(subscription);
  }

  loadAuthors(): void {
    const subscription = this.authorService.getAuthors().subscribe({
      next: (authors) => {
        this.authors = authors.reduce((acc, author) => {
          if (author.id) {
            acc[author.id] = author;
          }
          return acc;
        }, {} as { [key: string]: Author });
      },
      error: (error) => {
        console.error('Error loading authors:', error);
      }
    });
    this.subscriptions.push(subscription);
  }

  filterBooks(): void {
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      this.filteredBooks = this.books.filter(book => 
        book.titulo.toLowerCase().includes(search) ||
        book.descripcion.toLowerCase().includes(search) ||
        (this.authors[book.idAutor]?.nombre || '').toLowerCase().includes(search)
      );
    } else {
      this.filteredBooks = [...this.books];
    }
    this.calculatePages();
    this.goToPage(1);
  }

  calculatePages(): void {
    this.totalPages = Math.ceil(this.filteredBooks.length / this.itemsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    this.currentPage = page;
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredBooks = this.books.slice(startIndex, endIndex);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  getAuthorName(authorId: string): string {
    return this.authors[authorId]?.nombre || 'Unknown Author';
  }

  openNewBook(): void {
    this.selectedBook = null;
    this.showBookModal = true;
  }

  editBook(book: Book): void {
    this.selectedBook = { ...book };
    this.showBookModal = true;
  }

  closeBookModal(): void {
    this.showBookModal = false;
    this.selectedBook = null;
    this.loadBooks();
  }

  deleteBook(id: string): void {
    if (confirm('¿Está seguro de eliminar este libro?')) {
      const subscription = this.bookService.deleteBook(id).subscribe({
        next: () => {
          this.books = this.books.filter(book => book.id !== id);
          this.filterBooks();
        },
        error: (error) => {
          console.error('Error deleting book:', error);
        }
      });
      this.subscriptions.push(subscription);
    }
  }
}
