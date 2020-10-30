export interface Appointment {
  id: number;
  dataCadastro: Date;
  dataAgendamento: Date;
  comentario?: string;
  flCancelado: boolean;

  // FKs
  idAgendamento: number;
  idFuncionario: number;
  idProfissional: number;
  idCliente: number;
}
