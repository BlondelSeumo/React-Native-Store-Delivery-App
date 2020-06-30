// @flow
import React from 'react';

import {connect} from 'react-redux';

import {fetchSettingSuccess} from 'src/modules/common/actions';
import {isLoginSelector} from 'src/modules/auth/selectors';
import {fetchCategories} from 'src/modules/category/actions';
import {isGettingStartSelector} from 'src/modules/common/selectors';
import {fetchSetting} from 'src/modules/common/service';
import {isLogin} from 'src/modules/auth/actions';

type Props = {
  initSetting: Function,
};

class LoadingScreen extends React.Component<Props> {
  componentDidMount() {
    this.bootstrapAsync();
  }

  /**
   * Init data
   * @returns {Promise<void>}
   */
  bootstrapAsync = async () => {
    try {
      const {
        initSetting,
        fetchCategoriesFc,
        isLoginBool,
        isLoginFc,
      } = this.props;

      // Fetch setting
      let settings = await fetchSetting();
      const {configs, templates, ...rest} = settings;

      // Fetch categories in background
      fetchCategoriesFc();

      // Check user token
      if (isLoginBool) {
        isLoginFc();
      }

      initSetting({
        settings: rest,
        configs: configs,
        templates: templates,
      });
    } catch (e) {
      console.log('error fetchSetting', e);
      console.error(e);
    }
  };

  render() {
    return null;
  }
}

const mapStateToProps = state => {
  return {
    isGettingStart: isGettingStartSelector(state),
    isLoginBool: isLoginSelector(state),
  };
};

const mapDispatchToProps = {
  initSetting: fetchSettingSuccess,
  fetchCategoriesFc: fetchCategories,
  isLoginFc: isLogin,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoadingScreen);
