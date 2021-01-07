<template>
  <div class="list-files">

    <q-item-label style="flex:0;" header>{{
        additionalFieldProps.documentLabel || $t('download.documents')
      }}
    </q-item-label>

    <!-- FILES START -->
    <q-list bordered separator class="rounded-borders">
      <template
        v-for="file in listFiles"
      >

        <q-item
          :key="file.docId"
          v-if="!file.isDeleted"
          :class="getClassItem(file)"
        >

          <!-- File icon -->
          <q-item-section avatar>
            <q-icon
              :name="getFileProps(file.extension).icon"
              :color="getFileProps(file.extension).color"
              size="24px"
            ></q-icon>
          </q-item-section>

          <!-- Label -->
          <q-item-section>
            <!-- file name -->
            <q-item-label style="overflow: hidden">{{ `${file.fileName}` }}</q-item-label>
            <!-- downloading -->
            <q-item-label
              v-if="fileIsDownloading(file)"
              caption
              class="text-primary"
            >
              {{ $t('download.downloading') }}
            </q-item-label>
            <!-- error download -->
            <q-item-label
              v-if="fileIsErrorDownload(file)"
              caption
              class="text-primary"
            >
              {{ $t('download.errorDownload') }}
            </q-item-label>
            <!-- file downloaded -->
            <q-item-label
              v-if="fileIsDownloaded(file)"
              caption
              class="text-primary"
            >
              {{ $t('download.downloaded') }}
            </q-item-label>
            <!-- deleting -->
            <q-item-label
              v-if="fileIsDeleting(file)"
              caption
              class="text-primary"
            >
              {{ $t('download.deleting') }}
            </q-item-label>
            <!-- error delete -->
            <q-item-label
              v-if="fileIsErrorDelete(file)"
              caption
              class="text-primary"
            >
              {{ $t('download.errorDelete') }}
            </q-item-label>
            <!-- file deleted -->
            <q-item-label
              v-if="fileIsDeleted(file)"
              caption
              class="text-primary"
            >
              {{ $t('download.deleted') }}
            </q-item-label>

          </q-item-section>

          <!-- Action -->
          <q-item-section side>
            <div class="text-grey-8">
              <!-- download -->
              <q-btn size="12px" unelevated flat dense round icon="far fa-arrow-alt-circle-down"
                     @click="download(file)">
              </q-btn>
              <!-- delete -->
              <!--            <q-btn v-if="canDelete" size="12px" unelevated flat dense round icon="far fa-trash-alt"-->
              <!--                   @click="confirmDelete(file)"></q-btn>-->
            </div>
          </q-item-section>

        </q-item>
      </template>

    </q-list>
    <!-- FILES END -->

    <!-- Delete dialog start  -->
    <q-dialog v-model="showDelete" persistent>
      <q-card style="width: 700px; max-width: 70vw;">
        <q-card-section>
          <div
            class="text-h6"
          >
            {{ $t('download.dialog.title') }}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div v-html="$t('download.dialog.text', {file: `${deletingFile.fileName}`})">
          </div>
        </q-card-section>

        <q-card-actions align="left" class="q-pl-md q-pb-md">
          <div class="q-gutter-md">
            <q-btn
              unelevated
              :label="$t('download.dialog.confirm')"
              color="primary"
              @click="deleteFile(deletingFile)"
              v-close-popup
            ></q-btn>
            <q-btn
              unelevated
              :label="$t('download.dialog.cancel')"
              color="secondary"
              @click="clearDeletingFile"
              v-close-popup
            ></q-btn>
          </div>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- Delete dialog end  -->

  </div>
</template>

<script>
import i18n from './i18n'
import Vue from 'vue'

const TIMEOUT = 3000;

export default {
  name: "listFiles",
  i18n,

  props: {
    fieldInitData: Object,
    additionalFieldProps: Object,
    uiModel: Object,
  },

  data() {

    return {

      downloadFiles: [],
      downloadedFiles: [],
      errorFiles: [],

      showDelete: false,
      deletingFile: {},

      deleteFiles: [],
      deletedFiles: [],
      errorDeleteFiles: [],
    }
  },
  computed: {
    listFiles() {
      const uiModel = this.uiModel;
      const fieldName = this.fieldInitData.fieldName;
      return uiModel[fieldName].attachedFiles;
    },
  },
  methods: {
    async download(file) {
      window.top.location.href = `${process.env.REST_API}/download/${encodeURI(file.fileName)}?file=${file.token}`;
      Vue.set(this.fieldInitData.model.$$touched, this.fieldInitData.fieldName, true);
    },

    fileIsDownloading(file) {
      return this.downloadFiles.includes(file.docId);
    },

    fileIsErrorDownload(file) {
      return this.errorFiles.includes(file.docId);
    },

    fileIsDownloaded(file) {
      return this.downloadedFiles.includes(file.docId);
    },

    // Download END

    fileIsDeleting(file) {
      return this.deleteFiles.includes(file.docId);
    },

    fileIsErrorDelete(file) {
      return this.errorDeleteFiles.includes(file.docId);
    },

    fileIsDeleted(file) {
      return this.deletedFiles.includes(file.docId);
    },

    clearDeletingFile() {
      this.deletingFile = {};
    },

    getClassItem(file) {

      if (this.fileIsDownloading(file)) return 'bg-blue-2';
      if (this.fileIsErrorDownload(file)) return 'bg-red-2';
      if (this.fileIsDownloaded(file)) return 'bg-green-2';

      if (this.fileIsDeleting(file)) return 'bg-blue-2';
      if (this.fileIsErrorDelete(file)) return 'bg-red-2';
      if (this.fileIsDeleted(file)) return 'bg-green-2';

      return '';

    },

    getFileProps(extension = 'other') {

      extension = String(extension).toLowerCase().trim();

      const isDoc = ['doc', 'docx'].includes(extension);
      if (isDoc) return {icon: 'far fa-file-word', color: 'primary'};

      const isSheet = ['xls', 'xlsx'].includes(extension);
      if (isSheet) return {icon: 'far fa-file-excel', color: 'green'};

      const isPdf = ['pdf'].includes(extension);
      if (isPdf) return {icon: 'far fa-file-pdf', color: 'red'};

      const isTxt = ['txt', 'text'].includes(extension);
      if (isTxt) return {icon: 'far fa-file-alt', color: 'grey'};

      const isImg = ['img', 'jpg', 'jpeg', 'png', 'svg', 'tif', 'tiff'].includes(extension);
      if (isImg) return {icon: 'far fa-file-image', color: 'secondary'};

      const isArchive = ['zip', 'rar', '7z', '7zip'].includes(extension);
      if (isArchive) return {icon: 'far fa-file-archive', color: 'black'};

      const isVideo = ['avi', 'mp4', 'mkv', 'mov'].includes(extension);
      if (isVideo) return {icon: 'far fa-file-video', color: 'grey'};

      return {icon: 'far fa-file', color: 'grey'};

    },

    _wait(delay = 3000) {
      return new Promise(resolve => setTimeout(() => resolve(), delay));
    }

  }
}
</script>

<style lang="sass">

</style>
