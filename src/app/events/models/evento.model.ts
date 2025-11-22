// Modelos de Dados para o Frontend Angular

/**
 * Representa um Evento para requisição (Request DTO - Crianção/Atualização)
 * Nota: 'id' é opcional para criação.
 */
export interface EventoRequestDTO {
    titulo: string;
    descricao: string;
    dataHora: string; // Usamos string no frontend para facilitar o tratamento de datas (ISO format)
    local: string;
}

/**
 * Representa um Evento retornado pela API (Response DTO)
 */
export interface EventoResponseDTO {
    id: number;
    titulo: string;
    descricao: string;
    dataHora: string;
    local: string;
}

/**
 * Interface que representa a estrutura de paginação retornada pelo Spring Boot Page<T>
 */
export interface EventoPage {
    content: EventoResponseDTO[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number; // Corresponde ao pageIndex (base 0)
    empty: boolean;
    first: boolean;
    last: boolean;
}