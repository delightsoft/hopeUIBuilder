<template>
  <div class="upload">

    <q-uploader
      :multiple="!additionalFieldProps.oneFile"
      ref="upload"
      class="full-width"
      :auto-upload="true"
      :factory="uploadFile"
      @start="start"
      @uploaded="uploaded"
      @finish="finish"
      @failed="failed"
      @rejected="rejected"
      :max-file-size="additionalFieldProps.maxFileSize || 999999999"
    >

      <template v-slot:header="scope">
        <q-uploader-add-trigger></q-uploader-add-trigger>
        <div class="row no-wrap items-center">
          <q-btn
            unelevated
            outline
            class="col-12"
            :label="getTextStatus(scope.uploadProgressLabel)"
            :color="color"
            :icon="icon"
            @click="scope.pickFiles"
            :tabindex="fieldInitData.tabindex"
          />
        </div>
      </template>

      <template v-slot:list="scope">
        <div>{{scope}}</div>
      </template>

    </q-uploader>

    <div
      v-if="additionalFieldProps.maxFileSize"
      class="q-field__bottom"
    >
      {{ $t('maxFileSize', { maxFileSize: humanStorageSize(additionalFieldProps.maxFileSize) }) }}
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import i18n from './i18n'
import pathExists from '../../../../utils/pathExists'
import { decode } from 'jsonwebtoken'
import { format } from 'quasar'

const { humanStorageSize } = format;

const UPLOAD = 'primary';
const UPLOADING = 'secondary';
const UPLOADED = 'green';
const ERROR = 'red';
const TIMEOUT = 2000;

export default {
  name: "upload",
  components: {},
  i18n,

  props: {
    fieldInitData: Object,
    additionalFieldProps: Object,
    uiModel: Object,
    icon: String,
    options: Object,
  },

  data() {
    return {
      color: UPLOAD,
      error: false,
      isAccountant: false
    }
  },

  methods: {

    getTextStatus(percentLabel) {

      const percent = parseInt(percentLabel);

      if (this.error) return this.additionalFieldProps.oneFile ? this.$t('upload.errorFile') : this.$t('upload.errorFiles');
      if (!percent) return this.additionalFieldProps.uploadLabel || (this.additionalFieldProps.oneFile ? this.$t('upload.uploadFile') : this.$t('upload.uploadFiles'));
      if (percent < 100) return this.additionalFieldProps.oneFile ? this.$t('upload.uploadingFile', {percent}) : this.$t('upload.uploadingFiles', {percent});
      if (percent >= 100) return this.additionalFieldProps.oneFile ? this.$t('upload.uploadedFile') : this.$t('upload.uploadedFiles');

      return this.additionalFieldProps.uploadLabel || (this.additionalFieldProps.oneFile ? this.$t('upload.uploadFile') : this.$t('upload.uploadFiles'));

    },

    start() {
      this.color = UPLOADING;
    },

    uploaded(info) {

      this.color = UPLOADED;

      const fileInfo = JSON.parse(pathExists(info, 'xhr.response', '{}'));
      const keys = Object.keys(fileInfo);
      const res = decode(fileInfo[keys[0]]);
      const docId = res.fileId;
      const fileName = res.filename;
      const extension = res.extension;

      if (this.additionalFieldProps.oneFile) {
        this.uiModel[this.fieldInitData.fieldName].attachedFiles = [];
      }
      this.uiModel[this.fieldInitData.fieldName].attachedFiles.push({ token: fileInfo[keys[0]], docId, fileName, extension, isDeleted: false });
      if (this.options.useGtm && this.$gtm.dataLayer) {
        this.$gtm.formFieldChanged({
          category: this.options.category,
          name: this.options.formName,
          fieldName: this.fieldInitData.fieldName,
        })
      }
    },

    finish() {
      Vue.set(this.fieldInitData.model.$$touched, this.fieldInitData.fieldName, true);

      if (this.additionalFieldProps.oneFile) this.fieldInitData.model[this.fieldInitData.fieldName] = this.uiModel[this.fieldInitData.fieldName].attachedFiles[this.uiModel[this.fieldInitData.fieldName].attachedFiles.length - 1].token;
      else this.model[this.fieldInitData.fieldName] = this.fieldInitData.model[this.fieldInitData.fieldName].attachedFiles.map(files => files.token);

      setTimeout(() => {
        this.$refs.upload.reset();
        this.color = UPLOAD;
        this.error = false;
      }, TIMEOUT);

    },

    failed() {
      this.color = ERROR;
      this.error = true;
    },
    rejected(rejectedEntries) {
      rejectedEntries.forEach(({ failedPropValidation, file }) => {
        switch (failedPropValidation) {
          case 'max-file-size':
            this.$q.notify({
              type: 'negative',
              message: this.$app.$t('maxFileSize', { maxFileSize: humanStorageSize(this.additionalFieldProps.maxFileSize) }),
              timeout: 0,
              actions: [{icon: 'close', color: 'white'}],
            });
            break;
        }
      });
    },

    uploadFile(files) {
      let token = this.$auth.token;
      return {
        url: `${process.env.REST_API}/upload`,
        headers: [{
          name: 'authorization',
          value: `Bearer ${token}`
        }]
      }

    },

    humanStorageSize: humanStorageSize,
  }

}
</script>

<style lang="sass">
.upload
  .q-icon
    font-size: 24px

  & .q-uploader__list
    min-height: auto
    padding: inherit

  & .q-uploader__header
    background-color: initial
    color: rgba(0, 0, 0, 0.87)

  & .checkbox
    &__label
      padding-right: 8px

    &__hint
      font-size: 11px
      color: rgba(0, 0, 0, 0.54)
      padding: 0 13px
      line-height: 1
</style>
