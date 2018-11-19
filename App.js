import React from 'react'
import {View} from 'react-native'
import {Provider} from 'react-redux'
import {createStore} from 'redux'

import AddEntry from './components/AddEntry'
import reducer from './reducers'

const store = createStore(reducer);

export default class App extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <View style={{flex: 1}}>
                    <AddEntry/>
                </View>
            </Provider>
        );
    }
}
