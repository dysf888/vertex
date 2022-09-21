const util = require('../util');

class Site {
  constructor () {
    this.name = 'DICMusic';
  };

  async getInfo () {
    const info = {};
    const document = await this._getDocument('https://dicmusic.club/user.php', false, 10);
    // 用户名
    info.username = document.querySelector('a[href^="user.php"]').innerHTML;
    // uid
    info.uid = document.querySelector('a[href^="torrents.php?type=seeding&userid="]').href.match(/userid=(\d+)/)[1];
    // 上传
    info.upload = document.querySelector('a[href^="torrents.php?type=seeding&userid="]').nextElementSibling.innerHTML.trim().replace(/(\w)B/, '$1iB');
    info.upload = util.calSize(...info.upload.split(' '));
    // 下载
    info.download = document.querySelector('a[href^="torrents.php?type=leeching&userid="]').nextElementSibling.innerHTML.trim().replace(/(\w)B/, '$1iB');
    info.download = util.calSize(...info.download.split(' '));

    // ajax
    const { body: stats } = await util.requestPromise({
      url: 'https://dicmusic.club/ajax.php?action=community_stats&userid=' + info.uid,
      headers: {
        cookie: this.cookie
      }
    });
    const statsJson = JSON.parse(stats);
    // 做种
    info.seeding = statsJson.response.seeding;
    // 下载
    info.leeching = statsJson.response.leeching;
    return info;
  };
};
module.exports = Site;