import React from 'react';
import {connect} from 'react-redux';

import {getStatusBarHeight} from 'react-native-status-bar-height';
import {useTranslation} from 'react-i18next';
import {StyleSheet, ScrollView} from 'react-native';
import {ThemedView, Text, ListItem} from 'src/components';
import ItemCategoryMenu from './ItemCategoryMenu';

import {categorySelector} from 'src/modules/category/selectors';
import {configsSelector, languageSelector} from 'src/modules/common/selectors';

import {padding, margin} from 'src/components/config/spacing';

import {mainStack, homeTabs} from 'src/config/navigator';
import {excludeCategory} from '../utils/category';
import {exclude_categories_sidebar} from 'src/config/category';
import {DrawerActions} from '@react-navigation/compat';

const Sidebar = props => {
  const {t} = useTranslation();
  const {category, configs, language, navigation} = props;
  const handlePage = (router, params = {}) => {
    if (!navigation) {
      return null;
    }
    navigation.dispatch(DrawerActions.closeDrawer());
    navigation.navigate(router, params);
  };
  const dataHelpInfo = [
    {
      id: '1',
      name: t('common:text_home'),
      router: homeTabs.home_drawer,
    },
    {
      id: '2',
      name: t('common:text_blogs'),
      router: mainStack.blogs,
    },
    {
      id: '3',
      name: t('common:text_about'),
      router: mainStack.page,
      params: {
        type: 'page',
        id: configs.getIn(['about', language]),
      },
    },
    {
      id: '4',
      name: t('profile:text_term'),
      router: mainStack.page,
      params: {
        type: 'page',
        id: configs.getIn(['term', language]),
      },
    },
    {
      id: '5',
      name: t('common:text_privacy_full'),
      router: mainStack.page,
      params: {
        type: 'page',
        id: configs.getIn(['policy', language]),
      },
    },
    {
      id: '6',
      name: 'common:text_contact',
      router: mainStack.contact,
    },
  ];

  const {data} = category;
  // Filter include category
  const _data = excludeCategory(data, exclude_categories_sidebar);

  return (
    <ThemedView isFullView>
      <ScrollView>
        <Text h3 medium style={[styles.title, styles.titleHead]}>
          {t('common:text_category')}
        </Text>
        {_data.map(c => (
          <ItemCategoryMenu
            key={c.id}
            category={c}
            isOpen={
              navigation.state && navigation.state.isDrawerOpen
                ? navigation.state.isDrawerOpen
                : false
            }
            goProducts={params => handlePage(mainStack.products, params)}
          />
        ))}
        <Text h3 medium style={styles.title}>
          {t('common:text_help')}
        </Text>
        {dataHelpInfo.map(value => (
          <ListItem
            key={value.id}
            title={t(value.name)}
            titleProps={{
              medium: true,
            }}
            type="underline"
            small
            containerStyle={styles.item}
            onPress={() => handlePage(value.router, value.params)}
          />
        ))}
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  title: {
    marginTop: margin.big + 4,
    marginBottom: margin.small + 1,
    paddingHorizontal: padding.large,
  },
  titleHead: {
    paddingTop: getStatusBarHeight(),
  },
  item: {
    paddingHorizontal: padding.large,
  },
});

const mapStateToProps = state => ({
  category: categorySelector(state),
  configs: configsSelector(state),
  language: languageSelector(state),
});
export default connect(mapStateToProps)(Sidebar);
