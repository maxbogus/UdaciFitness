import React from 'react'
import {View, Platform} from 'react-native'
import {createAppContainer, createBottomTabNavigator} from 'react-navigation'
import {Provider} from 'react-redux'
import {createStore} from 'redux'
import {FontAwesome, Ionicons} from '@expo/vector-icons'

import AddEntry from './components/AddEntry'
import {purple, white} from "./utils/colors"
import History from "./components/History"
import reducer from './reducers'

const store = createStore(reducer);
const Tabs = createBottomTabNavigator({
    History: {
        screen: History,
        navigationOptions: {
            tabBarLevel: 'History',
            tabBarIcon: ({tintColor}) => <Ionicons name='ios-bookmarks' size={30} color={tintColor}/>
        }
    },
    AddEntry: {
        screen: AddEntry,
        navigationOptions: {
            tabBarLevel: 'Add Entry',
            tabBarIcon: ({tintColor}) => <FontAwesome name='plus-square' size={30} color={tintColor}/>
        }
    }
}, {
    tabBarOptions: {
        activeTintColor: Platform.OS === 'ios' ? purple : white,
        style: {
            height: 56,
            backgroundColor: Platform.OS === 'ios' ? white : purple,
            shadowColor: 'rgba(0, 0, 0, 0.24)',
            shadowOffset: {
                width: 0,
                height: 3
            },
            shadowRadius: 6,
            shadowOpacity: 1,
        }
    }
});
const Container = createAppContainer(Tabs);

export default class App extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <View style={{flex: 1}}>
                <View style={{height: 20}}/>
                    <Container/>
                </View>
            </Provider>
        );
    }
}
