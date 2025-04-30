import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthorService } from '../../services/author.service';
import { Author } from '../../models/author';

@Component({
  selector: 'app-author-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './author-form.component.html',
  styleUrls: ['./author-form.component.css']
})
export class AuthorFormComponent implements OnInit {
  @Input() author: Author | null = null;
  @Output() closeModal = new EventEmitter<void>();

  isEditing = false;
  formAuthor: Author = {
    nombre: '',
    genero: ''
  };

  constructor(private authorService: AuthorService) {}

  ngOnInit() {
    if (this.author) {
      this.isEditing = true;
      this.formAuthor = { ...this.author };
    }
  }

  onSubmit(): void {
    if (this.isEditing && this.formAuthor.id) {
      this.authorService.updateAuthor(this.formAuthor.id, this.formAuthor).subscribe({
        next: () => this.closeModal.emit(),
        error: (error) => console.error('Error updating author:', error)
      });
    } else {
      this.authorService.createAuthor(this.formAuthor).subscribe({
        next: () => this.closeModal.emit(),
        error: (error) => console.error('Error creating author:', error)
      });
    }
  }
}
