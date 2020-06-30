import React from 'react';
import includes from 'lodash/includes';
import {useTranslation} from 'react-i18next';
import {View, StyleSheet} from 'react-native';
import {Text} from 'src/components';
import ViewUnderline from 'src/containers/ViewUnderline';

import {margin, padding} from 'src/components/config/spacing';

const days = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const TimeStore = props => {
  const {storeHours} = props;
  const dataOffDay = storeHours?.off_days ?? [];
  const dataTimeDay = storeHours?.day_times ?? [];
  const {t} = useTranslation();
  return (
    <ViewUnderline style={styles.container}>
      <View style={styles.viewContent}>
        <Text medium h4 style={styles.textContent}>
          {t('catalog:text_time_store')}
        </Text>
        <View style={styles.listTime}>
          {days.map((day, index) => {
            const isOffday = includes(dataOffDay, index.toString());
            const dataTimeOfDay = dataTimeDay[index] || [];
            const start = dataTimeOfDay[0] ? dataTimeOfDay[0].start : '';
            const end = dataTimeOfDay[0] ? dataTimeOfDay[0].end : '';
            const time = `${start}-${end}`;
            return (
              <View
                key={index}
                style={[
                  styles.viewTime,
                  index === days.length - 1 && styles.viewTimeLast,
                ]}>
                <Text style={styles.textDay} colorThird>
                  {t(`days:text_${day}`)}
                </Text>
                <Text style={styles.textTime} colorThird>
                  {isOffday ? t('days:text_off_day') : time}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </ViewUnderline>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: padding.big,
    paddingBottom: padding.big,
  },
  viewContent: {
    flexDirection: 'row',
  },
  textContent: {
    flex: 1,
  },
  listTime: {
    marginTop: 3,
  },
  viewTime: {
    flexDirection: 'row',
    marginBottom: margin.small,
  },
  viewTimeLast: {
    marginBottom: 0,
  },
  textDay: {
    width: 90,
  },
  textTime: {
    marginLeft: margin.small,
  },
});
export default TimeStore;
