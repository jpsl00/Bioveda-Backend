export interface Appointment {
  id: number;
  dataCadastro: Date;
  comentario?: string;

  // FKs
  idFuncionario: number;
  idProfissional: number;
  idCliente: number;
}
