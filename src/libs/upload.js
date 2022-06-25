import imageCompression from 'browser-image-compression';
import OSS from 'ali-oss';
import api from '@/api';
const uuid = require('uuid');
/**
 * @param {string} path 图片路径
 */
const getSize = (path) => {
  return new Promise((resolve, reject) => {
    let image = new Image();
    image.onload = function () {
      const width = image.width;
      const height = image.height;
      const fileSize = image.fileSize;
      return resolve({
        imgWith: width,
        imgHeight: height,
        width: width,
        height: height,
        size: fileSize,
        url: path,
        imageUrl: path
      });
    };
    image.src = path;
  });
};

/**
 *
 * @param {File} file 文件 or Buffer
 * @param {originalSize} config 限制图片的原始大小，单位M
 */
async function uploadFile (file, config = {}) {
  return new Promise(async (resolve, reject) => {
    // 纠正file传错
    if (file.file) {
      file = file.file;
    }
    // 获取阿里ossToken
    const res = await api.getAliOssToken();
    const { accessKeyId, accessKeySecret, securityToken, bucket } = res.data || {};
    const options = {
      region: 'oss-cn-beijing',
      accessKeyId,
      accessKeySecret,
      stsToken: securityToken,
      bucket
    };

    let client = new OSS(options);
    try {
      // 压缩图片
      const compressOptions = {
        maxSizeMB: 3, // (default: Number.POSITIVE_INFINITY)
        maxWidthOrHeit: undefined, // compressedFile will scale down by ratio to a point that width or height is smaller than maxWidthOrHeight (default: undefined)
        useWebWorker: true, // optional, use multi-thread web worker, fallback to run in main-thread (default: true)
        maxIteration: 35 // optional, max number of iteration to compress the image (default: 10)
      };
      const originalSize = file.size; // 图片原始尺寸
      const originalSizeToM = (originalSize / (1024 * 1024)).toFixed(1); // 换算成M
      if (config.originalSize && originalSizeToM > config.originalSize) {
        return {
          error: true,
          message: '图片大小超过限制'
        };
      }
      const newFile = await imageCompression(file, compressOptions);
      const objName = 'octopus/' + uuid.v1();
      let result = await client.put(objName, newFile);
      const res = await getSize(result.url);
      resolve({
        ...result,
        ...res
      });
    } catch (e) {
      reject(e);
    }
  });
};

export {
  uploadFile
};
