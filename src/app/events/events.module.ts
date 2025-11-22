import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// 1. Importa o módulo de rotas que você acabou de criar
import { EventsRoutingModule } from './events-routing.module';
import { EventListComponent } from './components/event-list/event-list.component';
import { EventFormComponent } from './components/event-form/event-form.component';
import { EventDetailsComponent } from './components/event-details/event-details.component';
import { SharedModule } from '../shared/shared.module'; // Dependência Material/Forms

// Módulos de Paginação de Terceiros (se necessário)
import { NgxPaginationModule } from 'ngx-pagination'; 

@NgModule({
  // Declara os componentes pertencentes a esta feature
  declarations: [
    EventFormComponent
  ],
  imports: [
    CommonModule,
    // 2. Adiciona ao array de imports
    EventsRoutingModule,
    SharedModule, 
    NgxPaginationModule,
    EventListComponent,
    EventDetailsComponent
  ]
})
export class EventsModule { }