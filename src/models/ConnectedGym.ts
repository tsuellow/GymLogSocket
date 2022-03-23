import { Receptionist } from "./Receptionist";

export interface ConnectedGym {
  id: string;
  room: string;
  gymId?: string;
  branch?: string;
  receptionists: Receptionist[];
}
