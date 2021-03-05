import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Platform,
  Dimensions,
  Animated,
  Text
} from 'react-native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { BottomNavParamList } from '_navigations/router';
import { Colors } from '_src/utils/enums';

type FooterMenuItem = MenuItem & { path: keyof BottomNavParamList };

type Props = {
  navigation: BottomTabNavigationProp<
    BottomNavParamList,
    keyof BottomNavParamList
  >;
  activeRoute: keyof BottomNavParamList;
  showAlertBox?: (msg: string) => void;
};

type State = {};

const { width } = Dimensions.get('window');

const menuItems = [
  {
    type: 'route',
    title: 'Recipes',
    path: 'Recipes'
  },
  {
    type: 'route',
    title: 'Meals',
    path: 'Meals'
  },
  {
    type: 'route',
    title: 'Shopping List',
    path: 'ShoppingList'
  },
  {
    type: 'route',
    title: 'More',
    path: 'More'
  }
];

class FooterMenu extends PureComponent<Props, State> {
  flatList = React.createRef<FlatList<any>>();

  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  onPressItem = (item: FooterMenuItem) => {
    const { navigation } = this.props;
    if (item.type == 'route') {
      return navigation.navigate(item.path);
    }
  };

  renderItem = ({ item }: { item: FooterMenuItem }) => {
    const { activeRoute } = this.props;
    const isActive = activeRoute == item.path;
    const fontSize = item.title.length > 10 ? 10 : 12;
    return (
      <TouchableOpacity
        onPress={() => this.onPressItem(item)}
        disabled={isActive}
        activeOpacity={0.7}
      >
        <View style={styles.menuItem}>
          <Text
            style={[
              styles.menuItemText,
              { color: isActive ? Colors.GreenDiet : '#A7B3C1' },
              { fontSize }
            ]}
          >
            {item.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          horizontal
          data={menuItems}
          ref={this.flatList}
          extraData={menuItems}
          scrollEnabled={menuItems.length > 5}
          renderItem={this.renderItem}
          keyExtractor={(item) => item.title}
          contentContainerStyle={styles.flatList}
        />
      </View>
    );
  }
}

export default FooterMenu;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderColor: '#eee',
    margin: -1,
    marginTop: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10
  },
  flatList: {
    flexGrow: 1,
    justifyContent: 'space-around'
  },
  menuItem: {
    width: width * 0.21,
    paddingVertical: 10,
    paddingHorizontal: 7,
    alignItems: 'center'
  },
  menuItemText: {
    marginTop: Platform.OS == 'ios' ? 5 : 2
  },
  submenuContiner: {
    width: width + 2,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    margin: -1,
    bottom: 0,
    position: 'absolute',
    overflow: 'hidden'
  },
  menuBtnItemContainer: {
    width: width * 0.16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  menuBtnItem: {
    width: width * 0.14,
    height: width * 0.14,
    maxWidth: 80,
    maxHeight: 80,
    borderWidth: 0,
    backgroundColor: '#0757ff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10
  },
  linearGradient: {
    flex: 1,
    paddingBottom: 80,
    paddingTop: 10,
    paddingHorizontal: 20,
    flexDirection: 'row-reverse',
    justifyContent: 'space-around'
  }
});
