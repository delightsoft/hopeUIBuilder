<template>
  <div
    class="date-time-input"
  >
    <q-input
      :value="model"
      @change="onChange"
      :mask="mask"
      :hint="hint"
      :label="label"
      :error="error"
      :error-message="errorMessage"
      outlined
      fill-mask
      @keydown.enter="emulateKeyboardTabDown"
      :tabindex="tabindex"
    >
      <template
        v-if="$scopedSlots.after"
        v-slot:after
      >
        <slot name="after" />
      </template>

      <template
        v-if="mode === 'date' || mode === 'timestamp'"
        v-slot:prepend
      >
        <q-icon
          class="cursor-pointer"
          name="event"
        >
          <q-popup-proxy
            :ref="`${fieldKey}Date`"
            transition-show="scale"
            transition-hide="scale"
          >
            <q-date
              v-model="model"
              :mask="modeFormat"
              format24h
              :options="options"
              @input="() => {
                $refs[`${fieldKey}Date`].hide();
              }"
              :minimal="true"
            />
          </q-popup-proxy>
        </q-icon>
      </template>

      <template
        v-if="mode === 'time' || mode === 'timestamp'"
        v-slot:append
      >
        <q-icon
          class="cursor-pointer"
          name="access_time"
        >
          <q-popup-proxy
            :ref="`${fieldKey}Time`"
            transition-show="scale"
            transition-hide="scale"
          >
            <q-time
              v-model="model"
              :mask="modeFormat"
              format24h
              @input="() => {
                $refs[`${fieldKey}Time`].hide();
              }"
            />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
</template>

<script>
import moment from 'moment'
import emulateKeyboardTabDown from '../../../utils/emulateKeyboardTabDown'

export default {
  // TODO: насильно устанавливать временную зону
  props: [
    'fieldKey',
    'mode', // date, time, timestamp
    'value',
    'hint',
    'label',
    'error',
    'errorMessage',
    'options',
    'tabindex',
  ],
  data() {
    return {
      model: null,
      formats: {
        'date': {
          format: 'YYYY-MM-DD',
          localeFormatName: 'dateonly',
          htmlType: 'date',
        },
        'time': {
          format: 'HH:mm',
          localeFormatName: 'time',
          htmlType: 'time',
        },
        'timestamp': {
          format: 'YYYY-MM-DD HH:mm',
          localeFormatName: 'date',
          htmlType: 'datetime-local',
        },
      }
    }
  },
  computed: {
    valueFormat() {
      const mode = this.mode;
      let format = this.formats[mode].format;
      if (!format) throw new Error(`Unexpected mode ${mode}`);
      return format;
    },
    modeFormat() {
      const mode = this.mode;
      let format = this.$app.locale[this.formats[mode].localeFormatName].format;
      if (!format) throw new Error(`Unexpected mode ${mode}`);
      return format;
    },
    mask() {
      const mode = this.mode;
      let format = this.$app.locale[this.formats[mode].localeFormatName].mask;
      if (!format) throw new Error(`Unexpected mode ${mode}`);
      return format;
    },
    htmlType() {
      const mode = this.mode;
      let htmlType = this.formats[mode].htmlType;
      if (!htmlType) throw new Error(`Unexpected mode ${mode}`);
      return htmlType;
    },
  },
  methods: {
    emulateKeyboardTabDown: emulateKeyboardTabDown,
    onChange(event) {
      let value = event.srcElement.valueAsNumber || event.srcElement.value;
      if (value === '') value = null;
      this.model = value;
    },
    setModel(changeLang) {
      if (changeLang && this.value === undefined) {
        this.model = null;
      } else if (this.value === undefined) {
      } else if (this.value == null) {
        this.model = null;
      } else {
        this.model = moment(this.value, this.valueFormat).format(this.modeFormat);
      }
    }
  },
  watch: {
    'value'() {
      this.setModel();
    },
    'model'() {
      const date = moment(this.model, this.modeFormat);

      if (date.isValid() && !date._pf.unusedInput.length) {
        this.$emit('change', date.format(this.valueFormat));
      } else {
        this.$emit('change', null);
      }
    },
    '$app.locale'() {
      this.setModel(true);
    }
  }
}
</script>
