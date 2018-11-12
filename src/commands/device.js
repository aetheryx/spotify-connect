const { LinkedCommand } = require('@sc/models');
const { SpotifyPlayer } = require('@sc/rest');

module.exports = class DevicesCommand extends LinkedCommand {
  constructor (main) {
    super(main, {
      description: 'Lists all of your devices running Spotify and lets you switch to one.',
      usage: '{c} [ select | list ] [ deviceName ]',
      examples: [ '{c} list', '{c} select iPhone', '{c} select ChromeCast' ],
      triggers: [ 'devices', 'device' ],
      order: 12
    });
  }

  async execute (link, msg, args) {
    const { devices } = await SpotifyPlayer.getDevices(link);
    if (!devices[0]) {
      return 'I was unable to find any devices that are running Spotify on this account.';
    }

    const devicesAsFields = devices.map(device => ({
      name: device.name,
      value: `Playing: ${device.is_active ? '☑' : '❌'}\nType: ${device.type}\nVolume: \`${device.volume_percent}%\``
    }));

    switch (args.shift()) {
      case 'select':
        const deviceName = args.join(' ').toLowerCase();
        if (!deviceName) {
          return 'You have to specify a device name.';
        }

        const device = devices.find(device => device.name.toLowerCase().includes(deviceName));
        if (!device) {
          return {
            description: 'I was unable to find a device with that name.\nHere\'s a list of the devices you have running:',
            fields: devicesAsFields
          };
        }

        await SpotifyPlayer.setActiveDevice(link, device.id);
        return `I successfully set your active device to \`${device.name}\`.`;

      case undefined:
      case 'list':
        return {
          title: `${devices.length} devices found`,
          fields: devicesAsFields
        };

      default:
        return 'blah blah invalid subcommand blah blah';
    }
  }
};
