import BaseComponent from "@/components/basic/BaseComponent";
import React from "react";
import { Text } from "react-native";

export default function AnimalSearchScreen() {
  return (
    <>
      <BaseComponent isLoading={false} title={"Search Animals"}>
        <Text>Search Animals</Text>
      </BaseComponent>
    </>
  );
}
