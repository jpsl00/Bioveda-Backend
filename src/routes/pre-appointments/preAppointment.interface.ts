export interface PreAppointment {
  id: number;
  dataCadastro: Date;
  comentario?: string;
  flCancelado: boolean;

  // FKs
  idFuncionario: number;
  idProfissional: number;
  idCliente: number;
}
