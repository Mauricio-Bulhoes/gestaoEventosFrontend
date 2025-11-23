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
        // Converte a data do servidor para o horário local do usuário
        const dataHoraLocal = this.convertToLocalDateTime(evento.dataHora);
        
        // Preenche o formulário para edição. 
        this.eventForm.patchValue({
          titulo: evento.titulo,
          descricao: evento.descricao,
          dataHora: dataHoraLocal, 
          local: evento.local
        });
      }
      this.isLoading = false;
    });
  }

  /**
   * Converte a data ISO do servidor para o formato datetime-local
   * mantendo o horário local do usuário
   */
  private convertToLocalDateTime(isoString: string): string {
    const date = new Date(isoString);
    // Formata no formato YYYY-MM-DDTHH:mm para o input datetime-local
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
  
  /**
   * Converte a data local para ISO mantendo o horário escolhido pelo usuário
   */
  private convertToISOWithoutTimeShift(localDateTime: string): string {
    // Extrai os componentes da data local
    const [datePart, timePart] = localDateTime.split('T');
    const [year, month, day] = datePart.split('-').map(Number);
    const [hours, minutes] = timePart.split(':').map(Number);
    
    // Cria uma data com os valores exatos (sem conversão de fuso)
    const date = new Date(year, month - 1, day, hours, minutes, 0);
    
    // Formata manualmente para ISO 8601
    const isoYear = date.getFullYear();
    const isoMonth = String(date.getMonth() + 1).padStart(2, '0');
    const isoDay = String(date.getDate()).padStart(2, '0');
    const isoHours = String(date.getHours()).padStart(2, '0');
    const isoMinutes = String(date.getMinutes()).padStart(2, '0');
    const isoSeconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${isoYear}-${isoMonth}-${isoDay}T${isoHours}:${isoMinutes}:${isoSeconds}`;
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
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  onSubmit(): void {
    if (this.eventForm.invalid) {
      // Marca todos os campos como "touched" para exibir as mensagens de erro
      this.eventForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formValue = this.eventForm.value;
    
    // Converte mantendo o horário local escolhido pelo usuário
    const requestDto: EventoRequestDTO = {
        ...formValue,
        dataHora: this.convertToISOWithoutTimeShift(formValue.dataHora)
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