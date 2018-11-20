import {Ionicons} from '@expo/vector-icons'
import React, {Component} from 'react'
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {connect} from 'react-redux'

import {addEntry} from "../actions";
import DataHeader from './DataHeader'
import TextButton from './TextButton'
import UdaciSlider from './UdaciSlider'
import UdaciSteppers from './UdaciSteppers'
import {removeEntry, submitEntry} from '../utils/api'
import {purple, white} from "../utils/colors"
import {getDailyReminderValue, getMetricMetaInfo, timeToString} from '../utils/helpers'

function SubmitBtn({onPress}) {
    return (
        <TouchableOpacity
            style={Platform.OS === 'ios' ? styles.iosSubmitBtn : styles.androidSubmitBtn}
            onPress={onPress}>
            <Text styles={styles.submitBtnText}>SUBMIT</Text>
        </TouchableOpacity>
    )
}

class AddEntry extends Component {
    state = {
        run: 0,
        bike: 0,
        swim: 0,
        sleep: 0,
        eat: 0,
    };

    increment = (metric) => {
        const {max, step} = getMetricMetaInfo(metric);

        this.setState((state) => {
            const count = state[metric] + step;

            return {
                ...state,
                [metric]: count > max ? max : count
            }
        })
    };

    decrement = (metric) => {
        this.setState((state) => {
            const count = state[metric] - getMetricMetaInfo(metric).step;

            return {
                ...state,
                [metric]: count < 0 ? 0 : count
            }
        })
    };

    slide = (metric, value) => {
        this.setState(() => ({
            [metric]: value
        }))
    };

    submit = () => {
        const key = timeToString();
        const entry = this.state;

        this.props.dispatch(addEntry({
            [key]: entry
        }));

        this.setState(() => ({
            run: 0,
            bike: 0,
            swim: 0,
            sleep: 0,
            eat: 0,
        }));

        // Navigate to Home

        submitEntry({key, entry})

        // Clear local notification
    };

    reset = () => {
        const key = timeToString();

        this.props.dispatch(addEntry({
            [key]: getDailyReminderValue()
        }));

        // Route to Home

        removeEntry({key})
    };

    render() {
        const metaInfo = getMetricMetaInfo();

        if (this.props.alreadyLogged) {
            return (
                <View style={styles.center}>
                    <Ionicons name='ios-happy' size={100}/>
                    <Text>You already logged your information for today</Text>
                    <TextButton onPress={this.reset}>
                        Reset
                    </TextButton>
                </View>
            )
        }

        return (
            <View style={styles.container}>
                <DataHeader date={new Date().toLocaleDateString()}/>
                {Object.keys(metaInfo).map((key) => {
                    const {getIcon, type, ...rest} = metaInfo[key];
                    const value = this.state[key];

                    return (
                        <View key={key} style={styles.row}>
                            {getIcon()}
                            {type === 'slider'
                                ? <UdaciSlider
                                    value={value}
                                    onChange={(value) => this.slide(key, value)}
                                    {...rest}
                                />
                                : <UdaciSteppers
                                    value={value}
                                    onIncrement={() => this.increment(key)}
                                    onDecrement={() => this.decrement(key)}
                                    {...rest}
                                />}
                        </View>
                    )
                })}
                <SubmitBtn onPress={this.submit}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    androidSubmitBtn: {
        backgroundColor: purple,
        padding: 10,
        paddingRight: 30,
        paddingLeft: 30,
        height: 45,
        borderRadius: 2,
        alignSelf: 'flex-end',
        justifyContent: 'center',
        alignItems: 'center',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 30,
        marginRight: 30,
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: white,
    },
    iosSubmitBtn: {
        backgroundColor: purple,
        padding: 10,
        borderRadius: 7,
        height: 45,
        marginRight: 40,
        marginLeft: 40,
    },
    row: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
    },
    submitBtnText: {
        color: white,
        fontSize: 22,
        textAlign: 'center'
    }
});

function mapStateToProps(state) {
    const key = timeToString();

    return {
        alreadyLogged: state[key] && state[key].today === undefined
    }
}

export default connect(mapStateToProps)(AddEntry)
