import {Foundation} from '@expo/vector-icons'
import {Location, Permissions} from 'expo'
import React, {Component} from 'react'
import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from 'react-native'

import {purple, white} from "../utils/colors"
import {calculateDirection} from "../utils/helpers"

const styles = StyleSheet.create({
    button: {
        padding: 10,
        backgroundColor: purple,
        alignSelf: 'center',
        borderRadius: 5,
        margin: 20,
    },
    buttonText: {
        color: white,
        fontSize: 20,
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
        justifyContent: 'space-between'
    },
    direction: {
        color: purple,
        fontSize: 120,
        textAlign: 'center',
    },
    directionContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    header: {
        fontSize: 35,
        textAlign: 'center',
    },
    metric: {
        flex: 1,
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 10,
        marginRight: 10,
    },
    metricContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: purple,
    },
    subHeader: {
        fontSize: 25,
        textAlign: 'center',
        marginTop: 5,
    },
});

export default class Live extends Component {
    state = {
        coords: null,
        status: 'granted',
        direction: '',
    };

    askPermission = () => {
        Permissions.askAsync(Permissions.LOCATION)
            .then(({status}) => {
                if (status === 'granted') {
                    return this.setLocation()
                }

                this.setState(() => ({status}))
            })
            .catch((error) => console.warn('error asking Location permission: ', error))
    };

    componentDidMount() {
        Permissions.getAsync(Permissions.LOCATION)
            .then(({status}) => {
                if (status === 'granted') {
                    return this.setLocation()
                }

                this.setState(() => ({status}))
            })
            .catch((error) => {
                console.warn('Error getting location permission: ', error);

                this.setState(() => ({status: 'undetermined'}))
            })
    }

    setLocation = () => {
        Location.watchPositionAsync({
            enableHighAccuracy: true,
            timeInterval: 1,
            distanceInterval: 1,
        }, ({coords}) => {
            const newDirection = calculateDirection(coords.heading);
            const {direction} = this.state;

            this.setState(() => ({
                coords,
                status: 'granted',
                direction: newDirection,
            }))
        })
    };

    render() {
        const {status, coords, direction} = this.state;

        if (status === null) {
            return <ActivityIndicator style={{marginTop: 30}}/>
        }

        if (status === 'denied') {
            return (
                <View style={styles.center}>
                    <Foundation name='alert' size={50}/>
                    <Text>You denied your location. You can fix this by visiting your settings and enabling location
                        services.</Text>
                </View>
            )
        }

        if (status === 'undetermined') {
            return (
                <View style={styles.center}>
                    <Foundation name='alert' size={50}/>
                    <Text>You need to enable location services for this app.</Text>
                    <TouchableOpacity onPress={this.askPermission} style={styles.button}>
                        <Text style={styles.buttonText}>
                            Enable
                        </Text>
                    </TouchableOpacity>
                </View>
            )
        }

        return (
            <View style={styles.container}>
                <View style={styles.directionContainer}>
                    <Text style={styles.header}>You're heading</Text>
                    <Text style={styles.direction}>North</Text>
                </View>
                <View style={styles.metricContainer}>
                    <View style={styles.metric}>
                        <Text style={[styles.header, {color: white}]}>
                            Altitude
                        </Text>
                        <Text style={[styles.subHeader, {color: white}]}>
                            {200} feet
                        </Text>
                    </View>
                    <View style={styles.metric}>
                        <Text style={[styles.header, {color: white}]}>
                            Speed
                        </Text>
                        <Text style={[styles.subHeader, {color: white}]}>
                            {300} MPH
                        </Text>
                    </View>
                </View>
            </View>
        )
    }
}
