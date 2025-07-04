import { ApiPaths } from "@/api/Path";
import api from "@/lib/axios";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { RequestList } from "../RequestList";
import { buildMultipartFormData } from "../Utils";
import { GuideCreate, GuideQueryParams, GuideUpdate } from "./guide.input";
import { GuideInformation, GuidePreview } from "./guide.output";

async function getGuide(id: number): Promise<GuideInformation> {
  const response = await api.get(ApiPaths.guides.get(id));
  return response.data;
}

async function getGuides(
  queryParams: GuideQueryParams = {},
): Promise<RequestList<GuidePreview>> {
  const response = await api.get(ApiPaths.guides.get_all, {
    params: queryParams,
  });
  return response.data;
}

async function createGuide(
  input: GuideCreate,
  file?: DocumentPicker.DocumentPickerAsset | File,
  image?: ImagePicker.ImagePickerAsset | File,
): Promise<Map<string, number>> {
  const files = [
    { key: "image", file: image },
    { key: "file", file: file },
  ];

  const formData = await buildMultipartFormData("guide", input, files);

  console.log(file);
  console.log(formData);

  const response = await api.post(ApiPaths.guides.create, formData);

  return response.data;
}

async function updateGuide(
  id: number,
  input: GuideUpdate,
  file?: DocumentPicker.DocumentPickerAsset,
  image?: ImagePicker.ImagePickerAsset | File,
): Promise<void> {
  const files = [
    { key: "image", file: image },
    { key: "file", file: file },
  ];

  const formData = await buildMultipartFormData("guide", input, files);

  const response = await api.post(ApiPaths.guides.update(id), formData);

  return response.data;
}

async function deleteGuide(id: number): Promise<void> {
  const response = await api.delete(ApiPaths.guides.delete(id));
  return response.data;
}

export default { getGuide, getGuides, createGuide, updateGuide, deleteGuide };
