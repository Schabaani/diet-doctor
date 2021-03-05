import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FontSize, MarginSizes, Colors } from '_src/utils/enums';

type ViewAllProps = {
  onPress: (query: string) => void;
  query: string;
  title: string;
};

export const ViewAll = ({ onPress, query, title }: ViewAllProps) => {
  return (
    <View style={styles.container}>
      <Text style={{ flex: 1, fontSize: FontSize.XLarge, fontWeight: 'bold' }}>
        {title}
      </Text>

      <TouchableOpacity
        style={styles.container}
        onPress={() => {
          onPress(query);
        }}
      >
        <Text style={{ fontSize: FontSize.Medium, color: Colors.Blue }}>
          View all
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: MarginSizes.Large,
    paddingRight: MarginSizes.Medium,
    height: 60
  }
});
