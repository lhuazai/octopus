// https://github.com/Donaldcwl/browser-image-compression
// import imageCompression from 'browser-image-compression';
// import {isImage} from '@/utils';
import api from './index';
import OSS from 'ali-oss';
import { blink } from '@/plugins/fe_log';
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
    image.onerror = function () {
      reject({});
    };
    image.src = path;
  });
};

const fileExtension = (fileName) => {
  return fileName.substring(fileName.lastIndexOf('.') + 1);
};

/**
 *
 * @param {File} file 文件 or Buffer
 */
async function uploadFile (file) {
  blink('uploadFile', 'uploadImage');
  const res = await api.aliUpload();
  blink('uploadFileRes', JSON.stringify(res));
  const { data: { accessKeyId, accessKeySecret, securityToken, bucket, endpoint, cdnUrl } } = res;
  const options = {
    region: 'oss-cn-beijing',
    accessKeyId,
    accessKeySecret,
    stsToken: securityToken,
    bucket,
    cdnUrl,
    endpoint
  };
  let client = new OSS(options);
  try {
    const mime = fileExtension(file.name) || 'png';
    const name = Math.random().toString(36).slice(2) + new Date().getTime();
    const objName = '/homework/' + name + '.' + mime;
    blink('multipartUploadBefore', objName);
    const res = await client.multipartUpload(objName, file, {
      progress: async (p, checkpoint) => {
      },
      mime
    });
    // 阿里云上传埋点
    try {
      blink('multipartUploadAfter', JSON.stringify(res));
    } catch (err) {
      blink('multipartUploadAfter', res);
    }
    console.log('78', res);
    const cdnUrl = options.cdnUrl + objName;
    const result = await getSize(cdnUrl);
    blink('getSizeResult', JSON.stringify(result));
    return {
      cdnUrl,
      ...result
    };
  } catch (e) {
    blink('newOssCatch', e);
  }
}

export {
  uploadFile
};
