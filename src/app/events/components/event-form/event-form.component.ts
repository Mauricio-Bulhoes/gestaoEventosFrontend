import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventoService } from '../../services/evento.service';
import { EventoRequestDTO, EventoResponseDTO } from '../../models/evento.model';
import { Observable, catchError, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styles: []
  //styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent implements OnInit {

  eventForm: FormGroup;
  isEditing: boolean = false;
  eventId: number | null = null;
  isLoading: boolean = false;
  
  // Data e hora mínima permitida (hoje, ajustada para o fuso horário local)
  minDateTime: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private eventoService: EventoService
  ) {
    this.minDateTime = this.getMinDateTime();
    
    this.eventForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      descricao: ['', [Validators.maxLength(1000)]],
      // dataHora usa um validador customizado para replicar a validação @Future do Spring
      dataHora: ['', [Validators.required, this.futureDateTimeValidator]], 
      local: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(200)]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      // Verifica se há um 'id' na rota para determinar se é edição
      switchMap(params => {
        const idParam = params.get('id');
        this.eventId = idParam ? +idParam : null;
        this.isEditing = !!this.eventId;

        if (this.isEditing && this.eventId) {
          this.isLoading = true;
          return this.eventoService.getEventoById(this.eventId).pipe(
            catchError(() => {
                // Em caso de erro, navega de volta e notifica
                alert('Erro ao carregar o evento para edição. Evento não encontrado ou erro na API.');
                this.router.navigate(['/events']);
                return of(null);
            })
          );
        }
        return of(null);
      })
    ).subscribe((evento: EventoResponseDTO | null) => {
      if (evento) {
        // Preenche o formulário para edição. 
        // Substring(0, 16) é crucial para formatar corretamente para o input type="datetime-local" (YYYY-MM-DDTHH:MM)
        this.eventForm.patchValue({
          titulo: evento.titulo,
          descricao: evento.descricao,
          dataHora: evento.dataHora.substring(0, 16), 
          local: evento.local
        });
      }
      this.isLoading = false;
    });
  }
  
  // Validador Estático Customizado (pode ser usado diretamente na definição do formGroup)
  futureDateTimeValidator(control: AbstractControl): ValidationErrors | null {
    if (control.value) {
      const selectedDateTime = new Date(control.value).getTime();
      const currentDateTime = new Date().getTime();
      // Permite uma pequena margem (ex: 5 segundos) para evitar falhas por latência
      if (selectedDateTime <= (currentDateTime + 5000)) { 
        return { 'futureDateTime': true };
      }
    }
    return null;
  }
  
  // Gera a data e hora mínima no formato YYYY-MM-DDTHH:MM para o atributo [min] do input
  private getMinDateTime(): string {
    const now = new Date();
    // Ajusta o fuso horário para garantir que seja o horário local
    const offset = now.getTimezoneOffset() * 60000;
    const localNow = new Date(now.getTime() - offset);
    // Retorna a string no formato YYYY-MM-DDTHH:MM
    return localNow.toISOString().slice(0, 16);
  }

  onSubmit(): void {
    if (this.eventForm.invalid) {
      // Marca todos os campos como "touched" para exibir as mensagens de erro
      this.eventForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formValue = this.eventForm.value;
    
    // Converte a data e hora para o formato ISO 8601 completo (necessário para o LocalDateTime do Spring)
    const requestDto: EventoRequestDTO = {
        ...formValue,
        dataHora: new Date(formValue.dataHora).toISOString()
    };

    let operation: Observable<EventoResponseDTO>;

    if (this.isEditing && this.eventId) {
      operation = this.eventoService.updateEvento(this.eventId, requestDto);
    } else {
      operation = this.eventoService.createEvento(requestDto);
    }

    operation.subscribe({
      next: () => {
        alert(`Evento ${this.isEditing ? 'atualizado' : 'criado'} com sucesso!`);
        this.router.navigate(['/events']);
      },
      error: (err) => {
        console.error(err);
        let errorMsg = `Erro ao ${this.isEditing ? 'atualizar' : 'criar'} o evento.`;
        if (err.error && typeof err.error.error === 'string') {
          // Tenta extrair a mensagem de erro da API do Spring
          errorMsg += ` Detalhe: ${err.error.error.split('\n')[0]}`;
        }
        alert(errorMsg);
        this.isLoading = false;
      }
    });
  }
}