import { ApiPaths } from "@/api/Path";
import api from "@/lib/axios";
import { RequestList } from "../RequestList";
import {
  ClinicSupplyQueryParams,
  SupplyAssociate,
  SupplyQueryParams,
  SupplyUpdate,
} from "./supply.input";
import { SupplyInformation, SupplyPreview } from "./supply.output";

async function getSupply(id: number): Promise<SupplyInformation> {
  const response = await api.get(ApiPaths.supplies.get_supply(id));
  return response.data;
}

async function getSupplies(
  queryParams: SupplyQueryParams = {},
): Promise<RequestList<SupplyPreview>> {
  const response = await api.get(ApiPaths.supplies.get_all, {
    params: queryParams,
  });
  return response.data;
}

async function getClinicSupplies(
  id: number,
  queryParams: ClinicSupplyQueryParams = {},
): Promise<RequestList<SupplyPreview>> {
  const response = await api.get(ApiPaths.supplies.get_clinic_supplies(id), {
    params: queryParams,
  });
  return response.data;
}

async function associateSupplyWithClinic(
  clinicId: number,
  input: SupplyAssociate,
): Promise<void> {
  const response = await api.put(
    ApiPaths.supplies.associateSupply(clinicId),
    input,
  );
  return response.data;
}

async function updateSupply(
  clinicId: number,
  supplyId: number,
  input: SupplyUpdate,
): Promise<void> {
  const response = await api.put(
    ApiPaths.supplies.update(clinicId, supplyId),
    input,
    { headers: { "Content-Type": "application/json" } },
  );
  return response.data;
}

async function deleteSupply(clinicId: number, supplyId: number): Promise<void> {
  const response = await api.delete(
    ApiPaths.supplies.delete(clinicId, supplyId),
  );
  return response.data;
}

export default {
  getSupply,
  getSupplies,
  getClinicSupplies,
  associateSupplyWithClinic,
  updateSupply,
  deleteSupply,
};
