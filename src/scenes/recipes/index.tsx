import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, View, ActivityIndicator } from 'react-native';

import { BottomNavParamList } from '_navigations/router';
import { MyHOCBottomNav } from '_src/components';
import { Header } from '_src/components/Header';
import { HorizontalFlatList } from '_src/components/HorizontalFlatList';
import { Colors } from '_src/utils/enums';
import { RecipeFlatListItem } from '_src/utils/interfaces';
import recipesData from '../../../__mock__/receipes.json';
interface IProps {
  navigation: BottomTabNavigationProp<BottomNavParamList, 'Recipes'>;
}

export const Recipes = (props: IProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const onPressFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      setData(recipesData.data);
    }, 3000);
  }, []);

  const renderItem = (item: RecipeFlatListItem) => {
    const { title, query, items } = item;
    return (
      <HorizontalFlatList
        title={title}
        query={query}
        items={items}
        navigation={props.navigation}
      />
    );
  };
  return (
    <MyHOCBottomNav activeRoute="Recipes" navigation={props.navigation}>
      <Header
        title="Recipes"
        isFavorite={isFavorite}
        navigation={props.navigation}
        onPressFavorite={onPressFavorite}
      />
      <View style={Styles.flatListWrapper}>
        <FlatList
          data={data}
          extraData={data}
          renderItem={({ item, index }) => {
            return renderItem(item);
          }}
          keyExtractor={(item: RecipeFlatListItem, index) => item.title + index}
        />
        {isLoading && (
          <View style={Styles.loading}>
            <ActivityIndicator
              size="large"
              color={Colors.GreenDiet}
              style={{ alignSelf: 'center' }}
            />
          </View>
        )}
      </View>
    </MyHOCBottomNav>
  );
};
const Styles = StyleSheet.create({
  flatListWrapper: { flex: 1, backgroundColor: Colors.White },
  loading: { flex: 1 }
});
