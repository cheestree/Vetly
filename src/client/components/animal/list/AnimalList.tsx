import { AnimalPreview } from "@/api/animal/animal.output";
import size from "@/theme/size";
import { ScrollView, StyleSheet } from "react-native";
import AnimalPreviewCard from "../AnimalPreviewCard";

type AnimalListProps = {
  animals: AnimalPreview[];
};

export default function AnimalList({ animals }: AnimalListProps) {
  return (
    <ScrollView
      contentContainerStyle={extras.gridContainer}
      showsVerticalScrollIndicator={false}
    >
      {animals.map((animal) => (
        <AnimalPreviewCard key={animal.id.toString()} animal={animal} />
      ))}
    </ScrollView>
  );
}

const extras = StyleSheet.create({
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: size.gap.xl,
  },
});
