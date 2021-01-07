import files from '../../components/files/files'
import Vue from 'vue'
import { decode } from 'jsonwebtoken'
import readOnlyAttachedFiles from '../../components/readonly/readOnlyAttachedFiles.vue'

export default function ({ fieldInitData, additionalFieldProps }) {
  if (!this.uiModel.hasOwnProperty(fieldInitData.fieldName)) {
    Vue.set(this.uiModel, fieldInitData.fieldName, {});

    if (fieldInitData.model.hasOwnProperty(fieldInitData.fieldName)) {
      let fileTokens = [];
      if (Array.isArray(fieldInitData.model[fieldInitData.fieldName])) {
        fileTokens = fieldInitData.model[fieldInitData.fieldName];
      } else if (fieldInitData.model[fieldInitData.fieldName]){
        fileTokens = [fieldInitData.model[fieldInitData.fieldName]];
      }

      Vue.set(this.uiModel[fieldInitData.fieldName], 'attachedFiles', fileTokens.map(fileToken => {
        const file = decode(fileToken);
        return {
          docId: file.fileId,
          fileName: `${file.filename}`,
          extension: file.extension,
          token: fileToken,
        }
      }));
    } else {
      Vue.set(this.uiModel[fieldInitData.fieldName], 'attachedFiles', []);
    }
  }

  return {
    name: 'attachedFiles',
    component: files,
    readonlyComponent: readOnlyAttachedFiles,
    props: {
      fieldInitData,
      additionalFieldProps,
      uiModel: this.uiModel,
      options: this._options,
    },

  }
}
