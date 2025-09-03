// behaviors/share.js
const share = require('../utils/share.js');

// Shared title for all share targets
const SHARE_TITLE = '重要的日子，正在靠近';

/**
 * Share behavior for WeChat Mini Program
 * Provides common share functionality across all pages
 */
const shareBehavior = Behavior({
  /**
   * Called when user clicks on the top right corner to share
   */
  methods: {
    onShareAppMessage() {
      const shareUrl = share.getSharePath('pages/home/home');
      
      return {
        title: SHARE_TITLE,
        path: shareUrl,
      };
    },

    /**
     * Called when user shares to WeChat Moments (Timeline)
     */
    onShareTimeline() {
      return {
        title: SHARE_TITLE
      };
    }
  }
});

module.exports = shareBehavior;
