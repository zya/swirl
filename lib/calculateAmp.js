module.exports = function (audioArray) {
  var total = 0;
  for (var i = 3; i < audioArray.length - audioArray.length / 3; i += 2) {
    total += audioArray[i];
  }
  var avg = total / (audioArray.length / 3);
  return avg;
};