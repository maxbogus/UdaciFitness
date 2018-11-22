import React, {Component} from 'react'
import {Text, View} from 'react-native'
import {connect} from 'react-redux'
import {addEntry, recieveEntries} from "../actions"
import {getDailyReminderValue, timeToString} from "../utils/helpers"
import {fetchCalendarResults} from "../utils/api"
import UdacityFitnessCalendar from 'udacifitness-calendar'

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
        <View>
            {today
                ? <Text>{JSON.stringify(today)}</Text>
                : <Text>{JSON.stringify(metrics)}</Text>}
        </View>
    );

    renderEmptyItem(formattedDate) {
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
                renderEmptyDay={this.renderEmptyItem}
            />
        )
    }
}

function mapStateToProps(entries) {
    return {
        entries
    }
}

export default connect(mapStateToProps)(History)
