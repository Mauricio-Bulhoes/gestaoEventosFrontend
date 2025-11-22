import { Routes } from '@angular/router';

export const routes: Routes = [
    // Rota de redirecionamento (homepage)
    { path: '', redirectTo: 'events', pathMatch: 'full' },
    
    // Rota para o módulo de Eventos com Lazy Loading
    // Isso garante que o código do EventsModule só seja carregado quando o usuário navegar para /events
    {
        path: 'events',
        loadChildren: () => import('./events/events.module').then(m => m.EventsModule)
    },
    
    // Rota curinga (para URLs não encontradas)
    { path: '**', redirectTo: 'events' }
];
