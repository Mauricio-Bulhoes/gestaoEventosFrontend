import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Importe os componentes que serão mapeados pelas rotas
import { EventListComponent } from './components/event-list/event-list.component';
import { EventFormComponent } from './components/event-form/event-form.component';
import { EventDetailsComponent } from './components/event-details/event-details.component';

const routes: Routes = [
  // Rota raiz da feature: /events
  { path: '', component: EventListComponent },           
  // Rota para criação: /events/new
  { path: 'new', component: EventFormComponent },         
  // Rota para edição: /events/:id/edit
  { path: ':id/edit', component: EventFormComponent },    
  // Rota para detalhes: /events/:id
  { path: ':id', component: EventDetailsComponent }       
];

@NgModule({
  // Importa RouterModule.forChild() para registrar as rotas da feature
  imports: [RouterModule.forChild(routes)],
  // Exporta o RouterModule para que o EventsModule possa usá-lo
  exports: [RouterModule]
})
export class EventsRoutingModule { }