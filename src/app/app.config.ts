import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

// TODO: Importar serviços globais que estariam no CoreModule (ex: Auth, Notificações)
// Se você tiver serviços (como EventoService) que são singletons globais,
// você os adiciona aqui usando provide<NomeDoServico>(). Ex: provideService(AuthService)

// Definição das rotas principais da aplicação
export const routes: Routes = [
  // Redireciona a raiz para a lista de eventos
  { path: '', redirectTo: 'events', pathMatch: 'full' },
  
  // Rota para o módulo de eventos (lazy loading)
  // O Angular permite que projetos Standalone ainda carreguem features legadas (baseadas em NgModule) via lazy loading.
  { 
    path: 'events', 
    loadChildren: () => import('./events/events.module').then(m => m.EventsModule) 
  },
  
  // Rota coringa para 404
  { path: '**', redirectTo: 'events' }
];

export const appConfig: ApplicationConfig = {
  providers: [
    // 1. Configura o roteamento principal
    provideRouter(routes), 
    
    // 2. Importa o módulo HttpClient (Necessário para fazer chamadas HTTP à API Spring Boot)
    importProvidersFrom(HttpClientModule),

    // 3. Configura o provedor de animações 
    provideAnimations(), 
    
    // ** PONTO CHAVE **
    // Se você tiver serviços que seriam injetados via CoreModule:
    // Ex: provideHttpClient(),
    // Ex: { provide: API_BASE_URL, useValue: 'http://localhost:8080/api' },
    // Adicione os provedores aqui.
  ]
};