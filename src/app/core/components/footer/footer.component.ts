import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [SharedModule], // Importa o SharedModule para usar CommonModule
  template: `
    <footer class="text-center p-4 bg-gray-200 text-gray-600 border-t border-gray-300">
      <p>&copy; {{ currentYear }} Gestão de Eventos - Desenvolvimento Full Stack Spring Boot + Angular.</p>
    </footer>
  `,
  styles: [
    `
      footer {
        position: fixed;
        bottom: 0;
        width: 100%;
        background-color: #e5e7eb; /* tailwind gray-200 */
        z-index: 10;
      }
    `
  ]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}