import { QueryParams } from "../QueryParams";
import { ServiceType } from "./clinic.output";

type ClinicCreate = {
  name: string;
  nif: string;
  address: string;
  lng: number;
  lat: number;
  phone: string;
  email: string;
  services?: ServiceType[];
  openingHours?: OpeningHourModel[];
  ownerEmail?: string;
};

type ClinicUpdate = {
  name?: string;
  nif?: string;
  address?: string;
  lng?: number;
  lat?: number;
  phone?: string;
  email?: string;
  services?: ServiceType[];
  openingHours?: OpeningHourModel[];
  ownerId?: number;
};

type OpeningHourModel = {
  weekDay: number;
  opensAt: string;
  closesAt: string;
};

type ClinicQueryParams = QueryParams & {
  name?: string;
  lat?: number;
  lng?: number;
};

export { ClinicCreate, ClinicQueryParams, ClinicUpdate, OpeningHourModel };
