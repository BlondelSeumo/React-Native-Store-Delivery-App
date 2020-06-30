import React from 'react';

import {connect} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Animated,
  Dimensions,
} from 'react-native';
import {Text, SafeAreaView, ThemeConsumer} from 'src/components';
import IconTabbar from './IconTabbar';
import {useTranslation} from 'react-i18next';

import Svg, {Path} from 'react-native-svg';
const AnimatedSvg = Animated.createAnimatedComponent(Svg);

import {homeTabs} from 'src/config/navigator';

import {configsSelector} from 'src/modules/common/selectors';

import {white} from 'src/components/config/colors';
import {padding} from 'src/components/config/spacing';
import * as shape from 'd3-shape';

const {width} = Dimensions.get('window');

const tabWidth = width / 5;
const height = 20;

const getPath = () => {
  const left = shape
    .line()
    .x(d => d.x)
    .y(d => d.y)([{x: 0, y: 0}, {x: width, y: 0}]);
  const tab = shape
    .line()
    .x(d => d.x)
    .y(d => d.y)
    .curve(shape.curveBasis)([
    {x: width, y: 0},

    {x: width + 10, y: 4},
    {x: width + tabWidth / 2, y: 28},
    {x: width + tabWidth - 10, y: 4},

    {x: width + tabWidth, y: 0},
  ]);
  const right = shape
    .line()
    .x(d => d.x)
    .y(d => d.y)([{x: width + tabWidth, y: 0}, {x: width * 2, y: 0}]);
  return `${left} ${tab} ${right}`;
};

const Tabbar = props => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const {configs, state} = props;

  const data = [
    {
      iconName: 'home',
      name: t('common:text_home'),
      router: homeTabs.home_drawer,
      iconProps: {
        type: 'font-awesome-5',
      },
      isShow: true,
    },
    {
      iconName: 'map-marker-alt',
      name: t('common:text_explore'),
      iconProps: {
        type: 'font-awesome-5',
      },
      router: homeTabs.explorer,
      isShow: true,
    },
    {
      iconName: 'shopping-cart',
      nameData: 'cart',
      router: homeTabs.cart,
      isShow: configs.get('toggleCheckout'),
      iconProps: {
        type: 'material',
        size: 22,
      },
    },
    {
      iconName: 'list-alt',
      name: t('common:text_shop'),
      router: homeTabs.shop,
      iconProps: {
        type: 'font-awesome-5',
      },
      isShow: configs.get('toggleWishlist'),
    },
    {
      iconName: 'user',
      name: t('common:text_me'),
      router: homeTabs.me,
      iconProps: {
        size: 20,
        type: 'font-awesome',
      },
      isShow: true,
    },
  ];
  const visit = state.index;

  return (
    <ThemeConsumer>
      {({theme}) => (
        <SafeAreaView
          forceInset={{bottom: 'always'}}
          style={[
            styles.container,
            {backgroundColor: theme.colors.support.bgColor},
          ]}>
          <View style={[styles.content, {top: -height}]}>
            <AnimatedSvg
              width={width * 2}
              height={height}
              style={{transform: [{translateX: -(width / 2) - tabWidth / 2}]}}>
              <Path
                fill={theme.colors.support.bgColor}
                d={getPath(tabWidth)}
                stroke={theme.colors.border}
              />
            </AnimatedSvg>
          </View>
          {data.map((tab, index) =>
            tab.isShow ? (
              <TouchableOpacity
                key={index}
                style={styles.item}
                onPress={() =>
                  navigation.navigate(tab.router, {params: tab.params})
                }>
                <View
                  style={
                    index === 2
                      ? [styles.active, {backgroundColor: theme.colors.primary}]
                      : {}
                  }>
                  <IconTabbar
                    name={tab.iconName}
                    color={
                      index === 2
                        ? white
                        : visit === index
                        ? theme.colors.primary
                        : theme.colors.textColorFourth
                    }
                    nameData={tab.nameData}
                    {...tab.iconProps}
                  />
                  {tab.name ? (
                    <Text
                      h6
                      colorThird={visit !== index}
                      h6Style={[
                        styles.text,
                        visit === index && {
                          color: theme.colors.primary,
                        },
                      ]}>
                      {tab.name}
                    </Text>
                  ) : null}
                </View>
              </TouchableOpacity>
            ) : null,
          )}
        </SafeAreaView>
      )}
    </ThemeConsumer>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  content: {
    position: 'absolute',
    left: 0,
    transform: [{rotateX: '180deg'}],
  },
  item: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: padding.small - 1,
  },
  active: {
    position: 'absolute',
    top: -8,
    width: 45,
    height: 45,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },
  text: {
    marginTop: 5,
  },
});

const mapStateToProps = state => {
  return {
    configs: configsSelector(state),
  };
};

export default connect(mapStateToProps)(Tabbar);
