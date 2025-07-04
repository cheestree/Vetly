import guideApi from "@/api/guide/guide.api";
import { GuideCreate } from "@/api/guide/guide.input";
import BaseComponent from "@/components/basic/base/BaseComponent";
import PageHeader from "@/components/basic/base/PageHeader";
import GuideCreateContent from "@/components/guide/GuideCreateContent";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { Alert } from "react-native";

export default function GuideCreateScreen() {
  const handleCreateGuide = async (
    createdGuide: GuideCreate,
    file?: DocumentPicker.DocumentPickerAsset | File,
    image?: ImagePicker.ImagePickerAsset | File,
  ) => {
    try {
      await guideApi.createGuide(createdGuide, file, image);
      router.back();
    } catch (error) {
      Alert.alert("Error", "Failed to create guide.");
    }
  };

  return (
    <BaseComponent title={"Create a guide"}>
      <PageHeader
        buttons={[]}
        title={"Create"}
        description={"Create a guide and update it later with documents"}
      />
      <GuideCreateContent onCreate={handleCreateGuide} />
    </BaseComponent>
  );
}
