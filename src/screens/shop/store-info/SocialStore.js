import React from 'react';
import toArray from 'lodash/toArray';
import isURL from 'validator/lib/isURL';
import {Linking, StyleSheet} from 'react-native';

import SocialIcon from 'src/containers/SocialIcon';
import ViewUnderline from 'src/containers/ViewUnderline';

import {margin, padding} from 'src/components/config/spacing';

const typeSocial = {
  fb: 'facebook',
  gplus: 'google-plus-official',
  youtube: 'youtube',
  twitter: 'twitter',
  linkedin: 'linkedin',
  pinterest: 'pinterest',
  instagram: 'instagram',
  flickr: 'flickr',
};

const SocialStore = props => {
  const {socials} = props;
  if (!socials) {
    return null;
  }
  const arrSocial = toArray(socials).filter(s =>
    isURL(s, {require_protocol: true}),
  );

  if (!arrSocial || arrSocial.length < 1) {
    return null;
  }

  return (
    <ViewUnderline style={styles.container}>
      {Object.keys(typeSocial).map((key, index) =>
        socials[key] ? (
          <SocialIcon
            key={key}
            light
            raised={false}
            type={typeSocial[key]}
            style={styles.socialIconStyle}
            iconSize={15}
            onPress={() => Linking.openURL(socials[key])}
          />
        ) : null,
      )}
    </ViewUnderline>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingTop: padding.large + 4,
    paddingBottom: 36,
    borderBottomWidth: 0,
  },
  socialIconStyle: {
    width: 32,
    height: 32,
    margin: 0,
    marginHorizontal: margin.small / 2,
    paddingTop: 0,
    paddingBottom: 0,
  },
});
export default SocialStore;
