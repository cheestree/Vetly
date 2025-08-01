import clinicApi from "@/api/clinic/clinic.api";
import { ClinicCreate } from "@/api/clinic/clinic.input";
import BaseComponent from "@/components/basic/base/BaseComponent";
import PageHeader from "@/components/basic/base/PageHeader";
import ClinicCreateContent from "@/components/clinic/ClinicCreateContent";
import { router } from "expo-router";
import { Toast } from "toastify-react-native";

export default function ClinicCreateScreen() {
  const handleCreateCheckup = async (createdCheckup: ClinicCreate) => {
    try {
      await clinicApi.createClinic(createdCheckup);
      router.back();
    } catch (e) {
      Toast.error("Failed to create clinic.");
    }
  };

  return (
    <BaseComponent title={"Create a clinic"}>
      <PageHeader
        title={"Create"}
        description={"Create a clinic and update it later"}
      />
      <ClinicCreateContent onCreate={handleCreateCheckup} />
    </BaseComponent>
  );
}
