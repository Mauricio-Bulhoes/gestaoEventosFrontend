import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

/**
 * Componente principal da aplicação.
 * Funciona como um layout shell para a aplicação.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule
  ],
  template: `
    <!-- Layout responsivo usando Toolbar e RouterOutlet -->
    <mat-toolbar color="primary" class="shadow-lg z-10 sticky top-0">
      <span class="text-xl font-bold">Gestão de Eventos</span>
      <span class="spacer"></span>
      
      <!-- Navegação principal -->
      <nav class="hidden md:block">
        <button mat-button routerLink="/events" class="hover:bg-indigo-700">
          <mat-icon>list</mat-icon> Lista de Eventos
        </button>
        <button mat-flat-button color="accent" routerLink="/events/new" class="ml-4">
          <mat-icon>add</mat-icon> Novo Evento
        </button>
      </nav>

      <!-- Botão de menu para mobile -->
      <button mat-icon-button class="md:hidden" (click)="sidenav.toggle()">
        <mat-icon>menu</mat-icon>
      </button>
    </mat-toolbar>

    <mat-sidenav-container class="min-h-screen">
      <!-- Sidenav para navegação mobile -->
      <mat-sidenav #sidenav [mode]="'over'" [fixedInViewport]="true">
        <mat-nav-list (click)="sidenav.close()">
          <a mat-list-item routerLink="/events">
            <mat-icon matListItemIcon>list</mat-icon>
            <span matListItemTitle>Lista de Eventos</span>
          </a>
          <a mat-list-item routerLink="/events/new">
            <mat-icon matListItemIcon>add</mat-icon>
            <span matListItemTitle>Novo Evento</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <!-- Conteúdo principal -->
      <mat-sidenav-content class="bg-gray-100 p-0">
        <main class="min-h-[calc(100vh-64px)]">
          <!-- O conteúdo da rota ativa será renderizado aqui -->
          <router-outlet></router-outlet>
        </main>
        
        <!-- Footer simples -->
        <footer class="bg-gray-800 text-white text-center p-4 mt-auto">
          <p class="text-sm">&copy; {{ currentYear }} Gestão de Eventos API REST</p>
        </footer>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .spacer {
      flex: 1 1 auto;
    }
    .mat-toolbar-row {
        height: 64px;
    }
    .mat-sidenav-container {
      /* Garante que o conteúdo ocupe o espaço restante */
      height: 100%; 
    }
  `]
})
export class AppComponent {
  currentYear = new Date().getFullYear();
}