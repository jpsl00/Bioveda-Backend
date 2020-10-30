/**
 * Data Model Interfaces
 */

import { PreAppointment } from "./preAppointment.interface";

/**
 * In-Memory Store
 */

const defaultPreAppointment: Partial<PreAppointment> = {
  dataCadastro: new Date(),
  flCancelado: false,

  idFuncionario: -1,
  idProfissional: -1,
  idCliente: -1,
};

let preAppointments: PreAppointment[] = [
  {
    id: 1,
    dataCadastro: new Date(),
    flCancelado: false,

    idFuncionario: 1,
    idProfissional: 1,
    idCliente: 1,
  },
];

/**
 * Service Methods
 */

export const findAll = async (): Promise<PreAppointment[]> => {
  return preAppointments;
};

export const findIndex = async (id: number): Promise<number> => {
  const index: number = preAppointments.findIndex((v) => v.id === id);

  if (index >= 0) return index;

  throw new Error("No index of record found");
};

export const find = async (id: number): Promise<PreAppointment> => {
  const record: PreAppointment = preAppointments[await findIndex(id)];

  if (record) return record;

  throw new Error("No record found");
};

export const create = async (newRecord: PreAppointment): Promise<void> => {
  const id = Math.max(...preAppointments.map((v) => v.id));
  preAppointments.push({
    ...defaultPreAppointment,
    ...newRecord,
    id,
  });
};

export const update = async (
  id: number,
  updatedRecord: PreAppointment
): Promise<void> => {
  const index = await findIndex(id);

  if (index) {
    preAppointments[index] = {
      ...preAppointments[index],
      ...updatedRecord,
      id,
    };
    return;
  }

  throw new Error("No record found to update");
};

export const remove = async (id: number): Promise<void> => {
  const index: number = await findIndex(id);
  const record: PreAppointment = preAppointments[index];

  if (record) {
    delete preAppointments[index];
    return;
  }

  throw new Error("No record found to delete");
};
