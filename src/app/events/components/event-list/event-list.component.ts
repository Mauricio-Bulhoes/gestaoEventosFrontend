import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Subject, takeUntil } from 'rxjs';

import { EventoService } from '../../services/evento.service';
import { EventoResponseDTO, EventoPage } from '../../models/evento.model';

@Component({
  selector: 'app-event-list',
  standalone: true,
  // Importação direta de todas as dependências de UI e módulos Angular necessários
  imports: [
    CommonModule, 
    DatePipe, 
    FormsModule, 
    MatPaginatorModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule, 
    MatProgressSpinnerModule, 
    MatInputModule, 
    MatFormFieldModule
  ],
  template: `
    <div class="p-4 md:p-8 max-w-7xl mx-auto">
      <h1 class="text-3xl font-extrabold mb-8 text-indigo-800 border-b pb-2">Próximos Eventos</h1>

      <!-- Campo de Busca por ID -->
      <div class="mb-8 bg-white p-6 rounded-lg shadow-lg">
        <div class="flex flex-col sm:flex-row items-end search-container">
          <mat-form-field class="flex-1" appearance="outline">
            <mat-label>Buscar evento por ID</mat-label>
            <input matInput type="number" [(ngModel)]="searchId" placeholder="Digite o ID do evento" (keyup.enter)="searchEventById()">
            <mat-icon matPrefix class="text-indigo-500">search</mat-icon>
          </mat-form-field>
          <button mat-raised-button color="primary" (click)="searchEventById()" class="h-14">
            <mat-icon>search</mat-icon> Buscar
          </button>
        </div>
      </div>

      <!-- Indicador de Carregamento -->
      <div *ngIf="isLoading" class="flex flex-col justify-center items-center py-12">
        <mat-spinner diameter="50" color="primary"></mat-spinner>
        <p class="mt-4 text-lg text-gray-600">Carregando eventos...</p>
      </div>

      <!-- Mensagem de Erro -->
      <div *ngIf="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
        <strong class="font-bold">Erro:</strong>
        <span class="block sm:inline ml-2">{{ errorMessage }}</span>
      </div>

      <!-- Lista de Eventos -->
      <div *ngIf="!isLoading && events.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <mat-card *ngFor="let event of events" class="shadow-xl hover:shadow-2xl transition-all duration-300 rounded-lg overflow-hidden">
          <mat-card-header class="p-4 bg-indigo-50 border-b border-indigo-200">
            <mat-card-title class="text-xl font-bold text-indigo-700">{{ event.titulo }}</mat-card-title>
            <mat-card-subtitle class="text-sm text-gray-500 mt-1">Local: {{ event.local }}</mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content class="mt-4 p-4">
            <p class="text-gray-700 mb-4 h-12 overflow-hidden text-ellipsis">{{ event.descricao }}</p>
            
            <div class="flex items-center text-sm text-gray-600 mb-4">
              <mat-icon class="mr-2 text-indigo-500 text-base" [inline]="true">calendar_today</mat-icon>
              Data: {{ event.dataHora | date: 'dd/MM/yyyy' }}
            </div>
            <div class="flex items-center text-sm text-gray-600">
              <mat-icon class="mr-2 text-indigo-500 text-base" [inline]="true">schedule</mat-icon>
              Hora: {{ event.dataHora | date: 'HH:mm' }}
            </div>
          </mat-card-content>
          
          <mat-card-actions class="flex justify-between items-center p-4 bg-gray-50 border-t gap-2">
            <button mat-flat-button (click)="goToEdit(event.id)" class="my-custom-button-edit">
              <mat-icon>edit</mat-icon> Editar
            </button>
            <button mat-flat-button color="primary" (click)="goToDetails(event.id)">
              <mat-icon>info</mat-icon> Ver Detalhes
            </button>
            <button mat-flat-button color="warn" (click)="deleteEvent(event.id)">
                <mat-icon>delete</mat-icon> Excluir (Soft Delete)
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <!-- Mensagem de Sem Eventos -->
      <div *ngIf="!isLoading && events.length === 0 && !errorMessage" class="text-center py-16 bg-white rounded-lg shadow-inner">
        <mat-icon class="text-6xl text-gray-400">event_busy</mat-icon>
        <p class="text-xl text-gray-600 mt-4 font-medium">Nenhum evento futuro encontrado.</p>
        <p class="text-gray-500 mt-2">Que tal criar o primeiro evento?</p>
      </div>

      <!-- Paginação -->
      <mat-paginator
        *ngIf="!isLoading && totalElements > 0"
        [length]="totalElements"
        [pageSize]="pageSize"
        [pageSizeOptions]="pageSizeOptions"
        [pageIndex]="pageIndex"
        (page)="handlePageEvent($event)"
        aria-label="Selecione a página de eventos"
        class="mt-10 p-4 rounded-lg shadow-lg"
      >
      </mat-paginator>

    </div>
  `,
  styles: [`
    /* Estilo para garantir que o MatPaginator use a cor primária */
    :host ::ng-deep .mat-mdc-paginator {
      background-color: white !important;
    }
    .text-ellipsis {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .my-custom-button-edit { background-color: #FFD700; }
    
    mat-card-actions button {
      margin: 0 4px;
    }
    
    mat-card-actions button:first-child {
      margin-left: 0;
    }
    
    mat-card-actions button:last-child {
      margin-right: 0;
    }
    
    .search-container button {
      margin-left: 4px;
    }
  `],
   
})
export class EventListComponent implements OnInit, OnDestroy {
  events: EventoResponseDTO[] = []; 
  totalElements = 0;
  pageIndex = 0;
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 15, 20];
  isLoading = false;
  errorMessage: string = '';
  searchId: number | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private eventoService: EventoService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadEvents();
  }

  ngOnDestroy(): void {
    // Limpeza de subscrições
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Carrega os eventos da API com paginação e ordenação.
   */
  loadEvents(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    // Assumindo a chamada de serviço que recebe índice, tamanho e ordenação
    const sort = 'dataHora,asc';

    this.eventoService.listarTodos(this.pageIndex, this.pageSize, sort)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (page: EventoPage) => {

          this.events = page.content;
          this.totalElements = page.totalElements;
          this.pageIndex = page.number; 
          this.pageSize = page.size;
          this.isLoading = false;

          // Força a detecção de mudanças
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Erro ao carregar eventos:', err);
          this.errorMessage = 'Falha ao carregar eventos. Verifique a conexão com o backend (porta 8080).';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  /**
   * Lida com a mudança de página ou tamanho de página do MatPaginator.
   */
  handlePageEvent(e: PageEvent): void {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.loadEvents();
  }

  /**
   * Busca um evento específico por ID e navega para a página de detalhes.
   */
  searchEventById(): void {
    if (this.searchId !== null && this.searchId > 0) {
      this.goToDetails(this.searchId);
    } else {
      this.errorMessage = 'Por favor, digite um ID válido para buscar.';
      this.cdr.detectChanges();
      
      // Limpa a mensagem de erro após 3 segundos
      setTimeout(() => {
        this.errorMessage = '';
        this.cdr.detectChanges();
      }, 3000);
    }
  }

  /**
   * Navega para a página de detalhes do evento.
   * @param id ID do evento.
   */
  goToDetails(id: number): void {
    this.router.navigate(['/events', id]);
  }

  /**
   * Navega para a página de edição do evento.
   * @param id ID do evento.
   */
  goToEdit(id: number): void {
    this.router.navigate(['/events', id, 'edit']);
  }

  /**
   * Realiza o Soft Delete do evento.
   * @param id ID do evento.
   */
  deleteEvent(id: number): void {

    const confirmed = confirm('Tem certeza que deseja excluir este evento?');
    
    if (!confirmed) {
      return;
    }

    console.log(`[SOFT DELETE] Tentando excluir evento ID: ${id}.`);

    this.eventoService.deleteEvento(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          console.log(`[SUCESSO] Evento ID: ${id} excluído (soft delete).`);
          // Recarrega a lista para refletir a mudança
          this.loadEvents();
        },
        error: (err) => {
          console.error(`[ERRO] Falha ao excluir evento ID: ${id}`, err);
          this.errorMessage = 'Falha na exclusão do evento. Tente novamente.';
          this.cdr.detectChanges();
        }
      });
  }
}