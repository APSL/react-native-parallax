/**
 * @providesModule ParallaxComposition
 */
'use strict';

var isArray = require('lodash/lang/isArray');
var React = require('react-native');
var {
  Animated,
  ScrollView
} = React;

var ParallaxImage = require('./ParallaxImage');

var applyPropsToParallaxImages = function(children, props) {
  if(isArray(children)) {
    return children.map(child => {
      if(isArray(child)) {
        return applyPropsToParallaxImages(child, props);
      }
      if(child.type === ParallaxImage) {
        return React.cloneElement(child, props);
      }
      return child;
    });
  }
  if(children.type === ParallaxImage) {
    return React.cloneElement(children, props);
  }
  return children;
};


var ParallaxScrollViewComposition = React.createClass({
  propTypes: {
    scrollViewComponent: React.PropTypes.func,
  },

  setNativeProps: function(nativeProps) {
    this._root.setNativeProps(nativeProps);
  },

  componentWillMount: function() {
    var scrollY = new Animated.Value(0);
    this.setState({ scrollY });
    this.onParallaxScroll = Animated.event(
      [{nativeEvent: {contentOffset: {y: scrollY}}}]
    );
  },

  render: function() {
    var { children, imageNestLevel, scrollViewComponent, ...props } = this.props;
    var { scrollY } = this.state;
    var ScrollComponent = scrollViewComponent || ScrollView;
    children = children && applyPropsToParallaxImages(children, { scrollY });
    return (
      <ScrollComponent
        ref={component => this._root = component}
        scrollEventThrottle={16}
        onScroll={this.onParallaxScroll}
        {...props}
      >
        {children}
      </ScrollComponent>
    );
  }
});

module.exports = ParallaxScrollViewComposition;
