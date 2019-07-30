import { createSwitchNavigator, createAppContainer, createStackNavigator} from 'react-navigation';
import AuthLoadingScreen from './src/authLoadingScreen';
import LoginScreen from './src/loginScreen';
import HomeScreen from './src/homeScreen';
import BookingScreen from './src/bookingScreen';
const AuthStack = createStackNavigator({ SignIn: LoginScreen });
const AppStack = createStackNavigator(
  { HomeScreen: HomeScreen, BookingScreen: BookingScreen },
  { headerMode: 'none',}
);

export default createAppContainer(createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      Auth: AuthStack,
      App: AppStack
    }, 
    {
      initialRouteName: 'AuthLoading',
    }
));