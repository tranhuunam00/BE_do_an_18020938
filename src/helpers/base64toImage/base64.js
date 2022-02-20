const fs = require("fs");
const Jimp = require("jimp");

const encode = (file) => {
  output = Date.now() + "output.txt";
  var img = fs.readFileSync(file.path);
  var encode_image = img.toString("base64");
  console.log(encode_image[0]);
  fs.writeFileSync(
    path.join(__dirname, `../public/textBase64img/${output}`),
    encode_image
  );
  return encode_image;
};

const decode = (file) => {
  const base64code = fs.readFileSync(path.join(__dirname, `../${file.path}`));
  const data = base64code.toString();
  const buffer = Buffer.from(data, "base64");
  const a = Jimp.read(buffer, (err, res) => {
    if (err) throw new Error(err);
    res.quality(5).write("resized.jpg");
  });
};

module.exports = { encode, decode };
