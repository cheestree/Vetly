import { useThemedStyles } from "@/hooks/useThemedStyles";
import { Text, View } from "react-native";
import CustomButton from "../custom/CustomButton";

type ButtonDescriptionProps = {
  name: string;
  icon: string;
  operation: () => void;
};

type PageHeaderProps = {
  title: string;
  description: string;
  buttons: ButtonDescriptionProps[];
};

export default function PageHeader({
  title,
  description,
  buttons,
}: PageHeaderProps) {
  const { styles } = useThemedStyles();

  return (
    <View style={styles.pageHeaderContainer}>
      <View style={styles.pageHeaderText}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <View style={styles.pageHeaderButtonsContainer}>
        {buttons.map((button) => {
          return (
            <CustomButton
              key={button.name}
              onPress={button.operation}
              text={button.name}
              icon={button.icon}
              fullWidth={false}
            />
          );
        })}
      </View>
    </View>
  );
}
