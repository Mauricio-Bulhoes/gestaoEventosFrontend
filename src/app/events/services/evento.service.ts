import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventoResponseDTO, EventoPage } from '../models/evento.model';

/**
 * Serviço responsável pela comunicação com a API REST de Eventos.
 * Assume que o backend está rodando em http://localhost:8080/gestaoEventosBackend/evento.
 */
@Injectable({
  providedIn: 'root'
})
export class EventoService {
  // URL base para as requisições GET/POST/PUT/DELETE
  private baseUrl = 'http://localhost:8080/gestaoEventosBackend/evento'; 
  // URL para Soft Delete
  //private deleteUrl = 'http://localhost:8080/gestaoEventosBackend/DELETE/api/events'; 

  constructor(private http: HttpClient) { }

  /**
   * Corrige o endpoint para listar todos os eventos com paginação.
   * Mapeia para o endpoint /GET/api/events na API, que aceita page, size e sort.
   * @param page Índice da página (base 0).
   * @param size Tamanho da página.
   * @param sort Parâmetro de ordenação (ex: 'dataHora,asc').
   * @returns Observable contendo a página de eventos (EventoPage).
   */
  listarTodos(page: number, size: number, sort: string): Observable<EventoPage> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort); // Ex: 'dataHora,asc'
      
    //const endpoint = `http://localhost:8080/GET/api/events`;
    //return this.http.get<EventoPage>(endpoint, { params: params });
    const url = `${this.baseUrl}/GET/api/events`;
    return this.http.get<EventoPage>(url, { params: params });
  }

  /**
   * Busca um evento pelo ID.
   * @param id ID do evento.
   * @returns Observable do EventoResponseDTO.
   */
  buscarPorId(id: number): Observable<EventoResponseDTO> {
    //const endpoint = `http://localhost:8080/GET/api/events/${id}`;
    //return this.http.get<EventoResponseDTO>(endpoint);
    const url = `${this.baseUrl}/GET/api/events/${id}`;
    return this.http.get<EventoResponseDTO>(url);
  }

  /**
   * Realiza o soft delete de um evento.
   * @param id ID do evento a ser excluído.
   * @returns Observable vazio.
   */
  deleteEvento(id: number): Observable<void> {
    // Mapeia para o endpoint /DELETE/api/events/{id}
    //const endpoint = `http://localhost:8080/DELETE/api/events/${id}`;
    //return this.http.delete<void>(endpoint);
    const url = `${this.baseUrl}/DELETE/api/events/${id}`;
    return this.http.delete<void>(url);
  }
  
  /**
   * Busca um evento pelo ID (alias para buscarPorId).
   * @param id ID do evento.
   * @returns Observable do EventoResponseDTO.
   */
  getEventoById(id: number): Observable<EventoResponseDTO> {
    return this.buscarPorId(id);
  }

  /**
   * Cria um novo evento.
   * @param evento Dados do evento a ser criado.
   * @returns Observable do EventoResponseDTO criado.
   */
  createEvento(evento: any): Observable<EventoResponseDTO> {
    //const endpoint = `http://localhost:8080/POST/api/events`;
    //return this.http.post<EventoResponseDTO>(endpoint, evento);
    const url = `${this.baseUrl}/POST/api/events`;
    return this.http.post<EventoResponseDTO>(url, evento);
  }

  /**
   * Atualiza um evento existente.
   * @param id ID do evento a ser atualizado.
   * @param evento Dados atualizados do evento.
   * @returns Observable do EventoResponseDTO atualizado.
   */
  updateEvento(id: number, evento: any): Observable<EventoResponseDTO> {
    //const endpoint = `http://localhost:8080/PUT/api/events/${id}`;
    //return this.http.put<EventoResponseDTO>(endpoint, evento);
    const url = `${this.baseUrl}/PUT/api/events/${id}`;
    return this.http.put<EventoResponseDTO>(url, evento);
  }
}