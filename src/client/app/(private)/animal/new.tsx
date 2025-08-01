import animalApi from "@/api/animal/animal.api";
import { AnimalCreate } from "@/api/animal/animal.input";
import AnimalCreateContent from "@/components/animal/AnimalCreateContent";
import BaseComponent from "@/components/basic/base/BaseComponent";
import PageHeader from "@/components/basic/base/PageHeader";
import ROUTES from "@/lib/routes";
import { ImagePickerAsset } from "expo-image-picker";
import { router } from "expo-router";
import { Toast } from "toastify-react-native";

export default function PetCreateScreen() {
  const handleCreateAnimal = async (
    createdAnimal: AnimalCreate,
    image: ImagePickerAsset | File | null,
  ) => {
    try {
      await animalApi.createAnimal(createdAnimal, image);
      router.replace(ROUTES.PRIVATE.ANIMAL.SEARCH);
    } catch (e) {
      Toast.error("Failed to create pet.");
    }
  };

  return (
    <BaseComponent title={"Add an animal"}>
      <PageHeader title={"Add"} description={"Add an animal to the system"} />
      <AnimalCreateContent onCreate={handleCreateAnimal} />
    </BaseComponent>
  );
}
