import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, TouchableOpacity, Image, Text, View } from 'react-native';
import ImageIcons from '_src/assets/images/images';
import { RootStackParamList } from '_src/navigations/router';
import { FontSize, MarginSizes, Colors } from '_src/utils/enums';

type HeaderProps = {
  navigation: StackNavigationProp<RootStackParamList>;
  title: string;
  isFavorite: boolean;
  onPressFavorite: () => void;
};

export const Header = (props: HeaderProps) => {
  const { onPressFavorite, title, isFavorite } = props;
  return (
    <View style={Styles.container}>
      <Text style={Styles.title}>{title}</Text>
      <TouchableOpacity
        onPress={() => {
          onPressFavorite();
        }}
        hitSlop={{ top: 5, left: 5, right: 5, bottom: 5 }}
      >
        <Image
          source={ImageIcons['Heart']}
          style={{
            width: 20,
            height: 20,
            marginRight: MarginSizes.Medium,
            tintColor: isFavorite ? Colors.Red : Colors.Black
          }}
        />
      </TouchableOpacity>
      <TouchableOpacity>
        <Image
          source={ImageIcons['Search']}
          style={{
            width: 20,
            height: 20,
            tintColor: Colors.Black
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

const Styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: MarginSizes.Large,
    height: 50,
    backgroundColor: Colors.White,
    borderColor: '#eee',
    margin: -1,
    marginTop: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3
  },
  title: {
    fontSize: FontSize.XXLarge,
    fontWeight: 'bold',
    flex: 1
  }
});
