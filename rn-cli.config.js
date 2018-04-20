module.exports = {
  extraNodeModules: {
    // Required by NodeRSA
    ...require('node-libs-react-native'),
    vm: require.resolve('vm-browserify')
  }
};
