import { Receptionist } from "./Receptionist";

export interface ConnectedGym {
  id: string;
  room: string;
  receptionists: Receptionist[];
}
