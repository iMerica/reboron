import modalFactory from './modalFactory';
import { css } from 'emotion';

const animation = {
    showAnimation: {
        duration: '0.3s',
        timingFunction: 'ease-out',
    },
    hideAnimation: {
        duration: '0.3s',
        timingFunction: 'ease-out',
    },
    showContentAnimation: css`
        @keyframes showContentAnimation {
            0%: {
                opacity: 0;
            }
            100%: {
                opacity: 1;
            }
        }
    `,
    hideContentAnimation: css`
        @keyframes hideContentAnimation {
            0%: {
                opacity: 1;
            }
            100%: {
                opacity: 0;
            }
        }
    `,
    showBackdropAnimation: css`
        @keyframes showBackdropAnimation {
            0%: {
                opacity: 0;
            }
            100%: {
                opacity: 0.9;
            }
        }
    `,
    hideBackdropAnimation: css`
        @keyframes hideBackdropAnimation {
            0%: {
                opacity: 0.9;
            }
            100%: {
                opacity: 0;
            }
        }
    `,
};

const showAnimation = animation.showAnimation;
const hideAnimation = animation.hideAnimation;
const showContentAnimation = animation.showContentAnimation;
const hideContentAnimation = animation.hideContentAnimation;
const showBackdropAnimation = animation.showBackdropAnimation;
const hideBackdropAnimation = animation.hideBackdropAnimation;

export default modalFactory({
    getRef: () => {
        return 'content';
    },
    getModalStyle: () => {
        return css`
            z-index: 1050;
            position: fixed;
            width: 500px;
            transform: translate3d(-50%, -50%, 0);
            top: 50%;
            left: 50%;
        `;
    },
    getBackdropStyle: (closing) => {
        return css`
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: 1040;
            background-color: #373A47;
            animation-fill-mode: forwards;
            animation-duration: ${closing ? hideAnimation.duration : showAnimation.duration};
            animation-name: ${closing ? hideBackdropAnimation : showBackdropAnimation};
            animation-timing-function: ${closing ? hideAnimation.timingFunction : showAnimation.timingFunction};
        `;
    },
    getContentStyle: (closing) => {
        return css`
            margin: 0;
            background-color: white;
            animation-duration: ${closing ? hideAnimation.duration : showAnimation.duration};
            animation-fill-mode: forwards;
            animation-name: ${closing ? hideContentAnimation : showContentAnimation};
            animation-timing-function: ${closing ? hideAnimation.timingFunction : showAnimation.timingFunction};
        `;
    },
});
