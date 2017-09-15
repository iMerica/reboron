import React, { Component } from 'react';
import transitionEvents from 'domkit/transitionEvents';
import PropTypes from 'prop-types';
import { css } from 'emotion';

export default (animation) => {
    class Factory extends Component {
        constructor(props) {
            super(props);
            this.state = {
                closing: false,
                visible: false,
            };

            this.handleBackdropClick = this.handleBackdropClick.bind(this);
            this.leave = this.leave.bind(this);
            this.enter = this.enter.bind(this);
            this.show = this.show.bind(this);
            this.hide = this.hide.bind(this);
            this.toggle = this.toggle.bind(this);
            this.listenKeyboard = this.listenKeyboard.bind(this);
        };

        addTransitionListener(node, handle) {
            if (node) {
                const endListener = (e) => {
                    if (e && e.target !== node) {
                        return;
                    }
                    transitionEvents.removeEndEventListener(node, endListener);
                    handle();
                };
                transitionEvents.addEndEventListener(node, endListener);
            }
        };

        handleBackdropClick() {
            if (this.props.closeOnClick) {
                this.hide();
            }
        };

        render() {
            if (!this.state.visible) {
                return null;
            }

            const closing = this.state.closing;
            const animation = this.props.animation;
            const ref = animation.getRef(closing);
            const sharp = animation.getSharp && animation.getSharp(closing, this.props.rectStyle);

            // Apply custom style properties
            let modalStyle = animation.getModalStyle(closing);
            if (this.props.modalStyle) {
                modalStyle = css`
                    composes: ${modalStyle};
                    ${this.props.modalStyle}
                `;
            }

            let backdropStyle = animation.getBackdropStyle(closing);
            if (this.props.backdropStyle) {
                backdropStyle = css`
                    composes: ${backdropStyle};
                    ${this.props.backdropStyle}
                `;
            }

            let contentStyle = animation.getContentStyle(closing);
            if (this.props.contentStyle) {
                contentStyle = css`
                    composes: ${contentStyle};
                    ${this.props.contentStyle}
                `;
            }

            const backdrop = this.props.backdrop ? (
                <div className={ backdropStyle }
                     onClick={ this.props.closeOnClick ? this.handleBackdropClick : null }>
                </div>
             ) : undefined;

            if (closing) {
                const node = this.refs[ref];
                this.addTransitionListener(node, this.leave);
            }

            return (
                <span>
                    <div ref={ 'modal' }
                         className={ `${modalStyle} ${this.props.className ? this.props.className : ''}` }>
                        { sharp }
                        <div ref={ 'content' }
                             className={ contentStyle }
                             tabIndex={ '-1' }>
                            { this.props.children }
                        </div>
                    </div>
                    { backdrop }
                </span>
            );
        };

        leave() {
            this.setState({
                visible: false,
            });
            this.props.onHide();
        };

        enter() {
            this.props.onShow();
        };

        show() {
            if (this.state.visible) {
                return;
            }

            this.setState({
                closing: false,
                visible: true,
            });

            setTimeout(function(){
                const ref = this.props.animation.getRef();
                const node = this.refs[ref];
                this.addTransitionListener(node, this.enter);
            }.bind(this), 0);
        };

        hide() {
            if (!this.state.visible) {
                return;
            }

            this.setState({
                closing: true,
            });
        };

        toggle() {
            if (this.state.visible) {
                this.hide();
            } else {
                this.show();
            }
        };

        listenKeyboard(event) {
            if (this.props.keyboard && (event.key === 'Escape' || event.keyCode === 27)) {
                this.hide();
            }
        };

        componentDidMount() {
            window.addEventListener('keydown', this.listenKeyboard, true);
        };

        componentWillUnmount()  {
            window.removeEventListener('keydown', this.listenKeyboard, true);
        };
    };

    Factory.propTypes = {
        className: PropTypes.string,
        keyboard: PropTypes.bool,
        onShow: PropTypes.func,
        onHide: PropTypes.func,
        animation: PropTypes.object,
        backdrop: PropTypes.bool,
        closeOnClick: PropTypes.bool,
        modalStyle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        backdropStyle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        contentStyle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    };

    Factory.defaultProps = {
        className: '',
        onShow: function(){},
        onHide: function(){},
        animation: animation,
        keyboard: true,
        backdrop: true,
        closeOnClick: true,
        modalStyle: {},
        backdropStyle: {},
        contentStyle: {},
    };

    return Factory;
};
