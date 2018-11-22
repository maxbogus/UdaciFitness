import React, {Component} from 'react'
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {connect} from 'react-redux'
import UdacityFitnessCalendar from 'udacifitness-calendar'

import {addEntry, recieveEntries} from "../actions"
import {fetchCalendarResults} from "../utils/api"
import {white} from "../utils/colors"
import {getDailyReminderValue, timeToString} from "../utils/helpers"
import DateHeader from './DataHeader'

class History extends Component {
    componentDidMount() {
        const {dispatch} = this.props;
        fetchCalendarResults()
            .then((entries) => dispatch(recieveEntries(entries)))
            .then(({entries}) => {
                if (!entries[timeToString()]) {
                    dispatch(addEntry({
                        [timeToString()]: getDailyReminderValue()
                    }))
                }
            })
    }

    renderItem = ({today, ...metrics}, formattedDate, key) => (
        <View style={styles.item}>
            {today
                ? <View>
                    <DateHeader date={formattedDate}/>
                    <Text style={styles.noDataText}>
                        {today}
                    </Text>
                </View>
                : <TouchableOpacity onPress={() => console.log('Pressed!')}>
                    <Text>{JSON.stringify(metrics)}</Text>
                </TouchableOpacity>}
        </View>
    );

    static renderEmptyItem(formattedDate) {
        return (
            <View>
                <Text>No data for this date</Text>
            </View>
        )
    };

    render() {
        const {entries} = this.props;

        return (
            <UdacityFitnessCalendar
                items={entries}
                renderItem={this.renderItem}
                renderEmptyDay={History.renderEmptyItem}
            />
        )
    }
}

const styles = StyleSheet.create({
    item: {
        backgroundColor: white,
        borderRadius: Platform.OS === 'ios' ? 16 : 2,
        padding: 20,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 17,
        justifyContent: 'center',
        shadowRadius: 3,
        shadowOpacity: 0.8,
        shadowColor: 'rgba(0,0,0,0.24)',
        shadowOffset: {
            width: 0,
            height: 3,
        }
    }
});

function mapStateToProps(entries) {
    return {
        entries
    }
}

export default connect(mapStateToProps)(History)
