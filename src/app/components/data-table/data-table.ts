import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { SortColumn, SortDirection, SortState } from '../../models/sort-state';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './data-table.html',
  styleUrl: './data-table.css',
})
export class DataTableComponent implements OnInit {
  users = signal<User[]>([]);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);
  searchTerm = signal<string>('');
  sortState = signal<SortState>({ column: null, direction: null });

  filteredUsers = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const allUsers = this.users();
    const { column, direction } = this.sortState();

    let result = allUsers;

    if (term !== '') {
      result = allUsers.filter((user) => user.name.toLowerCase().includes(term));
    }

    if (column && direction) {
      result = [...result].sort((a, b) => {
        const aValue = String(a[column]).toLowerCase();
        const bValue = String(b[column]).toLowerCase();

        const compareResult = aValue.localeCompare(bValue);
        return direction === SortDirection.ASC ? compareResult : -compareResult;
      });
    }

    return result;
  });

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users.set(data);
        this.isLoading.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.isLoading.set(false);
      },
    });
  }

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
  }

  onSort(column: SortColumn): void {
    const currentState = this.sortState();

    if (currentState.column === column) {
      const newDirection =
        currentState.direction === SortDirection.ASC ? SortDirection.DESC : SortDirection.ASC;
      this.sortState.set({ column, direction: newDirection });
    } else {
      this.sortState.set({ column, direction: SortDirection.ASC });
    }
  }

  sortIconClass(column: SortColumn): string {
    const state = this.sortState();
    if (state.column !== column) return 'bi bi-arrow-down-up';
    return state.direction === SortDirection.ASC ? 'bi bi-arrow-up' : 'bi bi-arrow-down';
  }
}
