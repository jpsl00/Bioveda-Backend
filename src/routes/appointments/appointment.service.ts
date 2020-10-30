/**
 * Data Model Interfaces
 */

import { Appointment } from "./appointment.interface";

/**
 * In-Memory Store
 */

const defaultAppointment: Partial<Appointment> = {
  dataCadastro: new Date(),
  dataAgendamento: new Date(),
  flCancelado: false,

  idAgendamento: -1,
  idFuncionario: -1,
  idProfissional: -1,
  idCliente: -1,
};

let appointments: Appointment[] = [
  {
    id: 1,
    dataCadastro: new Date(),
    dataAgendamento: new Date(),
    flCancelado: false,

    idAgendamento: 1,
    idFuncionario: 1,
    idProfissional: 1,
    idCliente: 1,
  },
];

/**
 * Service Methods
 */

export const findAll = async (): Promise<Appointment[]> => {
  return appointments;
};

export const findIndex = async (id: number): Promise<number> => {
  const index: number = appointments.findIndex((v) => v.id === id);

  if (index >= 0) return index;

  throw new Error("No index of record found");
};

export const find = async (id: number): Promise<Appointment> => {
  const record: Appointment = appointments[await findIndex(id)];

  if (record) return record;

  throw new Error("No record found");
};

export const create = async (newRecord: Appointment): Promise<void> => {
  const id = Math.max(...appointments.map((v) => v.id));
  appointments.push({
    ...defaultAppointment,
    ...newRecord,
    id,
  });
};

export const update = async (
  id: number,
  updatedRecord: Appointment
): Promise<void> => {
  const index = await findIndex(id);

  if (index) {
    appointments[index] = { ...appointments[index], ...updatedRecord, id };
    return;
  }

  throw new Error("No record found to update");
};

export const remove = async (id: number): Promise<void> => {
  const index: number = await findIndex(id);
  const record: Appointment = appointments[index];

  if (record) {
    delete appointments[index];
    return;
  }

  throw new Error("No record found to delete");
};
