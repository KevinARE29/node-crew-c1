import { registerAs } from '@nestjs/config';

export default registerAs('app', () => {
  return {
    extensionsWhiteList: {
      images: process.env.IMAGES_EXTENSION_WHITE_LIST,
      files: `${process.env.DOCS_EXTENSION_WHITE_LIST},${process.env.IMAGES_EXTENSION_WHITE_LIST}`,
    },
    allowedSize: process.env.FILE_SIZE_LIMIT_IN_BYTES,
  };
});
