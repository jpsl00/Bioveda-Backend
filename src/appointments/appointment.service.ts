/**
 * Data Model Interfaces
 */

import { Appointment } from "./appointment.interface";
import { Appointments } from "./appointments.interface";

/**
 * In-Memory Store
 */

const appointments: Appointments = {
  1: {
    id: 1,
    dataCadastro: new Date(),
    idFuncionario: 1,
    idProfissional: 1,
    idCliente: 1,
  },
};

/**
 * Service Methods
 */

export const findAll = async (): Promise<Appointments> => {
  return appointments;
};

export const find = async (id: number): Promise<Appointment> => {
  const record: Appointment = appointments[id];

  if (record) return record;

  throw new Error("No record found");
};

export const create = async (newRecord: Appointment): Promise<void> => {
  const id = Math.max(...Object.keys(appointments).map((v) => parseInt(v)));
  appointments[id] = {
    ...newRecord,
    id,
  };
};

export const update = async (updatedRecord: Appointment): Promise<void> => {
  if (appointments[updatedRecord.id]) {
    appointments[updatedRecord.id] = updatedRecord;
    return;
  }

  throw new Error("No record found to update");
};

export const remove = async (id: number): Promise<void> => {
  const record: Appointment = appointments[id];

  if (record) {
    delete appointments[id];
    return;
  }

  throw new Error("No record found to delete");
};
