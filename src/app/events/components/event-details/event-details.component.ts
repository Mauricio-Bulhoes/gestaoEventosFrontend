import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventoService } from '../../services/evento.service';
import { EventoResponseDTO } from '../../models/evento.model';
import { DatePipe } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [SharedModule, DatePipe],
  template: `
    <div class="p-6 max-w-4xl mx-auto">
      <button mat-button color="primary" (click)="goBack()" class="mb-4 flex items-center">
        <mat-icon>arrow_back</mat-icon>
        Voltar para a Lista
      </button>

      <!-- Indicador de Carregamento / Erro -->
      @if (isLoading) {
        <div class="flex justify-center items-center py-10">
          <mat-spinner diameter="50"></mat-spinner>
        </div>
      }
      
      @if (errorMessage) {
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong class="font-bold">Erro:</strong>
          <span class="block sm:inline"> {{ errorMessage }}</span>
        </div>
      }

      <!-- Detalhes do Evento -->
      @if (event) {
        <mat-card class="shadow-2xl">
          <mat-card-header>
            <mat-card-title class="text-3xl font-extrabold text-indigo-800">{{ event.titulo }}</mat-card-title>
            <mat-card-subtitle class="mt-2 text-lg text-gray-600">ID: {{ event.id }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content class="mt-6">
            <p class="text-gray-700 mb-4 text-base leading-relaxed whitespace-pre-wrap">{{ event.descricao }}</p>

            <div class="space-y-3 mt-6">
              <div class="flex items-center text-lg text-gray-800">
                <mat-icon class="mr-2 text-indigo-600">access_time</mat-icon>
                <strong>Data e Hora:</strong> {{ event.dataHora | date: 'fullDate' }} às {{ event.dataHora | date: 'HH:mm' }}
              </div>
              <div class="flex items-center text-lg text-gray-800">
                <mat-icon class="mr-2 text-indigo-600">location_on</mat-icon>
                <strong>Local:</strong> {{ event.local }}
              </div>
            </div>
          </mat-card-content>
          <mat-card-actions class="flex justify-end border-t pt-4 mt-6">
            <button mat-flat-button color="warn" (click)="deleteEvent(event.id)">
              <mat-icon>delete</mat-icon> Excluir (Soft Delete)
            </button>
          </mat-card-actions>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    /* Estilos customizados */
  `]
})
export class EventDetailsComponent implements OnInit, OnDestroy {
  event: EventoResponseDTO | null = null;
  isLoading = true;
  errorMessage: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventoService: EventoService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        const id = +idParam;
        this.loadEventDetails(id);
      } else {
        this.errorMessage = 'ID do evento não fornecido na rota.';
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadEventDetails(id: number): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.eventoService.buscarPorId(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (event) => {
          this.event = event;
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = 'Não foi possível carregar os detalhes do evento. O evento pode não existir.';
          this.isLoading = false;
          console.error('Erro ao carregar detalhes:', err);
        }
      });
  }

  deleteEvent(id: number): void {
    // Para implementação futura: Adicione a lógica de exclusão aqui.
    console.log(`Solicitação de exclusão para o evento ID: ${id}`);
    // Usando alert temporário, mas o ideal é um modal personalizado
    alert('Função de exclusão não implementada. Você precisará de um modal de confirmação antes de chamar o serviço.');
  }

  goBack(): void {
    this.router.navigate(['/events']);
  }
}