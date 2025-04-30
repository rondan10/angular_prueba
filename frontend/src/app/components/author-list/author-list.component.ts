import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthorService } from '../../services/author.service';
import { Author } from '../../models/author';
import { AuthorFormComponent } from '../author-form/author-form.component';

@Component({
  selector: 'app-author-list',
  standalone: true,
  imports: [CommonModule, FormsModule, AuthorFormComponent],
  templateUrl: './author-list.component.html',
  styleUrls: ['./author-list.component.css']
})
export class AuthorListComponent implements OnInit {
  authors: Author[] = [];
  filteredAuthors: Author[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  pages: number[] = [];
  showAuthorModal = false;
  selectedAuthor: Author | null = null;

  constructor(private authorService: AuthorService) {}

  ngOnInit(): void {
    this.loadAuthors();
  }

  loadAuthors(): void {
    this.authorService.getAuthors().subscribe({
      next: (authors) => {
        this.authors = authors;
        this.filterAuthors();
        this.calculatePages();
      },
      error: (error) => {
        console.error('Error loading authors:', error);
      }
    });
  }

  filterAuthors(): void {
    this.filteredAuthors = this.authors.filter(author =>
      author.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      author.genero.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.calculatePages();
  }

  calculatePages(): void {
    this.totalPages = Math.ceil(this.filteredAuthors.length / this.itemsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    //this.goToPage(1); Cambiar para mejora de rendimiento
  }

  goToPage(page: number): void {
    this.currentPage = page;
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredAuthors = this.authors.slice(startIndex, endIndex);
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

  openNewAuthor(): void {
    this.selectedAuthor = null;
    this.showAuthorModal = true;
  }

  editAuthor(author: Author): void {
    this.selectedAuthor = { ...author };
    this.showAuthorModal = true;
  }

  closeAuthorModal(): void {
    this.showAuthorModal = false;
    this.selectedAuthor = null;
    this.loadAuthors();
  }

  deleteAuthor(id: string): void {
    if (confirm('¿Está seguro de eliminar este autor?')) {
      this.authorService.deleteAuthor(id).subscribe({
        next: () => {
          this.authors = this.authors.filter(author => author.id !== id);
          this.filterAuthors();
        },
        error: (error) => {
          console.error('Error deleting author:', error);
        }
      });
    }
  }
}
