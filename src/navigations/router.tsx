export type InitStackParamList = {
  DeveloperScreen: undefined;
  InitApp?: { devMode?: 'DEVELOPMENT' | 'PRODUCTION' };
  AppNavigator: undefined;
};

export const BottomRouteNames = ['Recipes', 'Meals', 'ShoppingList', 'More'];

export type BottomNavParamList = {
  AppStack: {
    screen?: keyof RootStackParamList;
    params?: { [k: string]: any };
  };
  Recipes: undefined;
  Meals: undefined;
  ShoppingList: undefined;
  More: undefined;
};

export type RootStackParamList = {
  Bottom: {
    screen?: keyof BottomNavParamList;
    params?: { [k: string]: any };
  };
};

export const ValidRouteNames = [...BottomRouteNames];
