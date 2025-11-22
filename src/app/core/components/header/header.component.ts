import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SharedModule], // Importa o SharedModule para usar MatToolbar, MatButton e RouterModule
  template: `
    <mat-toolbar color="primary" class="shadow-md">
      <button mat-icon-button class="example-icon" aria-label="Home icon" [routerLink]="['/']">
        <mat-icon>home</mat-icon>
      </button>
      <span>Gestão de Eventos</span>
      <span class="spacer"></span>
      <button mat-button [routerLink]="['/events']">
        <mat-icon>event</mat-icon> Lista de Eventos
      </button>
      <button mat-button [routerLink]="['/events/new']">
        <mat-icon>add_circle</mat-icon> Novo Evento
      </button>
    </mat-toolbar>
  `,
  styles: [
    `.spacer { flex: 1 1 auto; }
     .shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1); }
    `
  ]
})
export class HeaderComponent { }