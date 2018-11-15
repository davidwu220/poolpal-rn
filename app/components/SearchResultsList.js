import React, { Component } from 'react'
import { ListView, FlatList, View, Text, StyleSheet, ScrollView } from 'react-native'

import SearchResultsRow from './SearchResultsRow'

export default class SearchResultsList extends Component {
  render() {
    return (
      <ScrollView
        keyboardShouldPersistTaps={'handled'}
        keyboardDismissMode={'on-drag'}
      >
        {this.props.list.map(({id, title, subtitle, icon}, index) => (
          <View
            key={index}
          >
            <SearchResultsRow
              id={id}
              title={title}
              subtitle={subtitle}
              icon={icon}
              onRowPress={this.props.onRowPress}
            />
            <View style={styles.separator} />
          </View>
        ))}
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    padding: 15,
    marginBottom: 5,
    backgroundColor: 'skyblue',
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: '#EDEDED',
  }
})
