module.exports.load = function (path, success, failure) {
  var request = new XMLHttpRequest();
  request.open('GET', path, true);
  request.responseType = 'arraybuffer';
  request.onload = function () {
    context.decodeAudioData(request.response, success, failure);
  };
  request.onerror = failure;
  request.send();
};