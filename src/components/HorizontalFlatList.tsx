import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  FlatList,
  ImageBackground,
  Animated
} from 'react-native';
import { Rating } from 'react-native-ratings';

import { RootStackParamList } from '_src/navigations/router';
import { FontSize, MarginSizes, Colors, BorderRadius } from '_src/utils/enums';
import { RecipeItem } from '_src/utils/interfaces';
import { screenWidth } from '_src/utils/responsive';
import { ViewAll } from './ViewAll';

type HorizontalFlatListProps = {
  navigation: StackNavigationProp<RootStackParamList>;
  title: string;
  query: string;
  items: RecipeItem[];
};

export const HorizontalFlatList = (props: HorizontalFlatListProps) => {
  const { title, query, items } = props;
  const onPress = (query: string) => {};
  return (
    <View style={Styles.container}>
      <ViewAll title={title} onPress={onPress} query={query} />
      <View>
        <FlatList
          data={items}
          extraData={items}
          horizontal
          showsHorizontalScrollIndicator={true}
          renderItem={({ item, index }) => {
            return <HItem item={item} index={index} />;
          }}
          keyExtractor={(item, index) => item.id + index}
        />
      </View>
    </View>
  );
};

type HItemProps = {
  item: RecipeItem;
  index: number;
};
const HItem = (props: HItemProps) => {
  const scaleInAnimated = new Animated.Value(0);

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={() => {
        SCALE.pressInAnimation(scaleInAnimated);
      }}
      onPressOut={() => {
        SCALE.pressOutAnimation(scaleInAnimated);
      }}
      style={[SCALE.getScaleTransformationStyle(scaleInAnimated), Styles.item]}
    >
      {props.item.isMembersOnly && <View style={Styles.onlyMembers} />}
      <ImageBackground
        imageStyle={{ borderTopLeftRadius: 6, borderTopRightRadius: 6 }}
        source={{ uri: props.item.imageUri }}
        style={{ width: '100%', height: 160 }}
      >
        <Circle gram={props.item.gram} color={props.item.color} />
      </ImageBackground>
      <View style={Styles.description}>
        <Text numberOfLines={1}>{props.item.title}</Text>
        <View style={Styles.ratingWrapper}>
          <Rating
            readonly
            imageSize={15}
            ratingCount={5}
            startingValue={props.item.rating}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

type CircleProps = {
  color: string;
  gram: number;
};
const Circle = (props: CircleProps) => (
  <View
    style={[
      Styles.circle,
      {
        backgroundColor: props.color
      }
    ]}
  >
    <Text style={{ color: Colors.White }}>{props.gram}g</Text>
  </View>
);

const Styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: Colors.White,
    height: 280
  },
  title: {
    fontSize: FontSize.XXLarge,
    fontWeight: 'bold',
    flex: 1
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: MarginSizes.Small,
    marginLeft: MarginSizes.Small
  },
  description: {
    borderWidth: StyleSheet.hairlineWidth,
    borderTopWidth: 0,
    borderBottomEndRadius: BorderRadius.Small,
    borderBottomStartRadius: BorderRadius.Small,
    height: 60,
    paddingHorizontal: MarginSizes.Small,
    paddingTop: MarginSizes.Small
  },
  item: {
    width: screenWidth - 100,
    marginLeft: 15,
    backgroundColor: 'white'
  },
  onlyMembers: {
    position: 'absolute',
    backgroundColor: Colors.Black,
    left: 0,
    right: 0,
    height: 220,
    zIndex: 1000,
    opacity: 0.6,
    borderRadius: BorderRadius.Small
  },
  ratingWrapper: { width: 75, marginTop: MarginSizes.Small }
});
const SCALE = {
  getScaleTransformationStyle(
    animated: Animated.Value,
    startSize: number = 1,
    endSize: number = 0.99
  ) {
    const interpolation = animated.interpolate({
      inputRange: [0, 1],
      outputRange: [startSize, endSize]
    });
    return {
      transform: [{ scale: interpolation }]
    };
  },
  pressInAnimation(animated: Animated.Value, duration: number = 150) {
    animated.setValue(0);
    Animated.timing(animated, {
      toValue: 1,
      duration,
      useNativeDriver: true
    }).start();
  },
  pressOutAnimation(animated: Animated.Value, duration: number = 150) {
    animated.setValue(1);
    Animated.timing(animated, {
      toValue: 0,
      duration,
      useNativeDriver: true
    }).start();
  }
};
